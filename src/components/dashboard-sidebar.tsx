import { Box, Divider, Drawer, Typography, useMediaQuery } from "@mui/material";
/* @ts-ignore */
import { Theme } from "@mui/system";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Cog } from "../icons/cog";
import { DirectWire } from "../icons/DirectWire";
import { Newsletter } from "../icons/Newsletter";
import { Shop } from "../icons/shop";
import { Subscription } from "../icons/Subscription";
import { UserPlayer } from "../icons/user";
import { UserCircle } from "../icons/user-circle";
import { Users } from "../icons/users";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";
const items = [
  {
    href: "/dashboard",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/users",
    icon: <UserPlayer fontSize="small" />,
    title: "Users",
  },
  {
    href: "/sub-admin",
    icon: <Users fontSize="small" />,
    title: "Sub-Admin",
  },
  {
    href: "/score",
    icon: <Subscription fontSize="small" />,
    title: "Score",
  },
  {
    href: "/newsletter",
    icon: <Newsletter fontSize="small" />,
    title: "Newsletter",
  },
  {
    href: "/players",
    icon: <UserCircle fontSize="small" />,
    title: "Players",
  },
  {
    href: "/nft",
    icon: <UserCircle fontSize="small" />,
    title: "NFT's",
  },
  {
    href: "/shop",
    icon: <Shop fontSize="small" />,
    title: "Shop",
  },
  {
    href: "/lates-news",
    icon: <Newsletter fontSize="small" />,
    title: "Lates-News",
  },

  {
    href: "/team",
    icon: <DirectWire fontSize="small" />,
    title: "Team",
  },

  {
    href: "/articles",
    icon: <Newsletter fontSize="small" />,
    title: "Articles",
  },
  {
    href: "/position",
    icon: <Shop fontSize="small" />,
    title: "Position",
  },
  {
    href: "/reported-bugs",
    icon: <Newsletter fontSize="small" />,
    title: "Bugs Management",
  },

  {
    href: "/settings",
    icon: <Cog fontSize="small" />,
    title: "Settings",
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const { role } = useAppSelector((state: RootState) => state.user);

  let data = role?.adminPermissions?.map((item, index) => {
    const found = items?.find((val) => val?.title?.toLowerCase() == item);
    return {
      title: found?.title,
      icon: found?.icon,
      href: found?.href,
    };
  });

  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(() => {
    if (!router?.isReady) {
      return;
    }
    if (open) {
      onClose?.();
    }
    // if (role?.role != "admin" && items != data) {
    //   router.push(`/${role?.adminPermissions[0]}`);
    // }
  }, [router.asPath]);

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink href="/" passHref>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <a>
                  <Logo
                    sx={{
                      height: 52,
                      width: 52,
                    }}
                  />
                </a>
              </Box>
            </NextLink>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            mb: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {role?.role == "admin"
            ? items.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                />
              ))
            : role?.role == "sub admin"
            ? data?.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item?.icon}
                  href={item.href}
                  title={item.title}
                />
              ))
            : ""}
        </Box>
        <Divider sx={{ borderColor: "#2D3748" }} />
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          <Typography color="neutral.500" variant="body2" textAlign="center">
            Fantasy Fundamental Admin
          </Typography>
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
