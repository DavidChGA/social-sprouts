import { Pressable, Image } from 'react-native';
import { globalStyles } from '../theme/theme';
import React, { useState } from 'react';
import imageMapSequences from '../assets/imageMapSequences';

interface Props {
    onPress: () => void;
    image: any;
    style?: object;
}

export const ImageButtonSequence = ({ onPress, image, style }: Props) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const imageSource = imageMapSequences[image];

    //Hacer que no se pueda volver a tocar el botón.
    const handlePress = async () => {
        if (!isDisabled) {
            const isCorrect = Boolean(await onPress());
            if (isCorrect) {
                setIsDisabled(true);
            }
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            disabled={isDisabled}
            style={[globalStyles.imageButtonSequence, style]}
        >
            <Image
                source={imageSource}
                style={globalStyles.image}
                resizeMode="contain"
            />
        </Pressable>
    );
};
