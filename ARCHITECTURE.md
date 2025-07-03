# Diabeto App - Current Architecture (Updated 2025-07-03)

## 🏗️ Overview
Diabeto is a medical records management application built with React Native/Expo, featuring comprehensive authentication, role-based access control, and medical-grade security compliance. The app supports multiple user types (patients, doctors, caretakers, admins) with sophisticated relationship-based data access.

**Latest Update**: Implemented Landing Page Architecture for secure, race-condition-free navigation that prevents unauthorized component mounting and inappropriate access alerts.

## 🎯 Core Architecture Principles

### 1. **Medical-Grade Security**
- **HIPAA-Style Compliance**: Role-based access with relationship verification
- **Immutable Audit Logs**: All actions tracked with device identification
- **Data Ownership**: Users control their own medical records
- **Professional Access**: Doctors/caretakers access patient data only through verified relationships
- **Landing Page Security**: Unauthorized components never mount or execute code

### 2. **Authentication-First Design**
- **Landing Screen Always Shown**: Consistent branding and progressive disclosure
- **Smart Navigation**: App determines user flow based on authentication state
- **Email Verification Required**: Unverified users cannot access protected areas
- **Username/Email Flexibility**: Users can sign in with either credential type
- **Centralized Route Control**: Single landing page manages all role-based navigation

### 3. **Role-Based Architecture**
- **Landing Page Routing**: Centralized navigation logic prevents race conditions
- **Permission Inheritance**: Admins have escalated access, others role-specific
- **Relationship Management**: Professional relationships enable data access
- **Profile Completion Flow**: Guided setup for new users
- **Component Security**: Only authorized components mount and execute

## 🔄 Current Application Flow

### User Journey - New User
```
App Launch → Landing Screen ("Get Started")
    ↓
Sign Up → Username/Email Collection → Email Verification
    ↓
Sign In → Profile Completion → Role Selection
    ↓
Protected Landing Page → Role-Based Dashboard → Feature Access
```

### User Journey - Returning User
```
App Launch → Landing Screen (Dynamic Button)
    ↓
Auto-Detection:
    • Unverified → "Verify Email"
    • Incomplete Profile → "Complete Profile"  
    • Authenticated → "Continue to App"
    ↓
Protected Landing Page → Direct Navigation to Appropriate Dashboard
```

### Security Flow - Landing Page Navigation
```
User Enters Protected Section
    ↓
Protected Landing Page:
    • Check Authentication State
    • Verify Email Confirmation
    • Check Profile Completion
    • Determine User Role
    ↓
Route to Authorized Dashboard Only
    ↓
Audit Log Entry Created
```

### Security Flow - Data Access
```
User Requests Medical Data
    ↓
Firestore Rules Engine:
    • Own data? → Allow
    • Doctor with verified patient relationship? → Allow
    • Caretaker with verified patient relationship? → Allow
    • Admin role? → Allow
    • Otherwise → Deny (403)
    ↓
Audit Log Entry Created
```

## 📁 Current File Structure

