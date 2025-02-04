import RNFS from 'react-native-fs';

class Logger {
  private static instance: Logger;
  private logFilePath: string;

  private constructor(fileName: string = 'tracker.log') {
    //this.logFilePath = `${RNFS.ExternalDirectoryPath}/${fileName}`;
  }

  // es un singletion
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  async log(player: { name: string }, action: string, object: string, timestamp: string): Promise<void> {
    // Cadena de texto que nos interesa
    const logMessage = `${player.name} ${action} ${object} a las "${timestamp}"`;

    try {
      //await RNFS.appendFile(this.logFilePath, logMessage + '\n', 'utf8');
      console.log('`[LOG]', logMessage);
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
