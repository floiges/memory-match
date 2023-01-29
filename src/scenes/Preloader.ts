import Phaser from "phaser"
import AnimationKeys from "../consts/AnimationKeys"
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    // In Phaser 3, a spritesheet is an atlas where each frame is the same size and can be referenced by their frame index
    this.load.spritesheet(TextureKeys.Sokoban, 'textures/sokoban_tilesheet.png', {
      frameWidth: 64
    })

    this.load.image(TextureKeys.Bear, 'textures/bear.png')
    this.load.image(TextureKeys.Chicken, 'textures/chicken.png')
    this.load.image(TextureKeys.Duck, 'textures/duck.png')
    this.load.image(TextureKeys.Parrot, 'textures/parrot.png')
    this.load.image(TextureKeys.Penguin, 'textures/penguin.png')
  }

  create() {
    // we'll need 8 animations. 4 for walking in each direction and 4 for standing idle in each direction.
    // 1帧动画
    this.anims.create({
      key: AnimationKeys.DownIdle,
      frames: [{ key: TextureKeys.Sokoban, frame: 52 }]
    })

    this.anims.create({
      key: AnimationKeys.UpIdle,
      frames: [{ key: TextureKeys.Sokoban, frame: 55 }]
    })

    this.anims.create({
      key: AnimationKeys.LeftIdle,
      frames: [{ key: TextureKeys.Sokoban, frame: 81 }]
    })

    this.anims.create({
      key: AnimationKeys.RightIdle,
      frames: [{ key: TextureKeys.Sokoban, frame: 78 }]
    })

    this.anims.create({
      key: AnimationKeys.DownWalk,
      frames: this.anims.generateFrameNumbers(TextureKeys.Sokoban, { start: 52, end: 54 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: AnimationKeys.UpWalk,
      frames: this.anims.generateFrameNumbers(TextureKeys.Sokoban, { start: 55, end: 57 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: AnimationKeys.LeftWalk,
      frames: this.anims.generateFrameNumbers(TextureKeys.Sokoban, { start: 81, end: 83 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: AnimationKeys.RightWalk,
      frames: this.anims.generateFrameNumbers(TextureKeys.Sokoban, { start: 78, end: 80 }),
      frameRate: 10,
      repeat: -1,
    })

    this.scene.start(SceneKeys.Logger)
  }
}