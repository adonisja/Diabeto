# Diabeto Project Structure Guide (Updated 2025-07-05)

## 📋 Overview
This comprehensive guide explains every file and folder in the Diabeto medical records app, their purposes, data flows, and interactions. Use this as a learning tool to understand the complete project architecture.

**📄 Document Purpose**: Detailed technical reference for file organization, component functionality, and code structure.

**Latest Update**: Medical-Grade Logging System implementation with comprehensive audit trail capabilities and advanced logging utilities for healthcare compliance.

**✅ What belongs in this document:**
- File and folder structure explanations
- Component functionality and features
- Technical implementation details
- Data flow architecture
- Code organization principles
- Development workflow guidance
- Integration patterns and technical relationships
- Medical-grade logging and audit trail implementation

**❌ What does NOT belong here:**
- High-level system design decisions (→ ARCHITECTURE.md)
- Feature implementation timelines (→ DOCUMENTATION_INDEX.md)
- Bug fixes and problem resolution (→ BUGS_AND_FIXES.md)
- Database security rules (→ firestore.rules file)
- Marketing or user-facing feature descriptions

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
- `expo-notifications`: Cross-platform notification system for patient reminders
- `@react-native-community/datetimepicker`: Time selection for reminder scheduling
- `expo-linear-gradient`: Professional gradient backgrounds and styling

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

## 🔥 Firebase Integration (`firebase/` Directory)

### `firebase/firebaseConfig.ts`
**Purpose**: Firebase SDK initialization and configuration
**Educational Value**: This file demonstrates proper Firebase setup patterns for medical applications

**Features**:
- **Platform-specific persistence**: Web uses browser storage, mobile uses AsyncStorage
- **Environment variable integration**: Secure configuration management
- **Service initialization**: Auth, Firestore, and other Firebase services
- **Error handling**: Graceful degradation for missing configuration

**Code Architecture Explanation**:
```typescript
// Why we use platform-specific persistence
const firebaseConfig = {
  // Configuration pulled from environment variables for security
  // Never hardcode API keys in production medical applications
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  // ... other config
};

// Platform-specific initialization
if (Platform.OS === 'web') {
  // Web browsers use IndexedDB for offline persistence
  enableIndexedDbPersistence(db);
} else {
  // Mobile uses device storage for better performance
  enableNetwork(db);
}
```

**Design Decision: Environment Variables**:
- **Why**: API keys must not be hardcoded in medical applications
- **How**: Expo's EXPO_PUBLIC_ prefix for client-side variables
- **Security**: Keys are still visible in compiled app, but not in source code
- **Alternative Considered**: Server-side proxy (rejected for simplicity in MVP)

### `firebase/AuthContext.tsx`
**Purpose**: Authentication state management and user profile integration
**Educational Value**: Perfect example of React Context pattern with async data loading

**Features**:
- **Real-time auth state**: Firebase Auth integration with React Context
- **User profile loading**: Automatic Firestore profile fetching
- **Loading states**: Proper loading indicators during auth operations
- **Default profile creation**: Creates basic profiles for new users
- **Error handling**: Comprehensive auth error management

**Context Architecture**:
```typescript
interface AuthContextType {
  user: User | null;              // Firebase Auth user
  userProfile: UserProfile | null; // Firestore profile data
  loading: boolean;               // Auth state loading
  loadingProfile: boolean;        // Profile loading state
  signOut: () => Promise<void>;   // Secure sign out function
}
```

**Data Flow Pattern**:
```
App Launch → AuthContext Provider → Firebase Auth Listener → 
User Found? → Load Firestore Profile → Update Context State → 
Components Re-render with User Data
```

**Critical Implementation Detail - Race Condition Prevention**:
```typescript
// This pattern prevents profile loading before auth is ready
useEffect(() => {
  if (loading) return; // Wait for auth state to be determined
  if (!user) {
    setUserProfile(null);
    setLoadingProfile(false);
    return;
  }
  
  // Only load profile for authenticated users
  loadUserProfile(user.uid);
}, [user, loading]);
```

**Why This Pattern Matters**:
- **Prevents**: Attempting to load profiles for null users
- **Ensures**: Clean loading states throughout the app
- **Provides**: Consistent auth state across all components
- **Medical Compliance**: Clear audit trail of who is accessing what when

### `firebase/LogService.tsx`
**Purpose**: Centralized audit logging for medical-grade compliance
**Educational Value**: Demonstrates medical-grade logging patterns and HIPAA-style audit trails

**Enhanced Medical-Grade Features** (Added July 2025):
- **Complete audit trail**: Every medical action logged with full context
- **Advanced analytics**: Real-time medical intelligence and insights
- **Compliance verification**: Automated regulatory compliance checking
- **Data integrity**: Cryptographic verification of medical records
- **Performance monitoring**: Medical-grade system reliability tracking

**Standard Logging Architecture**:
```typescript
interface LogEntry {
  uid: string;                    // User performing action
  username: string;               // User's chosen username
  email: string;                  // User's email address
  role: UserRole;                 // User's role at time of action
  action: string;                 // Standardized action type
  outcome: 'success' | 'failure' | null;
  details: {
    deviceId: string;             // Device identification for security
    timestamp: string;            // ISO timestamp
    // Context-specific data
  };
  timestamp: Timestamp;           // Server timestamp (immutable)
}
```

**Advanced Logging Functions**:
```typescript
// Basic medical action logging
logAction(action: string, outcome?: string, details?: any)

// Enhanced logging with medical context
logEnhanced(action: string, medicalContext: MedicalContext, metadata?: any)

// Navigation tracking for compliance
logNavigation(screenName: string, action: 'enter' | 'exit')

// Performance monitoring for medical systems
logPerformance(metric: string, value: number, context?: any)

// Medical compliance verification
verifyMedicalCompliance(): Promise<ComplianceReport>

// Automated audit report generation
generateAuditReport(timeRange: TimeRange): Promise<AuditReport>
```

**Why Medical-Grade Logging Matters**:
- **Regulatory Compliance**: HIPAA and other medical regulations require complete audit trails
- **Patient Safety**: Tracking all medical actions helps identify patterns and prevent errors
- **Legal Protection**: Immutable logs provide legal protection for healthcare providers
- **Quality Improvement**: Data analysis helps improve medical care quality
- **Security**: Complete logging helps detect and prevent security breaches

**Implementation Philosophy**:
- **Never Fail**: Logging errors must not break medical functionality
- **Complete Context**: Every log entry includes full context for analysis
- **Immutable**: Once written, logs cannot be modified (achieved through Firestore security rules)
- **Real-time**: Medical actions are logged immediately for real-time monitoring
- **Searchable**: Structured data enables powerful analytics and compliance reporting

### `firestore.rules`
**Purpose**: Database security rules for Firestore
**Medical-Grade Security Features**:
- **Role-based access control**: Patient, doctor, caretaker, admin roles
- **Relationship-based permissions**: Doctors can only access linked patients
- **Data ownership**: Users can only access their own medical records
- **Immutable audit logs**: All actions are logged and cannot be modified
- **Field validation**: Strict data type and format validation

**Key Collections Architecture**:
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

**Design Decision: Why Collection Structure Matters**:
This nested structure was chosen over flat collections for several critical reasons:
1. **Natural Data Ownership**: Medical data naturally belongs to patients
2. **Firebase Security**: Subcollections inherit parent document permissions
3. **Query Efficiency**: Patient data queries are automatically scoped
4. **Audit Compliance**: Clear ownership chain for medical record regulations
5. **Scalability**: Each patient's data is isolated for performance

**Trade-offs Made**:
- ✅ **Pro**: Automatic data scoping and security inheritance
- ✅ **Pro**: HIPAA-style data ownership and access control
- ✅ **Pro**: Efficient queries that don't scan all users' data
- ❌ **Con**: More complex cross-patient analytics (solved with Cloud Functions)
- ❌ **Con**: Slightly more complex relationship management (acceptable for security gains)
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
**Purpose**: User authentication form with multiple sign-in options
**Advanced Features**:
- **Username/Email support**: Accepts both authentication methods
- **Google Sign-In integration**: OAuth 2.0 authentication with Firebase
- **Email verification blocking**: Prevents unverified users from accessing app
- **Smart input detection**: Automatically detects email vs username format
- **Device ID logging**: Records device information for security auditing
- **iOS password manager support**: Optimized for autofill and keychain

**Authentication Flow**:
```
Traditional: Input → Detect Type → Resolve Username to Email → Firebase Auth → Email Verification Check → Log Device → Success/Error
Google OAuth: Google Button → OAuth Flow → Firebase Credential → Profile Creation/Login → Navigation
```

**Google Sign-In Features**:
- Professional Google-branded button with loading states
- Automatic user profile creation for new Google users
- Seamless integration with existing Firebase authentication
- Comprehensive error handling and audit logging
- Cross-platform OAuth support (web, iOS, Android)

