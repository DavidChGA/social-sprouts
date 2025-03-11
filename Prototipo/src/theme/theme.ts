/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';

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
        fontSize: 50,
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    button: {
        backgroundColor: globalColors.primary,
        borderRadius: 10,
        borderWidth: 4,
        padding: 10,
        margin: 20,
    },

    imageButton: {
        backgroundColor: globalColors.light,
        borderRadius: 10,
        borderWidth: 5,
        width: '60%',
        height: '100%',
    },

    imageButtonSequence: {
        backgroundColor: globalColors.gray,
        borderRadius: 10,
        borderWidth: 2,
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
        fontSize: 40,
        alignSelf: 'center',
    },

    SButtonText: {
        color: globalColors.light,
        fontSize: 25,
        alignSelf: 'center',
    },
});
