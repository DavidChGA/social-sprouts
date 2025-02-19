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

    background: '#bed98c',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    logo:{
        width: '60%',
        height: '60%',
        bottom: 30,
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
        marginVertical: 20,
    },

    imageButton: {
        backgroundColor: globalColors.light,
        borderRadius: 10,
        borderWidth: 5,
        width: '60%',
        height: '100%',
    },

    image: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },

    PButtonText: {
        color: globalColors.light,
        fontSize: 50,
        alignSelf: 'center',
    },

    SButtonText: {
        color: globalColors.light,
        fontSize: 30,
        alignSelf: 'center',
    },
});
