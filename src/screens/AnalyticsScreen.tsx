import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Title, Paragraph} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTaskStore} from '../lib/task-store';
import {useNoteStore} from '../lib/note-store';
import {calculateTaskAnalytics, calculateNoteAnalytics} from '../lib/analytics';
import {theme} from '../theme';

const AnalyticsScreen = () => {
  const {tasks} = useTaskStore();
  const {notes} = useNoteStore();

  const taskAnalytics = calculateTaskAnalytics(tasks);
  const noteAnalytics = calculateNoteAnalytics(notes);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Title style={styles.title}>Analytics</Title>
          <Paragraph style={styles.subtitle}>
            Insights into your productivity and habits
          </Paragraph>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="check-box" size={24} color={theme.colors.primary} />
              <View style={styles.statText}>
                <Text style={styles.statNumber}>{taskAnalytics.totalTasks}</Text>
                <Text style={styles.statLabel}>Total Tasks</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="note" size={24} color={theme.colors.accent} />
              <View style={styles.statText}>
                <Text style={styles.statNumber}>{noteAnalytics.totalNotes}</Text>
                <Text style={styles.statLabel}>Total Notes</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Productivity Score</Title>
            <Paragraph style={styles.cardSubtitle}>
              Your overall productivity performance
            </Paragraph>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreText, {color: getScoreColor(taskAnalytics.productivityScore)}]}>
                {Math.round(taskAnalytics.productivityScore)}
              </Text>
              <Text style={styles.scoreLabel}>
                {getScoreLabel(taskAnalytics.productivityScore)}
              </Text>
            </View>
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{Math.round(taskAnalytics.completionRate)}%</Text>
                <Text style={styles.metricLabel}>Completion Rate</Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, {color: taskAnalytics.overdueTasks > 0 ? '#ef4444' : '#10b981'}]}>
                  {taskAnalytics.overdueTasks}
                </Text>
                <Text style={styles.metricLabel}>Overdue Tasks</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {taskAnalytics.tasksByPriority.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Priority Distribution</Title>
              <Paragraph style={styles.cardSubtitle}>
                Tasks breakdown by priority level
              </Paragraph>
              {taskAnalytics.tasksByPriority.map((item) => (
                <View key={item.priority} style={styles.priorityItem}>
                  <View style={styles.priorityHeader}>
                    <Text style={styles.priorityLabel}>{item.priority}</Text>
                    <Text style={styles.priorityValue}>
                      {item.count} ({Math.round(item.percentage)}%)
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: getPriorityColor(item.priority)
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {noteAnalytics.mostUsedTags.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Most Used Tags</Title>
              <Paragraph style={styles.cardSubtitle}>
                Your frequently used note tags
              </Paragraph>
              <View style={styles.tagsContainer}>
                {noteAnalytics.mostUsedTags.map((tag) => {
                  const tagData = noteAnalytics.notesByTag.find(item => item.tag === tag);
                  return (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>
                        {tag} ({tagData?.count || 0})
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card.Content>
          </Card>
        )}

        {tasks.length === 0 && notes.length === 0 && (
          <Card style={styles.card}>
            <Card.Content style={styles.emptyState}>
              <Icon name="dashboard" size={48} color={theme.colors.onSurface} />
              <Title style={styles.emptyTitle}>No Data Yet</Title>
              <Paragraph style={styles.emptySubtitle}>
                Start creating tasks and notes to see your productivity analytics here.
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const getScoreColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#6b7280';
    default: return '#6b7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.onSurface,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.onSurface,
  },
  priorityItem: {
    marginBottom: 12,
  },
  priorityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityValue: {
    fontSize: 12,
    color: theme.colors.onSurface,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.outline,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: theme.colors.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: theme.colors.onSurface,
  },
});

export default AnalyticsScreen;