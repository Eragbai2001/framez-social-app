import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Home } from 'lucide-react-native';

type TabBarProps = {
  activeTab: 'home' | 'post' | 'profile';
  onTabPress: (tab: 'home' | 'post' | 'profile') => void;
};

export function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const activeColor = '#2FA6A7';
  const inactiveColor = '#2FA6A7';

  return (
    <View
        style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
        }}
        className="flex-row items-center justify-around rounded-t-3xl bg-white px-5 py-4">
      {/* Home Tab */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => onTabPress('home')}
        activeOpacity={0.7}>
        <View
          className={`h-12 w-12 items-center justify-center rounded-xl ${
            activeTab === 'home' ? 'bg-[#2FA6A7]' : 'border-2 border-[#2FA6A7] bg-transparent'
          }`}>
          <Home
            size={24}
            color={activeTab === 'home' ? '#FFFFFF' : inactiveColor}
            fill={activeTab === 'home' ? activeColor : 'transparent'}
          />
        </View>
      </TouchableOpacity>

      {/* Post Tab (Center) */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => onTabPress('post')}
        activeOpacity={0.7}>
        <View
          className={`h-12 w-12 items-center justify-center rounded-xl ${
            activeTab === 'post' ? 'bg-[#2FA6A7]' : 'border-2 border-[#2FA6A7] bg-transparent'
          }`}>
          <Image
            source={require('../assets/Shape.png')}
            style={[
              styles.postIcon,
              { tintColor: activeTab === 'post' ? '#FFFFFF' : inactiveColor },
            ]}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => onTabPress('profile')}
        activeOpacity={0.7}>
        <View
          className={`h-12 w-12 items-center justify-center rounded-xl ${
            activeTab === 'profile' ? 'bg-[#2FA6A7]' : 'border-2 border-[#2FA6A7] bg-transparent'
          }`}>
          <Image
            source={require('../assets/Profile.png')}
            style={[
              styles.profileIcon,
              { tintColor: activeTab === 'profile' ? '#FFFFFF' : inactiveColor },
            ]}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  postIcon: {
    width: 24,
    height: 24,
  },
  profileIcon: {
    width: 24,
    height: 24,
  },
});
