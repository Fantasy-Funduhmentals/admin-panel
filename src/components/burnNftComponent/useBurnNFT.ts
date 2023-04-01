import { useMemo, useState } from "react";

const useBurnNFT = (searchQuery, RefreshAdminUsersData, page, limit, data) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [statusData, setStatusData] = useState(null);

  const dataToDisplay = useMemo(() => {
    if (searchQuery?.length > 0) {
      return data?.filter((user) =>
        user?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return data;
    }
  }, [page, limit, data, searchQuery]);

  return {
    dataToDisplay,
    selectedCustomerIds,
    page,
    limit,
    statusData,
    setStatusData,
  };
};

export default useBurnNFT;
