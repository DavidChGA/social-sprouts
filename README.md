# Social Sprouts

El Trastorno del Espectro Autista (TEA) está compuesto por un conjunto amplio de alteraciones que afectan al neurodesarrollo, entre los que se encuentran déficits persistentes en comunicación, interacción social y reciprocidad socioemocional. Estas barreras provocan que las personas que lo presentan tengan dificultades para comunicarse con su entorno. En este trabajo se propone diseñar y evaluar una aplicación gamificada de código libre con el objetivo de mejorar las habilidades sociales de estos niños. En particular, se propone mejorar su desempeño sociocomunicativo: expresión verbal, reconocimiento emocional y predictibilidad y adaptación a nuevos entornos.

# Manual de instalación para Android

## 1.- Descargar la última versión de la APK publicada en este repositorio en el dispositivo Android que desee.
## 2.- 

# Manual de despliegue

El código de esta aplicación se generó empleando React Native sin un framework y son los pasos necesarios para implementar y lanzar la aplicación los que se describen a continuación. 

## 1.- [Configurar el entorno de desarrollo] (https://reactnative.dev/docs/set-up-your-environment?platform=android&os=windows) acorde con lo que deseamos.

## 2.- Descargar o clonar el código fuente
       Si el código está en un repositorio, clónalo usando:  
       ```sh
       git clone <URL_DEL_REPO>
       ```
       Luego entra en la carpeta del proyecto:  
       ```sh
       cd nombre-del-proyecto
       ```
       
## 3.- Instalar dependencias  
       Ejecuta el siguiente comando para instalar las dependencias del proyecto:  
       ```sh
       npm install
       ```

## 4.- Iniciar Metro Bundler y ejecutar la aplicación
       (Asegúrate de tener un emulador corriendo o un dispositivo conectado con `adb devices`)
       ```sh
       npm run android
       ```
