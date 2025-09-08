import React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Switch,
  Button,
  List,
  Divider,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSettingsStore} from '../lib/settings-store';
import {theme} from '../theme';

const SettingsScreen = () => {
  const {settings, updateSettings, resetSettings} = useSettingsStore();

  const handleInstallPWA = () => {
    Alert.alert(
      'Install App',
      'This feature would allow you to install the app on your device.',
      [{text: 'OK'}]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature would export your tasks and notes.',
      [{text: 'OK'}]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all data? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Clear data logic would go here
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetSettings,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Title style={styles.title}>Settings</Title>
          <Paragraph style={styles.subtitle}>
            Customize your Managex experience
          </Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Appearance</List.Subheader>
              <List.Item
                title="Theme"
                description="Choose your preferred theme"
                left={props => <List.Icon {...props} icon="palette" />}
                right={() => <Text style={styles.settingValue}>System</Text>}
              />
              <List.Item
                title="Font Size"
                description="Adjust text size for better readability"
                left={props => <List.Icon {...props} icon="format-size" />}
                right={() => <Text style={styles.settingValue}>Medium</Text>}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Notifications</List.Subheader>
              <List.Item
                title="Push Notifications"
                description="Get notified about due tasks"
                left={props => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={settings.notifications}
                    onValueChange={(value) => updateSettings({notifications: value})}
                  />
                )}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>General</List.Subheader>
              <List.Item
                title="Auto-save"
                description="Automatically save changes"
                left={props => <List.Icon {...props} icon="content-save-auto" />}
                right={() => (
                  <Switch
                    value={settings.autoSave}
                    onValueChange={(value) => updateSettings({autoSave: value})}
                  />
                )}
              />
              <List.Item
                title="Export Format"
                description="Default format for exports"
                left={props => <List.Icon {...props} icon="file-export" />}
                right={() => <Text style={styles.settingValue}>TXT</Text>}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Voice to Text</List.Subheader>
              <List.Item
                title="Enable Voice Input"
                description="Allow microphone access for voice commands"
                left={props => <List.Icon {...props} icon="microphone" />}
                right={() => (
                  <Switch
                    value={settings.voiceToText}
                    onValueChange={(value) => updateSettings({voiceToText: value})}
                  />
                )}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Install App</List.Subheader>
              <List.Item
                title="Install Managex"
                description="Install Managex as a native app"
                left={props => <List.Icon {...props} icon="download" />}
                onPress={handleInstallPWA}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Data Management</List.Subheader>
              <List.Item
                title="Export Data"
                description="Download your tasks and notes"
                left={props => <List.Icon {...props} icon="download" />}
                onPress={handleExportData}
              />
              <Divider />
              <List.Item
                title="Clear All Data"
                description="Irreversible action"
                left={props => <List.Icon {...props} icon="delete" color="#ef4444" />}
                titleStyle={{color: '#ef4444'}}
                onPress={handleClearData}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Reset Settings</List.Subheader>
              <List.Item
                title="Reset to Defaults"
                description="Restore default settings"
                left={props => <List.Icon {...props} icon="restore" />}
                onPress={handleResetSettings}
              />
            </List.Section>
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
  card: {
    marginBottom: 16,
  },
  settingValue: {
    color: theme.colors.onSurface,
    fontSize: 14,
  },
});

export default SettingsScreen;