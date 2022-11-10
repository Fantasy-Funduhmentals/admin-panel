import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getNormalizedError } from "../../utils/helpers";
import { getMaintenanceMode } from "../../services/userService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { saveSettings } from "../../store/reducers/settingsSlice";

const toggle = () => {
  const { settings } = useAppSelector((state: any) => state.settings);

  const [alignment, setAlignment] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const dispatch = useAppDispatch();

  const getMaintenance = async () => {
    try {
      setLoading(true);
      const usersRes = await getMaintenanceMode();
      dispatch(saveSettings(usersRes?.data));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };
  const handleChange = async (e) => {
    if (e.target.value == "OFF") {
      setLoading(true);
      if (alignment == "OFF") {
        setLoading(false);
        return;
      }
      setAlignment(e.target.value);
      await getMaintenance();
      setLoading(false);
    } else if (e.target.value == "ON") {
      setAlignment(e.target.value);
    }
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = (e) => {
    if (alignment == "ON") {
      return;
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setAlignment("OFF");
  };
  const handleOk = async () => {
    setLoading(true);
    setOpen(false);
    await getMaintenance();
    setLoading(false);
  };

  useEffect(() => {
    // getMaintenance();
    if (!settings.maintenance) {
      setAlignment("OFF");
    } else {
      setAlignment("ON");
    }
  }, []);
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pr: 3,
      }}
    >
      <CardHeader title="Maintenance Mode " />
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
            <ToggleButton value="ON" onClick={(e) => handleClickOpen(e)}>
              ON
            </ToggleButton>
            <ToggleButton value="OFF" color="success">
              OFF
            </ToggleButton>
          </ToggleButtonGroup>
        </>
      )}
      <Dialog
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
      </Dialog>
    </Card>
  );
};
export default toggle;
