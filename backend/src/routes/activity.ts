import express, { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany();
    res.status(200).json(activities);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({
      where: { id: id },
    });
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/add", async (req: Request, res: Response) => {
  try {
    const { title, description, category, location, start_date,end_date,slots,occupied,organizer } = req.body;
    if (!title || !description || !category || !location || !start_date || !end_date || !slots || !occupied || !organizer) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newActivity = await prisma.activity.create({
      data: {
        title,  
        description,
        category,
        location,
        start_date,
        end_date,
        slots,
        occupied,
        organizer,
        },
    });
    res.status(201).json(newActivity);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
