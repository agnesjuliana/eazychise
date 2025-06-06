export type User = {
    id: string;
    name: string;
    email:string;
    role: "franchisee" | "franchisor" | "admin";
    status: "pending" | "active" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}