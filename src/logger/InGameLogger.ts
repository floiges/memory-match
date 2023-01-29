import Phaser from "phaser"
import ILogger from "./ILogger";

export default class InGameLogger implements ILogger {
  private readonly textarea: Phaser.GameObjects.DOMElement

  constructor(textarea: Phaser.GameObjects.DOMElement) {
    this.textarea = textarea
  }

  log(message: string): void {
    const node = this.textarea.node as HTMLTextAreaElement

    node.value += `${message}\n`
  }
}