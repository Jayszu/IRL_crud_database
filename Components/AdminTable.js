import React, { useState, useEffect, Suspense } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image} from 'react-native';
import Airtable from 'airtable';
import { useNavigation } from '@react-navigation/native';
import EditUsers from './EditUsers';
import DeleteUser from './DeleteUser';
import CreateUser from './CreateUser';
import Sidebar from '../Navigation/Sidebar';

const AdminTable = ({ route }) => {
  const [data, setData] = useState([]);
  const [currentDatabase] =useState('Records')
  const navigation = useNavigation();
  const [sortOrder, setSortOrder] = useState('ASC')
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { Name, Role, Profile } = route.params;

  const [passwordVisibility, setPasswordVisibility] = useState({});

  const togglePasswordVisibility = (index) => {
    setPasswordVisibility(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  

  const handlegoBack =() =>{
    console.log('gone back')
    navigation.navigate('Main', {Name, Role, Profile });
    
  };


  useEffect(() => {
    fetchData();
  }, [sortOrder]); 

  const fetchData = async () => {
    const base = new Airtable({ apiKey: 'patG9t58PDUfG2Xhx.f87094464fa31eece79fb1868c858e94d92da3ef7157777734d1a548f54eb3e1' })
    .base('appjSsMo3NZ8iJPHL');

    try {
      const records = await base(currentDatabase).select({
        sort: [{ field: 'Id', direction: sortOrder === 'ASC' ? 'asc' : 'desc' }]
      }).all();


      const newData = records.map(record => ({
        Id: String(record.get('Id')),
        Email: String(record.get('Email')),
        Username: String(record.get('Username')),
        Password: String(record.get('Password') ),
        Role: String(record.get('Role')),
        Name: String(record.get('Name')),
        Profile: record.get('Profile') ? record.get('Profile')[0].url : null,
      }));

      setData(newData);
    } catch (err) {
      console.error(err);
    }
  };
  const handleopenCreate = () => {
    setCreateModalVisible(true);
  };

  const handleEditItem = (item) => {
    setSelectedUser(item);
    setEditModalVisible(true);
  };
  const handleDeleteItem = (item) => {
    
    setSelectedUser(item);
    setDeleteModalVisible(true);
  };
  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortOrder(newSortOrder);
  };

  //edit table params
  const handleEmailChange = (text) => {
    setSelectedUser(prevItem => ({ ...prevItem, Email: text }));
  };
  const handleUsernameChange = (text) => {
    setSelectedUser(prevItem => ({ ...prevItem, Username: text }));
  };
  const handlePasswordChange = (text) => {
    setSelectedUser(prevItem => ({ ...prevItem, Password: text })); 
  };
  const handleRoleChange = (text) => {
    setSelectedUser(prevItem => ({ ...prevItem, Role: text }));
  };
  const handleNameChange = (text) => {
    setSelectedUser(prevItem => ({ ...prevItem, Name: text }));
  };
  const handleProfileChange = (text) => {
    setSelectedUser(prevItem => ({ ...prevItem, Profile: text }));
  };


  const handleRefresh = () => {
    setEditModalVisible(false);
    setCreateModalVisible(false);
    setDeleteModalVisible(false);
    fetchData();
    
  };

  const TableHeader = () => (
    <View style={[styles.itemContainer]}>
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.Hcell, styles.headerText]}>Id</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Email</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Username</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Password</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Role</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Name</Text>
        <Text style={[styles.Hcell, styles.headerText]}>Profile</Text>
        <TouchableOpacity onPress={handleSortChange}>
        <View style={styles.sortIconContainer}>
          <Image source={require('../Assets/a-z.png')} style={styles.SortIcon} />
        </View>
      </TouchableOpacity>
      </View>
    </View>
  );
  

  const renderItem = ({ item,index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.Id}</Text>
      <Text style={styles.cell}>{item.Email}</Text>
      <Text style={styles.cell}>{item.Username}</Text>
      <TouchableOpacity
            style={styles.cell}
            onPress={() => togglePasswordVisibility(index)}
            activeOpacity={1}
          >
            <Text style={styles.passwordText}>
              {passwordVisibility[index] ? item.Password : '*'.repeat(item.Password.length)}
            </Text>
          </TouchableOpacity>
      <Text style={styles.cell}>{item.Role}</Text>
      <Text style={styles.cell}>{item.Name}</Text>
      <View style={styles.cell}>
        <Image source={{ uri: item.Profile }} style={styles.Profile} />
      </View>
      <View style={styles.editCell}>
        <TouchableOpacity
          onPress={Role !== 'Viewer' ? () => handleEditItem(item) : null}
          style={[styles.editIcon, Role === 'Viewer' && { opacity: 0.5 }]}
          pointerEvents={Role === 'Viewer' ? 'none' : 'auto'}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={Role !== 'Viewer' ? () => handleDeleteItem(item) : null}
          style={[styles.deleteIcon, Role === 'Viewer' && { opacity: 0.5 }]}
          pointerEvents={Role === 'Viewer' ? 'none' : 'auto'}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  
  
  

  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={() => setSidebarOpen(!sidebarOpen)} style={styles.hamburgerButton}>
        <Image source={sidebarOpen ? require('../Assets/backIcon.png') : require('../Assets/menu.png')} style={styles.hamburgerIcon} />
      </TouchableOpacity>
      {sidebarOpen && <Sidebar currentDatabase={currentDatabase} Name={Name} Role={Role} Profile={Profile}/>}
  
    <View style={styles.contentContainer}>
      <Text style={styles.title}>User Management</Text>
      <TouchableOpacity
          onPress={Role !== 'Viewer' ? () => handleopenCreate() : null} 
          style={[styles.newRecord, Role === 'Viewer' && { opacity: 0.5 }]}
          pointerEvents={Role === 'Viewer' ? 'none' : 'auto'}
        >
          <Text style={styles.NewRText}>New Record</Text>
        </TouchableOpacity>
      <CreateUser 
          currentDatabase ={currentDatabase}
          isOpen={createModalVisible}
          onClose={() => setCreateModalVisible(false)} 
          handleRefresh={handleRefresh}
        />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.Id} // Assuming Id is unique
        ListHeaderComponent={<TableHeader />}
      />
      <EditUsers
          isOpen={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          handleRefresh={handleRefresh}
          selectedUser={selectedUser}
          handleEmailChange={handleEmailChange}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          handleRoleChange={handleRoleChange}
          handleNameChange={handleNameChange}
          currentDatabase={currentDatabase}
        />
         <DeleteUser
          isOpen={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          selectedUser={selectedUser}
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
  contentContainer: {
    flex: 1,
    backgroundColor: '#439176',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: '5%',
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 5,
    backgroundColor: "black",
    position: 'relative',
   
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
  cell: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: 'white',
    alignItems: 'center', // Align items to center horizontally
    justifyContent: 'center', // Align items to center vertically
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
    color: 'black',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: 'white',
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  editIcon: {
    padding: 5,
    backgroundColor: '#f59328',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf:"center"
  },
  userItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  profileContainer: {
    flex: 1, // Adjust flex value as needed
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Profile:{
    width:50,
    height:50,
  },
  SortIcon:{
    tintColor:'white',
    width: 30,
    height: 30,
  },
  BackIcon:{
    width: 30,
    height: 30,

  },
  BackButton:{
      position: 'absolute', 
      top: 20, 
      left: 20, 
      zIndex: 1, 
  },
  sortIconContainer: {
    
    marginRight: 60, 
  },
  Hcell: {
    color: "white",
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  newRecord: {
    backgroundColor: '#3488ea',
    width: '7%', 
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
  sidebarContainer: {
    position: 'relative',

  },
  hamburgerButton: {
    position: 'absolute', 
    top: 20, 
    left: 20, 
    zIndex: 1, 
  },
  hamburgerIcon: {
    width: 30, 
    height: 30, 
  },
});

export default AdminTable;
