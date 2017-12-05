
var game = new Game();

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

	this.bullet = new Image();

	var numImages = 7;
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
	this.glamtronian.onload = function () {
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

function Glamtronian() {
	this.herded = false;

	this.spawn = function (x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		
	};
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


			this.background = new Background();
			this.background.init(0,0);


			this.alaska = new Alaska();

			var alaskaStartX = this.alaskaCanvas.width/2 - imageRepository.alaskaup.width;
			var alaskaStartY = this.alaskaCanvas.height/4*3 + imageRepository.alaskaup.height*2;
			this.alaska.init(300, 300, imageRepository.alaskaup.width,
			               imageRepository.alaskaup.height);

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
