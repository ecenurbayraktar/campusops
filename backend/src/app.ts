import express from "express";
import cors from "cors";
import studentRouter from "./routes/student.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "campusops-api"
  });
});

app.use("/students", studentRouter);

export default app;