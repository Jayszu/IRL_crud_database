import { View, Text, StyleSheet, TouchableOpacity,TextInput} from 'react-native';
import React from 'react';
import { Popup } from 'react-native-windows';

const CreateTable = ({ isOpen, onClose }) => {
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
        <Text style={styles.NewRText}>New Record</Text>
        <View style ={styles.fieldscontainer}>
        <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Item</Text>
              <TextInput
                style={styles.input}
                placeholder="Item Name..."
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Location..."
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Description..."
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Total Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="Total Quantity..."
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Brand</Text>
              <TextInput
                style={styles.input}
                placeholder="Brand..."
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Packing</Text>
              <TextInput
                style={styles.input}
                placeholder="Packing..."
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Date Received</Text>
              <TextInput
                style={styles.input}
                placeholder="Date Received..."
              />
              </View>
              <View style={styles.fieldContainer}>
              <Text style={styles.Desc}>Expiration Date</Text>
              <TextInput
                style={styles.input}
                placeholder="Expiration Date    ..."
              />
              </View>
              </View>
          <TouchableOpacity style={styles.PostButton}>
            <Text style={styles.PostButtonText}>Create Record</Text>
          </TouchableOpacity>
      </View>
    </Popup>
  );
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
});

export default CreateTable;
