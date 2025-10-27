import React from 'react';
import { View, Text } from 'react-native';
import { useNotificationStore } from '../../store/notificationStore';

interface NotificationBadgeProps {
  size?: number;
}

export default function NotificationBadge({ size = 16 }: NotificationBadgeProps) {
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  if (unreadCount === 0) return null;

  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <View 
      style={{
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
      }}
    >
      <Text 
        style={{
          color: 'white',
          fontSize: size * 0.625,
          fontWeight: 'bold',
        }}
      >
        {displayCount}
      </Text>
    </View>
  );
}

