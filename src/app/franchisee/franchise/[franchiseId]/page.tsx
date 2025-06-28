import React from "react";
import withAuth from "@/lib/withAuth";

function FranchiseDetail({ params }: { params: { franchiseId: string } }) {
  const { franchiseId } = params;
  console.log("Franchise ID:", franchiseId);

  return <div>{`Franchise ID: ${franchiseId}`}</div>;
}

export default withAuth(FranchiseDetail, "FRANCHISEE");
