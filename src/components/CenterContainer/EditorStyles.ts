import { makeStyles } from "@material-ui/core";

const tabHeight = '34px' // default: '48px'
export const useStyles = makeStyles({
  tabPanel: {
    padding: '16px',
  },
  tabsContainer: {
    width: '100%',
  },
  tabsRoot:{
    minHeight: tabHeight,
    height: tabHeight
  },
  tab: {
    minHeight: tabHeight,
    height: tabHeight,
    textTransform: 'none',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    '&.Mui-selected': {
      backgroundColor: '#638dff',
      color: '#ffffff',
    },
  },
  tabsWrapper: {
    borderBottom: '2px solid #dde9fd',
    borderRadius: '10px 10px 0 0',
  },  
  tabIndicator: {
    display: 'none',
  },
});