'use strict'

const canvas = document.getElementById("canvas").getContext("2d");

const props = {
	//time
	ticks: 0, 
	ticker: -1, 
	fast: false, 
	paused: true, 
	wave: 0, 
	wave_time: 0,
	//array of objects on canvas
	run: [], 
	enemies: [],
	towers: [], 
	selection: false, 
	//useless var
 	spent: 0,
	kills: 0,
	// objects of coordinates
	tiles: false,
	map: {}, 
	//can be change there 
	hpinc: 1.3, 
	lives: 10,
	cash: 350
};