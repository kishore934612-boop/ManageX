import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';

import AuthScreen from './screens/AuthScreen';
import MainTabNavigator from './navigation/MainTabNavigator';
import TaskFormScreen from './screens/TaskFormScreen';
import NoteFormScreen from './screens/NoteFormScreen';
import {theme} from './theme';

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {!isAuthenticated ? (
              <Stack.Screen name="Auth">
                {props => <AuthScreen {...props} onAuthenticate={() => setIsAuthenticated(true)} />}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="Main" component={MainTabNavigator} />
                <Stack.Screen 
                  name="TaskForm" 
                  component={TaskFormScreen}
                  options={{
                    headerShown: true,
                    title: 'Task',
                    headerStyle: {backgroundColor: theme.colors.surface},
                  }}
                />
                <Stack.Screen 
                  name="NoteForm" 
                  component={NoteFormScreen}
                  options={{
                    headerShown: true,
                    title: 'Note',
                    headerStyle: {backgroundColor: theme.colors.surface},
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;