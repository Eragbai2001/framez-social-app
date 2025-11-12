import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
} from '@expo-google-fonts/poppins';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

type CreatePostScreenProps = {
  user: any;
  onBack?: () => void;
};

export function CreatePostScreen({ user, onBack }: CreatePostScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const handleSelectImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select images.'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleUpload = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in title and description');
      return;
    }

    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setUploading(true);

    try {
      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to create a post');
        return;
      }

      // Create unique filename
      const fileExt = selectedImage.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}_${currentUser.id}.${fileExt}`;
      const filePath = `posts/${currentUser.id}/${fileName}`;

      // Create form data for upload
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        name: fileName,
        type: `image/${fileExt}`,
      } as any);

      // Upload image to Supabase storage using fetch
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const uploadResponse = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/post-images/${filePath}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.text();
        console.error('Upload error:', errorData);
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('post-images').getPublicUrl(filePath);

      console.log('Current user ID:', currentUser.id);
      console.log('Public URL:', publicUrl);
      console.log('About to insert post...');

      // Insert post into database
      const { data: insertData, error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: currentUser.id,
            title: title.trim(),
            description: description.trim(),
            image_url: publicUrl,
          },
        ])
        .select();

      if (insertError) {
        console.error('Insert error details:', JSON.stringify(insertError, null, 2));
        Alert.alert(
          'Database Error',
          `Failed to save post: ${insertError.message}\nCode: ${insertError.code}\nDetails: ${insertError.details}`
        );
        throw insertError;
      }

      console.log('Insert successful:', insertData);

      // Success!
      Alert.alert('Success!', 'Your post has been created successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setTitle('');
            setDescription('');
            setSelectedImage(null);
            // Navigate back
            onBack?.();
          },
        },
      ]);
    } catch (error) {
      console.error('Error uploading post:', error);
      Alert.alert('Error', 'Failed to upload post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-4 pt-12">
        <TouchableOpacity onPress={onBack} className="h-10 w-10 items-center justify-center">
          <ChevronLeft size={24} color="#010101" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
          New Post Status
        </Text>
        <TouchableOpacity className="h-10 w-10 items-center justify-center">
          <MoreVertical size={24} color="#010101" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 " showsVerticalScrollIndicator={false}>
        {/* Image Upload Area - Outer gray layer */}
        <View className="mb-6 rounded-3xl bg-[#EFF1F3] p-4">
          {/* Inner white box */}
          <TouchableOpacity
            onPress={handleSelectImage}
            activeOpacity={0.8}
            className="h-40 items-center justify-center rounded-2xl bg-white">
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} className="h-full w-full rounded-2xl" />
            ) : (
              <Text className="text-gray-400" style={{ fontFamily: 'Poppins_400Regular' }}>
                Tap to add image
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <View className="mb-6">
          <Text
            className="mb-2 text-lg font-semibold"
            style={{ fontFamily: 'Poppins_600SemiBold' }}>
            Title
          </Text>
          {/* Outer gray layer */}
          <View className="rounded-3xl bg-[#EFF1F3] p-4">
            {/* Inner white box */}
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Rainforest Trees"
              placeholderTextColor="#9CA3AF"
              className="rounded-2xl bg-white px-4 py-3"
              style={{ fontFamily: 'Poppins_400Regular', fontSize: 16 }}
            />
          </View>
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <Text
            className="mb-2 text-lg font-semibold"
            style={{ fontFamily: 'Poppins_600SemiBold' }}>
            Description
          </Text>
          {/* Outer gray layer */}
          <View className="rounded-3xl bg-[#EFF1F3] p-4">
            {/* Inner white box */}
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices tellus, nunc id nisi id amet, in diam. Massa mi aliquet feugiat quam in."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              className="rounded-2xl bg-white px-4 py-3"
              style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, minHeight: 160 }}
            />
          </View>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          onPress={handleUpload}
          disabled={uploading}
          activeOpacity={0.8}
          className={`mb-8 items-center rounded-xl py-4 ${uploading ? 'bg-gray-400' : 'bg-[#2FA6A7]'}`}>
          <Text
            className="text-base font-semibold text-white"
            style={{ fontFamily: 'Poppins_600SemiBold' }}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay */}
      {uploading && (
        <View className="absolute inset-0 items-center justify-center bg-black/50">
          <View className="items-center rounded-2xl bg-white px-8 py-6">
            <ActivityIndicator size="large" color="#2FA6A7" />
            <Text
              className="mt-3 text-base text-gray-700"
              style={{ fontFamily: 'Poppins_500Medium' }}>
              Uploading your post...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
