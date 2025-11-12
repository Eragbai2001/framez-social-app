import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { ChevronLeft, MoreVertical, MapPin } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

type ProfileScreenProps = {
  user: any;
  onBack?: () => void;
};

type Post = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
};

export function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserPosts();
    }
  }, [user?.id]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user posts:', error);
      } else {
        setUserPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  // Extract user information from session
  const getUserName = () => {
    // Try to get username from user_metadata
    if (user?.user_metadata?.username) {
      return user.user_metadata.username;
    }

    // Try to get full name from OAuth metadata
    const fullName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.user_metadata?.given_name;

    if (fullName && typeof fullName === 'string') {
      return fullName.split(' ')[0]; // Return first name
    }

    // Fall back to email username
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      const cleanName = emailName.replace(/[._]/g, ' ').replace(/[0-9]/g, '');
      return cleanName
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    return 'User';
  };

  // Get avatar URL from OAuth providers if available
  const getAvatarUrl = () => {
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '';

    // Don't use UI Avatars URLs
    if (avatarUrl && avatarUrl.includes('ui-avatars.com')) {
      return '';
    }

    return avatarUrl;
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const name = getUserName();
    return name.substring(0, 2).toUpperCase();
  };

  const userName = getUserName();
  const userEmail = user?.email || '';
  const avatarUrl = getAvatarUrl();
  const userInitials = getUserInitials();

  // Stats with real post count
  const stats = {
    posts: userPosts.length,
    followers: '12.6 K',
    following: '11.7 K',
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-4 pt-12">
        <TouchableOpacity onPress={onBack} className="h-10 w-10 items-center justify-center">
          <ChevronLeft size={24} color="#010101" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
          Profile
        </Text>
        <TouchableOpacity className="h-10 w-10 items-center justify-center">
          <MoreVertical size={24} color="#010101" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Image and Name */}
        <View className="items-center px-6 pb-6">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="mb-4 h-24 w-24 rounded-full"
              style={{ width: 96, height: 96 }}
            />
          ) : (
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-[#2FA6A7]">
              <Text className="text-3xl text-white" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                {userInitials}
              </Text>
            </View>
          )}

          <Text className="mb-1 text-xl font-bold" style={{ fontFamily: 'Poppins_700Bold' }}>
            {userName}
          </Text>

          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'Poppins_400Regular' }}>
              {userEmail}
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={async () => {
              await supabase.auth.signOut();
            }}
            className="mt-4 rounded-xl bg-red-500 px-8 py-3"
            activeOpacity={0.8}>
            <Text className="font-semibold text-white" style={{ fontFamily: 'Poppins_600SemiBold' }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="mb-6 flex-row items-center justify-around border-b border-gray-200 pb-6">
          <View className="items-center">
            <Text className="mb-1 text-xl font-bold" style={{ fontFamily: 'Poppins_700Bold' }}>
              {stats.posts}
            </Text>
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'Poppins_400Regular' }}>
              Photos
            </Text>
          </View>

          <View className="h-10 w-px bg-gray-200" />

          <View className="items-center">
            <Text className="mb-1 text-xl font-bold" style={{ fontFamily: 'Poppins_700Bold' }}>
              {stats.followers}
            </Text>
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'Poppins_400Regular' }}>
              Followers
            </Text>
          </View>

          <View className="h-10 w-px bg-gray-200" />

          <View className="items-center">
            <Text className="mb-1 text-xl font-bold" style={{ fontFamily: 'Poppins_700Bold' }}>
              {stats.following}
            </Text>
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'Poppins_400Regular' }}>
              Following
            </Text>
          </View>
        </View>


        {/* Tabs */}
        <View className="mb-4 flex-row border-b border-gray-200">
          <TouchableOpacity className="flex-1 border-b-2 border-[#2FA6A7] pb-3">
            <Text
              className="text-center font-semibold text-[#2FA6A7]"
              style={{ fontFamily: 'Poppins_600SemiBold' }}>
              Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 pb-3">
            <Text className="text-center text-gray-500" style={{ fontFamily: 'Poppins_500Medium' }}>
              Collections
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 pb-3">
            <Text className="text-center text-gray-500" style={{ fontFamily: 'Poppins_500Medium' }}>
              Bookmarks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        {loading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="large" color="#2FA6A7" />
            <Text
              className="mt-3 text-gray-500"
              style={{ fontFamily: 'Poppins_400Regular' }}>
              Loading posts...
            </Text>
          </View>
        ) : userPosts.length === 0 ? (
          <View className="mt-10 items-center px-8">
            <Text
              className="text-center text-lg text-gray-600"
              style={{ fontFamily: 'Poppins_500Medium' }}>
              No posts yet
            </Text>
            <Text
              className="mt-2 text-center text-sm text-gray-400"
              style={{ fontFamily: 'Poppins_400Regular' }}>
              Create your first post to share with the world!
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-2 px-4 pb-20">
            {userPosts.map((post, index) => {
              // Determine size based on position
              const isLargePost = index % 5 === 0;
              
              if (isLargePost) {
                // Large post - takes 2/3 width
                return (
                  <View
                    key={post.id}
                    className="h-64 flex-1 overflow-hidden rounded-2xl bg-gray-200"
                    style={{ minWidth: '60%' }}>
                    {post.image_url ? (
                      <Image
                        source={{ uri: post.image_url }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="h-full w-full items-center justify-center bg-gray-300">
                        <Text
                          className="text-gray-500"
                          style={{ fontFamily: 'Poppins_400Regular' }}>
                          No image
                        </Text>
                      </View>
                    )}
                  </View>
                );
              } else {
                // Regular post
                return (
                  <View
                    key={post.id}
                    className="h-40 flex-1 overflow-hidden rounded-2xl bg-gray-200"
                    style={{ minWidth: '30%' }}>
                    {post.image_url ? (
                      <Image
                        source={{ uri: post.image_url }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="h-full w-full items-center justify-center bg-gray-300">
                        <Text
                          className="text-gray-500"
                          style={{ fontFamily: 'Poppins_400Regular' }}>
                          No image
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
