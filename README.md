# Framez - Social Media Mobile App

A modern social media application built with React Native, Expo, and Supabase.

## 🚀 Features

### ✅ Implemented Features
- **User Authentication**: Email/Password and Google OAuth sign-in/sign-up
- **Session Persistence**: Auth session persists on app restart using AsyncStorage
- **Create Posts**: Users can create posts with images, title, and description
- **News Feed**: Real-time feed displaying all posts from all users
- **User Profile**: Display user's profile with their posts in a masonry grid
- **Image Upload**: Images stored in Supabase Storage with user-specific folders
- **Navigation**: Smooth tab-based navigation (Home, Create Post, Profile)
- **Modern UI**: Responsive design with layered cards and smooth animations

## 📱 Tech Stack

- **Frontend**: React Native with Expo SDK 54
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: Supabase Storage for images
- **State Management**: React Hooks (useState, useEffect)
- **Fonts**: Poppins (Regular, Medium, SemiBold, Bold)
- **Icons**: Lucide React Native + Custom PNG icons
- **Image Picker**: expo-image-picker
- **Package Manager**: pnpm

## 🔧 Backend Architecture - Supabase

### Why Supabase?

**Supabase** was chosen as the backend solution for the following reasons:

1. **Built-in Authentication**: Supabase provides out-of-the-box authentication with email/password and OAuth providers (Google, GitHub, etc.) without needing to build custom auth logic.

2. **PostgreSQL Database**: Real relational database with full SQL capabilities, ACID compliance, and robust query performance.

3. **Row Level Security (RLS)**: Built-in security policies that ensure users can only access/modify their own data at the database level, making the app secure by default.

4. **Real-time Capabilities**: Supabase provides real-time subscriptions for live updates (can be extended in future).

5. **Storage Solution**: Integrated storage bucket system for handling file uploads with automatic CDN delivery and access control policies.

6. **Auto-generated REST API**: Instant RESTful API based on database schema without writing backend code.

7. **Fast Development**: Eliminates the need to set up and maintain separate backend infrastructure, allowing faster iteration.

8. **Free Tier**: Generous free tier perfect for development and small-scale deployment.

### Database Schema

**Posts Table:**
```sql
posts (
  id UUID PRIMARY KEY,
  user_id UUID (references auth.users),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

**Row Level Security Policies:**
- `SELECT`: Public access (anyone can view posts)
- `INSERT`: Authenticated users can create posts
- `UPDATE/DELETE`: Users can only modify their own posts

**Storage Buckets:**
- `post-images`: Stores user-uploaded images with folder structure `posts/{user_id}/{filename}`
- Policies: Authenticated users can upload, public can read

### Features Implemented

1. **User Registration & Login**: 
   - Email/password authentication
   - Google OAuth integration using expo-auth-session
   - Session persistence with AsyncStorage

2. **Create Posts**:
   - Image selection from device gallery
   - Upload to Supabase Storage
   - Save post metadata to PostgreSQL database
   - Loading states and error handling

3. **News Feed**:
   - Fetch all posts ordered by creation date
   - Display user information and post content
   - Real-time post count and engagement metrics

4. **User Profile**:
   - Display user avatar (from OAuth or initials)
   - Show user's post count
   - Grid layout of user's posts with images from storage

5. **Data Persistence**:
   - Auth tokens stored in AsyncStorage
   - Automatic session restoration on app restart
   - Secure token refresh mechanism

## 🛠️ Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) - `npm install -g pnpm`
- [Expo CLI](https://docs.expo.dev/get-started/installation/) - `npm install -g expo-cli`
- [Expo Go app](https://expo.dev/client) on your iOS/Android device (for testing)

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd my-expo-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**

   Run these SQL commands in your Supabase SQL Editor:

   ```sql
   -- Create posts table
   CREATE TABLE posts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     image_url TEXT,
     likes_count INTEGER DEFAULT 0,
     comments_count INTEGER DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Posts are viewable by everyone"
   ON posts FOR SELECT
   TO public
   USING (true);

   CREATE POLICY "Users can insert their own posts"
   ON posts FOR INSERT
   TO authenticated
   WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own posts"
   ON posts FOR UPDATE
   TO authenticated
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own posts"
   ON posts FOR DELETE
   TO authenticated
   USING (auth.uid() = user_id);
   ```

5. **Set up Storage Bucket**

   In Supabase Dashboard:
   - Go to Storage → Create bucket named `post-images` (or use existing `resources` bucket)
   - Make it public or set up appropriate RLS policies

   Storage policies SQL:
   ```sql
   -- Allow authenticated users to upload to their own folder
   CREATE POLICY "Users can upload to their own folder in post-images"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'post-images' AND
     (storage.foldername(name))[1] = 'posts' AND
     (storage.foldername(name))[2] = auth.uid()::text
   );

   -- Allow public to read all images
   CREATE POLICY "Public can read all images in post-images"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'post-images');
   ```

## 🏃 Running the App

### Development Mode (Expo Go)

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Run on your device**
   - Scan the QR code with Expo Go app (iOS) or Camera app (Android)
   - Or press `i` for iOS simulator, `a` for Android emulator

3. **Run with tunnel (for network issues)**
   ```bash
   npx expo start --tunnel
   ```

### Building for Production

#### Option 1: EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Build for Android (APK)**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Build for iOS**
   ```bash
   eas build --platform ios --profile preview
   ```

6. **Download the build**
   - Check your Expo dashboard for build status
   - Download APK/IPA when ready

#### Option 2: Local Build (Android only)

```bash
npx expo run:android
```

## 🌐 Hosting on Appetize.io

1. **Build an APK or IPA** using EAS Build (see above)

2. **Upload to Appetize.io**
   - Go to [appetize.io](https://appetize.io/)
   - Click "Upload" and select your APK/IPA file
   - Get a shareable link to test your app in the browser

3. **Alternative: Use Expo Snack**
   ```bash
   npx expo publish
   ```
   Then share the Expo Go link

## 📱 Testing

### On Physical Device
- Install Expo Go from App Store/Play Store
- Scan QR code from `npx expo start`

### On Simulator/Emulator
```bash
# iOS Simulator (Mac only)
npx expo start --ios

