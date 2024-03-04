import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2024 NFRDI All rights reserved. Unauthorized reproduction, distribution, or use of this software is strictly prohibited.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
  
    alignSelf: "flex-start",
    marginLeft: 10, // Adjust the left margin to align the text to the most left
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});

export default Footer;
