/* eslint-disable prettier/prettier */
import { Pressable, Text } from 'react-native';
import { globalStyles } from '../theme/theme';
import React from 'react';

interface Props{
    onPress: () => void;
    label: string;
}

export const SecondaryButton = ({onPress, label}: Props) => {
    return (
        <Pressable
            onPress={() => onPress()}
            style={globalStyles.button}
        >
            <Text style={globalStyles.SButtonText}>{label}</Text>
        </Pressable>
    );
};
