import { useEffect, useState } from "react";
import generatePDF, { Resolution, Margin, Options } from "react-to-pdf";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Typography,
  Button,
} from "@mui/material";
import MainLayout from "../layout/Main Layout";
import { useLocation } from "react-router-dom";
import theme from "../themes/themes";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ClassData } from "../types/class";
import { toast } from "react-toastify";
import axios from "axios";
import {
  CLASS_TIME_TABLE,
  CREATE_TIME_TABLE,
  TEACHER_TIME_TABLE,
} from "../constants/constants";
import { ClassTimeTable } from "../types/class";
import { TeacherTimeTable } from "../types/teacher";
import { SubjectDetails,Subject } from "../types/subjectDetails";

const TimeTableTemplate = () => {

  const isMdToXl = useMediaQuery(theme.breakpoints.between("md", "xl"));
  const [timeTableType, setTimeTableType] = useState<string>("");
  const [classData, setClassData] = useState<ClassData>({
    id: "",
    class: "",
    section: "",
    subjects: [],
    classTeacherName: "",
  });
  const [classTimeTable, setClassTimeTable] = useState<ClassTimeTable>({
    id: "",
    name: "",
    class: "",
    section: "",
    classScheduleInfo: [],
  });
  const [teacherTimeTable, setTeacherTimeTable] = useState<TeacherTimeTable>({
    id: "",
    teacherName: "",
    teacherScheduleInfo: [],
  });
  const [assignedSchedule, setAssignedSchedule] = useState<
    Record<string, Record<string, Subject>>
  >({});
  const [teacherScheduleInfo, setTeacherScheduleInfo] = useState<
    TeacherTimeTable[]
  >([]);
  const [timeTableSubmitted, setTimeTableSubmitted] = useState<boolean>(false);
  const [isPdfButtonVisible, setIsPdfButtonVisible] = useState<boolean>(true);

  const location = useLocation();
  const Axios = axios.create();

  useEffect(() => {
    if (location.state) {
      const { data, type } = location.state;
      assignDataByTimeTableType(data, type);
      setTimeTableType(type);
    }
  }, [location.state]);

  useEffect(() => {
    if (classData.subjects.length && timeTableType === CREATE_TIME_TABLE) {
      fetchTeacherScheduleInfo();
    }
  }, [classData]);

  useEffect(() => {
    if (
      calculateScheduleLength(assignedSchedule) === 40 &&
      !timeTableSubmitted &&
      timeTableType === CREATE_TIME_TABLE
    ) {
      submitTimeTable(teacherScheduleInfo);
    }
  }, [assignedSchedule, timeTableSubmitted, teacherScheduleInfo]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [
    "1",
    "2",
    "Break",
    "3",
    "4",
    "Lunch",
    "5",
    "6",
    "Break",
    "7",
    "8",
  ];

  let sortAscending = true;

  const timeTableStyle = {
    "& .MuiTypography-root": {
      fontWeight: 800,
      [theme.breakpoints.between("xs", "md")]: {
        fontSize: "0.6rem",
      },
      [theme.breakpoints.between("md", "xl")]: {
        fontSize: "1rem",
      },
      [theme.breakpoints.up("xl")]: {
        fontSize: "1.2rem",
      },
    },
    "& .MuiButton-root": {
      color: "white",
      [theme.breakpoints.between("xs", "md")]: {
        fontSize: "0.65rem",
      },
    },
  };

  const tableStyle = {
    container: {
      border: `2px solid ${theme.palette.primary.dark}`,
      backgroundColor: theme.palette.secondary.main,
    },
    headings: {
      fontWeight: 800,
      textAlign: "center",
      border: `2px solid ${theme.palette.primary.dark}`,
      maxWidth: "50px",
      [theme.breakpoints.between("xs", "md")]: {
        maxWidth: "80px",
        fontSize: "0.48rem",
      },
      [theme.breakpoints.between("md", "xl")]: {
        fontSize: "0.58rem",
      },
      [theme.breakpoints.up("xl")]: {
        fontSize: "1.2rem",
      },
    },
    periods: {
      textAlign: "center",
      border: `2px solid ${theme.palette.primary.dark}`,
      fontWeight: 800,
      [theme.breakpoints.between("xs", "md")]: {
        fontSize: "0.48rem",
      },
      [theme.breakpoints.between("md", "xl")]: {
        fontSize: "0.58rem",
      },
      [theme.breakpoints.up("xl")]: {
        fontSize: "1.2rem",
      },
    },
    tableCell: {
      textAlign: "center",
      border: `2px solid ${theme.palette.primary.dark}`,
      fontWeight: 550,
      [theme.breakpoints.between("xs", "md")]: {
        fontSize: "0.48rem",
      },
      [theme.breakpoints.between("md", "xl")]: {
        fontSize: "0.58rem",
        maxWidth: "40px",
      },
      [theme.breakpoints.up("xl")]: {
        fontSize: "1.2rem",
        maxWidth: "50px",
      },
    },
    intervalContainer: {
      border: `2px solid ${theme.palette.primary.dark}`,
      padding: 0,
      fontSize: isMdToXl ? "1rem" : "0.8rem",
      fontWeight: 800,
      maxWidth:isMdToXl ? "15px" : "20px",
      letterSpacing: "2px",
      [theme.breakpoints.up("xl")]:{
         fontSize:"1.8rem"
      }
    },
    interval: {
      transform: "rotate(-90deg)",
    },
  };

  const generatePdf = async () => {
    setIsPdfButtonVisible(false);
    const targetElement = () => document.getElementById("time-table");

    const options: Options = {
      filename:
        timeTableType === CREATE_TIME_TABLE
          ? `${classData.class}-${classData.section}.pdf`
          : timeTableType === CLASS_TIME_TABLE
          ? `${classTimeTable.class}-${classTimeTable.section}.pdf`
          : `${teacherTimeTable.teacherName}.pdf`,
      method: "save",
      resolution: Resolution.HIGH,
      page: {
        margin: Margin.SMALL,
        format: "A4",
        orientation: "landscape",
      },
      canvas: {
        mimeType: "image/jpeg",
        qualityRatio: 1,
      },
    };
    if (targetElement) {
      setTimeout(async () => {
        await generatePDF(targetElement, options);
        setIsPdfButtonVisible(true);
      }, 10);
    }
  };

  const assignDataByTimeTableType = (data: any, type: string) => {
    if (type === CREATE_TIME_TABLE) {
      setClassData({
        id: data.id,
        class: data.class,
        section: data.section,
        subjects: data.subjects,
        classTeacherName: data.classTeacherName,
      });
    } else if (type === CLASS_TIME_TABLE) {
      setClassTimeTable({
        id: data.id,
        name: data.name,
        class: data.class,
        section: data.section,
        classScheduleInfo: data.classScheduleInfo,
      });
    } else if (type === TEACHER_TIME_TABLE) {
      setTeacherTimeTable({
        id: data.id,
        teacherName: data.teacherName,
        teacherScheduleInfo: data.teacherScheduleInfo,
      });
    }
  };

  const calculateScheduleLength = (
    schedule: Record<string, Record<string, Subject>>
  ): number => {
    const flattenedSchedule = Object.values(schedule).flatMap((day) =>
      Object.values(day).map((period) => period)
    );
    return flattenedSchedule.length;
  };

  const submitTimeTable = async (teacherSchedule: TeacherTimeTable[]) => {
    try {
      const classSchedule = Object.keys(assignedSchedule).map((day) => {
        return {
          day: day,
          periods: Object.keys(assignedSchedule[day]).map((period) => {
            return {
              period: period,
              teacherName: assignedSchedule[day][period].teacherName,
              subjectName: assignedSchedule[day][period].subjectName,
            };
          }),
        };
      });
      if (classSchedule.length && teacherSchedule) {
        const classScheduleResult = await Axios.post(
          `${process.env.REACT_APP_URL}/class-time-table/createClassTimeTableInfo`,
          {
            class: classData.class,
            section: classData.section,
            name: classData.classTeacherName,
            classScheduleInfo: classSchedule,
          }
        );
        const teacherScheduleResult = await Axios.patch(
          `${process.env.REACT_APP_URL}/teacher-time-table/updateTeacherTimeTableInfo`,
          teacherSchedule
        );
        if (classScheduleResult.status===200) {
          toast.success("Class time table is saved successfully");
          setTimeTableSubmitted(true);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const fetchTeacherScheduleInfo = async () => {
    try {
      const teacherNames = classData.subjects.flatMap(
        (subject) => subject.teacherName
      );
      const result = await Axios.get(
        `${process.env.REACT_APP_URL}/teacher-time-table/getTeachersTimeTableByName`,
        { params: { teacherName: teacherNames } }
      );
      if (result.status===200) {
        setTeacherScheduleInfo(result.data);
        assignSubjects(result.data);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const updateTeacherScheduleInfo = (
    subjectName: string,
    subjectTeacherName: string,
    day: string,
    period: string
  ) => {
    setTeacherScheduleInfo((prevScheduleInfo) => {
      const updatedScheduleInfo = prevScheduleInfo.map((teacher) => {
        if (teacher.teacherName === subjectTeacherName) {
          return {
            ...teacher,
            teacherScheduleInfo: teacher.teacherScheduleInfo.map((info) => {
              if (info.day === day) {
                return {
                  ...info,
                  periods: info.periods.map((p) => {
                    if (p.period === period) {
                      return {
                        ...p,
                        class:
                          subjectName !== "P.T"
                            ? `${classData.class}-${classData.section} ${subjectName}`
                            : `${classData.class}-A,B ${subjectName}`,
                      };
                    }
                    return p;
                  }),
                };
              }
              return info;
            }),
          };
        }
        return teacher;
      });
      return updatedScheduleInfo;
    });
  };

  const checkIsTeacherOccupied = (
    teacherSchedule: TeacherTimeTable,
    day: string,
    period: string
  ) => {
    if (teacherSchedule) {
      const scheduleInfo = teacherSchedule.teacherScheduleInfo.find(
        (info) => info.day === day
      );

      if (scheduleInfo) {
        const periodInfo = scheduleInfo.periods.find(
          (p) => p.period === period
        );
        if (periodInfo) {
          const isOcccupied = periodInfo.class !== "" ? true : false;
          return isOcccupied;
        }
      }
    }
  };

  const findClassTimeTable = (day: string, period: string): string => {
    const classPeriodSchedule = classTimeTable.classScheduleInfo
      .filter((schedule) => schedule.day === day)
      .flatMap((p) =>
        p.periods.filter((classPeriod) => classPeriod.period === period)
      );
    if (classPeriodSchedule.length) {
      return `${classPeriodSchedule[0].subjectName} (${classPeriodSchedule[0].teacherName})`;
    }
    return "";
  };

  const findTeacherTimeTable = (day: string, period: string): string => {
    const teacherPeriodSchedule = teacherTimeTable.teacherScheduleInfo
      .filter((schedule) => schedule.day === day)
      .flatMap((p) =>
        p.periods.filter((teacherPeriod) => teacherPeriod.period === period)
      );
    if (teacherPeriodSchedule.length) {
      return `${teacherPeriodSchedule[0].class}`;
    }
    return "";
  };

  const prioritizeSubjects = (
    priorityList: string[],
    sortKey: keyof SubjectDetails,
    subjects: SubjectDetails[],
    sortAscending: boolean
  ) => {
    let sortedSubjects = subjects.sort((a, b) => {
      const priorityA = priorityList.indexOf(a[sortKey] as string);
      const priorityB = priorityList.indexOf(b[sortKey] as string);
      // If both subjects are in the priority list, sort based on their order
      if (priorityA !== -1 && priorityB !== -1) {
        return sortAscending ? priorityA - priorityB : priorityB - priorityA;
      }
      // If only one subject is in the priority list, prioritize it
      if (priorityA !== -1) return -1;
      if (priorityB !== -1) return 1;
      // If neither subject is in the priority list, maintain their original order
      return 0;
    });
    return sortedSubjects;
  };

  const assignSubjects = (teacherSchedule: TeacherTimeTable[]) => {
    const newAssignedSchedule: Record<string, Record<string, Subject>> = {};
    const subjectPriority = [
      "P.T",
      "Computer",
      "Tamil",
      "English",
      "Maths",
      "Science",
      "Social Science",
      "Drawing",
    ];

    const classTeacherSubjects = classData.subjects.filter(
      (subject) => subject.teacherName === classData.classTeacherName
    );
    const constraintTeacherSubjects = classData.subjects.filter(
      (subject) =>
        subject.teacherName !== classData.classTeacherName &&
        (subject.subjectName === "P.T" ||
          subject.subjectName === "Computer" ||
          subject.subjectName === "Drawing")
    );
    const otherTeacherSubjects = classData.subjects.filter(
      (subject) =>
        subject.teacherName !== classData.classTeacherName &&
        subject.subjectName !== "P.T" &&
        subject.subjectName !== "Computer" &&
        subject.subjectName !== "Drawing"
    );

    const sortedClassTeacherSubjects = prioritizeSubjects(
      subjectPriority,
      "subjectName",
      classTeacherSubjects,
      sortAscending
    );
    const sortedConstraintTeacherSubjects = prioritizeSubjects(
      subjectPriority,
      "subjectName",
      constraintTeacherSubjects,
      sortAscending
    );
    const sortedOtherTeacherSubjects = prioritizeSubjects(
      subjectPriority,
      "subjectName",
      otherTeacherSubjects,
      sortAscending
    );

    days.forEach((day) => {
      newAssignedSchedule[day] = {};
    });

    handleTeacherSubjects(
      teacherSchedule,
      sortedClassTeacherSubjects,
      sortedConstraintTeacherSubjects,
      sortedOtherTeacherSubjects,
      newAssignedSchedule
    );
    setAssignedSchedule(newAssignedSchedule);
  };

  const handleTeacherSubjects = (
    teacherSchedule: TeacherTimeTable[],
    classTeacherSubjects: SubjectDetails[],
    constraintTeacherSubjects: SubjectDetails[],
    otherTeacherSubjects: SubjectDetails[],
    newAssignedSchedule: Record<string, Record<string, Subject>>
  ) => {
    for (let period of periods) {
      for (let day of days) {
        if (period !== "Break" && period !== "Lunch") {
          if (period === "1" && classTeacherSubjects.length) {
            const classTeacherScheduleInfo = teacherSchedule.find(
              (schedule) =>
                schedule.teacherName === classTeacherSubjects[0].teacherName
            );
            const isClassTeacherOccupied = checkIsTeacherOccupied(
              classTeacherScheduleInfo!,
              day,
              period
            );
            if (!isClassTeacherOccupied && !newAssignedSchedule[day][period]) {
              newAssignedSchedule[day][period] = {
                subjectName: classTeacherSubjects[0].subjectName,
                teacherName: classTeacherSubjects[0].teacherName,
              };
              updateTeacherScheduleInfo(
                classTeacherSubjects[0].subjectName,
                classTeacherSubjects[0].teacherName,
                day,
                period
              );
              classTeacherSubjects[0].lectureHours--;
              if (classTeacherSubjects[0].lectureHours === 0) {
                classTeacherSubjects.splice(0, 1);
              }
            }
          }

          if (constraintTeacherSubjects.length) {
            const constraintTeacherScheduleInfo = teacherSchedule.find(
              (schedule) =>
                schedule.teacherName ===
                constraintTeacherSubjects[0].teacherName
            );
            const isConstraintTeacherOccupied = checkIsTeacherOccupied(
              constraintTeacherScheduleInfo!,
              day,
              period
            );

            if (!newAssignedSchedule[day][period]) {
              if (
                (period === "2" || period === "3" || period === "4") &&
                (day === "Monday" ||
                  day === "Tuesday" ||
                  day === "Wednesday") &&
                constraintTeacherSubjects[0].subjectName === "P.T"
              ) {
                if (classData.class === "6") {
                  newAssignedSchedule[day][period] = {
                    subjectName: constraintTeacherSubjects[0].subjectName,
                    teacherName: constraintTeacherSubjects[0].teacherName,
                  };
                  updateTeacherScheduleInfo(
                    constraintTeacherSubjects[0].subjectName,
                    constraintTeacherSubjects[0].teacherName,
                    day,
                    period
                  );
                } else if (classData.class === "7") {
                  newAssignedSchedule[day]["3"] = {
                    subjectName: constraintTeacherSubjects[0].subjectName,
                    teacherName: constraintTeacherSubjects[0].teacherName,
                  };
                  updateTeacherScheduleInfo(
                    constraintTeacherSubjects[0].subjectName,
                    constraintTeacherSubjects[0].teacherName,
                    day,
                    "3"
                  );
                } else if (classData.class === "8") {
                  newAssignedSchedule[day]["4"] = {
                    subjectName: constraintTeacherSubjects[0].subjectName,
                    teacherName: constraintTeacherSubjects[0].teacherName,
                  };
                }
                updateTeacherScheduleInfo(
                  constraintTeacherSubjects[0].subjectName,
                  constraintTeacherSubjects[0].teacherName,
                  day,
                  "4"
                );
                constraintTeacherSubjects[0].lectureHours--;
                if (constraintTeacherSubjects[0].lectureHours === 0) {
                  constraintTeacherSubjects.splice(0, 1);
                }
              } else if (
                (period === "2" || period === "3" || period === "4") &&
                (day === "Monday" ||
                  day === "Tuesday" ||
                  day === "Wednesday" ||
                  day === "Thursady") &&
                !isConstraintTeacherOccupied &&
                constraintTeacherSubjects[0].subjectName === "Computer"
              ) {
                newAssignedSchedule[day][period] = {
                  subjectName: constraintTeacherSubjects[0].subjectName,
                  teacherName: constraintTeacherSubjects[0].teacherName,
                };
                updateTeacherScheduleInfo(
                  constraintTeacherSubjects[0].subjectName,
                  constraintTeacherSubjects[0].teacherName,
                  day,
                  period
                );
                constraintTeacherSubjects[0].lectureHours--;
                if (constraintTeacherSubjects[0].lectureHours === 0) {
                  constraintTeacherSubjects.splice(0, 1);
                }
              } else if (
                (period === "5" ||
                  period === "6" ||
                  period === "7" ||
                  period === "8") &&
                (day === "Wednesday" ||
                  day === "Thursday" ||
                  day === "Friday") &&
                constraintTeacherSubjects[0].subjectName === "Drawing" &&
                !isConstraintTeacherOccupied
              ) {
                newAssignedSchedule[day][period] = {
                  subjectName: constraintTeacherSubjects[0].subjectName,
                  teacherName: constraintTeacherSubjects[0].teacherName,
                };
                updateTeacherScheduleInfo(
                  constraintTeacherSubjects[0].subjectName,
                  constraintTeacherSubjects[0].teacherName,
                  day,
                  period
                );
                constraintTeacherSubjects[0].lectureHours--;
                if (constraintTeacherSubjects[0].lectureHours === 0) {
                  constraintTeacherSubjects.splice(0, 1);
                }
              }
            }
          }

          if (!newAssignedSchedule[day][period]) {
            let availableSubjects = [
              ...classTeacherSubjects,
              ...otherTeacherSubjects,
            ];
            const scheduleInfo = teacherSchedule.filter((schedule) =>
              availableSubjects.some(
                (subject) => subject.teacherName === schedule.teacherName
              )
            );
            const teacherSlotInfo = scheduleInfo.map((schedule) => {
              let unfilledSlotCount = 0;
              let slotCountRequired = 0;
              if (
                schedule.teacherScheduleInfo.flatMap((p) => {
                  p.periods.map((q) => {
                    if (!newAssignedSchedule[p.day][q.period] && !q.class) {
                      unfilledSlotCount++;
                    }
                  });
                })
              )
                slotCountRequired = availableSubjects.reduce((total, i) => {
                  if (i.teacherName === schedule.teacherName) {
                    return total + i.lectureHours;
                  }
                  return total;
                }, 0);

              return {
                teacherName: schedule.teacherName,
                unfilledSlotCount: unfilledSlotCount,
                slotCountRequired: slotCountRequired,
                remainingSlots: unfilledSlotCount - slotCountRequired,
              };
            });

            teacherSlotInfo.sort((a, b) => a.remainingSlots - b.remainingSlots);
            const teacherPriority = teacherSlotInfo.map(
              (slot) => slot.teacherName
            );
            availableSubjects = prioritizeSubjects(
              teacherPriority,
              "teacherName",
              availableSubjects,
              sortAscending
            );
            for (let subject of availableSubjects) {
              const info = scheduleInfo.find(
                (schedule) => schedule.teacherName === subject.teacherName
              );
              const isTeacherOccupied = checkIsTeacherOccupied(
                info!,
                day,
                period
              );
              if (!isTeacherOccupied && subject.lectureHours > 0) {
                newAssignedSchedule[day][period] = {
                  subjectName: subject.subjectName,
                  teacherName: subject.teacherName,
                };
                updateTeacherScheduleInfo(
                  subject.subjectName,
                  subject.teacherName,
                  day,
                  period
                );
                subject.lectureHours--;
              }
              if (newAssignedSchedule[day][period]) {
                break;
              }
            }
          }
        }
      }
    }
  };

  return (
    <MainLayout>
      <div
        className={`column-flex align-center justify-flex-start height-100`}
        style={{ gap: "20px", padding: "20px" }}
        id="time-table"
      >
        {" "}
        <div
          className={`row-flex width-100 justify-space-between`}
          style={{
            gap: "10%",
          }}
        >
          {(timeTableType === CREATE_TIME_TABLE ||
            timeTableType === CLASS_TIME_TABLE) && (
            <>
              <Typography sx={timeTableStyle["& .MuiTypography-root"]}>
                {timeTableType === CREATE_TIME_TABLE
                  ? `Class : ${classData.class}`
                  : `Class : ${classTimeTable.class}`}
              </Typography>
              <Typography sx={timeTableStyle["& .MuiTypography-root"]}>
                {timeTableType === CREATE_TIME_TABLE
                  ? `Section : ${classData.section}`
                  : `Section : ${classTimeTable.section}`}
              </Typography>
            </>
          )}
          <Typography sx={timeTableStyle["& .MuiTypography-root"]}>
            {timeTableType === CREATE_TIME_TABLE
              ? `Class Teacher : ${classData.classTeacherName}`
              : timeTableType === CLASS_TIME_TABLE
              ? `Class Teacher : ${classTimeTable.name}`
              : `Teacher Name : ${teacherTimeTable.teacherName}`}
          </Typography>
          <div className={`row-flex align-center justify-center pdf-button`}>
            {isPdfButtonVisible && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={timeTableStyle["& .MuiButton-root"]}
                onClick={generatePdf}
              >
                PDF
              </Button>
            )}
          </div>
        </div>
        <TableContainer
          component={Paper}
          className={"hide-scrollbar"}
          style={tableStyle.container}
        >
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={tableStyle.headings}>DAYS / PERIODS</TableCell>
                {periods.map((period, index) =>
                  period !== "Break" && period !== "Lunch" ? (
                    <TableCell sx={tableStyle.periods} key={period}>
                      {period}
                    </TableCell>
                  ) : (
                    <TableCell
                      rowSpan={6}
                      key={period + index}
                      sx={tableStyle.intervalContainer}
                    >
                      <p style={tableStyle.interval}>{period.toUpperCase()}</p>
                    </TableCell>
                  )
                )}
              </TableRow>
              {days.map((day) => (
                <TableRow key={day}>
                  <TableCell sx={tableStyle.headings}>
                    {" "}
                    {day.toUpperCase()}
                  </TableCell>
                  {periods.map(
                    (period) =>
                      period !== "Break" &&
                      period !== "Lunch" && (
                        <TableCell
                          sx={tableStyle.tableCell}
                          key={`${day}-${period}`}
                        >
                          {timeTableType === CREATE_TIME_TABLE
                            ? assignedSchedule[day]?.[period]?.subjectName &&
                              `${assignedSchedule[day][period].subjectName} (${assignedSchedule[day][period].teacherName})`
                            : timeTableType === CLASS_TIME_TABLE
                            ? findClassTimeTable(day, period)
                            : findTeacherTimeTable(day, period)}
                        </TableCell>
                      )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </MainLayout>
  );
};

export default TimeTableTemplate;
