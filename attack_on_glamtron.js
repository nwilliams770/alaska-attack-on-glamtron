
const game = new Game();

function init() {
	if(game.init())
		game.start();
}


var imageRepository = new function() {
	this.background = new Image();
	this.alaskaleft = new Image();
	this.alaskaright = new Image();
	this.alaskaup = new Image();
	this.alaskadown = new Image();
	this.glamtronian = new Image();


	var numImages = 6;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.background.onload = function() {
		imageLoaded();
	};
	this.alaskaleft.onload = function() {
		imageLoaded();
	};
	this.alaskaright.onload = function() {
		imageLoaded();
	};
	this.alaskaup.onload = function() {
		imageLoaded();
	};
	this.alaskadown.onload = function() {
		imageLoaded();
	};
	this.glamtronian.onload = function() {
		imageLoaded();
	};

	this.background.src = "assets/world.png";
	this.alaskaleft.src = "assets/alaskaleft.png";
	this.alaskaright.src = "assets/alaskaright.png";
	this.alaskaup.src = "assets/alaskaup.png";
	this.alaskadown.src = "assets/alaskadown.png";
	this.glamtronian.src = "assets/glamtronian.png";
};


function Drawable() {
	this.init = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.isColliding = false;
	};

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	this.draw = function() {
	};
	this.move = function() {
	};
}


function Background() {
  this.draw = function() {
    this.context.drawImage(imageRepository.background, 0, 0);
  };
}

Background.prototype = new Drawable ();

function Pool(maxSize) {
	var size = maxSize;
	var pool = [];

	this.init = function(object) {
		if (object == "glamtronian") {
			for (var i = 0; i < size; i++) {
				var glamtronian = new Glamtronian();
				glamtronian.init(0,0, imageRepository.glamtronian.width, imageRepository.glamtronian.height);
				pool[i] = glamtronian;
			}
		}
	};


	this.get = function(x, y, speed) {
		if(!pool[size - 1].alive) {
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
	};

	this.animate = function() {
		for (var i = 0; i < size; i++) {
			// Only draw until we find a bullet that is not alive
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
}

function QuadTree(boundBox, lvl) {
	var maxObjects = 10;
	this.bounds = boundBox || {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	var objects = [];
	this.nodes = [];
	var level = lvl || 0;
	var maxLevels = 5;

	/*
	 * Clears the quadTree and all nodes of objects
	 */
	this.clear = function() {
		objects = [];

		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].clear();
		}

		this.nodes = [];
	};

	/*
	 * Get all objects in the quadTree
	 */
	this.getAllObjects = function(returnedObjects) {
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].getAllObjects(returnedObjects);
		}

		for (var i = 0, len = objects.length; i < len; i++) {
			returnedObjects.push(objects[i]);
		}

		return returnedObjects;
	};

	/*
	 * Return all objects that the object could collide with
	 */
	this.findObjects = function(returnedObjects, obj) {
		if (typeof obj === "undefined") {
			console.log("UNDEFINED OBJECT");
			return;
		}

		var index = this.getIndex(obj);
		if (index != -1 && this.nodes.length) {
			this.nodes[index].findObjects(returnedObjects, obj);
		}

		for (var i = 0, len = objects.length; i < len; i++) {
			returnedObjects.push(objects[i]);
		}

		return returnedObjects;
	};

	/*
	 * Insert the object into the quadTree. If the tree
	 * excedes the capacity, it will split and add all
	 * objects to their corresponding nodes.
	 */
	this.insert = function(obj) {
		if (typeof obj === "undefined") {
			return;
		}

		if (obj instanceof Array) {
			for (var i = 0, len = obj.length; i < len; i++) {
				this.insert(obj[i]);
			}

			return;
		}

		if (this.nodes.length) {
			var index = this.getIndex(obj);
			// Only add the object to a subnode if it can fit completely
			// within one
			if (index != -1) {
				this.nodes[index].insert(obj);

				return;
			}
		}

		objects.push(obj);

		// Prevent infinite splitting
		if (objects.length > maxObjects && level < maxLevels) {
			if (this.nodes[0] == null) {
				this.split();
			}

			var i = 0;
			while (i < objects.length) {

				var index = this.getIndex(objects[i]);
				if (index != -1) {
					this.nodes[index].insert((objects.splice(i,1))[0]);
				}
				else {
					i++;
				}
			}
		}
	};

	/*
	 * Determine which node the object belongs to. -1 means
	 * object cannot completely fit within a node and is part
	 * of the current node
	 */
	this.getIndex = function(obj) {

		var index = -1;
		var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
		var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

		// Object can fit completely within the top quadrant
		var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
		// Object can fit completely within the bottom quandrant
		var bottomQuadrant = (obj.y > horizontalMidpoint);

		// Object can fit completely within the left quadrants
		if (obj.x < verticalMidpoint &&
				obj.x + obj.width < verticalMidpoint) {
			if (topQuadrant) {
				index = 1;
			}
			else if (bottomQuadrant) {
				index = 2;
			}
		}
		// Object can fix completely within the right quandrants
		else if (obj.x > verticalMidpoint) {
			if (topQuadrant) {
				index = 0;
			}
			else if (bottomQuadrant) {
				index = 3;
			}
		}

		return index;
	};

	/*
	 * Splits the node into 4 subnodes
	 */
	this.split = function() {
		// Bitwise or [html5rocks]
		var subWidth = (this.bounds.width / 2) | 0;
		var subHeight = (this.bounds.height / 2) | 0;

		this.nodes[0] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[1] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[2] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[3] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
	};
}



