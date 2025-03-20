/* eslint-disable prettier/prettier */
import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const globalColors = {
    primary: 'purple',
    secondary: 'magenta',
    tertiary: 'darkblue',
    success: 'lightblue',
    warning: 'orange',
    danger: 'red',
    dark: 'black',
    light: 'white',
    gray: 'gray',

    background: '#bed98c',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo:{
        width: '60%',
        height: '60%',
    },

    title: {
        color: globalColors.light,
        fontSize: height * 0.065,
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    subtitle: {
        color: globalColors.gray,
        fontSize: height * 0.04,
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: '2%',
    },


    button: {
        backgroundColor: globalColors.primary,
        borderRadius: 10,
        borderWidth: height * 0.005,
        padding: height * 0.01,
        margin: '2%',
    },

    imageButton: {
        backgroundColor: globalColors.light,
        borderRadius: 10,
        borderWidth: height * 0.005,
        width: '60%',
        height: '100%',
    },

    imageButtonEmotions: {
        backgroundColor: globalColors.light,
        borderRadius: 10,
        borderWidth: height * 0.005,
        width: '90%',
        height: '100%',
    },

    imageButtonSequence: {
        backgroundColor: globalColors.gray,
        borderRadius: 10,
        borderWidth: height * 0.005,
        width: '80%',
        height: '100%',
    },

    image: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },

    PButtonText: {
        color: globalColors.light,
        fontSize: height * 0.05,
        alignSelf: 'center',
    },

    SButtonText: {
        color: globalColors.light,
        fontSize: height * 0.035,
        alignSelf: 'center',
    },
});
