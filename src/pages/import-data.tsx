import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import StatusModal from "../components/StatusModal";
import { uploadUserCsv } from "../services/generalService";
import { getNormalizedError } from "../utils/helpers";

const ImportData = () => {
  const [document, setDocument] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handledocumentSelection = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setDocument(img);
    }
  };

  const handleSubmit = async () => {
    try {
      setStatusData(null);
      if (!document) {
        setStatusData({
          type: "error",
          message: "Please select a document to continue",
        });
        return;
      }
      setLoading(true);

      const formData = new FormData();

      formData.append("file", document);

      const uploadRes = await uploadUserCsv(formData);
      setStatusData({
        type: "success",
        message: "sheet has been imported successfully",
      });
      setDocument(null);
      setLoading(false);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>CQR Admin</title>
      </Head>

      <Typography sx={{ m: 2 }} variant="h4">
        Import User Data
      </Typography>

      <Card
        style={{
          boxShadow: "rgb(0 0 0 / 29%) 1px 1px 18px",
          borderRadius: " 10px",
        }}
        sx={{ m: 2 }}
      >
        <CardHeader
          subheader="Upload users csv data to import users and their balances in database. Note that this operation is irreversible."
          title="Upload Document"
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <TextField
              type="file"
              id="your_input_id"
              inputProps={{ accept: ".csv" }}
              onChange={(ev) => {
                handledocumentSelection(ev);
              }}
            />
          </Container>
        </Box>
        <Divider />
        <CardActions
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              color="primary"
              variant="contained"
              type="submit"
              style={{ width: "30%" }}
              onClick={handleSubmit}
            >
              Upload Document
            </Button>
          )}
        </CardActions>
      </Card>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};

ImportData.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ImportData;
