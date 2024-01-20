import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useStyles } from "./EditorStyles";
import { Button as MuiButton } from "@mui/material";
import { BsFillNutFill } from "react-icons/bs";
import { MdLightbulb } from "react-icons/md";
import { DummyButton } from "../Button/DummyButton";

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

interface Props{
    toggleEditing(): void
    unitWidth: number;
    validDropCancelTransition: boolean;
}

export default function Editor({toggleEditing, unitWidth, validDropCancelTransition}:Props) {
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
          sx={{ height: "34px", minHeight: "34px"}}
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
            component={
                {
                    type: "button",
                    styling: [],
                    mapping: "ArrowUp",
                    container: "left",
                    x: 0,
                    y: 0,
                    w: 1,
                    h: 1,
                    color: '#006aff'
                  }
            }
          />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Advanced options (incomplete lol)
      </CustomTabPanel>
    </Box>
  );
}
