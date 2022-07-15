import { Avatar, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatDistanceToNowStrict } from "date-fns";
import PropTypes from "prop-types";
import { useMemo } from "react";
import LightboxModal from "../../components/LightboxModal";

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
  // onOpenLightbox: PropTypes.func,
  otherUser: PropTypes.object.isRequired,
};

export default function ChatMessageItem({
  message,
  // onOpenLightbox,
  otherUser,
}) {
  const isImage = Boolean(message?.image);

  const [isMe, senderDetails, firstName] = useMemo(() => {
    let isMe = message?.user == "ADMIN";
    const senderDetails = message?.user == "ADMIN" ? "ADMIN" : otherUser;
    const firstName = senderDetails?.name && senderDetails.name.split(" ")[0];

    return [isMe, senderDetails, firstName];
  }, []);
  const URL_REGEX =
    /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
  function TextOrLink(value) {
    const words = value?.split(" ");
    return (
      <p>
        {words?.map((word) => {
          return word?.match(URL_REGEX) ? (
            <>
              <a
                href={`http://${
                  word?.split("/")[2] ? word?.split("/")[2] : word
                }`}
                target="_blank"
                style={{
                  ...(isMe
                    ? { color: "#42c5f7" }
                    : { color: "rgb(11 30 255)" }),

                  textDecoration: "underLine",
                }}
              >
                {word}
              </a>{" "}
            </>
          ) : (
            word + " "
          );
        })}
      </p>
    );
  }
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

        <Box
          sx={{ ml: 2 }}
          style={{
            ...(isMe
              ? { background: "#0f6b77", borderRadius: "20px 0px 20px 20px" }
              : {
                  background: "#00000021",
                  borderRadius: "0px 20px 20px 20px",
                }),
            padding: "0.3rem 1rem 0rem 0.8rem",
          }}
        >
          <InfoStyle
            noWrap
            variant="caption"
            sx={{ ...(isMe && { justifyContent: "flex-end", color: "black" }) }}
          >
            {!isMe && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              padding: "0px 0px 3px 0px",

              ...(isMe && {
                color: "#fff",
                bgcolor: "primary.lighter",
              }),
            }}
          >
            {isImage ? (
              // <MessageImgStyle
              //   alt="attachment"
              //   src={message.image}
              //   onClick={() => onOpenLightbox(message.image)}
              // />
              <LightboxModal
                style={{
                  width: "150px",
                  cursor: "pointer",
                  zIndex: 100,
                }}
                Imageurl={message.image}
              />
            ) : (
              <Typography
                variant="body2"
                sx={{
                  maxWidth: "13rem",
                  width: "auto",
                  wordWrap: "break-word",
                  padding: "0px 0px 3px 0px",
                }}
              >
                {TextOrLink(message.text)}
              </Typography>
            )}
          </ContentStyle>
        </Box>
      </Box>
    </RootStyle>
  );
}
