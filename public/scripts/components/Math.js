'use strict'

export Math.inRadius = (target, obj, rad) => {
	return (obj.x - target.x)*(obj.x - target.x) + (obj.y - target.y)*(obj.y - target.y) < rad*rad;
};

export Math.move = (obj, target, speed) => {
	var distx = target.x - obj.x;
	var disty = target.y - obj.y;
	var angle = Math.atan2(disty, distx);
	
	obj.x += speed * Math.cos(angle);
	obj.y += speed * Math.sin(angle);
	
	return (distx < 0 ? -distx : distx) + (disty < 0 ? -disty : disty) < 2;
};

export Math.rand = (max) => {
	return Math.floor(Math.random() * (max+1));
}
