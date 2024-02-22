import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Airtable from 'airtable';
import TitleHeader from './TitleHeader';
import SearchBar from './SearchBar';
import EditTable from './EditTable';
import CreateTable from './CreateTable';
import Delete from './Delete';

import { useNavigation } from '@react-navigation/native';



const ITEMS_PER_PAGE = 10; // Number of items to fetch per page

const Main = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState('');
  const [currentDatabase, setCurrentDatabase] = useState('IRL_Lab_Supplies'); // Default database
  const [previousDatabase, setPreviousDatabase] = useState(''); // Previous database
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // Selected item data
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [PreviousPage,setPreviousPage]= useState()
  

  useEffect(() => {
    fetchData();
  }, [currentPage, currentDatabase, searchQuery]); // Fetch data whenever currentPage, currentDatabase, or searchQuery changes

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
        Id: String(record.get('Id')),
        Item: String(record.get('Item') || ''),
        Location: String(record.get('Location') || ''),
        Description: String(record.get('Description') || ''),
        TotalQty: parseInt(record.get('Total Qty')), // Parses the value to a floating-point number
        Brand: String(record.get('Brand') || ''),
        Packing: String(record.get('Packing') || ''),
        DateReceived: String(record.get('Date Received') || ''),
        ExpirationDate: String(record.get('Expiration Date') || ''),
      }));

      // Add header as the first item in the data array
      const dataWithHeader = [
        {
          Item: 'Item',
          Location: 'Location',
          Description: 'Description',
          TotalQty: "Total Qty",
          Brand: 'Brand',
          Packing: 'Packing',
          DateReceived: 'Date Received',
          ExpirationDate: 'Expiration Date',
        },
        ...newData,
      ];
  
      setData(dataWithHeader);
    } catch (err) {
      console.error(err);
    }
  };

  const switchDatabase = (newDatabase) => {
    setPreviousDatabase(currentDatabase);
    setCurrentDatabase(newDatabase);
  };

  const goBackToPreviousDatabase = () => {
    setCurrentDatabase(previousDatabase);
    setPreviousDatabase('');
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
  
  
  
  const handleBackspace = () => {
    setSelectedItem(prevState => ({
      ...prevState,
      TotalQty: prevState.TotalQty.slice(0, -1) // Remove the last character
    }));
  };
  

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  };

  const handleopenCreate = () => {
    setCreateModalVisible(true);
  };

  const handleItemChange = (text) => {
    setSelectedItem(prevItem => ({ ...prevItem, Item: text }));
  };

  const handleLocationChange = (text) => {
    setSelectedItem(prevItem => ({ ...prevItem, Location: text }));
  };

  const handleDescriptionChange = (text) => {
    setSelectedItem(prevItem => ({ ...prevItem, Description: text }));
  };

  const handleTotalQtyChange = (text) => {
    // Allow backspace or if the input is a valid number
    if (text === '' || /^\d+$/.test(text)) {
      const intValue = text === '' ? '' : parseInt(text); // Parse to integer
      setSelectedItem(prevState => ({
        ...prevState,
        TotalQty: intValue
      }));
    }
  };
  const handleItemClick = (selectedItem) => {
    console.log(`${selectedItem.Item} is clicked and should now go to the subtable which contains the releasing data`);
    // Navigate to the desired screen here
    navigation.navigate('Subtables', { selectedItem },);

  };
  
  
  

  const handleBrandChange = (text) => {
    setSelectedItem(prevItem => ({ ...prevItem, Brand: text }));
  };

  const handlePackingChange = (text) => {
    setSelectedItem(prevItem => ({ ...prevItem, Packing: text }));
  };

  const handleDateRChange = (text) => {
    setSelectedItem(prevItem => ({ ...prevItem, DateReceived: text }));
  };

  const handleExpDChange = (text) => {
    setSelectedItem(prevItem => ({ ...prevItem, ExpirationDate: text }));
  };

  const handleRefresh = () => {
    setEditModalVisible(false);
    setCreateModalVisible(false);
    setDeleteModalVisible(false);
    fetchData();
    
  };
  
  const DatabaseHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerOptions}>
        <View style={styles.SearchBar}>
          <SearchBar onSearch={handleSearch} setCurrentPage={setCurrentPage}/>
        </View>
        <TouchableOpacity
          disabled={currentDatabase === 'IRL_Inventory' || !previousDatabase}
          onPress={goBackToPreviousDatabase}
        >
          <Text
            style={[
              styles.goBackText,
              (currentDatabase === 'IRL_Inventory' || !previousDatabase) ? styles.disabledText : null,
            ]}
          >
            Inventory
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={currentDatabase === 'IRL_Chemicals'}
          onPress={() => switchDatabase('IRL_Chemicals')}
        >
          <Text
            style={[
              styles.showOtherDatabaseText,
              currentDatabase === 'IRL_Chemicals' ? styles.disabledText : null,
            ]}
          >
            Chemicals
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => {
    // Check if it's the header row
    if (index === 0) {
      return (
        <View style={[styles.itemContainer]}>
          <View style={[styles.row, styles.header]}>
            {/* Render different content for header cells */}
            <Text style={[styles.Hcell, styles.headerText]}>Item</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Location</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Quantity</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Brand</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Packing</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Date DateReceived</Text>
            <Text style={[styles.Hcell, styles.headerText]}>Expiration Date</Text>
            <View style={styles.blankcell}></View>
          </View>
        </View>
      );
    }
  
    // Render "No item found" text if there are no items
    if (data.length === 1) {
      return (
        <View style={[styles.row, { justifyContent: 'center', paddingVertical: 10 }]}>
          <Text style={styles.noItemText}>No item found</Text>
        </View>
      );
    }
  
    // Render other items in the list
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleItemClick(item)} style={[styles.cell, styles.touchableCell]}>
          <Text>{item.Item}</Text>
        </TouchableOpacity>
        <Text style={styles.cell}>{item.Location}</Text>
        <Text style={styles.cell}>{item.TotalQty}</Text>
        <Text style={styles.cell}>{item.Brand}</Text>
        <Text style={styles.cell}>{item.Packing}</Text>
        <Text style={styles.cell}>{item.DateReceived}</Text>
        <Text style={styles.cell}>{item.ExpirationDate}</Text>
        <View style={styles.editCell}>
          <TouchableOpacity onPress={() => handleEditItem(item)} style={styles.editIcon}>
            <Text style={{color:'white',fontWeight:'700'}}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteItem(item)} style={styles.deleteIcon}>
            <Text style={{color:'white',fontWeight:'700'}}>Delete</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  };
  
  
  

  return (
    <View style={styles.container}>
      <TitleHeader />
      <TouchableOpacity onPress={handleopenCreate} style={styles.newRecord}>
        <Text style={styles.NewRText}>New Record</Text>
      </TouchableOpacity>
      {DatabaseHeader()}
      <CreateTable 
        currentDatabase ={currentDatabase}
        isOpen={createModalVisible}
        onClose={() => setCreateModalVisible(false)} 
        handleRefresh={handleRefresh}
        setCurrentPage={setCurrentPage}
        
      />
          <FlatList
      data={data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + 1)}
      renderItem={({ item, index }) => renderItem({ item, index })}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={
        <View style={styles.paginationContainer}>
          <Button onPress={goToPreviousPage} title="Previous" disabled={currentPage === 1} />
          <Text style={styles.paginationText}>{currentPage}/{totalPages}</Text>
          <Button onPress={goToNextPage} title="Next" disabled={currentPage === totalPages} />
        </View>
      }
    />
      <EditTable
      handleBackspace={handleBackspace}
        isOpen={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        selectedItem={selectedItem}
        handleItemChange={handleItemChange}
        handleLocationChange={handleLocationChange}
        handleDescriptionChange={handleDescriptionChange}
        handleTotalQtyChange={handleTotalQtyChange}
        handleBrandChange={handleBrandChange}
        handlePackingChange={handlePackingChange}
        handleDateRChange={handleDateRChange}
        handleExpDChange={handleExpDChange}
        handleRefresh={handleRefresh}
        currentDatabase={currentDatabase}
      />
      <Delete
        isOpen={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        selectedItem={selectedItem}
        currentDatabase={currentDatabase}
        handleRefresh={handleRefresh}
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
    paddingHorizontal: 10,
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 5,
    backgroundColor: "black",
    position:'relative'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
    color: "white",
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 10,
    width: '90%',
    marginLeft: 70,
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
  headerContainer: {
    flexDirection: 'row',
    left:1,
    alignItems: 'center',
    height: 50,
    marginBottom: 10,
  },
  headerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  showOtherDatabaseText: {
    fontWeight: 'bold',
    marginRight: 10,
    color: 'black',
    fontSize: 20,
  },
  goBackText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
  },
  Hcell: {
    color: "white",
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  switchDatabase: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledText: {
    color: '#F2ECEC',
  },
  SearchBar: {
    left: 1200,
    width: 200,
    height: 60
  },
  noItemText: {
    fontSize: 100,
  },
  editIcon: {
    padding: 5,
    backgroundColor: '#E8AC13',
    borderRadius: 3,
  },
  deleteIcon:{
    padding:5,
    backgroundColor:'#BA0505',
    borderRadius:3
  },
  editCell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    flexDirection:'row'
  },
  blankcell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:95
  },
  newRecord:{
    backgroundColor:'#32FDFE',
    width:90,
    top:55,
    left:80,
    height:30,
    justifyContent:'center',
    borderRadius:5
  },
  NewRText:{
    fontWeight:'bold',
    fontSize:15,
    marginLeft:2
  }
});

export default Main;