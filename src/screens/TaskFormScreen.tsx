import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Switch,
  Text,
  Chip,
  IconButton,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTaskStore} from '../lib/task-store';
import {theme} from '../theme';
import type {Task} from '../lib/types';

const TaskFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {addTask, updateTask, categories} = useTaskStore();
  
  const task = route.params?.task as Task | undefined;
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(task?.priority || 'medium');
  const [category, setCategory] = useState(task?.category || categories[0]?.name || '');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isRecurring, setIsRecurring] = useState(!!task?.recurring);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly'>(
    task?.recurring?.type || 'weekly'
  );
  const [recurringInterval, setRecurringInterval] = useState(task?.recurring?.interval || 1);
  const [progress, setProgress] = useState(task?.progress || 0);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      category,
      tags,
      recurring: isRecurring ? {type: recurringType, interval: recurringInterval} : undefined,
      progress,
      completed: task?.completed || false,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              {task ? 'Edit Task' : 'Create New Task'}
            </Title>

            <TextInput
              label="Task Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Due Date</Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                >
                  {dueDate ? dueDate.toLocaleDateString() : 'Pick a date'}
                </Button>
              </View>

              <View style={styles.halfWidth}>
                <Text style={styles.label}>Priority</Text>
                <Picker
                  selectedValue={priority}
                  onValueChange={setPriority}
                  style={styles.picker}
                >
                  <Picker.Item label="High" value="high" />
                  <Picker.Item label="Medium" value="medium" />
                  <Picker.Item label="Low" value="low" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
                ))}
              </Picker>
            </View>

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

            {task && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Progress: {progress}%</Text>
                <View style={styles.progressContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => setProgress(Math.max(0, progress - 10))}
                    style={styles.progressButton}
                  >
                    -10%
                  </Button>
                  <Text style={styles.progressText}>{progress}%</Text>
                  <Button
                    mode="outlined"
                    onPress={() => setProgress(Math.min(100, progress + 10))}
                    style={styles.progressButton}
                  >
                    +10%
                  </Button>
                </View>
              </View>
            )}

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Recurring Task</Text>
              <Switch value={isRecurring} onValueChange={setIsRecurring} />
            </View>

            {isRecurring && (
              <View style={styles.recurringContainer}>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Repeat</Text>
                    <Picker
                      selectedValue={recurringType}
                      onValueChange={setRecurringType}
                      style={styles.picker}
                    >
                      <Picker.Item label="Daily" value="daily" />
                      <Picker.Item label="Weekly" value="weekly" />
                      <Picker.Item label="Monthly" value="monthly" />
                    </Picker>
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Every</Text>
                    <TextInput
                      value={recurringInterval.toString()}
                      onChangeText={(text) => setRecurringInterval(Number(text) || 1)}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                {task ? 'Update Task' : 'Create Task'}
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

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
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
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  picker: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 4,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  progressButton: {
    minWidth: 60,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  recurringContainer: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
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

export default TaskFormScreen;