import React,{useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import { Popup } from 'react-native-windows';


const EditUsers = ({
  isOpen, onClose, selectedUser, handleEmailChange, handleUsernameChange,
  handlePasswordChange,handleRoleChange,handleNameChange,handleRefresh,currentDatabase
}) => {
  if (!isOpen || !selectedUser) return null;

  const [showRolePopup, setShowRolePopup] = useState(false);

  const onUpdate = async () => {
    try {
      if (!selectedUser.Email || !selectedUser.Username || !selectedUser.Password || !selectedUser.Role || !selectedUser.Name) {
      Alert.alert('All fields are required');
      return; 
      }
      // Fetch the record ID based on the item name
      const response = await fetch(`https://api.airtable.com/v0/appjSsMo3NZ8iJPHL/${currentDatabase}?filterByFormula={Id}="${selectedUser.Id}"`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer patuAn2pKiuFSMoI8.1ad68d143585a93ed0c2348b3ab3adb9c1f8364b814d1a9149f763b6087ef2f3',
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch record ID');
      }
  
      const data = await response.json();
  
      // Check if data.records is truthy and has at least one element
      const recordId = data.records && data.records.length > 0 ? data.records[0].id : null;
  
      console.log(currentDatabase)
      if (!recordId) {
        throw new Error('Record ID not found');
      }
  
      
  
      // Fields common to both databases
      const commonFields = {
       "Email": selectedUser.Email,
       "Username": selectedUser.Username,
       "Password": selectedUser.Password,
       "Role": selectedUser.Role,
       "Name": selectedUser.Name,

       
      };
  
     
      // Perform the PATCH request with the fetched record ID
      const updateResponse = await fetch(`https://api.airtable.com/v0/appjSsMo3NZ8iJPHL/${currentDatabase}/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer patuAn2pKiuFSMoI8.1ad68d143585a93ed0c2348b3ab3adb9c1f8364b814d1a9149f763b6087ef2f3',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "fields": commonFields,
        })
      });
  
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        const errorMessage = errorData.error.message || 'Failed to update record';
        throw new Error(errorMessage);
      }
  
      //Refresh
      handleRefresh();
      onClose();

    } catch (error) {
      console.error('Error updating record:', error);
      // Handle error (e.g., show error message to the user)
    }
  };
  
  
  

  return (
    <Popup
      isOpen={isOpen}
      onDismiss={onClose}
      verticalOffset={40} // Adjust as needed
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.editItemText}>Edit Item</Text>
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Email</Text>
            <TextInput
              style={styles.input}
              value={selectedUser.Email}
              onChangeText={(text) => handleEmailChange(text)}
              placeholder="Email..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Username</Text>
            <TextInput
              style={styles.input}
              value={selectedUser.Username}
              onChangeText={(text) => handleUsernameChange(text)}
              placeholder="Username..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Password</Text>
            <TextInput
              style={styles.input}
              value={selectedUser.Password}
              onChangeText={(text) => handlePasswordChange(text)}
              placeholder="Password..."
              placeholderTextColor='white'
            />
          </View>
          <View  style={styles.fieldContainer}> 
              <Text style={styles.Desc}>Roles</Text>
              <TouchableOpacity onPress={() => setShowRolePopup(true)} style={styles.inputContainer}>
                <Text style={styles.input}>{selectedUser.Role || 'Select Role...'}</Text>
                <Text style={styles.arrow}>&#9660;</Text>
                </TouchableOpacity>
          {showRolePopup && (
            <Popup isOpen={showRolePopup} onDismiss={() => setShowRolePopup(false)} verticalOffset={75}horizontalOffset={170}>
              <View style={styles.popupContainer}>
                <TouchableOpacity onPress={() => { handleRoleChange('Viewer'); setShowRolePopup(false); }} style={styles.roleOption}>
                  <Text style={styles.roleOptionText}>Viewer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { handleRoleChange('Editor'); setShowRolePopup(false); }} style={styles.roleOption}>
                  <Text style={styles.roleOptionText}>Editor</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { handleRoleChange('Admin'); setShowRolePopup(false); }} style={styles.roleOption}>
                  <Text style={styles.roleOptionText}>Admin</Text>
                </TouchableOpacity>
              </View>
            </Popup>
             )}   
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Name</Text>
            <TextInput
              style={styles.input}
              value={selectedUser.Name}
              onChangeText={(text) => handleNameChange(text)}
              placeholder="Name..."
              placeholderTextColor='white'
            />
          </View>
        </View>
        <TouchableOpacity onPress={onUpdate} style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </Popup>
  );
}
const styles = StyleSheet.create({
  container: {
    maxHeight: 600,
    width: 800,
    backgroundColor: 'rgba(102, 102, 102, 1)',
    padding: 20,
    borderRadius: 25,
    position: 'relative',
    overflow: 'scroll',
  },
  fieldsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  fieldContainer: {
    width: "48%",
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#D11111',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editItemText: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontWeight: 'bold',
    fontSize: 20,
  },
  input: {
    height: 40,
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 15,
    justifyContent: "center",
    backgroundColor: "#1F1B1A",
    color: 'white'
  },
  updateButton: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  Desc: {
    fontWeight: '700'
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
  popupContainer:{
    backgroundColor:"white",
    width:300
  },
});

export default EditUsers;