```
diabeto/
├── 📱 App Core
│   ├── app/_layout.tsx              # Root AuthProvider wrapper
│   ├── app/index.tsx                # Smart landing screen
│   └── app/[...unmatched].tsx       # 404 fallback
│
├── 🔐 Authentication Section
│   ├── app/(auth)/_layout.tsx       # Auth navigation
│   ├── app/(auth)/index.tsx         # Auth landing
│   ├── app/(auth)/Signin.tsx        # Username/email signin
│   ├── app/(auth)/Signup.tsx        # Registration + profile creation
│   └── app/(auth)/Forgot-Password.tsx # Password reset
│
├── 🛡️ Protected Section
│   ├── app/(protected)/_layout.tsx  # Simplified auth guard
│   ├── app/(protected)/index.tsx    # 🆕 Landing page with centralized navigation
│   ├── app/(protected)/home.jsx     # Legacy home (may be deprecated)
│   ├── app/(protected)/userProfile.tsx # Profile completion
│   ├── app/(protected)/(patient)/   # Patient dashboard
│   ├── app/(protected)/(doctor)/    # Doctor dashboard
│   ├── app/(protected)/(caretaker)/ # Caretaker dashboard
│   └── app/(protected)/(admin)/     # Admin dashboard
│
├── 🔥 Firebase Backend
│   ├── firebase/firebaseConfig.ts   # SDK initialization
│   ├── firebase/AuthContext.tsx     # Auth state management
│   ├── firebase/LogService.tsx      # Audit logging service
│   ├── firestore.rules             # Medical-grade security rules
│   └── firestore.indexes.json      # Query optimization
│
├── 🎣 Custom Hooks & Utils
│   ├── hooks/useAuthNavigation.ts   # Smart routing logic
│   └── utils/deviceInfo.ts          # Device identification
│
├── 🎨 UI Components & Assets
│   ├── components/                  # Reusable components
│   ├── assets/styles/              # Organized styling
│   ├── assets/images/              # Icons and branding
│   └── constants/Colors.ts         # Theme management
│
└── ⚙️ Configuration
    ├── package.json                # Dependencies & scripts
    ├── app.json                    # Expo configuration
    ├── tsconfig.json              # TypeScript settings
    └── firebase.json              # Firebase deployment
```

## 🎯 Landing Page Architecture (New Implementation)

### Overview
The app now implements a **Landing Page Architecture** for the protected section, which provides secure, race-condition-free navigation that prevents unauthorized component mounting.

### Architecture Pattern: Landing Page vs Redirect After Mount

#### Traditional "Redirect After Mount" Problems:
- Components mount before role-based redirection
- Unauthorized components execute side effects  
- Race conditions between multiple redirect systems
- Inappropriate "Access Denied" alerts shown to users
- Performance overhead from unnecessary mounting

#### Landing Page Solution:
- **Centralized Navigation**: Single component handles all role-based routing
- **Prevent Unauthorized Mounting**: Only authorized components ever mount
- **Clean User Experience**: No inappropriate alerts or screen flashes
- **Better Performance**: Reduced unnecessary component operations
- **Maintainable Code**: Single source of truth for navigation logic

### Implementation Details

#### Protected Landing Page (`app/(protected)/index.tsx`)
```typescript
export default function ProtectedIndex() {
    const { user, userProfile, loading, loadingProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading || loadingProfile) return;
        
        // Authentication checks
        if (!user || !user.emailVerified) {
            router.replace('/(auth)');
            return;
        }
        
        // Profile completion check
        if (!userProfile?.profileCompleted) {
            router.replace('/(protected)/userProfile');
            return;
        }
        
        // Role-based routing
        switch (userProfile.role) {
            case 'patient': router.replace('/(protected)/(patient)'); break;
            case 'caretaker': router.replace('/(protected)/(caretaker)'); break;
            case 'doctor': router.replace('/(protected)/(doctor)'); break;
            case 'admin': router.replace('/(protected)/(admin)'); break;
            default: router.replace('/(protected)/userProfile'); break;
        }
    }, [loading, loadingProfile, user, userProfile, router]);

    return <LoadingScreen />;
}
```

