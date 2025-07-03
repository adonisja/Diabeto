# Diabeto App - Bug Log and Fixes

## 📋 Overview
This document maintains a comprehensive log of all bugs encountered during development, their root causes, solutions, and prevention strategies. This serves as a knowledge base for future development and debugging.

## 🔍 Bug Classification System
- **🔴 Critical**: App crashes, data loss, security vulnerabilities
- **🟡 Major**: Significant functional issues, user experience problems
- **🟢 Minor**: UI glitches, performance issues, minor functional problems

---

## 🐛 Bug Log (Reverse Chronological Order)

### Bug #22: Admin Dashboard Mounted During Login Routing Process
**Date Encountered**: 2025-07-03  
**Date Fixed**: 2025-07-03  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
After clicking "Continue to App", users were seeing an inappropriate "Access Denied" alert stating "You must be an administrator to access this section" for a brief instant before being redirected to their appropriate dashboard. This occurred because:

1. The admin dashboard screen was being mounted during the routing process
2. Its access control `useEffect` was immediately showing the alert when detecting non-admin users
3. This happened even though users weren't actually trying to access the admin section

**Root Cause Analysis:**
1. **React Navigation Component Lifecycle**: React Navigation (used by Expo Router) mounts all child components before routing completes
2. **Immediate Side Effects**: Dashboard components' `useEffect` hooks fired immediately upon mounting, before role-based redirection could occur
3. **Race Condition**: Multiple redirect systems (main protected layout + dashboard access control) competed during routing
4. **Architectural Issue**: The "redirect after mount" approach inherently allows unauthorized components to mount and execute side effects

**Error Flow:**
1. User clicks "Continue to App" 
2. Router navigates to protected section
3. React Navigation mounts all route components (including admin dashboard)
4. Admin dashboard access control immediately detects non-admin user
5. Shows access denied alert before main protected layout can redirect user

**Solution Applied - Landing Page Approach:**

**Phase 1: Temporary Fix (Delays)**
Initially added delays to dashboard access control to avoid race conditions:
```typescript
useEffect(() => {
    if (!loadingProfile && userProfile && userProfile.role !== 'admin') {
        const timeoutId = setTimeout(() => {
            if (userProfile.role !== 'admin') {
                Alert.alert("Access Denied", "You must be an administrator...");
                router.replace('/(protected)/home');
            }
        }, 500); // Wait for routing to settle
        
        return () => clearTimeout(timeoutId);
    }
}, [userProfile, loadingProfile, router]);
```

**Phase 2: Architectural Refactor (Landing Page)**
Implemented a proper "landing page" approach that prevents unauthorized components from mounting:

1. **Created Protected Landing Page:**
```typescript
// /app/(protected)/index.tsx - Serves as neutral landing page
export default function ProtectedIndex() {
    const { user, userProfile, loading, loadingProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading || loadingProfile) return;
        
        if (!user || !user.emailVerified) {
            router.replace('/(auth)');
            return;
        }
        
        if (!userProfile?.profileCompleted) {
            router.replace('/(protected)/userProfile');
            return;
        }
        
        // Navigate to appropriate dashboard based on role
        switch (userProfile.role) {
            case 'patient':
                router.replace('/(protected)/(patient)');
                break;
            case 'caretaker':
                router.replace('/(protected)/(caretaker)');
                break;
            case 'doctor':
                router.replace('/(protected)/(doctor)');
                break;
            case 'admin':
                router.replace('/(protected)/(admin)');
                break;
            default:
                router.replace('/(protected)/userProfile');
                break;
        }
    }, [loading, loadingProfile, user, userProfile, router]);

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradient}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Loading your dashboard...</Text>
                </View>
            </LinearGradient>
        </View>
    );
}
```

2. **Simplified Protected Layout:**
```typescript
// /app/(protected)/_layout.tsx - Simplified to remove complex redirection logic
export default function ProtectedLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!user || !user.emailVerified) {
        return <Redirect href="/(auth)" />;
    }

    // All role-based navigation logic is handled by the landing page at index.tsx
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="home" />
            <Stack.Screen name="userProfile" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(caretaker)" />
            <Stack.Screen name="(doctor)" />
            <Stack.Screen name="(patient)" />
        </Stack>
    );
}
```

3. **Removed Dashboard Access Control Logic:**
Eliminated unnecessary access control checks and timeouts from dashboard components since the landing page now prevents unauthorized access.

**Files Modified:**
- `/app/(protected)/index.tsx` (new landing page)
- `/app/(protected)/_layout.tsx` (simplified)
- `/app/(protected)/(admin)/index.tsx` (removed access control)
- `/app/(protected)/(doctor)/index.tsx` (removed access control)
- `/PROJECT_STRUCTURE.md` (updated with new architecture)

**Architectural Benefits:**
- **Eliminates Race Conditions**: Only authorized dashboards mount
- **Improves Security**: Prevents unauthorized components from executing
- **Better User Experience**: No inappropriate alerts or dashboard flashes
- **Cleaner Code**: Separation of concerns between routing and access control
- **Maintainability**: Single point of role-based navigation logic

**Prevention Strategy:**
- Use "landing page" approach for role-based routing instead of "redirect after mount"
- Centralize navigation logic in a single component
- Avoid complex access control logic in dashboard components
- Test routing thoroughly with different user roles
- Test the complete login → dashboard flow for all user roles

**Testing Results:**
- ✅ No more inappropriate access denied alerts during login
- ✅ Smooth routing from login to appropriate dashboards
- ✅ Access control still works when users actually try to access restricted sections
- ✅ Clean loading experience for all user roles

---

### Bug #21: Inappropriate "Access Denied" Alert on Login
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
An "Access Denied - You must be an administrator to access this section" alert was showing up on every login, regardless of the user's role or intended destination. This was confusing and created a poor user experience, as users were seeing access denied messages even when they weren't trying to access restricted content.

**Root Cause Analysis:**
1. **Premature Role Checking**: Role-specific `_layout.tsx` files (admin and doctor) were checking user roles during app initialization
2. **Missing Route Context**: The access control logic was running without checking if the user was actually navigating to those sections
3. **Layout Component Loading**: During router initialization, all layout components were being instantiated and their `useEffect` hooks were running

**Error Flow:**
1. User logs in with any role (patient, caretaker, etc.)
2. Router initializes and loads all layout components
3. Admin and Doctor `_layout.tsx` components run their access control logic
4. Since user isn't admin/doctor, alert shows immediately
5. User gets confused by inappropriate access denied message

**Solution Applied:**

1. **Added Route Segment Checking:**
```typescript
// BEFORE (in both admin and doctor _layout.tsx):
useEffect(() => {
    if (!loadingProfile) {
        if (!user) {
            router.replace('/(auth)/Signin');
        } else if (userProfile?.role !== 'admin') {
            Alert.alert("Access Denied", "You must be an administrator to access this section.");
            router.replace('/(protected)/home');
        }
    }
}, [user, userProfile, loadingProfile, router]);

// AFTER:
import { useSegments } from 'expo-router';
const segments = useSegments();

useEffect(() => {
    if (!loadingProfile) {
        const isInAdminSection = segments.some(segment => segment === '(admin)');
        
        if (!user) {
            router.replace('/(auth)/Signin');
        } else if (userProfile?.role !== 'admin' && isInAdminSection) {
            Alert.alert("Access Denied", "You must be an administrator to access this section.");
            router.replace('/(protected)/home');
        }
    }
}, [user, userProfile, loadingProfile, router, segments]);
```

2. **Route-Aware Access Control:**
   - Now only shows access denied alerts when users actually try to navigate to restricted sections
   - Preserves security by still preventing unauthorized access
   - Eliminates false-positive alerts during normal app initialization

**Files Modified:**
- `/app/(protected)/(admin)/_layout.tsx`
- `/app/(protected)/(doctor)/_layout.tsx`

**Prevention Strategy:**
- Always check route context before showing access control alerts
- Use `useSegments()` to determine actual user navigation intent
- Test access control logic with different user roles during login flow
- Separate initialization logic from access control logic

**Testing Results:**
- ✅ No more inappropriate access denied alerts on login
- ✅ Access control still works when users actually try to access restricted sections
- ✅ TypeScript compilation successful
- ✅ Proper role-based redirection maintained

