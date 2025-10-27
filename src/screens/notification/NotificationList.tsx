import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Trash2, CheckCheck } from 'lucide-react-native';
import Header from '../../components/common/Header';
import { useNotificationStore } from '../../store/notificationStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

interface NotificationListProps {
  navigation: any;
}

export default function NotificationList({ navigation }: NotificationListProps) {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearNotifications } = useNotificationStore();

  const handleNotificationPress = (notificationId: string) => {
    markAsRead(notificationId);
    // 필요시 알림 상세 화면으로 이동하거나 관련 화면으로 이동
  };

  const handleClearAll = () => {
    Alert.alert(
      '알림 전체 삭제',
      '모든 알림을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => clearNotifications(),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInHours * 60);
        return `${diffInMinutes}분 전`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}시간 전`;
      } else {
        return format(date, 'MM월 dd일 HH:mm', { locale: ko });
      }
    } catch {
      return '';
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4">
        <Header title="알림" />
        <View className="flex-row gap-2">
          {notifications.length > 0 && (
            <>
              <TouchableOpacity onPress={markAllAsRead} className="p-2">
                <CheckCheck size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearAll} className="p-2">
                <Trash2 size={20} color="#6b7280" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-400 text-base">알림이 없습니다</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification.id)}
              className={`border-b border-gray-100 py-4 ${
                !notification.isRead ? 'bg-pink-50' : 'bg-white'
              }`}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text
                  className={`text-base flex-1 ${
                    !notification.isRead ? 'font-semibold' : 'font-regular'
                  }`}
                >
                  {notification.title}
                </Text>
                <TouchableOpacity
                  onPress={() => removeNotification(notification.id)}
                  className="ml-2 p-1"
                >
                  <Trash2 size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              
              <Text className="text-sm text-gray-600 mb-2">
                {notification.message}
              </Text>
              
              <Text className="text-xs text-gray-400">
                {formatDate(notification.receivedAt)}
              </Text>

              {!notification.isRead && (
                <View className="absolute top-4 right-10 w-2 h-2 rounded-full bg-[#e46592]" />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

