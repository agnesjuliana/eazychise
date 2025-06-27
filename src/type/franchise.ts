export type FranchiseStatus = "OPEN" | "CLOSED";

export type DocumentType = "GUIDELINES" | "PENDUKUNG";

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

export type ListingDocuments = {
  id: string;
  type: DocumentType;
  name: string;
  path: string;
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
  listing_documents: ListingDocuments[];
  listing_highlights: ListingHighlight[];
};

export type CreateFranchisePayload = {
  name: string;
  price: number;
  image: string;
  status: string;
  location: string;
  ownership_document: string;
  financial_statement: string;
  proposal: string;
  sales_location: string;
  equipment: string;
  materials: string;
  listing_documents: ListingDocuments[];
  listings_highlights: ListingHighlight[];
};
