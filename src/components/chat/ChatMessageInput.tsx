import { CircularProgress, Divider, IconButton, Input, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import Iconify from "../../components/Iconify";

const RootStyle = styled("div")(({ theme }) => ({
  minHeight: 56,
  display: "flex",
  position: "relative",
  alignItems: "center",
  paddingLeft: theme.spacing(2),
}));

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  conversationId: PropTypes.string,
  onSend: PropTypes.func,
};

export default function ChatMessageInput({
  disabled,
  conversationId,
  onSend,
  onImageReceived,
  loading
}) {
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message) {
      return "";
    }
    if (onSend && conversationId) {
      onSend(message);
    }
    return setMessage("");
  };

  return (
    <RootStyle>
      <Input
        disabled={loading ? true : disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message"
        endAdornment={
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
            {loading ? (
              <CircularProgress size={25} />
            ) : (
              <IconButton disabled={disabled} size="small" onClick={handleAttach}>
                <Iconify
                  icon="ic:round-add-photo-alternate"
                  width={22}
                  height={22}
                  sx={{}}
                />
              </IconButton>
            )}
          </Stack>
        }
      />

      <Divider orientation="vertical" flexItem />

      <IconButton
        color="primary"
        disabled={!message}
        onClick={handleSend}
        sx={{ mx: 1 }}
      >
        <Iconify icon="ic:round-send" width={22} height={22} sx={{}} />
      </IconButton>

      <input
        type="file"
        disabled={loading ? true : false}
        multiple
        accept="image/png, image/gif, image/jpeg"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(ev) => onImageReceived(ev)}
      />
    </RootStyle>
  );
}
