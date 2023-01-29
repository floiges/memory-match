import AnimationKeys from "../consts/AnimationKeys"

export default class MoveLeftState {
  private player!: Phaser.Physics.Arcade.Sprite

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player
  }

  enter() {
    this.player.play(AnimationKeys.LeftWalk)

    const speed = 200
    this.player.setVelocity(-speed, 0)
  }
}