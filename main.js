function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}


function Guy(game) {
	
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 0, 64, 32, 32, 0.05, 3, true, false);
	this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 0, 64, 32, 32, 0.02, 3, true, false);
	
	this.animationS = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 0, 0, 32, 32, 0.06, 3, true, false);
	this.animationSW = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 96, 0, 32, 32, 0.06, 3, true, false);
	this.animationW = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 0, 32, 32, 32, 0.06, 3, true, false);
	this.animationNW = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 96, 32, 32, 32, 0.06, 3, true, false);
	this.animationN = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 0, 96, 32, 32, 0.06, 3, true, false);
	this.animationNE = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 96, 96, 32, 32, 0.06, 3, true, false);
	this.animationE = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 0, 64, 32, 32, 0.06, 3, true, false);
	this.animationSE = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 96, 64, 32, 32, 0.06, 3, true, false);
	this.direction = "S";
	this.moving = false;
	this.jumping = false;
	this.location = {x:250, y:250};
    this.radius = 100;
    this.ground = 400;
	Entity.call(this, game, 250, 250);
}

Guy.prototype = new Entity();
Guy.prototype.constructor = Guy;

//function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {

Guy.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    
	this.direction = this.game.direction;
    this.moving = this.game.moving;
    if (this.moving) {
		var factor = 3;
		
		if (this.direction == "S") {
			//~ var moveDist = this.animationS.elapsedTime / this.animationS.totalTime;
			this.y += factor;
		} else if (this.direction == "N") {
			//~ var moveDist = this.animationN.elapsedTime / this.animationN.totalTime;
			this.y -= factor;
		} else if (this.direction == "W") {
			//~ var moveDist = this.animationW.elapsedTime / this.animationW.totalTime;
			this.x -= factor;
		} else if (this.direction == "E") {
			//~ var moveDist = this.animationE.elapsedTime / this.animationE.totalTime;
			this.x += factor;
		} else if (this.direction == "NW") {
			//~ var moveDist = this.animationNW.elapsedTime / this.animationNW.totalTime;
			//~ var moveDist2 = Math.sqrt(Math.pow(factor, 2) / 2);
			//~ this.x -= moveDist2;
			//~ this.y -= moveDist2;
			this.x -= factor/1.5;
			this.y -= factor/1.5;
		} else if (this.direction == "NE") {
			//~ var moveDist = this.animationNE.elapsedTime / this.animationNE.totalTime;
			//~ var moveDist2 = Math.sqrt(Math.pow(factor, 2) / 2);
			//~ this.x += moveDist2;
			//~ this.y -= moveDist2;
			this.x += factor/1.5;
			this.y -= factor/1.5;
		} else if (this.direction == "SW") {
			//~ var moveDist = this.animationSW.elapsedTime / this.animationSW.totalTime;
			//~ var moveDist2 = Math.sqrt(Math.pow(factor, 2) / 2);
			//~ this.x -= moveDist2;
			//~ this.y += moveDist2;
			this.x -= factor/1.5;
			this.y += factor/1.5;
		}else if (this.direction == "SE") {
			//~ var moveDist = this.animationSE.elapsedTime / this.animationSE.totalTime;
			//~ var moveDist2 = Math.sqrt(Math.pow(factor, 2) / 2);
			//~ this.x += moveDist2;
			//~ this.y += moveDist2;
			this.x += factor/1.5;
			this.y += factor/1.5;
		}
		//~ console.log("moving" + this.direction);
		//~ console.log(this.location.x + ", " + this.location.y);
	}
    
    Entity.prototype.update.call(this);
}

Guy.prototype.draw = function (ctx) {
    //~ if (this.jumping) {
        //~ this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
    //~ }
    //~ else {
        //~ this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    //~ }
    
    if (this.direction == "S") {
		this.animationS.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	} else if (this.direction == "SW") {
		this.animationSW.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	} else if (this.direction == "W") {
		this.animationW.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	} else if (this.direction == "NW") {
		this.animationNW.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	} else if (this.direction == "N") {
		this.animationN.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	} else if (this.direction == "NE") {
		this.animationNE.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	} else if (this.direction == "E") {
		this.animationE.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	} else if (this.direction == "SE") {
		this.animationSE.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	} else {
		this.animationS.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	}
	
	
    Entity.prototype.draw.call(this);
}





///////////////////////////////////////////////////////////////








function Unicorn(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 618, 334, 174, 138, 0.02, 40, false, true);
    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 400);
}

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/RobotUnicorn.png");
ASSET_MANAGER.queueDownload("./img/guy.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var unicorn = new Unicorn(gameEngine);
    var guy = new Guy(gameEngine);

    gameEngine.addEntity(bg);
    //~ gameEngine.addEntity(unicorn);
    gameEngine.addEntity(guy);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
