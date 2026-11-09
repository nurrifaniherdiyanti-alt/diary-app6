import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DiaryCard from "../../src/components/DiaryCard";
import { useDiary } from "../../src/context/DiaryContext";
import { useDiarySearch } from "../../src/hooks/useDiarySearch";

const MOOD_OPTIONS = ["😊", "😌", "🥳", "😴"];

export default function HomeScreen() {
  const router = useRouter();
  const { entries, likedIds, toggleLike } = useDiary();
  const {
    query,
    setQuery,
    selectedMood,
    setSelectedMood,
    filteredEntries,
    resultCount,
    resetFilter,
  } = useDiarySearch(entries);

  const searchRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const openDetail = useCallback(
    (id: number) => {
      router.push({
        pathname: "/detail/[id]",
        params: { id: String(id) },
      });
    },
    [router],
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    searchRef.current?.focus();
  }, [setQuery]);

  const hasActiveFilter = query.length > 0 || selectedMood !== null;

  return (
    <View style={styles.container}>
      {/* HEADER UNGU MELENGKUNG */}
      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerTitle}>📖 Buku Harian</Text>
            <Text style={styles.headerSubtitle}>
              Catat harimu, simpan kenangannya
            </Text>
          </View>
          {hasActiveFilter && (
            <Pressable onPress={resetFilter} style={styles.resetButtonHeader}>
              <Text style={styles.resetTextHeader}>Reset Filter</Text>
            </Pressable>
          )}
        </View>

        {/* KOTAK STATISTIK / SUMMARY CARDS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📝</Text>
            <Text style={styles.statNumber}>{entries.length}</Text>
            <Text style={styles.statLabel}>Total entri</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statNumber}>{likedIds.size}</Text>
            <Text style={styles.statLabel}>Disukai</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔍</Text>
            <Text style={styles.statNumber}>{resultCount}</Text>
            <Text style={styles.statLabel}>Tampil</Text>
          </View>
        </View>

        {/* SEARCH BAR DI DALAM AREA UNGU */}
        <View style={styles.searchRow}>
          <TextInput
            ref={searchRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Cari entri..."
            placeholderTextColor="#94A3B8"
            style={styles.search}
          />
          {query.length > 0 && (
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* KONTEN BAWAH (DAFTAR & FILTER MOOD) */}
      <View style={styles.contentBody}>
        {/* Filter Mood Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodFilterRow}
        >
          <Pressable
            onPress={() => setSelectedMood(null)}
            style={[
              styles.moodChip,
              selectedMood === null && styles.moodChipActive,
            ]}
          >
            <Text
              style={[
                styles.moodChipText,
                selectedMood === null && styles.moodChipTextActive,
              ]}
            >
              Semua Mood
            </Text>
          </Pressable>
          {MOOD_OPTIONS.map((mood) => (
            <Pressable
              key={mood}
              onPress={() => setSelectedMood(mood)}
              style={[
                styles.moodChip,
                selectedMood === mood && styles.moodChipActive,
              ]}
            >
              <Text style={styles.moodEmojiText}>{mood}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Entri Terbaru</Text>
          <Pressable
            onPress={() => router.push("/create")}
            style={styles.addButton}
          >
            <Text style={styles.addText}>+ Tambah</Text>
          </Pressable>
        </View>

        {/* List Entri */}
        <FlatList
          data={filteredEntries}
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
              <Text style={styles.emptyTitle}>Tidak Ditemukan</Text>
              <Text style={styles.empty}>
                Belum ada catatan yang sesuai dengan pencarian atau filter.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerBackground: {
    backgroundColor: "#6366F1", // Warna ungu khas desain kamu
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#E0E7FF",
    marginTop: 2,
  },
  resetButtonHeader: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  resetTextHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 11,
    color: "#E0E7FF",
    marginTop: 2,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  search: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
  },
  clearButton: {
    padding: 6,
  },
  clearText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "bold",
  },
  contentBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  moodFilterRow: {
    gap: 8,
    paddingBottom: 12,
  },
  moodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
  },
  moodChipActive: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  moodChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  moodChipTextActive: {
    color: "#4F46E5",
    fontWeight: "700",
  },
  moodEmojiText: {
    fontSize: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  addButton: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },
  list: {
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  empty: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 12,
    paddingHorizontal: 20,
  },
});
