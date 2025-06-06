import React from 'react'

export default function FranchiseDetail(
  { params }: { params: { franchiseId: string}}
) {
  const { franchiseId } = params;
  console.log("Franchise ID:", franchiseId);

  return (
    <div>{`Franchise ID: ${franchiseId}`}</div>
  )
}
