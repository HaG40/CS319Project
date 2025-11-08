import express, { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import multer from "multer";

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
    const activities = await prisma.activity.findMany();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ ดึงกิจกรรมตามหมวดหมู่
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;

  const activities = await prisma.activity.findMany({
    where: { category: { equals: category, mode: "insensitive" } }
  });

  res.status(200).json(activities);
});

// ✅ สมัครเข้าร่วมกิจกรรม
router.post("/join/:id", async (req: Request, res: Response) => {
  const { id } = req.params; // activityId
  const { userId, fullname, email, phone, age } = req.body;

  try {
    // ตรวจสอบว่าผู้ใช้ลงทะเบียนแล้วหรือยัง
    const existing = await prisma.activityRegistration.findUnique({
      where: { userId_activityId: { userId, activityId: id } }
    });
    if (existing) return res.status(400).json({ error: "คุณได้ลงทะเบียนกิจกรรมนี้ไปแล้ว" });

    const registration = await prisma.activityRegistration.create({
      data: {
        userId,
        activityId: id,
        participants: { fullname, email, phone, age },
      },
    });

    // เพิ่มจำนวน occupied
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

router.post("/add", upload.single("image"), async (req: Request, res: Response) => {
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

    // ✅ path ของไฟล์ที่อัปโหลด
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
});

router.get("/registered/:id", async (req: Request, res: Response) => {
  const { id } = req.params; 
  try {
    const registrations = await prisma.activityRegistration.findMany({
      where: { userId: id },
    });
    const data = registrations;
    const activityIds = registrations.map((reg) => reg.activityId);
    const activities = await prisma.activity.findMany({
      where: { id: { in: activityIds } },
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/registered/cancel/:userId/:activityId", async (req: Request, res: Response) => {
  const { userId, activityId } = req.params;
  try {
    await prisma.activityRegistration.delete({
      where: 
      { 
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
});

export default router;
