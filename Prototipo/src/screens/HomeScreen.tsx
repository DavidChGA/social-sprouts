import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type IHomeScreenProps = {
  navigation: any;
}

const HomeScreen: React.FC<IHomeScreenProps> = ({navigation}) => {
  return (
    <React.Fragment>
        <View style={styles.container}>
        <Text style={styles.text}>Hola</Text>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