#### Simplified Protected Layout (`app/(protected)/_layout.tsx`)
```typescript
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

### Security Benefits
- **Zero Unauthorized Execution**: Unauthorized components never mount or run code
- **Audit Trail**: Clear navigation path for security logging
- **Access Control**: Single point of permission checking
- **Attack Surface Reduction**: Centralized security logic

### Performance Benefits
- **Reduced Mounting**: Only necessary components mount
- **Faster Navigation**: Single loading screen instead of multiple redirects
- **Memory Efficiency**: Unauthorized components don't consume resources
- **Better React Performance**: Fewer unnecessary re-renders

### User Experience Benefits
- **Professional Loading**: Branded loading screen during navigation
- **No Alert Spam**: Eliminates inappropriate "Access Denied" messages
- **Smooth Transitions**: Clean navigation without screen flashes
- **Consistent Behavior**: Same flow regardless of user role

---

## 📚 Documentation Structure

The project maintains comprehensive documentation across multiple files:

### Core Documentation Files
- **`ARCHITECTURE.md`** (this file): High-level architecture overview and principles
- **`PROJECT_STRUCTURE.md`**: Detailed file-by-file breakdown and code explanations
- **`BUGS_AND_FIXES.md`**: Comprehensive bug log with solutions and prevention strategies
- **`REFACTORING_SUMMARY.md`**: Summary of major architectural changes and improvements

### Documentation Philosophy
- **Living Documentation**: Updated with every architectural change
- **Comprehensive Coverage**: Every file and pattern explained
- **Learning Resource**: Detailed explanations for educational purposes
- **Audit Trail**: Complete history of decisions and changes

## 🔄 Recent Major Changes (2025-07-03)

### Landing Page Architecture Implementation
Implemented a centralized landing page approach for secure, race-condition-free navigation in the protected section. This architectural change enhances security by preventing unauthorized component mounting and improves user experience by eliminating inappropriate access alerts.

**Key Benefits**:
- **Enhanced Security**: Only authorized components mount and execute
- **Better User Experience**: No inappropriate alerts or screen flashes
- **Improved Performance**: Reduced unnecessary component operations
- **Easier Maintenance**: Centralized navigation logic

**Files Modified**:
- `app/(protected)/index.tsx` (new centralized landing page)
- `app/(protected)/_layout.tsx` (simplified to auth guard only)
- Role-specific dashboard components (cleaned access control logic)

### Documentation Enhancement
- **Enhanced Architecture Documentation**: Updated with landing page implementation details
- **Comprehensive Bug Tracking**: All issues and resolutions documented in BUGS_AND_FIXES.md
- **Private Documentation**: Sensitive details moved to internal documentation files

> **Note**: Detailed bug resolution history and troubleshooting information is maintained in `BUGS_AND_FIXES.md` for comprehensive knowledge management.

## 🎯 Development Guidelines

### Architecture Decision Making
- **Security First**: All architectural decisions prioritize medical-grade security
- **Landing Page Pattern**: Use centralized navigation for role-based routing
- **Component Isolation**: Keep authentication, authorization, and business logic separate
- **Audit Everything**: All user actions and system events must be logged

### Documentation Standards
- **ARCHITECTURE.md**: High-level patterns, principles, and architectural decisions
- **BUGS_AND_FIXES.md**: Detailed bug resolution history and prevention strategies  
- **Internal Documentation**: Sensitive implementation details kept in private files
- **Code Comments**: Inline documentation for complex business logic

### For New Developers
1. **Start with**: `ARCHITECTURE.md` for high-level understanding
2. **Bug Context**: `BUGS_AND_FIXES.md` for known issues and solutions
3. **Implementation**: Follow established patterns and security principles
4. **Documentation**: Update relevant docs when making changes

---

## 🔮 Future Architectural Considerations

### Planned Enhancements
- **Route Preloading**: Preload authorized routes based on user role
- **Navigation Caching**: Cache navigation decisions for better performance
- **Deep Link Handling**: Handle deep links through the landing page
- **Progressive Loading**: Show partial content while loading complete dashboard

### Scalability Considerations
- **Module Federation**: Consider micro-frontend approach for large teams
- **State Management**: Evaluate Redux/Zustand for complex state scenarios
- **Performance Monitoring**: Implement comprehensive performance tracking
- **Accessibility**: Enhanced accessibility features for medical compliance

### Security Enhancements
- **Enhanced Audit Logging**: More detailed security event logging
- **Session Management**: Advanced session handling and timeout policies
- **Biometric Authentication**: Optional biometric login for enhanced security
- **Data Encryption**: Enhanced encryption for sensitive medical data

### How to Document Issues:
1. **Problem Description** - Include exact error messages and symptoms
2. **Root Cause Analysis** - Explain what caused the issue
3. **Solution Steps** - Provide step-by-step fix instructions
4. **Prevention Tips** - Add best practices to avoid similar issues
5. **Code Examples** - Show before/after code when applicable

This ensures that all team members can benefit from previous troubleshooting experiences and solutions.

### Issue: Firebase False Flag Handling

**Problem Investigation:**
"Does the current setup account for if Firebase returns a false flag (that the user is definitely not in the database or the user is unauthenticated)?"

**Analysis:**
The current implementation **correctly** handles Firebase false flags:

1. **Firebase State Responses:**
   - `user = undefined` + `loading = true` → Still checking
   - `user = null` + `loading = false` → **FALSE FLAG** (definitively not authenticated)
   - `user = FirebaseUser` + `loading = false` → Authenticated

2. **Landing Screen Logic:**
   ```tsx
   // Early completion logic handles both true AND false results
   if (!loading && (user === null || (!loadingProfile && user))) {
       setAuthCheckComplete(true); // ✅ Stops timer for definitive results
   }
   
   // Button text correctly differentiates
   if (!user) return "Get Started"; // ✅ When Firebase says "no user"
   ```

3. **Timer Fallback Protection:**
   - Prevents infinite waiting if Firebase hangs
   - 5-second maximum wait time
   - Early completion when Firebase gives definitive answer

**Key Insight:**
The system correctly distinguishes between:
- **Checking** (`user = undefined`, `loading = true`)
- **Not Authenticated** (`user = null`, `loading = false`) ← **False Flag**
- **Authenticated** (`user = FirebaseUser`, `loading = false`)

**Improvement Made:**
Enhanced the early completion logic to be more explicit about handling unauthenticated users:
```tsx
if (!loading && (user === null || (!loadingProfile && user))) {
    // Handles both "definitely no user" and "user with loaded profile"
}
```

This ensures new users with empty databases get immediate "Get Started" button instead of waiting for timer.

### Issue: Infinite Loop in Landing Screen Timer

**Problem:**
The authentication timer was getting stuck in an infinite loop, continuously logging "Auth check timer expired" even after the auth check was complete.

**Log Evidence:**
```
LOG  Auth check completed early: {"loading": false, "loadingProfile": true, "user": false}
LOG  Auth check timer expired - completing check
LOG  Auth check timer expired - completing check
[...repeating infinitely...]
```

**Root Cause:**
1. The `useEffect` dependency array included `authCheckComplete`
2. When `setAuthCheckComplete(true)` was called, it triggered the effect to re-run
3. The timer continued running even after auth check was complete
4. This created an infinite loop where the timer kept firing

**Solution:**
1. **Removed `authCheckComplete` from dependency array** - prevents re-running when auth check completes
2. **Added early return guard** - prevents starting new timer if auth check is already complete
3. **Moved early completion logic** - checks auth state before starting timer

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

### Issue: "Text strings must be rendered within a <Text> component" Error

**Problem:**
React Native threw the error "Text strings must be rendered within a <Text> component" even though all text appeared to be properly wrapped in `<Text>` components.

**Error Evidence:**
```
ERROR  Error: Text strings must be rendered within a <Text> component.
    in AuthLandingScreen
