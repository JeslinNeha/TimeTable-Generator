import {TbPencilPlus} from "react-icons/tb";
import { AiFillEye } from "react-icons/ai";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { TbSchool } from "react-icons/tb";
import { BiSolidUser } from "react-icons/bi";

const menuItems = [
  {
    id: "teacher's-details",
    title: "Teacher's details",
    type: "group",
    children: [
      {
        id: "add-teacher",
        title: "Add teacher",
        type: "item",
        url: "/add-teacher",
        icon: <TbPencilPlus color="white"/>,
      },
      {
        id: "view-teacher",
        title: "View teacher",
        type: "item",
        url: "/view-teacher",
        icon: <AiFillEye color="white"/>,
      },
    ],
  },
  {
    id: "time-table",
    title: "Time Table",
    type: "group",
    children: [
      {
        id: "create-time-table",
        title: "Create time table",
        type: "item",
        url: "/create-time-table",
        icon: <HiMiniPencilSquare color="white"/>,
      },
      {
        id: "class-time-table",
        title: "Class time table",
        type: "item",
        url: "/class-time-table",
        icon: <TbSchool color="white"/>,
      },
      {
        id: "teacher-time-table",
        title: "Teacher time table",
        type: "item",
        url: "/teacher-time-table",
        icon: <BiSolidUser color="white"/>,
      },
    ],
  },
];

export default menuItems;
