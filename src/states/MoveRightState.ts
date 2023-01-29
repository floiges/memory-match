import AnimationKeys from "../consts/AnimationKeys"

export default class MoveRightState {
  private player!: Phaser.Physics.Arcade.Sprite

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player
  }

  enter() {
    this.player.play(AnimationKeys.RightWalk)

    const speed = 200
    this.player.setVelocity(speed, 0)
  }
}