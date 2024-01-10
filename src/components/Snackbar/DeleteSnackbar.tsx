import React, { SetStateAction, useCallback } from "react";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './DeleteSnackbar.css';

  export default function DeleteSnackbar({
    isOpen,
    noOfDeletedComponents,
    setIsOpen,
    undoDelete,
  }:{
    isOpen: boolean,
    noOfDeletedComponents: number,
    setIsOpen: React.Dispatch<SetStateAction<boolean>>
    undoDelete: () => void
  }) {

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setIsOpen(false);
    };

    const handleUndo = useCallback(()=>{
      undoDelete();
      setIsOpen(false);
    },[undoDelete])
  
    const action = (
      <React.Fragment>
        <Button 
          color="inherit" 
          size="small" 
          onClick={handleUndo}
          className="undo-button"
        >
          undo
        </Button>
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
        message={noOfDeletedComponents + (noOfDeletedComponents>1? " components deleted": " component deleted")}
        action={action}
        ContentProps={{
        sx:{
          borderRadius: "8px",
          color: "#959595",
          bgcolor: "#ffffff",
          fontWeight: "bold",
          border: "solid 2px #959595",
        }
       }}
      />
    );
  }