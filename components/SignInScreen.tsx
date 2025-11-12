import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export function SignInScreen({
  onSignIn,
  onNavigateToSignUp,
}: {
  onSignIn?: () => void;
  onNavigateToSignUp?: () => void;
}) {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleSignIn = async () => {
    if (!emailAddress || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailAddress,
        password: password,
      });

      if (error) {
        Alert.alert('Sign In Error', error.message);
      } else {
        Alert.alert('Success!', 'Signed in successfully!', [
          { text: 'OK', onPress: () => onSignIn?.() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const redirectTo = makeRedirectUri({
        scheme: 'framez',
        path: 'auth/callback',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        Alert.alert('Google Sign In Error', error.message);
        setLoading(false);
        return;
      }

      if (data?.url) {
        // Open the OAuth provider's authorization page
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

        if (result.type === 'success') {
          const url = result.url;
          // Extract the session from the URL
          const params = new URL(url).searchParams;
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            Alert.alert('Success!', 'You are now signed in with Google.', [
              { text: 'OK', onPress: () => onSignIn?.() },
            ]);
          }
        } else if (result.type === 'cancel') {
          Alert.alert('Cancelled', 'Google sign in was cancelled.');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white">
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2FA6A7" />
            <Text style={styles.loadingText}>Just a Second</Text>
          </View>
        </View>
      )}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View className="flex-1 pt-16">
          {/* Header */}
          <View className="mb-10" style={styles.headerContainer}>
            {/* Yellow Rectangle */}
            <View style={[styles.yellowRectangle, { backgroundColor: '#F8D966' }]} />
            {/* Sign In Text */}
            <Text style={styles.signInText} className="font-extrabold">
              Sign In
            </Text>
          </View>

          {/* Welcome Text */}
          <View className="mb-8 px-6">
            <Text style={styles.welcomeText}>Hello Again!</Text>
            <Text style={styles.subText}>Sign in to your account</Text>
          </View>

          {/* Input Fields */}
          <View className="mb-5 px-6">
            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={emailAddress}
              onChangeText={setEmailAddress}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-5 px-6">
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity className="mb-10 px-6">
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <View className="mx-6 mb-8">
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              activeOpacity={0.8}
              disabled={loading}>
              <Text style={styles.signInButtonText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="mb-8 flex-row items-center px-6">
            <View className="h-px flex-1 bg-gray-300" />
            <Text style={styles.dividerText}>Or with</Text>
            <View className="h-px flex-1 bg-gray-300" />
          </View>

          {/* Social Sign In Buttons */}
          <View className="mx-6 mb-5">
            <TouchableOpacity
              style={styles.socialButtonStyle}
              activeOpacity={0.8}
              onPress={handleGoogleSignIn}>
              <Image
                source={require('../assets/search.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>

          <View className="mx-6 mb-10">
            <TouchableOpacity
              style={[styles.socialButtonStyle, { opacity: 0.5 }]}
              activeOpacity={0.8}
              disabled>
              <Image
                source={require('../assets/facebook.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Sign in with Facebook (Coming soon)</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="mb-12 flex-row items-center justify-center px-6">
            <Text style={styles.signUpText}>Don&apos;t have account? Let&apos;s </Text>
            <TouchableOpacity onPress={onNavigateToSignUp}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    position: 'relative',
    height: 45,
    marginLeft: 0,
  },
  yellowRectangle: {
    position: 'absolute',
    width: 110,
    height: 18,
    top: 16,
    left: 0,
  },
  signInText: {
    position: 'absolute',
    fontSize: 28,
    fontFamily: 'Poppins_500Medium',
    color: '#010101',
    top: 10,
    left: 20,
    zIndex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    color: '#010101',
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
    color: '#010101',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2FA6A7',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
    color: '#010101',
  },
  signInButton: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#2FA6A7',
    paddingVertical: 16,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
  },
  socialButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2FA6A7',
    paddingVertical: 16,
    gap: 12,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
    color: '#010101',
  },
  signUpText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
    color: '#2FA6A7',
  },
});
