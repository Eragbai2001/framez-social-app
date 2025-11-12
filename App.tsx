import { useState, useEffect } from 'react';
import { WelcomeScreen } from 'components/WelcomeScreen';
import { SignUpScreen } from 'components/SignUpScreen';
import { SignInScreen } from 'components/SignInScreen';
import { HomeScreen } from 'components/HomeScreen';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

import './global.css';

type Screen = 'welcome' | 'signup' | 'signin' | 'home';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setCurrentScreen('home');
      }
    });

    // Listen for auth changes  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    setCurrentScreen('signup');
  };

  const handleSignUp = () => {
    console.log('Sign up completed!');
    // User will be redirected automatically by auth state change
  };

  const handleNavigateToSignIn = () => {
    console.log('Navigate to sign in');
    setCurrentScreen('signin');
  };

  const handleSignIn = () => {
    console.log('Sign in completed!');
    // User will be redirected automatically by auth state change
  };

  const handleNavigateToSignUp = () => {
    console.log('Navigate to sign up');
    setCurrentScreen('signup');
  };

  const renderScreen = () => {
    // If user is logged in, always show home
    if (session) {
      return <HomeScreen user={session.user} />;
    }

    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      case 'signup':
        return <SignUpScreen onSignUp={handleSignUp} onNavigateToLogin={handleNavigateToSignIn} />;
      case 'signin':
        return <SignInScreen onSignIn={handleSignIn} onNavigateToSignUp={handleNavigateToSignUp} />;
      case 'home':
        return <HomeScreen user={session?.user} />;
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <>
      {renderScreen()}
      <StatusBar style="auto" />
    </>
  );
}
