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

export type FundingRequestPayload = {
  confirmation_status: "WAITING" | "REJECTED" | "ACCEPTED";
  address: string;
  phone_number: string;
  npwp: string;
  franchise_address: string;
  ktp: string;
  foto_diri: string;
  foto_lokasi: string;
  mou_franchisor: string;
  mou_modal: string;
};

// Main Payload Type
export type FranchiseUpdatePayload = {
  category_id: string[];
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

export type PurchaseFranchisePayload = {
  purchase_type: "FUNDED" | "PURCHASED";
  confirmation_status: "WAITING" | "REJECTED" | "ACCEPTED";
  payment_status: "PAID" | "PROCESSED";
  paid_at?: Date;
  funding_request?: FundingRequestPayload;
};
