interface SubjectDetails
{
    subjectName:string;
    lectureHours:number;
    teacherName:string;
}

interface Subject {
    subjectName: string;
    lectureHours?: number;
    teacherName: string;
  }

  export type {SubjectDetails,Subject};