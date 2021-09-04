import Ball from "../Ball.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
	TILE_SIZE
} from "../globals.js";
import State from "./State.js";
import Paddle from "../Paddle.js";

/**
 * Represents the state of the game in which we are actively playing;
 * player should control the paddle, with the ball actively bouncing between
 * the bricks, walls, and the paddle. If the ball goes below the paddle, then
 * the player should lose one point of health and be taken either to the Game
 * Over screen if at 0 health or the Serve screen otherwise.
 */
export default class PlayState extends State {
	constructor() {
		super();
		this.paddle = new Paddle();
		this.ball = new Ball();
	}

	update(dt) {
		if (this.paused) {
			if (keys.p) {
				keys.p = false;
				this.paused = false;
				sounds.pause.play();
			}
			else {
				return;
			}
		}
		else if (keys.p) {
			keys.p = false;
			this.paused = true;
			sounds.pause.play();
			return;
		}

		if (this.ball.didCollide(this.paddle)) {
			this.ball.dy *= -1;
			this.ball.y = CANVAS_HEIGHT - TILE_SIZE * 2 - TILE_SIZE / 2;
			sounds.paddleHit.play();
		}

		this.paddle.update(dt);
		this.ball.update(dt);
	}

	render() {
		images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		this.paddle.render();
		this.ball.render();

		if (this.paused) {
			context.save();
			context.font = "50px Joystix";
			context.fillStyle = "white";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			context.fillText(`⏸`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
			context.restore();
		}
	}
}
