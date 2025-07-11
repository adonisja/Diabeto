# Diabeto Project - Documentation Structure Instructions

**📋 MANDATORY READING FOR ALL CONTRIBUTORS (INCLUDING AI ASSISTANTS)**
This document defines the exact structure and purpose of all documentation files in the Diabeto project. ALL documentation must follow this structure strictly.

---

## 📚 Documentation File Hierarchy & Purposes

### 🐛 **BUGS_AND_FIXES.md**
**Purpose**: Issue tracking and resolution documentation
**Contains ONLY**:
- Bugs encountered during development
- Exact fixes implemented for each bug
- Reasoning behind chosen fix approach
- Trade-offs, pros, and cons of the fix
- Alternative solutions considered
- Prevention strategies for similar bugs

**Does NOT contain**:
- Feature implementations
- Architecture decisions
- Code explanations
- General project structure

**Example Format**:
```markdown
## Bug #001: Authentication Loop Issue
**Problem**: Users stuck in infinite login redirect
**Fix**: Added authentication state persistence check
**Reasoning**: Firebase auth state wasn't properly initialized
**Trade-offs**: Slight delay in initial load vs reliable auth flow
**Prevention**: Added auth state validation in _layout.tsx
```

### 📖 **DOCUMENTATION_INDEX.md**
**Purpose**: Feature implementation catalog and overview
**Contains ONLY**:
- Completed feature implementations
- Feature status tracking
- Implementation summaries
- Cross-references to detailed documentation
- User-facing functionality descriptions

**Does NOT contain**:
- Bug fixes
- Architecture overviews
- Detailed code explanations
- Database schema details

**Example Format**:
```markdown
## ✅ Google OAuth Email Verification
**Status**: Implemented
**Summary**: Enhanced OAuth flow with medical compliance
**Details**: See GOOGLE_OAUTH_EMAIL_VERIFICATION_TEST.md
**Components**: GoogleSignInButton, AuthContext, googleAuth.ts
```

### 🏗️ **ARCHITECTURE.md**
**Purpose**: High-level system architecture and design decisions
**Contains ONLY**:
- Component structure overview
- App function architecture
- Design patterns and principles
- Technology stack decisions
- System integration patterns
- High-level data flow diagrams

**Does NOT contain**:
- Line-by-line code explanations
- Bug fixes
- Feature implementation details
- Specific database schema

**Example Format**:
```markdown
## Authentication Architecture
**Pattern**: Context-based state management
**Components**: AuthContext → Protected Routes → Role-based Views
**Decision**: Firebase Auth + Firestore profile verification
**Rationale**: Medical compliance requires dual verification
```

### 📁 **PROJECT_STRUCTURE.md**
**Purpose**: Complete implementation guide for learning and reference
**Contains ONLY**:
- Every line of code explanation
- Every hook, component, and function purpose
- Detailed data flows and interactions
- Component relationships and dependencies
- Implementation details down to smallest units
- Code learning purposes and educational content

**Does NOT contain**:
- Bug tracking
- Feature summaries
- High-level architecture
- Database schema definitions

**Example Format**:
```markdown
## /components/coreComponents/GoogleSignInButton.tsx
**Purpose**: Handles Google OAuth authentication flow
**Props**: 
- onSuccess: (user) => void - Callback for successful auth
- onError: (error) => void - Error handling callback
**Implementation Details**:
- Line 15-20: Configures Google Web Client ID
- Line 25-30: Handles sign-in response parsing
- Line 35-40: Updates user profile in Firestore
**Data Flow**: User Tap → Google OAuth → Firebase Auth → Firestore Update
```

### 🗄️ **DATABASE_SCHEMA.md** (PRIVATE - NOT PUBLIC)
**Purpose**: Complete database schema documentation with compliance
**Contains ONLY**:
- Database collection structures
- TypeScript interfaces for all data models
- Field definitions and data types
- Data validation requirements and medical ranges
- Collection organization and relationships
- Medical compliance and HIPAA-style requirements
- Data access patterns (without implementation details)
- Schema evolution and versioning

