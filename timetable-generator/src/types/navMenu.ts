interface NavGroupProps {
    id: string;
    title: string;
    type: string;
    children: {
      id: string;
      title: string;
      type: string;
      url: string;
      icon: JSX.Element;
    }[];
  }

  interface NavItemProps {
    listItem: {
      id: string;
      title: string;
      type: string;
      url: string;
      icon: JSX.Element;
    };
  }
export type{NavGroupProps,NavItemProps};  
  