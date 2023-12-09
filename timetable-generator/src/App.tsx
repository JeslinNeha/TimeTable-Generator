import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import themes from "./themes/themes";
import routes from "./routes/index";
import { Navigate, Route, Routes } from "react-router-dom";
import ViewTeacher from "./view/Teacher details/ViewTeacher";
import TeacherForm from "./view/Teacher details/TeacherForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTimeTableForm from "./view/Time table/CreateTimeTableForm";
import SubjectForm from "./view/Time table/SubjectForm";
import "./App.css";
import TimeTableTemplate from "./components/TimeTableTemplate";
import ClassTimeTableForm from "./view/Time table/ClassTimeTableForm";
import TeacherTimeTableForm from "./view/Time table/TeacherTimeTableForm";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <CssBaseline />
        <Routes>
          <Route element={<ClassTimeTableForm />} path={routes.HOME_PAGE} />
          <Route element={<TeacherForm />} path={routes.ADD_TEACHER} />
          <Route element={<TeacherForm />} path={routes.EDIT_TEACHER} />
          <Route element={<ViewTeacher />} path={routes.VIEW_TEACHER} />
          <Route element={<CreateTimeTableForm />} path={routes.CREATE_TIMETABLE} />
          <Route element={<SubjectForm />} path={routes.ASSIGN_SUBJECTS} />
          <Route element={<ClassTimeTableForm />} path={routes.CLASS} />
          <Route element={<TimeTableTemplate />} path={routes.CLASS_TIMETABLE} />
          <Route element={<TeacherTimeTableForm />} path={routes.TEACHER} />
          <Route element={<TimeTableTemplate />} path={routes.TEACHER_TIMETABLE} />
          <Route element={<Navigate to={routes.HOME_PAGE}/>} path={routes.WILDCARD}/>
        </Routes>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
