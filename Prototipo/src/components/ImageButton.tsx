/* eslint-disable prettier/prettier */
import { Pressable, Image } from 'react-native';
import { globalStyles } from '../theme/theme';
import React from 'react';
import imageMap from '../assets/imageMap';

interface Props {
    onPress: () => void;
    image: any;
    style?: object;
}

export const ImageButton = ({ onPress, image, style }: Props) => {
    const imageSource = imageMap[image];
    return (
        <Pressable
            onPress={() => onPress()}
            style={[globalStyles.imageButton, style]}
        >
            <Image
                source={imageSource}
                style={globalStyles.image}
                resizeMode="contain"
            />
        </Pressable>
    );
};
