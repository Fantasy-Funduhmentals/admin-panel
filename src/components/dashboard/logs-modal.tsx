import {
  AppBar,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/AcUnit";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import { TransitionProps } from "@mui/material/transitions";
import { getWalletLogs } from "../../services/generalService";
import WalletPrices from "./WalletPrices";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface Props {
  open: boolean;
  onClose: any;
}
const LogsModal = (props: Props) => {
  const { open, onClose } = props;
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState();
  const handleLogs = async () => {
    try {
      setLoading(true);
      const res = await getWalletLogs();
      console.log(res.data, "_____data");
      setWalletData(res.data);
      setLoading(false);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    handleLogs();
  }, []);
  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              User Registration
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            // flexGrow: 1,
            py: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            alignSelf: "center",
          }}
        >
          <Container maxWidth="xl">
            <Grid>
              {loading ? (
                <CircularProgress />
              ) : (
                <WalletPrices walletData={walletData} />
              )}
            </Grid>
          </Container>
        </Box>
      </Dialog>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </Box>
  );
};

export default LogsModal;
