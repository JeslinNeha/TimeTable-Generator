import MainLayout from "../../layout/Main Layout/index";
import {
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BiSolidEdit } from "react-icons/bi";
import { HiMiniTrash } from "react-icons/hi2";
import theme from "../../themes/themes";
import { useNavigate } from "react-router-dom";
import { TeacherData } from "../../types/teacher";
import DeletePopupModal from "../../components/modals/DeletePopupModal";

const ViewTeacher = () => {
  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const Axios = axios.create();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const tableStyle = {
    container: {
      fontFamily: theme.typography.fontFamily,
      height: "80vh",
      border: `2px solid ${theme.palette.primary.dark}`,
    },
    tableHead: {
      position: "sticky",
      top: 0,
      zIndex: 200,
    },
    tableHeaderCell: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      textAlign: "center",
      padding: "10px 8px",
      fontSize: "1.2rem",
      [theme.breakpoints.between("xs", "sm")]: {
        padding: "6px 4px",
        fontSize: "0.6rem",
      },
    },
    tableCell: {
      padding: "10px 8px",
      fontSize: "1rem",
      textAlign: "center",
      [theme.breakpoints.between("xs", "sm")]: {
        padding: "8px 6px",
        fontSize: "0.6rem",
      },
    },
  };

  async function fetchData() {
    try {
      const result = await Axios.get(
        `${process.env.REACT_APP_URL}/teacher/getAllTeachers/`
      );
      if (result.status === 200 && result.data.length) {
        setTeacherData(result.data);
        setIsLoading(false);
      }
      if (!result.data.length) {
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  const editTeacher = (teacherId: string, teacherData: TeacherData) => {
    navigate(`/edit-teacher/${teacherId}`, { state: teacherData });
  };

  const deleteTeacher = async (teacherId: string) => {
    setOpenDeleteModal(false);
    try {
      const result = await Axios.delete(
        `${process.env.REACT_APP_URL}/teacher/deleteTeacherInfo/`,
        {
          params: {
            id: teacherId,
          },
        }
      );
      if (result.status === 200) {
        toast.success("Data deleted successfully");
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteModal = (id: string) => {
    setOpenDeleteModal(true);
    setDeleteId(id);
  };

  return (
    <MainLayout>
      <div className="teacher-table">
        <TableContainer
          component={Paper}
          style={tableStyle.container}
          className={"hide-scrollbar"}
        >
          <Table>
            <TableHead sx={tableStyle.tableHead}>
              <TableRow>
                <TableCell sx={tableStyle.tableHeaderCell}>S.No</TableCell>
                <Divider orientation="vertical" />
                <TableCell sx={tableStyle.tableHeaderCell}>
                  Teacher Name
                </TableCell>
                <Divider orientation="vertical" />
                <TableCell sx={tableStyle.tableHeaderCell}>Action</TableCell>
                <Divider orientation="vertical" />
              </TableRow>
            </TableHead>
            {isLoading ? (
              <TableBody sx={{ height: "74vh" }}>
                <TableCell colSpan={5}>
                  <Box className="flex-display align-center justify-center">
                    <CircularProgress
                      sx={{ color: theme.palette.secondary.dark }}
                      size={100}
                      thickness={5}
                    />
                  </Box>
                </TableCell>
              </TableBody>
            ) : (
              <TableBody>
                {!teacherData.length ? (
                  <TableCell colSpan={5} style={{ height: "72vh" }}>
                    <Typography
                      variant="h5"
                      className="flex-display align-center justify-center"
                      sx={{ fontWeight: 600,color:theme.palette.secondary.dark}}
                    >
                      NO DATA FOUND
                    </Typography>
                  </TableCell>
                ) : (
                  teacherData.map((teacher, index) => (
                    <TableRow
                      key={teacher.id}
                      style={
                        index % 2
                          ? { background: theme.palette.secondary.main }
                          : { background: "white" }
                      }
                    >
                      <TableCell sx={tableStyle.tableCell}>
                        {index + 1}
                      </TableCell>
                      <Divider orientation="vertical" />
                      <TableCell sx={tableStyle.tableCell}>
                        {teacher.name}
                      </TableCell>
                      <Divider orientation="vertical" />
                      <TableCell sx={tableStyle.tableCell}>
                        <div className={`row-flex justify-space-between`}>
                          <Button
                            variant="contained"
                            color="primary"
                            className="action-button"
                            sx={{
                              color: "white",
                            }}
                            onClick={() => editTeacher(teacher.id, teacher)}
                          >
                            <BiSolidEdit size={20} />
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            className="action-button"
                            sx={{
                              color: "white",
                            }}
                            onClick={() => handleDeleteModal(teacher.id)}
                          >
                            <HiMiniTrash size={20} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <DeletePopupModal
          open={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          handleDelete={deleteTeacher}
          id={deleteId}
        />
      </div>
    </MainLayout>
  );
};

export default ViewTeacher;
