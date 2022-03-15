import { Box, Divider, Drawer, IconButton } from "@mui/material";
// @mui
import { styled, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useState } from "react";
// hooks
// import useResponsive from '../../../hooks/useResponsive';
// components
import Iconify from "../Iconify";
//
import ChatRoomAttachment from "./ChatRoomAttachment";
import ChatRoomGroupParticipant from "./ChatRoomGroupParticipant";
import ChatRoomOneParticipant from "./ChatRoomOneParticipant";

// ----------------------------------------------------------------------

const ToggleButtonStyle = styled((props) => (
  <IconButton disableRipple {...props} />
))(({ theme }) => ({
  right: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: "absolute",
  top: theme.spacing(1),
  boxShadow: theme.customShadows?.z8,
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${theme.palette.divider}`,
  borderRight: 0,
  borderRadius: `12px 0 0 12px`,
  transition: theme.transitions.create("all"),
  "&:hover": {
    backgroundColor: theme.palette.background.neutral,
  },
}));

// ----------------------------------------------------------------------

const SIDEBAR_WIDTH = 240;

ChatRoom.propTypes = {
  conversation: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
};

export default function ChatRoom({ conversation, participants }) {
  const theme = useTheme();

  const [openSidebar, setOpenSidebar] = useState(true);

  const [showInfo, setShowInfo] = useState(true);

  const isDesktop = true;

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  };

  const handleToggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const renderContent = (
    <>
      <div>
        <ChatRoomOneParticipant
          participants={participants}
          isCollapse={showInfo}
          onCollapse={() => setShowInfo((prev) => !prev)}
        />
      </div>
    </>
  );

  return (
    <Box sx={{ position: "relative" }}>
      <ToggleButtonStyle
        onClick={handleToggleSidebar}
        sx={{
          ...(openSidebar && isDesktop && { right: SIDEBAR_WIDTH }),
        }}
      >
        <Iconify
          width={16}
          height={16}
          icon={
            openSidebar
              ? "eva:arrow-ios-forward-fill"
              : "eva:arrow-ios-back-fill"
          }
        />
      </ToggleButtonStyle>

      {isDesktop ? (
        <Drawer
          open={openSidebar}
          anchor="right"
          variant="persistent"
          sx={{
            height: 1,
            width: SIDEBAR_WIDTH,
            transition: theme.transitions.create("width"),
            ...(!openSidebar && { width: "0px" }),
            "& .MuiDrawer-paper": {
              position: "static",
              width: SIDEBAR_WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          anchor="right"
          ModalProps={{ keepMounted: true }}
          open={openSidebar}
          onClose={handleCloseSidebar}
          sx={{
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
