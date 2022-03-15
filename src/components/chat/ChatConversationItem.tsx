import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useMemo } from "react";
import BadgeStatus from "../../components/BadgeStatus";
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
  const otherUser = useMemo(() => {
    return getOtherUser(conversation.members);
  }, []);

  const isUnread = false;

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
            {otherUser?.onlineStatus && (
              <BadgeStatus
                status={otherUser?.onlineStatus}
                sx={{ right: 2, bottom: 2, position: "absolute" }}
              />
            )}
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
            secondary={otherUser?.name}
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
            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Box>
        </>
      )}
    </RootStyle>
  );
}
