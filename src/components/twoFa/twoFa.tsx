import { Button, Card, CardHeader, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getMaintenanceMode } from "../../services/userService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";

const TwoFa = () => {
  const [twofa, setTwofa] = useState<Boolean>();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const getMaintenance = async () => {
    try {
      const usersRes = await getMaintenanceMode();
      if (!usersRes?.data?.payload?.is2faEnabled) {
        setTwofa(false);
      } else {
        setTwofa(true);
      }
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  const enable2fa = async () => {
    try {
      setLoading(true);
      // const result = await patchTwoFa();
      let result;
      setLoading(false);
      getMaintenance();
      setStatusData({
        type: "success",
        message: result?.data?.payload,
      });
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    getMaintenance();
  }, []);
  return (
    <>
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 3,
        }}
      >
        <CardHeader title="2FA" />
        {loading ? (
          <CircularProgress size={25} />
        ) : (
          <>
            <Button
              onClick={() => enable2fa()}
              color={twofa ? "success" : "primary"}
            >
              {twofa ? "Resend 2fa" : "Enable"}
            </Button>
          </>
        )}
      </Card>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};
export default TwoFa;
