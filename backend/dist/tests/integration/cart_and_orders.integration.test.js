import request from "supertest";
import { describe, expect, beforeAll, beforeEach, afterAll, it, } from "@jest/globals";
import app from "../../src/app";
import prisma from "../../src/config/prisma.client";
import { generateTokens } from "../../src/utils/jwt";
describe("Cart and Orders Integration", () => {
    let adminToken;
    let userToken;
    let testSweet;
    const createTestUser = async (role) => {
        const user = await prisma.user.create({
            data: { email: `${role}@example.com`, password: "password123", role },
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
        if (prisma.orderItem)
            await prisma.orderItem.deleteMany();
        // @ts-ignore
        if (prisma.order)
            await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        testSweet = await prisma.sweet.create({
            data: {
                name: "Reserve Sweet",
                description: "Reserve",
                category: "Test",
                price: 100,
                quantity: 10,
            },
        });
    });
    afterAll(async () => {
        await prisma.transaction.deleteMany();
        // @ts-ignore
        if (prisma.orderItem)
            await prisma.orderItem.deleteMany();
        // @ts-ignore
        if (prisma.order)
            await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
    });
    it("should reserve stock when adding to cart", async () => {
        const res = await request(app)
            .post("/api/cart/reserve")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ productId: testSweet.id, quantity: 3 })
            .expect(200);
        expect(res.body.product.quantity).toBe(7);
    });
    it("should create an order after checkout", async () => {
        // Reserve first
        await request(app)
            .post("/api/cart/reserve")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ productId: testSweet.id, quantity: 2 })
            .expect(200);
        // Create order
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
        const orders = await request(app)
            .get("/api/orders")
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
        expect(Array.isArray(orders.body)).toBe(true);
        expect(orders.body.length).toBeGreaterThan(0);
    });
    it("should prevent reserve when insufficient stock", async () => {
        await request(app)
            .post("/api/cart/reserve")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ productId: testSweet.id, quantity: 20 })
            .expect(400);
    });
});
