import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/Main Layout";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import theme from "../../themes/themes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import makeStyles from "@mui/styles/makeStyles";
import { toast } from "react-toastify";
import { TEACHER_TIME_TABLE } from "../../constants/constants";
import { Teacher } from "../../types/teacher";

const TeacherTimeTableForm = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherData, setTeacherData] = useState<string>("");

  const navigate = useNavigate();
  const Axios = axios.create();
  const useStyles = makeStyles(() => ({
    menuItem: {
      "& .MuiMenuItem-root.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
      },
      "& .MuiMenuItem-root:hover": {
        backgroundColor: theme.palette.primary.main,
      },
      "& .MuiList-root": {
        maxHeight: "20rem",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
    typographyStyle: {
      width: "25%",
      [theme.breakpoints.between("xs", "md")]: {
        width: "35%",
        fontSize: "0.6rem",
      },
      [theme.breakpoints.between("md", "lg")]: {
        fontSize: "1rem",
      },
    },
    buttonStyle:
    { 
    [theme.breakpoints.between("xs", "md")]: {
      fontSize: "0.8rem",
    },
    },
    select:{
      "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input": {
        padding:"12px",
        [theme.breakpoints.between("xs", "md")]: {
          padding: "6px 6px",
          fontSize:"0.6rem"
        }
       },
    },
  }));

  useEffect(() => {
    fetchSubjectTeachers();
    // eslint-disable-next-line
  }, []);

  const classes = useStyles();
  const isButtonDisabled = !teacherData;

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

  const handleTeacherInputChange: any = (e: any) => {
    const { value } = e.target as any;

    setTeacherData(value);
  };

  const openTeacherTimeTable = async () => {
    try {
      const result = await Axios.get(
        `${process.env.REACT_APP_URL}/teacher-time-table/getTeacherTimeTable`,
        {
          params: {
            teacherName: teacherData,
          },
        }
      );
      (result.status===200 && result.data)
        ? navigate(`/teacher-time-table/${result.data.id}`, {
            state: { data: result.data, type: TEACHER_TIME_TABLE },
          })
        : toast.error("Teacher time table for the chosen teacher does not exist");
    } catch (error:any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <MainLayout>
      <div
        className={`column-flex align-center time-table-form`}
        style={{
          gap: "20px",
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <div className={`row-flex align-center width-100`}>
          <Typography className={classes.typographyStyle}>Select Teacher</Typography>
          <FormControl variant="outlined" fullWidth required>
            <Select
              name="teacherName"
              value={teacherData}
              onChange={handleTeacherInputChange}
              MenuProps={{
                PaperProps: { className: classes.menuItem },
              }}
              className={classes.select}
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.name}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div
          className={`row-flex align-center justify-center`}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              color: "white",
            }}
            disabled={isButtonDisabled}
            onClick={openTeacherTimeTable}
            className={classes.buttonStyle}
          >
            GET TIME TABLE
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherTimeTableForm;
