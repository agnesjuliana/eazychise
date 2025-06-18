# Route Protection in EazyChise

This document explains how role-based route protection is implemented in the EazyChise application.

## Overview

The application implements a Higher-Order Component (HOC) called `withAuth` that provides role-based access control for all routes in the application. This HOC is used to wrap page components and ensures that users can only access routes appropriate for their role and account status.

## Role-Based Access Control

The application has three main user roles:

1. **Franchisee** - Can only access routes starting with `/franchisee/`
2. **Franchisor** - Can only access routes starting with `/franchisor/`
3. **Admin** - Can only access routes starting with `/admin/`

Additionally, there are special route types:

- **Public routes** - Like `/login`, `/register`, `/start`, `/home` - accessible to all users
- **Verification route** - `/verifikasi` - only accessible to users with `WAITING` status

## Account Status Rules

Users can have one of the following statuses:

1. **WAITING** - Account is waiting for approval
2. **ACCEPTED** - Account has been approved
3. **REJECTED** - Account has been rejected

- Users with `WAITING` status can only access the `/verifikasi` route
- Users with `ACCEPTED` status can access routes based on their role
- All users can access public routes regardless of status

## How to Use the withAuth HOC

The `withAuth` HOC accepts two parameters:

1. The component to wrap
2. The route role (optional, defaults to "ANY")

### Available Route Roles

- `"FRANCHISEE"` - For franchisee-only routes
- `"FRANCHISOR"` - For franchisor-only routes
- `"ADMIN"` - For admin-only routes
- `"ANY"` - For routes that require authentication but can be accessed by any role
- `"GUEST"` - For routes that should only be accessible when NOT logged in
- `"OPTIONAL"` - For routes that can be accessed whether logged in or not
- `"VERIFICATION"` - For the verification page

### Usage Examples

#### Protecting a Franchisor Route

```tsx
// src/app/franchisor/home/page.tsx
"use client";

import withAuth from "@/lib/withAuth";

function FranchisorHomePage({ user }) {
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {/* Page content */}
    </div>
  );
}

export default withAuth(FranchisorHomePage, "FRANCHISOR");
```

#### Protecting an Admin Route

```tsx
// src/app/admin/dashboard/page.tsx
"use client";

import withAuth from "@/lib/withAuth";

function AdminDashboardPage({ user }) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Page content */}
    </div>
  );
}

export default withAuth(AdminDashboardPage, "ADMIN");
```

#### Creating a Guest-Only Route (Login/Register)

```tsx
// src/app/login/page.tsx
"use client";

import withAuth from "@/lib/withAuth";

function LoginPage() {
  // Login form implementation
  return (
    <div>
      <h1>Login</h1>
      {/* Login form */}
    </div>
  );
}

export default withAuth(LoginPage, "GUEST");
```

#### Verification Page

```tsx
// src/app/verifikasi/page.tsx
"use client";

import withAuth from "@/lib/withAuth";

function VerificationPage({ user }) {
  return (
    <div>
      <h1>Account Verification</h1>
      <p>Your account is being verified. Please wait.</p>
    </div>
  );
}

export default withAuth(VerificationPage, "VERIFICATION");
```

## Implementation Details

The HOC performs the following checks:

1. Fetches the current user data from `/api/user/me`
2. Checks if the user is authenticated
3. Checks if the user's role matches the required role for the route
4. Checks if the user's status allows access to the route
5. Redirects to appropriate pages based on these checks

The HOC also handles loading states and provides error messages when access is denied.

## Additional Notes

- The HOC passes the user data to the wrapped component via the `user` prop
- The HOC automatically refreshes authentication when the tab regains focus
- All redirections show appropriate loading indicators
- Error messages are displayed using toast notifications
