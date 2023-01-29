import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
// import Loggers from './scenes/Loggers'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	// Dom elements appear above or below your game canvas
	dom: {
		createContainer: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 0 },
		},
	},
	scene: [Preloader, Game],
}

export default new Phaser.Game(config)
