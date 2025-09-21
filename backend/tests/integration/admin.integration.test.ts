import request from "supertest";
import {
  describe,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  it,
} from "@jest/globals";
import app from "../../src/app";
import prisma from "../../src/config/prisma.client";
import { generateTokens } from "../../src/utils/jwt";

describe("Admin Orders & Reports Integration", () => {
  let adminToken: string;
  let userToken: string;
  let testSweet: any;
  let createdOrderId: number | null = null;

  const createTestUser = async (role: string) => {
    const user = await prisma.user.create({
      data: {
        email: `${role}${Date.now()}@example.com`,
        password: "password123",
        role,
      },
    });
    return user;
  };

  beforeAll(async () => {
    const admin = await createTestUser("admin");
    const user = await createTestUser("user");
    adminToken = generateTokens({
      userId: admin.id,
      role: admin.role,
      email: admin.email,
      tokenVersion: 0,
    }).accessToken;
    userToken = generateTokens({
      userId: user.id,
      role: user.role,
      email: user.email,
      tokenVersion: 0,
    }).accessToken;
  });

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    // @ts-ignore
    if ((prisma as any).orderItem) await (prisma as any).orderItem.deleteMany();
    // @ts-ignore
    if ((prisma as any).order) await (prisma as any).order.deleteMany();
    await prisma.sweet.deleteMany();

    testSweet = await prisma.sweet.create({
      data: {
        name: `Admin Test Sweet ${Date.now()}`,
        description: "Admin Test",
        category: "Test",
        price: 250,
        quantity: 20,
      },
    });
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    // @ts-ignore
    if ((prisma as any).orderItem) await (prisma as any).orderItem.deleteMany();
    // @ts-ignore
    if ((prisma as any).order) await (prisma as any).order.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should create an order and allow admin to view stats & reports", async () => {
    // create order as user
    const orderRes = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: [
          { productId: testSweet.id, quantity: 2, price: testSweet.price },
        ],
      })
      .expect(201);

    expect(orderRes.body.id).toBeDefined();
    createdOrderId = orderRes.body.id;

    // admin stats
    const statsRes = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(statsRes.body.totalOrders).toBeGreaterThanOrEqual(1);
    expect(statsRes.body.totalUsers).toBeGreaterThanOrEqual(1);
    expect(statsRes.body.totalSales).toBeGreaterThanOrEqual(0);

    // top-products
    const topRes = await request(app)
      .get("/api/admin/reports/top-products?limit=5")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(topRes.body)).toBe(true);

    // sales by day
    const salesRes = await request(app)
      .get("/api/admin/reports/sales-by-day?days=7")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(salesRes.body)).toBe(true);
  });

  it("should allow admin to update order status", async () => {
    if (!createdOrderId) return;
    const upd = await request(app)
      .put(`/api/admin/orders/${createdOrderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Shipped" })
      .expect(200);

    expect(upd.body.status === "Shipped").toBeTruthy();
  });
});
