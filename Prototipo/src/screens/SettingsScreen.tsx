import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { type NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';

function SettingsScreen() {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    useEffect(() => {
            navigation.setOptions({
                headerShown: false,
            });
        }, []);

  return (
    <View>
        <Text> TODO </Text>
    </View>
  )
}

export default SettingsScreen