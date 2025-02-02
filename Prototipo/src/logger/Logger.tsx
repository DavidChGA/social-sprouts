import RNFS from 'react-native-fs';

class Logger {
  private static instance: Logger;
  private logFilePath: string;

  private constructor(fileName: string = 'tracker.log') {
    //this.logFilePath = `${RNFS.ExternalDirectoryPath}/${fileName}`;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  async log(message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    try {
      //await RNFS.appendFile(this.logFilePath, logMessage, 'utf8');
      console.log('Log guardado:', logMessage);
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

  async clearLog(): Promise<void> {
    try {
      await RNFS.writeFile(this.logFilePath, '', 'utf8');
      console.log('Log limpiado');
    } catch (error) {
      console.error('Error limpiando log:', error);
    }
  }
}

export default Logger.getInstance();
