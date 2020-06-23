'use strict'

export const canvas = document.getElementById("canvas").getContext("2d");

export const props = {
	ticks: 0, // fps current
	_ticks: 0, // fps temp
	_tick: 0, // fps for display
	ticker: -1, // fps start
	run: [], //выстрелы
	fast: false, // ускорение кадров
	paused: true, // пауза 
		
	wave: 0, 
	_wave: 0,
	
	creeps: [], // враги на поле
	towers: [], // башни на поле
 	spent: 0,
	kills: 0,
	
	selection: false, //выбранная башня
	
	tiles: false, // места для посадки башен
	map: {}, // выбранная карта
	
	
	
	hpinc: 1.3, 
	lives: 10,
	cash: 35000
};