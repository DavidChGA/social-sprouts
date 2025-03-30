import RNFS from 'react-native-fs';
import { Log } from './LogInterface';

class Logger {
  private static instance: Logger;
  private logFilePath: string;

  private constructor() {
    this.changeFilePath();
  }

  private changeFilePath(): void {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    this.logFilePath = `${RNFS.DocumentDirectoryPath}/${dia}-${mes}-${anio}.log`;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  async log(log: Log): Promise<void> {
    this.changeFilePath(); //Compruebo que el archivo es el último día
    const json = JSON.stringify(log, null, 2);

    try {
      console.log('[LOG]', json);
      await RNFS.appendFile(this.logFilePath, json + '\n', 'utf8');
    } catch (error) {
      console.error('Error guardando log:', error);
    }
  }

  async readLog(): Promise<string> {
    this.changeFilePath();
    try {
      return await RNFS.readFile(this.logFilePath, 'utf8');
    } catch (error) {
      console.error('Error leyendo log:', error);
      return '';
    }
  }
}

export default Logger.getInstance();
