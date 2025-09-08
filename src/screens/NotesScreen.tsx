import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {
  Text,
  FAB,
  Searchbar,
  IconButton,
  Title,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useNoteStore} from '../lib/note-store';
import {theme} from '../theme';
import NoteCard from '../components/NoteCard';
import NoteFilters from '../components/NoteFilters';

const NotesScreen = () => {
  const navigation = useNavigation();
  const {notes} = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredNotes = notes.filter(note => {
    const stripHtml = (html: string) => {
      return html.replace(/<[^>]*>/g, '');
    };

    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stripHtml(note.content).toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPinned = !showPinned || note.isPinned;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => note.tags.includes(tag));

    return matchesSearch && matchesPinned && matchesTags;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const pinnedCount = notes.filter(note => note.isPinned).length;
  const totalCount = notes.length;

  const handleEditNote = (note: any) => {
    navigation.navigate('NoteForm', {note});
  };

  const renderNote = ({item}: {item: any}) => (
    <NoteCard note={item} onEdit={handleEditNote} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Notes</Title>
        <Text style={styles.subtitle}>
          {totalCount} notes{pinnedCount > 0 && `, ${pinnedCount} pinned`}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search notes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <IconButton
          icon="filter-variant"
          mode={showFilters ? 'contained' : 'outlined'}
          onPress={() => setShowFilters(!showFilters)}
        />
      </View>

      {showFilters && (
        <NoteFilters
          showPinned={showPinned}
          onShowPinnedChange={setShowPinned}
          selectedTags={selectedTags}
          onSelectedTagsChange={setSelectedTags}
        />
      )}

      {filteredNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No notes found</Text>
          <Text style={styles.emptySubtitle}>
            {notes.length === 0
              ? 'Create your first note to get started'
              : 'Try adjusting your filters or search query'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.noteList}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('NoteForm')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
  },
  subtitle: {
    color: theme.colors.onSurface,
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
  },
  noteList: {
    padding: 8,
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: theme.colors.onSurface,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default NotesScreen;