---

### Bug #20: Duplicate Headers on Role-Based Dashboards
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
All role-based dashboard screens (admin, doctor, caretaker, patient) had duplicate headers:
1. Stack navigation header from the `_layout.tsx` files showing titles like "Admin Dashboard", "Doctor Dashboard", etc.
2. Custom `AppHeader` component also showing the same or similar titles
This created redundant headers that cluttered the UI and created a poor user experience.

**Root Cause Analysis:**
1. **Competing Header Systems**: Both Stack navigation and custom AppHeader were enabled simultaneously
2. **Inconsistent Header Strategy**: Some screens used Stack headers while others used AppHeader
3. **Layout Configuration**: Role-specific `_layout.tsx` files had `headerShown: true` while using custom headers

**Solution Applied:**

1. **Disabled Stack Navigation Headers for Dashboard Screens:**
```typescript
// In all role-specific _layout.tsx files:
// BEFORE:
<Stack.Screen
    name="index"
    options={{
        headerTitle: 'Admin Dashboard',
        headerShown: true,
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#3b5998' },
    }}
/>

// AFTER:
<Stack.Screen
    name="index"
    options={{
        headerShown: false, // Using custom AppHeader instead
    }}
/>
```

2. **Maintained Custom AppHeader Strategy:**
   - Kept the beautiful, gradient-styled `AppHeader` components
   - Preserved the integrated `UserMenu` functionality
   - Maintained consistent branding and UX across all dashboards

**Files Modified:**
- `/app/(protected)/(admin)/_layout.tsx`
- `/app/(protected)/(doctor)/_layout.tsx` 
- `/app/(protected)/(caretaker)/_layout.tsx`
- `/app/(protected)/(patient)/_layout.tsx`

**Prevention Strategy:**
- Document header strategy clearly in component documentation
- Use consistent header approach across all main dashboard screens
- Keep Stack headers only for secondary screens that don't use AppHeader
- Regular UI/UX reviews to catch visual inconsistencies

**Testing Results:**
- ✅ TypeScript compilation successful
- ✅ No duplicate headers on any dashboard screens
- ✅ Custom AppHeader with UserMenu preserved
- ✅ Navigation functionality maintained

---

### Bug #19: InvitePatientForm Using Non-existent Firebase Functions
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

**Problem Description:**
The InvitePatientForm component was trying to use Firebase Functions (`httpsCallable`) and import `functions` from the Firebase config, but:
1. Firebase Functions were not set up in the project
2. The `functions` export didn't exist in firebaseConfig.ts
3. The logAction function calls had incorrect parameter order
4. The component was overly complex for basic invitation functionality

**Error Messages:**
```typescript
// Compilation errors:
Module '"@/firebase/firebaseConfig"' has no exported member 'functions'.
Cannot find name 'httpsCallable'.
Argument of type '"CARETAKER_INVITATION_SENT"' is not assignable to parameter of type 'UserRole'.
```

**Root Cause Analysis:**
1. **Unnecessary Complexity**: Using Firebase Functions for simple invitation logic
2. **Missing Infrastructure**: Functions weren't deployed or configured
3. **Incorrect API Usage**: Wrong parameter order in logAction calls
4. **Over-engineering**: Simple Firestore operations didn't need cloud functions

**Solution Applied:**

1. **Removed Firebase Functions Dependency:**
```typescript
// REMOVED:
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase/firebaseConfig';

// ADDED:
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
```

2. **Implemented Direct Firestore Approach:**
```typescript
// Check if patient exists
const usersQuery = query(
    collection(db, 'users'), 
    where('email', '==', patientEmail.trim().toLowerCase())
);
const querySnapshot = await getDocs(usersQuery);

// Create invitation record
const invitationData = {
    caretakerUid: user.uid,
    caretakerEmail: user.email,
    caretakerName: userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : user.email,
    patientEmail: patientEmail.trim().toLowerCase(),
    patientUid: patientId,
    status: 'pending',
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    type: 'patient_invitation'
};

const docRef = await addDoc(collection(db, 'invitations'), invitationData);
```

3. **Fixed LogAction Calls:**
```typescript
// CORRECTED parameter order:
await logAction(
    user.uid,
    userProfile.username || user.email?.split('@')[0] || 'unknown-user',
    user.email || 'unknown-email',
    userProfile.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified',
    'CARETAKER_INVITATION_SENT',
    'success',
    { 
        invitedPatientEmail: patientEmail.trim(),
        invitationId: docRef.id,
        patientExists: !!patientId,
        patientUid: patientId
    }
);
```

4. **Added Firestore Security Rules:**
```javascript
// Collection: invitations (top-level collection)
match /invitations/{invitationId} {
  // Create: Authenticated caretakers can create invitations
  allow create: if isAuthenticated()
                && (request.auth.token.role == 'caretaker' || 
                    (exists(/databases/$(database)/documents/artifacts/$(getAppId())/users/$(request.auth.uid)) &&
                     get(/databases/$(database)/documents/artifacts/$(getAppId())/users/$(request.auth.uid)).data.role == 'caretaker'))
                && request.resource.data.caretakerUid == request.auth.uid
                && request.resource.data.status == 'pending'
                && request.resource.data.type == 'patient_invitation';

  // Read: Caretakers and patients can read relevant invitations
  allow read: if isAuthenticated() 
              && (request.auth.uid == resource.data.caretakerUid 
                  || request.auth.token.email == resource.data.patientEmail
                  || isAdmin());

  // Update: Patients can accept/reject invitations
  allow update: if isAuthenticated()
                && request.auth.token.email == resource.data.patientEmail
                && resource.data.status == 'pending'
                && request.resource.data.status in ['accepted', 'rejected'];
}
```

**Technical Improvements:**
- ✅ **Simplified Architecture**: Removed unnecessary Firebase Functions dependency
- ✅ **Direct Firestore Operations**: More efficient and reliable
- ✅ **Proper Error Handling**: Better user feedback and logging
- ✅ **Security Rules**: Comprehensive protection for invitation data
- ✅ **TypeScript Compliance**: Fixed all compilation errors
- ✅ **Better UX**: Clear success/error messages with proper timing

**Functionality Enhanced:**
- ✅ **Patient Detection**: Checks if invited email already has an account
- ✅ **Expiration Logic**: Invitations expire after 7 days
- ✅ **Audit Trail**: Complete logging of invitation actions
- ✅ **Status Tracking**: Pending/accepted/rejected invitation states
- ✅ **Data Validation**: Email format validation and sanitization

**Files Modified:**
- `components/coreComponents/InvitePatientForm.tsx` - Complete rewrite
- `firestore.rules` - Added invitations collection rules
- Deployed updated security rules to Firebase

**Testing Results:**
- ✅ No compilation errors
- ✅ Firestore rules deployed successfully
- ✅ Component ready for integration testing
- ✅ Proper logging functionality restored

**Future Considerations:**
- Add email notification system for invitation sending
- Implement invitation acceptance flow in patient dashboard
- Add invitation management interface for caretakers
- Consider batch invitation functionality for multiple patients

---

### Bug #18: Poor UX/UI of Sign-Out and Profile Access
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
The floating sign-out button created a clunky user experience and could potentially block content on pages. Additionally, users had no easy way to access their profile from all protected pages, requiring navigation back to specific screens.

**User Experience Issues:**
- Floating buttons could overlap and block page content
- No universal profile access across all pages
- Inconsistent navigation patterns
- Accessibility concerns with floating elements
- Mobile-unfriendly design patterns

**Root Cause Analysis:**
1. **Poor UX Pattern**: Floating buttons can obstruct content
2. **Accessibility Issues**: Floating elements harder to reach on mobile
3. **Missing Profile Access**: No universal way to access user profile
4. **Inconsistent Design**: Different navigation patterns across pages

**Solution Applied:**

1. **Created Modern UserMenu Component:**
```typescript
// components/coreComponents/UserMenu.tsx
interface UserMenuProps {
    style?: 'header' | 'inline';
    position?: 'right' | 'left' | 'center';
    theme?: 'light' | 'dark' | 'auto';
    backgroundColor?: string;
}
```

