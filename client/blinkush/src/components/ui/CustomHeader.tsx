import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors, Fonts } from '@utils/Constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { goBack } from '@utils/navigation-utils';
import CustomText from './CustomText';
import { RFValue } from 'react-native-responsive-fontsize';

const CustomHeader = ({ title, search }: { title: string, search?: boolean; }) => {
    return (
        <SafeAreaView>
            <View style={styles.flexRow}>
                <Pressable onPress={() => goBack()}>
                    <Icon name='chevron-back' style={{color:Colors.secondary, fontSize: 20}}/>
                </Pressable>
                <CustomText variant='h3' fontFamily={Fonts.SemiBold} style={styles.text}>
                    {title}
                </CustomText>
                <View>
                    {search && <Icon name='search' color={Colors.text} size={RFValue(16)} />}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CustomHeader;

const styles = StyleSheet.create({
    flexRow: {
        justifyContent: 'space-between',
        padding: 10,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 0.6,
        borderColor: Colors.border,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold'
    }
});