import prisma from "../config/prisma.client";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";

interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  async register(dto: RegisterDto) {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        name: dto.name,
        role: "user",
      },
      select: { id: true, email: true, role: true },
    });

    const token = signToken({ userId: user.id, role: user.role });
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, password: true, role: true },
    });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = signToken({ userId: user.id, role: user.role });
    return { user: { id: user.id, email: user.email, role: user.role }, token };
  }
}
