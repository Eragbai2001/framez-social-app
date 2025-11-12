# HNG 13 Stage 4 Submission Checklist

## 📋 Acceptance Criteria Status

### ✅ Authentication
- [x] User can register successfully (Email/Password + Google OAuth)
- [x] User can log in successfully (Email/Password + Google OAuth)
- [x] User can log out successfully
- [x] Auth session persists on app restart (AsyncStorage)

### ✅ Post Creation
- [x] User can create new posts
- [x] Image upload functionality working
- [x] Post includes title and description
- [x] Posts saved to Supabase database

### ✅ Feed Display
- [x] Posts display correctly in feed
- [x] Posts show user information
- [x] Posts show images from storage
- [x] Posts ordered by creation date (newest first)

### ✅ User Profile
- [x] User's profile displays correctly
- [x] Profile shows user's posts
- [x] Profile shows post count
- [x] Profile shows user avatar/initials

### ✅ UX/UI
- [x] Smooth navigation between screens
- [x] Tab-based navigation (Home, Create Post, Profile)
- [x] Responsive layout
- [x] Loading states implemented
- [x] Error handling with alerts

### ✅ Platform Compatibility
- [x] App runs without errors on iOS (tested on iPad)
- [x] App runs without errors on Android (Expo Go compatible)

## 📦 Required Deliverables

### 1. GitHub Repository ✅
- [x] Public repository created
- [x] Clean commit history
- [x] README.md with setup instructions
- [x] Backend explanation documented
- [x] All source code pushed

**Repository Checklist:**
- [ ] Make repository public on GitHub
- [ ] Verify all commits are pushed
- [ ] Check README displays correctly
- [ ] Add .gitignore for sensitive files
- [ ] Remove any hardcoded credentials

### 2. README.md Documentation ✅
- [x] Setup instructions included
- [x] Prerequisites listed
- [x] Installation steps detailed
- [x] Environment variables documented
- [x] Backend (Supabase) explanation
- [x] Features list
- [x] Tech stack documented
- [x] Project structure outlined
- [x] Troubleshooting section

### 3. Demo Video 🎥
- [ ] Record 2-3 minute demo video
- [ ] Show registration/sign-up
- [ ] Show login
- [ ] Show creating a post with image
- [ ] Show feed with posts
- [ ] Show profile with user's posts
- [ ] Show logout
- [ ] Show session persistence (close and reopen app)
- [ ] Upload to YouTube/Loom/Drive
- [ ] Get shareable link

**Demo Video Outline:**
1. **Intro (10s)**: "This is Framez, a social media mobile app"
2. **Sign Up (20s)**: Show registration with email/password or Google
3. **Create Post (30s)**: Select image, add title/description, upload
4. **Feed (20s)**: Show feed with posts, scroll through
5. **Profile (20s)**: Navigate to profile, show user's posts
6. **Session Persistence (20s)**: Log out, close app, reopen, show auto-login
7. **Outro (10s)**: Thank you

### 4. Appetize.io Hosted Link 🌐
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login: `eas login`
- [ ] Build APK: `eas build --platform android --profile preview`
- [ ] Download APK from EAS dashboard
- [ ] Upload to appetize.io
- [ ] Get shareable link
- [ ] Test link works

**Build Commands:**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build Android APK
eas build --platform android --profile preview

# Check build status
eas build:list
```

## 📊 Evaluation Metrics Checklist

### Feature Completeness ✅
- [x] All required features implemented
- [x] Features work without errors
- [x] Edge cases handled

### Authentication & Data Handling ✅
- [x] Proper Supabase Auth integration
- [x] Session management implemented
- [x] RLS policies configured
- [x] Secure token storage
- [x] Data fetching and mutations working

### Code Quality ✅
- [x] Clean code structure
- [x] Components organized in folders
- [x] TypeScript types used
- [x] Consistent naming conventions
- [x] Error handling implemented

### UI/UX Design ✅
- [x] Modern, clean design
- [x] Consistent color scheme
- [x] Proper spacing and layout
- [x] Responsive design
- [x] Loading states
- [x] Empty states
- [x] Smooth animations

### Documentation ✅
- [x] Comprehensive README
- [x] Clear setup instructions
- [x] Backend explanation
- [x] Troubleshooting guide

### Creativity & Polish 🎨
- [x] Layered card design
- [x] Custom tab bar
- [x] User initials fallback for avatars
- [x] Masonry grid in profile
- [x] Time formatting (2h ago, 3d ago)

## 🚀 Pre-Submission Steps

### Before Building:
1. [ ] Test all features one more time
2. [ ] Clear any console errors
3. [ ] Remove debug console.logs
4. [ ] Verify .env file is in .gitignore
5. [ ] Check no hardcoded credentials in code

### GitHub:
1. [ ] Push all changes: `git push origin main`
2. [ ] Make repository public
3. [ ] Add repository description
4. [ ] Add topics/tags (react-native, expo, supabase, mobile-app)

### Build Process:
1. [ ] Run `eas build --platform android --profile preview`
2. [ ] Wait for build to complete (~15-20 mins)
3. [ ] Download APK from dashboard
4. [ ] Test APK on device (optional)

### Appetize.io:
1. [ ] Go to https://appetize.io/
2. [ ] Click "Upload App"
3. [ ] Upload APK file
4. [ ] Get shareable public URL
5. [ ] Test URL works in browser

### Demo Video:
1. [ ] Record screen with features
2. [ ] Add voiceover or text explanations
3. [ ] Keep it 2-3 minutes
4. [ ] Upload to YouTube/Loom
5. [ ] Set video to Public/Unlisted
6. [ ] Get shareable link

### Final Submission:
1. [ ] GitHub Repository URL
2. [ ] Appetize.io hosted link
3. [ ] Demo video link
4. [ ] Submit at: https://forms.gle/BZxHGH4RvVTzqCHf6

## ⏰ Deadline
**Wednesday, 12 November 2025, 11:55 PM GMT+1**

---

## 📝 Submission Form Data

**Prepare these before submitting:**

1. **Name**: Joshua
2. **Email**: [Your email]
3. **HNG ID**: [Your HNG ID]
4. **GitHub Repository URL**: https://github.com/yourusername/framez
5. **Appetize.io Link**: https://appetize.io/app/your_app_id
6. **Demo Video Link**: https://youtube.com/watch?v=your_video_id
7. **Tech Stack**: React Native, Expo, Supabase, NativeWind
8. **Backend Used**: Supabase (PostgreSQL + Auth + Storage)
9. **Additional Notes**: [Any special features or challenges overcome]

---

## ✅ Final Check

Before clicking submit:
- [ ] All links are public and accessible
- [ ] Demo video plays correctly
- [ ] Appetize.io app loads and runs
- [ ] GitHub repository is public
- [ ] README is complete and clear
- [ ] All features demonstrated

**Good luck! 🚀**
