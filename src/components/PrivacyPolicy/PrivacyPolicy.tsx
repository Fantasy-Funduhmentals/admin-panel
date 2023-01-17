import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getMaintenanceMode,
  handleSettingsData,
} from "../../services/userService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import dynamic from "next/dynamic";
import AddPrivacyPolicyModal from "./add-privacyPolicy-modal";
const FroalaEditorComponent = dynamic(() => import("react-froala-wysiwyg"), {
  ssr: false,
});
const PrivacyPolicy = () => {
  const [twofa, setTwofa] = useState<Boolean>();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [rejectShow, setrejectShow] = useState(false);
  const [documentData, setDocumentData] = useState("");
  const [shopModelOpen, setShopModalOpen] = useState(false);

  const handleOpenModal = () => {
    setrejectShow(true);
  };

  const handleClose = () => {
    setrejectShow(false);
  };

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
        <CardHeader title="privacy Policy" />

        <Button color="success" onClick={() => setShopModalOpen(true)}>
          Update
        </Button>
      </Card>
      <AddPrivacyPolicyModal
        open={shopModelOpen}
        // getShopListing={getShopListing}
        onClose={() => {
          setShopModalOpen(false);
        }}
      />
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};
export default PrivacyPolicy;
