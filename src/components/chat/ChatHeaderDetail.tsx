import { Avatar, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import BadgeStatus from "../../components/BadgeStatus";

const RootStyle = styled("div")(({ theme }) => ({
  flexShrink: 0,
  minHeight: 92,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 3),
}));

ChatHeaderDetail.propTypes = {
  participants: PropTypes.array.isRequired,
};

export default function ChatHeaderDetail({ participant }) {
  return (
    <RootStyle>
      <OneAvatar participant={participant} />
    </RootStyle>
  );
}

OneAvatar.propTypes = {
  participant: PropTypes.array.isRequired,
};

function OneAvatar({ participant }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ position: "relative" }}>
        <Avatar src={participant?.profilePicture} alt={participant?.name} />
        <BadgeStatus
          status={participant?.onlineStatus}
          sx={{ position: "absolute", right: 2, bottom: 2 }}
        />
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{participant?.name}</Typography>

        {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {participant?.onlineStatus ? "Active Now" : "Offline"}
        </Typography> */}
      </Box>
    </Box>
  );
}
