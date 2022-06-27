import { Line } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import { useState } from "react";
interface Props {
  walletData: {} | any;
}
const WalletPrices = (props: Props) => {
  const { walletData } = props;
  const theme = useTheme();
  const [select, setSelect] = useState(10);
  const handleChange = (e) => {
    setSelect(e.target.value);
    console.log(e.target.value, "____select");
  };
  console.log(walletData, "____walletData");
  var arr = [];
  console.log(arr, "____balance");
  walletData?.wallet?.map((element) => {
    arr[element.balance] = element.token;
  });

  const data = {
    datasets: [
      {
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: arr,
        label: "This year",
        maxBarThickness: 10,
        fill: true,
      },
    ],
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
  };
  const options = {
    animation: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
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

  return (
    <>
      <Card {...props}>
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            spacing={3}
            style={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "center",
              width: "100%",
            }}
          >
            <Grid item lg={10} sm={6} xl={10} xs={12}>
              <CardHeader title="All Time Price" />
            </Grid>
            <Grid
              item
              lg={2}
              sm={6}
              xl={2}
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">User Data</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={select}
                  label="Age"
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value={10}>10Days</MenuItem>
                  <MenuItem value={20}>20Days</MenuItem>
                  <MenuItem value={30}>30Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider style={{ marginBottom: "30px" }} />
        <CardContent>
          <Box
            sx={{
              height: 400,
              position: "relative",
            }}
          >
            <Line data={data} options={options} />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
export default WalletPrices;