**Key Features:**
- **Avatar Button**: Shows user initials with role-based color coding
- **Role Indicator**: Visual icon showing user role (admin, doctor, etc.)
- **Animated Menu**: Smooth slide-in menu with proper animations
- **Profile Access**: Direct link to user profile editing
- **Smart Logout**: Confirmation dialog with animated loading states
- **Accessibility**: Full accessibility labels and hints
- **Responsive**: Works well on all screen sizes

2. **Created AppHeader Component:**
```typescript
// components/coreComponents/AppHeader.tsx
// - Universal header with integrated UserMenu
// - Gradient and solid background support
// - SafeArea handling for iOS
// - Consistent title/subtitle display
```

3. **Updated All Protected Pages:**
- **Home Page**: Uses AppHeader with gradient background
- **Admin Dashboard**: Header with admin-themed colors
- **Doctor Dashboard**: Header with medical-themed colors
- **Caretaker Dashboard**: Header with caretaker-themed colors
- **Patient Dashboard**: Header with patient-themed colors
- **User Profile**: Header with profile context

**Technical Implementation:**
- Replaced all floating sign-out buttons with header-integrated UserMenu
- Added outerContainer styles to all pages for proper layout
- Implemented consistent theming across all dashboards
- Added proper TypeScript interfaces for all components
- Enhanced accessibility with proper labels and navigation

**UX Improvements:**
- ✅ No content blocking from floating elements
- ✅ Universal profile access from all pages
- ✅ Consistent navigation patterns
- ✅ Mobile-friendly design
- ✅ Role-based visual indicators
- ✅ Smooth animations and feedback
- ✅ Proper loading states during logout

**Files Modified:**
- `components/coreComponents/UserMenu.tsx` - Enhanced with header integration
- `components/coreComponents/AppHeader.tsx` - New universal header component
- `app/(protected)/home.jsx` - Updated to use AppHeader
- `app/(protected)/(admin)/index.tsx` - Integrated AppHeader
- `app/(protected)/(doctor)/index.tsx` - Integrated AppHeader
- `app/(protected)/(caretaker)/index.tsx` - Integrated AppHeader
- `app/(protected)/(patient)/index.tsx` - Integrated AppHeader
- `app/(protected)/userProfile.tsx` - Integrated AppHeader

**Testing Results:**
- ✅ All pages now have consistent header design
- ✅ User menu works properly on all screens
- ✅ Profile access available everywhere
- ✅ No TypeScript compilation errors
- ✅ Proper logout functionality maintained
- ✅ Role-based theming works correctly

**Future Considerations:**
- Monitor user feedback on the new navigation pattern
- Consider adding more quick actions to the user menu
- Potential expansion of header customization options

---

### Bug #17: Missing Sign-Out Functionality on Protected Pages
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
Sign-out functionality was missing from most protected pages in the app. Users could access dashboards (admin, doctor, caretaker, patient) and other protected pages but had no way to sign out except from the home page, creating a poor user experience and potential security issue.

**User Experience Issue:**
- Admin dashboard had no sign-out option
- Doctor, caretaker, and patient dashboards lacked sign-out
- Users trapped in dashboard without easy logout access
- Security concern: no quick way to sign out from sensitive areas

**Root Cause Analysis:**
1. **Inconsistent Implementation**: Only home page had sign-out functionality
2. **No Universal Component**: Each page would need individual sign-out implementation
3. **Security Gap**: Users couldn't quickly sign out from admin/medical dashboards
4. **Poor UX**: No consistent sign-out access across the app

**Solution Applied:**

1. **Created Universal SignOut Component:**
```typescript
// components/coreComponents/SignOutButton.tsx
// - Flexible styling (floating, header, inline)
// - Configurable positioning and sizing
// - Consistent logout logic with proper logging
// - Confirmation dialog for safety
// - Proper error handling
```

2. **Added Floating Sign-Out Buttons:**
- **Admin Dashboard**: Top-right floating button
- **Doctor Dashboard**: Top-right floating button  
- **Caretaker Dashboard**: Top-right floating button
- **Patient Dashboard**: Top-right floating button
- **User Profile Page**: Top-right floating button
- **Home Page**: Replaced old button with universal component

3. **Component Features:**
```typescript
interface SignOutButtonProps {
    style?: 'floating' | 'header' | 'inline';
    position?: 'top-right' | 'bottom-right' | 'custom';
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
    customStyle?: object;
}
```

4. **Enhanced User Experience:**
- Consistent placement across all pages
- Confirmation dialog prevents accidental logout
- Proper visual feedback and styling
- Accessible from any protected page
- Maintains existing logout logging functionality

5. **Security Improvements:**
- Quick access to sign-out from sensitive admin areas
- Consistent logout behavior across all pages
- Proper session termination with logging
- User confirmation prevents accidental logout

**Files Modified:**
- `/components/coreComponents/SignOutButton.tsx` - New universal component
- `/app/(protected)/(admin)/index.tsx` - Added floating sign-out
- `/app/(protected)/(doctor)/index.tsx` - Added floating sign-out
- `/app/(protected)/(caretaker)/index.tsx` - Added floating sign-out
- `/app/(protected)/(patient)/index.tsx` - Added floating sign-out
- `/app/(protected)/userProfile.tsx` - Added floating sign-out
- `/app/(protected)/home.jsx` - Replaced old button with universal component
- `/BUGS_AND_FIXES.md` - Updated documentation

**Implementation Details:**
- **Positioning**: Consistent top-right floating position (60px from top, 20px from right)
- **Styling**: Red button with logout icon and text
- **Confirmation**: "Are you sure you want to sign out?" dialog
- **Logging**: Maintains all existing logout audit trail functionality
- **Error Handling**: Proper error alerts and failed logout logging

**Prevention Strategy:**
- Universal component ensures consistency
- All new protected pages should include SignOutButton
- Component documented for future development
- Standardized logout UX across entire app

**Current Sign-Out Access:**
- ✅ Available on ALL protected pages
- ✅ Consistent positioning and styling
- ✅ Proper confirmation and error handling
- ✅ Complete audit logging maintained
- ✅ Security-first approach implemented

---

### Bug #16: Implemented Doctor Credential Verification System
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟢 Enhancement  
**Status**: ✅ Implemented

**Feature Description:**
Implemented a comprehensive doctor credential verification system to replace direct doctor role assignment with a proper medical credential review process.

**New Role Assignment Architecture:**
1. **New Users**: Can only register as `patient` or `caretaker`
2. **Doctor Role**: Must be requested by caretaker → verified by admin → approved
3. **Admin Role**: Remains admin-only assignment (unchanged)
4. **Credential Verification**: Full medical license and education verification workflow

**Implementation Details:**

1. **Updated User Registration:**
```typescript
// Only patient/caretaker roles available for new users
{(userProfile?.role === 'admin' ? 
    ['patient', 'caretaker', 'doctor', 'admin'] : 
    ['patient', 'caretaker']  // Doctor removed from general signup
).map(r => (...))}
```

2. **Doctor Credential Request Component:**
- Medical license number validation
- Medical school and graduation year verification
- Years of experience tracking
- Specialization and hospital affiliation
- Additional notes and documentation
- Proper form validation and submission

3. **Caretaker Dashboard Enhancement:**
- Added "Upgrade to Doctor" section
- Modal-based credential request form
- Clear explanation of verification process
- Professional UI with medical theming

4. **Admin Review System:**
- Dedicated doctor request review interface
- View all pending credential verification requests
- Approve/reject functionality with review notes
- Automatic role update upon approval
- Comprehensive audit logging

5. **Enhanced Security Rules:**
```plaintext
// Updated Firestore rules:
// - Regular users: patient/caretaker only
// - Doctor role: admin assignment only (through verification)
// - Admin role: admin assignment only (unchanged)
// - Doctor requests: caretakers can create, admins can review
```

**Components Created:**
- `/components/coreComponents/DoctorCredentialRequest.tsx` - Credential submission form
- `/components/coreComponents/DoctorRequestReview.tsx` - Admin review interface
- Enhanced `/app/(protected)/(caretaker)/index.tsx` - Added upgrade option
- Enhanced `/app/(protected)/(admin)/index.tsx` - Added review functionality

