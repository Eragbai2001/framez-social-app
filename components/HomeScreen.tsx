import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { supabase } from '../lib/supabase';
import { TabBar } from './TabBar';
import { ProfileScreen } from './ProfileScreen';
import { CreatePostScreen } from './CreatePostScreen';
import { FeedScreen } from './FeedScreen';

export function HomeScreen({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'home' | 'post' | 'profile'>('home');

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleTabPress = (tab: 'home' | 'post' | 'profile') => {
    setActiveTab(tab);
  };

  if (!fontsLoaded) {
    return null;
  }

  // Render different screens based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileScreen user={user} onBack={() => setActiveTab('home')} />;
      case 'post':
        return <CreatePostScreen user={user} onBack={() => setActiveTab('home')} />;
      case 'home':
      default:
        return <FeedScreen user={user} />;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {renderContent()}
      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    color: '#010101',
    textAlign: 'center',
    marginBottom: 16,
  },
  emailText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#2FA6A7',
    textAlign: 'center',
    marginBottom: 32,
  },
  signOutButton: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#2FA6A7',
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
});
