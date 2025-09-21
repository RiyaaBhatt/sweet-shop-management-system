import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function createAdminUser() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  try {
    const admin = await prisma.user.upsert({
      where: { email: "admin@sweetshop.com" },
      update: {},
      create: {
        email: "admin@sweetshop.com",
        name: "Admin User",
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("Admin user created:", admin.email);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

async function copyImage(
  sourcePath: string,
  filename: string
): Promise<string> {
  const uploadsDir = join(__dirname, "..", "uploads");

  console.log("Copying image:");
  console.log("Source:", sourcePath);
  console.log("Destination folder:", uploadsDir);

  // Create uploads directory if it doesn't exist
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }

  const destinationPath = join(uploadsDir, filename);
  await fs.copyFile(sourcePath, destinationPath);
  return filename;
}

async function main() {
  // First, clean up existing data in dependency-safe order
  // Delete order items, orders, transactions before sweets to avoid FK constraint errors
  try {
    await prisma.orderItem.deleteMany();
  } catch (e) {
    // ignore if model/table doesn't exist yet
  }
  try {
    await prisma.order.deleteMany();
  } catch (e) {
    // ignore
  }
  try {
    await prisma.transaction.deleteMany();
  } catch (e) {
    // ignore
  }
  try {
    await prisma.sweet.deleteMany();
  } catch (e) {
    // ignore
  }

  // Define image paths - go up from prisma to backend, then to frontend
  const imageFiles = {
    traditional: "../../frontend/src/assets/traditional-sweets.jpg",
    sugarFree: "../../frontend/src/assets/sugar-free-sweets.jpg",
    dryFruits: "../../frontend/src/assets/dry-fruits.jpg",
  };

  // Copy images to uploads directory

  // Create seed data
  const sweets = [
    // Traditional Sweets
    {
      name: "Gulab Jamun",
      description:
        "Soft, melt-in-your-mouth dough balls soaked in aromatic sugar syrup.",
      price: 299.99,
      category: "Traditional Sweets",
      quantity: 50,
      isAvailable: true,

      featured: true,
    },
    {
      name: "Rasgulla",
      description: "Soft and spongy cottage cheese balls in sugar syrup.",
      price: 249.99,
      category: "Traditional Sweets",
      quantity: 40,
      isAvailable: true,
    },
    {
      name: "Kaju Katli",
      description: "Diamond-shaped cashew fudge with silver foil topping.",
      price: 599.99,
      category: "Traditional Sweets",
      quantity: 30,
      isAvailable: true,
      featured: true,
    },

    // Sugar-Free Sweets
    {
      name: "Sugar-Free Anjeer Roll",
      description: "Healthy fig rolls made with natural sweeteners.",
      price: 449.99,
      category: "Sugar-Free",
      quantity: 25,
      isAvailable: true,
      sugarFree: true,
    },
    {
      name: "Stevia Mysore Pak",
      description:
        "Traditional gram flour fudge made with stevia instead of sugar.",
      price: 349.99,
      category: "Sugar-Free",
      quantity: 20,
      isAvailable: true,
      sugarFree: true,
      featured: true,
    },
    {
      name: "Sugar-Free Mixed Sweets",
      description: "Assortment of sugar-free Indian sweets.",
      price: 499.99,
      category: "Sugar-Free",
      quantity: 15,
      isAvailable: true,
      sugarFree: true,
    },

    // Dry Fruits Sweets
    {
      name: "Dates & Nuts Roll",
      description: "Premium dates rolled with assorted nuts.",
      price: 699.99,
      category: "Dry Fruits",
      quantity: 35,
      isAvailable: true,
    },
    {
      name: "Dry Fruit Ladoo",
      description: "Healthy ladoos made with mixed dry fruits and nuts.",
      price: 799.99,
      category: "Dry Fruits",
      quantity: 30,
      isAvailable: true,
      featured: true,
    },
    {
      name: "Kaju Pista Roll",
      description: "Luxurious rolls made with cashews and pistachios.",
      price: 899.99,
      category: "Dry Fruits",
      quantity: 20,
      isAvailable: true,
    },
  ];

  // Insert seed data
  for (const sweet of sweets) {
    await prisma.sweet.create({
      data: sweet,
    });
  }

  // Create admin user
  await createAdminUser();

  // Create a test customer user for orders
  let customer;
  try {
    const hashed = await bcrypt.hash("test123", 10);
    customer = await prisma.user.upsert({
      where: { email: "customer@example.com" },
      update: {},
      create: {
        email: "customer@example.com",
        name: "Test Customer",
        password: hashed,
        role: "user",
      },
    });
    console.log("Test customer created:", customer.email);
  } catch (err) {
    console.error("Error creating test customer:", err);
  }

  // Create a sample order for the customer using the first two sweets
  try {
    const availableSweets = await prisma.sweet.findMany({ take: 2 });
    if (customer && availableSweets.length > 0) {
      const orderTotal = availableSweets.reduce(
        (sum, s) => sum + s.price * 2,
        0
      );
      const order = await prisma.order.create({
        data: {
          userId: customer.id,
          total: orderTotal,
          status: "pending",
          recipientName: "John Doe",
          deliveryAddress: "123 Test St, City",
          phoneNumber: "1234567890",
          notes: "Please deliver between 9-11am",
          items: {
            create: availableSweets.map((s) => ({
              productId: s.id,
              quantity: 2,
              price: s.price,
            })),
          },
        },
        include: { items: true },
      });

      console.log("Sample order created with id:", order.id);
    }
  } catch (err) {
    console.error("Error creating sample order:", err);
  }

  console.log("🍯 Seed data has been inserted successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding the database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
