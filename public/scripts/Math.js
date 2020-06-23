'use strict'

//pow() are slower than x*x
Math.inRadius = (target, obj, rad) => {
	return (obj.x - target.x)*(obj.x - target.x) + (obj.y - target.y)*(obj.y - target.y) < rad*rad;
};
//limit of return go to zero
Math.move = (obj, target, speed) => {
	let distx = target.x - obj.x;
	let disty = target.y - obj.y;
	let angle = Math.atan2(disty, distx);
	
	obj.x += speed * Math.cos(angle);
	obj.y += speed * Math.sin(angle);
	
	return (distx < 0 ? -distx : distx) + (disty < 0 ? -disty : disty) < 2;
};
//random number by 0 to max+1
Math.rand = (max) => {
	return Math.floor(Math.random() * (max+1));
}
