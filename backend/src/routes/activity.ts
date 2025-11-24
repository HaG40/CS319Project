import express, { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import multer from "multer";
import fs from "fs";

const prisma = new PrismaClient();
const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });

router.get("/", async (_req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/category/:category", async (req, res) => {
  const { category } = req.params;

  const activities = await prisma.activity.findMany({
    where: { category: { equals: category, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(activities);
});

router.post("/join/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, fullname, email, phone, line, age } = req.body;

  try {
    const existing = await prisma.activityRegistration.findUnique({
      where: { userId_activityId: { userId, activityId: id } },
    });
    if (existing)
      return res.status(400).json({ error: "คุณได้ลงทะเบียนกิจกรรมนี้ไปแล้ว" });

    const registration = await prisma.activityRegistration.create({
      data: {
        userId,
        activityId: id,
        participants: { fullname, email, phone, line, age },
      },
    });

    await prisma.activity.update({
      where: { id },
      data: { occupied: { increment: 1 } },
    });

    res.json({ message: "สมัครสำเร็จ", registration });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

router.post(
  "/add",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        category,
        location,
        start_date,
        end_date,
        slots,
        organizer,
      } = req.body;

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const newActivity = await prisma.activity.create({
        data: {
          title,
          description,
          category,
          location,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          slots: Number(slots),
          occupied: 0,
          organizer,
          image: imagePath,
        },
      });

      res.status(201).json(newActivity);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/registered/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const registrations = await prisma.activityRegistration.findMany({
      where: { userId: id },
      orderBy: { registeredAt: "desc" },
    });
    const activityIds = registrations.map((reg) => reg.activityId);
    const activities = await prisma.activity.findMany({
      where: { id: { in: activityIds } },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const keyword = req.query.q as string;
    let activities = null;

    if (!keyword || keyword.trim() === "") {
      activities = await prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      activities = await prisma.activity.findMany({
        where: {
          title: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/registered/cancel/:userId/:activityId",
  async (req: Request, res: Response) => {
    const { userId, activityId } = req.params;
    try {
      await prisma.activityRegistration.delete({
        where: {
          userId_activityId: { userId, activityId },
        },
      });
      await prisma.activity.update({
        where: { id: activityId },
        data: { occupied: { decrement: 1 } },
      });
      res.json({ message: "ยกเลิกกิจกรรมสำเร็จ" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/update/:id",
  upload.single("image"),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const existing = await prisma.activity.findUnique({ where: { id } });
      if (!existing)
        return res.status(404).json({ error: "Activity not found" });

      let newImagePath = existing.image;

      if (req.file) {
        newImagePath = `/uploads/${req.file.filename}`;

        if (existing.image) {
          const oldPath = "." + existing.image;
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const {
        title,
        description,
        category,
        location,
        start_date,
        end_date,
        slots,
        organizer,
      } = req.body;

      const updated = await prisma.activity.update({
        where: { id },
        data: {
          title,
          description,
          category,
          location,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          slots: Number(slots),
          organizer,
          image: newImagePath,
        },
      });

      res.json({ message: "Activity updated", activity: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) return res.status(404).json({ error: "Activity not found" });

    if (activity.image) {
      const imagePath = "." + activity.image;
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await prisma.activity.delete({ where: { id } });

    res.json({ message: "Activity deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/participants/:activityId", async (req: Request, res: Response) => {
  const { activityId } = req.params;

  if (!activityId) {
    return res.status(400).json({ error: "Missing activityId" });
  }

  try {
    const participants = await prisma.activityRegistration.findMany({
      where: { activityId },
      orderBy: { registeredAt: "desc" },
      include: {
        user: true,
      },
    });

    res.json(participants);
  } catch (err) {
    console.error("Error fetching participants:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
