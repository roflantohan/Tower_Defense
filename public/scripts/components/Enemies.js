'use strict'

export Enemies = {
    enemy_img: [],
    
    enemyTypes: [
        {
            id: 0,
            name: 'enemy_0',
            hp: 2,
            speed: 1.1,
            cash: 1,
        },
        {
            id: 1,
            name: 'enemy_1',
            hp: 5,
            speed: 1.2,
            cash: 1.3,
        },
        {
            id: 2,
            name: 'enemy_2',
            hp: 7,
            speed: 1.05,
            cash: 1.4,
        },
        {
            id: 3,
            name: 'enemy_3',
            hp: 10,
            speed: 1.025,
            cash: 1.7,
        }
    ],
    loadImg : () => {
        for(let i = 0; i < Enemies.enemyTypes.length; i++){
            Enemies.enemy_img[i] = new Image();
            Enemies.enemy_img[i].src = "./img/" + Enemies.enemyTypes[i].name + ".png";
            Enemies.enemyTypes[i].img = Enemies.enemy_img[i];
        }
    }
}
