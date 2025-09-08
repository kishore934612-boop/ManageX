import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Card,
  Text,
  Chip,
  IconButton,
  Menu,
  Divider,
} from 'react-native-paper';
import {format} from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNoteStore} from '../lib/note-store';
import {theme} from '../theme';
import type {Note} from '../lib/types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

const noteColors = [
  {name: 'default', bg: theme.colors.surface},
  {name: 'yellow', bg: '#fef3c7'},
  {name: 'green', bg: '#d1fae5'},
  {name: 'blue', bg: '#dbeafe'},
  {name: 'purple', bg: '#e9d5ff'},
  {name: 'pink', bg: '#fce7f3'},
];

const NoteCard: React.FC<NoteCardProps> = ({note, onEdit}) => {
  const {deleteNote, togglePin, updateNote} = useNoteStore();
  const [showMenu, setShowMenu] = useState(false);

  const getColorStyle = (colorName?: string) => {
    const color = noteColors.find(c => c.name === colorName) || noteColors[0];
    return {backgroundColor: color.bg};
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const getPreview = (content: string) => {
    const text = stripHtml(content);
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  const changeColor = (colorName: string) => {
    updateNote(note.id, {color: colorName});
    setShowMenu(false);
  };

  return (
    <Card style={[styles.card, getColorStyle(note.color)]}>
      <Card.Content>
        {note.isPinned && (
          <View style={styles.pinContainer}>
            <Icon name="push-pin" size={16} color={theme.colors.primary} />
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {note.title || 'Untitled'}
          </Text>
          <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor={
              <IconButton
                icon="more-vert"
                size={16}
                onPress={() => setShowMenu(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {togglePin(note.id); setShowMenu(false);}}
              title={note.isPinned ? 'Unpin' : 'Pin'}
            />
            <Divider />
            <View style={styles.colorPicker}>
              <Text style={styles.colorPickerTitle}>Color:</Text>
              <View style={styles.colorOptions}>
                {noteColors.map((color) => (
                  <IconButton
                    key={color.name}
                    icon="circle"
                    size={16}
                    iconColor={color.bg}
                    style={[
                      styles.colorOption,
                      {backgroundColor: color.bg},
                      note.color === color.name && styles.selectedColor,
                    ]}
                    onPress={() => changeColor(color.name)}
                  />
                ))}
              </View>
            </View>
            <Divider />
            <Menu.Item onPress={() => {onEdit(note); setShowMenu(false);}} title="Edit" />
            <Menu.Item
              onPress={() => {deleteNote(note.id); setShowMenu(false);}}
              title="Delete"
              titleStyle={{color: '#ef4444'}}
            />
          </Menu>
        </View>

        {note.content && (
          <Text style={styles.content} numberOfLines={4}>
            {getPreview(note.content)}
          </Text>
        )}

        {note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} style={styles.tag} textStyle={styles.tagText}>
                {tag}
              </Chip>
            ))}
            {note.tags.length > 3 && (
              <Chip style={styles.tag} textStyle={styles.tagText}>
                +{note.tags.length - 3}
              </Chip>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.date}>{format(note.updatedAt, 'MMM d, yyyy')}</Text>
          <Text style={styles.time}>{format(note.updatedAt, 'h:mm a')}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
    elevation: 2,
  },
  pinContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: 8,
  },
  content: {
    fontSize: 12,
    color: theme.colors.onSurface,
    lineHeight: 16,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    height: 20,
    backgroundColor: theme.colors.outline + '40',
  },
  tagText: {
    fontSize: 10,
    color: theme.colors.onSurface,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 10,
    color: theme.colors.onSurface,
  },
  time: {
    fontSize: 10,
    color: theme.colors.onSurface,
  },
  colorPicker: {
    padding: 8,
  },
  colorPickerTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  colorOption: {
    width: 24,
    height: 24,
    borderRadius: 12,
    margin: 0,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
});

export default NoteCard;