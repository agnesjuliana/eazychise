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

export type FranchisorProfile = {
  id: string;
  ktp?: string;
  foto_diri?: string;
};

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

export type UpdateUserPayload = {
  id: string;
  name?: string;
  email?: string;
  role?: Role;
  status?: Status;
  profile?: FranchisorProfile;
};
