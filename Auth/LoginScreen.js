import React, { useState,useEffect} from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ImageBackground, Image, ActivityIndicator, Text,Linking,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Airtable from 'airtable';

const LoginScreen = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State variable to track loading
  const navigation = useNavigation();
  const [currentDatabase, setCurrentDatabase] = useState('Records');
  const handleImagePress = () => {
    // The URL you want to open
    const websiteUrl = 'https://jays-organization-14.gitbook.io/crud_database/';
    
    // Open the website URL in the default browser
    Linking.openURL(websiteUrl);
  };
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        const userName = await AsyncStorage.getItem('userName');
        const userRole = await AsyncStorage.getItem('userRole');
        const userProfile = await AsyncStorage.getItem('userProfile');
  
        // User is already logged in, navigate to the main screen with user information
        navigation.navigate('Main', { 
          Name: userName,
          Role: userRole,
          Profile: userProfile
        });
      }
    };
  
    checkLoginStatus();
  }, []);
  

  
  const handleLogin = async () => {
    setLoading(true); // Set loading state to true when login process starts
    try {
      const base = new Airtable({ apiKey: 'patG9t58PDUfG2Xhx.f87094464fa31eece79fb1868c858e94d92da3ef7157777734d1a548f54eb3e1' })
      .base('appjSsMo3NZ8iJPHL');
      const userRecords = await base(currentDatabase).select({ view: 'Grid view' }).all();
      const lowercaseUsername = Username.toLowerCase();
  
      const matchingUser = userRecords.find(record => record.fields.Username.toLowerCase() === lowercaseUsername && record.fields.Password === Password);
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  
  
      if (matchingUser) {
        // Store login status in AsyncStorage
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('userName', matchingUser.fields.Name);
      await AsyncStorage.setItem('userRole', matchingUser.fields.Role);
      await AsyncStorage.setItem('userProfile', matchingUser.fields.Profile[0].url);
  
        navigation.navigate('Main', { 
          Name: matchingUser.fields.Name,
          Role: matchingUser.fields.Role,
          Profile: matchingUser.fields.Profile[0].url
        });
      } else {
        Alert.alert("Login failed; Invalid username or password. Please try again..");
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert("Error logging in. Please try again later.");
    } finally {
      setLoading(false); // Set loading state to false after login process completes
    }
  };
  

  return (
    <ImageBackground source={require('../Assets/NFRDIBG.png')} style={styles.background}>
      <Image  source={require('../Assets/loginIcon.png')} style={styles.loginIcon} />
      <TouchableOpacity onPress={handleImagePress}>
        <Image source={require('../Assets/info.png')} style={styles.infoIcon} />
      </TouchableOpacity>
      <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={Username}
        onChangeText={(text) => setUsername(text)}
        onSubmitEditing={() => { passwordInput.focus(); }}
      />
      <TextInput
        ref={(input) => { passwordInput = input; }}
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={Password}
        onChangeText={(text) => setPassword(text)}
        onSubmitEditing={handleLogin} 
      />
        <View style={{ width: 200, height: 80 }}>
          <Button 
            title="Sign In" 
            onPress={handleLogin} 
            color='#3388ea' 
            disabled={loading}
          />
        </View>
        {loading && <ActivityIndicator size="large" color="#3388ea" />}
        {loading && <Text>Loading...</Text>} 
      </View>
    </ImageBackground>
  );
}

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
  },
  infoIcon:{
    height:30,
    width:30,
    right:'48%',
    bottom:300
  }
});

export default LoginScreen;
