import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert , StyleSheet, ImageBackground, Image, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Airtable from 'airtable'; // Import Airtable library

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 

  const navigation = useNavigation();
  const [currentDatabase, setCurrentDatabase]= useState('Records');
  


  const handleLogin = async () => {
    try {
      const base = new Airtable({ apiKey: 'patuAn2pKiuFSMoI8.1ad68d143585a93ed0c2348b3ab3adb9c1f8364b814d1a9149f763b6087ef2f3' })
      .base('appjSsMo3NZ8iJPHL');
    
      // Fetch user records from Airtable
      const userRecords = await base(currentDatabase).select({ view: 'Grid view' }).all();
    
      // Check if the entered username and password match any record
      const matchingUser = userRecords.find(record => record.fields.username === username && record.fields.password === password);
    
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      
      if (matchingUser || isLoggedIn === 'true') {
        // Store authentication token
        await AsyncStorage.setItem('isLoggedIn', 'true');
        navigation.navigate('Main', { 
          Name: matchingUser.fields.Name,
          role: matchingUser.fields.role,
          Profile: matchingUser.fields.Profile[0].url
        }); 

      } else {
        Alert.alert("Login failed; Invalid username or password. Please try again..");
        console.log("Invalid username or password");
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  

  
  
  return (
    <ImageBackground source={require('../Assets/NFRDIBG.png')} style={styles.background}>
        <Image  source={require('../Assets/loginIcon.png')} style={styles.loginIcon} ></Image>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
       <View style={{ width: 200, height: 80 }}>
        <Button 
            title="Sign In" 
            onPress={handleLogin} 
            color='#3388ea' 
        />
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'contain',
      justifyContent: "center",
      alignItems: "center",
      maxHeight: 1000
    },
    container: {
      width: '80%', // Adjust width as per your preference
      alignItems: 'center'
    },
    input: {
      height: 50, // Adjust the height as needed
      width: '30%', // Adjust the width as needed
      margin: 12,
      borderWidth: 2,
      padding: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 20,
     
    },
    loginIcon: {
      width: 100,
      height: 100,
      bottom: '5%'
    }
  });