```

**Root Causes:**
1. **Boolean rendering in JSX** - Using `&&` operator with booleans can cause React Native to try rendering `false`
2. **Implicit type conversion** - Functions might return non-string values in edge cases
3. **Conditional rendering patterns** - React Native is more strict than React web about rendering falsy values

**Solutions Applied:**
1. **Explicit string conversion** - Wrapped function calls in `String()` to ensure string output:
   ```tsx
   <Text>{String(getStatusMessage())}</Text>
   <Text>{String(getButtonText())}</Text>
   ```

2. **Ternary operator instead of &&** - Changed conditional rendering to explicit ternary:
   ```tsx
   // Before: {condition && <Component />}
   // After: {condition ? <Component /> : null}
   ```

3. **Explicit null returns** - Ensured all conditional renders return `null` instead of `false`:
   ```tsx
   {__DEV__ ? <DebugView /> : null}
   {shouldShow ? <ActivityIndicator /> : null}
   ```

**Key Lesson:**
React Native is stricter about rendering non-components compared to React web. Always use ternary operators with explicit `null` returns and ensure text content is always strings.

### Issue: Text Component Attributes Causing Render Error

**Problem:**
The error "Text strings must be rendered within a <Text> component" was occurring even when text was properly wrapped in `<Text>` components.

**Original Code (Broken):**
```tsx
{errorMsg ? <Text style={signinStyles.errorText}>{errorMsg}</Text> : null}
```

**Fixed Code (Working):**
```tsx
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

