import { Pressable, Image, Dimensions } from 'react-native';
import React from 'react';

const { height } = Dimensions.get('window');

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
                    width: height * 0.06,
                    height: height * 0.06,
                    margin: height * 0.025,
                }}
            />
        </Pressable>
    );
};
