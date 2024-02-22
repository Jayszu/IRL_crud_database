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
      const fields = {
        Item: item,
        Location: location,
        'Total Qty': totalQuantity,
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
          'Authorization': 'Bearer patuAn2pKiuFSMoI8.1ad68d143585a93ed0c2348b3ab3adb9c1f8364b814d1a9149f763b6087ef2f3',
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
                value={item}
                onChangeText={setItem}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Location..."
                value={location}
              onChangeText={setLocation}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Description..."
                value={description}
              onChangeText={setDescription}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Total Quantity</Text>
              <TextInput
                maxLength={6}
                style={styles.input}
                placeholder="Total Quantity.Please Only Put numerical value(eg.1000 not 1 thousand)"
                value={totalQuantity}
                onChangeText={(text) => {
                  // Remove any non-numeric characters from the input
                  const numericValue = text.replace(/[^0-9]/g, '');
                  // Update the state with the cleaned numeric value
                  setTotalQuantity(parseInt(numericValue));
                }}
              />
           
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Brand</Text>
              <TextInput
                style={styles.input}
                placeholder="Brand..."
                value={brand}
              onChangeText={setBrand}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Packing</Text>
              <TextInput
                style={styles.input}
                placeholder="Packing..."
                value={packing}
              onChangeText={setPacking}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Date Received</Text>
              <TextInput
                style={styles.input}
                placeholder="Date Received..."
                value={dateReceived}
              onChangeText={setDateReceived}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Expiration Date</Text>
              <TextInput
                style={styles.input}
                placeholder="Expiration Date..."
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
    height: 680,
    width: 800,
    backgroundColor: 'rgba(199, 199, 199, 0.8)',
    padding: 20,
    borderRadius: 25,
    position: 'relative',
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
  },
  Desc:{
    fontWeight:'700'
  },
  Fieldtext:{ 
    fontWeight:'700'
},
fieldscontainer:{
    marginTop:20
},
fieldContainer:{
    marginBottom:10
},
input:{
    height: 40,
    width: '100%', // Adjust the width of the text field
    paddingHorizontal: 10,
    borderRadius:15,
    justifyContent:'center'
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