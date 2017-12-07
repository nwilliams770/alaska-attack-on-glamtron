
function clearTitle() {
		document.getElementById("title-screen").style.visibility = "hidden";
}

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
			this.alaska.init(100, 300, imageRepository.alaskaup.width,
			               imageRepository.alaskaup.height);


			this.rescued = 0;
			this.toBeRescued = 5;

			this.glamPool = new Pool (this.toBeRescued);
			this.glamPool.init("glamtronian");
			var height = imageRepository.glamtronian.height;
			var width = imageRepository.glamtronian.width;
			var x = 100;
			var y = 30;
			var spacer = y * 1.5;
			for (var i = 1; i <= 5; i++) {
				this.glamPool.get(x,y);
				x += width + 25;
				y += height + 5;
				if (i % 6 == 0) {
					x = 100;
					y += spacer
				}
			}
			this.quadTree = new QuadTree({x:0,y:0,width:this.mainCanvas.width,height:this.mainCanvas.height});

			return true;
		} else {
			return false;
		}
	};

	this.start = function() {
		this.alaska.draw();
		animate();
	};

	this.gameOver = function() {
		document.getElementById("game-over").style.display = "block";
	};

	this.restart = function() {
		document.getElementById("game-over").style.display = "none";
		this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
		this.alaskaContext.clearRect(0, 0, this.alaskaCanvas.width, this.alaskaCanvas.height);
		this.mainContext.clearRect(0 ,0, this.mainCanvas.width, this.mainCanvas.height);

		this.quadTree.clear();

		this.background.init(0,0);
		this.alaska.init(100, 300, imageRepository.alaskaup.width,
			imageRepository.alaskaup.height);
		this.glamPool.init("glamtronian");
		this.toBeRescued = 5;

		this.start();

	};
}



function animate() {
	document.getElementById('score').innerHTML = game.toBeRescued;
	game.quadTree.clear();
	game.quadTree.insert(game.alaska);
	game.quadTree.insert(game.glamPool.getPool());
	detectCollision();

	requestAnimFrame( animate );
	game.background.draw();
	game.alaska.move();
	game.glamPool.animate();
}

function detectCollision() {
	var objects = [];
	game.quadTree.getAllObjects(objects);


	for (var x = 0, len = objects.length; x < len; x++) {
		game.quadTree.findObjects(obj = [], objects[x]);

		for (y = 0, length = obj.length; y < length; y++) {

			// DETECT COLLISION ALGORITHM
			if (objects[x].collidableWith === obj[y].type &&
				(objects[x].x < obj[y].x + obj[y].width &&
			     objects[x].x + objects[x].width > obj[y].x &&
				 objects[x].y < obj[y].y + obj[y].height &&
				 objects[x].y + objects[x].height > obj[y].y)) {
				objects[x].isColliding = true;
				obj[y].isColliding = true;
			}
		}
	}
}

const game = new Game();

function init() {
	if(game.init())
		game.start();
}


const imageRepository = new function() {
	this.background = new Image();
	this.alaskaleft = new Image();
	this.alaskaright = new Image();
	this.alaskaup = new Image();
	this.alaskadown = new Image();
	this.glamtronian = new Image();


	let numImages = 6;
	let numLoaded = 0;
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
