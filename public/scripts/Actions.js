'use strict'

const Actions = {

	fillTiles: (event) => {
		if(props.ticks === 0){
			props.map = {};
			props.tiles = {};
			props.map.id = Number(event.currentTarget.id.slice(4));
			props.map.path = Maps[props.map.id].path;

			//заполняем массив посадки башен
			props.map.path.map((t) => {
				return { 
					x: t.x, 
					y: t.y 
				};
			}).forEach((current, i, arr) => {
			
				let next = arr[i + 1] || current;
				let dx = next.x - current.x;
				let dy = next.y - current.y;
				
				if (Math.abs(dx) > Math.abs(dy)) {
					current.x += dx < 0 ? 21 : -16;
					dx = dx < 0 ? -1 : 1;
					while (current.x !== next.x) {
						current.x += dx;
						
						for (let i = -3; i <= 4; i++) {
							props.tiles[Math.round(current.x / 5) + "," + ((Math.round(current.y) / 5) + i)] = true;
						}
					}
				} else if (dy !== 0) {
					current.y += dy < 0 ? 21 : -16;
					dy = dy < 0 ? -1 : 1;
					
					while (current.y !== next.y) {
						current.y += dy;
						
						for (let i = -3; i <= 4; i++) {
							props.tiles[((Math.round(current.x) / 5) + i) + "," + Math.round(current.y / 5)] = true;
						}
					}
				}
				
			})

			Render.drawMap(props.map.path, canvas);
		}
	},

	build: (type) => {
	
		let tower_data = Towers.list[type];

		let tower = {
			x: -1000,
			y: -1000,
			levels: {
				range: 0,
				rate: 0,
				damage: 0
			},
			kills: 0,
			lastshot: 0,
			img: document.querySelectorAll(".tower_img")[type],
			index: props.towers.length
		};
		
		for (let k in tower_data) {
			tower[k] = tower_data[k];
		}
		
		props.selection = props.cash - tower_data.cost >= 0 ? {
			status: "placing",
			tower: tower,
			placeable: false
		} : false;
		
	},

	start_pause: (event) => {
		if(props.lives && props.tiles){
			document.getElementById("console").innerHTML = "";
			if(props.paused){
				event.currentTarget.textContent = "Pause";
				Render.startgame();
			}else{
				event.currentTarget.textContent = "Start";
				Render.pausegame();
			}
		}
	}, 

	reset: () => {
		window.location.reload()
	},

	faster: (event) => {
		if (!props.paused) {
			if(props.fast){
				event.currentTarget.style.backgroundColor = "#F4A460";
				props.fast = false;
			}else{
				event.currentTarget.style.backgroundColor = "#008080";
				props.fast = true;
			}
			Render.pausegame();
			Render.startgame();
		}
	}, 
	
	addWave: () => {
		if (!props.paused) {
			props.wave_time = props.ticks - 1200;
		}
	},
	
	mousemove_canvas: (event) => {
		let selection = props.selection;
		let tower = selection.tower;
		if (selection && selection.status !== "selected") {
			let tx = Math.ceil((event.pageX - event.currentTarget.offsetLeft) / 5);
			let ty = Math.ceil((event.pageY - event.currentTarget.offsetTop) / 5);
			tower.x = (tx * 5) - 2.5;
			tower.y = (ty * 5) - 2.5;
			selection.placeable = tx >= 3 && tx <= 158 && ty >= 3 && ty <= 98;
			
			for (let i = 5; i--;) {
				for (let ii = 5; ii--;) {
					if (props.tiles[(tx + i - 2) + "," + (ty + ii - 2)]) {
						selection.placeable = false;
						return;
					}
				}
			}
		}
	},

	deselect: () => {
		if (props.selection.status === "moving") {
			let tower = props.selection.tower;
			props.towers[tower.index] = tower;
			
			tower.x = tower._x;
			tower.y = tower._y;
			
			let tx = (tower.x + 2.5) / 5, ty = (tower.y + 2.5) / 5;
			for (let i = 5; i--;) {
				for (let ii = 5; ii--;) {
					props.tiles[(tx + i - 2) + "," + (ty + ii - 2)] = tower;
				}
			}
		}
		props.selection = false;
	},

	click_canvas: (event) => {
		let selection = props.selection;

		let tower = selection.tower;
		let tile = props.tiles[Math.ceil((event.pageX - event.currentTarget.offsetLeft) / 5) + "," + Math.ceil((event.pageY - event.currentTarget.offsetTop) / 5)];
		
		if (selection.status === "moving") {
			if (selection.placeable && props.cash - 90 >= 0) {
				props.cash -= 90;
				props.towers[tower.index] = tower;
				
				let tx = (tower.x + 2.5) / 5, ty = (tower.y + 2.5) / 5;
				for (var i = 5; i--;) {
					for (var ii = 5; ii--;) {
						props.tiles[(tx + i - 2) + "," + (ty + ii - 2)] = tower;
					}
				}
				props.selection = false;
			}
		} else if (selection.status === "placing") {

			if (selection.placeable) {

				props.cash -= tower.cost;
				props.spent += tower.cost;
				props.towers.push(tower);
				
				let tx = (tower.x + 2.5) / 5, ty = (tower.y + 2.5) / 5;
				for (let i = 5; i--;) {
					for (let ii = 5; ii--;) {
						props.tiles[(tx + i - 2) + "," + (ty + ii - 2)] = tower;
					}
				}
				props.selection = false;
			}
		} else if (typeof tile === "object") {
			props.selection = {
				status: "selected",
				tower: tile
			};
		} else {
			Actions.deselect();
		}
	}, 

	move: () => {
		if (props.selection.status === "selected" && props.cash - 90 >= 0) {
			let tower = props.selection.tower;
			
			props.selection = {
				status: "moving",
				tower: tower,
				placeable: true
			};
			
			tower._x = tower.x;
			tower._y = tower.y;
			
			let tx = (tower._x + 2.5) / 5, ty = (tower._y + 2.5) / 5;
			for (let i = 5; i--;) {
				for (let ii = 5; ii--;) {
					props.tiles[(tx + i - 2) + "," + (ty + ii - 2)] = false;
				}
			}
			
			delete props.towers[tower.index];
		}
	},

	sell: () => {
		if(props.selection.status === 'selected'){
			let tower = props.selection.tower, value = Math.round(tower.cost * 0.7);
			props.cash += value;
			props.spent -= value;
			
			let tx = (tower.x + 2.5) / 5, ty = (tower.y + 2.5) / 5;

			for (let i = 5; i--;) {
				for (let ii = 5; ii--;) {
					props.tiles[(tx + i - 2) + "," + (ty + ii - 2)] = false;
				}
			}
			props.selection = false;
			delete props.towers[tower.index];
		}
	},

	upgrade: (stat) => {
		let tower = props.selection.tower;
		let levels = tower.levels;
		let level = levels[stat];
		let cost = Towers.upgrades[level];
		
		if (props.selection.status === "selected" && cost && props.cash - cost >= 0) {
			levels[stat]++;
			tower[stat] = tower.upgrades[level][stat];
			levels.full = levels.damage === 10 && levels.rate === 10 && levels.range === 10;
			tower.cost += cost;
			props.cash -= cost;
			props.spent += cost;
		}
	},
	// not enough loop
	refresh: () => {
		if (props.selection.status === 'selected') {
			let tower = props.selection.tower;
			let costs = Towers.upgrades;
			let levels = tower.levels;
			document.getElementById("img_stat").innerHTML = '<img class="tower_img" src="' + tower.img.src + '" width="25" height="25">';
			document.getElementById("damage_stat").innerHTML = 'Damage: ' + tower.upgrades[levels['damage']]['damage'] + '(' + levels['damage'] + ')';
			document.getElementById("rate_stat").innerHTML = 'Rate: ' + tower.upgrades[levels['rate']]['rate'] + '(' + levels['rate'] + ')';
			document.getElementById("range_stat").innerHTML = 'Range: ' + tower.upgrades[levels['range']]['range'] + '(' + levels['range'] + ')';

			document.getElementById("damage").innerHTML = 'Damage('+ costs[levels['damage']] + ')';
			document.getElementById("rate").innerHTML ='Rate('+ costs[levels['rate']] + ')';
			document.getElementById("range").innerHTML ='Range('+ costs[levels['range']] + ')';
			document.getElementById("move").innerHTML = 'Move(90)'
			document.getElementById("sell").innerHTML ='Sell(' + Math.round(tower.cost * 0.7) + ')';
		}else{
			if(props.selection.status === 'placing'){
				let tower = props.selection.tower;
				let levels = tower.levels;
				document.getElementById("img_stat").innerHTML = '<img class="tower_img" src="' + tower.img.src + '" width="25" height="25">';
				document.getElementById("damage_stat").innerHTML = 'Damage: ' + tower.upgrades[levels['damage']]['damage'];
				document.getElementById("rate_stat").innerHTML = 'Rate: ' + tower.upgrades[levels['rate']]['rate'];
				document.getElementById("range_stat").innerHTML = 'Range: ' + tower.upgrades[levels['range']]['range'];
			}else{
				if(props.selection === false){
					document.getElementById("img_stat").innerHTML = '-';
					document.getElementById("damage_stat").innerHTML = 'Damage: -';
					document.getElementById("rate_stat").innerHTML = 'Rate: -';
					document.getElementById("range_stat").innerHTML = 'Range: -';

					document.getElementById("damage").innerHTML = 'Damage';
					document.getElementById("rate").innerHTML ='Rate';
					document.getElementById("range").innerHTML ='Range';
					document.getElementById("move").innerHTML = 'Move'
					document.getElementById("sell").innerHTML ='Sell';
				}
			}
		}
	},
	esc: (event) =>{
		if(event.keyCode == '27'){
			Actions.deselect();
			Actions.refresh();
		}
	},
	esc_click: (event) => {
		if(event.target.className !== "tower_img" && event.target.className !== 'shop_button' && event.target.id !== 'canvas'){
			Actions.deselect();
		}
	},
	//not enough loop
	load: ()=>{
		Enemies.loadImg();

		Render.maps_menu();

		const choose_map = (() => {
			const list_map = document.querySelectorAll('.maps_menu');
			let button;
			for(let i = 0; i < list_map.length; i++){
				button = list_map[i];
				button.addEventListener('click', Actions.fillTiles)
			}
		})();

		const choose_tower = (() => {
			const list_tower = document.querySelectorAll('.tower_img');
			let button;
			for(let i = 0; i < list_tower.length; i++){
				button = list_tower[i];
				button.addEventListener('click', () => {
					if (!props.paused) {
			 		Actions.build(i);
				 	}
				})
			}
		})();

		document.addEventListener("click", Actions.refresh);
		document.getElementById("damage").addEventListener("click", (event) => {
			Actions.upgrade('damage');
		});
		document.getElementById("rate").addEventListener("click", (event) => {
			Actions.upgrade('rate');
		});
		document.getElementById("range").addEventListener("click", (event) => {
			Actions.upgrade('range');
		});
		document.getElementById("move").addEventListener("click", Actions.move);
		document.getElementById("sell").addEventListener("click", Actions.sell);
		document.addEventListener('keydown', Actions.esc);
		document.addEventListener("click", Actions.esc_click);
		document.getElementById("canvas").addEventListener("mousemove", Actions.mousemove_canvas);
		document.getElementById("canvas").addEventListener("click", Actions.click_canvas);
		document.getElementById("start_button").addEventListener('click', Actions.start_pause);
		document.getElementById("add_button").addEventListener("click", Actions.addWave); 
		document.getElementById("fast_button").addEventListener("click", Actions.faster);
		document.getElementById("reset_button").addEventListener("click", Actions.reset);
	}
}





