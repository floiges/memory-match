import ILogger from "./ILogger";

export default class Logger {
  private loggersByName = new Map<string, ILogger>()

  add(name: string, logger: ILogger) {
    this.loggersByName.set(name, logger)
  }

  remove(name: string) {
    this.loggersByName.delete(name)
  }

  log(message: string) {
    this.loggersByName.forEach(logger => {
      logger.log(message)
    })
  }
}

const sharedInstance = new Logger()

export {
  sharedInstance
}