**Database Collections:**
- `doctorRequests/{requestId}` - Stores credential verification requests
- Enhanced logging for all credential-related actions
- Immutable audit trail for compliance

**Firestore Security:**
- Doctor requests: caretaker create, admin review/approve
- Role assignments: doctor role requires admin approval
- Comprehensive field validation and security checks
- Audit trail preservation (no deletes allowed)

**Logging Enhancement:**
All actions properly logged with outcomes:
- `DOCTOR_CREDENTIAL_REQUEST_SUBMITTED`
- `DOCTOR_CREDENTIAL_REQUEST_FAILED` 
- `DOCTOR_REQUEST_APPROVED`
- `DOCTOR_REQUEST_REJECTED`
- `DOCTOR_REQUEST_REVIEW_FAILED`

**User Experience:**
- Clear upgrade path for caretakers to become doctors
- Professional credential submission process
- Admin dashboard for efficient request processing
- Proper feedback and status tracking
- Medical-grade compliance and security

**Files Modified:**
- `/app/(protected)/userProfile.tsx` - Removed doctor from general signup
- `/app/(protected)/(caretaker)/index.tsx` - Added credential request feature
- `/app/(protected)/(admin)/index.tsx` - Added review functionality
- `/components/coreComponents/DoctorCredentialRequest.tsx` - New component
- `/components/coreComponents/DoctorRequestReview.tsx` - New component
- `/firestore.rules` - Updated security rules and added doctor requests rules
- `/BUGS_AND_FIXES.md` - Updated documentation

**Prevention Strategy:**
- Medical-grade security controls
- Proper credential verification workflow
- Comprehensive audit logging
- Role-based access controls
- Immutable audit trails

**Current Doctor Registration Process:**
1. **Initial Registration**: User registers as caretaker
2. **Credential Submission**: Caretaker submits medical credentials via dashboard
3. **Admin Review**: Administrator reviews credentials and documentation
4. **Decision**: Admin approves/rejects with notes
5. **Role Update**: Upon approval, user role automatically updated to doctor
6. **Audit Trail**: All actions logged for compliance and monitoring

---

### Bug #15: Admin User Stuck on Profile Completion Page
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
Admin users registered in Firebase Console were getting stuck on the profile completion page because:
1. Admin role was excluded from role selection UI for security reasons
2. Admin dashboard file was corrupted (contained userProfile content instead of admin dashboard)
3. No way for existing admin to complete their profile with admin role

**User Experience Issue:**
- Admin users couldn't complete their profile setup
- No access to admin dashboard features
- Stuck in profile completion loop despite having admin privileges in Firebase

**Root Cause Analysis:**
1. **Missing Admin Role Option**: Profile completion page excluded admin role from UI for non-admin users, but also excluded it for existing admins
2. **Corrupted Admin Dashboard**: `app/(protected)/(admin)/index.tsx` contained wrong content (userProfile instead of admin dashboard)
3. **Security Restriction Too Broad**: Admin role selection was completely disabled rather than conditional

**Solution Applied:**

1. **Fixed Admin Dashboard:**
```typescript
// Created proper admin dashboard with:
// - Role assignment functionality
// - User management features
// - System monitoring capabilities
// - Security logging
```

2. **Made Admin Role Conditional:**
```typescript
// In userProfile.tsx - only show admin role if user is already admin
{(userProfile?.role === 'admin' ? 
    ['patient', 'caretaker', 'doctor', 'admin'] : 
    ['patient', 'caretaker', 'doctor']
).map(r => (...))}
```

3. **Enhanced Admin Features:**
- Added role assignment functionality for admins
- Created proper admin dashboard interface
- Added security notices and logging
- Display current admin user information

**Files Modified:**
- `/app/(protected)/(admin)/index.tsx` - Recreated admin dashboard
- `/app/(protected)/userProfile.tsx` - Made admin role conditional
- `/BUGS_AND_FIXES.md` - Updated documentation

**Prevention Strategy:**
- Add file content validation checks
- Implement role-specific UI testing
- Document admin setup process clearly
- Add admin dashboard component tests

**Current Admin Registration Process:**
1. **Firebase Console**: Set custom claims or admin role in Authentication
2. **Profile Completion**: Existing admins can now select admin role during profile setup
3. **Dashboard Access**: Proper admin dashboard with role assignment capabilities
4. **Role Management**: Admins can assign roles to other users via dashboard

---

### Bug #14: Home Page Not Redirecting to Role-Specific Dashboards
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
Users were getting stuck on the general home page `/(protected)/home` without being automatically redirected to their role-specific dashboards. The ProtectedLayout wasn't handling redirection from the home page, only from the protected root and userProfile page.

**User Experience Issue:**
- Users would land on a generic home page instead of their role-specific dashboard
- No automatic navigation to appropriate sections based on user role
- Required manual navigation to access role-specific features

**Root Cause Analysis:**
1. **Incomplete Redirect Logic**: ProtectedLayout only redirected from `/(protected)` root and userProfile page
2. **Missing Home Page Check**: No logic to handle users landing on `/(protected)/home`
3. **Navigation Gap**: Users could access home page but get stuck there
4. **Segments Not Covered**: The segments `["(protected)", "home"]` weren't included in redirect conditions

**Solution Applied:**

1. **Enhanced ProtectedLayout Redirect Logic:**
```typescript
// Added home page check
const isOnHomePage = segments.length === 2 && segments[0] === '(protected)' && segments[1] === 'home';

// Updated redirect condition
if ((isAtProtectedRoot || isOnUserProfileWithCompletedProfile || isOnHomePage) && !hasRedirectedRef.current && !isInRoleSection) {
    // Redirect to role-specific dashboard
}
```

2. **Added Direct Home Page Redirection:**
```javascript
// Added useEffect in home.jsx for backup redirection
useEffect(() => {
    if (userProfile?.profileCompleted && userProfile?.role) {
        console.log(`HomeScreen: Redirecting user with role ${userProfile.role} to dashboard`);
        switch (userProfile.role) {
            case 'patient':
                router.replace('/(protected)/(patient)');
                break;
            case 'caretaker':
                router.replace('/(protected)/(caretaker)');
                break;
            case 'doctor':
                router.replace('/(protected)/(doctor)');
                break;
            case 'admin':
                router.replace('/(protected)/(admin)');
                break;
            default:
                router.replace('/(protected)/userProfile');
                break;
        }
    }
}, [userProfile?.profileCompleted, userProfile?.role, router]);
```

3. **Enhanced Logging**: Added better logging to track redirection source and destination

**Redirect Flow Now:**
1. **From Protected Root**: `/(protected)` → Role-specific dashboard
2. **From Home Page**: `/(protected)/home` → Role-specific dashboard  
3. **From Profile Completion**: `/(protected)/userProfile` → Role-specific dashboard
4. **Backup in Home Component**: Direct redirection if layout misses it

**User Experience Improvements:**
- ✅ **Seamless Navigation**: Users automatically directed to appropriate dashboards
- ✅ **Role-Based Experience**: Each user type sees their relevant interface immediately
- ✅ **No Dead Ends**: No more getting stuck on generic home page
- ✅ **Consistent Behavior**: Same redirection logic across different entry points

**Prevention Strategy:**
- **Comprehensive redirect testing**: Test all possible navigation paths to protected areas
- **Segment mapping**: Ensure all protected routes have appropriate redirection logic
- **User journey testing**: Test complete user flows from authentication to dashboard access
- **Fallback mechanisms**: Multiple layers of redirection to prevent users getting stuck

**Key Lesson:**
Navigation systems should handle all possible user entry points, not just the expected ones. Users can land on any protected route through various means (deep links, manual navigation, etc.), so redirection logic must be comprehensive.

---

### Bug #13: LogService Permission Error After Sign-Out (Recurring Issue)
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

**Problem Description:**
LogService was throwing permission errors when trying to log actions after users were signed out, causing "Missing or insufficient permissions" errors. This is a recurring pattern that needed systematic fixing.

**Error Messages:**
```
ERROR  ❌ LogService: Error logging action: [FirebaseError: Missing or insufficient permissions.]
LOG  User signed out successfully.
```