# Android Emulator
npx expo start --android
```

## 🔑 Environment Variables

Required environment variables in `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📁 Project Structure

```
my-expo-app/
├── assets/              # Images, fonts, icons
├── components/          # React components
│   ├── WelcomeScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── SignInScreen.tsx
│   ├── HomeScreen.tsx
│   ├── FeedScreen.tsx
│   ├── CreatePostScreen.tsx
│   ├── ProfileScreen.tsx
│   └── TabBar.tsx
├── lib/                 # Utilities
│   └── supabase.ts     # Supabase client
├── App.tsx             # Main app component
├── app.json            # Expo configuration
├── tailwind.config.js  # Tailwind CSS config
└── package.json        # Dependencies
```

## 🎨 Design System

### Colors
- **Primary**: `#2FA6A7` (Teal)
- **Accent**: `#F8D966` (Yellow)
- **Background**: `#EFF1F3` (Light Gray)
- **Text**: `#010101` (Near Black)

### Fonts
- Poppins Regular (400)
- Poppins Medium (500)
- Poppins SemiBold (600)
- Poppins Bold (700)

## 🐛 Troubleshooting

### "Permission denied for schema public"
Run the RLS policies SQL commands in your Supabase dashboard (see Installation step 4)

### "Module not found" errors
```bash
pnpm install
npx expo start --clear
```

### Can't connect to Metro bundler
```bash
npx expo start --tunnel
```

### Images not uploading
Check your Supabase storage bucket policies and ensure the bucket name in code matches your Supabase bucket

## 📝 Scripts

```bash
# Start development server
pnpm start

# Start with tunnel
pnpm start --tunnel

# Clear cache and start
npx expo start --clear

# Type checking
npx tsc --noEmit

# Lint
npx eslint .
```

## 🚀 Deployment Checklist

- [ ] Set up production Supabase project
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Set up storage buckets and policies
- [ ] Build with EAS (`eas build`)
- [ ] Test on real devices
- [ ] Submit to App Store/Play Store (optional)

## 📄 License

This project is private and proprietary.

## 👥 Author

Joshua (Eragbai2001)

## 🔗 Links

- **GitHub Repository**: https://github.com/Eragbai2001/framez-social-app
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Native Documentation](https://reactnative.dev/)

## 📱 Live Demo

- **Appetize.io Link**: [Coming soon - Building now...]
- **Demo Video**: [Coming soon - Recording after build...]

---

**Need Help?** Check the troubleshooting section or create an issue.
