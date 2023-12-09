import MainLayout from "../../layout/Main Layout";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import theme from "../../themes/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CLASSES, CLASS_TIME_TABLE, SECTIONS } from "../../constants/constants";
import { Class } from "../../types/class";

const ClassTimeTableForm = () => {
  const [classData, setClassData] = useState<Class>({
    selectedClass: "",
    section: "",
  });
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
    buttonStyle: {
      [theme.breakpoints.between("xs", "md")]: {
        fontSize: "0.8rem",
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
  }));

  const classes = useStyles();
  const isButtonDisabled = !classData.selectedClass || !classData.section;

  const handleFormInputChange: any = (e: any) => {
    const { name, value } = e.target as any;

    setClassData((prevClassData) => ({
      ...prevClassData,
      [name]: value,
    }));
  };

  const openClassTimeTable = async () => {
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
      (result.status===200 && result.data)
        ? navigate(
            `/class-time-table/${classData.selectedClass}-${classData.section}`,
            {
              state: { data: result.data, type: CLASS_TIME_TABLE },
            }
          )
        : toast.error(
          "Class time table for the selected class has not been created yet"
        );
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
          <Typography className={classes.typographyStyle}>
            Select class
          </Typography>
          <FormControl variant="outlined" fullWidth required>
            <Select
              name="selectedClass"
              value={classData.selectedClass}
              onChange={handleFormInputChange}
              MenuProps={{ PaperProps: { className: classes.menuItem } }}
              className={classes.select}
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
              MenuProps={{ PaperProps: { className: classes.menuItem } }}
              className={classes.select}
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
          className={`row-flex align-center justify-center`}
          style={{ gap: "50px" }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              color: "white",
            }}
            disabled={isButtonDisabled}
            onClick={openClassTimeTable}
            className={classes.buttonStyle}
          >
            GET TIME TABLE
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClassTimeTableForm;
