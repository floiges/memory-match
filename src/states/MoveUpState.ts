import AnimationKeys from "../consts/AnimationKeys"

export default class MoveUpState {
  private player!: Phaser.Physics.Arcade.Sprite

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player
  }

  enter() {
    this.player.play(AnimationKeys.UpWalk)

    const speed = 200
    this.player.setVelocity(0, -speed)
  }
}