function Alaska() {
	this.speed = 3;
	var counter = 0;

	this.draw = function() {
		if (KEY_STATUS.left) {
			this.context.drawImage(imageRepository.alaskaleft, this.x, this.y);
		} else if (KEY_STATUS.right) {
			this.context.drawImage(imageRepository.alaskaright, this.x, this.y);
		} else if (KEY_STATUS.down){
			this.context.drawImage(imageRepository.alaskaup, this.x, this.y);
		} else {
			this.context.drawImage(imageRepository.alaskadown, this.x, this.y);
		}
	};
	this.move = function() {
		counter++;
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) {

			this.context.clearRect(this.x, this.y, this.width, this.height);


			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 5)
					this.x = 5;
			} else if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= 635 - this.width)
					this.x = 635 - this.width;
			} else if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= 5)
					this.y = 5;
			} else if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height - 3)
					this.y = this.canvasHeight - this.height - 3;
			}

			this.draw();
		}
	};
}
Alaska.prototype = new Drawable();



function Glamtronian () {
	this.alive = false;

	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = true;
		this.leftEdge = this.x - 40;
		this.rightEdge = this.x + 40;
	};

	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.x += this.speedX;
		this.y += this.speedY;



		if (this.x <= this.leftEdge) {
			this.speedX = this.speed;
		}
		else if (this.x >= this.rightEdge + this.width) {
			this.speedX = -this.speed;
		}


		this.context.drawImage(imageRepository.glamtronian, this.x, this.y);
	};

	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = false;
	};
}

Glamtronian.prototype = new Drawable ();



function Game() {

	this.init = function() {
		this.bgCanvas = document.getElementById('background');
		this.alaskaCanvas = document.getElementById('alaska');
		this.mainCanvas = document.getElementById('main');

		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.alaskaContext = this.alaskaCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');


			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			Alaska.prototype.context = this.alaskaContext;
			Alaska.prototype.canvasWidth = this.alaskaCanvas.width;
			Alaska.prototype.canvasHeight = this.alaskaCanvas.height;

			Glamtronian.prototype.context = this.mainContext;
			Glamtronian.canvasWidth = this.mainCanvas.width;
			Glamtronian.canvasHeight = this.mainCanvas.height;


			this.background = new Background();
			this.background.init(0,0);


			this.alaska = new Alaska();

			var alaskaStartX = this.alaskaCanvas.width/2 - imageRepository.alaskaup.width;
			var alaskaStartY = this.alaskaCanvas.height/4*3 + imageRepository.alaskaup.height*2;
			this.alaska.init(300, 300, imageRepository.alaskaup.width,
			               imageRepository.alaskaup.height);


			this.glamPool = new Pool (5);
			this.glamPool.init("glamtronian");
			var height = imageRepository.glamtronian.height;
			var width = imageRepository.glamtronian.width;
			var x = 100;
			var y = 30;
			var spacer = y * 1.5;
			for (var i = 1; i <= 5; i++) {
				this.glamPool.get(x,y,2);
				x += width + 25;
				y += height + 5;
				if (i % 6 == 0) {
					x = 100;
					y += spacer
				}
			}


			return true;
		} else {
			return false;
		}
	};


	this.start = function() {
		this.alaska.draw();
		animate();
	};
}



function animate() {
	requestAnimFrame( animate );
	game.background.draw();
	game.alaska.move();
	game.glamPool.animate();
}


// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};


KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}

document.onkeydown = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};

document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
};


/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();
