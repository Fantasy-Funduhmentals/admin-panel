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
import { useAppSelector } from "../../store/hooks";

export const TrafficByDevice = (props) => {
  const { masterBalances, users } = useAppSelector((state: any) => state?.user);
  let data = [
    {
      name: "Total Projects",
      value: masterBalances?.reservedProjects
        ? masterBalances?.reservedProjects
        : "-",
    },

    {
      name: "Total No. of Sellers",
      value: masterBalances?.totalSellers ? masterBalances?.totalSellers : "-",
    },
    {
      name: "Total No. of Buyers",
      value: masterBalances?.totalBuyers ? masterBalances?.totalBuyers : "-",
    },
    {
      name: "Completed Projects",
      value: masterBalances?.completedProjects
        ? masterBalances?.completedProjects
        : "-",
    },
    {
      name: "Future Projects",
      value: masterBalances?.futureProjects
        ? masterBalances?.futureProjects
        : "-",
    },
  ];
  return (
    <Card sx={{ paddingBottom: "20px" }}>
      <Card
        {...props}
        sx={{ maxHeight: "565px", overflow: "auto", boxShadow: "none" }}
      >
        <CardHeader title="Users Statistics" />
        <Divider />

        {data?.map((item) => (
          <>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                color="textPrimary"
                variant="body1"
                sx={{ padding: "15px auto" }}
              >
                {item?.name}
              </Typography>
              <Typography variant="h6"> {item?.value}</Typography>
            </CardContent>
          </>
        ))}
      </Card>
    </Card>
  );
};
