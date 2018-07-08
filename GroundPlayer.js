class GroundPlayer extends GameObject{
    constructor(world, x, y, w, h, hp) {
        super(world);
        this.hp = hp;
        this.jumpCooldown = 50;
        this.jumpCounter = 0;
        this.world = world;
        this.onGround = false;
        // make sensor
        this.addChild(new PlayerSensor(world, this, x, y, w - 3, w - 3));
        // make body
        this.body = Bodies.rectangle(x, y, w, h, {friction: 0.5});
        this.body.prnt = this;
        World.add(world, this.body);
    }
    setKeysDown(keysDown) {
        this.keysDown = keysDown;
    }
    onCollide(other) {
        // this.onGround = true;
    }
    handleKeyboard(keysDown) {
        if (keysDown[KEY_W] && this.canJump()) {
            this.jump();
        } else if (keysDown[KEY_S]) {
            this.body.force.y += 0.005;
        } else if (keysDown[KEY_A] && this.body.velocity.x > -5) {
            this.body.force.x -= this.onGround ? 0.003 : 0.0005;
        } else if (keysDown[KEY_D] && this.body.velocity.x < 5) {
            this.body.force.x += this.onGround ? 0.003 : 0.0005;
        }
    }
    canJump() {
        return (this.onGround > 0 && (this.jumpCounter === 0));
    }
    jump() {
        this.body.force.y -= 0.015;
        this.jumpCounter = this.jumpCooldown;
    }
    
    beforeTick() {
        // input
        this.handleKeyboard(this.keysDown);
        // update whether player is on ground
        this.jumpCounter = Math.max(0, this.jumpCounter - 1);
        this.onGround = Math.max(0, this.onGround - 1);
        console.log('jump ctr', this.jumpCounter);
        this.recurse('beforeTick', false);
    }
    afterTick() {
        // player angle
        Body.setAngle(this.body, clamp(this.body.angle, degToRad(0), degToRad(-0)));
        this.recurse('afterTick', false);
    }
}

class PlayerSensor extends GameObject{
    constructor(world, prnt, x, y, w, h) {
        super(world, prnt);
        this.body = Bodies.rectangle(x, y, w, h, {isSensor: true});
        this.body.prnt = this;
        // put into world
        World.add(world, this.body);
    }
    onCollide(other) {
        if (other != this.prnt) {
            this.prnt.onGround = 10;
        }
    }
    afterTick() {
        // set sensor velocity to zero so it collides properly
        Matter.Body.setVelocity(this.body, {
            x: 0,
            y: 0
        });
        // move sensor to below the player
        Body.setPosition(this.body, {
            x: this.prnt.body.position.x,
            y: this.prnt.body.position.y + 20
        });
    }
    beforeTick() {
    }
}
