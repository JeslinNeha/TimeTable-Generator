import { useState } from "react";
import theme from "../../themes/themes";
import Sidebar from "../Sidebar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const Index: React.FC<MainLayoutProps> = ({ children }) => {
  
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);

  const toggleSidebar=()=>
  {
    if (window.innerWidth <=1023) {
      setOpenSidebar(false);
    }
  }

  return (
    <div style={{ width: "100vw", height: "100vh"}} className="flex-display main-layout">
    <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}/>
      <div
        style={{
          borderStyle: `solid`,
          borderColor:` ${theme.palette.secondary.dark}`
        }}
        className="main-screen"
        onClick={toggleSidebar}
      >
        {children}
    </div>
    </div>
  );
};

export default Index;
