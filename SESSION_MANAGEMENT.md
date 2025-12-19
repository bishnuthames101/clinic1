# Session Management System

## Overview
This application now has a comprehensive inactivity-based session management system with different timeout periods for admin and patient users.

## Features Implemented

### 1. ✅ Admin Route Protection
- All `/admin/*` routes are fully protected
- Middleware checks for valid authentication token
- Verifies user has `admin` role
- Redirects to `/admin-login` if not authenticated
- Redirects to home if authenticated but not admin

### 2. ✅ Inactivity-Based Session Timeout

#### Admin Users
- **Timeout Period**: 90 seconds of inactivity
- **Warning**: Shows 15 seconds before logout
- Automatic logout after 90 seconds of no activity

#### Patient Users
- **Timeout Period**: 120 seconds (2 minutes) of inactivity
- **Warning**: Shows 15 seconds before logout
- Automatic logout after 2 minutes of no activity

### 3. ✅ Activity Tracking
The system tracks the following user activities:
- Mouse movements
- Mouse clicks
- Keyboard input
- Scrolling
- Touch events

**Activity updates are throttled** to only update every 5 seconds to reduce server load.

### 4. ✅ Warning System
- Users see a modal 15 seconds before automatic logout
- Modal shows countdown timer
- Options to:
  - "Stay Logged In" - Refreshes session
  - "Logout Now" - Immediate logout

### 5. ✅ Automatic Session Refresh
- Session automatically refreshes on user activity
- Server-side JWT token tracks `lastActivity` timestamp
- Activity updates sent to server every 5 seconds (when active)

### 6. ✅ Timeout Notifications
- Login pages show timeout messages
- Admin login: "Your session has expired due to inactivity (90 seconds)"
- Patient login: "Your session has expired due to inactivity"

## Technical Implementation

### Server-Side (NextAuth)
**File**: `src/app/api/auth/[...nextauth]/route.ts`

- JWT callback tracks `lastActivity` timestamp
- Checks inactivity on every session update
- Returns `null` to force logout if timeout exceeded
- Different timeout logic for admin vs patient roles

### Client-Side (Inactivity Monitor)
**File**: `src/components/InactivityMonitor.tsx`

- Runs globally across all authenticated pages
- Monitors user activity events
- Displays warning modal 15 seconds before timeout
- Handles automatic logout and redirects
- Updates session on activity

### Route Protection (Middleware)
**File**: `src/middleware.ts`

- Protects `/admin/*` routes
- Checks authentication token
- Verifies admin role for admin routes
- Protects `/dashboard/*` routes for all authenticated users

## How It Works

### Login Flow
1. User logs in via `/login` or `/admin-login`
2. JWT token created with `lastActivity` timestamp
3. Session stored with user role and data

### Activity Monitoring
1. `InactivityMonitor` component loads on authenticated pages
2. Listens for user activity events
3. On activity (throttled to 5s), calls `update()` to refresh session
4. Server updates `lastActivity` timestamp in JWT

### Timeout Flow
1. User stops interacting with the page
2. After (timeout - 15s), warning modal appears
3. Countdown shows remaining seconds
4. User can click "Stay Logged In" to refresh session
5. If no action, automatic logout after timeout
6. Redirect to appropriate login page with `?timeout=true`
7. Login page shows timeout notification

### Session Validation
Every time the session is accessed:
1. Server checks `lastActivity` timestamp
2. Compares with current time
3. If elapsed time > timeout period, returns null
4. Client logs out and redirects to login

## Testing

### Test Admin Timeout (90 seconds)
1. Login as admin (phone: 9800000000, password: admin123)
2. Navigate to `/admin`
3. Stop all activity (don't move mouse, type, or scroll)
4. After 75 seconds, warning modal should appear
5. After 90 seconds, automatic logout to `/admin-login`

### Test Patient Timeout (120 seconds)
1. Login as patient (phone: 9811111111, password: patient123)
2. Navigate to `/dashboard`
3. Stop all activity
4. After 105 seconds, warning modal should appear
5. After 120 seconds, automatic logout to `/login`

### Test Activity Refresh
1. Login and navigate to protected page
2. Continuously move mouse or type
3. Session should stay active indefinitely
4. Warning should never appear

## Configuration

To change timeout periods, edit `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
// Different timeouts for admin vs patient
const inactivityTimeout = token.role === 'admin'
  ? 90 * 1000  // 90 seconds for admin - CHANGE HERE
  : 120 * 1000 // 120 seconds for patient - CHANGE HERE
```

To change warning time (currently 15 seconds before), edit `src/components/InactivityMonitor.tsx`:

```typescript
const warningTime = timeout - 15000; // CHANGE 15000 to desired milliseconds
```

## Security Features

1. **JWT-based sessions** - Stateless and secure
2. **HTTP-only cookies** - Protected from XSS attacks
3. **Role-based access control** - Admin routes protected
4. **Automatic cleanup** - Sessions expire automatically
5. **Server-side validation** - All checks done on server
6. **Secure redirects** - Proper redirect handling

## Files Modified/Created

### Created
- `src/components/InactivityMonitor.tsx` - Client-side activity monitor
- `SESSION_MANAGEMENT.md` - This documentation

### Modified
- `src/app/api/auth/[...nextauth]/route.ts` - JWT callbacks with timeout logic
- `src/types/next-auth.d.ts` - Added `lastActivity` to types
- `src/app/layout.tsx` - Added InactivityMonitor component
- `src/components/auth/LoginForm.tsx` - Timeout notifications
- `src/app/admin-login/page.tsx` - Timeout notifications
- `src/middleware.ts` - Already had route protection

## Notes

- Session cookies are cleared on browser close (no persistent sessions)
- Activity is throttled to reduce server requests
- Warning appears 15 seconds before logout
- Different timeouts for different user roles
- All routes are properly protected