**Security Features**:
- Immediate sign-out for unverified emails
- Comprehensive error handling and user feedback
- Audit logging with device identification
- Firestore username-to-email resolution

#### `app/(auth)/Signup.tsx`
**Purpose**: User registration form with multiple registration options
**Features**:
- **Username uniqueness validation**: Prevents duplicate usernames
- **Google Sign-In integration**: OAuth 2.0 registration with Firebase
- **Real-time availability checking**: Immediate feedback on username conflicts
- **Comprehensive profile creation**: Creates both Firebase Auth account and Firestore profile
- **Email verification**: Sends verification email after account creation
- **Audit logging**: Records successful registrations with device information

**Registration Flow**:
```
Traditional: Form Input → Username Availability Check → Create Firebase Auth → Create Firestore Profile → Send Email Verification → Log Success → Redirect
Google OAuth: Google Button → OAuth Flow → Auto-profile Creation → Navigation
```

**Google Registration Features**:
- One-click registration with Google account
- Automatic username generation from email
- Pre-populated name fields from Google profile
- Same professional UI as sign-in screen

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

#### `app/(protected)/hand-selection.tsx`
**Purpose**: Professional image-based hand and finger selection system for glucose monitoring
**Features**:
- **Two-step selection flow**: Hand selection → Finger selection with custom hand images
- **Professional hand images**: Uses left_hand.png and right_hand.png for realistic interface
- **Interactive overlay system**: Precisely positioned finger buttons on hand images
- **Pulse animations**: Subtle continuous pulse + press feedback for finger buttons
- **Navigation integration**: Seamless expo-router navigation with back button support
- **Callback mechanism**: Returns selected finger to glucose entry form via state manager
- **Polished UI**: Gradient backgrounds, professional styling, accessible design
- **Consistent imaging**: Both hands use same overlay style for unified experience

**Technical Implementation**:
- **FINGER_POSITIONS**: Manually calibrated coordinates for accurate finger button placement
- **FingerButton Component**: Animated buttons with dual pulse effects (continuous + press)
- **State Management**: Simple callback system for finger selection communication
- **Image Integration**: Custom hand images with subtle overlay for professional appearance
- **Responsive Design**: Adapts to different screen sizes while maintaining accuracy

**Visual Design**:
- **Professional aesthetics**: Medical-app appropriate color scheme and typography
- **Animation system**: Smooth pulse animations that provide visual feedback
- **Accessibility**: Clear labeling and appropriate touch targets
- **Consistent branding**: Matches app's overall design language

**Data Flow**: 
- GlucoseEntryForm navigates to hand-selection
- User selects hand → finger → callback to form with full finger identifier
- Screen-based approach provides better UX than modal with professional appearance

#### `app/(protected)/medical-alert-detail.tsx`
**Purpose**: Detailed medical alert view with comprehensive medical information and action options
**Features**:
- **Comprehensive Alert Information**: Full reading context, severity explanation, and medical guidance
- **Medical Context Display**: Shows related readings, trends, and historical patterns
- **Action Buttons**: Contact patient, message other caretakers, schedule follow-up appointments
- **Evidence-Based Explanations**: Detailed medical rationale for alert severity classification
- **Professional Interface**: Medical-grade UI with clear information hierarchy
- **Responsive Design**: Optimized for mobile healthcare provider access
- **Audit Trail Integration**: Logs all alert acknowledgments and actions taken

**Navigation Integration**:
- Accessible from MedicalAlertsPanel via "View Details" button
- Back navigation to alerts panel or appropriate dashboard
- Deep linking support for push notification navigation

### Role-Specific Sections

#### `app/(protected)/(patient)/`
**Purpose**: Patient-specific screens and functionality with enhanced visual design
**Access Control**: Handled by landing page - only authorized patients can reach these screens
**Design Philosophy**: Vibrant, engaging interfaces that make healthcare management enjoyable
**Features**:
- Medical record viewing and entry with colorful, intuitive interfaces
- Interactive health monitoring with gamification elements
- Starry body diagram for insulin site selection
- Enhanced visual feedback and motivational messaging

**Screens**:
- `index.tsx`: **Enhanced** Patient dashboard with vibrant gradient backgrounds and motivational messaging
  - Colorful action cards with unique gradient themes
  - "Champion" messaging instead of clinical "Patient" language
  - Interactive health tips and progress indicators
  - Engaging emoji integration and friendly language

- `glucose-monitoring.tsx`: **Enhanced** Dedicated glucose monitoring screen with vibrant, interactive design
  - Transition from modal to full-screen architecture
  - Colorful data visualization and user-friendly interfaces
  - Enhanced finger rotation tracking and visual feedback

- `insulin-monitoring.tsx`: **NEW** Revolutionary insulin monitoring screen with starry human body diagram
  - **Starry Human Body Diagram**: Interactive constellation interface for injection site selection
  - **Role-Based Visual Access**: Different colored stars for different access levels
  - **Recommendation System**: Brightest twinkling indicates optimal injection sites
  - **Immersive Experience**: Seamless blending of medical functionality with engaging visuals

- `heart-rate-monitoring.tsx`: **NEW** Comprehensive cardiovascular health monitoring screen
  - **Manual Entry with Pulse Counter**: Built-in pulse counting with animated heart feedback
  - **Device Integration Hub**: Mock device management for smartwatches and fitness trackers
  - **Historical Analytics**: Trend analysis with visual indicators and statistical summaries
  - **Medical Validation**: Heart rate range validation (60-200 BPM) with abnormal reading alerts
  - **Vibrant Design**: Rose-coral gradient theme consistent with cardiovascular health branding
  - **Enhanced Colors**: Vibrant gradients (pink arms, green stomach, blue legs)
  - **Visual Safety**: Restricted sites shown as dimmed stars with clear indicators

- `insulin-logging.tsx`: **Enhanced** Comprehensive insulin injection logging with prescribed dosage integration
  - **Prescribed Dosage Management**: Auto-populated doctor-prescribed defaults
  - **Smart Form Population**: Automatic dosage filling based on insulin type selection
  - **Dosage Override Detection**: Real-time tracking when patients modify prescriptions
  - **Visual Feedback**: Enhanced UI showing prescribed vs. modified amounts
  - **Mandatory Justification**: Required notes when dosages are altered
  - **Starry Body Integration**: Uses same constellation interface for site selection
  - **Welcome View Enhancement**: Improved color scheme and text readability
  - **Medical Validation**: Enhanced form validation with prescription consideration

- `patientInvitationsScreen.tsx`: Patient invitation management

- `reminders.tsx`: **ENHANCED** Comprehensive reminder and notification system with custom meal support
  - **Daily Meal Reminders**: Customizable times for breakfast, lunch, and dinner
  - **Custom Meal Support**: **NEW** Unlimited custom meal reminders with emoji selection and flexible timing
  - **Time Adjustment**: **NEW** Tap any meal time (standard or custom) to modify with native time picker
  - **Glucose Check Reminders**: Automatic notifications 2 hours after each meal (including custom meals)
  - **Insulin Reminders**: Daily long-acting insulin reminder at user-specified time
  - **Smart Scheduling**: Uses Expo Notifications for reliable cross-platform reminders
  - **Permission Management**: Handles notification permissions and user guidance
  - **Firestore Integration**: Settings synced across devices via Firestore with proper security rules
  - **Custom Meal Modal**: Professional interface for adding custom meals with emoji picker
  - **Meal Management**: Add, edit, and remove custom meals with confirmation dialogs
  - **Platform Compatibility**: iOS spinner and Android default time picker displays
  - **Error Handling**: Comprehensive error management with user-friendly feedback
  - **Medical-Appropriate Design**: Professional UI matching app's health-focused theme

**Architecture Evolution**: 
- **Modal → Screen Transition**: Both glucose and insulin monitoring migrated to dedicated screens
- **Visual Enhancement**: Replaced sterile medical themes with engaging, colorful designs
- **User Experience Focus**: Prioritized patient engagement and motivation over clinical appearance

#### `app/(protected)/(caretaker)/`
**Purpose**: Caretaker dashboard and patient management
**Access Control**: Handled by landing page - only authorized caretakers can reach these screens
**Features**:
- Patient invitation system
- Multiple patient monitoring
- Relationship management
- Care coordination tools
- **Enhanced Insulin Logging**: Same starry body experience as patients

**New Screens Added**:
- `insulin-logging.tsx`: **NEW** Caretaker insulin logging with patient selection
  - **Patient Selection Interface**: Required field for specifying which patient receives insulin
  - **Starry Body Integration**: Same constellation interface as patient version
  - **Enhanced Welcome View**: Caretaker-specific messaging with care-focused design
  - **Role-Based Access**: Full access to arm injection sites for better flexibility
  - **Color Scheme**: Orange/amber theme matching caretaker brand identity
  - **Professional Validation**: Medical-grade dosage and timing validation
  - **Audit Trail**: Complete logging with caretaker attribution and patient identification

