import { makeStyles } from "@material-ui/core";

const tabHeight = '34px' // default: '48px'
export const useStyles = makeStyles({
  tabPanel: {
    padding: '5px',
    marginTop: '36px',
  },
  tabsContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    overflowY: 'auto',
    // overscrollBehaviorY: 'none'
  },
  tabsRoot:{
    minHeight: tabHeight,
    height: tabHeight,
    position: 'relative'
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
    position: 'absolute',
    width: '100%',
    top: '0px',
    borderBottom: '2px solid #dde9fd',
    borderRadius: '10px 10px 0 0',
    backgroundColor: "#ebf1fc",
    zIndex: 10
  },  
  tabIndicator: {
    display: 'none',
  },
});