import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sweet Shop Management System API",
      version: "1.0.0",
      description: "API documentation for Sweet Shop Management System",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Sweet Shop API Support",
        url: "https://github.com/RiyaaBhatt/sweet-shop-management-system",
        email: "support@sweetshop.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:8000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Sweet: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            category: { type: "string" },
            price: { type: "number", format: "float" },
            quantity: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const specs = swaggerJsdoc(options);
