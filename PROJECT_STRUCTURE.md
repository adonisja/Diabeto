# Diabeto Project Structure Guide

## 📋 Overview
This comprehensive guide explains every file and folder in the Diabeto medical records app, their purposes, data flows, and interactions. Use this as a learning tool to understand the complete project architecture.

---

## 🗂️ Root Directory Structure

### Configuration Files

#### `package.json`
**Purpose**: Node.js project configuration and dependency management
**Contains**:
- **Dependencies**: React Native, Expo, Firebase, TypeScript libraries
- **Scripts**: Build, start, test commands
- **Expo configuration**: Entry point (`expo-router/entry`)
- **Main entry**: Points to expo-router instead of App.tsx

**Key Dependencies**:
- `expo-router`: File-based routing system
- `firebase`: Backend services (Auth, Firestore)
- `react-native`: Core mobile framework
- `typescript`: Type safety and development experience

#### `app.json`
**Purpose**: Expo application configuration
**Contains**:
- App metadata (name, version, description)
- Platform-specific settings (iOS, Android, Web)
- Asset paths and splash screen configuration
- Permissions and capabilities required by the app

#### `tsconfig.json`
**Purpose**: TypeScript compiler configuration
**Features**:
- Strict type checking enabled
- Path aliases (`@/` points to root directory)
- React Native and Expo type definitions
- Modern ES features support

#### `babel.config.js`
**Purpose**: JavaScript/TypeScript transpilation configuration
**Plugins**:
- Expo preset for React Native compatibility
- Module resolver for path aliases
- TypeScript transformation rules

#### `metro.config.js`
**Purpose**: Metro bundler configuration for React Native
**Features**:
- Asset resolution rules
- Platform-specific bundling
- Development server settings

#### `expo-router.d.ts` & `expo-env.d.ts`
**Purpose**: TypeScript declarations for Expo and routing
**Provides**: Type definitions for Expo Router navigation and environment

---

## 🔥 Firebase Configuration

### `firebase.json`
**Purpose**: Firebase project configuration
**Contains**:
- **Firestore rules**: Points to `firestore.rules` file
- **Firestore indexes**: Points to `firestore.indexes.json`
- **Hosting settings**: Web deployment configuration
- **Emulator settings**: Local development environment

### `firestore.rules`
**Purpose**: Database security rules for Firestore
**Medical-Grade Security Features**:
- **Role-based access control**: Patient, doctor, caretaker, admin roles
- **Relationship-based permissions**: Doctors can only access linked patients
- **Data ownership**: Users can only access their own medical records
- **Immutable audit logs**: All actions are logged and cannot be modified
- **Field validation**: Strict data type and format validation

**Key Collections**:
```javascript
// User profiles with role-based access
/artifacts/{appId}/users/{userId}

// Medical data subcollections (protected by relationships)
/artifacts/{appId}/users/{userId}/{medicalCollection}/{docId}

// Doctor-patient and caretaker-patient relationships
/relationships/{relationshipId}

// Immutable audit logs (admin-only read access)
/appLogs/{logId}
```

### `firestore.indexes.json`
**Purpose**: Database query optimization
**Contains**: Composite indexes for complex queries (username lookups, relationship queries)

### `.firebaserc`
**Purpose**: Firebase project identification
**Contains**: Project ID mapping for different environments (dev, staging, prod)

---

## 📱 Application Structure (`app/` Directory)

### Core Navigation Files

#### `app/_layout.tsx`
**Purpose**: Root layout wrapper for the entire application
**Responsibilities**:
- **AuthProvider**: Wraps app with authentication context
- **Navigation structure**: Provides Stack navigation for all screens
- **Global providers**: Single source for app-wide context providers
- **Theme setup**: Applies consistent styling across the app

**Data Flow**:
```
App Launch → _layout.tsx → AuthProvider → Navigation Stack → Screen Components
```

#### `app/index.tsx` (Landing Screen)
**Purpose**: Always-shown landing screen with smart navigation
**Features**:
- **Dynamic button text**: Changes based on user authentication state
- **Background auth check**: Silently determines user status
- **Smart routing**: Navigates to appropriate section based on user state
- **Branded experience**: Always shows company branding first

**User State Detection**:
- `"Get Started"` → New users or unauthenticated
- `"Verify Email"` → Account created but email not verified
- `"Complete Profile"` → Email verified but profile incomplete
- `"Continue to App"` → Fully authenticated and ready

