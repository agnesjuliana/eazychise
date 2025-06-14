export type FranchiseStatus = "OPEN" | "CLOSED";

// Separated Nested Types
export type FranchisorInfo = {
  id: string;
  name: string;
  email: string;
};

export type ListingHighlight = {
  id: string;
  title: string;
  content: string;
};

// Main Payload Type
export type FranchiseUpdatePayload = {
  id: string;
  franchisor_id: string;
  name: string;
  price: string;
  image: string;
  status: FranchiseStatus;
  location: string;
  ownership_document: string;
  financial_statement: string;
  proposal: string;
  sales_location: string;
  equipment: string;
  materials: string;
};