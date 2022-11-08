import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import {
  Avatar,
  Card,
  CardContent,
  CardProps,
  Grid,
  Typography,
} from "@mui/material";

interface Props extends CardProps {
  title: string;
  value: string;
  image?: any;
}

const DashboardCard = (props: Props) => {
  const { title, value, image } = props;

  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h5">
              {value}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "error.main",
                height: 56,
                width: 56,
              }}
              src={image}
            >
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
        {/* <Box
          sx={{
            pt: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowDownwardIcon color="error" />
          <Typography
            color="error"
            sx={{
              mr: 1,
            }}
            variant="body2"
          >
            12%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box> */}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
