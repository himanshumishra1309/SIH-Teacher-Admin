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
import allocatedSubjectsRouter from "./routes/allocated-subjects.routes.js";
import seminarRouter from "./routes/seminars.routes.js";
import sttpRouter from "./routes/sttp.routes.js";
import eventRouter from "./routes/event-participated.routes.js";
import subjectRouter from "./routes/allocated-subjects.routes.js";
import expLectureRouter from "./routes/expert-lectures.routes.js";
import teacherProject from "./routes/projects.routes.js";
import studentGuide from "./routes/students-guided.routes.js";
import lecture from "./routes/lecture.routes.js";
import research from "./routes/research-papers.routes.js";
import domainPoints from "./routes/domainPoints.routes.js";
import bookRouter from "./routes/books.routes.js";
import book2Router from "./routes/books2.routes.js";

import journalRouter from "./routes/journal.routes.js";
import journal2Router from "./routes/journal2.routes.js";
import patentRouter from "./routes/patent.routes.js";
import patent2Router from "./routes/patents2.routes.js";

import conferenceRouter from "./routes/conference.routes.js";
import conference2Router from "./routes/conference.2.routes.js";

import pointRouter from "./routes/points.routes.js";
import point2Router from "./routes/points2.routes.js";

import postRouter from "./routes/extracontribution.routes.js";
import chapterRouter from "./routes/chapter.routes.js";
import chapter2Router from "./routes/chapters.2.routes.js";
import lecfeedback from "./routes/lecture-feedbacks.routes.js";
import publicationRouter from "./routes/publicationPoints.routes.js";
import weightage from './routes/weightage.routes.js'

app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/allocated-subjects", allocatedSubjectsRouter);
app.use("/api/v1/seminars", seminarRouter);
app.use("/api/v1/sttp", sttpRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/expertLectures", expLectureRouter);
app.use("/api/v1/projects", teacherProject);
app.use("/api/v1/student-guide", studentGuide);
app.use("/api/v1/lecture", lecture);
app.use("/api/v1/lec-feedback", lecfeedback);

app.use("/api/v1/research-paper", research);
app.use("/api/v1/domain-points", domainPoints);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/book2", book2Router);
app.use("/api/v1/chapter", chapterRouter);
app.use("/api/v1/chapter2", chapter2Router);

app.use("/api/v1/journals", journalRouter);
app.use("/api/v1/journals2", journal2Router);

app.use("/api/v1/patents", patentRouter);
app.use("/api/v1/patents2", patent2Router);
app.use("/api/v1/conferences", conferenceRouter);
app.use("/api/v1/conferences2", conference2Router);

app.use("/api/v1/points", pointRouter);
app.use("/api/v1/points2", point2Router);

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/publication", publicationRouter);

app.use("/api/v1/weightage", weightage);

export { app };
