class Player {
    constructor(world, x, y, w, h, hp) {
        this.hp = hp;
        this.jumpCooldown = 50;
        this.jumpCounter = 0;
        this.world = world;
        this.onGround = false;
        // make sensor
        this.sensor = new PlayerSensor(world, this, x, y, w - 3, w - 3);
        this.prnt = null;
        // make body
        this.body = Bodies.rectangle(x, y, w, h);
        this.body.prnt = this;
        World.add(world, this.body);
    }
    onCollide(other) {
        // this.onGround = true;
    }
    canJump() {
        return (this.onGround > 0 && (this.jumpCounter === 0));
    }
    jump() {
        this.body.force.y -= 0.02;
        this.jumpCounter = this.jumpCooldown;
    }
    beforeTick() {
        // player angle
        Body.setAngle(this.body, 0);
        // update whether player is on ground
        this.jumpCounter = Math.max(0, this.jumpCounter - 1);
        this.onGround = Math.max(0, this.onGround - 1);
        this.sensor.beforeTick();
        console.log('jump ctr', this.jumpCounter);
        
    }
    afterTick() {
        this.sensor.afterTick();
    }
}

class PlayerSensor {
    constructor(world, prnt, x, y, w, h) {
        this.body = Bodies.rectangle(x, y, w, h, {isSensor: true});
        this.body.prnt = this;
        this.prnt = prnt;
        // put into world
        this.world = world;
        World.add(world, this.body);
    }
    onCollide(other) {
        if (other != this.prnt) {
            this.prnt.onGround = 3;
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