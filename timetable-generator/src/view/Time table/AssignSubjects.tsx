import React, { useEffect, useState } from "react";
import { SubjectDetails } from "../../types/subjectDetails";
import { TeacherData } from "../../types/teacher";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles/makeStyles";
import theme from "../../themes/themes";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Teacher } from "../../types/teacher";

interface AssignSubjectsProps {
  teacherData: TeacherData;
}

const AssignSubjects: React.FC<AssignSubjectsProps> = ({ teacherData }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectDetails[]>([
    {
      subjectName: "Library",
      lectureHours: 1,
      teacherName: teacherData.name,
    },
    {
      subjectName: "Moral Values",
      lectureHours: 1,
      teacherName: teacherData.name,
    },
    {
      subjectName: "Co-curricular Activities",
      lectureHours: 2,
      teacherName: teacherData.name,
    },
    {
      subjectName: "Tamil",
      lectureHours: 0,
      teacherName: "",
    },
    {
      subjectName: "English",
      lectureHours: 0,
      teacherName: "",
    },
    {
      subjectName: "Maths",
      lectureHours: 0,
      teacherName: "",
    },
    {
      subjectName: "Science",
      lectureHours: 0,
      teacherName: "",
    },
    {
      subjectName: "Social Science",
      lectureHours: 0,
      teacherName: "",
    },
    {
      subjectName: "P.T",
      lectureHours: 2,
      teacherName: "",
    },
    {
      subjectName: "Computer",
      lectureHours: 1,
      teacherName: "",
    },
    {
      subjectName: "Drawing",
      lectureHours: 1,
      teacherName: "",
    },
  ]);

  const lectureHours = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const Axios = axios.create();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjectTeachers();
    // eslint-disable-next-line
  }, []);

  const useStyles = makeStyles(() => ({
    textbox: {
      "& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled":{
        padding:"12px 10px",
        [theme.breakpoints.between("xs", "md")]: {
          padding:"6px",
          fontSize:"0.5rem"
        },
      },
    },
    typographyStyle: {
      width: "45%",
      [theme.breakpoints.between("xs", "md")]: {
        width: "15%",
        fontSize: "0.5rem",
      },
      [theme.breakpoints.between("md", "lg")]: {
        fontSize: "1rem",
      },
    },
    menuItem: {
      "& .MuiButtonBase-root.MuiMenuItem-root":
      {
        [theme.breakpoints.between("xs", "md")]: {
          fontSize:"0.5rem",
          minHeight:"8px"
        }
      },
      "& .MuiMenuItem-root.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
      },
      "& .MuiMenuItem-root:hover": {
        backgroundColor: theme.palette.primary.main,
      },
      "& .MuiList-root": {
        maxHeight:"200px",
        overflow:"auto",
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
    },
    select:{
      "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input": {
        padding:"12px",
        [theme.breakpoints.between("xs", "md")]: {
          padding: "2px 6px",
          fontSize:"0.6rem"
        }
       },
    },   
    buttonStyle:
    { color:"white",
    [theme.breakpoints.between("xs", "md")]: {
      fontSize: "0.65rem",
    },
    },
  }));

  const classes = useStyles();

  const fetchSubjectTeachers = async () => {
    try {
      const result = await Axios.get(
        `${process.env.REACT_APP_URL}/teacher/getSubjectTeachers`
      );
      if (result.status===200 && result.data.length) {
        setTeachers(result.data);
      }
    } catch (error:any) {
      toast.error(error.response.data.message);
    }
  };

  const handleSubjectDataChange = (e: any, subjectName: string) => {
    const { name, value } = e.target as any;
    setSubjectData(
      subjectData.map((subject) => {
        if (subject.subjectName === subjectName) {
          return { ...subject, [name]: value };
        }
        return subject;
      })
    );
  };

  const submitSubjectDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const result = await Axios.post(
        `${process.env.REACT_APP_URL}/class/createClassInfo/`,
        {
          class: teacherData.selectedClass,
          section: teacherData.section,
          subjects: subjectData,
          classTeacherName:teacherData.name
        }
      );
      if (result.status===201) {
        toast.success("Data saved successfully");
        navigate("/create-time-table");
      }
    } catch (error:any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form
      className="column-flex justify-space-between"
      style={{
        height: "90%",
        gap: "10%",
      }}
      onSubmit={submitSubjectDetails}
    >
      <div className={`column-flex height-100 justify-space-between hide-scrollbar`} style={{gap:"5%"}}>
        {subjectData.map((subject) => (
          <div
            key={subject.subjectName}
            className={`flex-display subject justify-space-between width-100`}
          >
            <div
              className={`row-flex align-center subject-name`}
            >
              <Typography className={classes.typographyStyle}>Subject : </Typography>
              <TextField
                name="subjectName"
                fullWidth
                className={classes.textbox}
                value={subject.subjectName}
                focused={false}
                disabled
              />
            </div>
            <div
              className={`row-flex align-center teacher-name`}

            >
              <Typography  className={classes.typographyStyle}>Teacher : </Typography>
              <>
                {subject.subjectName === "Library" ||
                subject.subjectName === "Moral Values" ||
                subject.subjectName === "Co-curricular Activities" ||
                subject.subjectName === "Extra curricular Activities" ? (
                  <TextField
                    name="subjectName"
                    value={subject.teacherName}
                    fullWidth
                    className={classes.textbox}
                    focused={false}
                    disabled
                  />
                ) : (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    required
                  >
                    <Select
                      name="teacherName"
                      className={classes.select}
                      value={subject.teacherName}
                      onChange={(e) =>
                        handleSubjectDataChange(e, subject.subjectName)
                      }
                      MenuProps={{
                        PaperProps: { className: classes.menuItem},
                      }}
                    >
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher.id} value={teacher.name}>
                          {teacher.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </>
            </div>
            <div
              className={`row-flex align-center lecture-hours`}
            >
              <Typography className={classes.typographyStyle}>Hours : </Typography>
              <>
                {subject.subjectName === "Library" ||
                subject.subjectName === "Moral Values" ||
                subject.subjectName === "Co-curricular Activities" ||
                subject.subjectName === "Extra curricular Activities" ||
                subject.subjectName === "P.T" ||
                subject.subjectName === "Computer" ||
                subject.subjectName === "Drawing" ? (
                  <TextField
                    name="lectureHours"
                    className={classes.textbox}
                    fullWidth
                    value={subject.lectureHours}
                    focused={false}
                    disabled
                  />
                ) : (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    required
                  >
                    <Select
                      name="lectureHours"
                      className={classes.select}
                      value={
                        subject.lectureHours > 0 ? subject.lectureHours : ""
                      }
                      onChange={(e) =>
                        handleSubjectDataChange(e, subject.subjectName)
                      }
                      MenuProps={{
                        PaperProps: { className: classes.menuItem },
                      }}
                    >
                      {lectureHours.map((hour) => (
                        <MenuItem key={hour} value={hour}>
                          {hour}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </>
            </div>
          </div>
        ))}
      </div>
      <div className={`row-flex align-center justify-center `}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.buttonStyle}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AssignSubjects;
