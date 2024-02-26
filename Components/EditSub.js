import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Popup } from 'react-native-windows';


const EditSub = ({
  isOpen, onClose,handleBackspace, selectedSubItem, handleDateRChange, handleLocationChange,
  handlePackingChange, handleLotChange, handleExpiryChange, handlePrevBChange,
  handleQuanRChange,handleReleasedBChange, handleCurrentBChange, handleDateUChange,
  currentDatabase, handleRefresh
}) => {
  if (!isOpen || !selectedSubItem) return null;

  const onUpdate = async () => {
    try {
      // Fetch the record ID based on the item name
      const response = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}?filterByFormula={Id}="${selectedSubItem.Id}"`, {
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
  
      
  
      // Fields common to both databases
      const commonFields = {
        "Date of Release": selectedSubItem.DateR,
        "Location": selectedSubItem.Location,
        "Packing": selectedSubItem.Packing,
        "Lot":selectedSubItem.Lot,
        "Expiry":selectedSubItem.Expiry,
        "Previous Balance":selectedSubItem.PrevB,
        "Quantity Released":selectedSubItem.QuanR,
        "Released by":selectedSubItem.ReleasedB,
        "Current Balance":selectedSubItem.CurrB,
        "Date Updated":selectedSubItem.DateU
      };
  
     
      // Perform the PATCH request with the fetched record ID
      const updateResponse = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}/${recordId}`, {
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
            <Text style={styles.Desc}>Date Released</Text>
            <TextInput
              style={styles.input}
              value={selectedSubItem.DateR}
              onChangeText={(text) => handleDateRChange(text)}
              placeholder="Date of Release..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Location</Text>
            <TextInput
              style={styles.input}
              value={selectedSubItem.Location}
              onChangeText={(text) => handleLocationChange(text)}
              placeholder="Location..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Packing</Text>
            <TextInput
              style={styles.input}
              value={selectedSubItem.Packing}
              onChangeText={(text) => handlePackingChange(text)}
              placeholder="Packing..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Lot</Text>
            <TextInput
              style={styles.input}
              value={selectedSubItem.Lot}
              onChangeText={(text) => handleLotChange(text)}
              placeholder="Lot..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Expiry</Text>
            <TextInput
              style={styles.input}
              value={selectedSubItem.Expiry}
              onChangeText={(text) => handleExpiryChange(text)}
              placeholder="Expiry..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Previous Balance</Text>
            <TextInput
             maxLength={6}
             style={styles.input}
             value={selectedSubItem.PrevB.toString()}
             onChangeText={(text) => handlePrevBChange(text)}
             onKeyPress={({ nativeEvent }) => {
               if (nativeEvent.key === 'Backspace') {
                 handleBackspace();
               }
             }}
             placeholder="Previous Balance..."
             placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Quantity Released</Text>
            <TextInput
             maxLength={6}
             style={styles.input}
             value={selectedSubItem.QuanR.toString()}
             onChangeText={(text) => handleQuanRChange(text)}
             onKeyPress={({ nativeEvent }) => {
               if (nativeEvent.key === 'Backspace') {
                 handleBackspace();
               }
             }}
             placeholder="Quantity Released..."
             placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Released By</Text>
            <TextInput
              style={styles.input}
              value={selectedSubItem.ReleasedB}
              onChangeText={(text) => handleReleasedBChange(text)}
              placeholder="Released by..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Current Balance</Text>
            <TextInput
             maxLength={6}
             style={styles.input}
             value={selectedSubItem.CurrB.toString()}
             onChangeText={(text) => handleCurrentBChange(text)}
             onKeyPress={({ nativeEvent }) => {
               if (nativeEvent.key === 'Backspace') {
                 handleBackspace();
               }
             }}
             placeholder="Current Balance..."
             placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Date Updated</Text>
            <TextInput
              style={styles.input}
              value={selectedSubItem.DateU}
              onChangeText={(text) => handleDateUChange(text)}
              placeholder="Date Updated..."
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
};

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
  }
});

export default EditSub;