**Root Cause Analysis:**
1. **Authentication Required for Logging**: LogService requires authenticated user context to write to Firestore
2. **Post-Signout Logging**: Multiple locations were logging actions AFTER calling `auth.signOut()`
3. **Old LogService Signature**: Some files were still using the old function signature without username parameter
4. **Recurring Pattern**: Same issue occurred in multiple files that weren't previously fixed

**Files with Issues:**
1. **`hooks/useAuthNavigation.ts`**: Logged `UNVERIFIED_USER_LOGOUT` after sign-out
2. **`app/(protected)/home.jsx`**: Logged `USER_LOGOUT` after sign-out + wrong signature

**Solution Applied:**

1. **Fixed `useAuthNavigation.ts`** - Moved logging before sign-out:
```typescript
// Before (BROKEN):
auth.signOut();
router.replace('/(auth)');
Alert.alert(/* ... */);
logAction(/* ... */); // ❌ After sign-out

// After (FIXED):
logAction(/* ... */); // ✅ Before sign-out
auth.signOut();
router.replace('/(auth)');
Alert.alert(/* ... */);
```

2. **Fixed `home.jsx`** - Both order and signature:
```javascript
// Before (BROKEN):
await auth.signOut(); // Sign out first
await logAction(uid, email, role, 'USER_LOGOUT', null, {}); // ❌ Wrong signature + after sign-out

// After (FIXED):
await logAction(uid, username, email, role, 'USER_LOGOUT', 'success', details); // ✅ Correct signature + before sign-out
await auth.signOut(); // Sign out after logging
```

3. **Updated Function Signatures**: Fixed old LogService parameter order in `home.jsx`

**Verified Correct Files:**
- ✅ **`app/(auth)/Signin.tsx`**: Already had correct order (log before sign-out)

**Prevention Strategy:**
- **Always log before sign-out**: Make this a consistent pattern across the codebase
- **Use correct LogService signature**: Ensure all calls use `(uid, username, email, role, action, outcome, details)`
- **Systematic code review**: Check all sign-out locations for proper logging order
- **Error handling**: Proper error catching for both logging and sign-out operations

**Key Lesson:**
Authentication-dependent operations (like logging to Firestore) must ALWAYS occur before authentication is revoked. This is a fundamental principle that should be applied consistently across all sign-out scenarios.

**Medical Compliance Note:**
Proper logout logging is critical for medical applications to maintain audit trails and comply with healthcare regulations. All user session endings must be properly documented.

---

### Bug #12: Critical Security Vulnerability - Admin Role Self-Assignment
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical Security Vulnerability  
**Status**: ✅ Fixed

**Problem Description:**
A severe security vulnerability where new users could self-assign the "admin" role during profile completion, bypassing proper authorization controls. This created unauthorized admin access to the medical records system.

**Security Risk:**
- **Unauthorized Admin Access**: Any user could gain administrative privileges
- **Medical Data Breach**: Admins have access to all patient records
- **System Compromise**: Admin users can manage all other users and relationships
- **Compliance Violation**: Medical systems require strict access controls

**Root Cause Analysis:**
1. **Client-Side Role Selection**: Profile completion forms included 'admin' in role options
2. **No Server-Side Validation**: Firestore rules allowed any authenticated user to set admin role
3. **Missing Authorization Checks**: No verification that only existing admins can assign admin roles
4. **Design Flaw**: Admin role assignment was treated like regular role selection

**Solution Applied:**

1. **Client-Side Fixes:**
   - **Removed admin from regular user profile**: `userProfile.tsx` now excludes 'admin' from role selection
   - **Admin-only access in admin section**: `(admin)/index.tsx` allows admin assignment only for existing admins
   - **Added security notices**: Clear messaging about admin access restrictions

2. **Server-Side Security (Firestore Rules):**
   ```javascript
   // Profile Creation Rule
   allow create: if isAuthenticated()
     && request.auth.uid == userId
     && request.resource.data.uid == userId
     && request.resource.data.email is string
     && (
       // Regular users can only select non-admin roles
       (request.resource.data.role in ['patient', 'caretaker', 'doctor', 'unverified'])
       ||
       // Admin role can only be assigned by existing admins
       (request.resource.data.role == 'admin' && isAdmin())
     );

   // Profile Update Rule
   allow update: if isOwner(userId) 
     && (
       // If not changing role, allow update
       (!('role' in request.resource.data) || request.resource.data.role == resource.data.role)
       ||
       // If changing role, ensure it's not to admin unless requester is admin
       (request.resource.data.role in ['patient', 'caretaker', 'doctor', 'unverified'] || isAdmin())
     );
   ```

3. **UI/UX Improvements:**
   - **Regular Users**: Security notice that admin access is granted by administrators only
   - **Admin Users**: Warning notice about elevated privileges when assigning admin role
   - **Clear Visual Distinction**: Admin assignment UI clearly marked with warning styling

**Fixed Code:**
```typescript
// userProfile.tsx - Regular users (SECURE)
{['patient', 'caretaker', 'doctor'].map(r => ( // ← Removed 'admin'
  <TouchableOpacity
    key={r} 
    style={[styles.roleButton, role === r && styles.roleButtonActive]} 
    onPress={() => setRole(r as 'patient' | 'caretaker' | 'doctor')} // ← Removed 'admin'
  >
    <Text>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
  </TouchableOpacity>
))}

// (admin)/index.tsx - Admin users only (SECURE)
{['patient', 'caretaker', 'doctor', 'admin'].map(r => ( // ← Admin can assign admin
  // ... same UI but only accessible by existing admins
))}
```

**Security Validation:**
- ✅ **Client-Side Protection**: Regular users cannot select admin role
- ✅ **Server-Side Enforcement**: Firestore rules prevent unauthorized admin role assignment
- ✅ **Admin-Only Elevation**: Only existing admins can assign admin roles to others
- ✅ **Audit Trail**: All role changes are logged with proper attribution
- ✅ **Medical Compliance**: Proper access controls for healthcare data

**Prevention Strategy:**
- **Principle of Least Privilege**: Never allow self-assignment of elevated roles
- **Defense in Depth**: Implement security at both client and server levels  
- **Regular Security Reviews**: Audit all role assignment and privilege escalation paths
- **Secure by Default**: Administrative functions should require explicit authorization
- **Medical-Grade Security**: Healthcare applications require the highest security standards

**Key Lesson:**
Administrative privileges should NEVER be self-assignable. All privilege escalation must be controlled by existing administrators through secure, audited processes. This is especially critical in medical systems handling protected health information.

**Compliance Note:**
This fix ensures the application meets medical-grade security requirements for role-based access control and audit trails, supporting HIPAA-style compliance.

---

### Bug #11: LogService Parameter Order Mismatch and Undefined Values
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

**Problem Description:**
LogService was throwing errors due to incorrect parameter order in function calls and undefined values being passed to Firestore, causing "Unsupported field value: undefined" errors.

**Error Messages:**
```
ERROR  ❌ LogService: Error logging action: [FirebaseError: Function addDoc() called with invalid data. Unsupported field value: undefined (found in field outcome.previousFirstName in document appLogs/QMJfZVusUE2MfmG87GCU)]
```

**Root Cause Analysis:**
1. **Parameter Order Mismatch**: LogService function calls were using old parameter order without username
2. **Undefined Values in Details**: `userProfile?.firstName` was undefined and being passed to Firestore
3. **Missing Username Parameter**: Calls were missing the username parameter that was added to LogService
4. **Recurring Pattern**: Same issue occurred in multiple files that weren't previously fixed

**LogService Expected Signature:**
```typescript
logAction(uid, username, email, role, action, outcome, details)
```

**But Was Being Called As:**
```typescript
logAction(uid, email, role, action, outcome, details) // Missing username, wrong order
```

**Solution Applied:**
1. **Fixed Parameter Order**: Updated all `logAction` calls to match correct signature
2. **Added Username Parameter**: Used `userProfile?.username` with fallback to email-derived username
3. **Anonymous user handling**: Proper handling for unauthenticated users
4. **Enhanced logging**: Better audit trail with both username and email

