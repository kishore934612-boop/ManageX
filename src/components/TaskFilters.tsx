import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Text, Switch, Chip} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {useTaskStore} from '../lib/task-store';
import {theme} from '../theme';

interface TaskFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  showCompleted,
  onShowCompletedChange,
}) => {
  const {categories} = useTaskStore();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Category</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={onCategoryChange}
              style={styles.picker}
            >
              <Picker.Item label="All Categories" value="all" />
              {categories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.name}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Priority</Text>
            <Picker
              selectedValue={selectedPriority}
              onValueChange={onPriorityChange}
              style={styles.picker}
            >
              <Picker.Item label="All Priorities" value="all" />
              <Picker.Item label="High" value="high" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="Low" value="low" />
            </Picker>
          </View>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Show completed tasks</Text>
          <Switch value={showCompleted} onValueChange={onShowCompletedChange} />
        </View>

        <View style={styles.activeFilters}>
          {selectedCategory !== 'all' && (
            <Chip
              style={styles.filterChip}
              onClose={() => onCategoryChange('all')}
            >
              Category: {selectedCategory}
            </Chip>
          )}
          {selectedPriority !== 'all' && (
            <Chip
              style={styles.filterChip}
              onClose={() => onPriorityChange('all')}
            >
              Priority: {selectedPriority}
            </Chip>
          )}
          {!showCompleted && (
            <Chip
              style={styles.filterChip}
              onClose={() => onShowCompletedChange(true)}
            >
              Hide completed
            </Chip>
          )}
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
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  picker: {
    height: 40,
    backgroundColor: theme.colors.surface,
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
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: theme.colors.secondary + '20',
  },
});

export default TaskFilters;