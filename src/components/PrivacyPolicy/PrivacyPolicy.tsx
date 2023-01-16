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
const FroalaEditorComponent = dynamic(() => import("react-froala-wysiwyg"), {
  ssr: false,
});
const PrivacyPolicy = () => {
  const [twofa, setTwofa] = useState<Boolean>();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [rejectShow, setrejectShow] = useState(false);
  const [document, setDocument] = useState(null);
  console.log(
    "🚀 ~ file: PrivacyPolicy.tsx:27 ~ PrivacyPolicy ~ document",
    document
  );

  const handleOpenModal = () => {
    setrejectShow(true);
  };

  const handleClose = () => {
    setrejectShow(false);
  };

  const handlePolicyData = async () => {
    try {
      if (document === "") {
        setStatusData({
          type: "error",
          message: "Document is empty",
        });
        return;
      }
      const params = {
        privacyPolicy: document,
      };
      const res = await handleSettingsData(params);
      console.log(
        "🚀 ~ file: PrivacyPolicy.tsx:42 ~ handlePolicyData ~ res",
        res
      );
    } catch (error) {
      const err = getNormalizedError(error);
      setStatusData({
        type: "error",
        message: err,
      });
    }
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

        <Button onClick={() => handleOpenModal()}>Update</Button>
      </Card>
      <Modal
        open={rejectShow}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: 364,
            bgcolor: "background.paper",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            rowGap: "2rem",
            boxShadow: 60,
            padding: "1.5rem",
            justifyContent: "center",
            alignItems: "flex-start",
            maxWidth: "800px",
          }}
        >
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            UPDATE PRIVACY POLICY!
          </Typography> */}

          <Box id="editor">
            {rejectShow ? (
              <FroalaEditorComponent
                tag="textarea"
                // model={formik.values.documentData}
                onModelChange={(ev: any) => {
                  console.log("🚀 ~ file: twoFa.tsx:84 ~ TwoFa ~ ev", ev);
                  if (ev) setDocument(ev?.target?.values);
                }}
              />
            ) : null}
          </Box>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => handlePolicyData()}
          >
            Update
          </Button>
        </Box>
      </Modal>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};
export default PrivacyPolicy;
