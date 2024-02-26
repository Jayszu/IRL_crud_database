import React, { useRef, useEffect } from 'react';
import { Text, Animated, Easing, StyleSheet } from 'react-native';

const AnimatedText = ({ selectedItem }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 12000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        })
      ).start();
    };

    animate();

    return () => {
      animatedValue.stopAnimation();
    };
  }, [animatedValue]);

  const interpolateColors = animatedValue.interpolate({
    inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
    outputRange: [
      'rgba(255, 0, 0, 1)',     // Red
      'rgba(255, 127, 0, 1)',   // Orange
      'rgba(255, 255, 0, 1)',   // Yellow
      'rgba(0, 255, 0, 1)',     // Green
      'rgba(0, 0, 255, 1)',     // Blue
      'rgba(75, 0, 130, 1)',    // Indigo 
      'rgba(148, 0, 211, 1)',   // Violet
      'rgba(255, 0, 0, 1)',     // Red loop smottttth
    ],
  });
  

  return (
    <Animated.Text style={[styles.HeaderItem, { color: interpolateColors }]}>
      {selectedItem.Item}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  HeaderItem: {
    left:'100%',
    fontSize: 30,
    fontWeight: 'bold',
   bottom:"3%"
  },
});

export default AnimatedText;