**Data Flow**:
```
Landing Screen → Check Auth State → Display Appropriate Button → Navigate to Correct Section
```

#### `app/[...unmatched].tsx`
**Purpose**: 404/fallback screen for undefined routes
**Handles**: Invalid URLs and navigation errors with user-friendly message

### Authentication Section (`app/(auth)/`)

#### `app/(auth)/_layout.tsx`
**Purpose**: Navigation structure for authentication screens
**Screens**:
- `index` → Authentication landing page
- `Signin` → Login form  
- `Signup` → Registration form
- `Forgot-Password` → Password reset

#### `app/(auth)/index.tsx`
**Purpose**: Authentication landing page
**Features**:
- Choice between Sign In and Sign Up
- Branding and welcome message
- Navigation to appropriate auth screens

#### `app/(auth)/Signin.tsx`
**Purpose**: User authentication form
**Advanced Features**:
- **Username/Email support**: Accepts both authentication methods
- **Email verification blocking**: Prevents unverified users from accessing app
- **Smart input detection**: Automatically detects email vs username format
- **Device ID logging**: Records device information for security auditing
- **iOS password manager support**: Optimized for autofill and keychain

**Authentication Flow**:
```
Input → Detect Type → Resolve Username to Email → Firebase Auth → Email Verification Check → Log Device → Success/Error
```

**Security Features**:
- Immediate sign-out for unverified emails
- Comprehensive error handling and user feedback
- Audit logging with device identification
- Firestore username-to-email resolution

#### `app/(auth)/Signup.tsx`
**Purpose**: User registration form
**Features**:
- **Username uniqueness validation**: Prevents duplicate usernames
- **Real-time availability checking**: Immediate feedback on username conflicts
- **Comprehensive profile creation**: Creates both Firebase Auth account and Firestore profile
- **Email verification**: Sends verification email after account creation
- **Audit logging**: Records successful registrations with device information

**Registration Flow**:
```
Form Input → Username Availability Check → Create Firebase Auth → Create Firestore Profile → Send Email Verification → Log Success → Redirect
```

#### `app/(auth)/Forgot-Password.tsx`
**Purpose**: Password reset functionality
**Features**: Firebase password reset email integration

### Protected Section (`app/(protected)/`)

#### `app/(protected)/_layout.tsx`
**Purpose**: Stack navigation wrapper for authenticated users
**Responsibilities**:
- **Authentication Guard**: Redirects unauthenticated users to auth screens
- **Stack Navigation**: Provides navigation structure for all protected screens
- **Clean Architecture**: Delegates role-based routing to the landing page

**Authentication Flow**:
```
User Access → Check Auth State → Redirect to Auth OR Allow Access to Stack
```

#### `app/(protected)/index.tsx` (Landing Page)
**Purpose**: Central navigation hub for role-based routing
**Architecture**: Landing Page Approach for secure, race-condition-free routing

**Key Features**:
- **Prevents Unauthorized Component Mounting**: Only authorized dashboards are mounted
- **Centralized Navigation Logic**: Single point of control for role-based routing
- **Race Condition Prevention**: Waits for auth state before navigation
- **Loading Experience**: Shows professional loading screen during routing

**Navigation Logic**:
```typescript
Landing Page → Check Auth State → Check Profile Completion → Route by Role
```

**Role-Based Routing**:
- **Patient** → `/(protected)/(patient)/`
- **Caretaker** → `/(protected)/(caretaker)/`
- **Doctor** → `/(protected)/(doctor)/`
- **Admin** → `/(protected)/(admin)/`
- **Incomplete Profile** → Profile completion screen
- **Unauthenticated** → Auth screens

**Architectural Benefits**:
- **Security**: Prevents unauthorized components from mounting and executing
- **Performance**: Avoids unnecessary component mounting and unmounting
- **User Experience**: No inappropriate alerts or dashboard flashes
- **Maintainability**: Single source of truth for role-based navigation
- **Auditability**: Clear navigation flow for security auditing

**Data Flow**:
```
App Launch → Auth Check → Profile Check → Role Determination → Dashboard Navigation
```

#### `app/(protected)/userProfile.tsx`
**Purpose**: User profile management and completion
**Features**:
- Profile completion for new users
- Role selection and validation
- Personal information management
- Medical record initialization

