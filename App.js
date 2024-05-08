import React,{useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Subtables from './Components/Subtables';
import Main from './Components/Main'

import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Auth/LoginScreen';
import AdminTable from './Components/AdminTable';
import Chemicals from './Components/Chemicals';
import ChemicalSubTables from './Components/ChemicalSubTables';
import MicroItems from './Components/MicroLab';
import MicroLab from './Components/MicroLab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();
const App = () => { 
  
  
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="LoginScreen" headerMode="none" screenOptions={{unmountInactiveRoutes: false}} >
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Subtables" component={Subtables} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="AdminTable" component={AdminTable} />
      <Stack.Screen name="Chemicals" component={Chemicals} />
      <Stack.Screen name="ChemicalSubTables" component={ChemicalSubTables} />
      <Stack.Screen name="MicroItems" component={MicroItems} />
      <Stack.Screen name="MicroLab" component={MicroLab} />
    </Stack.Navigator>
   </NavigationContainer>
  );
};

export default App;
