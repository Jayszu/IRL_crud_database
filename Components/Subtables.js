import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const SubTables = ({ route }) => {
  const { selectedItem } = route.params;
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigation();

  const goBackClick =()=>{
    navigation.navigate('Main')
  }
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.airtable.com/v0/appzQzVWNYXH8WNks/${selectedItem.Item}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer patuAn2pKiuFSMoI8.1ad68d143585a93ed0c2348b3ab3adb9c1f8364b814d1a9149f763b6087ef2f3',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();

        // Extract necessary fields from the response data
        const formattedData = data.records.map(record => ({
          id: record.id,
          DateR: record.fields['Date of Release'],
          Packing: record.fields['Packing'],
          Location: record.fields['Location'],
          Lot: record.fields['Lot'],
          Expiry: record.fields['Expiry'],
          PrevB: record.fields['Previous Balance'],
          QuanR: record.fields['Quantity Released'],
          ReleasedB: record.fields['Released By'],
          CurrB: record.fields['Current Balance'],
          DateU: record.fields['Date Updated'],
        }));

        setTableData(formattedData);
       

      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderTable = () => {
    return (
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.header]}>Date Released</Text>
          <Text style={[styles.cell, styles.header]}>Location</Text>
          <Text style={[styles.cell, styles.header]}>Packing</Text>
          <Text style={[styles.cell, styles.header]}>Brand</Text>
          <Text style={[styles.cell, styles.header]}>Lot</Text>
          <Text style={[styles.cell, styles.header]}>Expiry</Text>
          <Text style={[styles.cell, styles.header]}>Previous Balance</Text>
          <Text style={[styles.cell, styles.header]}>Quantity Released</Text>
          <Text style={[styles.cell, styles.header]}>Released By</Text>
          <Text style={[styles.cell, styles.header]}>Current Balance</Text>
          <Text style={[styles.cell, styles.header]}>Date Updated</Text>

        </View>
        {tableData.map((rowData, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.cell}>{rowData.DateR}</Text>
            <Text style={styles.cell}>{rowData.Location}</Text>
            <Text style={styles.cell}>{rowData.Packing}</Text>
            <Text style={styles.cell}>{rowData.Lot}</Text>
            <Text style={styles.cell}>{rowData.Expiry}</Text>
            <Text style={styles.cell}>{rowData.PrevB}</Text>
            <Text style={styles.cell}>{rowData.QuanR}</Text>
            <Text style={styles.cell}>{rowData.ReleasedB}</Text>
            <Text style={styles.cell}>{rowData.CurrB}</Text>
            <Text style={styles.cell}>{rowData.DateU}</Text>
           
          </View>
        ))}
      </View>
    );
  };

 

  return (
    <View style={styles.container}>
      {renderTable()}
      <TouchableOpacity onPress={goBackClick} style={[styles.cell, styles.touchableCell]}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    width: '100%',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  touchableCell: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
});

export default SubTables;
