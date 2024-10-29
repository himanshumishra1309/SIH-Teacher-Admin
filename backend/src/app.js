import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "60mb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

import teacherRouter from "./routes/teachers.routes.js";
import adminRouter from "./routes/admins.routes.js";
import studentRouter from "./routes/students.routes.js";
import seminarRouter from "./routes/seminars.routes.js";
import sttpRouter from "./routes/sttp.routes.js";
import eventRouter from "./routes/event-participated.routes.js";
import subjectRouter from "./routes/allocated-subjects.routes.js";
import expLectureRouter from "./routes/expert-lectures.routes.js";
import teacherProject from "./routes/projects.routes.js";
import studentGuide from "./routes/students-guided.routes.js";
import lecture from "./routes/lecture-feedbacks.routes.js";

app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/seminars", seminarRouter);
app.use("/api/v1/sttp", sttpRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/expertLectures", expLectureRouter);
app.use("/api/v1/projects", teacherProject);
app.use("/api/v1/student-guide", studentGuide);
app.use("/api/v1/lecture", lecture);

export { app };
