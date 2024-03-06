import { View, Text, StyleSheet, TouchableOpacity,TextInput, } from 'react-native';
import React from 'react';
import { Popup,ScrollView } from 'react-native-windows';
import { useState,useEffect } from 'react';




const CreateSubChem = ({ isOpen, onClose,handleRefresh,selectedItem }) => {
  const [dateR, setDateR] = useState();
  const [itemNo, setItemNo] = useState('');
  const [packing, setPacking] = useState('');
  const [brand, setBrand] = useState('');
  const [currentDatabase] = useState(selectedItem);
  const [lot, setLot] = useState('');
  const [expiry, setExpiry] = useState('');
  const [catalogue, setCatalogue] = useState('');
  const [prevBalance, setPrevBalance] = useState('');
  const [quantityR, setQuantityR] = useState('');
  const [releasedBy, setReleasedB] = useState('');
  const [currentB, setCurrentB] = useState('');
  const [dateUpdated, setdateUpdated] = useState('');
 
  

  const closeState = () =>{
    setDateR('');
    setItemNo('');
    setBrand('');
    setPacking('');
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
        'Item & CAS No.': itemNo,
        Packing: packing,
        Brand: brand,
        "Lot / Batch #": lot,
        'Catalogue No.': itemNo,
        'Expiry/ Retest': expiry,
        'Previous Balance': prevBalance,
        'Quantity Released': quantityR,
        'Released by': releasedBy, 
        'Current Balance': currentB, 
        'Date Updated': dateUpdated, 
      };
  

      const postResponseItem = await fetch(`https://api.airtable.com/v0/appNRC5vSBgrKCqii/${currentDatabase}/`, {
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
     
      <TouchableOpacity onPress={onClose}
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
                placeholderTextColor='white'
                value={dateR}
                onChangeText={setDateR}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Item & Cas No.</Text>
              <TextInput
                style={styles.input}
                placeholder="Item & Cas No..."
                placeholderTextColor='white'
                value={itemNo}
              onChangeText={setItemNo}
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
              <Text style={styles.Desc}>Brand</Text>
              <TextInput
                style={styles.input}
                placeholder="Brand"
                placeholderTextColor='white'
                value={brand}
                onChangeText={setBrand}
              />
           
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Lot</Text>
              <TextInput
                style={styles.input}
                placeholder="Lot..."
                placeholderTextColor='white'
                value={lot}
              onChangeText={setLot}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Expiry</Text>
              <TextInput
                style={styles.input}
                placeholder="Expiry..."
                placeholderTextColor='white'
                value={expiry}
              onChangeText={setExpiry}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Catalogue</Text>
              <TextInput
                style={styles.input}
                placeholder="Catalogue..."
                placeholderTextColor='white'
                value={catalogue}
              onChangeText={setCatalogue}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Previous Balance</Text>
              <TextInput
                style={styles.input}
                placeholder="Previous Balance..."
                placeholderTextColor='white'
                value={prevBalance}
                onChangeText={(text) => {
                  // Remove any non-numeric characters from the input
                  const balanceValue = text.replace(/[^0-9]/g, '');
                  // Update the state with the cleaned numeric value
                  setPrevBalance(parseInt(balanceValue));
                }}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Quantity Released</Text>
              <TextInput
                style={styles.input}
                placeholder="Quantity Released..."
                placeholderTextColor='white'
                value={quantityR}
                onChangeText={(text) => {
                  // Remove any non-numeric characters from the input
                  const quantityValue = text.replace(/[^0-9]/g, '');
                  // Update the state with the cleaned numeric value
                  setQuantityR(parseInt(quantityValue));
                }}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Released by</Text>
              <TextInput
                style={styles.input}
                placeholder="Released By..."
                placeholderTextColor='white'
                value={releasedBy}
              onChangeText={setReleasedB}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Current Balance</Text>
              <TextInput
                style={styles.input}
                placeholder="Current Balance..."
                placeholderTextColor='white'
                value={currentB}
                onChangeText={(text) => {
                  // Remove any non-numeric characters from the input
                  const currValue = text.replace(/[^0-9]/g, '');
                  // Update the state with the cleaned numeric value
                  setCurrentB(parseInt(currValue));
                }}
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Date Updated</Text>
              <TextInput
                style={styles.input}
                placeholder="Date Updated..."
                placeholderTextColor='white'
                value={dateUpdated}
              onChangeText={setdateUpdated}
              />
              </View>   
              </View>
          <TouchableOpacity onPress={handleCreateSub} style={styles.PostButton}>
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
    color:"white"
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
  backgroundColor:'#1F1B1A',
  color:'white',
  
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

export default CreateSubChem;