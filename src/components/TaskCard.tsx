import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Card,
  Text,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import {format, isToday, isTomorrow, isPast} from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTaskStore} from '../lib/task-store';
import {theme} from '../theme';
import type {Task} from '../lib/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({task, onEdit}) => {
  const {toggleTask, deleteTask} = useTaskStore();
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getDueDateText = (dueDate?: Date) => {
    if (!dueDate) return null;

    if (isToday(dueDate)) return 'Today';
    if (isTomorrow(dueDate)) return 'Tomorrow';
    if (isPast(dueDate)) return 'Overdue';
    return format(dueDate, 'MMM d');
  };

  const getDueDateColor = (dueDate?: Date) => {
    if (!dueDate) return theme.colors.onSurface;
    if (isPast(dueDate) && !isToday(dueDate)) return '#ef4444';
    if (isToday(dueDate)) return theme.colors.accent;
    return theme.colors.onSurface;
  };

  return (
    <Card style={[styles.card, task.completed && styles.completedCard]}>
      <Card.Content>
        <View style={styles.header}>
          <Checkbox
            status={task.completed ? 'checked' : 'unchecked'}
            onPress={() => toggleTask(task.id)}
          />
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                task.completed && styles.completedText,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            {task.dueDate && (
              <View style={styles.dueDateContainer}>
                <Icon name="schedule" size={12} color={getDueDateColor(task.dueDate)} />
                <Text style={[styles.dueDate, {color: getDueDateColor(task.dueDate)}]}>
                  {getDueDateText(task.dueDate)}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.actions}>
            <Chip
              style={[styles.priorityChip, {backgroundColor: getPriorityColor(task.priority) + '20'}]}
              textStyle={[styles.priorityText, {color: getPriorityColor(task.priority)}]}
            >
              {task.priority}
            </Chip>
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
              <Menu.Item onPress={() => {onEdit(task); setShowMenu(false);}} title="Edit" />
              <Divider />
              <Menu.Item
                onPress={() => {deleteTask(task.id); setShowMenu(false);}}
                title="Delete"
                titleStyle={{color: '#ef4444'}}
              />
            </Menu>
          </View>
        </View>

        {task.progress > 0 && task.progress < 100 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Progress: {task.progress}%</Text>
            <ProgressBar progress={task.progress / 100} color={theme.colors.primary} />
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.categoryContainer}>
            <Icon name="folder" size={12} color={theme.colors.onSurface} />
            <Text style={styles.category}>{task.category}</Text>
            {task.recurring && (
              <>
                <Icon name="repeat" size={12} color={theme.colors.onSurface} style={styles.recurringIcon} />
                <Text style={styles.category}>Recurring</Text>
              </>
            )}
          </View>
        </View>

        {task.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {task.tags.map((tag) => (
              <Chip key={tag} style={styles.tag} textStyle={styles.tagText}>
                {tag}
              </Chip>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: theme.colors.onSurface + '80',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDate: {
    fontSize: 12,
    marginLeft: 4,
  },
  actions: {
    alignItems: 'center',
  },
  priorityChip: {
    height: 24,
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  recurringIcon: {
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    height: 20,
    backgroundColor: theme.colors.outline + '40',
  },
  tagText: {
    fontSize: 10,
    color: theme.colors.onSurface,
  },
});

export default TaskCard;