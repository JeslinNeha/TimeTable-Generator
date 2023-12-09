import { List } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NavGroup from "./NavGroup";
import menuItems from "./menuItems";
import { GiHamburgerMenu } from "react-icons/gi";

interface IndexProps{
  openSidebar:boolean;
  setOpenSidebar:React.Dispatch<React.SetStateAction<boolean>>
}

const Index:React.FC<IndexProps>= ({openSidebar,setOpenSidebar}) => {
  const theme = useTheme();

  return (
    <>
      <div className="nav-menu"
        style={{ backgroundColor: theme.palette.secondary.main,padding:"8px"}}
      >
        <GiHamburgerMenu
         className="hamburger-menu-icon"
          onClick={() => setOpenSidebar(!openSidebar)}
        />
      </div>
      <List
        component="nav"
        sx={{
          padding: "0 8px",
          backgroundColor: theme.palette.primary.main,
          fontFamily: theme.typography.fontFamily,
        }}
        className={!openSidebar ? "sidebar close-sidebar hide-scrollbar" : "open-sidebar hide-scrollbar height-100"}
      > 
      <div className="nav-menu">
      <GiHamburgerMenu
        className="hamburger-menu-icon"
        onClick={() => setOpenSidebar(!openSidebar)}
      /></div>
        {menuItems.map((item) => {
          if (item.type === "group") {
            return (
                <NavGroup key={item.id} {...item} />
            );
          }
          return null;
        })}
      </List>
    </>
  );
};

export default Index;
