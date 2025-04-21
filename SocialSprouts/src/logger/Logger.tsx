import RNFS from 'react-native-fs';
import { Log } from './LogInterface';

class Logger {
  private static instance: Logger;
  private logFilesPath: string;

  private constructor() {
    this.changePath();
  }

  private changePath(): void {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    this.logFilesPath = `${RNFS.ExternalDirectoryPath}/${day}-${month}-${year}.log`;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  async log(log: Log) {
    this.changePath(); //Compruebo que el archivo es el último día
    const json = JSON.stringify(log, null, 2);

    try {
      console.log('[LOG]', json);
      await RNFS.appendFile(this.logFilesPath, json + '\n', 'utf8');
    } catch (error) {
      console.error('Error guardando log:', error);
    }
  }

  async readLog() {
    this.changePath();
    try {
      return await RNFS.readFile(this.logFilesPath, 'utf8');
    } catch (error) {
      console.error('Error leyendo log:', error);
      return '';
    }
  }
}

export default Logger.getInstance();
