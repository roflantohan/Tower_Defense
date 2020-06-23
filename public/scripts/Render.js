'use strict'

const Render = {

	displayProps: () => {
		document.getElementById("time_button").innerHTML = "Time: " + Math.floor(12 - ((props.ticks - props.wave_time) / 100));
		document.getElementById("cash_button").innerHTML = "Cash: " + props.cash;
		document.getElementById("lives_button").innerHTML ="Lives: " + props.lives ; 
		document.getElementById("wave_button").innerHTML = "Wave: " + props.wave;

		document.getElementById("kills_stat").innerHTML = "Kills: " + props.kills;
		document.getElementById("spent_stat").innerHTML = "Spent: " + props.spent;
		document.getElementById("score_stat").innerHTML = "Score: " + (props.kills * props.spent);
	},
	//add stack of enemies by 1200 ms
	newWave: () => {
		if (props.wave_time + 1200 === props.ticks) {

			props.wave++;

			for (let i = 1; i <= 10; i++) {
				let typeCreep = Math.rand(3);
				props.enemies.push({
					x: -(i * 20) - 10,
					y: props.map.path[0].y,
					offset: Math.rand(14),
					nextpoint: 0,
					speed: Enemies.enemyTypes[typeCreep].speed,
					hp: Enemies.enemyTypes[typeCreep].hp*props.hpinc,
					cash: props.wave*Enemies.enemyTypes[typeCreep].cash,
					img: Enemies.enemy_img[typeCreep],
					id: Enemies.enemyTypes[typeCreep].id
				});

			}
			
			props.wave_time = props.ticks;
		}
	},

	drawCreeps: () => {
		props.enemies.forEach((enemy, i, arr) => {
			if (enemy.hp <= 0) {
				props.kills++;
				props.cash += enemy.cash;
				props.cash = Math.floor(props.cash)
				delete arr[i];
			} else if (enemy.nextpoint === props.map.path.length) {
				delete arr[i];
				props.lives--;
				if (!props.lives) {
					Render.endgame();
				}
			} else {
				let waypoint = props.map.path[enemy.nextpoint];
				if (Math.move(enemy, { x: waypoint.x - 7 + enemy.offset, y: waypoint.y - 7 + enemy.offset }, enemy.speed)) {
					enemy.nextpoint++;
				}
				canvas.drawImage(enemy.img, enemy.x -5, enemy.y - 5, 10, 10);
			}

		});
	},

	drawTowers: () => {
		//draw towers which are on the field
		props.towers.forEach((tower) => {
			if (tower.lastshot + tower.rate <= props.ticks) {
				let enemies = props.enemies.filter((enemy) => {
					return Math.inRadius(enemy, tower, tower.range);
				});
				
				if (enemies.length > 0) {
					tower.shoot(enemies, tower);
					tower.lastshot = props.ticks;
				}
			}
			
			canvas.drawImage(tower.img, tower.x - 12.5, tower.y - 12.5);
		});
		//installing towers on the field
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
		props.run.forEach((shoot, i, arr) => {
			if (shoot.drawShoot() === false || --shoot.live_time === 0) {
				delete arr[i];
			}
		});
	},

	drawMap: (map, canvas) => {
		const start = map[0];
		//background
		canvas.fillStyle = "#008080";
		canvas.fillRect(0, 0, 800, 500);
		//first line
		canvas.lineWidth = 40;	
		canvas.strokeStyle = "#8B4513";
		canvas.beginPath();
		canvas.moveTo(start.x, start.y);
		map.forEach((cur) => {
			canvas.lineTo(cur.x, cur.y);
		});
		canvas.stroke();
		//second line
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
		props.ticker = window.setInterval(() => {Render.drawAll()}, 1000 / (props.fast ? 180 : 60));
		props.paused = false;
	},

	pausegame: () => {
		window.clearInterval(props.ticker);
		props.paused = true;
	},

	endgame: () => {
		Render.pausegame();
		document.getElementById("console").innerHTML = "Game over((((<br>(click 'Reset' and play again)";
	},
	//draw all maps in right bar
	maps_menu: () => {
		document.getElementById("console").innerHTML = "Choose the map and click 'Start'";
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



