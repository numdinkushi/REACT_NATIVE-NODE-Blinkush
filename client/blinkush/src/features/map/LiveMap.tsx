import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { screenHeight } from '@utils/scaling';
import { Colors } from '@utils/Constants';

const LiveMap = () => { 
    return (
        <View style={styles.container}>
          
        </View>
    );
};

export default LiveMap;

const styles = StyleSheet.create({
    container: {
        height: screenHeight * 0.38,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: .7, 
        borderColor: Colors.border,
        marginBottom: 10,
        position: 'relative',
        backgroundColor:'white'
    }
});