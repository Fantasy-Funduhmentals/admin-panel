import {
  Button,
  Card,
  CardHeader,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { ImportOdds } from "../../services/generalService";
import { changesImageUrl } from "../../services/shopService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";

const Betting = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageUpload = async (file: any, type: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const uploadRes = await ImportOdds(formData);
      setStatusData({
        type: "success",
        message: "Betting Sheet updated",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = getNormalizedError(error);
      setStatusData({
        type: "error",
        message: err,
      });
    }
  };

  const handleFileChange = async (event) => {
    const file = event?.target?.files[0];
    await handleImageUpload(file, "");
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
        <CardHeader title="Upload Betting Sheet" />
        {loading ? (
          <CircularProgress color="success" />
        ) : (
          <TextField
            color="success"
            type="file"
            inputProps={{ accept: ".xls,.xlsx,.csv" }}
            onChange={handleFileChange}
          />
        )}
      </Card>

      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};
export default Betting;
