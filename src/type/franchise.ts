// Role and Status Enums (optional if you're already using them somewhere else)
export type FranchiseStatus = "OPEN" | "CLOSED";
export type DocumentType = "PENDUKUNG" | "GUIDELINES";

// Separated Nested Types
export type FranchisorInfo = {
  id: string;
  name: string;
  email: string;
};

export type ListingDocument = {
  id: string;
  type: DocumentType;
  name: string;
  path: string;
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
  listing_documents?: ListingDocument[];
  listings_highlights?: ListingHighlight[];
};