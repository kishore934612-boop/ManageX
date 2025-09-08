import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Text, Switch, Chip} from 'react-native-paper';
import {useNoteStore} from '../lib/note-store';
import {theme} from '../theme';

interface NoteFiltersProps {
  showPinned: boolean;
  onShowPinnedChange: (show: boolean) => void;
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
}

const NoteFilters: React.FC<NoteFiltersProps> = ({
  showPinned,
  onShowPinnedChange,
  selectedTags,
  onSelectedTagsChange,
}) => {
  const {getAllTags} = useNoteStore();
  const allTags = getAllTags();

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onSelectedTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onSelectedTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Show only pinned notes</Text>
          <Switch value={showPinned} onValueChange={onShowPinnedChange} />
        </View>

        {allTags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Filter by tags:</Text>
            <View style={styles.tagsContainer}>
              {allTags.map((tag) => (
                <Chip
                  key={tag}
                  style={[
                    styles.tagChip,
                    selectedTags.includes(tag) && styles.selectedTagChip,
                  ]}
                  textStyle={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.selectedTagText,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </View>
        )}

        <View style={styles.activeFilters}>
          {showPinned && (
            <Chip
              style={styles.filterChip}
              onClose={() => onShowPinnedChange(false)}
            >
              Pinned only
            </Chip>
          )}
          {selectedTags.map((tag) => (
            <Chip
              key={tag}
              style={styles.filterChip}
              onClose={() => toggleTag(tag)}
            >
              Tag: {tag}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 0,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  tagsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: theme.colors.outline + '40',
  },
  selectedTagChip: {
    backgroundColor: theme.colors.primary,
  },
  tagText: {
    color: theme.colors.onSurface,
  },
  selectedTagText: {
    color: theme.colors.onPrimary,
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: theme.colors.secondary + '20',
  },
});

export default NoteFilters;