#### `app/(protected)/home.jsx`
**Purpose**: General home screen (legacy file, may need refactoring to TypeScript)
**Note**: This file may become redundant with the new landing page architecture

### Role-Specific Sections

#### `app/(protected)/(patient)/`
**Purpose**: Patient-specific screens and functionality
**Access Control**: Handled by landing page - only authorized patients can reach these screens
**Features**:
- Medical record viewing and entry
- Appointment scheduling
- Medication tracking
- Health data visualization

#### `app/(protected)/(caretaker)/`
**Purpose**: Caretaker dashboard and patient management
**Access Control**: Handled by landing page - only authorized caretakers can reach these screens
**Features**:
- Patient invitation system
- Multiple patient monitoring
- Relationship management
- Care coordination tools

#### `app/(protected)/(doctor)/`
**Purpose**: Doctor dashboard and patient care
**Access Control**: Handled by landing page - only authorized doctors can reach these screens
**Features**:
- Patient record access (relationship-based)
- Medical data analysis
- Treatment planning
- Professional tools

#### `app/(protected)/(admin)/`
**Purpose**: System administration
**Access Control**: Handled by landing page - only authorized admins can reach these screens
**Features**:
- User management
- System monitoring
- Audit log access
- Configuration management

**Security Architecture Note**: 
The landing page approach ensures that role-specific components never mount for unauthorized users, eliminating the need for access control logic within individual dashboard components. This provides both better security and improved user experience by preventing inappropriate access denied alerts.

---

## 🏗️ Architecture Analysis: Landing Page Approach

### Overview
The Diabeto app implements a "Landing Page" approach for role-based routing in the protected section. This architectural decision was made to address race conditions, security concerns, and user experience issues inherent in the traditional "redirect after mount" approach.

### The Problem: Redirect After Mount
The traditional approach used by many React Native/Expo Router applications:

1. **Mount All Components**: React Navigation mounts all route components immediately
2. **Execute Side Effects**: Components run `useEffect` hooks and other side effects
3. **Check Permissions**: Each component performs its own access control
4. **Redirect if Unauthorized**: Components redirect users who shouldn't be there

**Problems with this approach:**
- **Race Conditions**: Multiple components compete to redirect users
- **Security Risks**: Unauthorized components execute code before redirection
- **Poor UX**: Users see inappropriate alerts and screen flashes
- **Maintenance Issues**: Access control logic scattered across components
- **Performance**: Unnecessary mounting and unmounting of components

### The Solution: Landing Page Approach

Our implementation centralizes all role-based navigation logic in a single "landing page" component:

#### 1. **Centralized Navigation Logic**
```typescript
// /app/(protected)/index.tsx
export default function ProtectedIndex() {
    const { user, userProfile, loading, loadingProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Single point of navigation logic
        if (loading || loadingProfile) return;
        
        if (!user || !user.emailVerified) {
            router.replace('/(auth)');
            return;
        }
        
        if (!userProfile?.profileCompleted) {
            router.replace('/(protected)/userProfile');
            return;
        }
        
        // Role-based routing
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

    return <LoadingScreen />;
}
```

#### 2. **Simplified Layout Component**
```typescript
// /app/(protected)/_layout.tsx
export default function ProtectedLayout() {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (!user || !user.emailVerified) return <Redirect href="/(auth)" />;

    // All role-based navigation handled by landing page
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="userProfile" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(caretaker)" />
            <Stack.Screen name="(doctor)" />
            <Stack.Screen name="(patient)" />
        </Stack>
    );
}
```

#### 3. **Clean Dashboard Components**
```typescript
// /app/(protected)/(admin)/index.tsx
export default function AdminDashboard() {
    // No access control logic needed - landing page ensures only admins reach here
    return <AdminDashboardContent />;
}
```

### Architectural Benefits

#### **Security Benefits**
1. **No Unauthorized Component Mounting**: Only authorized components are ever mounted
2. **Centralized Access Control**: Single point of security logic reduces attack surface
3. **Audit Trail**: Clear navigation path for security logging
4. **No Side Effect Execution**: Unauthorized components never execute any code

#### **Performance Benefits**
1. **Reduced Component Mounting**: Only necessary components are mounted
2. **Faster Navigation**: No unnecessary component lifecycle operations
3. **Memory Efficiency**: Unauthorized components don't consume memory
4. **Better React Performance**: Fewer unnecessary re-renders

