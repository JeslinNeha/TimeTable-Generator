import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React from "react";
import theme from "../../themes/themes";
import makeStyles from "@mui/styles/makeStyles";

interface DeleteModalProps
{
    open:boolean,
    setOpenDeleteModal:React.Dispatch<React.SetStateAction<boolean>>,
    handleDelete: (teacherId: string) => Promise<void>,
    id:string
}

const DeletePopupModal:React.FC<DeleteModalProps> = ({open,setOpenDeleteModal,handleDelete,id}) => {
  const useStyles = makeStyles(() => ({
    dialogStyle: {
      fontSize:"1.2rem",
      [theme.breakpoints.between("xs", "md")]: {
        fontSize: "1rem",
      },
    },
    buttonStyle:
    { 
    color:"white",
    [theme.breakpoints.between("xs", "md")]: {
      fontSize: "0.8rem",
    },
    },
  }));

  const classes=useStyles();

  return (
    <Dialog
      open={open}
      onClose={() => setOpenDeleteModal(false)}
      fullWidth
      sx={{
        opacity: 1,
      }}
    >
      <div
        style={{
          border: `5px solid  ${theme.palette.secondary.main}`,
        }}
      >
        <DialogContent>
          <DialogContentText className={classes.dialogStyle}
          >
            Are you sure you want to delete ?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            className={classes.buttonStyle}
            onClick={() => setOpenDeleteModal(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className={classes.buttonStyle}
            sx={{
              backgroundColor:theme.palette.warning.main,
              "&:hover": {
                backgroundColor:theme.palette.warning.dark,
              },
            }}
            onClick={() =>handleDelete(id)}
          >
            Confirm
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default DeletePopupModal;
