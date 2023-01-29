import Phaser from 'phaser'
import AnimationKeys from '../consts/AnimationKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'
import CountdownController from './CountdownController'
import PlayerController from './PlayerController'

// level variable as 2D array of numbers
// Each unique number in this 2D array represents a different animal that will come out of the box.
const level = [
  [1, 0, 3],
  [2, 4, 1],
  [3, 4, 2]
]

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private player!: Phaser.Physics.Arcade.Sprite
  private boxGroup!: Phaser.Physics.Arcade.StaticGroup
  private itemsGroup!: Phaser.GameObjects.Group
  private activeBox?: Phaser.Physics.Arcade.Sprite
  private selectedBoxes: { box: Phaser.Physics.Arcade.Sprite, item: Phaser.GameObjects.Sprite }[] = []

  private matchesCount = 0

  private countdown!: CountdownController
  private playerController!: PlayerController

  constructor() {
    super(SceneKeys.Game)
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    // use frame 53
    // this.add.image(400, 300, TextureKeys.Sokoban, 52)
    const { width, height } = this.scale
    this.player = this.physics.add.sprite(width * 0.5, height * 0.6, TextureKeys.Sokoban, 52)
      // 设置 collider 之后，人物和盒子的深度感不那么明显了
      // 因此这里重新设置一下 size 和 offset
      // 增加深度感
      // change the size of the collision box.
      .setSize(40, 16)
      // place box
      .setOffset(12, 38)
      .play(AnimationKeys.UpWalk)

    this.playerController = new PlayerController(this.player)

    // set initial state to 'idle'
    this.playerController.setState('idle')

    // create the box
    // We will need 9 boxes and add a collider with the player for each
    // Our boxes will have static Physics bodies as they don't need to move. They will stay where they are once we place them.
    this.boxGroup = this.physics.add.staticGroup()
    this.createBoxes()
    // this.physics.add.collider(this.player, this.boxGroup)

    // by adding a collider callback
    this.physics.add.collider(
      this.boxGroup,
      this.player,
      this.handlePlayerBoxCollider,
      undefined,
      this
    )

    this.itemsGroup = this.add.group()

    const timerLabel = this.add.text(width * 0.5, 50, '45', { fontSize: '48px' })
      .setOrigin(0.5)

    this.countdown = new CountdownController(this, timerLabel)

    // call start
    this.countdown.start(this.handleCountdownFinished.bind(this))
  }

  update() {
    this.updatePlayer()

    this.updateActiveBox()

    this.children.each(c => {
      const child = c as Phaser.Physics.Arcade.Sprite
      // 增加深度感
      // appear behind boxes when he is behind them and in front when he is in front of them

      if (child.getData('sorted')) return
      child.setDepth(child.y)
    })

    this.countdown.update()
  }

  private createBoxes() {
    const width = this.scale.width

    let xPer = 0.25
    let y = 150
    for (let row = 0; row < level.length; ++row) {
      for (let col = 0; col < level[row].length; ++col) {
        // boxGroup.get() creates a new box and adds it to the Scene at the given x and y positions
        const box = this.boxGroup.get(width * xPer, y, TextureKeys.Sokoban, 10)
        box.setSize(64, 32)
          .setOffset(0, 32)
          .setData('itemType', level[row][col])
        xPer += 0.25
      }
      xPer = 0.25
      y += 150
    }
  }

  private handlePlayerBoxCollider(player: Phaser.GameObjects.GameObject, box: Phaser.GameObjects.GameObject) {
    const opened = box.getData('opened')
    if (opened) return

    if (this.activeBox) return

    this.activeBox = box as Phaser.Physics.Arcade.Sprite
    this.activeBox.setFrame(9)
  }

  private handleBearSelected() {
    // get the selected box
    const { box, item } = this.selectedBoxes.pop()!

    // tint the bear red
    item.setTint(0xff0000)

    // set the box to frame 7 (a read box)
    box.setFrame(7)

    // disable the player and any movement
    this.player.active = false
    this.player.setVelocity(0, 0)

    // wait 1 second and then return to normal
    this.time.delayedCall(1000, () => {
      item.setTint(0xffffff)
      box.setFrame(10)
      box.setData('opened', false)

      this.tweens.add({
        targets: item,
        y: '+=50',
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: () => {
          this.player.active = true
        }
      })
    })
  }

  private handleCountdownFinished() {
    // disable and stop player like before
    this.player.active = false
    this.player.setVelocity(0, 0)

    // add a You Lose! text
    const { width, height } = this.scale
    this.add.text(width * 0.5, height * 0.5, 'You Lose!', {
      fontSize: '48px',
    })
    .setOrigin(0.5)
  }

  private updatePlayer() {
    if (!this.player.active) return

    if (this.cursors.left.isDown) {
      this.playerController.setState('moveLeft')
    } else if (this.cursors.right.isDown) {
      this.playerController.setState('moveRight')
    } else if (this.cursors.up.isDown) {
      this.playerController.setState('moveUp')
    } else if (this.cursors.down.isDown) {
      this.playerController.setState('moveDown')
    } else {
      this.playerController.setState('idle')
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space)
    if (spaceJustPressed && this.activeBox) {
      this.openBox(this.activeBox)

      // reset box after opened
      this.activeBox.setFrame(10)
      this.activeBox = undefined
    }
  }

  private updateActiveBox() {
    if (!this.activeBox) return

    // get the distance
    const distance = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.activeBox.x, this.activeBox.y
    )

    if (distance < 64) return

    // return to using frame 10 when too far
    this.activeBox.setFrame(10)

    // and make activeBox undefined
    this.activeBox = undefined
  }

  private openBox(box: Phaser.Physics.Arcade.Sprite) {
    if (!box) return

    const itemType = box.getData('itemType')

    let item: Phaser.GameObjects.Sprite

    switch (itemType) {
      case 0:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.Bear)
        break
      case 1:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.Chicken)
        break
      case 2:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.Duck)
        break
      case 3:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.Parrot)
        break
      case 4:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.Penguin)
        break
      default:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.Bear)
        break
    }

    // specify that the box is opened and
    // then tween the item from a scale and alpha of 0 to 1 so that it appears with a bit a fanfare.
    box.setData('opened', true)
    item.setData('sorted', true)
    item.setDepth(2000)

    // active
    item.setActive(true)
    item.setVisible(true)

    item.scale = 0
    item.alpha = 0

    this.selectedBoxes.push({ box, item })

    this.tweens.add({
      targets: item,
      y: '-=50',
      alpha: 1,
      scale: 1,
      duration: 500,
      onComplete: () => {
        if (itemType === 0) {
          this.handleBearSelected()
          return
        }
        // check that we have 2 items recently opened
        if (this.selectedBoxes.length < 2) return

        this.checkForMatch()
      }
    })
  }

  private checkForMatch() {
    // pop from end to get second and first opened boxes
    const second = this.selectedBoxes.pop()
    const first = this.selectedBoxes.pop()

    // no match if the revealed items are not the same texture
    if (first?.item.texture !== second?.item.texture) {
      // hide the items and set box to no longer opened
      this.tweens.add({
        targets: [first?.item, second?.item],
        y: '+=50',
        alpha: 0,
        scale: 0,
        duration: 300,
        delay: 1000,
        onComplete: () => {
          // call killAndHide() on each item to properly set them to inactive so that they can be reused later.
          this.itemsGroup.killAndHide(first!.item)
          this.itemsGroup.killAndHide(second!.item)

          first?.box.setData('opened', false)
          second?.box.setData('opened', false)
        }
      })
      return
    }

    ++this.matchesCount

    // we have a match! wait 1 second then set box to frame 8
    this.time.delayedCall(1000, () => {
      first?.box.setFrame(8)
      second?.box.setFrame(8)

      // check that we have 4 matches
      if (this.matchesCount >= 4) {
        // game won
        this.countdown.stop()

        // disable and stop player like before
        this.player.active = false
        this.player.setVelocity(0, 0)

        // add a You Win! text
        const { width, height } = this.scale
        this.add.text(width * 0.5, height * 0.5, 'You Win!', {
          fontSize: '48px',
        })
        .setOrigin(0.5)
      }
    })
  }
}