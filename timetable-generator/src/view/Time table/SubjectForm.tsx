import { useEffect, useState } from "react";
import MainLayout from "../../layout/Main Layout";
import { useLocation } from "react-router-dom";
import theme from "../../themes/themes";
import { Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles/makeStyles";
import AssignSubjects from "./AssignSubjects";
import { TeacherData } from "../../types/teacher";

const SubjectForm = () => {
  const [teacherData, setTeacherData] = useState<TeacherData>({
    id: "",
    name: "",
    designation: "",
    subjects: [],
    isClassTeacher: false,
    selectedClass: "",
    section: "",
  });

  const location = useLocation();

  useEffect(() => {
    const teacherData=location.state;
    if (teacherData) {
      setTeacherData((prevData) => ({
        ...prevData,
        id: teacherData.id,
        name: teacherData.name,
        designation: teacherData.designation,
        isClassTeacher: teacherData.isClassTeacher,
        selectedClass: teacherData.class,
        section: teacherData.section,
      }));
    }
  }, []);

  const useStyles = makeStyles(() => ({
    typography: {
        fontWeight: 800,
        [theme.breakpoints.between("xs", "sm")]: {
          fontSize: "0.5rem",
        },
        [theme.breakpoints.between("sm", "md")]: {
          fontSize: "0.6rem",
        },
        [theme.breakpoints.between("md", "xl")]: {
          fontSize: "1rem",
        },
        [theme.breakpoints.up("xl")]: {
          fontSize: "1.2rem",
        },
      },
  }));

  const classes=useStyles();

  return (
    <MainLayout>
      {teacherData.id && (
        <div
          className={`column-flex height-100 justify-space-between time-table-form`}
        >
          <div
            className={`row-flex align-center justify-space-between`}
            style={{
              gap: "20%",
            }}
          >
            <Typography
             className={classes.typography}
            >
              Class : {teacherData.selectedClass}
            </Typography>
            <Typography
              className={classes.typography}
            >
              Section : {teacherData.section}
            </Typography>
            <Typography
             className={classes.typography}
            >
              Class Teacher : {teacherData.name}
            </Typography>
          </div>
          <AssignSubjects teacherData={teacherData} />
        </div>
      )}
    </MainLayout>
  );
};

export default SubjectForm;
