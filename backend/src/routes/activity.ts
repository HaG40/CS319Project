import express, { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { genSalt, hash, compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router: Router = express.Router();

export default router;