**Fixed Code:**
```typescript
// Before (Wrong):
logAction('anonymous-uid', 'anonymous-email', 'unverified', 'UNAUTHENTICATED_ACCESS_ATTEMPT', null, { path: currentFullPath });

// After (Correct):
logAction('anonymous-uid', 'anonymous-user', 'anonymous-email', 'unverified', 'UNAUTHENTICATED_ACCESS_ATTEMPT', null, { path: currentFullPath });
```

**Key Lesson:**
When updating function signatures, ensure all calling code is updated systematically and test with real data to catch undefined value issues.

---

### Bug #10: Infinite Redirect Loop in Profile Completion Check
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

**Problem Description:**
Protected layout was causing infinite redirect loops when checking for profile completion, repeatedly trying to redirect to the profile completion page.

**Error Messages:**
```
ERROR  Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
LOG  ProtectedLayout: Profile not completed, redirecting to profile completion
LOG  ProtectedLayout: Profile not completed, redirecting to profile completion
LOG  ProtectedLayout: Profile not completed, redirecting to profile completion
```

**Root Cause Analysis:**
1. **Missing redirect tracking for profile completion**: The profile completion redirect wasn't using the `hasRedirectedRef` tracking like the role-based redirect
2. **Continuous re-rendering**: Every component re-render triggered the profile completion check without protection
3. **No check for current page**: Component would redirect even if already on the userProfile page
4. **Incomplete useEffect dependencies**: Reset logic didn't account for profile completion status changes

**Solution Applied:**
1. **Added redirect tracking for profile completion**: Used `hasRedirectedRef.current` to prevent multiple redirects
2. **Enhanced reset conditions**: Reset redirect flag when profile completion status changes
3. **Added current page check**: Prevent redirect if already on userProfile page
4. **Added comprehensive debug logging**: Better visibility into redirect logic

**Fixed Code:**
```typescript
// Added redirect tracking and page check
const isOnUserProfilePage = segments.length >= 2 && segments[1] === 'userProfile';
if (!userProfile?.profileCompleted && !hasRedirectedRef.current && !isOnUserProfilePage) {
    hasRedirectedRef.current = true;
    console.log('ProtectedLayout: Profile not completed, redirecting to profile completion');
    return <Redirect href="/(protected)/userProfile" />;
}

// Enhanced reset conditions
useEffect(() => {
    hasRedirectedRef.current = false;
}, [user?.uid, userProfile?.profileCompleted]);
```

**Prevention Strategy:**
- Always use redirect tracking (`useRef`) for any navigation redirects in layouts
- Include comprehensive dependency arrays in useEffect for reset conditions
- Add current page checks to prevent unnecessary redirects
- Use debug logging to track component state during development
- Test all redirect scenarios thoroughly with different user roles

**Key Lesson:**
All redirect logic in layout components should be protected with redirect tracking to prevent infinite loops, not just role-based redirects but also profile completion and other conditional redirects.

---

### Bug #9: Infinite Redirect Loop in Protected Layout
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

**Problem Description:**
Protected layout was causing infinite redirect loops and "Maximum update depth exceeded" errors when trying to navigate to role-specific dashboards.

**Error Messages:**
```
Warning: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
Error: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
```

**Root Cause Analysis:**
1. **Improper segment comparison**: Router segments were being compared incorrectly
2. **Missing redirect tracking**: No mechanism to prevent multiple redirects
3. **useEffect dependency issues**: State changes triggered new effects infinitely
4. **Segment path mismatch**: Expected vs actual segment paths didn't match

**Solution Applied:**
1. **Added useRef for redirect tracking**: Prevents multiple redirects
2. **Fixed segment comparison logic**: Proper array comparison and segment checking
3. **Added precise segment validation**: Exact matching of expected segments
4. **Enhanced debugging**: Added comprehensive console logging

**Fixed Code:**
```typescript
const hasRedirected = useRef(false);

useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) return;
    
    // Check if we're in a role-specific segment
    const currentSegment = segments[1];
    const isInRoleSpecificArea = ['(patient)', '(doctor)', '(caretaker)', '(admin)'].includes(currentSegment);
    
    if (userProfile?.role && !isInRoleSpecificArea) {
        hasRedirected.current = true;
        router.replace(`/(protected)/(${userProfile.role})/`);
    }
}, [userProfile?.role, segments, router]);
```

**Prevention Strategy:**
- Always use `useRef` for tracking state that shouldn't trigger re-renders
- Be precise with segment/path comparisons in routing logic
- Add comprehensive logging for debugging complex navigation flows
- Test navigation flows thoroughly with different user roles

---

### Bug #8: Landing Screen Infinite Loading Issue
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
Landing screen was showing infinite loading spinner instead of completing authentication check and showing appropriate button text.

**Symptoms:**
- Loading spinner never disappeared
- Button text remained "Loading..." indefinitely
- Timer completion logic not working correctly
- Users unable to proceed past landing screen

**Root Cause Analysis:**
1. **Flawed early completion logic**: Auth check completion wasn't properly detecting all completion states
2. **Missing state combinations**: Didn't account for all possible auth/profile loading combinations
3. **Timer dependency issues**: Timer kept running even after auth check was complete
4. **State transition problems**: App couldn't determine when authentication check was definitively complete

**Solution Applied:**
1. **Fixed early completion logic**: Proper detection of completion states
2. **Enhanced state checking**: Account for all loading state combinations
3. **Improved timer management**: Prevent timer from running after completion
4. **Added comprehensive logging**: Better visibility into state transitions

**Fixed Code:**
```typescript
// Enhanced completion detection
if (!loading && (user === null || (!loadingProfile && user))) {
    setAuthCheckComplete(true);
    return;
}

// Guard against running timer if already complete
if (authCheckComplete) {
    return;
}
```

**Prevention Strategy:**
- Always account for all possible state combinations in complex conditional logic
- Use early returns to prevent unnecessary code execution
- Add comprehensive logging for debugging complex state transitions
- Test all authentication states thoroughly

---

### Bug #7: Duplicate AuthProvider Problem
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

**Problem Description:**
App had duplicate `AuthProvider` contexts causing authentication state confusion and infinite loading loops.

**Log Evidence:**
```
LOG  useAuthNavigation: Waiting for auth/profile to load...
LOG  useAuthNavigation: Waiting for auth/profile to load...
LOG  useAuthNavigation: Waiting for auth/profile to load...
LOG  useAuthNavigation: Waiting for auth/profile to load...
LOG  useAuthNavigation: Auth state resolved {"currentPath": "/", "isProfileComplete": null, "user": false, "userProfile": false}
```

**Root Cause Analysis:**
The app had **duplicate `AuthProvider`s** wrapping the application:
1. **`App.tsx`** - Was wrapping `ExpoRoot` with `AuthProvider`
2. **`app/_layout.tsx`** - Was also wrapping `RootLayoutContent` with `AuthProvider`

This created nested contexts which caused:
- Authentication state confusion
- Infinite loading loops
- Repeated console logging
- Performance issues

**Solution Applied:**
1. **Removed `App.tsx` entirely**: `rm App.tsx`
2. **Updated `package.json`**: Changed main entry from `"./App.tsx"` to `"expo-router/entry"`
3. **Simplified entry point flow**: `expo-router/entry → app/_layout.tsx → app/index.tsx`
4. **Single AuthProvider location**: Only `app/_layout.tsx` provides the `AuthProvider`

**Key Lesson:**
In **Expo Router**, use only `app/_layout.tsx` for context providers, not `App.tsx`. The `App.tsx` file is unnecessary and can cause context duplication issues.

**Prevention Strategy:**
- Understand framework-specific patterns (Expo Router vs React Native CLI)
- Avoid creating unnecessary wrapper files
- Use single source of truth for context providers
- Test context provider setup thoroughly

---

### Bug #6: Infinite Loop in Landing Screen Timer
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

**Problem Description:**
The authentication timer was getting stuck in an infinite loop, continuously logging "Auth check timer expired" even after the auth check was complete.

**Log Evidence:**
```
LOG  Auth check completed early: {"loading": false, "loadingProfile": true, "user": false}
LOG  Auth check timer expired - completing check
LOG  Auth check timer expired - completing check
[...repeating infinitely...]
```

**Root Cause Analysis:**
1. The `useEffect` dependency array included `authCheckComplete`
2. When `setAuthCheckComplete(true)` was called, it triggered the effect to re-run
3. The timer continued running even after auth check was complete
4. This created an infinite loop where the timer kept firing

