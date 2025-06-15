export type DocumentType = "PENDUKUNG" | "GUIDELINES";

export type ListingDocument = {
  id: string;
  type: DocumentType;
  name: string;
  path: string;
};

export type CreateTutorialPayload = {
  name: string;
  path: string;
  type: DocumentType;
};
