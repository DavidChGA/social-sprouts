import RNFS from 'react-native-fs';
import logTypes from './LogTypesEnum';
import { Log } from './LogInterface';

//Para pasarlo a un JSON que podamos usar en una petición JSON.stringify(Log), revisar si añadimos más campos
//Cuando estén decididos cambiar la interfaz como argumento de log() y no las cosas por separado.

class Logger {
  private static instance: Logger;
  private logFilePath = `${RNFS.DocumentDirectoryPath}/app.log`;

  // es un singletion
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  async log(log: Log): Promise<void> {
    // Cadena de texto que nos interesa

    const logMessage = ``;
    const json =  JSON.stringify(log, null, 2);

    try {
      console.log('`[LOG]', json);
      await RNFS.appendFile(this.logFilePath, json + '\n', 'utf8');
    } catch (error) {
      console.error('Error guardando log:', error);
    }
  }

  async readLog(): Promise<string> {
    try {
      return await RNFS.readFile(this.logFilePath, 'utf8');
    } catch (error) {
      console.error('Error leyendo log:', error);
      return '';
    }
  }
}

export default Logger.getInstance();
