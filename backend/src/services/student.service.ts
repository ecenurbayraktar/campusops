import type {
  CreateStudentInput,
  Student
} from "../models/student.model.js";

const students: Student[] = [
  {
    id: 1,
    name: "Ece Nur Bayraktar",
    email: "ece@example.com",
    department: "Computer Engineering"
  }
];

export const getAllStudents = (): Student[] => {
  return students;
};

export const createStudent = (
  studentData: CreateStudentInput
): Student => {
  const newStudent: Student = {
    id: students.length + 1,
    ...studentData
  };

  students.push(newStudent);

  return newStudent;
};

export const getStudentById = (
  studentId: number
): Student | undefined => {
  return students.find((student) => student.id === studentId);
};

export const updateStudent = (
  studentId: number,
  studentData: CreateStudentInput
): Student | undefined => {
  const student = students.find(
    (student) => student.id === studentId
  );

  if (!student) {
    return undefined;
  }

  student.name = studentData.name;
  student.email = studentData.email;
  student.department = studentData.department;

  return student;
};

export const deleteStudent = (
  studentId: number
): boolean => {
  const index = students.findIndex(
    (student) => student.id === studentId
  );

  if (index === -1) {
    return false;
  }

  students.splice(index, 1);

  return true;
};