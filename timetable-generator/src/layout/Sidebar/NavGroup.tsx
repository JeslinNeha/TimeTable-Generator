import React, { useEffect, useState } from "react";
import { Collapse, Divider, List, ListItem, ListItemText } from "@mui/material";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import NavItem from "./NavItems";
import theme from "../../themes/themes";
import makeStyles from "@mui/styles/makeStyles";
import { NavGroupProps } from "../../types/navMenu";

const NavGroup: React.FC<NavGroupProps> = (groupItem) => {
  const [open, setOpen] = useState<boolean>(true);

  const toggleCollapse = () => {
    setOpen(!open);
  };

  const useStyles = makeStyles(() => ({
    listGroupItem: {
      backgroundColor: theme.palette.primary.dark,
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
      }
    },
  }));

  const classes = useStyles();

  return (
    <>
      <List key={groupItem.id}>
        <ListItem onClick={toggleCollapse} className={classes.listGroupItem}>
          <ListItemText primary={groupItem.title} />
          {open ? <IconChevronUp className="nav-icon"/> : <IconChevronDown  className="nav-icon"/>}
        </ListItem>
        <Collapse in={open}>
          <List disablePadding={false}>
            {groupItem.children.map((item) => (
              <NavItem key={item.id} listItem={item} />
            ))}
          </List>
        </Collapse>
      </List>
      <Divider
        sx={{
          mt: 0.25,
          mb: 1.25,
          borderWidth: 1,
          borderColor: theme.palette.primary.dark,
        }}
      />
    </>
  );
};

export default NavGroup;
