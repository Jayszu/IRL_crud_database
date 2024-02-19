import React from 'react';
import { View, StyleSheet, Text } from 'react-native';


const TitleHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.HeaderText}>
        CRUD IRL
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    backgroundColor: '#4F5050', 
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  HeaderText: {
    color: "white",
    position: "relative",
    textAlign: "center",
    top: 5,
    fontWeight: "bold",
    fontSize: 20
  }
});

export default TitleHeader;