**Does NOT contain**:
- Firestore security rules implementation
- Access control logic and validation functions
- Feature implementation details
- Component usage examples
- Security implementation specifics

**Example Format**:
```typescript
interface UserProfile {
  uid: string;                    // Firebase Auth UID
  email: string;                  // User's email address
  role: 'patient' | 'caretaker' | 'doctor' | 'admin';
  // Medical compliance fields
  emailVerified: boolean;         // Email verification status
  emailVerifiedAt?: Timestamp;    // Verification timestamp
  emailVerificationMethod?: string; // Verification method tracking
}
```

---

## 📝 Documentation Decision Tree

### When documenting a BUG:
→ **BUGS_AND_FIXES.md** + reasoning + trade-offs

### When documenting a new FEATURE:
→ **DOCUMENTATION_INDEX.md** (summary) + separate detailed file

### When explaining HOW the app works:
→ **ARCHITECTURE.md** (high-level) or **PROJECT_STRUCTURE.md** (detailed)

### When defining data structures:
→ **DATABASE_SCHEMA.md** (interfaces + validation rules)

### When tracking implementation status:
→ **DOCUMENTATION_INDEX.md** (feature catalog)

---

## 🚨 Critical Documentation Rules

### **1. Single Responsibility Principle**
Each documentation file has ONE specific purpose. Do not mix content types.

### **2. Consistency Requirements**
All documentation must follow the exact format specified for each file type.

### **3. Cross-Reference Guidelines**
- Use cross-references between files
- Never duplicate content across files
- Point to the authoritative source

### **4. Privacy Protection**
- **DATABASE_SCHEMA.md** is PRIVATE and contains sensitive information
- Never include PHI (Protected Health Information) in documentation
- Follow PRIVACY_PROTECTION_NOTICE.md guidelines

### **5. Update Requirements**
- Update DOCUMENTATION_INDEX.md when adding new features
- Update PROJECT_STRUCTURE.md when adding new components
- Update ARCHITECTURE.md when changing design patterns
- Update BUGS_AND_FIXES.md when fixing issues

---

## 🔍 AI Assistant Instructions

When working on the Diabeto project, AI assistants MUST:

1. **Read this file first** before making any documentation decisions
2. **Follow the exact structure** defined for each documentation type
3. **Never mix content types** between different documentation files
4. **Use cross-references** instead of duplicating content
5. **Respect privacy boundaries** for sensitive medical documentation
6. **Update the appropriate file** based on the documentation decision tree

### AI Documentation Workflow:
1. Identify the type of content being documented
2. Consult the decision tree above
3. Follow the exact format for the target file
4. Cross-reference related content in other files
5. Verify privacy compliance for sensitive content

---

## 📋 Documentation Maintenance Checklist

### Before Adding Documentation:
- [ ] Identified correct target file using decision tree
- [ ] Reviewed existing content to avoid duplication
- [ ] Prepared content in the correct format
- [ ] Checked for privacy compliance

### After Adding Documentation:
- [ ] Updated cross-references in related files
- [ ] Verified content is in correct file
- [ ] Checked that format matches file standards
- [ ] Updated DOCUMENTATION_INDEX.md if adding new feature docs

---

## ⚠️ Common Documentation Mistakes to Avoid

1. **Mixing bug fixes with feature documentation**
2. **Putting detailed code explanations in ARCHITECTURE.md**
3. **Including implementation details in DATABASE_SCHEMA.md**
4. **Duplicating content across multiple files**
5. **Missing cross-references to related documentation**
6. **Putting sensitive data schema in public documentation**
7. **Using wrong format for specific file types**

---

**🎯 Remember**: This structure ensures clear, organized, and maintainable documentation that serves different purposes for different audiences while maintaining medical privacy and compliance standards.
