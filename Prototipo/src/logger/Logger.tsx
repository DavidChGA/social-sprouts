import RNFS from 'react-native-fs';
import { Log } from './LogInterface';

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
