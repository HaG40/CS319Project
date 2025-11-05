"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../generated/prisma");
const bcrypt_ts_1 = require("bcrypt-ts");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new prisma_1.PrismaClient();
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
router.post("/register", async (req, res) => {
    try {
        const { username, fname, lname, email, password } = req.body;
        const existingUser = await prisma.users.findFirst({
            where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Username or Email already exists" });
        }
        const salt = await (0, bcrypt_ts_1.genSalt)();
        const hashedPassword = await (0, bcrypt_ts_1.hash)(password, salt);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.users.findFirst({
            where: { username },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = await (0, bcrypt_ts_1.compare)(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "3h",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000,
        });
        res.json({ message: "Login successful", token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.users.findFirst({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map