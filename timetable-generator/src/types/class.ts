import { SubjectDetails } from "./subjectDetails";

interface ClassData
{
    id : string;
    class : string;
    section :string;
    subjects :SubjectDetails[];
    classTeacherName:string;
}

interface Class {
  selectedClass: string;
  section: string;
}

interface ClassPeriod {
    period: string;
    teacherName: string;
    subjectName: string;
  }
  

interface ClassScheduleInfo {
    day: string;
    periods: ClassPeriod[];
  }
  

interface ClassTimeTable {
    id: string;
    name: string;
    class: string;
    section: string;
    classScheduleInfo: ClassScheduleInfo[];
  }

export type { Class,ClassData,ClassTimeTable};
  