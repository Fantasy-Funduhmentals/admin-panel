import { useMemo, useState } from "react";
import { handleBlockSubAdmin } from "../../services/userService";
import { RootState } from "../../store";
import { useAppSelector } from "../../store/hooks";
import { getNormalizedError } from "../../utils/helpers";

const usePlayerData = (
  searchQuery,
  RefreshAdminUsersData,
  data,
  page,
  limit
) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const { subadmin } = useAppSelector((state: RootState) => state?.adminUser);

  const [rejectShow, setrejectShow] = useState(false);
  const [signleUser, setsignleUser] = useState(null);
  const [reason, setReason] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setloading] = useState(false);

  const handleTextAreaChange = (e) => {
    setReason(e.target.value);
  };

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;
    if (searchQuery.length > 0) {
      return data.filter((user) =>
        user.detail?.Name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return data;
    }
  }, [data, searchQuery]);

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

export default usePlayerData;
