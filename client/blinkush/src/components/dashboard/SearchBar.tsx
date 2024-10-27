import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import RollingBar from 'react-native-rolling-bar';
import CustomText from '@components/login/ui/CustomText';

const SearchBar = () => {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8}>
            <Icon name='search' color={Colors.text} size={RFValue(20)} />
            <RollingBar interval={3000} defaultStyle={false} customStyle={styles.textContainer} >
                <CustomText variant='h6' fontFamily={Fonts.Medium}> Search 'moi-moi' </CustomText>
                <CustomText variant='h6' fontFamily={Fonts.Medium}> Search 'sweets' </CustomText>
                <CustomText variant='h6' fontFamily={Fonts.Medium}> Search 'milk' </CustomText>
                <CustomText variant='h6' fontFamily={Fonts.Medium}> Search 'ata', 'dal', 'coke' </CustomText>
                <CustomText variant='h6' fontFamily={Fonts.Medium}> Search 'akara' </CustomText>
            </RollingBar>
            <View style={styles.divider} />
            <Icon name='mic' color={Colors.text} size={RFValue(20)} />
        </TouchableOpacity>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f4f7',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderWidth: 0.6,
        borderColor: Colors.border,
        marginTop: 15,
        marginHorizontal: 10,
        overflow: 'hidden',
        paddingHorizontal: 10
    },
    textContainer: {
        width: '90%',
        paddingLeft: 10,
        height: 60
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#ddd',
        marginHorizontal: 10,
    }
});