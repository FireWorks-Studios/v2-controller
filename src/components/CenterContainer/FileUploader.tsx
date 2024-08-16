import { ChangeEvent, FC, useRef } from 'react';
import { LuImport } from "react-icons/lu";

import "./FileUploaderStyles.css";

interface FileUploaderProps {
  handleFile: (_file: any) => void;
}

export const FileUploader: FC<FileUploaderProps> = ({ handleFile }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.[0];
    if (fileUploaded) {
      handleFile(fileUploaded);
    }
  };

  return (
    <>
      <button
        className="button-upload"
        onClick={handleClick}
      >
        <LuImport />
      </button>
      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
        accept='.sb3, .sgo'
      />
    </>
  );
};