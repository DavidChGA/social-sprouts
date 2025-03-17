/* eslint-disable prettier/prettier */
import React from 'react';
import {Modal, View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {globalStyles} from '../theme/theme';

const {height} = Dimensions.get('window');

interface Props {
  isVisible: boolean; // Controla si el modal está visible
  message: string; // Mensaje a mostrar en el modal
  image: any;
  onClose: () => void; // Función para cerrar el modal
}

export const AnswerModal = ({isVisible, message, image, onClose}: Props) => {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image
            source={image}
            style={globalStyles.logo}
            resizeMode="contain"
          />
          <Text style={styles.modalText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // Fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: '60%',
    width: '50%',
    padding: '2%',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: height * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
