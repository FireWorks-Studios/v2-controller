import React, { SetStateAction } from "react";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './InvalidFileSnackbar.css';

  export default function InvalidFileSnackbar({
    isOpen,
    setIsOpen,
  }:{
    isOpen: boolean,
    setIsOpen: React.Dispatch<SetStateAction<boolean>>
  }) {

    const handleClose = () => {
      setIsOpen(false);
    };
  
    const action = (
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );
  
    return (
      <Snackbar
        color="secondary"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message={("Please pick a file with a .sgo or .sb3 extension!")}
        action={action}
        ContentProps={{
        sx:{
          borderRadius: "8px",
          color: "#ff3131",
          bgcolor: "#ffc9c9",
          fontWeight: "bold",
          border: "solid 2px #ff3131",
        }
       }}
      />
    );
  }