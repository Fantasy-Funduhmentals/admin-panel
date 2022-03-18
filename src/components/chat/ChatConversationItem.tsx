import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useMemo } from "react";
import BadgeStatus from "../../components/BadgeStatus";
import { theme } from "../../theme";
import { getOtherUser } from "../../utils/helpers";

const AVATAR_SIZE = 48;

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  transition: theme.transitions.create("all"),
}));

const AvatarWrapperStyle = styled("div")(() => ({
  position: "relative",
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  "& .MuiAvatar-img": { borderRadius: "50%" },
  "& .MuiAvatar-root": { width: "100%", height: "100%" },
}));

ChatConversationItem.propTypes = {
  isSelected: PropTypes.bool,
  conversation: PropTypes.object.isRequired,
  isOpenSidebar: PropTypes.bool,
  onSelectConversation: PropTypes.func,
};

export default function ChatConversationItem({
  isSelected,
  conversation,
  onSelectConversation,
  isOpenSidebar,
}: any) {
  const otherUser = getOtherUser(conversation.members);

  const isUnread = conversation?.recentMessage?.recipient == "ADMIN";

  const recentMessage =
    conversation?.recentMessage?.recipient == "ADMIN"
      ? conversation?.recentMessage
      : null;

  return (
    <RootStyle
      disableGutters
      onClick={onSelectConversation}
      sx={{
        ...(isSelected && { bgcolor: "action.selected" }),
      }}
    >
      <ListItemAvatar>
        <Box>
          <AvatarWrapperStyle className="avatarWrapper">
            <Avatar alt={otherUser?.name} src={otherUser?.profilePicture} />
          </AvatarWrapperStyle>
        </Box>
      </ListItemAvatar>

      {isOpenSidebar && (
        <>
          <ListItemText
            primary={otherUser?.name}
            primaryTypographyProps={{
              noWrap: true,
              variant: "subtitle2",
            }}
            secondary={recentMessage?.text}
            secondaryTypographyProps={{
              noWrap: true,
              variant: isUnread ? "subtitle2" : "body2",
              color: isUnread ? "textPrimary" : "textSecondary",
            }}
          />

          <Box
            sx={{
              ml: 2,
              height: 44,
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
            }}
          >
            {isUnread && (
              <Box
                sx={{
                  background: theme.palette.primary.main,
                  height: 15,
                  width: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  borderRadius: 9999,
                }}
              >
                <Typography sx={{ fontSize: 10, color: "white" }}>
                  {conversation?.unReadMessages}
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </RootStyle>
  );
}