**Solution Applied:**
1. **Removed `authCheckComplete` from dependency array**: Prevents re-running when auth check completes
2. **Added early return guard**: Prevents starting new timer if auth check is already complete
3. **Moved early completion logic**: Checks auth state before starting timer

**Fixed Code:**
```tsx
useEffect(() => {
    // Guard: Don't start timer if already complete
    if (authCheckComplete) {
        return;
    }
    
    // Check for immediate completion before starting timer
    if (!loading && (user === null || (!loadingProfile && user))) {
        setAuthCheckComplete(true);
        return; // Don't start timer
    }
    
    // Only start timer if auth state still unknown
    const timer = setInterval(() => { /* timer logic */ });
    return () => clearInterval(timer);
}, [loading, loadingProfile, user]); // Removed authCheckComplete
```

**Key Lesson:**
Be careful with dependency arrays in `useEffect` - including state that the effect modifies can create infinite loops.

**Prevention Strategy:**
- Carefully review `useEffect` dependency arrays
- Avoid including state that the effect modifies
- Use guards to prevent unnecessary effect execution
- Test effect cleanup and re-execution scenarios

---

### Bug #5: "Text strings must be rendered within a <Text> component" Error
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
React Native threw the error "Text strings must be rendered within a <Text> component" even though all text appeared to be properly wrapped in `<Text>` components.

**Error Evidence:**
```
ERROR  Error: Text strings must be rendered within a <Text> component.
    in AuthLandingScreen
```

**Root Cause Analysis:**
1. **Boolean rendering in JSX**: Using `&&` operator with booleans can cause React Native to try rendering `false`
2. **Implicit type conversion**: Functions might return non-string values in edge cases
3. **Conditional rendering patterns**: React Native is more strict than React web about rendering falsy values
4. **Single-line JSX complexity**: React Native's JSX parser can struggle with complex single-line expressions

**Solution Applied:**
1. **Explicit string conversion**: Wrapped function calls in `String()` to ensure string output
2. **Ternary operator instead of &&**: Changed conditional rendering to explicit ternary
3. **Explicit null returns**: Ensured all conditional renders return `null` instead of `false`
4. **Multi-line JSX format**: Broke complex components into multiple lines

**Fixed Code:**
```tsx
// Before (Broken):
{errorMsg ? <Text style={signinStyles.errorText}>{errorMsg}</Text> : null}

// After (Working):
{errorMsg ? (
    <Text
        style={signinStyles.errorText}
        testID="signin-error-message"
        accessibilityRole="alert"
    >
        {errorMsg}
    </Text>
) : null}
```

**Key Lesson:**
React Native is stricter about rendering non-components compared to React web. Always use ternary operators with explicit `null` returns and ensure text content is always strings.

**Prevention Strategy:**
- Use ternary operators instead of `&&` for conditional rendering
- Always return `null` explicitly instead of relying on falsy values
- Use multi-line format for complex JSX components
- Test on React Native specifically, not just web

---

### Bug #4: Firebase Firestore Security Rules - Medical Records Compliance
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

**Problem Description:**
Multiple permission errors when creating user profiles and logging actions due to misconfigured Firestore security rules.

**Error Messages:**
```
ERROR  Error creating default user profile: [FirebaseError: Missing or insufficient permissions.]
ERROR  LogService: Error logging action: [FirebaseError: Missing or insufficient permissions.]
```

**Root Cause Analysis:**
1. **LogService Field Mismatch**: Rules expected `serverTimestamp` field, LogService sent `timestamp`
2. **Missing Field Validation**: Rules missing validation for `username` field that LogService includes
3. **User Profile Creation Too Restrictive**: Rules required fields not provided by AuthContext
4. **Role Validation Issues**: Rules didn't allow `'unverified'` role that AuthContext creates

**Solution Applied:**
1. **Enhanced Security Rules Structure**: Added comprehensive helper functions and validation
2. **Field Validation Fixed**: Updated rules to match actual LogService field names
3. **Role Validation Updated**: Added support for `'unverified'` role in initial user creation
4. **Medical-Grade Compliance**: Implemented role-based access control and relationship verification

**Key Security Features Implemented:**
- **Data Ownership**: Users can only access their own medical records
- **Relationship-Based Access**: Doctors/caretakers can read patient data only if relationship is 'accepted'
- **Role Validation**: Multiple fallbacks for role checking (custom claims + document)
- **Audit Trail**: Immutable logs with comprehensive field validation
- **Principle of Least Privilege**: Default deny all, explicit allow rules only

**Fixed Code:**
```javascript
// LogService validation now matches actual fields:
match /appLogs/{logId} {
  allow create: if isAuthenticated()
    && request.resource.data.uid is string 
    && request.resource.data.username is string // Added
    && request.resource.data.email is string 
    && request.resource.data.role in ['patient', 'caretaker', 'doctor', 'admin', 'unverified', null]
    && request.resource.data.action is string 
    && request.resource.data.timestamp != null // Fixed field name
    && (request.resource.data.outcome == null || request.resource.data.outcome in ['success', 'failure'])
    && (request.resource.data.details == null || request.resource.data.details is map);
}
```

**Prevention Strategy:**
- Always test security rules with actual application data
- Keep rules and application code in sync
- Use comprehensive field validation
- Implement medical-grade security from the start
- Test all user roles and permissions thoroughly

---

### Bug #3: useAuthNavigation Hook - LogService Parameter Order Mismatch
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem Description:**
Multiple TypeScript errors in `useAuthNavigation.ts` hook due to incorrect parameter order when calling `logAction` function.

**Error Messages:**
```
Argument of type '"UNAUTHENTICATED_ACCESS_ATTEMPT"' is not assignable to parameter of type 'UserRole'.
```

**Root Cause Analysis:**
The `logAction` function signature was updated to include a `username` parameter, but the hook was still using the old parameter order:

**Old LogService signature:**
```typescript
logAction(uid, email, role, action, outcome, details)
```

**New LogService signature:**
```typescript
logAction(uid, username, email, role, action, outcome, details)
```

**Issues Fixed:**

1. **Parameter Order Mismatch:**
   ```typescript
   // Before (Wrong):
   logAction('anonymous-uid', 'anonymous-email', 'unverified', 'UNAUTHENTICATED_ACCESS_ATTEMPT', null, { path: currentFullPath });
   //        uid           email         role       action                    outcome details
   
   // After (Correct):
   logAction('anonymous-uid', 'anonymous-user', 'anonymous-email', 'unverified', 'UNAUTHENTICATED_ACCESS_ATTEMPT', null, { path: currentFullPath });
   //        uid           username       email         role       action                    outcome details
   ```

2. **Missing Username Parameter:**
   ```typescript
   // Added username extraction for authenticated users:
   const userUsernameForLog = user?.email?.split('@')[0] ?? 'anonymous-user';
   
   // All logAction calls now include username parameter:
   logAction(user.uid, userUsernameForLog, userEmailForLog, role, action, outcome, details)
   ```

3. **Anonymous User Logging:**
   ```typescript
   // Proper handling for unauthenticated users:
   logAction(
     'anonymous-uid', 
     'anonymous-user',     // ← Added username
     'anonymous-email', 
     'unverified', 
     'UNAUTHENTICATED_ACCESS_ATTEMPT', 
     null, 
     { path: currentFullPath }
   );
   ```

**All LogAction Calls Fixed:**
- ✅ Unauthenticated access attempts
- ✅ Unverified user logout
- ✅ Profile completion redirects  
- ✅ Login redirects to protected areas

**Security Benefit:**
The logging now properly captures both email and username for better audit trail identification, supporting medical records compliance requirements.

**Key Lesson:**
When updating function signatures, ensure all calling code is updated to match the new parameter order and required fields.

---

### Bug #2: Username Field Missing from User Profile Structure
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

**Problem:**
The `useAuthNavigation` hook was generating usernames from email addresses instead of using actual usernames collected during signup:
```typescript
// Problematic approach:
const userUsernameForLog = user?.email?.split('@')[0] ?? 'anonymous-user';
```

