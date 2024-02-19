import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Popup } from 'react-native-windows';

const Delete = ({isOpen , onClose , selectedItem , currentDatabase, handleRefresh}) => {
    if (!isOpen || !selectedItem) return null;

    const onDelete = async () => {
        try {
          // Fetch the record ID based on the item name
          const response = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}?filterByFormula={Id}="${selectedItem.Id}"`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer pato2uM4jlfP6sYN2.f7f7d5f628bd62cc66d9d5e91faf58f4f2e161fe72027e4ba343bcd3b74a40bb',
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
        console.log(recordId);
        // Perform the PATCH request with the fetched record ID
        const deleteResponse = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}/${recordId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer pato2uM4jlfP6sYN2.f7f7d5f628bd62cc66d9d5e91faf58f4f2e161fe72027e4ba343bcd3b74a40bb',
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
    verticalOffset={40} // Adjust as needed
    >
        <View style={styles.container}>
            <View><Text>
              <Text>
                WARNING
              </Text>
            <Text style={styles.WarningText}> Are you sure you want to delete <Text style={{color:'green'}}>{selectedItem.Item}</Text>  from {currentDatabase} ?</Text>
    </Text>
            </View>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        </View>
  </Popup>
  )
} 

export default Delete

const styles = StyleSheet.create({
    container:{
        height: 200,
        width: 450, // Adjust the width of the popup container
        backgroundColor: 'rgba(199, 199, 199, 1)',
        padding: 20,
        borderRadius: 25,
  
        justifyContent:"flex-start"
        
        
    },
    WarningText:{
        fontWeight:'bold',
        color:'#FF0909',
        fontSize:20,
        marginLeft:30   
    
    },
    ItemText:{
        color:'green',
        fontWeight:'bold',
        fontSize:20,
        marginLeft:130,
        position:'absolute',
        top:25  
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
      },
      deleteButton: {
        backgroundColor:'red',
      borderRadius:10,
        top:155,
        width:130,
        alignItems: 'center',
        position:'absolute',
        left:20
      },
      closeButton: {
        position: 'absolute',
        top: 155,
        left:300,
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
})