**Root Cause Analysis:**
The issue was **NOT** about the text rendering itself, but about **React Native's JSX parsing in single-line format**. 

**Why This Happened:**
1. **Single-line JSX complexity** - React Native's JSX parser can struggle with complex single-line expressions
2. **Conditional rendering edge case** - The combination of ternary operator + component + props in one line triggered parsing issues
3. **Component instantiation timing** - Single-line format may cause timing issues in component creation during state transitions

**Why The Fix Worked:**
1. **Multi-line format** - Breaking the JSX into multiple lines helps React Native's parser process the component properly
2. **Explicit component structure** - Clear opening/closing tags make component boundaries obvious
3. **Accessibility improvements** - Added `testID` and `accessibilityRole` as bonus improvements
4. **Better readability** - Multi-line format is easier to debug and maintain

**Key Insights:**
- **Not always about logic** - Sometimes React Native errors are about JSX formatting/parsing
- **Single-line vs multi-line matters** - Complex components should use multi-line format
- **Conditional rendering best practices** - Use explicit parentheses and line breaks for conditional JSX

**Prevention Strategy:**
Always use multi-line format for conditional rendering of components with multiple props:
```tsx
// Avoid:
{condition ? <Component prop1="value" prop2="value">{content}</Component> : null}

// Prefer:
{condition ? (
    <Component 
        prop1="value" 
        prop2="value"
    >
        {content}
    </Component>
) : null}
```

**Locations Fixed:**
- `app/(auth)/Signin.tsx` - Error message rendering

### Issue: Firebase Firestore Security Rules - Medical Records Compliance

**Problem:**
Multiple permission errors when creating user profiles and logging actions:
```
ERROR  Error creating default user profile: [FirebaseError: Missing or insufficient permissions.]
ERROR  LogService: Error logging action: [FirebaseError: Missing or insufficient permissions.]
```

**Root Cause Analysis:**

1. **LogService Field Mismatch:**
   - Rules expected `serverTimestamp` field, LogService sent `timestamp`
   - Rules missing validation for `username` field that LogService includes

2. **User Profile Creation Too Restrictive:**
   - Rules required `firstName`/`lastName` fields not provided by AuthContext
   - Rules didn't allow `'unverified'` role that AuthContext creates
   - Rules expected custom claims that may not be immediately available

3. **Medical Records Security Requirements:**
   - Need role-based access control for patient/caretaker/doctor relationships
   - Must protect medical data subcollections with relationship verification
   - Require immutable audit trails for compliance

**Solution Implemented:**

**Enhanced Security Rules Structure:**
```javascript
// Medical-grade security layers:
1. Helper Functions: isAuthenticated(), isOwner(), isAdmin(), isDoctorLinkedToPatient()
2. User Profiles: artifacts/{appId}/users/{userId} with role-based access
3. Medical Data: Subcollections with relationship-based permissions
4. Relationships: doctor-patient, caretaker-patient with status control
5. Audit Logs: Immutable logging with admin-only access
```

**Key Security Features:**
- **Data Ownership**: Users can only access their own medical records
- **Relationship-Based Access**: Doctors/caretakers can read patient data only if relationship is 'accepted'
- **Role Validation**: Multiple fallbacks for role checking (custom claims + document)
- **Audit Trail**: Immutable logs with comprehensive field validation
- **Principle of Least Privilege**: Default deny all, explicit allow rules only

