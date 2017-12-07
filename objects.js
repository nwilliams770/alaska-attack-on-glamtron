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
	this.collidableWith = "";
	this.isColliding = false;
	this.type = "";
}


function Background() {
  this.draw = function() {
    this.context.drawImage(imageRepository.background, 0, 0);
  };
}

Background.prototype = new Drawable ();

function Pool(maxSize) {
	const size = maxSize;
	const pool = [];

	this.init = function(object) {
		if (object == "glamtronian") {
			for (let i = 0; i < size; i++) {
				const glamtronian = new Glamtronian();
				glamtronian.init(0,0, imageRepository.glamtronian.width, imageRepository.glamtronian.height);
				pool[i] = glamtronian;
			}
		}
	};


	this.get = function(x, y, speed) {
		if(!pool[size - 1].alive) {
			pool[size - 1].spawn(x, y);
			pool.unshift(pool.pop());
		}
	};

	this.animate = function() {
		for (var i = 0; i < size; i++) {
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

	this.getPool = function () {
		let obj = [];
		for (let i = 0; i < size; i++) {
			if (pool[i].alive) {
				obj.push(pool[i]);
			}
		}
		return obj;
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
	this.collidableWith = "glamtronian";
	this.type = "alaska";

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
	this.collidableWith = "alaska";
	this.type = "glamtronian";

	this.spawn = function(x, y) {
		this.x = x;
		this.y = y;
		this.speed = 3;
		this.alive = true;
	};


	this.between = function (x, y, target) {
		if (target >= x && target <= y) {
			return true;
		}
	};

	this.dropped = function (x, y) {
		if (this.between(500, 640, this.x) && this.between(195, 240, this.y)) {
			game.toBeRescued -= 1;
			this.context.clearRect(this.x, this.y, this.width, this.height);
			return true;
		} else {
			return false;
		}
	};

	this.checkBorder = function () {
		if (this.x >= 580) {
			this.x = 580;
		} else if (this.x <= 5) {
      this.x = 5;
    }

		if (this.y <= 5) {
			this.y = 5;
		} else if (this.y >= 420) {
			this.y = 420;
		}
	};

	this.checkRocketBorder = function () {
		if (this.x >= 450 && this.y <= 200) {
			this.x = 450;
			this.y = this.y;
		}
	};


	this.draw = function() {
		if (this.isColliding) {
			// debugger
			if (this.dropped()) {
				return true;
			}
			this.checkRocketBorder();
			this.checkBorder();
			this.context.clearRect(this.x, this.y, this.width, this.height);

			if (this.x > game.alaska.x + 10) {
				// debugger
				this.isColliding = false;
				this.x += 3;
				this.context.drawImage(imageRepository.glamtronian, this.x, this.y);
			} else if (this.x + 10 < game.alaska.x ) {
				// debugger
				this.isColliding = false;
				this.x -= 3;
				this.context.drawImage(imageRepository.glamtronian, this.x, this.y);
			} else if (this.y < game.alaska.y) {
				this.isColliding = false;
				this.y -= 3;
				this.context.drawImage(imageRepository.glamtronian, this.x, this.y);
			} else if (this.y > game.alaska.y) {
				this.isColliding = false;
				this.y += 3;
				this.context.drawImage(imageRepository.glamtronian, this.x, this.y);
			}
				// this.x =- this.speed;
			// } else if (this.x < game.alaska.x) {
			// 	this.x = game.alaska.x + 10;
			// 	this.context.drawImage(imageRepository.glamtronian, this.x, this.y);
			// 	this.isColliding = false;
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