#### `app/(protected)/(doctor)/`
**Purpose**: Doctor dashboard and patient care
**Access Control**: Handled by landing page - only authorized doctors can reach these screens
**Features**:
- Patient record access (relationship-based)
- Medical data analysis
- Treatment planning
- Professional tools
- **Prescribed Dosage Management**: Set default insulin dosages for patients

**New Screens Added**:
- `index.tsx`: Enhanced doctor dashboard with patient dosage management access
- `patient-dosages.tsx`: Dedicated screen for managing patient insulin prescriptions
- `_layout.tsx`: Enhanced with patient-dosages screen routing

**Patient Dosage Management Features**:
- **Patient List Interface**: View all patients with current prescribed dosages
- **Dual Dosage Control**: Set both short-acting and long-acting insulin defaults
- **Real-Time Updates**: Immediate synchronization with patient logging interfaces
- **Medical Validation**: Prevents dangerous dosage amounts (0-100 units)
- **Prescription Tracking**: Complete audit trail of dosage modifications
- **Professional UI**: Medical-grade interface with doctor-specific styling

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

## 🧩 Components (`components/` Directory)

### Core Components (`components/coreComponents/`)

#### `components/coreComponents/MedicalAlertsPanel.tsx`
**Purpose**: Central medical alerts dashboard for doctors and caretakers with real-time alert monitoring
**Features**:
- **Real-Time Alert Feed**: Live display of patient medical alerts with automatic refresh
- **Severity-Based Filtering**: Filter by Warning, Mild, Severe, Critical alert levels
- **Role-Based Access**: Shows alerts for patients under care (relationship-based access control)
- **Visual Severity Indicators**: Color-coded severity badges with medical icons
- **Quick Actions**: Mark as acknowledged, view detailed information, navigate to detail screen
- **Mobile Optimization**: Responsive design for healthcare provider mobile access
- **Empty State Handling**: Encouraging messaging when no alerts are present
- **Navigation Integration**: Seamless navigation to medical-alert-detail screen

**Alert Display Features**:
- **Comprehensive Information**: Patient name, reading type, value, timestamp, severity
- **Medical Context**: Brief explanation of why reading is abnormal
- **Status Tracking**: Acknowledged vs unacknowledged alert status
- **Time-Based Organization**: Most recent alerts displayed first
- **Professional UI**: Medical-grade interface with clear visual hierarchy

#### `components/coreComponents/NotificationSettings.tsx`
**Purpose**: Push notification preferences management for caretakers with comprehensive control options
**Features**:
- **Alert Notification Toggle**: Enable/disable push notifications for medical alerts
- **Severity Level Control**: Customize notifications for different severity levels (Warning, Mild, Severe, Critical)
- **Quiet Hours Configuration**: Set do-not-disturb periods for non-critical alerts
- **Delivery Preferences**: Choose between in-app only or push notifications
- **Real-Time Updates**: Settings applied immediately with user feedback
- **Firestore Integration**: Settings synchronized across devices for seamless experience
- **Permission Guidance**: Clear instructions for enabling device notification permissions
- **Professional Interface**: Medical app appropriate styling and user experience

**Technical Integration**:
- **NotificationService Integration**: Direct connection to push notification management
- **Firebase Sync**: Real-time settings synchronization via Firestore
- **Permission Handling**: Automatic notification permission requests when enabling alerts
- **Error Management**: Comprehensive error handling with user-friendly feedback
- **Audit Trail**: Settings changes logged for compliance and troubleshooting

#### `components/coreComponents/GlucoseMonitoringHub.tsx`
**Purpose**: Central navigation hub for glucose monitoring features
**Features**:
- **Unified Interface**: Single entry point for all glucose-related functionality
- **Role-Based Access**: Accessible by both patients and caretakers
- **Feature Navigation**: Quick access to manual entry, history, and CGM integration
- **Modern UI**: Clean, card-based layout with professional medical styling
- **Data Overview**: Real-time glucose status and recent readings summary

**Navigation Options**:
- Manual glucose entry form
- Historical readings viewer with analytics
- CGM device integration and sync
- Glucose trend analysis and alerts

#### `components/coreComponents/GlucoseEntryForm.tsx`
**Purpose**: Manual glucose reading entry with medical validation, clean navigation integration, screen-based finger selection, and alert generation
**Recent Updates**: Transitioned from modal to dedicated screen-based finger selection for better UX
**Features**:
- **Clean Integration**: Headerless design that seamlessly integrates with parent screen navigation
- **Modern Architecture**: Recently reconstructed with clean, maintainable code structure
- **Separated Layout Systems**: Distinct timing and finger selection sections with dedicated styling architectures
- **True 2x2 Timing Grid**: Dedicated grid system for timing options with centered random option
- **Screen-Based Finger Selection**: Navigation to dedicated hand-selection screen instead of modal
- **Callback Integration**: Uses callback mechanism to receive finger selection from dedicated screen
- **🆕 Alert Generation**: Automatic medical alert creation for abnormal glucose readings
- **Medical Validation**: Real-time glucose range checking (70-400 mg/dL)
- **Status Indicators**: Visual feedback for low, normal, high readings
- **Professional UI**: Medical-grade interface with enhanced visual hierarchy
- **Accessibility**: Larger fonts, better contrast, and optimal touch targets
- **Audit Trail**: All entries logged with timestamp and user information
- **Error Handling**: Comprehensive validation and user feedback
- **Navigation Flow**: Proper onClose prop handling and finger selection navigation

**Navigation Integration**:
- **Screen Navigation**: Uses `router.push('/hand-selection')` instead of modal
- **Callback System**: Sets finger selection callback before navigation
- **State Management**: Cleans up callbacks on component unmount
- **User Experience**: Full-screen finger selection provides better usability

**Timing Selection Architecture**:
- **Dedicated Grid System**: `timingGrid` with proper `timingRow` containers for true 2x2 layout
- **Individual Grid Items**: `timingGridItem` styled for perfect column alignment (70px height)
- **Centered Random Option**: Distinguished golden-themed random selection with 70% width
- **Visual Hierarchy**: Separate header styling and clear section organization
- **Independent Styling**: No conflicts with finger selection system
- **Visual Animation**: Continuous pulse animation for recommended fingers
- **Smart Layout**: Organized by finger type with clear left/right pairing
- **Enhanced Styling**: Golden glow effects, enhanced shadows, and professional aesthetics
- **Clear Labeling**: Position names with L/R indicators and emoji representations
- **Touch Optimization**: 80px minimum height cards for optimal mobile interaction

#### `components/coreComponents/HeartRateEntryForm.tsx`
**Purpose**: Manual heart rate entry with built-in pulse counter and medical validation
**Features**:
- **Manual Input Validation**: Medical-grade validation for heart rate ranges (60-200 BPM)
- **Built-in Pulse Counter**: Interactive pulse counting with timing and animated heart feedback
- **Measurement Context**: Options for rest, exercise, post-meal, and stress measurements
- **Real-time Feedback**: Immediate validation with alerts for abnormal readings
- **Notes Integration**: Additional context recording for medical review and analysis
- **Clean Integration**: Headerless design that seamlessly integrates with parent screen navigation
- **Professional UI**: Medical-grade interface with vibrant gradients and modern styling
- **Accessibility**: Large touch targets, clear typography, and high contrast ratios
- **Audit Trail**: Complete logging with timestamp, context, and device information
- **Error Handling**: Comprehensive validation and user feedback systems

**Pulse Counter Features**:
- **Animated Heart Icon**: Real-time heart animation during pulse counting sessions
- **15-Second Timer**: Standard medical timing for accurate heart rate calculation
- **Tap-to-Count Interface**: Large, responsive pulse counting button with haptic feedback
- **Automatic Calculation**: Real-time BPM calculation and display during counting
- **Reset Functionality**: Easy restart for accurate measurement retries

**Medical Validation**:
- **Range Checking**: Validates heart rate between 60-200 BPM with medical alerts
- **Context Recording**: Captures measurement circumstances for accurate interpretation
- **Abnormal Reading Alerts**: Immediate feedback for readings outside normal ranges
- **Status Indicators**: Visual feedback for low, normal, high, and critical readings

