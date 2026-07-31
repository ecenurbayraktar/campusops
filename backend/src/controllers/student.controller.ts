import type { Request, Response } from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../services/student.service.js";
import type { CreateStudentInput } from "../models/student.model.js";

export const getStudents = (
  _request: Request,
  response: Response
): void => {
  const students = getAllStudents();

  response.status(200).json(students);
};

export const addStudent = (
  request: Request,
  response: Response
): void => {
  const { name, email, department } =
    request.body as Partial<CreateStudentInput>;

  if (!name || !email || !department) {
    response.status(400).json({
      message: "Name, email and department are required."
    });

    return;
  }

  const newStudent = createStudent({
    name,
    email,
    department
  });

  response.status(201).json(newStudent);
};

export const getStudent = (
  request: Request,
  response: Response
): void => {
  const studentId = Number(request.params.id);

  if (Number.isNaN(studentId)) {
    response.status(400).json({
      message: "Student ID must be a number."
    });

    return;
  }

  const student = getStudentById(studentId);

  if (!student) {
    response.status(404).json({
      message: "Student not found."
    });

    return;
  }

  response.status(200).json(student);
};

export const editStudent = (
  request: Request,
  response: Response
): void => {
  const studentId = Number(request.params.id);

  if (Number.isNaN(studentId)) {
    response.status(400).json({
      message: "Student ID must be a number."
    });

    return;
  }

  const { name, email, department } =
    request.body as Partial<CreateStudentInput>;

  if (!name || !email || !department) {
    response.status(400).json({
      message: "Name, email and department are required."
    });

    return;
  }

  const updatedStudent = updateStudent(studentId, {
    name,
    email,
    department
  });

  if (!updatedStudent) {
    response.status(404).json({
      message: "Student not found."
    });

    return;
  }

  response.status(200).json(updatedStudent);
};

export const removeStudent = (
  request: Request,
  response: Response
): void => {
  const studentId = Number(request.params.id);

  if (Number.isNaN(studentId)) {
    response.status(400).json({
      message: "Student ID must be a number."
    });

    return;
  }

  const deleted = deleteStudent(studentId);

  if (!deleted) {
    response.status(404).json({
      message: "Student not found."
    });

    return;
  }

  response.status(200).json({
    message: "Student deleted successfully."
  });
};