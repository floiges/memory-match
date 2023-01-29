import Phaser from "phaser"
import SceneKeys from "../consts/SceneKeys"
import Logger from "../logger"
import InGameLogger from "../logger/InGameLogger"

export default class Loggers extends Phaser.Scene {
  private logger!: Logger

  constructor() {
    super(SceneKeys.Logger)
  }

  init() {
    this.logger = new Logger()
  }

  create() {
    const { width, height } = this.scale

    const textarea = this.add.dom(width * 0.5, height * 0.5, 'textarea', {
      width: width * 0.8,
      height: height * 0.7
    })

    this.logger.add('in-game', new InGameLogger(textarea))

    this.logger.log('hello world!')
  }
}