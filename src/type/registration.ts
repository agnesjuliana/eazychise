export type FranchiseeRegistrationPayload = {
  name: string;
  email: string;
  password: string;
};

export type FranchisorRegistrationPayload = {
  name: string;
  email: string;
  password: string;
  franchisor_data: FranchisorDataPayload;
  franchise_data: FranchiseDataPayload;
};

type FranchisorDataPayload = {
  ktp: string;
  foto_diri: string;
};

type FranchiseDataPayload = {
  category_id: string[];
  name: string;
  price: number;
  image: string;
  location: string;
  ownership_document: string;
  financial_statement: string;
  proposal: string;
  sales_location: string;
  equipment: string;
  materials: string;
  listing_documents: ListingDocumentsPayload[];
  listing_highlights: ListingHighlightsPayload[];
};

type ListingDocumentsPayload = {
  name: string;
  path: string;
};

type ListingHighlightsPayload = {
  title: string;
  content: string;
};
