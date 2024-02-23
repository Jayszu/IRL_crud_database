import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TitleHeader from './TitleHeader';
import CreateSub from './CreateSub';
import SearchBar from './SearchBar';
import EditTable from './EditTable';
import Delete from './Delete';


const SubTables = ({ route }) => {
  const { selectedItem, setSelectedItem } = route.params;
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

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
        const formattedData = data.records.map(record => ({
          DateR: record.fields['Date of Release'],
          Packing: record.fields['Packing'],
          Location: record.fields['Location'],
          Lot: record.fields['Lot'],
          Expiry: record.fields['Expiry'],
          PrevB: record.fields['Previous Balance'],
          QuanR: record.fields['Quantity Released'],
          ReleasedB: record.fields['Released by'],
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
  

  const handleRefresh = () => {
    setEditModalVisible(false);
    setCreateModalVisible(false);
    setDeleteModalVisible(false);
    fetchData();
    
  };
  const handleopenCreate = () => {
    setCreateModalVisible(true);
  };

  const handleEditItem = (rowData) => {
    setSelectedItem(rowData);
    setEditModalVisible(true);
  };

  const handleDeleteItem = (rowData) => {
    setSelectedItem(rowData);
    setDeleteModalVisible(true);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleSearch = (query) => {
  return null;
  };
  const handlegoBack =() =>{
    console.log('gone back')
    navigation.navigate('Main');
    
  };
  const DatabaseHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerOptions}>
        <View style={styles.SearchBarContainer}>
          <SearchBar onSearch={handleSearch} setCurrentPage={setCurrentPage} style={styles.SearchBar}/>
        </View>
        </View>
    </View>
  );

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <View style={[styles.itemContainer]}>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.Hcell, styles.headerText]}>Date Released</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Location</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Packing</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Lot</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Expiry</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Previous Balance</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Quantity Released</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Released by</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Current Balance</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Date Updated</Text>
            
          </View>
        </View>
      );
    }
   
      return (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.DateR}</Text>
          <Text style={styles.cell}>{item.Location}</Text>
          <Text style={styles.cell}>{item.Packing}</Text>
          <Text style={styles.cell}>{item.Lot}</Text>
          <Text style={styles.cell}>{item.Expiry}</Text>
          <Text style={styles.cell}>{item.PrevB}</Text>
          <Text style={styles.cell}>{item.QuanR}</Text>
          <Text style={styles.cell}>{item.ReleasedB}</Text>
          <Text style={styles.cell}>{item.CurrB}</Text>
          <Text style={styles.cell}>{item.DateU}</Text>
          <View style={styles.editCell}>
            <TouchableOpacity onPress={() => handleEditItem(item)} style={styles.editIcon}>
              <Text style={{ color: 'white', fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteItem(item)} style={styles.deleteIcon}>
              <Text style={{ color: 'white', fontWeight: '700' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
  
  return (
    <View style={styles.container}>
      <Image
        source={require('../Assets/logo.png')} // Specify the local path to your image
        style={styles.image}
      />
      <TouchableOpacity onPress={handlegoBack} style={styles.GoBack}>
      <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleopenCreate} style={styles.newRecord}>
        <Text style={styles.NewRText}>New Record</Text>
      </TouchableOpacity>
      {DatabaseHeader()}
      <CreateSub
        isOpen={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        handleRefresh={handleRefresh}
        setCurrentPage={setCurrentPage}
        selectedItem={selectedItem.Item}
      />

<FlatList
  data={tableData.slice(0, 10)} // Slice the tableData array to include items from index 0 to 9
  renderItem={({ item, index }) => renderItem({ item, index })}
  keyExtractor={(item, index) => index.toString()}
  ListEmptyComponent={<Text>No data available</Text>} // Add this to see if there's any issue with data retrieval
/>




<EditTable
     
        isOpen={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      />
      <Delete
        isOpen={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#439176',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: '5%', // Use percentage for padding
    
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 10,
    width: '100%', // Use percentage for width
    paddingHorizontal: '5%', // Use percentage for horizontal padding
    position: 'relative'
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: "black",
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: 'white',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: '50%', // Use percentage for left position
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  newRecord: {
    backgroundColor: '#32FDFE',
    width: '7%', // Use percentage for width
    top: 55,
    left: '5%', // Use percentage for left position
    height: 30,
    justifyContent: 'center',
    borderRadius: 5,
    alignItems:'center'
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 5,
    backgroundColor: "black",
    position: 'relative'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginBottom: 10,
  },
  headerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: '5%', // Use percentage for margin
    bottom:'20%'
  },
  SearchBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: 10,
  },
  Hcell: {
    color: "white",
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
    color: "white",
    textAlign: 'center',
  },
  editIcon: {
    padding: 5,
    backgroundColor: '#E8AC13',
    borderRadius: 3,
  },
  deleteIcon: {
    padding: 5,
    backgroundColor: '#BA0505',
    borderRadius: 3
  },
  editCell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    flexDirection: 'row'
  },
  NewRText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 2
  },
  goBackText:{
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 2,
    color:"#E5021A"
  },
  GoBack:{
    backgroundColor: 'white',
    width: '5%', // Use percentage for width
    top:'2%',
    left: '-5%', // Use percentage for left position
    height: 30,
    justifyContent: 'center',
    borderRadius: 5,
    alignItems:'center'
  }
});

export default SubTables;