#### `components/coreComponents/HeartRateReadingsViewer.tsx`
**Purpose**: Historical heart rate data viewer with analytics and trend analysis
**Features**:
- **Statistical Analysis**: Weekly and monthly averages, ranges, and pattern identification
- **Trend Visualization**: Visual trend indicators (improving ↗️, declining ↘️, stable ➡️)
- **Time-based Filtering**: Historical data organization by timeframe and measurement context
- **Data Export**: Formatted data ready for sharing with healthcare providers
- **Empty State Guidance**: Encouraging messaging and tips for new users
- **Responsive Design**: Optimized viewing experience across different screen sizes
- **Professional Interface**: Medical-grade data presentation with clear visual hierarchy
- **Context Filtering**: Filter by measurement type (rest, exercise, stress, etc.)

**Analytics Features**:
- **Average Calculations**: Automatic calculation of weekly and monthly averages
- **Range Analysis**: Minimum and maximum values with trend indicators
- **Pattern Recognition**: Visual indicators for improving or declining trends
- **Recent Activity**: Highlighted recent readings with timestamp information
- **Medical Context Display**: Shows measurement circumstances for accurate interpretation

#### `components/coreComponents/HeartRateDeviceIntegration.tsx`
**Purpose**: Heart rate device management and synchronization interface
**Features**:
- **Mock Device Management**: Simulated Apple Watch, Fitbit, and Samsung Health integration
- **Auto-sync Settings**: Configurable automatic synchronization frequency and preferences
- **Device Discovery**: Simulated Bluetooth device scanning and connection management
- **Sync Status Tracking**: Real-time status updates and last sync timestamps
- **Integration Tips**: User guidance for optimal device setup and troubleshooting
- **Connection Management**: Device pairing, disconnection, and reconnection functionality
- **Professional Interface**: Medical device management with clear status indicators

**Device Management Features**:
- **Multi-Device Support**: Manage multiple heart rate monitoring devices simultaneously
- **Connection Status**: Real-time display of device connection and sync status
- **Battery Monitoring**: Device battery level tracking and low battery alerts
- **Sync Frequency Control**: Customizable automatic sync intervals (hourly, daily, manual)
- **Data Validation**: Ensures device data meets medical accuracy standards

**Integration Capabilities**:
- **Seamless Data Import**: Automatic heart rate data import from connected devices
- **Conflict Resolution**: Handles duplicate readings and data conflicts intelligently
- **Background Sync**: Continuous data synchronization without user intervention
- **Error Handling**: Comprehensive error management with user-friendly messaging

#### `components/coreComponents/BloodPressureEntryForm.tsx`
**Purpose**: Manual blood pressure entry with medical validation, real-time status feedback, and alert generation
**Features**:
- **Dual Input Validation**: Systolic (70-250 mmHg) and diastolic (40-150 mmHg) validation with relationship checking
- **Blood Pressure Categories**: Real-time categorization into Normal, Elevated, High Stage 1/2, and Hypertensive Crisis
- **🆕 Alert Generation**: Automatic medical alert creation for abnormal blood pressure readings
- **Optional Heart Rate**: Integrated pulse measurement (40-200 BPM) alongside blood pressure readings
- **Measurement Context**: Timing options for Morning, Evening, After Exercise, After Medication, and Other
- **Real-time Status Display**: Immediate visual feedback showing blood pressure category with color coding
- **Medical Notes**: Free-form text input for additional medical context and observations
- **Professional UI**: Medical-grade interface with gradient backgrounds and intuitive layout
- **Comprehensive Validation**: Ensures systolic > diastolic and validates against medical standards
- **Clean Integration**: Headerless design for seamless parent screen navigation
- **Audit Trail**: Complete activity logging with timestamps and medical context

**Validation Features**:
- **Range Validation**: Enforces medically appropriate blood pressure ranges with clear error messaging
- **Relationship Validation**: Ensures systolic pressure is higher than diastolic pressure
- **Status Classification**: Automatic categorization following standard medical guidelines
- **Color-Coded Feedback**: Visual indicators for different pressure categories (green=normal, red=high, etc.)
- **Comprehensive Error Handling**: User-friendly validation messages and guidance

**Medical Standards Compliance**:
- **AHA Guidelines**: Follows American Heart Association blood pressure categories
- **Professional Accuracy**: Medical-grade validation matching clinical standards
- **Context Recording**: Captures measurement circumstances for accurate medical interpretation
- **Complete Documentation**: Detailed notes and timing context for healthcare provider review

#### `components/coreComponents/BloodPressureReadingsViewer.tsx`
**Purpose**: Historical blood pressure data viewer with analytics, trends, and comprehensive statistics
**Features**:
- **Time-Based Filtering**: Weekly, monthly, and quarterly data analysis with configurable time periods
- **Statistical Dashboard**: Average systolic/diastolic pressure, pulse, reading counts, and pressure ranges
- **Category Analysis**: Color-coded blood pressure categories with medical standard compliance
- **Reading Management**: Individual reading deletion with confirmation prompts and bulk operations
- **Professional Data Display**: Medical-grade presentation with clear visual hierarchy and accessibility
- **Trend Analysis**: Pattern recognition and visual indicators for blood pressure trends
- **Export Ready**: Formatted data suitable for sharing with healthcare providers
- **Responsive Design**: Optimized viewing experience across mobile and tablet devices

**Analytics Features**:
- **Comprehensive Statistics**: Automatic calculation of averages, ranges, and trend patterns
- **Category Distribution**: Visual breakdown of readings by blood pressure category
- **Time-based Trends**: Historical analysis showing improvement or decline patterns
- **Medical Context Display**: Shows measurement timing and circumstances for accurate interpretation
- **Range Tracking**: Minimum and maximum values with historical trend indicators

**Data Management**:
- **Reading Organization**: Chronological display with medical context and category indicators
- **Search and Filter**: Find specific readings by date, category, or measurement context
- **Data Validation**: Ensures data integrity and medical accuracy standards
- **Professional Interface**: Medical device-style data presentation with clear typography

#### `components/coreComponents/BloodPressureDeviceIntegration.tsx`
**Purpose**: Blood pressure device management and synchronization with medical-grade device support
**Features**:
- **Multi-Device Support**: Mock integration for OMRON BP652 (Bluetooth) and Withings BPM Core (WiFi)
- **Connection Management**: Device pairing, connection status tracking, and disconnection functionality
- **Auto-sync Configuration**: Configurable sync intervals (15min, 30min, 1hour, 4hours) with manual override
- **Device Status Monitoring**: Real-time connection status, battery levels, and last sync timestamps
- **Reading Import**: Simulated automatic blood pressure data import with validation
- **Professional Interface**: Medical device management with clear status indicators and user guidance
- **Error Handling**: Comprehensive device error management with troubleshooting guidance

**Device Management Features**:
- **Connection Tracking**: Real-time display of device connection and sync status with visual indicators
- **Battery Monitoring**: Device battery level tracking with low battery alerts and notifications
- **Sync History**: Complete synchronization log with timestamps and reading counts
- **Device Discovery**: Automatic Bluetooth/WiFi device scanning and pairing assistance
- **Data Validation**: Ensures imported device data meets medical accuracy standards

**Integration Capabilities**:
- **Seamless Data Import**: Automatic blood pressure reading import from connected devices
- **Conflict Resolution**: Intelligent handling of duplicate readings and data conflicts
- **Background Sync**: Continuous data synchronization without requiring user intervention
- **Medical Compliance**: Ensures all device data meets medical-grade accuracy requirements
- **Professional Setup**: Device pairing guidance and optimal configuration instructions

- **`glucoseViewerStyles.ts`**: Historical data viewer styling
  - Data table formatting for glucose readings
  - Status badge styling for medical ranges
  - Filtering interface styles
  - Responsive design for mobile and tablet

- **`glucoseHubStyles.ts`**: Central hub navigation styling
  - Card-based layout for feature navigation
  - Professional medical interface design
  - Modern UI components and spacing
  - Accessibility-compliant color schemes

- **`cgmStyles.ts`**: CGM integration interface styling
  - Device connection status indicators
  - Real-time data display formatting
  - Sync status and error state styling
  - Medical device interface standards

- **`insulinEntryStyles.ts`**: Insulin injection logging form styling
  - Medical form layout with clear sections
  - Site selection interface with body diagrams
  - Recommendation system styling
  - Dosage input validation styling
  - Role-based access visual indicators
  - **Prescribed Dosage Styling**: Visual indicators for doctor-prescribed amounts
  - **Override Detection Styling**: Warning colors and badges for modified dosages
  - **Requirement Cards**: Contextual messaging for mandatory justification notes
  - **Enhanced Form Validation**: Visual feedback for prescription vs. actual dosages

- **`insulinViewerStyles.ts`**: Historical insulin data viewer styling
  - Data table formatting for insulin injections
  - Status badge styling for injection site rotation
  - Filtering interface styles
  - Responsive design for mobile and tablet

- **`insulinHubStyles.ts`**: Insulin monitoring hub styling
  - Navigation card layout for insulin features
  - Medical tips and guidelines presentation
  - Professional healthcare interface design

