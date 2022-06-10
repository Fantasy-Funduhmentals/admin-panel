import {
  Card,
  CardHeader,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useState } from "react";

const toggle = ({ recieveData }) => {
  const [alignment, setAlignment] = useState("blocked");
  const [loading, setLoading] = useState(false);
  // const [statusData, setStatusData] = useState(null);
  // const getMaintenance = async () => {
  //   try {
  //     const usersRes = await getMaintenanceMode();
  //     if (!usersRes?.data?.payload) {
  //       setAlignment("OFF");
  //     } else {
  //       setAlignment("ON");
  //     }
  //   } catch (err) {
  //     const error = getNormalizedError(err);
  //     setStatusData({
  //       type: "error",
  //       message: error,
  //     });
  //   }
  //   // 2;
  // };
  const handleChange = async (e) => {
    setAlignment(e.target.value);
    if (e.target.value == "blocked") {
      recieveData(true);
    } else {
      recieveData(false);
    }
  };

  // const [open, setOpen] = useState(false);
  const handleClickOpen = (e) => {
    // if (alignment == "ON") {
    //   return;
    // }
    // setOpen(true);
  };
  // const handleClose = () => {
  //   setOpen(false);
  //   setAlignment("OFF");
  // };
  // const handleOk = async () => {
  //   setLoading(true);
  //   setOpen(false);
  //   await postMaintenanceMode();
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   getMaintenance();
  // }, []);
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pr: 3,
      }}
    >
      <CardHeader title="User Status" />
      {loading ? (
        <CircularProgress size={25} />
      ) : (
        <>
          <ToggleButtonGroup
            sx={{ height: "20%" }}
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="blocked">Wallet Activated</ToggleButton>
            <ToggleButton value="notBlocked"> Wallet Deactivated</ToggleButton>
          </ToggleButtonGroup>
        </>
      )}
      {/* <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to switch Maintenance mode?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()}>Cancel</Button>
            <Button onClick={() => handleOk()} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog> */}
    </Card>
  );
};
export default toggle;
