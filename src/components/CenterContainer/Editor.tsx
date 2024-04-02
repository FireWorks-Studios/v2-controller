import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useStyles } from "./EditorStyles";
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Button as MuiButton,
} from "@mui/material";
import { BsFillNutFill, BsToggleOff, BsToggleOn } from "react-icons/bs";
import { MdLightbulb } from "react-icons/md";
import { DummyButton } from "../Button/DummyButton";
import { PiExportBold, PiLightningBold, PiMouseBold } from "react-icons/pi";
import { FaGamepad } from "react-icons/fa";
import { LuImport } from "react-icons/lu";
import { LuAlignVerticalSpaceAround } from "react-icons/lu";
import { MdOutlineGamepad } from "react-icons/md";
import { MdFullscreen } from "react-icons/md";
import "./Editor.css";
import GamepadMapping from "./GamepadMapping.tsx";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.tabPanel}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface Props {
  toggleEditing(): void;
  unitWidth: number;
  validDropCancelTransition: boolean;
  controllerAdvancedConfig: string[];
  setControllerAdvancedConfig: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Editor({
  toggleEditing,
  unitWidth,
  validDropCancelTransition,
  controllerAdvancedConfig,
  setControllerAdvancedConfig,
}: Props) {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.tabsContainer}>
      <Box
        className={classes.tabsWrapper}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Tabs
          sx={{ height: "34px", minHeight: "34px" }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          TabIndicatorProps={{
            style: { backgroundColor: "#f50057" },
            className: classes.tabIndicator,
          }}
        >
          <Tab
            disableRipple
            label="Components"
            icon={<BsFillNutFill />}
            iconPosition="start"
            {...a11yProps(0)}
            className={classes.tab}
            sx={{
              minHeight: "34px",
              height: "34px",
              padding: "9px",
              textTransform: "none",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              "&.Mui-selected": {
                backgroundColor: "#638dff",
                color: "#ffffff",
              },
            }}
          />
          <Tab
            disableRipple
            label="Advanced"
            {...a11yProps(1)}
            icon={<MdLightbulb />}
            iconPosition="start"
            className={classes.tab}
            sx={{
              minHeight: "34px",
              height: "34px",
              padding: "9px",
              textTransform: "none",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              "&.Mui-selected": {
                backgroundColor: "#638dff",
                color: "#ffffff",
              },
            }}
          />
          <Tab
            disableRipple
            label="Handheld"
            {...a11yProps(2)}
            icon={<FaGamepad />}
            iconPosition="start"
            className={classes.tab}
            sx={{
              minHeight: "34px",
              height: "34px",
              padding: "9px",
              textTransform: "none",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              "&.Mui-selected": {
                backgroundColor: "#638dff",
                color: "#ffffff",
              },
            }}
          />
        </Tabs>
        <MuiButton
          size="small"
          variant="contained"
          sx={{
            fontSize: "14px",
            minHeight: "34px",
            height: "34px",
            padding: "9px",
            textTransform: "none",
            backgroundColor: "#ffab19",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#ffab19", boxShadow: "none" },
          }}
          onClick={toggleEditing}
        >
          Confirm
        </MuiButton>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DummyButton
          validDropCancelTransition={validDropCancelTransition}
          unitWidth={unitWidth}
          component={{
            type: "button",
            styling: [],
            mapping: "ArrowUp",
            container: "left",
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            color: "#006aff",
            pressed: false,
          }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MenuItem
          dense={true}
          onClick={() => {
            !controllerAdvancedConfig.includes("mouseAndKeyboardMode")
              ? setControllerAdvancedConfig([
                  ...controllerAdvancedConfig,
                  "mouseAndKeyboardMode",
                ])
              : setControllerAdvancedConfig(
                  controllerAdvancedConfig.filter(
                    (e) => e !== "mouseAndKeyboardMode"
                  )
                );
          }}
        >
          <ListItemIcon>
            <PiMouseBold />
          </ListItemIcon>
          <ListItemText>Mouse and Keyboard Mode</ListItemText>
          <IconButton edge="end" size="large" sx={{ padding: "0px" }}>
            {controllerAdvancedConfig.includes("mouseAndKeyboardMode") ? (
              <BsToggleOn />
            ) : (
              <BsToggleOff />
            )}
          </IconButton>
        </MenuItem>

        <MenuItem
          dense={true}
          onClick={() => {
            !controllerAdvancedConfig.includes("turboMode")
              ? setControllerAdvancedConfig([
                  ...controllerAdvancedConfig,
                  "turboMode",
                ])
              : setControllerAdvancedConfig(
                  controllerAdvancedConfig.filter((e) => e !== "turboMode")
                );
          }}
        >
          <ListItemIcon>
            <PiLightningBold />
          </ListItemIcon>
          <ListItemText>Turbo Mode</ListItemText>
          <IconButton edge="end" size="large" sx={{ padding: "0px" }}>
            {controllerAdvancedConfig.includes("turboMode") ? (
              <BsToggleOn />
            ) : (
              <BsToggleOff />
            )}
          </IconButton>
        </MenuItem>

        <MenuItem
          dense={true}
          onClick={() => {
            !controllerAdvancedConfig.includes("safetyMargin")
              ? setControllerAdvancedConfig([
                  ...controllerAdvancedConfig,
                  "safetyMargin",
                ])
              : setControllerAdvancedConfig(
                  controllerAdvancedConfig.filter((e) => e !== "safetyMargin")
                );
          }}
        >
          <ListItemIcon>
            <LuAlignVerticalSpaceAround />
          </ListItemIcon>
          <ListItemText>Safety Margin</ListItemText>
          <IconButton edge="end" size="large" sx={{ padding: "0px" }}>
            {controllerAdvancedConfig.includes("safetyMargin") ? (
              <BsToggleOn />
            ) : (
              <BsToggleOff />
            )}
          </IconButton>
        </MenuItem>

        <MenuItem
          dense={true}
          disabled={!document.fullscreenEnabled}
          onClick={() => {
            !document.fullscreenElement
              ? document.getElementById("App")?.requestFullscreen()
              : setControllerAdvancedConfig(
                  controllerAdvancedConfig.filter((e) => e !== "handheldMode")
                );
            if (document.fullscreenElement) {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              }
            }
          }}
        >
          <ListItemIcon>
            <MdFullscreen />
          </ListItemIcon>
          <ListItemText>Fullscreen (iOS doesn't support)</ListItemText>
          <IconButton edge="end" size="large" sx={{ padding: "0px" }}>
            {document.fullscreenElement ? <BsToggleOn /> : <BsToggleOff />}
          </IconButton>
        </MenuItem>

        <Divider />

        <MuiButton
          startIcon={<PiExportBold />}
          variant="contained"
          size="small"
          sx={{
            fontSize: "14px",
            minHeight: "34px",
            height: "34px",
            padding: "9px",
            textTransform: "none",
            backgroundColor: "#638dff",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#638dff", boxShadow: "none" },
            margin: "7px",
          }}
          disabled
        >
          Export Config
        </MuiButton>

        <MuiButton
          startIcon={<LuImport />}
          variant="contained"
          size="small"
          sx={{
            fontSize: "14px",
            minHeight: "34px",
            height: "34px",
            padding: "9px",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#638dff", boxShadow: "none" },
            margin: "7px",
            backgroundColor: "#638dff",
          }}
          disabled
        >
          Import Config
        </MuiButton>
        <MenuItem dense disableRipple disabled>
          ScratchGO v2 beta v1.0.29
        </MenuItem>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <MenuItem
          dense={true}
          onClick={() => {
            !controllerAdvancedConfig.includes("handheldMode")
              ? setControllerAdvancedConfig([
                  ...controllerAdvancedConfig,
                  "handheldMode",
                ])
              : setControllerAdvancedConfig(
                  controllerAdvancedConfig.filter((e) => e !== "handheldMode")
                );
          }}
        >
          <ListItemIcon>
            <MdOutlineGamepad />
          </ListItemIcon>
          <ListItemText>Handheld Mode</ListItemText>
          <IconButton edge="end" size="large" sx={{ padding: "0px" }}>
            {controllerAdvancedConfig.includes("handheldMode") ? (
              <BsToggleOn />
            ) : (
              <BsToggleOff />
            )}
          </IconButton>
        </MenuItem>
        <div id="controller-not-connected-area" className="controller-status">
          <div className="loader"></div>
          <div>Controller not connected, press any button to start.</div>
        </div>
        <div id="controller-connected-area">
          <div id="controller-connected" className="controller-status">
            Controller connected
          </div>
          <div id="buttons"></div>
        </div>
        <GamepadMapping />

      </CustomTabPanel>
    </Box>
  );
}
