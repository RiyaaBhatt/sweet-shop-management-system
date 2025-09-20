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
  // First, clean up existing data
  await prisma.sweet.deleteMany();

  // Define image paths - go up from prisma to backend, then to frontend
  const imageFiles = {
    traditional: "../../frontend/src/assets/traditional-sweets.jpg",
    sugarFree: "../../frontend/src/assets/sugar-free-sweets.jpg",
    dryFruits: "../../frontend/src/assets/dry-fruits.jpg",
  };

  // Copy images to uploads directory
  const traditionalImage = await copyImage(
    join(__dirname, imageFiles.traditional),
    "traditional-sweets.jpg"
  );
  const sugarFreeImage = await copyImage(
    join(__dirname, imageFiles.sugarFree),
    "sugar-free-sweets.jpg"
  );
  const dryFruitsImage = await copyImage(
    join(__dirname, imageFiles.dryFruits),
    "dry-fruits.jpg"
  );

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
      image: traditionalImage,
      featured: true,
    },
    {
      name: "Rasgulla",
      description: "Soft and spongy cottage cheese balls in sugar syrup.",
      price: 249.99,
      category: "Traditional Sweets",
      quantity: 40,
      isAvailable: true,
      image: traditionalImage,
    },
    {
      name: "Kaju Katli",
      description: "Diamond-shaped cashew fudge with silver foil topping.",
      price: 599.99,
      category: "Traditional Sweets",
      quantity: 30,
      isAvailable: true,
      image: traditionalImage,
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
      image: sugarFreeImage,
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
      image: sugarFreeImage,
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
      image: sugarFreeImage,
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
      image: dryFruitsImage,
    },
    {
      name: "Dry Fruit Ladoo",
      description: "Healthy ladoos made with mixed dry fruits and nuts.",
      price: 799.99,
      category: "Dry Fruits",
      quantity: 30,
      isAvailable: true,
      image: dryFruitsImage,
      featured: true,
    },
    {
      name: "Kaju Pista Roll",
      description: "Luxurious rolls made with cashews and pistachios.",
      price: 899.99,
      category: "Dry Fruits",
      quantity: 20,
      isAvailable: true,
      image: dryFruitsImage,
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