- **`heartRateEntryStyles.ts`**: Heart rate entry form styling
  - Manual input form with validation styling
  - Built-in pulse counter interface with animated elements
  - Measurement context selection (rest, exercise, stress)
  - Real-time validation feedback for abnormal readings
  - Modern card-based layout with vibrant gradients

- **`heartRateViewerStyles.ts`**: Heart rate history viewer styling
  - Statistical summary display with trend indicators
  - Historical data table with time-based filtering
  - Visual trend analysis with directional arrows
  - Empty state guidance and encouragement messages
  - Responsive design for optimal mobile viewing

- **`heartRateDeviceStyles.ts`**: Heart rate device integration styling
  - Device management cards with connection status
  - Auto-sync settings and frequency controls
  - Device discovery and pairing interface
  - Integration tips and troubleshooting guidance
  - Professional device management aesthetics
  - Accessibility-compliant medical styling

- **`bloodPressureEntryStyles.ts`**: Blood pressure entry form styling
  - Dual input validation styling for systolic/diastolic pressure
  - Real-time blood pressure category status display with color coding
  - Medical context selection interface (morning, evening, exercise, medication)
  - Professional medical form layout with gradient backgrounds
  - Comprehensive validation feedback and error state styling

- **`bloodPressureViewerStyles.ts`**: Blood pressure history viewer styling
  - Statistical dashboard with time-based filtering (weekly, monthly, quarterly)
  - Color-coded blood pressure categories (Normal, Elevated, High Stage 1/2, Crisis)
  - Historical data presentation with medical context display
  - Professional medical data visualization with clear typography
  - Responsive design optimized for mobile medical data review

- **`bloodPressureDeviceStyles.ts`**: Blood pressure device integration styling
  - Multi-device management interface for OMRON and Withings devices
  - Connection status indicators and battery level monitoring
  - Auto-sync configuration with customizable interval settings
  - Device discovery and pairing assistance interface
  - Professional medical device management aesthetics with accessibility compliance

##### Medical Alert & Notification Styles
- **`medicalAlertsPanelStyles.ts`**: Medical alerts panel styling
  - Real-time alert feed with severity-based color coding
  - Professional medical interface with clear visual hierarchy
  - Responsive design for mobile healthcare provider access
  - Filter controls and severity badge styling
  - Action button styling for alert management

- **`notificationSettingsStyles.ts`**: Notification preferences styling
  - Toggle switches for alert preferences with medical-appropriate styling
  - Settings organization with clear sections and professional aesthetics
  - User guidance and help text styling for notification setup
  - Professional healthcare interface design with accessibility compliance

- **`medicalAlertDetailStyles.ts`**: Alert detail screen styling (in protectedStyles)
  - Comprehensive alert information display with medical-grade presentation
  - Action button styling for patient contact and follow-up
  - Professional emergency response interface with clear visual hierarchy
  - Responsive design optimized for urgent medical decision-making

##### Insulin Monitoring Styles
- **`insulinEntryStyles.ts`**: Insulin injection logging form styling
  - Medical-grade input validation styles
  - Status indicator colors (for insulin type)
  - Form layout and accessibility features
  - Error message and validation styling

- **`insulinViewerStyles.ts`**: Historical insulin data viewer styling
  - Data table formatting for insulin injections
  - Status badge styling for injection site rotation
  - Filtering interface styles
  - Responsive design for mobile and tablet

- **`insulinHubStyles.ts`**: Central hub navigation styling for insulin features
  - Card-based layout for feature navigation
  - Professional medical interface design
  - Modern UI components and spacing
  - Accessibility-compliant color schemes

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

### Medical-Grade Audit Logging Flow
```
User performs medical action
    ↓
Enhanced LogService captures:
    • Complete user context (UID, username, email, role)
    • Detailed action information and type
    • Platform and device metadata
    • Session and app version tracking
    • Before/after values for data changes
    • Error context and failure details
    ↓
Advanced Logging Options:
    • logAction() - Standard medical action logging
    • logEnhanced() - Metadata-enriched logging with session tracking
    • logNavigation() - Screen access and user journey tracking
    • logPerformance() - Medical screen performance monitoring
    • logFeatureUsage() - Medical feature adoption analytics
    ↓
Structured Firestore Storage:
    • appLogs collection with medical-grade metadata
    • Server timestamps for audit compliance
    • Role-based access for regulatory review
    • Structured error levels (info, warn, error, critical)
    ↓
Medical Compliance Features:
    • HIPAA-style audit trail with user attribution
    • Prescription change tracking with before/after values
    • Failed attempt logging for security analysis
    • Complete medical data transaction logging
```

### Glucose Monitoring Data Flow
```
Patient/Caretaker accesses glucose hub
    ↓
Choose entry method:
    • Manual Entry → GlucoseEntryForm
    • View History → GlucoseReadingsViewer
    • CGM Integration → CGMIntegration
    ↓
Data Processing:
    • Validation (70-400 mg/dL range)
    • Status classification (Low/Normal/High)
    • Timestamp and context capture
    ↓
Firestore Storage:
    • User's glucose readings collection
    • Relationship-based access control
    • Audit trail for all entries
    ↓
Display and Analytics:
    • Real-time status indicators
    • Historical trend analysis
    • Export-ready data format
```

### CGM Integration Flow
```
CGM Device Connection
    ↓
Device Authentication:
    • Simulated device pairing
    • Connection status monitoring
    • Data integrity validation
    ↓
Real-Time Sync:
    • Continuous glucose readings
    • Automatic data synchronization
    • Background sync processing
    ↓
Data Validation:
    • Medical range checking
    • Duplicate detection
    • Error handling and retry logic
    ↓
Firestore Storage:
    • Same structure as manual entries
    • CGM source identification
    • Sync timestamp tracking
```

### Insulin Monitoring Data Flow
```
Patient/Caretaker accesses insulin hub
    ↓
Choose entry method:
    • Log Insulin Injection → InsulinEntryForm
    • View History → InsulinReadingsViewer
    • Injection Site Rotation → SiteRotationRecommendation
    ↓
Data Processing:
    • Validation (insulin units, site selection)
    • Status classification (for insulin type)
    • Timestamp and context capture
    ↓
Firestore Storage:
    • User's insulin injection records collection
    • Relationship-based access control
    • Audit trail for all entries
    ↓
Display and Analytics:
    • Real-time status indicators
    • Historical trend analysis
    • Export-ready data format
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

---

## 🛠️ Utilities (`utils/` Directory)

### `utils/deviceInfo.ts`
**Purpose**: Device identification and metadata collection for audit trails
**Features**:
- **Platform Detection**: Identifies iOS, Android, Web platforms with version information
- **Device Fingerprinting**: Creates unique device identifiers for security tracking
- **Screen Metrics**: Captures screen dimensions and density for UI optimization
- **Network Information**: Detects connection type and quality for sync optimization
- **App Version Tracking**: Records app version and build information for debugging
- **Timezone Detection**: Captures user timezone for accurate timestamp interpretation

**Code Example**:
```typescript
export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  deviceModel: string;
  osVersion: string;
  appVersion: string;
  screenDimensions: {
    width: number;
    height: number;
    density: number;
  };
  networkType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  timezone: string;
  uniqueId: string;
}

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  // Implementation handles cross-platform device detection
  // Used throughout app for audit logging and optimization
}
```

**Medical Compliance Features**:
- **Audit Trail Support**: Provides device context for all medical actions
- **Security Tracking**: Identifies potential unauthorized access attempts
- **Data Integrity**: Ensures medical data is associated with known devices
- **Regulatory Compliance**: Supports HIPAA requirements for access logging

### `utils/LogAnalytics.ts`
**Purpose**: Advanced analytics and performance monitoring for medical workflows
**Features**:
- **Medical Feature Analytics**: Tracks usage patterns of glucose, insulin, and vital sign features
- **Performance Monitoring**: Measures load times and responsiveness of critical medical screens
- **Error Rate Analysis**: Monitors and reports system errors affecting patient care
- **User Journey Tracking**: Analyzes navigation patterns for UX optimization
- **Medical Alert Analytics**: Tracks alert generation, acknowledgment, and response times
- **Prescription Compliance Analytics**: Monitors insulin and medication adherence patterns

**Code Example**:
```typescript
export interface MedicalAnalytics {
  trackGlucoseEntry(method: 'manual' | 'cgm', value: number, status: string): void;
  trackInsulinInjection(type: string, units: number, site: string): void;
  trackAlertGeneration(type: string, severity: string, responseTime?: number): void;
  trackPrescriptionCompliance(medication: string, adherence: number): void;
  trackScreenPerformance(screenName: string, loadTime: number): void;
  trackMedicalErrorRate(errorType: string, context: string): void;
}

