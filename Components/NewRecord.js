import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const NewRecord = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {}}>
                <Text style={styles.NewRecord}>
                    New Record
                </Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        paddingVertical: 5, // Adjust the vertical padding here
        paddingHorizontal: 20, // Adjust the horizontal padding here
        marginVertical: 5, // Adjust the vertical margin here
    },
    NewRecord: {
        fontSize: 15,
        fontWeight: 'bold',
    }
})

export default NewRecord
