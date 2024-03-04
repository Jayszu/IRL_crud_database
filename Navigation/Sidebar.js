import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook from React Navigation
import AsyncStorage from '@react-native-async-storage/async-storage';


const Sidebar = ({ switchDatabase, currentDatabase,Name, role, Profile}) => {
  const navigation = useNavigation(); // Access the navigation object

  const LogoutPressed = async () => {
    try {
      // Clear authentication token
      await AsyncStorage.removeItem('isLoggedIn');
    
      // Navigate back to the login screen);
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error clearing authentication token:', error);
    }
  };
  

  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.ProfileTexts}>
      <Image
        source={{ uri: Profile }} 
        style={styles.Profile}
      />
      <Text style={styles.Name}>{Name}</Text>
      <Text style={styles.Role}>{role}</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.databaseOption,
            currentDatabase === 'IRL_Lab_Supplies' ? styles.activeDatabase : null,
          ]}
          onPress={() => switchDatabase('IRL_Lab_Supplies')}
        >
          <Text style={styles.databaseOptionText}>Lab Supplies</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.databaseOption,
            currentDatabase === 'IRL_Chemicals' ? styles.activeDatabase : null,
          ]}
          onPress={() => switchDatabase('IRL_Chemicals')}
        >
          <Text style={styles.databaseOptionText}>Chemicals</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={LogoutPressed}>
        <View style={styles.logoutContainer}>
          <Image source={require('../Assets/logout.png')} style={styles.logouticon} />
          <Text style={styles.logout}>Logout</Text>
    
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    backgroundColor: '#3388ea',
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '15%'
  },
  optionsContainer: {
    alignSelf: 'flex-start',
    bottom:"75%",
  },
  databaseOption: {
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    top:'300%'
  },
  databaseOptionText: {
    color: 'white',
    fontSize: 16,
  },
  activeDatabase: {
    backgroundColor: '#1a17be',
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logout: {
    color: 'white',
    fontSize: 16,
  },
  logouticon: {
    width: 30,
    height: 30,
    marginRight: 5,
    bottom: 5
  },
  Name:{
    fontWeight:"800",
    fontSize:20,
    alignSelf:'center'
  },
  ProfileTexts:{
 bottom:"50%"
  },
  Role:{
    color:"white",
    alignSelf:'center'
  },
  Profile:{
   
      width: 150,
      height: 150,
      borderRadius: 100, 
      marginBottom: 10, 
  }
});

export default Sidebar;
