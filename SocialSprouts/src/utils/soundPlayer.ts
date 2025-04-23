import Sound from "react-native-sound";
import soundMap from '../assets/soundMap';
import { useGlobalStoreUser } from "../globalState/useGlobalStoreUser";

class SoundPlayer {

    private static sound = new Sound(require('../assets/sounds/answer/correct.mp3'), Sound.MAIN_BUNDLE, (error) => {
        if (error) { console.log("Error al cargar el sonido correcto:", error); }
    });;

    private static soundCorrect = new Sound(soundMap['CORRECTO'], Sound.MAIN_BUNDLE, (error) => {
        if (error) { console.log("Error al cargar el sonido correcto:", error); }
    });

    private static soundIncorrect = new Sound(soundMap['INCORRECTO'], Sound.MAIN_BUNDLE, (error) => {
        if (error) { console.log("Error al cargar el sonido correcto:", error); }
    });

    static setSound(soundFile: string) {
        this.sound = new Sound(soundMap[soundFile], Sound.MAIN_BUNDLE, (error) => {
            if (error) { console.log("Error al cargar el sonido:", error); }
        });
    }

    static playSound() {
        if (this.sound && useGlobalStoreUser.getState().selectedUser.soundActive) {
            this.sound.play((success) => {
                if (!success) {
                    console.log("Error al reproducir el sonido");
                }
            });
        }
    }

    static correctIncorrect(isCorrect: boolean) {
        if (useGlobalStoreUser.getState().selectedUser.soundActive) {
            if (isCorrect) {
                this.soundCorrect.play((success) => {
                    if (!success) {
                        console.log("Error al reproducir el sonido");
                    }
                });
            } else {
                this.soundIncorrect.play((success) => {
                    if (!success) {
                        console.log("Error al reproducir el sonido");
                    }
                });
            }
        }
    }

}

export default SoundPlayer;