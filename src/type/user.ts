export enum Role {
  FRANCHISOR = "FRANCHISOR",
  FRANCHISEE = "FRANCHISEE",
  ADMIN = "ADMIN",
}

export enum Status {
  WAITING = "WAITING",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
};

// @/types/user.ts
export type UpdateUserStatusPayload = {
  user_id: string;
  status: Status;
};