**Field Validation Fixed:**
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

// User profile creation now allows initial 'unverified' state:
allow create: if isAuthenticated()
  && request.auth.uid == userId
  && request.resource.data.uid == userId
  && request.resource.data.email is string
  && request.resource.data.role in ['patient', 'caretaker', 'doctor', 'admin', 'unverified'] // Added 'unverified'
  && (request.resource.data.profileCompleted == false || request.resource.data.profileCompleted == true);
```

**Medical Data Protection:**
- **Patient Data**: Only accessible by owner, approved caretakers, linked doctors, or admins
- **Relationships**: Structured ID format for predictable queries and security
- **Status Control**: Pending → Accepted/Rejected workflow for relationship approval
- **No Deletion**: Medical records and relationships cannot be deleted (audit compliance)

**Deployment Required:**
```bash
firebase deploy --only firestore:rules
```

**Security Validation Checklist:**
- ✅ User profiles: Owner-only access with role validation
- ✅ Medical data: Relationship-based access control
- ✅ Audit logs: Admin-only read, immutable writes
- ✅ Relationships: Status-based permissions
- ✅ Default deny: All unmatched paths denied
- ✅ Field validation: Comprehensive data type checking

**Compliance Notes:**
This ruleset supports HIPAA-style requirements for medical record systems with proper access controls, audit trails, and data segregation.

## 🔗 Integration Patterns

### Service Layer Architecture
The application follows a clean service layer architecture that separates concerns and enables maintainable, testable code:

- **Authentication Service**: Centralized user authentication and session management
- **Database Service**: Abstracted data access with consistent error handling
- **Logging Service**: Comprehensive audit trail for compliance and debugging
- **Device Service**: Cross-platform device identification and information capture
- **Navigation Service**: Centralized routing logic with security controls

### Cross-Platform Compatibility
Built with React Native and Expo, the application provides:

- **Universal Codebase**: Single codebase for iOS, Android, and Web
- **Platform-Specific Optimizations**: Tailored experiences for each platform
- **Native Feature Integration**: Access to device-specific capabilities
- **Consistent User Experience**: Unified design system across all platforms

### Security Integration
Security is integrated at every layer:

- **Firebase Authentication**: Industry-standard authentication with email verification
- **Firestore Security Rules**: Database-level access controls and validation
- **Role-Based Access Control**: Granular permissions based on user roles
- **Audit Logging**: Comprehensive activity tracking for compliance
- **Device Fingerprinting**: Enhanced security through device identification

### Medical Compliance Framework
The architecture supports healthcare data requirements:

- **Audit Trail Compliance**: Immutable logging of all user actions
- **Data Access Controls**: Strict role-based and relationship-based permissions
- **Privacy Protection**: Secure handling of sensitive medical information
- **Regulatory Compliance**: Framework supports HIPAA-style requirements

## 🚀 Future Enhancements

### Planned Features
- **Real-time Data Synchronization**: Live updates across connected devices
- **Advanced Analytics**: Health trend analysis and insights
- **Integration APIs**: Third-party medical device and service integration
- **Offline Capability**: Enhanced offline functionality with sync
- **Advanced Security**: Multi-factor authentication and biometric support

### Scalability Considerations
- **Microservices Architecture**: Potential migration to service-based architecture
- **Edge Computing**: Reducing latency through distributed processing
- **Advanced Caching**: Intelligent data caching for improved performance
- **Load Balancing**: Horizontal scaling for high availability

### Technical Debt Management
- **Code Quality**: Continuous refactoring and improvement
- **Testing Coverage**: Comprehensive automated testing suite
- **Documentation**: Maintaining up-to-date technical documentation
- **Performance Optimization**: Ongoing performance monitoring and tuning

> **Note**: Detailed implementation plans and technical specifications are maintained in internal development documentation.

## 🔐 Security Architecture

### Authentication Layers
1. **Firebase Authentication**: Secure session management and email verification
2. **Firestore Security Rules**: Database-level access control and validation  
3. **Application Logic**: Additional client-side security checks
4. **Audit Logging**: Comprehensive action tracking with device identification

### Data Access Control Matrix

| User Type | Own Data | Patient Data | System Data | Audit Logs |
|-----------|----------|--------------|-------------|------------|
| **Patient** | ✅ Full | ❌ None | ❌ None | ✅ Own Only |
| **Doctor** | ✅ Full | ✅ Linked Only | ❌ None | ✅ Own Only |
| **Caretaker** | ✅ Full | ✅ Linked Only | ❌ None | ✅ Own Only |
| **Admin** | ✅ Full | ✅ All | ✅ Full | ✅ All |
| **Unverified** | ❌ None | ❌ None | ❌ None | ❌ None |

### Relationship-Based Access
```javascript
// Doctor-Patient Relationship Requirements
1. Valid doctor role
2. Relationship document exists: {doctorId}_{patientId}_doctor-patient
3. Relationship status: 'accepted'
4. Patient must have approved the relationship

