import React, { useState } from "react";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import theme from "../../themes/themes";
import { Link, useLocation } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import routes from "../../routes";
import { NavItemProps } from "../../types/navMenu";

const NavItem: React.FC<NavItemProps> = ({ listItem }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const location = useLocation();

  const handleHover = () => {
    setHovered(!hovered);
  };

  const useStyles = makeStyles(() => ({
    listItem: {
      color: "white",
      borderRadius: "10px",
      [theme.breakpoints.between("xs", "sm")]: {
        padding:'5px',
        borderRadius:"5px",
      },
    "& .MuiTypography-root": {
      [theme.breakpoints.between("xs", "md")]: {
        fontSize: "0.6rem",
      },
      [theme.breakpoints.between("md", "lg")]: {
        fontSize: "0.8rem",
      },
      [theme.breakpoints.between("lg", "xl")]: {
        fontSize: "1rem",
      },
      [theme.breakpoints.up("xl")]: {
        fontSize: "1.4rem",
      },
    },   
    "& .MuiListItemIcon-root":
    {
     minWidth:"40px",
     [theme.breakpoints.between("sm", "md")]: {
      minWidth:"20px"
    },
     [theme.breakpoints.up("xl")]: {
       minWidth:"60px"
    },
    },
    "& .MuiListItemIcon-root svg":
    { 
      [theme.breakpoints.between("sm", "md")]: {
        width:"1rem",
        height:"1rem"
      },
      [theme.breakpoints.between("md", "lg")]: {
        width:"1.2rem",
        height:"1.2rem"
      },
      [theme.breakpoints.between("lg", "xl")]: {
        width:"1.4rem",
        height:"1.4rem"
      },
      [theme.breakpoints.up("xl")]: {
        width:"1.8rem",
        height:"1.8rem"
      },
    }
  }
  }));

  const classes = useStyles();

  return (
    <Link to={listItem.url} style={{ textDecoration: "none" }}>
      <div style={{ padding: "5px 0" }}>
        <ListItem
          key={listItem.id}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
          style={{
            backgroundColor:
              hovered || location.pathname === listItem.url || (location.pathname===routes.HOME_PAGE && listItem.title==="Class time table")
                ? theme.palette.primary.dark
                : "inherit",
          }}
          className={classes.listItem}
        >
          <ListItemIcon>{listItem.icon}</ListItemIcon>
          <ListItemText
          >
            {listItem.title}
          </ListItemText>
        </ListItem>
      </div>
    </Link>
  );
};

export default NavItem;
