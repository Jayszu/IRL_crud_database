import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Main from '../Components/Main'
import StackNavigator from './StackNavigator'
import { NavigationContainer } from '@react-navigation/native'

const MainNavigation = () => {
  return (
    <NavigationContainer>
        <StackNavigator />
    </NavigationContainer>
  )
}

export default MainNavigation

const styles = StyleSheet.create({})