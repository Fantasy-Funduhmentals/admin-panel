import React, { useEffect, useMemo, useState } from "react";
import { getAdminUserData } from "../../services/tokenService";
import { handleBlockSubAdmin } from "../../services/userService";
import { RootState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { saveAdminUser } from "../../store/reducers/adminSlice";
import { getNormalizedError } from "../../utils/helpers";

const useBugsHook = (searchQuery, RefreshAdminUsersData, data) => {
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
      return data
        .filter(
          (user) =>
            user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else {
      return data?.slice(begin, end);
    }
  }, [page, limit, data, searchQuery]);

  const handleClose = () => {
    setrejectShow(false);
  };

  return {
    dataToDisplay,
    selectedCustomerIds,
    handlePageChange,
    handleLimitChange,
    page,
    limit,
    rejectShow,
    handleClose,
    loading,
    handleTextAreaChange,
    statusData,
    setStatusData,
    subadmin,
  };
};

export default useBugsHook;
