import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { handleBlockSubAdmin } from "../../services/userService";
import { RootState } from "../../store";
import { useAppSelector } from "../../store/hooks";
import { getNormalizedError } from "../../utils/helpers";
import { updatePlayerValue } from "../../services/playerService";
import { changesImageUrl } from "../../services/shopService";

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
  const [playerId, setPlayerId] = useState(null);

  const handleTextAreaChange = (e) => {
    setReason(e.target.value);
  };
  const handleEditPlayer = (data: any) => {
    setPlayerId(data?._id);
    setrejectShow(true);
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

  // const handleBlockUser = (data) => {
  //   if (data.isBlocked) {
  //     setsignleUser(data);
  //     handleSubmit(data);
  //   } else {
  //     setsignleUser(data);
  //     setrejectShow(true);
  //   }
  // };

  const handleImageUpload = async (file: any, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const uploadRes = await changesImageUrl(formData);

    return uploadRes?.data?.url;
  };

  const handleClose = () => {
    setrejectShow(false);
  };
  const formik = useFormik({
    initialValues: {
      value: "",
      video: "",
    },
    validationSchema: Yup.object({
      value: Yup.number().positive().required(),
      video: Yup.mixed().required(),
    }),
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, { resetForm });
    },
  });
  const handleSubmit = async (values, { resetForm }) => {
    let params = {
      value: Number(values.value),
      video: await handleImageUpload(values?.video[0], "NFT"),
    };

    try {
      setloading(true);
      const res = await updatePlayerValue(playerId, params);
      setStatusData({
        type: "success",
        message: res?.data?.message,
      });
      resetForm();
      setrejectShow(false);

      RefreshAdminUsersData();
      setloading(false);
    } catch (err) {
      setloading(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  // const handleSubmit = async (data) => {
  //   let params;
  //   if (data?.isBlocked) {
  //     params = {
  //       userId: data?._id,
  //       isblocked: !data?.isBlocked,
  //     };
  //   } else {
  //     if (!reason) {
  //       setStatusData({
  //         type: "error",
  //         message: "please enter reason first",
  //       });
  //       return;
  //     }
  //     params = {
  //       userId: signleUser?._id,
  //       isblocked: !signleUser?.isBlocked,
  //       reasonToBlock: reason,
  //     };
  //   }

  //   try {
  //     setloading(true);
  //     const response = await handleBlockSubAdmin(params);
  //     setStatusData({
  //       type: "success",
  //       message: response?.data?.message,
  //     });
  //     setloading(false);
  //     handleClose();
  //     RefreshAdminUsersData();
  //   } catch (err) {
  //     const error = getNormalizedError(err);
  //     setStatusData({
  //       type: "error",
  //       message: error,
  //     });
  //     setloading(false);
  //   }
  // };

  return {
    dataToDisplay,
    selectedCustomerIds,
    // handleBlockUser,
    handleEditPlayer,
    rejectShow,
    handleClose,
    loading,
    handleTextAreaChange,
    // handleSubmit,
    statusData,
    setStatusData,
    subadmin,
    formik,
    // handlePlayerValue,
  };
};

export default usePlayerData;
