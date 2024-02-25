import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TitleHeader from './TitleHeader';
import CreateSub from './CreateSub';
import SearchBar from './SearchBar';
import EditTable from './EditTable';
import Delete from './Delete';
import Airtable from 'airtable';

const ITEMS_PER_PAGE = 10;

const SubTables = ({ route }) => {
  const { selectedItem, setSelectedItem } = route.params;
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentDatabase, setCurrentDatabase] = useState(`${selectedItem.Item}`);
  const [PreviousPage,setPreviousPage]= useState()
  const [searchQuery, setSearchQuery] = useState('');
  const [ITEMS_PER_PAGE, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, [currentPage,currentDatabase,searchQuery]);
  const fetchData = async () => {
  const base = new Airtable({ apiKey: 'patuAn2pKiuFSMoI8.1ad68d143585a93ed0c2348b3ab3adb9c1f8364b814d1a9149f763b6087ef2f3' })
  .base('appzQzVWNYXH8WNks');

try {
  const records = await base(currentDatabase).select({
    view: 'Grid view',
    filterByFormula: searchQuery ? `SEARCH("${searchQuery.toLowerCase()}", LOWER({ITEM}))` : '', 
    
  }).all();

  // Calculate total pages based on the total number of records
  const totalRecordsCount = records.length;
  setTotalPages(Math.ceil(totalRecordsCount / ITEMS_PER_PAGE));

        const newData = records.map(record => ({
      
          DateR: String(record.get('Date of Release')),
          Packing: String(record.get('Packing') || ''),
          Brand: String(record.get('Brand') || ''),
          Location: String(record.get('Location') || ''),
          Lot: String(record.get('Lot') || ''),
          Expiry: (record.get('Expiry')), // Parses the value to a floating-point number
          PrevB: parseInt(record.get('Previous Balance') || ''),
          QuanR: parseInt(record.get('Quantity Released') || ''),
          ReleasedB: String(record.get('Released by') || ''),
          CurrB: parseInt(record.get('Current Balance') || ''),
          DateU: String(record.get('Date Updated') || ''),
          
        }));
        const dataWithHeader = [
          {
            DateR: 'Date of Release',
            Packing: 'Packing',
            Brand: 'Brand',
            Location: "Location",
            Lot: 'Lot',
            Expiry: 'Expiry',
            PrevB: 'Previous Balance',
            QuanR: 'Quantity Released',
            ReleasedB: 'Released by',
            CurrB: 'Current Balance',
            DateU: 'Date Updated',
          },
          ...newData,
        ];

        setData(dataWithHeader);
      
      } catch (err) {
        console.error(err);
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

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
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
    setSearchQuery(query);
    // Only reset the current page if a search query is provided
    if (query) {
      // Set the currentPage to its previous value if it's not already 1
      if (currentPage !== 1) {
        setPreviousPage((prevPage) => {
          // Store the previous page value in a variable
          const previousPage = prevPage;
          // Reset the currentPage to 1
          setCurrentPage(currentPage);
        if ({goToPreviousPage})
          return previousPage;
        console.log(previousPage)
        });
      }
    }
  };

  const handlegoBack =() =>{
    console.log('gone back')
    navigation.navigate('Main');
    
  };
  const DatabaseHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerOptions}>
      <View style={styles.itemPerPageContainer}>
      <TouchableOpacity onPress={() => {
  if (ITEMS_PER_PAGE > 1) {
    setItemsPerPage(ITEMS_PER_PAGE - 1);
  }
}}>
          <Text style={styles.adjustButton}>{'\u00AB'}</Text>
        </TouchableOpacity>
          <Text style={[styles.itemPerPageText, { marginRight:5, marginLeft:5 }]}> Items per Page: {ITEMS_PER_PAGE} </Text>
          <TouchableOpacity onPress={() => setItemsPerPage(ITEMS_PER_PAGE + 1)}>
          <Text style={styles.adjustButton}>{'\u00BB'}</Text>
          </TouchableOpacity>
        </View>
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
            <View style={styles.blankcell}></View>
          </View>
        </View>
      );
    }
    // Render "No item found" text if there are no items
    if (data.length === 0) {
      return (
        <View style={[styles.row, { justifyContent: 'center', paddingVertical: 10 }]}>
          <Text style={styles.noItemText}>No item found</Text>
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
      data={data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + 1)}
      renderItem={({ item, index }) => renderItem({ item, index })}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={<Text>No data available</Text>}
      ListFooterComponent={
        <View style={styles.paginationContainer}>
          <Button onPress={goToPreviousPage} title="Previous" disabled={currentPage === 1} />
          <Text style={styles.paginationText}>{currentPage}/{totalPages}</Text>
          <Button onPress={goToNextPage} title="Next" disabled={currentPage === totalPages} />
        </View>
      }
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
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationText: {
    marginHorizontal: 10,
    fontSize: 16,
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
  },
  blankcell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '8%', // Use percentage for margin
  },
  itemPerPageContainer:{
    flexDirection:'row',
    borderWidth:2,
    backgroundColor:'#D1CDCC',
    width:"15%",
    marginLeft:"15%",
    top:"20%"
  },
  itemPerPageText:{
    color:'black'
  },
  adjustButton:{
    color:'black'

  }
});

export default SubTables;
