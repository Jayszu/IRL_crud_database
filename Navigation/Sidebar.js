import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Sidebar = ({ switchDatabase, currentDatabase }) => {
  return (
    <View style={styles.sidebarContainer}>
     
      <TouchableOpacity
        style={[
          styles.databaseOption,
          currentDatabase === 'IRL_Lab_Supplies' ? styles.activeDatabase : null,
        ]}
        onPress={() => switchDatabase('IRL_Lab_Supplies')}
      >
        <Text style={styles.databaseOptionText}>Lab Supplies</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.databaseOption,
          currentDatabase === 'IRL_Chemicals' ? styles.activeDatabase : null,
        ]}
        onPress={() => switchDatabase('IRL_Chemicals')}
      >
        <Text style={styles.databaseOptionText}>Chemicals</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    backgroundColor: '#3b5998', // Adjust background color as needed
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    width:'15%'
  },
  databaseOption: {
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft:'30%',
   

  },
  databaseOptionText: {
    color: 'white',
    fontSize: 16,

  },
  activeDatabase: {
    backgroundColor: '#4267B2', // Adjust active background color as needed
  },
});

export default Sidebar;
