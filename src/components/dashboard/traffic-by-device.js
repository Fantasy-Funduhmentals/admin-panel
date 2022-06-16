import { Doughnut } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import TabletIcon from "@mui/icons-material/Tablet";
import { getNormalizedError } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { getGraphData } from "../../services/userService";
import StatusModal from "../StatusModal";

export const TrafficByDevice = (props) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [resData, setResData] = useState();
  const handleRequest = async () => {
    try {
      setLoading(true);
      const res = await getGraphData();
      console.log(res.data, "getGraphData");
      setResData(res?.data);
      setStatusData({
        type: "success",
        message: "Request handled successfully",
      });
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
    handleRequest();
  }, []);

  const data = {
    datasets: [
      {
        data: [resData?.cqrUsers, resData?.sdiraUsers],
        backgroundColor: [
          resData?.cqrUsers ? "#3F51B5" : null,
          resData?.sdiraUsers ? "#e53935" : null,
        ],
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
      },
    ],
    labels: ["Standard Users", "Sdira Users"],
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };
  const devices = [
    {
      title: "Standard Users",
      value: resData?.cqrUsers ?  resData?.cqrUsers : "-",
      icon: AccountCircleIcon,
      color: "#3F51B5",
    },
    {
      title: "Sdira Users",
      value: resData?.sdiraUsers ? resData?.sdiraUsers : "-",
      icon: SupervisedUserCircleIcon,
      color: "#E53935",
    },
  ];

  return (
    <>
      <Card {...props}>
        <CardHeader title="Users Statistics" />
        <Divider />
        <CardContent>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 400,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  height: 300,
                  position: "relative",
                }}
              >
                <Doughnut data={data} options={options} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pt: 2,
                }}
              >
                {devices.map(({ color, icon: Icon, title, value }) => (
                  <Box
                    key={title}
                    sx={{
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    <Icon color="action" />
                    <Typography color="textPrimary" variant="body1">
                      {title}
                    </Typography>
                    <Typography style={{ color }} variant="h4">
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>{" "}
            </>
          )}
        </CardContent>
      </Card>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};
