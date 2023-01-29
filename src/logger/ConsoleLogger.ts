import ILogger from "./ILogger";

export default class ConsoleLogger implements ILogger {
  log(message: string): void {
      console.log(message)
  }
}