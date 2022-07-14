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
import { useMemo, useState } from "react";
import moment from "moment";
interface Props {
  walletData: {} | any;
  wallet: any;
}
const WalletPrices = (props: Props) => {
  const { walletData, wallet } = props;
  const theme = useTheme();
  const displayData = useMemo(() => {
    const currentYear = new Date().getFullYear();

    let finalData = [];
    for (let i = 1; i <= 12; i++) {
      let obj = walletData.find((wallet) => wallet?._id?.month == i);

      if (obj?._id?.year == currentYear) {
        const token = obj?.data[i]?.token[0];
        let wallet = obj;

        for (let wall of wallet) {
          const totalSum = wallet.data
            ?.filter((wallet) => wallet?.token[0]?._id == wall.token?._id)
            .reduce((a, b) => a + b);

          finalData.push({
            backgroundColor: token?.coinColor,
            borderColor: token?.coinColor,
            barPercentage: 0.5,
            barThickness: 12,
            borderRadius: 4,
            categoryPercentage: 0.5,
            data: [totalSum],
            label: token.shortName,
            // new Date(wallet.createdAt).getFullYear()
            maxBarThickness: 10,
            fill: false,
          });
        }
      } else {
      }
    }

    return finalData;
  }, []);
  var startDate = moment().subtract(1, "months").format("YYYY-MM-DD");
  var endDate = moment().format("YYYY-MM-DD");

  const data = {
    // datasets: displayData,
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
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
        // ticks: {
        //   fontColor: theme.palette.text.secondary,
        // },
        ticks: {
          callback: function (labels) {
            var month = labels.split(";")[0];
            var year = labels.split(";")[1];
            if (month === "February") {
              return year;
            } else {
              return "";
            }
          },
        },
        gridLines: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
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
          drawBorder: true,
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
        <CardHeader title="All Time Price" />

        <Divider style={{ marginBottom: "30px" }} />
        <CardContent>
          <Box
            sx={{
              height: 400,
              position: "relative",
            }}
          >
            {/* <Line data={data} options={options} /> */}
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
export default WalletPrices;
