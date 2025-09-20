// tests/integration/sweet.integration.test.ts
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

describe("Sweet API Integration Tests", () => {
  let adminToken: string;
  let userToken: string;
  let testSweet: any;

  const createTestUser = async (role: string) => {
    const user = await prisma.user.create({
      data: {
        email: `${role}@example.com`,
        password: "password123",
        role,
      },
    });
    return user;
  };

  beforeAll(async () => {
    // Create test users and generate tokens
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
    // Clean up existing data
    await prisma.transaction.deleteMany();
    await prisma.sweet.deleteMany();

    // Create a test sweet
    testSweet = await prisma.sweet.create({
      data: {
        name: "Test Sweet",
        category: "Test Category",
        price: 50.0,
        quantity: 100,
      },
    });
  });

  afterAll(async () => {
    // Clean up all test data
    await prisma.transaction.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
  });

  describe("GET /sweets", () => {
    it("should return paginated list of sweets", async () => {
      const res = await request(app).get("/api/sweets").expect(200);

      expect(res.body.items).toBeDefined();
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.page).toBe(1);
      expect(Array.isArray(res.body.items)).toBe(true);
    });

    it("should handle pagination parameters", async () => {
      const res = await request(app)
        .get("/api/sweets?page=2&limit=5")
        .expect(200);

      expect(res.body.meta.page).toBe(2);
      expect(res.body.meta.limit).toBe(5);
    });
  });

  describe("POST /sweets", () => {
    const newSweet = {
      name: "New Sweet",
      category: "Test Category",
      price: 75.0,
      quantity: 50,
    };

    it("should create a new sweet when admin is authenticated", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newSweet)
        .expect(201);

      expect(res.body.name).toBe(newSweet.name);
      expect(res.body.id).toBeDefined();
    });

    it("should not allow sweet creation for non-admin users", async () => {
      await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newSweet)
        .expect(403);
    });
  });

  describe("GET /sweets/:id", () => {
    it("should return a sweet by id", async () => {
      const res = await request(app)
        .get(`/api/sweets/${testSweet.id}`)
        .expect(200);

      expect(res.body.id).toBe(testSweet.id);
      expect(res.body.name).toBe(testSweet.name);
    });

    it("should return 404 for non-existent sweet", async () => {
      await request(app).get("/api/sweets/999999").expect(404);
    });
  });

  describe("PUT /sweets/:id", () => {
    const updateData = {
      name: "Updated Sweet",
      price: 60.0,
    };

    it("should update a sweet when admin is authenticated", async () => {
      const res = await request(app)
        .put(`/api/sweets/${testSweet.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.name).toBe(updateData.name);
      expect(res.body.price).toBe(updateData.price);
    });

    it("should not allow sweet update for non-admin users", async () => {
      await request(app)
        .put(`/api/sweets/${testSweet.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);
    });
  });

  describe("DELETE /sweets/:id", () => {
    it("should delete a sweet when admin is authenticated", async () => {
      await request(app)
        .delete(`/api/sweets/${testSweet.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);

      const deleted = await prisma.sweet.findUnique({
        where: { id: testSweet.id },
      });
      expect(deleted).toBeNull();
    });

    it("should not allow sweet deletion for non-admin users", async () => {
      await request(app)
        .delete(`/api/sweets/${testSweet.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe("POST /sweets/:id/purchase", () => {
    it("should allow authenticated users to purchase sweets", async () => {
      const quantity = 5;
      const res = await request(app)
        .post(`/api/sweets/${testSweet.id}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity })
        .expect(200);

      expect(res.body.quantity).toBe(testSweet.quantity - quantity);
      expect(res.body.transactionId).toBeDefined();
    });

    it("should not allow purchase with insufficient quantity", async () => {
      const quantity = testSweet.quantity + 1;
      await request(app)
        .post(`/api/sweets/${testSweet.id}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity })
        .expect(400);
    });

    it("should not allow purchase without authentication", async () => {
      await request(app)
        .post(`/api/sweets/${testSweet.id}/purchase`)
        .send({ quantity: 5 })
        .expect(401);
    });
  });

  describe("POST /sweets/:id/restock", () => {
    it("should allow admin to restock sweets", async () => {
      const quantity = 50;
      const res = await request(app)
        .post(`/api/sweets/${testSweet.id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity })
        .expect(200);

      expect(res.body.quantity).toBe(testSweet.quantity + quantity);
      expect(res.body.transactionId).toBeDefined();
    });

    it("should not allow restock for non-admin users", async () => {
      await request(app)
        .post(`/api/sweets/${testSweet.id}/restock`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 50 })
        .expect(403);
    });
  });

  describe("GET /sweets/search", () => {
    beforeEach(async () => {
      // Create test sweets for search
      await prisma.sweet.createMany({
        data: [
          {
            name: "Test Sweet 1",
            category: "Test Category",
            price: 50.0,
            quantity: 100,
          },
          {
            name: "Another Sweet",
            category: "Other Category",
            price: 30.0,
            quantity: 50,
          },
        ],
      });
    });

    it("should search sweets by name", async () => {
      const res = await request(app)
        .get("/api/sweets/search?query=test")
        .expect(200);

      expect(res.body.items).toBeDefined();
      expect(res.body.items.length).toBeGreaterThan(0);
      expect(res.body.items[0].name.toLowerCase()).toContain("test");
    });

    it("should handle pagination in search results", async () => {
      const res = await request(app)
        .get("/api/sweets/search?query=test&page=1&limit=5")
        .expect(200);

      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(5);
    });

    it("should return empty results for non-matching query", async () => {
      const res = await request(app)
        .get("/api/sweets/search?query=nonexistent")
        .expect(200);

      expect(res.body.items).toHaveLength(0);
      expect(res.body.meta.total).toBe(0);
    });
  });
});