#### **User Experience Benefits**
1. **No Inappropriate Alerts**: Users never see "Access Denied" messages inappropriately
2. **Smooth Navigation**: Single loading screen instead of multiple redirects
3. **Professional Appearance**: Clean, branded loading experience
4. **Consistent Behavior**: Same navigation flow regardless of user role

#### **Maintenance Benefits**
1. **Single Source of Truth**: All navigation logic in one place
2. **Easier Testing**: Single component to test for navigation logic
3. **Cleaner Code**: Dashboard components focus on their core functionality
4. **Better Error Handling**: Centralized error handling for navigation

### Implementation Details

#### **Navigation Flow**
```
User logs in → Landing page mounts → Check auth state → Check profile → Route by role → Target dashboard mounts
```

#### **Loading States**
- **Auth Loading**: Waiting for Firebase Auth to determine user state
- **Profile Loading**: Waiting for Firestore to load user profile
- **Navigation Loading**: Showing loading screen while routing to destination

#### **Error Handling**
- **Auth Errors**: Redirect to auth screens with appropriate error messages
- **Profile Errors**: Redirect to profile completion with helpful guidance
- **Invalid Roles**: Redirect to profile completion for role selection

### Trade-offs and Considerations

#### **Advantages**
- ✅ Better security (no unauthorized component execution)
- ✅ Improved user experience (no inappropriate alerts)
- ✅ Cleaner architecture (separation of concerns)
- ✅ Better performance (fewer unnecessary operations)
- ✅ Easier maintenance (centralized logic)

#### **Considerations**
- ⚠️ Slightly more complex initial setup
- ⚠️ Requires careful state management in landing page
- ⚠️ Additional loading state for navigation

### Future Enhancements

1. **Route Preloading**: Preload authorized routes based on user role
2. **Navigation Caching**: Cache navigation decisions for better performance
3. **Deep Link Handling**: Handle deep links through the landing page
4. **Progressive Loading**: Show partial content while loading complete dashboard

### Testing Strategy

1. **Unit Tests**: Test navigation logic in isolation
2. **Integration Tests**: Test auth state changes and navigation
3. **E2E Tests**: Test complete user flows for each role
4. **Security Tests**: Verify unauthorized components never mount

---

## 🔧 Utilities and Hooks

### `hooks/useAuthNavigation.ts`
**Purpose**: Centralized authentication-aware navigation logic
**Features**:
- **Automatic redirects**: Routes users based on authentication state
- **Comprehensive logging**: All navigation events are audited
- **Background operation**: Works silently without UI interference
- **Device tracking**: Includes device ID in all navigation logs

**Navigation Logic**:
```typescript
Unauthenticated → Auth screens
Email unverified → Sign out + Auth screens  
Profile incomplete → Profile completion
Fully authenticated → Role-specific dashboard
```

### `utils/deviceInfo.ts`
**Purpose**: Cross-platform device identification for audit logging
**Features**:
- **Platform detection**: Web, iOS, Android support
- **Device fingerprinting**: Generates consistent device IDs
- **Privacy-safe**: No personal hardware information stored
- **Fallback mechanisms**: Graceful degradation when device info unavailable

**Device Information Captured**:
- Device type (phone, tablet, desktop)
- Operating system and version
- Device model and brand (when available)
- Generated composite device ID

---

## 🔥 Firebase Integration (`firebase/` Directory)

### `firebase/firebaseConfig.ts`
**Purpose**: Firebase SDK initialization and configuration
**Features**:
- **Platform-specific persistence**: Web uses browser storage, mobile uses AsyncStorage
- **Environment variable integration**: Secure configuration management
- **Service initialization**: Auth, Firestore, and other Firebase services
- **Error handling**: Graceful degradation for missing configuration

### `firebase/AuthContext.tsx`
**Purpose**: Authentication state management and user profile integration
**Features**:
- **Real-time auth state**: Firebase Auth integration with React Context
- **User profile loading**: Automatic Firestore profile fetching
- **Loading states**: Proper loading indicators during auth operations
- **Default profile creation**: Creates basic profiles for new users
- **Error handling**: Comprehensive auth error management

**Context Provides**:
- `user`: Firebase User object
- `userProfile`: Firestore user profile data
- `loading`: Authentication state loading
- `loadingProfile`: Profile loading state