// Implementation provides medical-grade analytics
// Supports clinical decision-making and quality improvement
```

**Privacy & Compliance**:
- **De-identified Data**: All analytics use anonymized identifiers
- **HIPAA Compliance**: No PHI included in analytics data
- **Opt-out Support**: Users can disable analytics while maintaining medical logging
- **Data Retention**: Configurable retention periods for different analytics types

### `utils/DataValidation.ts`
**Purpose**: Medical-grade data validation and sanitization utilities
**Features**:
- **Glucose Range Validation**: Enforces medically appropriate glucose ranges (70-400 mg/dL)
- **Blood Pressure Validation**: Validates systolic/diastolic relationships and ranges
- **Heart Rate Validation**: Ensures heart rate readings are physiologically possible
- **Insulin Dosage Validation**: Validates insulin units against medical safety limits
- **Temporal Validation**: Ensures medical readings have valid timestamps
- **Cross-Reference Validation**: Checks for conflicting or duplicate readings

**Code Example**:
```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  category: 'normal' | 'caution' | 'alert' | 'critical';
}

export const validateGlucoseReading = (value: number, timestamp: Date): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    category: 'normal'
  };

  // Medical range validation
  if (value < 70) {
    result.category = 'critical';
    result.warnings.push('Low glucose - consider immediate action');
  } else if (value > 400) {
    result.category = 'critical';
    result.errors.push('Glucose reading exceeds safe measurement range');
    result.isValid = false;
  }

  return result;
};
```

**Medical Safety Features**:
- **Range Enforcement**: Prevents entry of physiologically impossible values
- **Alert Generation**: Automatically creates medical alerts for abnormal readings
- **Clinical Guidelines**: Validation based on medical standards and best practices
- **Error Prevention**: Catches common data entry errors before storage

### `utils/MedicalAlertGenerator.ts`
**Purpose**: Intelligent medical alert generation and severity assessment
**Features**:
- **Automated Alert Creation**: Generates alerts based on medical reading analysis
- **Severity Classification**: Assigns appropriate severity levels (Warning, Mild, Severe, Critical)
- **Multi-Parameter Analysis**: Considers reading values, trends, and patient context
- **Alert Deduplication**: Prevents duplicate alerts for similar conditions
- **Notification Integration**: Triggers push notifications based on alert severity
- **Historical Context**: Considers patient's historical readings for personalized alerts

**Code Example**:
```typescript
export interface MedicalAlert {
  id: string;
  patientId: string;
  type: 'glucose' | 'blood_pressure' | 'heart_rate' | 'insulin';
  severity: 'warning' | 'mild' | 'severe' | 'critical';
  value: number;
  normalRange: string;
  message: string;
  recommendedAction: string;
  timestamp: Date;
  acknowledged: boolean;
  generatedBy: 'system' | 'device' | 'manual';
}

export const generateGlucoseAlert = (
  reading: number, 
  patientId: string, 
  context: string
): MedicalAlert | null => {
  if (reading < 70) {
    return {
      id: generateAlertId(),
      patientId,
      type: 'glucose',
      severity: reading < 54 ? 'critical' : 'severe',
      value: reading,
      normalRange: '70-180 mg/dL',
      message: `Low glucose reading: ${reading} mg/dL`,
      recommendedAction: reading < 54 ? 
        'Seek immediate medical attention' : 
        'Consume fast-acting carbohydrates',
      timestamp: new Date(),
      acknowledged: false,
      generatedBy: 'system'
    };
  }
  return null;
};
```

**Clinical Decision Support**:
- **Evidence-Based Alerts**: Based on medical guidelines and clinical research
- **Personalized Thresholds**: Adjusts alert criteria based on individual patient profiles
- **Trending Analysis**: Considers patterns and trends, not just individual readings
- **Care Team Integration**: Alerts accessible to entire care team with appropriate permissions

### `utils/DataExportFormatter.ts`
**Purpose**: Medical data export formatting for healthcare providers and regulatory compliance
**Features**:
- **Multiple Export Formats**: CSV, PDF, and structured JSON for different use cases
- **Medical Report Generation**: Professional medical reports with charts and summaries
- **Date Range Filtering**: Export specific time periods for focused analysis
- **De-identification Options**: Remove or anonymize data for research compliance
- **Provider-Ready Formats**: Formats compatible with major EHR systems
- **Regulatory Compliance**: Exports meet medical record requirements

**Code Example**:
```typescript
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'json';
  dateRange: {
    start: Date;
    end: Date;
  };
  includeCharts: boolean;
  deIdentify: boolean;
  dataTypes: Array<'glucose' | 'insulin' | 'blood_pressure' | 'heart_rate'>;
}

export const generateMedicalReport = async (
  patientId: string, 
  options: ExportOptions
): Promise<string> => {
  // Comprehensive medical data formatting
  // Includes statistical analysis and trend visualization
  // Professional presentation suitable for clinical review
};
```

**Healthcare Integration**:
- **EHR Compatibility**: Exports work with Epic, Cerner, and other major systems
- **Continuity of Care**: Supports patient care transitions between providers
- **Research Support**: De-identified exports for clinical research participation
- **Audit Compliance**: Exports include complete audit trail information

---

## 🎣 Hooks (`hooks/` Directory)

### `hooks/useAuthNavigation.ts`
**Purpose**: Intelligent authentication-based navigation management
**Features**:
- **Role-Based Routing**: Automatically routes users to appropriate dashboards
- **Authentication State Monitoring**: Listens for auth changes and updates navigation
- **Deep Link Handling**: Manages authenticated deep links and redirects
- **Loading State Management**: Provides loading indicators during auth checks
- **Secure Navigation**: Prevents unauthorized access to protected routes
- **Session Management**: Handles session expiration and refresh

**Code Example**:
```typescript
export interface AuthNavigationHook {
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  shouldRedirect: boolean;
  redirectPath: string;
  handleAuthChange: (user: User | null) => void;
}

export const useAuthNavigation = (): AuthNavigationHook => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    userRole: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user.uid);
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          userRole: userData.role
        });
      } else {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          userRole: null
        });
      }
    });

    return unsubscribe;
  }, []);

  return {
    ...authState,
    shouldRedirect: !authState.isLoading && authState.isAuthenticated,
    redirectPath: getRoleBasedPath(authState.userRole),
    handleAuthChange: (user) => {/* handle auth changes */}
  };
};
```

**Security Features**:
- **Route Protection**: Prevents unauthorized access to medical data
- **Session Validation**: Continuously validates user sessions
- **Role Verification**: Ensures users only access appropriate features
- **Audit Integration**: Logs all navigation attempts for security analysis

### `hooks/useMedicalData.ts`
**Purpose**: Centralized medical data management and real-time synchronization
**Features**:
- **Real-Time Data Sync**: Live updates from Firestore for medical readings
- **Offline Support**: Caches medical data for offline access and sync
- **Data Validation**: Validates all medical data before storage
- **Relationship-Based Access**: Enforces data access based on care relationships
- **Error Handling**: Comprehensive error management for medical data operations
- **Performance Optimization**: Optimized queries and caching for medical data

**Code Example**:
```typescript
export interface MedicalDataHook {
  glucoseReadings: GlucoseReading[];
  insulinRecords: InsulinRecord[];
  bloodPressureReadings: BloodPressureReading[];
  heartRateReadings: HeartRateReading[];
  medicalAlerts: MedicalAlert[];
  isLoading: boolean;
  error: string | null;
  addGlucoseReading: (reading: Omit<GlucoseReading, 'id' | 'timestamp'>) => Promise<void>;
  addInsulinRecord: (record: Omit<InsulinRecord, 'id' | 'timestamp'>) => Promise<void>;
  generateMedicalSummary: (dateRange: DateRange) => MedicalSummary;
}

export const useMedicalData = (patientId: string): MedicalDataHook => {
  // Real-time medical data management
  // Supports offline access and automatic sync
  // Provides comprehensive medical data operations
};
```

**Medical Features**:
- **Real-Time Monitoring**: Live updates for critical medical changes
- **Data Integrity**: Ensures medical data consistency and accuracy
- **Alert Integration**: Automatic alert generation for abnormal readings
- **Export Support**: Provides data in formats suitable for healthcare providers

### `hooks/useNotificationPermissions.ts`
**Purpose**: Cross-platform notification permission management for medical alerts
**Features**:
- **Permission Request Management**: Handles notification permission requests
- **Platform Compatibility**: Works across iOS, Android, and web platforms
- **Medical Alert Priority**: Ensures critical medical alerts can be delivered
- **Settings Persistence**: Saves notification preferences across app sessions
- **Fallback Strategies**: Alternative notification methods when permissions denied
- **User Guidance**: Provides clear instructions for enabling notifications

**Code Example**:
```typescript
export interface NotificationPermissionHook {
  hasPermission: boolean;
  isLoading: boolean;
  canRequestPermission: boolean;
  requestPermission: () => Promise<boolean>;
  openSettings: () => void;
  permissionStatus: 'granted' | 'denied' | 'default' | 'provisional';
}

