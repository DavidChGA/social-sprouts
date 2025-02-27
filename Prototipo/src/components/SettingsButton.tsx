/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { Pressable, Image } from 'react-native';
import React from 'react';

interface Props {
    onPress: () => void;
}

export const SettingsButton = ({ onPress }: Props) => {
    return (
        <Pressable
            onPress={() => onPress()}
        >
            <Image
                source={require('../assets/img/configuraciones.png')}
                style={{
                    width: 50, // Ajusta el ancho de la imagen
                    height: 50, // Ajusta la altura de la imagen
                    margin: 30,
                }}
            />
        </Pressable>
    );
};
