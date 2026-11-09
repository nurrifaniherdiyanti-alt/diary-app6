import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDiary } from '../../src/context/DiaryContext';
import { useLikedEntries } from '../../src/hooks/useLikedEntries';
import DiaryCard from '../../src/components/DiaryCard';
import { COLORS, SPACE, TYPO } from '../../src/styles/tokens';

export default function FavoritesScreen() {
  const router = useRouter();
  const { entries, likedIds, toggleLike } = useDiary();
  const likedEntries = useLikedEntries(entries, likedIds);

  const openDetail = useCallback(
    (id: number) => {
      router.push({
        pathname: '/detail/[id]',
        params: { id: String(id) },
      });
    },
    [router]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Catatan Disukai</Text>
      <Text style={styles.counter}>{likedEntries.length} entri favorit</Text>

      <FlatList
        data={likedEntries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DiaryCard
            title={item.title}
            date={item.date}
            preview={item.preview}
            mood={item.mood}
            liked={likedIds.has(item.id)}
            onPress={() => openDetail(item.id)}
            onToggleLike={() => toggleLike(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Belum Ada Favorit</Text>
            <Text style={styles.empty}>Ketuk ikon hati pada catatan untuk menambahkannya ke sini.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACE.l,
    paddingTop: SPACE.m,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: TYPO.h1,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  counter: {
    fontSize: TYPO.caption,
    color: COLORS.muted,
    marginBottom: SPACE.m,
  },
  list: {
    gap: SPACE.m,
    paddingBottom: SPACE.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: TYPO.caption,
    paddingHorizontal: 32,
  },
});