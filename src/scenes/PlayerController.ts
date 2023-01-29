import IdleState from "../states/IdleState"
import MoveDownState from "../states/MoveDownState"
import MoveLeftState from "../states/MoveLeftState"
import MoveRightState from "../states/MoveRightState"
import MoveUpState from "../states/MoveupState"

type StatesKey = 'idle'| 'moveLeft' | 'moveRight' | 'moveUp' | 'moveDown'

export default class PlayerController {
  private states!: { [key in StatesKey]: { enter: () => void } }
  private currentState?: { enter: VoidFunction }

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.states = {
      idle: new IdleState(player),
      moveLeft: new MoveLeftState(player),
      moveRight: new MoveRightState(player),
      moveDown: new MoveDownState(player),
      moveUp: new MoveUpState(player)
    }
  }

  setState(name: StatesKey) {
    if (this.currentState === this.states[name]) return

    this.currentState = this.states[name]
    this.currentState.enter()
  }
}