import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Popup } from 'react-native-windows';
import Icon from 'react-native-vector-icons/AntDesign'

const DeleteUser = ({isOpen , onClose , selectedUser , currentDatabase, handleRefresh}) => {
  const [confirmation,setConfirmation] = useState('')
    if (!isOpen || !selectedUser) return null;
   
    const onDelete = async () => {
      if (confirmation !== 'CONFIRM') {
        alert('Wrong Input. Please type "CONFIRM" to proceed with deletion. ');
        return;
      }
        try {
          // Fetch the record ID based on the item name
          const response = await fetch(`https://api.airtable.com/v0/appjSsMo3NZ8iJPHL/${currentDatabase}?filterByFormula={Id}="${selectedUser.Id}"`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer patG9t58PDUfG2Xhx.f87094464fa31eece79fb1868c858e94d92da3ef7157777734d1a548f54eb3e1',
              'Content-Type': 'application/json'
            }
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch record ID');
          }
          const data = await response.json();
    
        // Check if data.records is truthy and has at least one element
        const recordId = data.records && data.records.length > 0 ? data.records[0].id : null;
    
        if (!recordId) {
          throw new Error('Record ID not found');
        }
       
        // Perform the PATCH request with the fetched record ID
        const deleteResponse = await fetch(`https://api.airtable.com/v0/appjSsMo3NZ8iJPHL/${currentDatabase}/${recordId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer patG9t58PDUfG2Xhx.f87094464fa31eece79fb1868c858e94d92da3ef7157777734d1a548f54eb3e1',
            'Content-Type': 'application/json'
          },
        });
        setConfirmation('');
        if (!deleteResponse.ok) {
          const errorData = await updateResponse.json();    
          const errorMessage = errorData.error.message || 'Failed to delete record';
          throw new Error(errorMessage);
        }
    
        //Refresh
        handleRefresh();
        onClose();


        }
        
        catch (error) {
            console.error('Error updating record:', error);
            // Handle error (e.g., show error message to the user)
    }
}
const onCancel = () => {
  // Reset confirmation state on cancel
  setConfirmation('');
  // Close the popup
  onClose();
};

return (
  <Popup isOpen={isOpen} onDismiss={onClose} verticalOffset={30}>
    <View style={styles.container}>
      <Image style={styles.image} source={require('../Assets/warning_red.png')} />
      <Text style={styles.DeleteText}>Delete {selectedUser.Username} from {currentDatabase}?</Text>
      <TextInput
          style={styles.input}
          placeholder="Type 'CONFIRM' to delete"
          onChangeText={text => setConfirmation(text)}
          value={confirmation}
        />
      <View style={styles.ButtonContainer}>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Yes, Delete it</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Popup>
);
};

export default DeleteUser

const styles = StyleSheet.create({
  container: {
    height: 350,
    width: 450,
    backgroundColor: 'rgba(102, 102, 102, 0.9)',
    padding: 10,
    borderRadius: 15,
  },
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: "auto",
  },
  DeleteText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontWeight: 'bold', // Adding bold font weight
    textAlign: 'center', // Aligning text to start from the middle
    width:'70%',
    alignSelf:'center'

  },
  
});
    