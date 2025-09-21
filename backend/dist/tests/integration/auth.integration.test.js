import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/config/prisma.client";
describe("Auth API Integration", () => {
    beforeEach(async () => {
        await prisma.user.deleteMany(); // Clear test DB
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    it("POST /api/auth/register - success", async () => {
        const res = await request(app).post("/api/auth/register").send({
            email: "test@example.com",
            password: "pass123",
            name: "Test",
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body.user).toMatchObject({
            email: "test@example.com",
            role: "user",
        });
        // Check for refresh token cookie
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies).toEqual(expect.arrayContaining([expect.stringMatching(/^refreshToken=/)]));
        // Verify user was created with correct data
        const user = await prisma.user.findUnique({
            where: { email: "test@example.com" },
            select: { tokenVersion: true, refreshToken: true },
        });
        expect(user?.tokenVersion).toBe(0);
        expect(user?.refreshToken).toBeDefined();
    });
    it("POST /api/auth/register - duplicate email", async () => {
        await request(app).post("/api/auth/register").send({
            email: "test@example.com",
            password: "pass123",
        });
        const res = await request(app).post("/api/auth/register").send({
            email: "test@example.com",
            password: "pass123",
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });
    it("POST /api/auth/login - success", async () => {
        // Register first
        await request(app).post("/api/auth/register").send({
            email: "test@example.com",
            password: "pass123",
        });
        // Then login
        const res = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "pass123",
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body.user).toMatchObject({
            email: "test@example.com",
            role: "user",
        });
        // Check for refresh token cookie
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies).toEqual(expect.arrayContaining([expect.stringMatching(/^refreshToken=/)]));
        // Verify refresh token was stored in database
        const user = await prisma.user.findUnique({
            where: { email: "test@example.com" },
            select: { refreshToken: true },
        });
        expect(user?.refreshToken).toBeDefined();
    });
    it("POST /api/auth/login - invalid credentials", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "wrong",
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid credentials");
    });
    it("POST /api/auth/refresh - success", async () => {
        // Register first to get a refresh token
        const registerRes = await request(app).post("/api/auth/register").send({
            email: "test@example.com",
            password: "pass123",
        });
        // Get the refresh token from cookie
        const cookies = registerRes.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies).toEqual(expect.arrayContaining([expect.stringMatching(/^refreshToken=/)]));
        // Then try to refresh using the cookie
        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", cookies)
            .send();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(typeof res.body.accessToken).toBe("string");
    });
    it("POST /api/auth/refresh - invalid token", async () => {
        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", "refreshToken=invalid.token")
            .send();
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid refresh token");
    });
    it("POST /api/auth/revoke - success", async () => {
        // Register first
        const registerRes = await request(app).post("/api/auth/register").send({
            email: "test@example.com",
            password: "pass123",
        });
        // Get the user's initial token version
        const initialUser = await prisma.user.findUnique({
            where: { email: "test@example.com" },
            select: { id: true, tokenVersion: true },
        });
        // Revoke the tokens
        const res = await request(app)
            .post("/api/auth/revoke")
            .send({ userId: initialUser?.id });
        expect(res.status).toBe(200);
        // Verify token version was incremented and refresh token was cleared
        const updatedUser = await prisma.user.findUnique({
            where: { email: "test@example.com" },
            select: { tokenVersion: true, refreshToken: true },
        });
        expect(updatedUser?.tokenVersion).toBe((initialUser?.tokenVersion || 0) + 1);
        expect(updatedUser?.refreshToken).toBeNull();
        // Try to use old refresh token - should fail
        const refreshRes = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", registerRes.headers["set-cookie"])
            .send();
        expect(refreshRes.status).toBe(401);
        expect(refreshRes.body.message).toBe("Token has been revoked");
    });
});
