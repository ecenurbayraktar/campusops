import { Router } from "express";
import {
  addStudent,
  getStudents,
  getStudent,
  editStudent,
  removeStudent
} from "../controllers/student.controller.js";

const studentRouter = Router();

studentRouter.get("/", getStudents);
studentRouter.get("/:id", getStudent);
studentRouter.post("/", addStudent);
studentRouter.put("/:id", editStudent);
studentRouter.delete("/:id", removeStudent);
export default studentRouter;