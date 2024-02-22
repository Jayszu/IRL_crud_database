import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Subtables from './Components/Subtables';
import Main from './Components/Main'

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const App = () => { 
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Main" headerMode="none">
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Subtables" component={Subtables} />
    </Stack.Navigator>
   </NavigationContainer>
  );
};

export default App;
