import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Heart, MessageCircle } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

type FeedScreenProps = {
  user: any;
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
  updated_at: string;
};

export function FeedScreen({ user }: FeedScreenProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  // Mock stories data
  const stories = [
    { id: 'yours', name: 'Your Story', hasStory: true, isYours: true },
    { id: '1', name: 'lanasmith', hasStory: true },
    { id: '2', name: 'Anne', hasStory: true },
    { id: '3', name: 'zackpaul', hasStory: true },
    { id: '4', name: 'karenn', hasStory: true },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-4 pb-3 pt-12">
        <TouchableOpacity className="h-10 w-10 items-center justify-center">
          <Image
            source={require('../assets/menu.png')}
            style={{ width: 24, height: 24, tintColor: '#010101' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ fontFamily: 'Poppins_700Bold' }}>
          Home
        </Text>
        <TouchableOpacity className="relative h-10 w-10 items-center justify-center">
          <View
            className="absolute rounded-full bg-[#F8D966]"
            style={{
              width: 22,
              height: 22,
              // Adjust these values to position the circle behind the bell
              left: 0, // Change this value to move horizontally
              bottom: 0, // Change this value to move vertically
              zIndex: -1, // Ensures circle stays behind the icon
            }}
          />
          <Image
            source={require('../assets/notification.png')}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stories Section */}
        <View className="bg-white px-4 py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-7">
              {stories.map((story) => (
                <TouchableOpacity key={story.id} className="items-center">
                  <View
                    className={`h-16 w-16 items-center justify-center rounded-full ${
                      story.isYours ? 'bg-gray-200' : ''
                    }`}
                    style={
                      !story.isYours
                        ? {
                            borderWidth: 2,
                            borderColor: '#2FA6A7',
                          }
                        : undefined
                    }>
                    {story.isYours && (
                      <View className="absolute bottom-0 right-0 z-10 h-5 w-5 items-center justify-center rounded-full bg-yellow-400">
                        <Text className="text-xs font-bold">+</Text>
                      </View>
                    )}
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-gray-300" />
                  </View>
                  <Text
                    className="mt-1 text-xs"
                    style={{ fontFamily: 'Poppins_400Regular' }}
                    numberOfLines={1}>
                    {story.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Posts Feed */}
        <View className=" items-center gap-4 bg-white pb-20">
          {loading ? (
            <View className="mt-20">
              <ActivityIndicator size="large" color="#2FA6A7" />
              <Text className="mt-3 text-gray-500" style={{ fontFamily: 'Poppins_400Regular' }}>
                Loading posts...
              </Text>
            </View>
          ) : posts.length === 0 ? (
            <View className="mt-20 items-center px-8">
              <Text
                className="text-center text-lg text-gray-600"
                style={{ fontFamily: 'Poppins_500Medium' }}>
                No posts yet
              </Text>
              <Text
                className="mt-2 text-center text-sm text-gray-400"
                style={{ fontFamily: 'Poppins_400Regular' }}>
                Be the first to create a post!
              </Text>
            </View>
          ) : (
            posts.map((post) => (
              <View
                key={post.id}
                className="w-11/12 rounded-3xl bg-[#EFF1F3] p-4"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                }}>
                {/* Inner white card */}
                <View className="rounded-2xl bg-white p-4">
                  {/* Post Header */}
                  <View className="mb-3 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#2FA6A7]">
                        <Text
                          className="text-lg font-semibold text-white"
                          style={{ fontFamily: 'Poppins_600SemiBold' }}>
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                      </View>
                      <View>
                        <Text
                          className="text-base font-semibold"
                          style={{ fontFamily: 'Poppins_600SemiBold' }}>
                          {user?.user_metadata?.full_name ||
                            user?.user_metadata?.name ||
                            user?.email?.split('@')[0] ||
                            'User'}
                        </Text>
                        <Text
                          className="text-xs text-gray-500"
                          style={{ fontFamily: 'Poppins_400Regular' }}>
                          Framez User
                        </Text>
                      </View>
                    </View>
                    <Text
                      className="text-xs text-gray-400"
                      style={{ fontFamily: 'Poppins_400Regular' }}>
                      {formatTimeAgo(post.created_at)}
                    </Text>
                  </View>

                  {/* Post Image */}
                  {post.image_url ? (
                    <Image
                      source={{ uri: post.image_url }}
                      className="mb-3 h-64 w-full rounded-2xl"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="mb-3 h-64 items-center justify-center rounded-2xl bg-gray-200">
                      <Text className="text-gray-400" style={{ fontFamily: 'Poppins_400Regular' }}>
                        No image
                      </Text>
                    </View>
                  )}

                  {/* Post Title */}
                  <Text
                    className="mb-2 text-lg font-bold"
                    style={{ fontFamily: 'Poppins_700Bold' }}>
                    {post.title}
                  </Text>

                  {/* Post Description */}
                  <Text
                    className="mb-3 text-sm text-gray-600"
                    style={{ fontFamily: 'Poppins_400Regular' }}
                    numberOfLines={2}>
                    {post.description}
                  </Text>

                  {/* Post Actions */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4">
                      {/* Like Button */}
                      <TouchableOpacity className="flex-row items-center gap-1">
                        <Heart size={22} color="#EF4444" fill="#EF4444" />
                        <Text className="font-medium" style={{ fontFamily: 'Poppins_500Medium' }}>
                          {post.likes_count >= 1000
                            ? `${(post.likes_count / 1000).toFixed(1)}k`
                            : post.likes_count}
                        </Text>
                      </TouchableOpacity>

                      {/* Comment Button */}
                      <TouchableOpacity className="flex-row items-center gap-1">
                        <MessageCircle size={22} color="#010101" />
                        <Text className="font-medium" style={{ fontFamily: 'Poppins_500Medium' }}>
                          {post.comments_count}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Bookmark Button */}
                    <TouchableOpacity className="relative h-10 w-10 items-center justify-center">
                      <View
                        className="absolute rounded-full bg-[#F8D966]"
                        style={{
                          width: 22,
                          height: 22,
                          left: 4,
                          bottom: 0,
                          zIndex: -1,
                        }}
                      />
                      <Image
                        source={require('../assets/Vector.png')}
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
