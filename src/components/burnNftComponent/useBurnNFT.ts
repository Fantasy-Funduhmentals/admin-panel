import React, { useEffect, useMemo, useState } from "react";
import { getAdminUserData } from "../../services/tokenService";
import { handleBlockSubAdmin } from "../../services/userService";
import { RootState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { saveAdminUser } from "../../store/reducers/adminSlice";
import { getNormalizedError } from "../../utils/helpers";

const useBurnNFT = (searchQuery, RefreshAdminUsersData) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const { subadmin } = useAppSelector((state: RootState) => state?.adminUser);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rejectShow, setrejectShow] = useState(false);
  const [signleUser, setsignleUser] = useState(null);
  const [reason, setReason] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setloading] = useState(false);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleTextAreaChange = (e) => {
    setReason(e.target.value);
  };

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return subadmin
        .filter(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else {
      return subadmin?.slice(begin, end);
    }
  }, [page, limit, subadmin, searchQuery]);

  const handleBlockUser = (data) => {
    if (data.isBlocked) {
      setsignleUser(data);
      handleSubmit(data);
    } else {
      setsignleUser(data);
      setrejectShow(true);
    }
  };

  const handleClose = () => {
    setrejectShow(false);
  };

  const handleSubmit = async (data) => {
    let params;
    if (data?.isBlocked) {
      params = {
        userId: data?._id,
        isblocked: !data?.isBlocked,
      };
    } else {
      if (!reason) {
        setStatusData({
          type: "error",
          message: "please enter reason first",
        });
        return;
      }
      params = {
        userId: signleUser?._id,
        isblocked: !signleUser?.isBlocked,
        reasonToBlock: reason,
      };
    }

    try {
      setloading(true);
      const response = await handleBlockSubAdmin(params);
      setStatusData({
        type: "success",
        message: response?.data?.message,
      });
      setloading(false);
      handleClose();
      RefreshAdminUsersData();
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setloading(false);
    }
  };

  return {
    dataToDisplay,
    selectedCustomerIds,
    handleBlockUser,
    handlePageChange,
    handleLimitChange,
    page,
    limit,
    rejectShow,
    handleClose,
    loading,
    handleTextAreaChange,
    handleSubmit,
    statusData,
    setStatusData,
    subadmin,
  };
};

export default useBurnNFT;
