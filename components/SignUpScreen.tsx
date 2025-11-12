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

export function SignUpScreen({
  onSignUp,
  onNavigateToLogin,
}: {
  onSignUp?: () => void;
  onNavigateToLogin?: () => void;
}) {
  const [username, setUsername] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleSignUp = async () => {
    if (!emailOrPhone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailOrPhone,
        password: password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        Alert.alert('Sign Up Error', error.message);
      } else {
        // Check if email confirmation is required
        const user = data.user;
        const session = data.session;

        console.log('Sign up response:', { user, session });

        if (session) {
          // User is auto-confirmed (email confirmation disabled)
          Alert.alert('Success!', 'Account created successfully! You are now signed in.', [
            { text: 'OK', onPress: () => onSignUp?.() },
          ]);
        } else {
          // Email confirmation required
          Alert.alert(
            'Check Your Email!',
            `We sent a confirmation email to ${emailOrPhone}. Please check your inbox (and spam folder) to verify your account.`,
            [{ text: 'OK', onPress: () => onNavigateToLogin?.() }]
          );
        }
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
              { text: 'OK', onPress: () => onSignUp?.() },
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
        <View className="flex-1  pt-16">
          {/* Header */}
          <View className="mb-10" style={styles.headerContainer}>
            {/* Yellow Rectangle */}
            <View style={[styles.yellowRectangle, { backgroundColor: '#F8D966' }]} />
            {/* Sign up Text */}
            <Text style={styles.signUpText} className="font-extrabold">
              Sign up
            </Text>
          </View>

          {/* Input Fields */}
          <View className="mb-5 px-6">
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-5 px-6">
            <TextInput
              style={styles.input}
              placeholder="Email/Phone Number"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-5 px-6">
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-5 px-6">
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity className="mb-10 px-6">
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <View className="mx-6 mb-8">
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              activeOpacity={0.8}
              disabled={loading}>
              <Text style={styles.signUpButtonText}>
                {loading ? 'Creating account...' : 'Sign up'}
              </Text>
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

          {/* Login Link */}
          <View className="mb-12 flex-row items-center justify-center px-6">
            <Text style={styles.loginText}>Have an account? Let&apos;s </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLink}>Log In</Text>
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
  signUpText: {
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
  signUpButton: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#2FA6A7',
    paddingVertical: 16,
  },
  signUpButtonText: {
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
  loginText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
    color: '#2FA6A7',
  },
});
