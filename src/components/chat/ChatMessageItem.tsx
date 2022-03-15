import { Avatar, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatDistanceToNowStrict } from "date-fns";
import PropTypes from "prop-types";
import { useMemo } from "react";

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const MessageImgStyle = styled("img")(({ theme }) => ({
  height: 200,
  minWidth: 296,
  width: "100%",
  cursor: "pointer",
  objectFit: "cover",
  borderRadius: theme.shape.borderRadius,
}));

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func,
  otherUser: PropTypes.object.isRequired,
};

export default function ChatMessageItem({
  message,
  onOpenLightbox,
  otherUser,
}) {
  const isImage = Boolean(message?.image);

  const [isMe, senderDetails, firstName] = useMemo(() => {
    let isMe = message?.user == "ADMIN";
    const senderDetails = message?.user == "ADMIN" ? "ADMIN" : otherUser;
    const firstName = senderDetails?.name && senderDetails.name.split(" ")[0];

    return [isMe, senderDetails, firstName];
  }, []);

  return (
    <RootStyle>
      <Box
        sx={{
          display: "flex",
          ...(isMe && {
            ml: "auto",
          }),
        }}
      >
        {!isMe && (
          <Avatar
            alt={senderDetails?.name}
            src={senderDetails?.profilePicture}
            sx={{ width: 32, height: 32 }}
          />
        )}

        <Box sx={{ ml: 2 }}>
          <InfoStyle
            noWrap
            variant="caption"
            sx={{ ...(isMe && { justifyContent: "flex-end" }) }}
          >
            {!isMe && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && {
                color: "grey.800",
                bgcolor: "primary.lighter",
              }),
            }}
          >
            {isImage ? (
              <MessageImgStyle
                alt="attachment"
                src={message.image}
                onClick={() => onOpenLightbox(message.image)}
              />
            ) : (
              <Typography variant="body2">{message.text}</Typography>
            )}
          </ContentStyle>
        </Box>
      </Box>
    </RootStyle>
  );
}
