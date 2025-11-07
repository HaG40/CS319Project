import express, { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { genSalt, hash, compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router: Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, fname, lname, email, password } = req.body;

    if (!username || !fname || !lname || !email || !password) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }

    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const user = await prisma.users.create({
      data: {
        username,
        fname,
        lname,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await prisma.users.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", token });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fname: true,
        lname: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
