'use strict'

import {canvas, props} from '/Components/Properties.js';
import Towers from 'js/Towers.js';
import Enemies from 'js/Enemies.js';
import Maps from 'js/Maps.js';
import Render from 'js/Render.js';
import Actions from 'js/Actions.js';

class Game {
	constructor (canvas, props, Towers, Enemies, Maps, Render, Actions){
		this.canvas = canvas;
		this.props = props;
		this.Towers = Towers;
		this.Enemies=  Enemies;
		this.Maps = Maps;
		this.Render=  Render;
		this.Actions = Actions;
	};

	init() {
		Actions.load();
	}
	
}

const game = new Game(canvas, props, Towers, Enemies, Maps, Render, Actions);
game.init();

