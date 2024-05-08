import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Popup } from 'react-native-windows';


const EditTable = ({
  isOpen, onClose, selectedItem,
  handleItemChange, handleLocationChange,
  handleTotalQtyChange, handleBrandChange,
  handlePackingChange, handleDateRChange,
  handleExpDChange, handleDescriptionChange,
  currentDatabase, handleRefresh,handleBackspace
}) => {
  if (!isOpen || !selectedItem) return null;

  const onUpdate = async () => {
    try {
      // Fetch the record ID based on the item name
      const response = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}?filterByFormula={Id}="${selectedItem.Id}"`, {
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
  
      
  
      // Fields common to both databases
      const commonFields = {
        "Item": selectedItem.Item,
        "Location": selectedItem.Location,
        "Total Qty": selectedItem.TotalQty,
        "Packing": selectedItem.Packing,
        "Brand": selectedItem.Brand,
        "Date Received": selectedItem.DateReceived,
        "Expiration Date": selectedItem.ExpirationDate,
      };
  
      // Include the "Description" field only if the currentDatabase is not 'IRL_Chemicals'
      const fields = currentDatabase !== 'IRL_Chemicals' ? {
        ...commonFields,
        "Description": selectedItem.Description,
      } : commonFields;
  
      // Perform the PATCH request with the fetched record ID
      const updateResponse = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer patG9t58PDUfG2Xhx.f87094464fa31eece79fb1868c858e94d92da3ef7157777734d1a548f54eb3e1',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "fields": fields,
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
      verticalOffset={40}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.editItemText}>Edit Item</Text>
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Item</Text>
            <TextInput
              style={styles.input}
              value={selectedItem.Item}
              onChangeText={(text) => handleItemChange(text)}
              placeholder="Item Name..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Location</Text>
            <TextInput
              style={styles.input}
              value={selectedItem.Location}
              onChangeText={(text) => handleLocationChange(text)}
              placeholder="Location..."
              placeholderTextColor='white'
            />
          </View>
          {currentDatabase !== 'IRL_Chemicals' && (
            <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Description</Text>
              <TextInput
                style={styles.input}
                value={selectedItem.Description}
                onChangeText={(text) => handleDescriptionChange(text)}
                placeholder="Description..."
                placeholderTextColor='white'
              />
            </View>
          )}
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Total Quantity</Text>
            <TextInput
              maxLength={6}
              style={styles.input}
              value={selectedItem.TotalQty.toString()}
              onChangeText={(text) => handleTotalQtyChange(text)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace();
                }
              }}
              placeholder="Total Quantity..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Brand</Text>
            <TextInput
              style={styles.input}
              value={selectedItem.Brand}
              onChangeText={(text) => handleBrandChange(text)}
              placeholder="Brand..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Packing</Text>
            <TextInput
              style={styles.input}
              value={selectedItem.Packing}
              onChangeText={(text) => handlePackingChange(text)}
              placeholder="Packing..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Date Received</Text>
            <TextInput
              style={styles.input}
              value={selectedItem.DateReceived}
              onChangeText={(text) => handleDateRChange(text)}
              placeholder="Date Received..."
              placeholderTextColor='white'
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Desc}>Expiration Date</Text>
            <TextInput
              style={styles.input}
              value={selectedItem.ExpirationDate}
              onChangeText={(text) => handleExpDChange(text)}
              placeholder="Expiration Date..."
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

export default EditTable;