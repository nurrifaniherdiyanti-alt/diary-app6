import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { COLORS, SPACE, RADIUS, TYPO } from '../styles/tokens';

type Props = {
  title: string;
  date: string;
  preview: string;
  mood: string; // Bisa berupa URI gambar atau emoji
  liked: boolean;
  onPress: () => void;
  onToggleLike: () => void;
};

export default function DiaryCard({
  title,
  date,
  preview,
  mood,
  liked,
  onPress,
  onToggleLike,
}: Props) {
  // Mengecek apakah mood berisi link gambar atau emoji biasa
  const isImageUrl = mood && (mood.startsWith('http') || mood.startsWith('file') || mood.startsWith('data'));

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.main}>
        {/* Foto bulat di sebelah kiri */}
        <View style={styles.imageContainer}>
          {isImageUrl ? (
            <Image source={{ uri: mood }} style={styles.avatar} />
          ) : (
            <Text style={styles.moodEmoji}>{mood || '📝'}</Text>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.dateRow}>
            <Text style={styles.calendarIcon}>🗓️ </Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <Text style={styles.preview} numberOfLines={2}>
            {preview}
          </Text>
        </View>
      </Pressable>

      <Pressable onPress={onToggleLike} style={styles.likeButton}>
        <Text style={styles.like}>{liked ? '❤️' : '🤍'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  moodEmoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  calendarIcon: {
    fontSize: 11,
  },
  date: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  preview: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  likeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  like: {
    fontSize: 22,
  },
});