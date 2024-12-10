/* eslint-disable prettier/prettier */
import { Pressable, Image } from 'react-native';
import { globalStyles } from '../theme/theme';
import React from 'react';

interface Props {
    onPress: () => void;
    image: any;
}

export const ImageButton = ({ onPress, image }: Props) => {
    const imageSource = image.startsWith('http') ? { uri: image } : image;

    return (
        <Pressable
            onPress={() => onPress()}
            style={globalStyles.imageButton}
        >
            <Image
                source={imageSource}
                style={globalStyles.image}
                resizeMode="contain"
            />
        </Pressable>
    );
};
