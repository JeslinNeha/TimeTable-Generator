import { useState } from "react";
import MainLayout from "../../layout/Main Layout";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles/makeStyles";
import theme from "../../themes/themes";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  CLASSES,
  CREATE_TIME_TABLE,
  SECTIONS,
} from "../../constants/constants";
import { Class } from "../../types/class";

const CreateTimeTable = () => {
  const [classData, setClassData] = useState<Class>({
    selectedClass: "",
    section: "",
  });
  const navigate = useNavigate();
  const Axios = axios.create();

  const isButtonDisabled = !classData.selectedClass || !classData.section;

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
    buttonStyle: {
      [theme.breakpoints.between("xs", "md")]: {
        fontSize: "0.65rem",
      },
    },
    select: {
      "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input": {
        padding: "12px",
        [theme.breakpoints.between("xs", "md")]: {
          padding: "6px 6px",
          fontSize: "0.6rem",
        },
      },
    },
    menuItem: {
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

    setClassData((prevClassData) => ({
      ...prevClassData,
      [name]: value,
    }));
  };

  const checkTeacherData = async () => {
    try {
      const result = await Axios.get(
        `${process.env.REACT_APP_URL}/teacher/getTeacherInfo/`,
        {
          params: {
            class: classData.selectedClass,
            section: classData.section,
          },
        }
      );
      (result.status === 200 && result.data)
        ? navigate(`/assign-subjects`, { state: result.data })
        : toast.error("Add class teacher for the selected class and section");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const checkClassData = async () => {
    try {
      const result = await Axios.get(
        `${process.env.REACT_APP_URL}/class/getClassInfo/`,
        {
          params: {
            class: classData.selectedClass,
            section: classData.section,
          },
        }
      );
      result.status === 200 && result.data
        ? navigate(
            `/class-time-table/${classData.selectedClass}-${classData.section}`,
            { state: { data: result.data, type: CREATE_TIME_TABLE } }
          )
        : toast.error(
            "Subjects not assigned for the selected class and section"
          );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const openSubjectForm = async () => {
    try {
      const result = await Axios.get(
        `${process.env.REACT_APP_URL}/class/getClassInfo/`,
        {
          params: {
            class: classData.selectedClass,
            section: classData.section,
          },
        }
      );
      result.status === 200 && !result.data
        ? checkTeacherData()
        : toast.error(
            "Subjects has already been assigned for the selected class"
          );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const createTimeTable = async () => {
    try {
      const result = await Axios.get(
        `${process.env.REACT_APP_URL}/class-time-table/getClassTimeTable/`,
        {
          params: {
            class: classData.selectedClass,
            section: classData.section,
          },
        }
      );
      result.status === 200 && !result.data
        ? checkClassData()
        : toast.error("Class time table has already been created");
    } catch (error:any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <MainLayout>
      <div
        className={`column-flex align-center justify-space-between time-table-form `}
        style={{
          gap: "20px",
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <div className={`row-flex align-center width-100`}>
          <Typography className={classes.typographyStyle}>
            Select class
          </Typography>
          <FormControl variant="outlined" fullWidth required>
            <Select
              name="selectedClass"
              value={classData.selectedClass}
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
            Select section
          </Typography>
          <FormControl variant="outlined" fullWidth required>
            <Select
              name="section"
              value={classData.section}
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
        <div
          className={`row-flex align-center justify-center button-container`}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              color: "white",
            }}
            disabled={isButtonDisabled}
            onClick={openSubjectForm}
            className={classes.buttonStyle}
          >
            Assign Subjects
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              color: "white",
            }}
            disabled={isButtonDisabled}
            onClick={createTimeTable}
            className={classes.buttonStyle}
          >
            Create TimeTable
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateTimeTable;
