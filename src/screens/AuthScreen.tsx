import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  SegmentedButtons,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../theme';

interface AuthScreenProps {
  onAuthenticate: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({onAuthenticate}) => {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      onAuthenticate();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Title style={styles.title}>Managex</Title>
          <Paragraph style={styles.subtitle}>
            Your professional task and note management solution
          </Paragraph>

          <Card style={styles.card}>
            <Card.Content>
              <SegmentedButtons
                value={mode}
                onValueChange={setMode}
                buttons={[
                  {value: 'signin', label: 'Sign In'},
                  {value: 'signup', label: 'Sign Up'},
                ]}
                style={styles.segmentedButtons}
              />

              <View style={styles.form}>
                {mode === 'signup' && (
                  <TextInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                  />
                )}
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry
                  style={styles.input}
                />
                <Button
                  mode="contained"
                  onPress={handleAuth}
                  loading={loading}
                  style={styles.button}
                >
                  {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                </Button>
              </View>

              <View style={styles.divider}>
                <Text style={styles.dividerText}>Or continue with</Text>
              </View>

              <Button
                mode="outlined"
                icon="google"
                onPress={handleAuth}
                style={styles.googleButton}
              >
                Google
              </Button>
            </Card.Content>
          </Card>
        </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: theme.colors.onBackground,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  divider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerText: {
    color: theme.colors.onSurface,
    fontSize: 12,
  },
  googleButton: {
    marginTop: 8,
  },
});

export default AuthScreen;