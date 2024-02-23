import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableNativeFeedback } from 'react-native'
import React from 'react'
import { Popup } from 'react-native-windows';
import Icon from 'react-native-vector-icons/AntDesign'

const Delete = ({isOpen , onClose , selectedItem , currentDatabase, handleRefresh}) => {
    if (!isOpen || !selectedItem) return null;

    const onDelete = async () => {
        try {
          // Fetch the record ID based on the item name
          const response = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}?filterByFormula={Id}="${selectedItem.Id}"`, {
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
    
        if (!recordId) {
          throw new Error('Record ID not found');
        }
       
        // Perform the PATCH request with the fetched record ID
        const deleteResponse = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}/${recordId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer patuAn2pKiuFSMoI8.1ad68d143585a93ed0c2348b3ab3adb9c1f8364b814d1a9149f763b6087ef2f3',
            'Content-Type': 'application/json'
          },
        });
    
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
return (
  <Popup
    isOpen={isOpen}
    onDismiss={onClose}
    verticalOffset={30} 
    
  >
    <View style={styles.container}>
      <View>
      <Image style={styles.image} source={require('../Assets/warning_red.png')} />
      <View style={styles.TextContainer}>
      <Text style={styles.DeleteText}>
        Delete {selectedItem.Item} from {currentDatabase} ?
      </Text>
      </View>
      <View style={styles.ButtonContainer}>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Yes, Delete it</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View></View></View>
  </Popup>
)


} 

export default Delete

const styles = StyleSheet.create({
    container:{ 
        height:350,
        width: 450,// Adjust the width of the popup container
        backgroundColor: 'rgba(176, 176, 176, 0.9)',
        padding:10,
        borderRadius: 15,
     
    },
   DeleteText:{
    fontSize:20,
    fontWeight:'bold',  
    bottom:'65%'
   },
    deleteButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
      },
      deleteButton: {
        backgroundColor:'red',
        borderRadius:10,
        width:130,
        alignItems: 'center',
        position:'absolute',
        left:1  
      },
      closeButton: {
        position: 'absolute',
        left:290,
        backgroundColor:'green',
        borderRadius:10,
        width:130,
        alignItems:'center'
      },
      closeButtonText: {
        color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
      },
      image: {
        width: 100, // Adjust the width as needed (pixels or percentage)
        height: 100, // Adjust the height as needed (pixels or percentage)
        alignSelf: 'center', // Center the image horizontally within its parent container
        marginBottom: "60%", // Add some space at the bottom if needed
        right:'1%'
      },
      ButtonContainer:{
        bottom:"35%"
      },
      TextContainer:{
        height:80,
        width:"100%",
        bottom:'50%',
        marginTop:5
      }
      
      
})