import { Button, Card, CardHeader } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import StatusModal from "../StatusModal";
import AddTermAndConditions from "./add-termAndConditions-modal";

const TermAndConditions = () => {
  const [statusData, setStatusData] = useState(null);
  const [shopModelOpen, setShopModalOpen] = useState(false);

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
        <CardHeader title="Terms and Conditions" />

        <Button color="success" onClick={() => setShopModalOpen(true)}>
          Update
        </Button>
      </Card>
      <AddTermAndConditions
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
export default TermAndConditions;
