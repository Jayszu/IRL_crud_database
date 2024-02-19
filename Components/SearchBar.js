import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';

const SearchBar = ({ onSearch , setCurrentPage}) => {
  const [searchText, setSearchText] = useState('');
  const handlePress =() =>{
    setSearchText('');
    setCurrentPage(1);
    
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchText);
    }, 300); // Adjust the delay as needed
    return () => clearTimeout(timeoutId);
  }, [searchText, onSearch,setCurrentPage]);

  return (
    
    <View style={styles.container}>
        
      <TextInput
        placeholder="Search..."
        style={styles.input}
        placeholderTextColor="#A9A9A9"
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity onPress={handlePress}
    >
        <Image
          source={require('../Assets/bin.png')} 
          style={styles.clearIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: 'black',
  },
  clearIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
});

export default SearchBar;