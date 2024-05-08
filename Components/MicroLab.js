import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Airtable from 'airtable';

const MicroLab = () => {
  const [timelineItems, setTimelineItems] = useState([]);

  useEffect(() => {
    const fetchTimelineItems = async () => {
      const base = new Airtable({ apiKey: 'patG9t58PDUfG2Xhx.f87094464fa31eece79fb1868c858e94d92da3ef7157777734d1a548f54eb3e1' }
      ).base('app2H3JxpiIr6nVc1');

      base('Timeline').select({}).firstPage((err, records) => {
        if (err) {
          console.error('Error fetching data from Airtable:', err);
          return;
        }
 
        const items = records.map(record => ({
          id: record.id,
          timeline: record.get('Timeline'),
        }));
        setTimelineItems(items);
      });
    };

    fetchTimelineItems();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.HeaderText}>Micro Lab Management</Text>
    <View style={styles.headercontainer}>
      <ScrollView horizontal>
        {timelineItems.map((item, index) => (
          <TouchableOpacity key={item.id} style={styles.item}>
            <Text>{item.timeline}</Text>
     
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#439176',
  },
  headercontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  item: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginBottom:10,
    backgroundColor: '#f0f0f0',
  },
  HeaderText:{
    fontSize:20,
    fontWeight:'bold',
    alignSelf:'center'
  }
});

export default MicroLab;
