# Vendor Access Request and Login Plan

This plan outlines the steps to enable "Agents" (and other roles) to request `vendor` access and seamlessly "login" or switch to the vendor role once approved.

## Proposed Changes

### 1. Vendor Access Request Flow

#### [NEW] [RequestVendorAccessModal.tsx](file:///d:/CareerCraftly/onnxcrm/components/dashboard/RequestVendorAccessModal.tsx)
Create a new client component that allows users to request vendor access.
- It will trigger a [POST](file:///d:/CareerCraftly/onnxcrm/app/api/role-requests/route.ts#41-98) request to `/api/role-requests`.
- It will handle "pending" states to avoid duplicate requests.

#### [MODIFY] [DashboardPage](file:///d:/CareerCraftly/onnxcrm/app/dashboard/page.tsx)
Add a "Request Vendor Access" card/button for users who are not yet vendors.
- Display a "Pending Approval" status if a request exists.

### 2. Multi-Role Support (Optional but better for "Agents")

If agents need to *remain* agents but *also* act as vendors, we should update the user model.

#### [MODIFY] [User.ts](file:///d:/CareerCraftly/onnxcrm/lib/models/User.ts)
- Change `role: UserRole` to `activeRole: UserRole`.
- Add `approvedRoles: UserRole[]`.

#### [NEW] [api/auth/switch-role/route.ts](file:///d:/CareerCraftly/onnxcrm/app/api/auth/switch-role/route.ts)
- An endpoint to switch the `activeRole`.
- It will update the [User](file:///d:/CareerCraftly/onnxcrm/lib/models/User.ts#35-46) document and re-issue the `accessToken` with the new role.

### 3. Login as Vendor Flow

#### [MODIFY] [Navbar](file:///d:/CareerCraftly/onnxcrm/components/Navbar.tsx) (or User Profile Menu)
- If the user has both `business_dev` and `vendor` roles, show a "Switch to Vendor Mode" toggle.
- When clicked, it calls the `switch-role` API and reloads the dashboard.

## Verification Plan

### Manual Verification
1. Log in as a `business_dev` user.
2. Click "Request Vendor Access".
3. Log in as a `super_admin`.
4. Approve the request in the Role Requests dashboard.
5. Log back in (or refresh) as the `business_dev` user.
6. Verify the "Switch to Vendor Mode" appears and works.
