import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Text,
  Chip,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useNoteStore} from '../lib/note-store';
import {theme} from '../theme';
import type {Note} from '../lib/types';

const NoteFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {addNote, updateNote} = useNoteStore();
  
  const note = route.params?.note as Note | undefined;
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Error', 'Please enter a title or content');
      return;
    }

    const noteData = {
      title: title.trim() || 'Untitled',
      content: content.trim(),
      tags,
      isPinned: note?.isPinned || false,
      color: note?.color,
    };

    if (note) {
      updateNote(note.id, noteData);
    } else {
      addNote(noteData);
    }

    navigation.goBack();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              {note ? 'Edit Note' : 'Create New Note'}
            </Title>

            <TextInput
              label="Note Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              placeholder="Enter note title..."
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tags</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholder="Add a tag"
                  mode="outlined"
                  style={styles.tagInput}
                  onSubmitEditing={addTag}
                />
                <Button mode="contained" onPress={addTag} style={styles.addTagButton}>
                  Add
                </Button>
              </View>
              <View style={styles.tagsContainer}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    style={styles.tag}
                    onClose={() => removeTag(tag)}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            </View>

            <TextInput
              label="Note Content"
              value={content}
              onChangeText={setContent}
              mode="outlined"
              multiline
              numberOfLines={10}
              style={styles.contentInput}
              placeholder="Start writing your note..."
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                {note ? 'Update Note' : 'Create Note'}
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    alignSelf: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: theme.colors.secondary + '20',
  },
  contentInput: {
    marginBottom: 16,
    minHeight: 200,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  submitButton: {
    paddingVertical: 8,
  },
  cancelButton: {
    paddingVertical: 8,
  },
});

export default NoteFormScreen;