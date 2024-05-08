import { View, Text, StyleSheet, TouchableOpacity,TextInput, Alert, Modal} from 'react-native';
import React from 'react';
import { Popup } from 'react-native-windows';
import { useState,useEffect } from 'react';

const CreateUser = ({ isOpen, onClose, currentDatabase,handleRefresh }) => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [name, SetName] = useState('');
  const [showRolePopup, setShowRolePopup] = useState(false);


  
  const closeState = () =>{
    setEmail('');
    setUsername('');
    setPassword('');
    setRole('');
    SetName('');
    setShowRolePopup(false); 
  }

  const handleCreateRecord = async () => {
        try {
                if (!email || !username || !password || !role || !name) {
                Alert.alert('All fields are required');
                return; 
                }

      const fields = {
        Email: email,
        Username: username,
        Password: password,
        Role:role,
        Name: name
      
      };
  
      const postResponse = await fetch(`https://api.airtable.com/v0/appjSsMo3NZ8iJPHL/${currentDatabase}/`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer patG9t58PDUfG2Xhx.f87094464fa31eece79fb1868c858e94d92da3ef7157777734d1a548f54eb3e1',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: fields
        })
      });
      
    
      
      if (!postResponse.ok) {
          const errorData = await postResponse.json();
          const errorMessage = errorData.error.message || 'Failed to create record';
          throw new Error(errorMessage);
      }
         //refresg
         handleRefresh();
          closeState();
         // Close the popup
         onClose();
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  return (
    <Popup
    isOpen={isOpen} onDismiss={onClose} 
    verticalOffset={40}
    >
      <View style={styles.container}>
      <TouchableOpacity onPress={() => {
      onClose();
      closeState();}}
       style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.NewRText}>New User</Text>
        <View style ={styles.fieldscontainer}>
        <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email..."
                placeholderTextColor='white'
                value={email}
                onChangeText={setEmail}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Username..."
                placeholderTextColor='white'
                value={username}
              onChangeText={setUsername}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password..."
                placeholderTextColor='white'
                value={password}
              onChangeText={setPassword}
              />
              </View>
              <View  style={styles.fieldContainer}> 
              <Text style={styles.Desc}>Roles</Text>
              <TouchableOpacity onPress={() => setShowRolePopup(true)} style={styles.inputContainer}>
                <Text style={styles.input}>{role || 'Select Role...'}</Text>
                <Text style={styles.arrow}>&#9660;</Text>
                </TouchableOpacity>
          {showRolePopup && (
            <Popup isOpen={showRolePopup} onDismiss={() => setShowRolePopup(false)} verticalOffset={75}horizontalOffset={170}>
              <View style={styles.popupContainer}>
                <TouchableOpacity onPress={() => { setRole('Viewer'); setShowRolePopup(false); }} style={styles.roleOption}>
                  <Text style={styles.roleOptionText}>Viewer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setRole('Editor'); setShowRolePopup(false); }} style={styles.roleOption}>
                  <Text style={styles.roleOptionText}>Editor</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setRole('Admin'); setShowRolePopup(false); }} style={styles.roleOption}>
                  <Text style={styles.roleOptionText}>Admin</Text>
                </TouchableOpacity>
              </View>
            </Popup>
             )}   
          </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Namaewa</Text>
              <TextInput
                style={styles.input}
                placeholder="Name..."
                placeholderTextColor='white'
                value={name}
              onChangeText={SetName}
              />
              </View>
              </View>
          <TouchableOpacity onPress={handleCreateRecord}style={styles.PostButton}>
            <Text style={styles.PostButtonText}>Create Record</Text>
          </TouchableOpacity>
      </View>
    </Popup>
  )
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 600, // Set a maximum height
    width: 800,
    backgroundColor: 'rgba(102, 102, 102, 1)',
    padding: 20,
    borderRadius: 25,
    position: 'relative',
    overflow: 'scroll', // Allow scrolling if content exceeds max height
  },
  newRecord: {
    backgroundColor: '#32FDFE',
    width: 90,
    top: 55,
    left: 80,
    height: 30,
    justifyContent: 'center',
  },
  NewRText: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontWeight: 'bold',
    fontSize: 20,
    color:'white'
  },
  Desc:{
    fontWeight:'700'
  },
  Fieldtext:{ 
    fontWeight:'700'
},
fieldscontainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: 20,
},
fieldContainer: {
  width: "48%", // Adjust based on your preference
  marginBottom: 10,
},
input: {
  height: 40,
  width: "100%", // Adjust the width of the text field
  paddingHorizontal: 10,
  borderRadius: 15,
  justifyContent: "center",
  backgroundColor:"#1F1B1A",
  color:'white'
},
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: '#D11111',
      fontSize: 18,
      fontWeight: 'bold',
  },
  PostButton: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  PostButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warning: {
    color: 'red',
    fontSize: 12,
  },
  popupContainer:{
    backgroundColor:"white",
    width:300
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F1B1A',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingRight:20,
    height: 40,
  },
  arrow: {
    color: 'white',
  },
});

export default CreateUser;