**Root Cause Analysis:**
1. **Signup form collects username** but doesn't save it to user profile document
2. **UserProfile interface** didn't include username field
3. **LogService expects username** but it's not available in userProfile
4. **Workaround used email** to generate fake username (not ideal for medical records)

**Solution Implemented:**

1. **Added username to UserProfile interface:**
   ```typescript
   export interface UserProfile {
     uid: string;
     email: string;
     username?: string; // ← Added username field
     role: 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified';
     // ...other fields
   }
   ```

2. **Updated useAuthNavigation to prefer real username:**
   ```typescript
   // Improved approach with fallback:
   const userUsernameForLog = userProfile?.username ?? user?.email?.split('@')[0] ?? 'anonymous-user';
   ```

**Outstanding Work Required:**

To complete the username implementation, you need to:

1. **Update Signup.tsx** to save username to user profile:
   ```typescript
   // After user creation, update/create profile with username
   const userDocRef = doc(db, 'artifacts', FIREBASE_APP_ID, 'users', user.uid);
   await setDoc(userDocRef, {
     uid: user.uid,
     email: user.email,
     username: username.trim(), // ← Save the username
     role: 'unverified',
     profileCompleted: false,
     createdAt: serverTimestamp(),
     updatedAt: serverTimestamp()
   });
   ```

2. **Update AuthContext default profile creation** to include username field

3. **Update userProfile.tsx** to allow username editing/completion

4. **Update Firestore rules** to validate username field if required

**Medical Records Compliance:**
Having proper usernames (not derived from email) improves audit trail quality and user identification in medical record systems. This supports better compliance with healthcare data regulations.

**Current State:**
- ✅ Interface updated to include username field
- ✅ Hook updated to prefer real username over email-derived username
- ⚠️ Signup form still needs to save username to profile
- ⚠️ AuthContext still needs to handle username in default profiles

---

### Bug #1: Signup Form Missing User Profile Creation
**Date Encountered**: 2025-07-02  
**Date Fixed**: 2025-07-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

**Problem Description:**
The Signup form was collecting user information (username, email) but only creating the Firebase Auth account, not saving the user profile to Firestore. This caused:
1. Username was lost after signup
2. AuthContext had to create incomplete default profiles
3. LogService couldn't access real usernames

**What Was Missing from Signup.tsx:**

1. **Firestore imports** - `doc`, `setDoc`, `serverTimestamp`
2. **Database reference** - Import `db` from firebaseConfig
3. **Profile document creation** - `setDoc` call to save user profile
4. **Environment variable** - `FIREBASE_APP_ID` for proper document path
5. **LogService parameter fixes** - Wrong parameter order

**Solution Implemented:**

1. **Added missing imports:**
   ```typescript
   import { doc, setDoc, serverTimestamp } from "firebase/firestore";
   import { auth, db } from "@/firebase/firebaseConfig";
   ```

2. **Added profile creation after user account creation:**
   ```typescript
   // Create user profile document in Firestore
   const userDocRef = doc(db, 'artifacts', FIREBASE_APP_ID, 'users', user.uid);
   await setDoc(userDocRef, {
       uid: user.uid,
       email: user.email || '',
       username: username.trim(), // ← Now saves the username!
       role: 'unverified',
       profileCompleted: false,
       createdAt: serverTimestamp(),
       updatedAt: serverTimestamp()
   });
   ```

3. **Fixed LogService parameter order:**
   ```typescript
   // Correct order: uid, username, email, role, action, outcome, details
   await logAction(
       user.uid,
       username.trim(),
       user.email ?? 'no-email-provided',
       'unverified',
       'EMAIL_SIGNUP_SUCCESS',
       'success',
       { username: username.trim() }
   );
   ```

**Benefits:**
- ✅ **Username preservation** - Username from signup is now saved to profile
- ✅ **Complete profile creation** - No need for AuthContext to create incomplete defaults
- ✅ **Better audit trail** - LogService now has access to real usernames
- ✅ **Firestore rules compliance** - Profile documents match expected structure
- ✅ **Medical records integrity** - Proper user identification from registration

**Signup Flow Now:**
1. Create Firebase Auth account ✅
2. Create Firestore user profile with username ✅
3. Send email verification ✅
4. Log successful signup with real username ✅
5. Redirect to signin ✅

This completes the missing piece of the user registration process and ensures usernames are properly preserved throughout the application lifecycle.

---

## Device ID Logging Enhancement

### Device Information Capture
**Date Added**: 2025-07-02  
**Severity**: 🟡 Major  
**Status**: ✅ Fixed

#### Overview
Enhanced audit logging by capturing device information for medical-grade compliance and security monitoring.

#### Changes Made:
1. **New Utility Module** (`utils/deviceInfo.ts`):
   - Centralized device information collection
   - Uses `expo-device` library for cross-platform device identification
   - Provides consistent device ID format across the app
   - Fallback mechanism for cases where device info is unavailable

2. **Device ID Integration**:
   - **Signin.tsx**: Added device ID capture and logging
   - **Signup.tsx**: Added device ID capture and logging  
   - **useAuthNavigation.ts**: Added device ID to all navigation-related logs

3. **LogService Enhancement**:
   - All `logAction` calls now include device information
   - Device ID included in the `details` object for audit trails
   - Timestamps added for better chronological tracking

#### Device Information Captured:
- **Device Type**: Phone, tablet, desktop, etc.
- **OS Name**: iOS, Android, Web, etc.
- **OS Version**: Operating system version
- **Model Name**: Device model (when available)
- **Brand**: Device manufacturer
- **Generated Device ID**: Composite identifier for logging

#### Security Considerations:
- Device IDs are generated, not actual MAC addresses (for privacy)
- Information is limited to what's needed for audit compliance
- No personally identifiable hardware information is stored
- Falls back gracefully if device info is unavailable

#### Usage Example:
```typescript
import { getDeviceInfo, getSimpleDeviceId } from '../utils/deviceInfo';

// Get comprehensive device info
const deviceInfo = await getDeviceInfo();

// Get simple device ID for logging
const deviceId = await getSimpleDeviceId();

// Use in logging
await logAction(uid, username, email, role, action, outcome, {
  deviceId,
  timestamp: new Date().toISOString(),
  // other details...
});
```

#### Security Features:
- Case-insensitive username matching prevents duplicate accounts
- Username uniqueness enforced during signup
- All usernames stored in lowercase for consistency
- Comprehensive audit logging includes both username and email
- Device ID logging maintained for enhanced security tracking

#### User Experience Improvements:
- **Flexible Login**: Users can sign in with either username or email
- **Clear Validation**: Real-time feedback on username availability during signup
- **Consistent Interface**: Single input field handles both authentication methods
- **Better Error Messages**: Context-aware error messages for different input types

#### Database Schema:
- User profiles include both `email` and `username` fields
- Usernames stored in lowercase for consistent querying
- Firestore queries optimized for username lookups
- Maintains backward compatibility with email-only authentication

This enhancement significantly improves user experience while maintaining security and adding comprehensive audit capabilities for medical-grade compliance.

---

#### iOS-Specific Form Enhancements
**Date Added**: 2025-07-02  
**Severity**: 🟢 Minor  
**Status**: ✅ Fixed

Added iOS-specific TextInput attributes for better password manager integration and user experience:

**Signup Form (`Signup.tsx`)**:
- `textContentType="username"` + `autoComplete="username"` for username field
- `textContentType="emailAddress"` + `autoComplete="email"` for email field  
- `textContentType="newPassword"` + `autoComplete="new-password"` for both password fields

**Signin Form (`Signin.tsx`)**:
- `textContentType="username"` + `autoComplete="username"` for username/email field
- `textContentType="password"` + `autoComplete="current-password"` for password field

**Benefits**:
- **iOS Keychain Integration**: Seamless password manager suggestions
- **AutoFill Support**: iOS AutoFill will properly categorize and suggest credentials
- **Accessibility**: Better screen reader support and field identification
- **Security**: Proper password field handling prevents accidental exposure
- **UX**: Smoother form completion with appropriate keyboard and suggestions

These attributes ensure optimal integration with iOS password management and accessibility features while maintaining cross-platform compatibility.

---

*This bug log is maintained as part of the Diabeto project's comprehensive documentation and serves as a learning resource for current and future developers.*
