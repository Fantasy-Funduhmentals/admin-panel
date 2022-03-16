import { Box, Drawer, IconButton, Stack } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import Iconify from "../../components/Iconify";
import Scrollbar from "../../components/Scrollbar";
import { SocketContext } from "../../context/socket";
import { RootState } from "../../store";
import { useAppSelector } from "../../store/hooks";

import axios from "../../utils/axiosClient";
import { CHAT_SOCKET_TYPES } from "../../utils/enums/socket.enum";
import ChatAccount from "./ChatAccount";
import ChatContactSearch from "./ChatContactSearch";
import ChatConversationList from "./ChatConversationList";
import ChatSearchResults from "./ChatSearchResults";

const ToggleButtonStyle = styled((props) => (
  <IconButton disableRipple {...props} />
))(({ theme }) => ({
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: "absolute",
  top: theme.spacing(13),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  "&:hover": {
    backgroundColor: theme.palette.primary.darker,
  },
}));

// ----------------------------------------------------------------------

const SIDEBAR_WIDTH = 320;
const SIDEBAR_COLLAPSE_WIDTH = 96;

export default function ChatSidebar() {
  const theme = useTheme();

  const [openSidebar, setOpenSidebar] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [isSearchFocused, setSearchFocused] = useState(false);

  const { chats, currentChatRoom, activeConversationId } = useSelector(
    (state: RootState) => state.chat
  );

  // const isDesktop = useResponsive("up", "md");
  const isDesktop = true;

  const displayResults = searchQuery && isSearchFocused;

  const isCollapse = isDesktop && !openSidebar;

  useEffect(() => {
    if (!openSidebar) {
      return setSearchFocused(false);
    }
  }, [openSidebar]);

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  };

  const handleToggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const handleClickAwaySearch = () => {
    setSearchFocused(false);
    setSearchQuery("");
  };

  const handleChangeSearch = async (event) => {
    try {
      const { value } = event.target;

      const searchData = chats.filter((chat) =>
        chat?.members[0]?.name?.toLowerCase().includes(value.toLowerCase())
      );

      setSearchQuery(value);
      setSearchResults(searchData);
      if (value) {
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchSelect = (username) => {
    setSearchFocused(false);
    setSearchQuery("");
  };

  const handleSelectContact = (result) => {
    if (handleSearchSelect) {
      handleSearchSelect(result.username);
    }
  };

  const renderContent = (
    <>
      <Box sx={{ py: 2, px: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          {!isCollapse && (
            <>
              {/* <ChatAccount /> */}
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}

          <IconButton onClick={handleToggleSidebar}>
            <Iconify
              width={20}
              height={20}
              sx={{}}
              icon={
                openSidebar
                  ? "eva:arrow-ios-back-fill"
                  : "eva:arrow-ios-forward-fill"
              }
            />
          </IconButton>

          {/* {!isCollapse && (
            // <NextLink href={PATH_DASHBOARD.chat.new}>
            <NextLink href="/chat">
              <IconButton>
                <Iconify
                  icon={"eva:edit-fill"}
                  width={20}
                  height={20}
                  sx={{}}
                />
              </IconButton>
            </NextLink>
          )} */}
        </Stack>

        {!isCollapse && (
          <ChatContactSearch
            query={searchQuery}
            onFocus={handleSearchFocus}
            onChange={handleChangeSearch}
            onClickAway={handleClickAwaySearch}
          />
        )}
      </Box>

      <Scrollbar sx={{}}>
        {!displayResults ? (
          <ChatConversationList
            isOpenSidebar={openSidebar}
            activeConversationId={currentChatRoom?._id}
            sx={{ ...(isSearchFocused && { display: "none" }) }}
          />
        ) : (
          <ChatSearchResults
            query={searchQuery}
            results={searchResults}
            onSelectContact={handleSelectContact}
          />
        )}
      </Scrollbar>
    </>
  );

  return (
    <>
      {!isDesktop && (
        <ToggleButtonStyle onClick={handleToggleSidebar}>
          <Iconify sx={{}} width={16} height={16} icon={"eva:people-fill"} />
        </ToggleButtonStyle>
      )}

      {isDesktop ? (
        <Drawer
          open={openSidebar}
          variant="persistent"
          sx={{
            width: SIDEBAR_WIDTH,
            transition: theme.transitions.create("width"),
            "& .MuiDrawer-paper": {
              position: "static",
              width: SIDEBAR_WIDTH,
            },
            ...(isCollapse && {
              width: SIDEBAR_COLLAPSE_WIDTH,
              "& .MuiDrawer-paper": {
                width: SIDEBAR_COLLAPSE_WIDTH,
                position: "static",
                transform: "none !important",
                visibility: "visible !important",
              },
            }),
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          ModalProps={{ keepMounted: true }}
          open={openSidebar}
          onClose={handleCloseSidebar}
          sx={{
            "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}
