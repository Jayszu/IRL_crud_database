import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, Image, TextInput } from 'react-native';
import Airtable from 'airtable';
import SearchBar from './SearchBar';
import EditTable from './EditTable';
import CreateTable from './CreateTable';
import Delete from './Delete';
import Sidebar from '../Navigation/Sidebar';
import { useNavigation } from '@react-navigation/native';
import Footer from './footer';
import CreateUser from './CreateUser';
import { useRoute } from '@react-navigation/native';



const Chemicals = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [currentDatabase, setCurrentDatabase] = useState('IRL_Chemicals'); // Default database
  const [previousDatabase, setPreviousDatabase] = useState(''); // Previous database
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // Selected item data
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [PreviousPage,setPreviousPage]= useState()
  const [ITEMS_PER_PAGE,setItemsPerPage] =useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('ASC')
  const route = useRoute();
  const { Name, Role, Profile} = route.params;

  useEffect(() => {
    fetchData();
  }, [currentPage, currentDatabase, searchQuery, sortOrder]); // Fetch data whenever currentPage, currentDatabase, or searchQuery changes

  const fetchData = async () => {
    const base = new Airtable({ apiKey: 'patG9t58PDUfG2Xhx.f87094464fa31eece79fb1868c858e94d92da3ef7157777734d1a548f54eb3e1' })
      .base('appNRC5vSBgrKCqii');
 
    try {
      const records = await base(currentDatabase).select({
        view: 'Grid view',
        filterByFormula: searchQuery ? `SEARCH("${searchQuery.toLowerCase()}", LOWER({ITEM}))` : '', 
        sort: [{ field: 'Item', direction: sortOrder === 'ASC' ? 'asc' : 'desc' }]
        
      }).all();
     
      // Calculate total pages based on the total number of records
      const totalRecordsCount = records.length;
      setTotalPages(Math.ceil(totalRecordsCount / ITEMS_PER_PAGE));
    
      
      const newData = records.map(record => ({
        Id: String(record.get('Id')),
        Item: String(record.get('Item') || ''),
        Location: String(record.get('Location') || ''),
        TotalQty: parseInt(record.get('Total Qty')), // Parses the value to a floating-point number
        Brand: String(record.get('Brand') || ''),
        Packing: String(record.get('Packing') || ''),
        DateReceived: String(record.get('Date Received') || ''),
        ExpirationDate: String(record.get('Expiration Date') || ''),
      }));

      setData(newData);
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
    
    // Navigate to the desired screen here
    navigation.navigate('ChemicalSubTables', { selectedItem, Name, Role, Profile },);

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
  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortOrder(newSortOrder);
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
  const TableHeader = () => (
    <View style={[styles.itemContainer]}>
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.Hcell, styles.headerText]}>Item</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Location</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Quantity</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Brand</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Packing</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Date Received</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Expiration Date</Text>
        <TouchableOpacity onPress={handleSortChange} >
            <View style={styles.blankcell}>
            <Image source={require('../Assets/a-z.png')} style={styles.SortIcon} />
          </View>
          </TouchableOpacity>
   
     
      </View>
    </View>
  );

   const renderItem = ({ item, index }) => {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleItemClick(item)} style={[styles.cell,styles.touchableCell]}>
          <Text style={styles.cell}>{item.Item}</Text>
        </TouchableOpacity>
        <Text style={styles.cell}>{item.Location}</Text>
        <Text style={styles.cell}>{item.TotalQty}</Text>
        <Text style={styles.cell}>{item.Brand}</Text>
        <Text style={styles.cell}>{item.Packing}</Text>
        <Text style={styles.cell}>{item.DateReceived}</Text>
        <Text style={styles.cell}>{item.ExpirationDate}</Text>
        <View style={styles.editCell}>
        <TouchableOpacity
          onPress={Role !== 'Viewer' ? () => handleEditItem(item) : null}
          style={[styles.editIcon, Role === 'Viewer' && { opacity: 0.5 }]}
          pointerEvents={Role === 'Viewer' ? 'none' : 'auto'}
        >
          <Text style={{color:'white',fontWeight:'700'}}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={Role !== 'Viewer' ? () => handleDeleteItem(item) : null}
          style={[styles.deleteIcon, Role === 'Viewer' && { opacity: 0.5 }]}
          pointerEvents={Role === 'Viewer' ? 'none' : 'auto'}
        >
          <Text style={{color:'white',fontWeight:'700'}}>Delete</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
  };
  
  
  

  return (
    <View style={styles.container}>
    
      <TouchableOpacity onPress={() => setSidebarOpen(!sidebarOpen)} style={styles.hamburgerButton}>
        <Image source={sidebarOpen ? require('../Assets/backIcon.png') : require('../Assets/menu.png')} style={styles.hamburgerIcon} />
      </TouchableOpacity>
      {sidebarOpen && <Sidebar currentDatabase={currentDatabase} Name={Name} Role={Role} Profile={Profile}/>}
  
    
      <View style={styles.contentContainer}>
        <Image
          source={require('../Assets/logo.png')} // Specify the local path to your image
          style={styles.image}
        />
        <TouchableOpacity
          onPress={Role !== 'Viewer' ? () => handleopenCreate() : null} 
          style={[styles.newRecord, Role === 'Viewer' && { opacity: 0.5 }]}
          pointerEvents={Role === 'Viewer' ? 'none' : 'auto'}
        >
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
        
        {TableHeader()}
       
        <FlatList
          data={data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + 1)}
          renderItem={({ item, index }) => renderItem({ item, index })}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text>No data available</Text>}
          ListFooterComponent={
            <View>
              <View style={styles.paginationContainer}>
                <Button onPress={goToPreviousPage} title="Previous" disabled={currentPage === 1} />
                <Text style={styles.paginationText}>{currentPage}/{totalPages}</Text>
                <Button onPress={goToNextPage} title="Next" disabled={currentPage === totalPages} />
              </View>
              <View style={styles.itemPerPageContainer}>
                <TouchableOpacity onPress={() => {
                  if (ITEMS_PER_PAGE > 1) {
                    setItemsPerPage(ITEMS_PER_PAGE - 1);
                  }
                }}>
                  <Text style={styles.adjustButton}>{'\u00AB   '}</Text>
                </TouchableOpacity>
                <Text style={styles.itemPerPageText}> Show</Text>
                <TextInput
                  style={styles.textInput}
                  value={String(ITEMS_PER_PAGE)} // Convert to string as TextInput expects string value
                  keyboardType="numeric"
                  onChangeText={(value) => {
                    // Check if the value is empty or contains a valid number
                    if (value === '' || !isNaN(parseInt(value))) {
                      // If the value is empty, set items per page to 0
                      // Otherwise, update items per page with the new value
                      setItemsPerPage(value === '' ? 0 : parseInt(value));
                    }
                  }}
                />
                <Text style={styles.itemPerPageText2}>  Entries</Text>
                <TouchableOpacity onPress={() => setItemsPerPage(ITEMS_PER_PAGE + 1)}>
                  <Text style={styles.adjustButton2}>{' \u00BB'}</Text>
                </TouchableOpacity>
             
              </View>    
            </View>
           
          }
          
        />
         <Footer />
        <EditTable
          isOpen={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          handleBackspace={handleBackspace}
          selectedItem={selectedItem}
          handleItemChange={handleItemChange}
          handleLocationChange={handleLocationChange}
          
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
    </View>
    
  );
  
        };  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    position: 'relative',

  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#439176',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: '5%',
  },
  hamburgerButton: {
    position: 'absolute', 
    top: 20, 
    left: 20, 
    zIndex: 1, 
  },
  
    SearchBarContainer: {
      bottom:'15%',
      justifyContent:'flex-end',
      alignItems: 'flex-end', 
      flexDirection:'row',
     flex:1,
   
 
    },
    itemContainer: {
      borderWidth: 2,
      borderColor: '#000000',
      marginBottom: 5,
      backgroundColor: "black",
      position: 'relative'
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
      borderBottomWidth: 2,
      borderBottomColor: '#CCCCCC',
      paddingVertical: 10,
      width: '100%', 
      paddingHorizontal: '5%',
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
      color:"black"
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
      marginRight: '5%',
      bottom:'-20%'
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
      flex:1,
    },
    Hcell: {
      color: "white",
      width: '100%',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 15,
    },
    disabledText: {
      color: '#F2ECEC',
    },
    SearchBar: {
     
      width: '30%', 
      height: 60,
      bottom: 10,
    },
    noItemText: {
      fontSize: 100,
    },
    editIcon: {
      padding: 5,
      backgroundColor: '#E8AC13',
      borderRadius: 3,
      marginLeft: 10, // Add some spacing between the edit and delete buttons
    },
    deleteIcon: {
      padding: 5,
      backgroundColor: '#BA0505',
      borderRadius: 3,
      marginLeft: 10, // Add some spacing between the edit and delete buttons
    },
    editCell: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    blankcell: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '6%', 
    },
    newRecord: {
      backgroundColor: '#3488ea',
      width: '7%', 
      top: 55,
      left: '5%', 
      height: 30,
      justifyContent: 'center',
      borderRadius: 5
    },
    NewRText: {
      fontWeight: 'bold',
      fontSize: 15,
      marginLeft: 2
    },
    image: {
      position: 'absolute',
      top: 0,
      left: '50%',
      width: 100,
      height: 100,
      resizeMode: 'cover',
    },
    dbNavigation:{
      flex:1
    },
    databaseOption:{
      flexDirection:'row',
      justifyContent:'space-between',
      right:'80%',
      bottom:"-20%"
      
    }, touchableCell:{
      color:'black'
    },
    itemPerPageContainer:{
      flexDirection:'row',
      bottom:'3%',
      
    },
    itemPerPageText:{
      color:'black',
      fontWeight:"500",
      top:'0.3%',
     
    },
    itemPerPageText2:{
      color:'black',
      fontWeight:'500',
      top:'0.4%',
      
    },
    adjustButton:{
      color:'#F4ECEC',
      bottom:'12%',
      fontSize:25,
      fontWeight:'bold',
      marginRight:'0.3%'
    },
    adjustButton2:{
      color:"#F4ECEC",
      fontSize:25,
      bottom:"12%",
      fontWeight:'bold'
    },
    textInput:{
      width:'3%',
      height:'80%',
      marginLeft:'0.3%',
      
    },
    
    hamburgerIcon: {
      width: 30,
      height: 30,
    },
    SortIcon:{
      tintColor:'white',
      width: 30,
      height: 30,
    }
  });
  


export default Chemicals;
