// tests/integration/sweet.integration.test.ts
import request from "supertest";
import { describe, expect, beforeAll, beforeEach, afterAll, it, } from "@jest/globals";
import app from "../../src/app";
import path from "path";
import fs from "fs";
import prisma from "../../src/config/prisma.client";
import { generateTokens } from "../../src/utils/jwt";
describe("Sweet API Integration Tests", () => {
    let adminToken;
    let userToken;
    let testSweet;
    const createTestUser = async (role) => {
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
        // deleteOrders/orderItems if prisma has them
        // @ts-ignore (may not exist depending on schema state in environment)
        if (prisma.orderItem)
            await prisma.orderItem.deleteMany();
        // @ts-ignore
        if (prisma.order)
            await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        // Create a test sweet
        testSweet = await prisma.sweet.create({
            data: {
                name: "Test Sweet",
                description: "A tasty test sweet",
                category: "Test Category",
                price: 50.0,
                quantity: 100,
            },
        });
    });
    afterAll(async () => {
        // Clean up all test data
        await prisma.transaction.deleteMany();
        // @ts-ignore
        if (prisma.orderItem)
            await prisma.orderItem.deleteMany();
        // @ts-ignore
        if (prisma.order)
            await prisma.order.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        // Clean up uploaded files
        const uploadsDir = path.join(__dirname, "..", "..", "uploads");
        if (fs.existsSync(uploadsDir)) {
            fs.readdirSync(uploadsDir).forEach((file) => {
                const filePath = path.join(uploadsDir, file);
                if (file !== ".gitkeep") {
                    fs.unlinkSync(filePath);
                }
            });
        }
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
        // Create a test image file
        const testImagePath = path.join(__dirname, "..", "test-image.jpg");
        beforeAll(() => {
            // Create a dummy test image if it doesn't exist
            if (!fs.existsSync(testImagePath)) {
                fs.writeFileSync(testImagePath, "dummy image content");
            }
        });
        afterAll(() => {
            // Clean up test image
            if (fs.existsSync(testImagePath)) {
                fs.unlinkSync(testImagePath);
            }
        });
        it("should create a new sweet with image when admin is authenticated", async () => {
            const res = await request(app)
                .post("/api/sweets")
                .set("Authorization", `Bearer ${adminToken}`)
                .field("name", "New Sweet")
                .field("category", "Test Category")
                .field("price", "75.0")
                .field("quantity", "50")
                .attach("image", testImagePath)
                .expect(201);
            expect(res.body.name).toBe("New Sweet");
            expect(res.body.id).toBeDefined();
            expect(res.body.imageUrl).toBeDefined();
            expect(res.body.imageUrl).toMatch(/^\/uploads\/.+$/);
        });
        it("should create a new sweet without image when admin is authenticated", async () => {
            const res = await request(app)
                .post("/api/sweets")
                .set("Authorization", `Bearer ${adminToken}`)
                .field("name", "New Sweet No Image")
                .field("category", "Test Category")
                .field("price", "75.0")
                .field("quantity", "50")
                .expect(201);
            expect(res.body.name).toBe("New Sweet No Image");
            expect(res.body.id).toBeDefined();
            expect(res.body.imageUrl).toBeNull();
        });
        it("should not allow sweet creation for non-admin users", async () => {
            await request(app)
                .post("/api/sweets")
                .set("Authorization", `Bearer ${userToken}`)
                .field("name", "New Sweet")
                .field("category", "Test Category")
                .field("price", "75.0")
                .field("quantity", "50")
                .attach("image", testImagePath)
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
                        description: "Test sweet 1",
                        category: "Test Category",
                        price: 50.0,
                        quantity: 100,
                    },
                    {
                        name: "Another Sweet",
                        description: "Another sweet",
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
