import express, { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import { genSalt, hash, compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router: Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

interface TokenPayload {
  id: string;
  email: string;
}

// Middleware ตรวจสอบ Token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalid or expired" });
  }
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, fname, lname, email, password } = req.body;

    if (!username || !fname || !lname || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await prisma.users.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const user = await prisma.users.create({
      data: {
        username,
        fname,
        lname,
        email,
        role: "user",
        password: hashedPassword,
      },
    });

    res.json({ message: "Registered", user });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.users.findFirst({ where: { username } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.json({
    message: "Login success",
    user: {
      id: user.id,
      username: user.username,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
    },
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        fname: true,
        lname: true,
        email: true,
        role: true,
        registrations: true,
      },
    });

    res.json({ users });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/edit/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, fname, lname, email, role } = req.body;

  try {
    const updated = await prisma.users.update({
      where: { id },
      data: { username, fname, lname, email, role },
    });

    res.json({ message: "Updated", user: updated });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.activityRegistration.deleteMany({
      where: { userId: id },
    });
    await prisma.users.delete({
      where: { id },
    });
    res.json({ message: "Deleted User" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
