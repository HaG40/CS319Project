import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
import userRouter from "./routes/user";
import activityRouter from "./routes/activity";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/act", activityRouter);
app.use("/uploads", express.static("uploads"));


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
