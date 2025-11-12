import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export function WelcomeScreen({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <View className="flex-1 bg-white">
      {/* Header with logo */}
      <View className="mt-16 items-center">
        {/* Logo */}
        <Image
          source={require('../assets/logo.png')}
          className="mb-2 h-16 w-16"
          resizeMode="contain"
        />

        <Text className="mt-2 text-2xl font-bold text-gray-900">Framez</Text>
      </View>

      {/* Illustration with Landing image */}
      <View className="relative flex-1 items-center justify-center">
        <Image
          source={require('../assets/Landing.png')}
          className="h-[218.8px] w-[280.97px]"
          resizeMode="contain"
        />
      </View>

      {/* Bottom section */}
      <View className="px-8 pb-12">
        <Text className="mb-4 text-center text-2xl font-bold text-gray-900">
          Create Multiple Source Of Pleasure!
        </Text>

        <Text className="mb-8 text-center text-sm leading-5 text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          className="items-center rounded-full bg-teal-500 py-4 shadow-lg"
          onPress={onGetStarted}
          activeOpacity={0.8}>
          <Text className="text-base font-semibold text-white">Get Started</Text>
        </TouchableOpacity>

        {/* Bottom indicator */}
        <View className="mt-6 flex-row items-center justify-center" style={styles.pagination}>
          <View className="h-1 w-8 rounded-full bg-teal-500" />
          <View className="h-1 w-2 rounded-full bg-gray-300" />
          <View className="h-1 w-2 rounded-full bg-gray-300" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    gap: 8,
  },
});
