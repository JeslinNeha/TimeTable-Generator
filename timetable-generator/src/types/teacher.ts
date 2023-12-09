import { SubjectDetails } from "./subjectDetails";
interface TeacherData {
    id: string;
    name: string;
    designation: string;
    subjects?: SubjectDetails[];
    isClassTeacher: boolean;
    selectedClass: string;
    section: string;
  }
interface Teacher {
    id: string;
    name: string;
  }
  
interface TeacherPeriod {
  period: string;
  class: string;
}

interface TeacherScheduleInfo {
  day: string;
  periods: TeacherPeriod[];
}

interface TeacherTimeTable {
  id: string;
  teacherName: string;
  teacherScheduleInfo: TeacherScheduleInfo[];
}

export type {Teacher,TeacherData,TeacherTimeTable};