export const useNotificationPermissions = (): NotificationPermissionHook => {
  const [permissionState, setPermissionState] = useState({
    hasPermission: false,
    isLoading: true,
    canRequestPermission: true,
    permissionStatus: 'default' as const
  });

  const requestPermission = async (): Promise<boolean> => {
    try {
      // Platform-specific permission request
      // Handles iOS, Android, and web differences
      // Returns true if permission granted
    } catch (error) {
      logAction('notification_permission_error', 'error', { error: error.message });
      return false;
    }
  };

  return {
    ...permissionState,
    requestPermission,
    openSettings: () => {
      // Platform-specific settings navigation
    }
  };
};
```

**Medical Compliance**:
- **Critical Alert Delivery**: Ensures life-critical alerts reach users
- **Healthcare Provider Notifications**: Supports care team alert delivery
- **Emergency Escalation**: Backup notification methods for critical situations
- **Audit Trail**: Logs notification delivery attempts and failures

---

## 🧪 Testing Strategy

### Unit Testing Framework
**Testing Libraries**:
- **Jest**: Core testing framework for component and utility testing
- **React Native Testing Library**: Component testing with user interaction simulation
- **Firebase Testing**: Firestore rules testing and authentication mocking
- **Medical Data Validation**: Comprehensive testing of medical range validations

### Test Categories

#### 1. Medical Data Validation Tests
```typescript
describe('Glucose Reading Validation', () => {
  test('should validate normal glucose range', () => {
    const result = validateGlucoseReading(120, new Date());
    expect(result.isValid).toBe(true);
    expect(result.category).toBe('normal');
  });

  test('should generate critical alert for severe hypoglycemia', () => {
    const result = validateGlucoseReading(45, new Date());
    expect(result.category).toBe('critical');
    expect(result.warnings).toContain('Low glucose - seek immediate medical attention');
  });

  test('should reject physiologically impossible values', () => {
    const result = validateGlucoseReading(500, new Date());
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

#### 2. Authentication & Authorization Tests
```typescript
describe('Role-Based Access Control', () => {
  test('should allow patient to access own data', async () => {
    const mockUser = createMockUser('patient', 'patient123');
    const canAccess = await checkDataAccess(mockUser, 'glucose_readings', 'patient123');
       expect(canAccess).toBe(true);
  });

  test('should deny unauthorized cross-patient access', async () => {
    const mockUser = createMockUser('patient', 'patient123');
    const canAccess = await checkDataAccess(mockUser, 'glucose_readings', 'patient456');
    expect(canAccess).toBe(false);
  });

  test('should allow doctor access to linked patients only', async () => {
    const mockDoctor = createMockUser('doctor', 'doctor123');
    // Test with linked patient
    const canAccessLinked = await checkDataAccess(mockDoctor, 'glucose_readings', 'linkedPatient');
    expect(canAccessLinked).toBe(true);
    
    // Test with unlinked patient
    const canAccessUnlinked = await checkDataAccess(mockDoctor, 'glucose_readings', 'unlinkedPatient');
    expect(canAccessUnlinked).toBe(false);
  });
});
```

#### 3. Medical Alert Generation Tests
```typescript
describe('Medical Alert System', () => {
  test('should generate appropriate severity alerts', () => {
    const criticalAlert = generateGlucoseAlert(45, 'patient123', 'fasting');
    expect(criticalAlert?.severity).toBe('critical');
    
    const severeAlert = generateGlucoseAlert(65, 'patient123', 'post-meal');
    expect(severeAlert?.severity).toBe('severe');
    
    const normalReading = generateGlucoseAlert(120, 'patient123', 'random');
    expect(normalReading).toBeNull();
  });

  test('should include appropriate medical recommendations', () => {
    const alert = generateGlucoseAlert(50, 'patient123', 'fasting');
    expect(alert?.recommendedAction).toContain('immediate medical attention');
    expect(alert?.message).toContain('Low glucose reading');
  });
});
```

#### 4. Performance Tests
```typescript
describe('Medical Screen Performance', () => {
  test('should load glucose entry form within acceptable time', async () => {
    const startTime = Date.now();
    render(<GlucoseEntryForm onClose={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Glucose Reading')).toBeInTheDocument();
    });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000); // Medical forms should load quickly
  });

  test('should handle large datasets efficiently', async () => {
    const largeDataset = generateMockGlucoseReadings(1000);
    const startTime = Date.now();
    
    render(<GlucoseReadingsViewer readings={largeDataset} />);
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(3000); // Should handle large datasets efficiently
  });
});
```

### Integration Testing

#### 1. End-to-End User Flows
- **Patient Registration to First Reading**: Complete user journey testing
- **Doctor-Patient Relationship Setup**: Medical provider onboarding
- **Medical Alert Response Flow**: Critical alert handling and resolution
- **Data Export for Healthcare Providers**: Complete medical record export

#### 2. Cross-Platform Testing
- **iOS Device Testing**: Native iOS behavior and permissions
- **Android Device Testing**: Android-specific features and limitations
- **Web Browser Testing**: Progressive web app functionality
- **Offline Functionality**: Data sync and offline access testing

### Continuous Integration

#### Automated Testing Pipeline
```yaml
# .github/workflows/medical-testing.yml
name: Medical App Testing Pipeline

on: [push, pull_request]

jobs:
  medical-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run medical data validation tests
        run: npm run test:medical-validation
      
      - name: Run security tests
        run: npm run test:security
      
      - name: Run performance tests
        run: npm run test:performance
      
      - name: Generate medical testing report
        run: npm run test:medical-report
```

#### Test Coverage Requirements
- **Medical Validation Functions**: 100% coverage required
- **Authentication & Authorization**: 95+ coverage required
- **Alert Generation**: 100% coverage required
- **Data Access Control**: 95+ coverage required
- **Overall Application**: 80+ coverage target

---

## 🚀 Deployment & DevOps

### Deployment Environments

#### 1. Development Environment
- **Firebase Project**: `diabeto-dev`
- **Firestore Rules**: Development rules with relaxed security for testing
- **Analytics**: Full debugging and verbose logging enabled
- **Mock Services**: Simulated device integrations and external APIs
- **Hot Reloading**: Live development with instant updates

#### 2. Staging Environment
- **Firebase Project**: `diabeto-staging`
- **Production-Like Security**: Full security rules implementation
- **Limited Test Data**: Anonymized test datasets for validation
- **Performance Monitoring**: Full performance tracking enabled
- **User Acceptance Testing**: Healthcare provider review environment

#### 3. Production Environment
- **Firebase Project**: `diabeto-production`
- **Enhanced Security**: Maximum security configuration
- **Medical-Grade Logging**: Complete audit trail implementation
- **Performance Optimization**: Optimized for medical workflow performance
- **24/7 Monitoring**: Continuous health monitoring and alerting

### CI/CD Pipeline

#### Build Process
```yaml
# Expo/React Native Build Configuration
{
  "expo": {
    "name": "Diabeto",
    "slug": "diabeto-medical-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.diabeto.medicalapp",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.diabeto.medicalapp",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/images/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-firebase/firestore"
    ]
  }
}
```

#### Deployment Scripts
```bash
#!/bin/bash
# deploy.sh - Automated deployment script

set -e

# Environment validation
if [ -z "$ENVIRONMENT" ]; then
  echo "Error: ENVIRONMENT variable not set"
  exit 1
fi

echo "🏥 Deploying Diabeto Medical App to $ENVIRONMENT..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run comprehensive test suite
echo "🧪 Running medical validation tests..."
npm run test:medical
npm run test:security
npm run test:performance

# Build application
echo "🔨 Building application..."
if [ "$ENVIRONMENT" == "production" ]; then
  npm run build:production
else
  npm run build:staging
fi

# Deploy Firebase configuration
echo "🔥 Deploying Firebase configuration..."
firebase use $ENVIRONMENT
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Deploy application
echo "🚀 Deploying application..."
if [ "$ENVIRONMENT" == "production" ]; then
  eas build --platform all --profile production
  eas submit --platform all --profile production
else
  eas build --platform all --profile staging
fi

echo "✅ Deployment to $ENVIRONMENT completed successfully!"
```

### Monitoring & Observability

#### Application Performance Monitoring
```typescript
// utils/PerformanceMonitoring.ts
export class MedicalPerformanceMonitor {
  static trackScreenLoad(screenName: string, loadTime: number): void {
    // Track medical screen performance
    logEnhanced('screen_performance', 'info', {
      screenName,
      loadTime,
      performanceCategory: this.categorizePerformance(loadTime),
      medicalCritical: this.isMedicalCriticalScreen(screenName)
    });
  }

  static trackMedicalActionLatency(action: string, latency: number): void {
    // Track medical action response times
    if (latency > 3000) { // Alert for slow medical actions
      logAction('slow_medical_action', 'warning', {
        action,
        latency,
        recommendation: 'Consider performance optimization'
      });
    }
  }

  private static isMedicalCriticalScreen(screenName: string): boolean {
    const criticalScreens = [
      'glucose-entry', 'insulin-entry', 'medical-alerts',
      'blood-pressure-entry', 'heart-rate-entry'
    ];
    return criticalScreens.includes(screenName);
  }
}
```

#### Health Checks
```typescript
// utils/HealthCheck.ts
export class SystemHealthCheck {
  static async performHealthCheck(): Promise<HealthStatus> {
    const status: HealthStatus = {
      timestamp: new Date(),
      services: {},
      overall: 'healthy'
    };

    // Firebase connectivity
    status.services.firebase = await this.checkFirebaseHealth();
    
    // Authentication service
    status.services.auth = await this.checkAuthHealth();
    
    // Firestore database
    status.services.database = await this.checkDatabaseHealth();
    
    // Medical alert system
    status.services.alerts = await this.checkAlertSystemHealth();

    // Determine overall health
    status.overall = this.calculateOverallHealth(status.services);

    return status;
  }

  private static async checkFirebaseHealth(): Promise<ServiceHealth> {
    try {
      // Test Firebase connectivity
      await firebase.app().options;
      return { status: 'healthy', latency: 0, lastCheck: new Date() };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        error: error.message, 
        lastCheck: new Date() 
      };
    }
  }
}
```

### Security Configuration

#### Firebase Security Rules (Production)
```javascript
// firestore.rules - Production security configuration
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Medical data access control
    match /glucose_readings/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         hasPatientRelationship(request.auth.uid, userId));
    }
    
    match /insulin_records/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         hasPatientRelationship(request.auth.uid, userId));
    }
    
    match /medical_alerts/{alertId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.patientId || 
         hasPatientRelationship(request.auth.uid, resource.data.patientId));
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.patientId;
    }
    
    // Audit logs (admin read-only)
    match /appLogs/{logId} {
      allow read: if request.auth != null && 
        getUserRole(request.auth.uid) == 'admin';
      allow write: if request.auth != null; // All users can log
    }
    
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         getUserRole(request.auth.uid) in ['admin', 'doctor']);
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper functions
    function getUserRole(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role;
    }
    
    function hasPatientRelationship(providerUid, patientUid) {
      return exists(/databases/$(database)/documents/relationships/$(providerUid + '_' + patientUid));
    }
  }
}
```

#### Environment Variables (Production)
```bash
# .env.production
EXPO_PUBLIC_FIREBASE_API_KEY=prod_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=diabeto-production.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=diabeto-production
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=diabeto-production.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=prod_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=prod_app_id

# Medical compliance settings
EXPO_PUBLIC_ENABLE_AUDIT_LOGGING=true
EXPO_PUBLIC_LOG_LEVEL=info
EXPO_PUBLIC_MEDICAL_ALERT_TIMEOUT=30000
EXPO_PUBLIC_SESSION_TIMEOUT=3600000

# Performance monitoring
EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
EXPO_PUBLIC_CRITICAL_SCREEN_LOAD_THRESHOLD=2000
EXPO_PUBLIC_MEDICAL_ACTION_TIMEOUT=5000
```

---

## 🔧 Maintenance & Support

### Maintenance Schedule

#### Daily Monitoring
- **System Health Checks**: Automated health monitoring every hour
- **Error Rate Monitoring**: Alert on error rates > 1%
- **Performance Tracking**: Monitor critical medical screen load times
- **Security Monitoring**: Review authentication failures and unauthorized access attempts

#### Weekly Maintenance
- **Database Optimization**: Firestore index optimization and cleanup
- **Log Review**: Audit log analysis for security and compliance
- **Performance Analysis**: Review performance metrics and optimization opportunities
- **User Feedback Review**: Process user feedback and bug reports

#### Monthly Maintenance
- **Security Updates**: Apply security patches and dependency updates
- **Backup Verification**: Verify data backup integrity and recovery procedures
- **Compliance Review**: Review HIPAA compliance and audit trail completeness
- **Documentation Updates**: Update technical documentation and user guides

#### Quarterly Maintenance
- **Major Updates**: Plan and implement major feature updates
- **Security Audit**: Comprehensive security review and penetration testing
- **Performance Optimization**: Major performance improvements and refactoring
- **Disaster Recovery Testing**: Full disaster recovery procedure testing

### Support Procedures

#### Issue Classification
1. **Critical (P0)**: System down, security breach, data loss
   - **Response Time**: 15 minutes
   - **Resolution Time**: 2 hours
   - **Escalation**: Immediate executive notification

2. **High (P1)**: Medical functionality impaired, authentication issues
   - **Response Time**: 1 hour
   - **Resolution Time**: 4 hours
   - **Escalation**: Manager notification within 2 hours

3. **Medium (P2)**: Feature bugs, performance issues
   - **Response Time**: 4 hours
   - **Resolution Time**: 24 hours
   - **Escalation**: Daily status updates

4. **Low (P3)**: Minor bugs, enhancement requests
   - **Response Time**: 24 hours
   - **Resolution Time**: 1 week
   - **Escalation**: Weekly review

#### Medical Emergency Response
```typescript
// Emergency response procedures for critical medical alerts
export class MedicalEmergencyResponse {
  static async handleCriticalAlert(alert: MedicalAlert): Promise<void> {
    // Immediate actions for critical medical alerts
    
    // 1. Log emergency event
    await logAction('medical_emergency_alert', 'critical', {
      alertId: alert.id,
      patientId: alert.patientId,
      severity: alert.severity,
      value: alert.value,
      responseTime: Date.now()
    });

    // 2. Notify care team immediately
    await notifyCareTeam(alert.patientId, alert);

    // 3. Escalate to emergency contacts if no response
    setTimeout(async () => {
      if (!alert.acknowledged) {
        await escalateToEmergencyContacts(alert);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // 4. Activate backup notification systems
    await activateBackupNotifications(alert);
  }

  static async escalateToEmergencyContacts(alert: MedicalAlert): Promise<void> {
    // Implementation for emergency escalation
    // Contacts family members, emergency services if configured
  }
}
```

### Documentation Standards

#### Code Documentation Requirements
- **Function Documentation**: All medical functions require comprehensive JSDoc
- **Type Definitions**: Complete TypeScript interfaces for all medical data
- **Security Notes**: Document all security-related code with rationale
- **Medical Context**: Explain medical reasoning behind validation rules

#### Example Documentation Standard
```typescript
/**
 * Validates glucose reading and generates appropriate medical alerts
 * 
 * @param value - Glucose reading in mg/dL (valid range: 1-600)
 * @param timestamp - When the reading was taken
 * @param context - Measurement context (fasting, post-meal, random, etc.)
 * @param patientId - Patient identifier for alert generation
 * 
 * @returns ValidationResult with medical status and any generated alerts
 * 
 * @medical_context
 * - Normal range: 70-140 mg/dL (fasting), 70-180 mg/dL (post-meal)
 * - Hypoglycemia: <70 mg/dL (severe <54 mg/dL)
 * - Hyperglycemia: >180 mg/dL (critical >400 mg/dL)
 * 
 * @compliance
 * - Generates audit log entry for all validations
 * - Creates medical alerts for abnormal readings
 * - Follows ADA clinical guidelines for glucose ranges
 * 
 * @example
 * ```typescript
 * const result = await validateGlucoseReading(45, new Date(), 'fasting', 'patient123');
 * if (!result.isValid) {
 *   console.error('Invalid glucose reading:', result.errors);
 * }
 * if (result.alert) {
 *   await handleMedicalAlert(result.alert);
 * }
 * ```
 */
export async function validateGlucoseReading(
  value: number,
  timestamp: Date,
  context: GlucoseContext,
  patientId: string
): Promise<GlucoseValidationResult> {
  // Implementation with comprehensive medical validation
}
```

### Quality Assurance

#### Automated QA Checks
- **Code Quality**: ESLint with medical-specific rules
- **Type Safety**: Comprehensive TypeScript checking
- **Security Scanning**: Automated security vulnerability scanning
- **Performance Testing**: Automated performance regression testing
- **Medical Validation**: Automated testing of all medical validation rules

#### Manual QA Process
1. **Medical Professional Review**: Healthcare providers review medical features
2. **User Experience Testing**: Healthcare workers test real-world workflows
3. **Security Review**: Security professionals review access controls
4. **Compliance Audit**: Legal review for medical compliance requirements

This comprehensive structure ensures the Diabeto medical application maintains enterprise-grade quality, security, and compliance while providing an excellent user experience for patients and healthcare providers.
