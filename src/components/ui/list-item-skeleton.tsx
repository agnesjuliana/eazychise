import React from "react";

const ListItemSkeleton: React.FC = () => (
  <div className="animate-pulse flex space-x-4 p-4 bg-gray-200 rounded">
    <div className="rounded-full bg-gray-300 h-10 w-10"></div>
    <div className="flex-1 space-y-4 py-1">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export default ListItemSkeleton;