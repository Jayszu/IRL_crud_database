import { View, Text, StyleSheet, TouchableOpacity,TextInput, } from 'react-native';
import React from 'react';
import { Popup,ScrollView, ScrollViewBase } from 'react-native-windows';
import { useState,useEffect } from 'react';

const CreateSub = ({ isOpen, onClose,handleRefresh,selectedItem }) => {
  const [dateR, setDateR] = useState();
  const [location, setLocation] = useState('');
  const [packing, setPacking] = useState('');
  const [brand, setBrand] = useState('');
  const [currentDatabase] = useState(selectedItem);
  const [lot, setLot] = useState('');
  const [expiry, setExpiry] = useState('');
  const [prevBalance, setPrevBalance] = useState('');
  const [quantityR, setQuantityR] = useState('');
  const [releasedBy, setReleasedB] = useState('');
  const [currentB, setCurrentB] = useState('');
  const [dateUpdated, setdateUpdated] = useState('');
 console.log(currentDatabase)
  const closeState = () =>{
    setDateR('');
    setLocation('');
    setPacking('');
    setBrand('');
    setLot('');
    setExpiry('');
    setPrevBalance('');
    setQuantityR('');
    setReleasedB('');
    setCurrentB('');
    setdateUpdated('');
  }

  const handleCreateSub = async () => {
    try {
      const fields = {
        'Date of Release': dateR,
        Location: location,
        Packing: packing,
        Brand: brand,
        Lot: lot,
        Expiry: expiry,
        'Previous Balance': prevBalance,
        'Quantity Release': quantityR,
        'Released by': releasedBy, 
        'Current Balance': currentB, 
        'Date Updated': dateUpdated, 
      };
  

      const postResponseItem = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${currentDatabase}/`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer patuAn2pKiuFSMoI8.1ad68d143585a93ed0c2348b3ab3adb9c1f8364b814d1a9149f763b6087ef2f3',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: fields
        })
      });
      
    
      
      if (!postResponseItem.ok) {
          const errorData = await postResponseItem.json();
          const errorMessage = errorData.error.message || 'Failed to create record';
          throw new Error(errorMessage);
      }
         //refresg
        
          closeState();
         // Close the popup
         onClose();
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  return (
    <Popup isOpen={isOpen} onDismiss={onClose} verticalOffset={40}>
        <ScrollView style={{height:600}} keyboardShouldPersistTaps="handled">
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
              <Text style={styles.Desc}>Date of Release</Text>
              <TextInput
                style={styles.input}
                placeholder="Date Released..."
                value={dateR}
                onChangeText={setDateR}
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
              <Text style={styles.Desc}>Packing</Text>
              <TextInput
                style={styles.input}
                placeholder="Packing..."
                value={packing}
              onChangeText={setPacking}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Brand</Text>
              <TextInput
                style={styles.input}
                placeholder="Brand"
                value={brand}
                onChangeText={setBrand}
              />
           
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Lot</Text>
              <TextInput
                style={styles.input}
                placeholder="Lot..."
                value={lot}
              onChangeText={setLot}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Expiry</Text>
              <TextInput
                style={styles.input}
                placeholder="Expiry..."
                value={expiry}
              onChangeText={setExpiry}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Previous Balance</Text>
              <TextInput
                style={styles.input}
                placeholder="Previous Balance..."
                value={prevBalance}
              onChangeText={setPrevBalance}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Quantity Released</Text>
              <TextInput
                style={styles.input}
                placeholder="Quantity Released..."
                value={quantityR}
              onChangeText={setQuantityR}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Released by</Text>
              <TextInput
                style={styles.input}
                placeholder="Released By..."
                value={releasedBy}
              onChangeText={setReleasedB}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Current Balance</Text>
              <TextInput
                style={styles.input}
                placeholder="Current Balance..."
                value={currentB}
              onChangeText={setCurrentB}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Date Updated</Text>
              <TextInput
                style={styles.input}
                placeholder="Date Updated..."
                value={dateUpdated}
              onChangeText={setdateUpdated}
              />
              </View>   
              </View>
          <TouchableOpacity onPress={handleCreateSub} style={styles.PostButton}>
            <Text style={styles.PostButtonText}>Create Record</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
    </Popup>
  )
};

const styles = StyleSheet.create({
  container: {
    height: 880,
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

export default CreateSub;