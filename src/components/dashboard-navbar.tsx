import styled from "@emotion/styled";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAdd from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import Settings from "@mui/icons-material/Settings";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Button,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { UserCircle as UserCircleIcon } from "../icons/user-circle";
import { Users as UsersIcon } from "../icons/users";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetUserState } from "../store/reducers/userSlice";
import { useWeb3 } from "@3rdweb/hooks";
import { HTTP_CLIENT } from "../utils/axiosClient";
import { setupAxios } from "../utils/axiosClient";
import { resetAdminState } from "../store/reducers/adminSlice";
import { resetCoinState } from "../store/reducers/coinSlice";
import { resetSettingsState } from "../store/reducers/settingsSlice";
import { RootState } from "../store";
import { resetEmailState } from "../store/reducers/emailSlice";
import { handleUserJwt } from "../services/userService";
import { useRouter } from "next/router";

const DashboardNavbarRoot = styled(AppBar)(({ theme }: any) => ({
  backgroundColor: theme.palette?.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
  const { role } = useAppSelector((state: RootState) => state.user);
  const location: any = useRouter();
  const { onSidebarOpen, ...other } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { connectWallet, address, error } = useWeb3();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(resetUserState());
    dispatch(resetAdminState());
    dispatch(resetCoinState());
    dispatch(resetSettingsState());
    dispatch(resetEmailState());
    location.push("/");
  };

  const getUserJwtData = async () => {
    try {
      await handleUserJwt();
    } catch (error) {
      handleLogout();
    }
  };

  /* @ts-ignore */
  useEffect(() => {
    try {
      setupAxios();
    } catch (error) {
      handleLogout();
    }

    getUserJwtData();
  }, []);

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          {/* {role == "admin" ? (
            <Button
              variant="contained"
              onClick={() => {
                connectWallet("injected");
              }}
            >
              {address
                ? `${address.substring(0, 6)}...${address.substring(
                    address.length - 4
                  )}`
                : " Connect Wallet"}
            </Button>
          ) : (
            ""
          )} */}
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <>
                <Avatar
                  sx={{
                    height: 40,
                    width: 40,
                    ml: 1,
                  }}
                  src="/static/images/avatars/avatar_1.png"
                >
                  <UserCircleIcon fontSize="small" />
                </Avatar>
              </>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </DashboardNavbarRoot>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,

            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
