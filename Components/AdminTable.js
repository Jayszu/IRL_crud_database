import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image} from 'react-native';
import Airtable from 'airtable';
import { useNavigation } from '@react-navigation/native';

const AdminTable = ({ route }) => {
  const [data, setData] = useState([]);
  const [currentDatabase] =useState('Records')
  const navigation = useNavigation();
  const { Name, role, Profile } = route.params;
  const handlegoBack =() =>{
    console.log('gone back')
    navigation.navigate('Main', {Name, role, Profile });
    
  };


  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async () => {
    const base = new Airtable({ apiKey: 'patuAn2pKiuFSMoI8.1ad68d143585a93ed0c2348b3ab3adb9c1f8364b814d1a9149f763b6087ef2f3' })
    .base('appjSsMo3NZ8iJPHL');

    try {
      const records = await base(currentDatabase).select({
      }).all();


      const newData = records.map(record => ({
        Email: String(record.get('Email')),
        Username: String(record.get('username')),
        Password: String(record.get('password') ),
        Role: String(record.get('role')),
        Name: String(record.get('Name')),
        Profile: record.get('Profile') ? record.get('Profile')[0].url : null,
      }));

      setData(newData);
    } catch (err) {
      console.error(err);
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text>{item.Email}</Text>
      <Text>{item.Username}</Text>
      <Text>{item.Password}</Text>
      <Text>{item.Role}</Text>
      <Text>{item.Name}</Text>
      <Image
        source={{ uri: item.Profile }} 
        style={styles.Profile}
      />
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      <TouchableOpacity onPress={handlegoBack} style={styles.GoBack}>
      <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.Email}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  Profile:{
    width:15,
    height:15
  }
});

export default AdminTable;