### `firebase/LogService.tsx`
**Purpose**: Centralized audit logging for medical-grade compliance
**Features**:
- **Comprehensive action logging**: All user actions are recorded
- **Medical compliance**: Immutable audit trails
- **Device integration**: Includes device information in all logs
- **Error handling**: Logging failures don't break app functionality
- **Structured data**: Consistent log format across the application

**Log Entry Structure**:
```typescript
{
  uid: string;           // User ID
  username: string;      // User's chosen username
  email: string;         // User's email address
  role: UserRole;        // User's role in the system
  action: string;        // Action type (LOGIN, LOGOUT, etc.)
  outcome: 'success' | 'failure' | null;
  details: {             // Additional context
    deviceId: string;    // Device identification
    timestamp: string;   // ISO timestamp
    // ... other relevant data
  };
  timestamp: Timestamp;  // Firestore server timestamp
}
```

---

## 🎨 Assets and Styling (`assets/` Directory)

### `assets/fonts/`
**Contains**: Custom font files (SpaceMono-Regular.ttf)

### `assets/images/`
**Contains**: App icons, splash screens, and branding assets
- `adaptive-icon.png`: Android adaptive icon
- `favicon.png`: Web favicon
- `icon.png`: Standard app icon
- `splash-icon.png`: Splash screen logo

### `assets/styles/`
**Structure**: Organized by app section

#### `assets/styles/authStyles/`
**Contains**: Authentication screen styles
- Form styling
- Button designs
- Error message formatting
- Responsive layouts

#### `assets/styles/protectedStyles/`
**Contains**: Protected area styles
- Dashboard layouts
- Medical record formatting
- Role-specific themes

---

## 🎯 Constants (`constants/` Directory)

### `constants/Colors.ts`
**Purpose**: Centralized color theme management
**Features**:
- Light and dark theme support
- Consistent color palette
- Accessibility-compliant colors
- Brand color definitions

---

## 🔄 Data Flow Architecture

### Authentication Flow
```
App Launch
    ↓
Landing Screen (index.tsx)
    ↓
AuthContext checks Firebase Auth
    ↓
useAuthNavigation determines routing
    ↓
Navigate to appropriate section:
    • Unauthenticated → Auth screens
    • Authenticated → Role-based dashboard
```

### User Registration Flow  
```
Signup Screen
    ↓
Username availability check
    ↓
Create Firebase Auth account
    ↓
Create Firestore user profile
    ↓
Send email verification
    ↓
Log successful registration
    ↓
Redirect to signin
```

### Medical Record Access Flow
```
User requests medical data
    ↓
Firestore rules check:
    • User owns the data? → Allow
    • Doctor with patient relationship? → Allow
    • Caretaker with patient relationship? → Allow
    • Admin? → Allow
    • Otherwise → Deny
    ↓
Return authorized data only
```

### Audit Logging Flow
```
User performs action
    ↓
LogService captures:
    • User information
    • Action type
    • Device information
    • Timestamp
    • Outcome
    ↓
Store in Firestore appLogs collection
    ↓
Admin-only access for compliance
```

---

## 🔒 Security Architecture

### Multi-Layer Security Model

1. **Firebase Authentication**: Secure user authentication and session management
2. **Firestore Rules**: Database-level access control and validation
3. **Role-Based Access**: User roles determine available functionality
4. **Relationship-Based Access**: Medical data access requires established relationships
5. **Device Tracking**: All actions logged with device identification
6. **Audit Compliance**: Immutable logs for medical record regulations

### Data Protection Levels

- **Public Data**: None (all data requires authentication)
- **Personal Data**: User's own profile and medical records
- **Professional Data**: Doctor/caretaker access to linked patients only
- **Administrative Data**: System logs and user management (admin only)
- **Audit Data**: Immutable logs (admin read-only)

---

## 🚀 Development Workflow

### Getting Started
1. **Install dependencies**: `npm install`
2. **Configure Firebase**: Set up `.env` with Firebase config
3. **Start development**: `npm start`
4. **Deploy rules**: `firebase deploy --only firestore:rules`

### File Organization Principles
- **Feature-based structure**: Group related files together
- **Clear separation**: Auth, protected, and shared components
- **Type safety**: TypeScript throughout the application
- **Consistent naming**: CamelCase for components, kebab-case for files
- **Documentation**: Every file has clear purpose and responsibilities

This structure supports a scalable, maintainable medical records application with enterprise-grade security and compliance features.
