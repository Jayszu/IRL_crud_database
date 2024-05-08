import { View, Text, StyleSheet, TouchableOpacity,TextInput } from 'react-native';
import React from 'react';
import { Popup } from 'react-native-windows';
import { useState,useEffect } from 'react';

const CreateTable = ({ isOpen, onClose, currentDatabase,handleRefresh }) => {
  const [item, setItem] = useState();
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  
  const [brand, setBrand] = useState('');
  const [packing, setPacking] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const closeState = () =>{
    setItem('');
    setLocation('');
    setDescription('');
    setTotalQuantity('');
    setBrand('');
    setPacking('');
    setDateReceived('');
    setExpirationDate('');
  }

  const handleCreateRecord = async () => {
    try {
      const totalQtyValue = totalQuantity !== '' ? parseInt(totalQuantity) : null;
      
      const fields = {
        Item: item,
        Location: location,
        'Total Qty': totalQtyValue !== null ? totalQtyValue : 0,
        Brand: brand,
        Packing: packing,
        'Date Received': dateReceived,
        'Expiration Date': expirationDate
      };
  
      
      if (currentDatabase !== 'IRL_Chemicals') {
        fields.Description = description;
      }
  
      const postResponse = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}/`, {
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
    <Popup isOpen={isOpen} onDismiss={onClose} verticalOffset={40}>
      <View style={styles.container}>
      <TouchableOpacity onPress={() => {
      onClose();
      closeState();}}
       style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.NewRText}>New Record</Text>
        <View style ={styles.fieldscontainer}>
        <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Item</Text>
              <TextInput
                style={styles.input}
                placeholder="Item Name..."
                placeholderTextColor='white'
                value={item}
                onChangeText={setItem}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Location..."
                placeholderTextColor='white'
                value={location}
              onChangeText={setLocation}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Description..."
                placeholderTextColor='white'
                value={description}
              onChangeText={setDescription}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Total Quantity</Text>
              <TextInput
                maxLength={6}
                style={styles.input}
                placeholder="Total Quantity(e.g. 1, 200)"
                placeholderTextColor='white'
                value={totalQuantity !== null ? totalQuantity.toString() : ''}
                onChangeText={(text) => {
                    // Remove any non-numeric characters from the input
                    const numericValue = text.replace(/[^0-9]/g, '');
                    // Update the state with the cleaned numeric value
                    setTotalQuantity(numericValue !== '' ? parseInt(numericValue) : null);
                }}
            />
           
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Brand</Text>
              <TextInput
                style={styles.input}
                placeholder="Brand..."
                placeholderTextColor='white'
                value={brand}
              onChangeText={setBrand}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Packing</Text>
              <TextInput
                style={styles.input}
                placeholder="Packing..."
                placeholderTextColor='white'
                value={packing}
              onChangeText={setPacking}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Date Received</Text>
              <TextInput
                style={styles.input}
                placeholder="Date Received..."
                placeholderTextColor='white'
                value={dateReceived}
              onChangeText={setDateReceived}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Expiration Date</Text>
              <TextInput
                style={styles.input}
                placeholder="Expiration Date..."
                placeholderTextColor='white'
                value={expirationDate}
              onChangeText={setExpirationDate}
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
});

export default CreateTable;