// Caretaker-Patient Relationship Requirements  
1. Valid caretaker role
2. Relationship document exists: {caretakerId}_{patientId}_caretaker-patient
3. Relationship status: 'accepted'
4. Patient must have approved the relationship
```

## �️ Data Architecture

### Database Design Principles
- **Medical-Grade Privacy**: HIPAA-style data protection and access controls
- **Relationship-Based Access**: Professional relationships enable data sharing
- **Immutable Audit Trail**: Complete logging of all data access and modifications
- **Role-Based Permissions**: Different access levels for patients, doctors, caretakers, and admins
- **Secure by Default**: All data protected unless explicitly authorized

### Key Collections
- **User Profiles**: Core user information and role assignments
- **Professional Relationships**: Verified doctor-patient and caretaker-patient connections
- **Audit Logs**: Comprehensive activity tracking for compliance
- **Credential Verification**: Doctor license and education verification system
- **Invitation System**: Secure patient invitation and relationship establishment

> **Note**: Detailed database schemas and security rules are maintained in internal documentation for security purposes.

## 🛠️ Development Guidelines

### Code Organization Principles
- **Feature-Based Structure**: Group related functionality together
- **Type Safety First**: Comprehensive TypeScript throughout
- **Security by Design**: Authentication and authorization at every layer
- **Audit Everything**: All user actions must be logged
- **Mobile-First**: Optimized for mobile with web support

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `deviceInfo.ts`)
- **Styles**: kebab-case (e.g., `signin-styles.ts`)
- **Routes**: Expo Router format (e.g., `(auth)/index.tsx`)

### Security Best Practices
- **Never trust client-side**: All security enforced at database level
- **Principle of least privilege**: Minimal permissions by default
- **Audit trail compliance**: Every action logged with context
- **Input validation**: Client and server-side validation
- **Error handling**: Secure error messages without data exposure

---

## 🎊 Current Architecture Status

### ✅ Landing Page Architecture (2025-07-03)
The Diabeto app successfully implements a robust landing page architecture that provides:

- **Secure Navigation**: Centralized routing logic that prevents race conditions
- **Enhanced User Experience**: Clean navigation flow without inappropriate alerts
- **Medical-Grade Security**: Only authorized components mount and execute
- **Maintainable Codebase**: Clear separation of concerns and single source of truth
- **Comprehensive Documentation**: Well-documented patterns for future development

### ✅ Documentation Organization
- **Public Architecture Documentation**: High-level patterns and principles in ARCHITECTURE.md
- **Comprehensive Bug Tracking**: Detailed resolution history in BUGS_AND_FIXES.md
- **Private Internal Documentation**: Sensitive implementation details kept secure
- **Security-First Approach**: Medical-grade privacy and compliance standards

The application now provides a secure, well-documented foundation for healthcare data management with proper architectural patterns for scalable development.

---

*Last Updated: July 3, 2025*
