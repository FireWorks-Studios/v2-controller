import { ChangeEvent, FC, useRef, useState } from 'react';
import { LuImport } from "react-icons/lu";
import InvalidFileSnackbar from '../Snackbar/InvalidFileSnackbar';
import "./FileUploaderStyles.css";

interface FileUploaderProps {
  handleFile: (_file: any) => void;
  bigBtn: boolean;
}

export const FileUploader: FC<FileUploaderProps> = ({ handleFile, bigBtn }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [invalidFileSnackbarIsOpen, setInvalidFileSnackbarIsOpen] = useState(false);

  const handleClick = () => {
    setInvalidFileSnackbarIsOpen(false);
    hiddenFileInput.current?.click();
    const titleSpan = document.getElementById("gameTitleSpan");
    if(titleSpan) titleSpan.innerHTML = "";
    const authorSpan = document.getElementById("gameAuthorSpan");
    if(authorSpan) authorSpan.innerHTML = "";
    const uploadBtn = document.getElementById("uploadButtonbigBtn");
    if (uploadBtn) uploadBtn.hidden = false;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.[0];
    if (fileUploaded) {
      const validExtensions = ['.sgo', '.sb3'];
      const fileExtension = fileUploaded.name.slice(((fileUploaded.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
  
      if (validExtensions.includes(`.${fileExtension}`)) {
        const uploadBtn = document.getElementById("uploadButtonbigBtn");
        if (uploadBtn) uploadBtn.hidden = true;
        handleFile(fileUploaded);
      } else {
        console.error('Invalid file type. Please upload a .sgo or .sb3 file.');
        handleInvalidFile();
      }
    }
  };

  const handleInvalidFile = () => {
    setInvalidFileSnackbarIsOpen(true);
  };

  return (
    <>
      <button
        id={`uploadButton${bigBtn ? 'bigBtn' : ''}`}
        className={`button-upload ${bigBtn ? 'bigBtn' : ''}`}
        onClick={handleClick}
      >
        {bigBtn? "Click to import projects!" : <LuImport />}
      </button>
      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
        accept='.sb3, .sgo, .zip, application/octet-stream, application/zip, application/x-zip, application/x-zip-compressed'
      />
      <InvalidFileSnackbar
        isOpen = {invalidFileSnackbarIsOpen}
        setIsOpen={setInvalidFileSnackbarIsOpen}
      />
    </>
  );
};