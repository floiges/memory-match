export default class CountdownController {
  private scene: Phaser.Scene

  private label: Phaser.GameObjects.Text

  private timerEvent?: Phaser.Time.TimerEvent

  private duration!: number

  constructor(scene: Phaser.Scene, label: Phaser.GameObjects.Text) {
    this.scene = scene
    this.label = label
  }

  start(callback: VoidFunction, duration = 45000) {
    this.stop()

    this.duration = duration
    // create a TimerEvent with given duration
    this.timerEvent = this.scene.time.addEvent({
      delay: duration,
      callback: () => {
        this.label.text = '0' // set to 0 since time is up

        this.stop()

        // execute callback when finished
        callback && callback()
      }
    })
  }

  stop() {
    if (!this.timerEvent) return

    this.timerEvent.destroy()
    this.timerEvent = undefined
  }

  update() {
    if (!this.timerEvent || this.duration <=0) return

    // get elapsed time
    const elapsed = this.timerEvent.getElapsed()

    // substract from total duration
    const remaining = this.duration - elapsed

    // convert from milliseconds to seconds
    const seconds = remaining / 1000

    // change label to show new value
    this.label.text = seconds.toFixed(2)
  }
}