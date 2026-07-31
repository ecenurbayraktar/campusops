export interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
}

export type CreateStudentInput = Omit<Student, "id">;