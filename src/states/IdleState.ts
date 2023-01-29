export default class IdleState {
  private player!: Phaser.Physics.Arcade.Sprite

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player
  }

  enter() {
    this.player.setVelocity(0, 0)
    const key = this.player.anims.currentAnim.key
    const parts = key.split('-')
    const direction = parts[0]
    this.player.play(`${direction}-idle`)
  }
}