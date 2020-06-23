'use strict'

export const Render = {

	displayProps: () => {
		document.getElementById("time_button").innerHTML = "Time: " + Math.floor(12 - ((props.ticks - props._wave) / 100));
		document.getElementById("cash_button").innerHTML = "Cash: " + props.cash;
		document.getElementById("lives_button").innerHTML ="Lives: " + props.lives ; 
		document.getElementById("wave_button").innerHTML = "Wave: " + props.wave;

		document.getElementById("kills_stat").innerHTML = "Kills: " + props.kills;
		document.getElementById("spent_stat").innerHTML = "Spent: " + props.spent;
		document.getElementById("score_stat").innerHTML = "Score: " + (props.kills * props.spent);
	},

	newWave: () => {
		
		if (props._wave + 1200 === props.ticks) {

			props.wave++;
			props.hpinc = { 10: 1.2, 25: 1.1, 50: 1.06, 100: 1.04, 150: 1.02, 200: 1.01 }[props.wave] || props.hpinc;

			for (let i = 1; i <= 10; i++) {
				let typeCreep = Math.rand(3);
				props.creeps.push({
					x: -(i * 20) - 10,
					y: props.map.path[0].y,
					offset: Math.rand(14),
					nextpoint: 0,
					burning: false,
					slowfor: 0,
					speed: Enemies.enemyTypes[typeCreep].speed,
					hp: Enemies.enemyTypes[typeCreep].hp*props.hpinc,
					_hp: Enemies.enemyTypes[typeCreep].hp*props.hpinc,
					cash: props.wave*Enemies.enemyTypes[typeCreep].cash,
					img: Enemies.enemyTypes[typeCreep].img,
					id: Enemies.enemyTypes[typeCreep].id
				});


			}
			
			props._wave = props.ticks;
		}
	},

	drawCreeps: () => {
		props.creeps.forEach(function (creep, i, a) {
			let _hp = creep.hp;
			let burning = creep.burning;
			if (burning) {
				creep.hp -= 30;
			}
			if (creep.hp <= 0) {
				if (_hp > 0) {
					burning.kills++;
				}
				props.kills++;
				props.cash += creep.cash;
				props.cash = Math.floor(props.cash)
				delete a[i];
			} else if (creep.nextpoint === props.map.path.length) {
				delete a[i];
				props.lives--;
				
				if (!props.lives) {
					Render.endgame();
				}
			} else {
				if (--creep.slowfor <= 0) {
					creep.speed = Enemies.enemyTypes[creep.id].speed;
				}
				let waypoint = props.map.path[creep.nextpoint];
				if (Math.move(creep, { x: waypoint.x - 7 + creep.offset, y: waypoint.y - 7 + creep.offset }, creep.speed)) {
					creep.nextpoint++;
				}
				canvas.drawImage(creep.img, creep.x -5, creep.y - 5, 10, 10);
			}

		});
	},

	drawTowers: () => {
		//отрисовка уже установленных башен
		props.towers.forEach((tower) => {
			if (tower.lastshot + tower.rate <= props.ticks) {
				let creeps = props.creeps.filter((creep) => {
					return Math.inRadius(creep, tower, tower.range);
				});
				
				if (creeps.length > 0) {
					tower.shoot(creeps, tower);
					tower.lastshot = props.ticks;
				}
			}
			
			canvas.drawImage(tower.img, tower.x - 12.5, tower.y - 12.5);
		});
		// установка башни на карте
		let selection = props.selection;
		let tower = selection.tower;
		if (selection) {
			canvas.beginPath();
			canvas.fillStyle = selection.status === "selected" || selection.placeable ? "rgba(255, 255, 255, .3)" : "rgba(255, 0, 0, .3)";
			canvas.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2, true);
			canvas.fill();
			canvas.drawImage(tower.img, tower.x - 12.5, tower.y - 12.5);
		}
	},
	drawShoots: () => {
		props.run.forEach((something, i, a) => {
			if (something.what() === false || --something.until === 0) {
				delete a[i];
			}
		});
	},
	drawMap: (map, canvas) => {
		const start = map[0];
		canvas.fillStyle = "#008080";
		canvas.fillRect(0, 0, 800, 500);
		canvas.lineWidth = 40;	
		canvas.strokeStyle = "#8B4513";
		canvas.beginPath();
		canvas.moveTo(start.x, start.y);
		map.forEach((cur) => {
			canvas.lineTo(cur.x, cur.y);
		});
		canvas.stroke();
		canvas.lineWidth = 30;
		canvas.strokeStyle = "#CD853F";
		canvas.beginPath();
		canvas.moveTo(start.x, start.y);
		map.forEach(function (cur, i) {
			canvas.lineTo(cur.x, cur.y);
		});
		canvas.stroke();
	},

	drawAll: () => {
		Render.displayProps();
		Render.newWave();
		Render.drawMap(props.map.path, canvas);
		Render.drawCreeps();
		Render.drawTowers();
		Render.drawShoots();
		props.ticks++;
	},

	startgame: () => {
		props._ticks = props.ticks;
		props._tick = Date.now();
		props.ticker = window.setInterval(() => {Render.drawAll()}, 1000 / (props.fast ? 180 : 60));
		props.paused = false;
		Render.drawAll();
	},

	pausegame: () => {
		window.clearInterval(props.ticker);
		props.paused = true;
	},

	endgame: () => {
		Render.pausegame();
		document.getElementById("console").innerHTML = "Game over";
	},

	maps_menu: () => {
		document.getElementById("console").innerHTML = "Choose the map";
		let context = [];
		Maps.forEach((elem, i) => {
			document.getElementById("list_map").innerHTML += '<br><canvas class="maps_menu" id="map_'+ i + '" width="800" height="500"></canvas><br><br>';
		})
		Maps.forEach((elem, i) => {
			context[i] = document.getElementById("map_" + i).getContext('2d');
			Render.drawMap(Maps[i].path, context[i]);
		});
	}
}	



