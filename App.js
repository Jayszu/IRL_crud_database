import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Subtables from './Components/Subtables';
import Main from './Components/Main'

import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Auth/LoginScreen';
import AdminTable from './Components/AdminTable';

const Stack = createStackNavigator();
const App = () => { 
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="LoginScreen" headerMode="none" screenOptions={{unmountInactiveRoutes: false}} >
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Subtables" component={Subtables} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="AdminTable" component={AdminTable} />
    </Stack.Navigator>
   </NavigationContainer>
  );
};

export default App;
