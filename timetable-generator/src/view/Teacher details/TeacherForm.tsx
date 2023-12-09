import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  ButtonGroup,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import MainLayout from "../../layout/Main Layout/index";
import theme from "../../themes/themes";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { TeacherData } from "../../types/teacher";
import { CLASSES, DESIGNATIONS, SECTIONS } from "../../constants/constants";

const TeacherForm = () => {
  const [teacherData, setTeacherData] = useState<TeacherData>({
    id: "",
    name: "",
    designation: "",
    isClassTeacher: false,
    selectedClass: "",
    section: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      const data = location.state;
      const timeoutId = setTimeout(() => {
        setTeacherData((prevData) => ({
          ...prevData,
          id: data.id,
          name: data.name,
          designation: data.designation,
          isClassTeacher: data.isClassTeacher,
          selectedClass: data.class,
          section: data.section,
        }));
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    if (!teacherData.isClassTeacher) {
      setTeacherData((prevData) => ({
        ...prevData,
        selectedClass: "",
        section: "",
      }));
    }
  }, [teacherData.isClassTeacher]);

  const Axios = axios.create();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const useStyles = makeStyles(() => ({
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
    textbox: {
      padding: "12px 10px",
      [theme.breakpoints.between("xs", "md")]: {
        padding: "10px 8px",
        fontSize: "0.6rem",
      },
    },
    select: {
      "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input": {
        padding: "12px",
        [theme.breakpoints.between("xs", "md")]: {
          padding: "6px",
          fontSize: "0.6rem",
        },
      },
    },
    buttonStyle: {
      [theme.breakpoints.between("xs", "md")]: {
        fontSize: "0.8rem",
      },
    },
    menuItem: {
      "& .MuiButtonBase-root.MuiMenuItem-root": {
        [theme.breakpoints.between("xs", "md")]: {
          fontSize: "0.8rem",
          minHeight: "8px",
        },
      },
      "& .MuiMenuItem-root.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
      },
      "& .MuiMenuItem-root:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  }));

  const classes = useStyles();

  const handleFormInputChange: any = (e: any) => {
    const { name, value } = e.target as any;

    setTeacherData((prevTeacherData) => ({
      ...prevTeacherData,
      [name]: value,
    }));
  };

  const setEmptyForm = () => {
    setTeacherData({
      id: "",
      name: "",
      designation: "",
      isClassTeacher: false,
      selectedClass: "",
      section: "",
    });
  };

  const goBackToHome = () => {
    setEmptyForm();
    navigate("/view-teacher");
  };

  const createFormData = async () => {
    try {
      const teacherResult = await Axios.post(
        `${process.env.REACT_APP_URL}/teacher/createTeacherInfo/`,
        {
          name: teacherData.name,
          designation: teacherData.designation,
          isClassTeacher: teacherData.isClassTeacher,
          class: teacherData.selectedClass,
          section: teacherData.section,
        }
      );
      const teacherTimeTableResult = await Axios.post(
        `${process.env.REACT_APP_URL}/teacher-time-table/createTeacherTimeTableInfo`,
        {
          teacherName: teacherData.name,
          teacherScheduleInfo: days.map((day) => {
            return {
              day: day,
              periods: periods.map((period) => {
                return {
                  period: period,
                  class: "",
                };
              }),
            };
          }),
        }
      );
      if (
        teacherResult.status === 201 &&
        teacherTimeTableResult.status === 201
      ) {
        goBackToHome();
        toast.success("Data saved successfully");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const updateFormData = async () => {
    try {
      const result = await Axios.patch(
        `${process.env.REACT_APP_URL}/teacher/updateTeacherInfo/`,
        {
          name: teacherData.name,
          designation: teacherData.designation,
          isClassTeacher: teacherData.isClassTeacher,
          class: teacherData.selectedClass,
          section: teacherData.section,
        },
        {
          params: {
            id: teacherData.id,
          },
        }
      );
      if (result.status === 200) {
        goBackToHome();
        toast.success("Data updated successfully");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    teacherData.id ? updateFormData() : createFormData();
  };

  return (
    <MainLayout>
      <form
        onSubmit={handleFormSubmit}
        className={`column-flex height-100 align-center teacher-form hide-scrollbar`}
        style={{
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <FormControl fullWidth className={`row-flex align-center`}>
          <Typography className={classes.typographyStyle}>
            Teacher's Name
          </Typography>
          <TextField
            fullWidth
            name="name"
            value={teacherData.name}
            onChange={handleFormInputChange}
            InputProps={{ classes: { input: classes.textbox } }}
            required
          />
        </FormControl>
        <div className={`row-flex align-center width-100`}>
          <Typography className={classes.typographyStyle}>
            Designation
          </Typography>
          <FormControl variant="outlined" fullWidth required>
            <Select
              name="designation"
              value={teacherData.designation}
              onChange={handleFormInputChange}
              className={classes.select}
              MenuProps={{ PaperProps: { className: classes.menuItem } }}
            >
              {DESIGNATIONS.map((designation) => (
                <MenuItem key={designation} value={designation}>
                  {designation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={`row-flex align-center width-100`}>
          <Typography className={classes.typographyStyle}>
            Class Teacher
          </Typography>
          <FormControl variant="outlined" fullWidth required>
            <Select
              name="isClassTeacher"
              value={teacherData.isClassTeacher}
              onChange={handleFormInputChange}
              className={classes.select}
              MenuProps={{ PaperProps: { className: classes.menuItem } }}
            >
              <MenuItem value={true as any}>Yes</MenuItem>
              <MenuItem value={false as any}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
        {teacherData.isClassTeacher && (
          <>
            <div className={`row-flex align-center width-100`}>
              <Typography className={classes.typographyStyle}>Class</Typography>
              <FormControl variant="outlined" fullWidth required>
                <Select
                  name="selectedClass"
                  value={teacherData.selectedClass}
                  onChange={handleFormInputChange}
                  className={classes.select}
                  MenuProps={{ PaperProps: { className: classes.menuItem } }}
                >
                  {CLASSES.map((classItem) => (
                    <MenuItem key={classItem} value={classItem}>
                      {classItem}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className={`row-flex align-center width-100`}>
              <Typography className={classes.typographyStyle}>
                Section
              </Typography>
              <FormControl variant="outlined" fullWidth required>
                <Select
                  name="section"
                  value={teacherData.section}
                  onChange={handleFormInputChange}
                  className={classes.select}
                  MenuProps={{ PaperProps: { className: classes.menuItem } }}
                >
                  {SECTIONS.map((section) => (
                    <MenuItem key={section} value={section}>
                      {section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </>
        )}
        <ButtonGroup className={`row-flex button-container`}>
          <>
            {teacherData.id && (
              <Button
                variant="contained"
                sx={{ color: "white", marginTop: "auto" }}
                onClick={goBackToHome}
                className={classes.buttonStyle}
              >
                Back
              </Button>
            )}
          </>
          <Button
            type="submit"
            variant="contained"
            sx={{ color: "white", marginTop: "auto" }}
            className={classes.buttonStyle}
          >
            {teacherData.id ? "Update" : "Submit"}
          </Button>
        </ButtonGroup>
      </form>
    </MainLayout>
  );
};

export default TeacherForm;
