import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Airtable from 'airtable';
import Header from './Components/Header';
import SearchBar from './Components/SearchBar';
import { Popup } from 'react-native-windows';
import EditTable from './Components/EditTable';

const ITEMS_PER_PAGE = 15; // Number of items to fetch per page

const App = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentDatabase, setCurrentDatabase] = useState('IRL_Lab_Supplies'); // Default database
  const [previousDatabase, setPreviousDatabase] = useState(''); // Previous database
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // Selected item data
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, currentDatabase, searchQuery]); // Fetch data whenever currentPage, currentDatabase, or searchQuery changes

  const fetchData = async () => {
    const base = new Airtable({ apiKey: '' })
      .base('');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
      const records = await new Promise((resolve, reject) => {
        const fetchedRecords = [];
        base(currentDatabase).select({
          maxRecords: ITEMS_PER_PAGE,
          view: 'Grid view',
          offset: offset,
          filterByFormula: searchQuery ? `SEARCH("${searchQuery.toLowerCase()}", LOWER({ITEM}))` : '', // Apply case-insensitive search query if provided
        }).eachPage((pageRecords, fetchNextPage) => {
          fetchedRecords.push(...pageRecords);
          fetchNextPage();
        }, (err) => {
          if (err) reject(err);
          else resolve(fetchedRecords);
        });
      });

      const newData = records.map(record => ({
        Item: String(record.get('Item') || ''),
        Location: String(record.get('Location') || ''),
        Description: String(record.get('Description') || ''),
        TotalQty: String(record.get('Total Qty')),
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

      // Calculate total pages based on the total number of records
      const totalRecords = await base(currentDatabase).select({}).firstPage();
      const totalRecordsCount = totalRecords.length;
      setTotalPages(Math.ceil(totalRecordsCount / ITEMS_PER_PAGE));
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
    setCurrentPage(1); // Reset to the first page when performing a new search
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditModalVisible(true);
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
    setSelectedItem(prevItem => ({ ...prevItem, TotalQty: text }));
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

  const handleUpdate = () => {
    // Update item in your data source (e.g., Airtable)
    // Close the edit modal
    setEditModalVisible(false);
    // Refresh data after update
    fetchData();
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerOptions}>
        <View style={styles.SearchBar}>
          <SearchBar onSearch={handleSearch} />
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
    // Render header only for the first item in the list
    if (index === 0) {
      return (
        <View style={[styles.itemContainer]}>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.Hcell, styles.headerText]}>{item.Item}</Text>
            <Text style={[styles.Hcell, styles.headerText]}>{item.Location}</Text>
            <Text style={[styles.Hcell, styles.headerText]}>{item.TotalQty}</Text>
            <Text style={[styles.Hcell, styles.headerText]}>{item.Brand}</Text>
            <Text style={[styles.Hcell, styles.headerText]}>{item.Packing}</Text>
            <Text style={[styles.Hcell, styles.headerText]}>{item.DateReceived}</Text>
            <Text style={[styles.Hcell, styles.headerText]}>{item.ExpirationDate}</Text>
            <View style={styles.blankcell}>
            </View>
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
        <Text style={styles.cell}>{item.Item}</Text>
        <Text style={styles.cell}>{item.Location}</Text>
        <Text style={styles.cell}>{item.TotalQty}</Text>
        <Text style={styles.cell}>{item.Brand}</Text>
        <Text style={styles.cell}>{item.Packing}</Text>
        <Text style={styles.cell}>{item.DateReceived}</Text>
        <Text style={styles.cell}>{item.ExpirationDate}</Text>
        <View style={styles.editCell}>
          <TouchableOpacity onPress={() => handleEditItem(item)} style={styles.editIcon}>
            {/* Replace 'Edit' with your actual edit icon */}
            <Text style={{color:'white',fontWeight:'700'}}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      {renderHeader()}
      <FlatList
        data={data}
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
        handleUpdate={handleUpdate}
        currentDatabase={currentDatabase}
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
    paddingTop: 10,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginBottom: 30,
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
  editCell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
   
  },
  blankcell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default App;
