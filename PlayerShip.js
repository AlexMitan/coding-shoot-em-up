class Player extends GameObject{
    constructor(world, x, y, w, h, hp) {
        super(world);
        this.hp = hp;
        this.jumpCooldown = 50;
        this.jumpCounter = 0;
        this.shotCooldown = 5;
        this.shotCounter = 0;
        this.world = world;
        // make body
        this.body = Bodies.rectangle(x, y, w, h, {friction: 0.5, frictionAir: 0.10});
        this.body.prnt = this;
        World.add(world, this.body);
        
        this.warnings = true;
        if (this.warnings) {
            console.log('make sure to set a keysDown object to handle input on');
        }
    }
    setKeysDown(keysDown) {
        this.keysDown = keysDown;
    }
    onCollide(other) {
    }
    handleKeyboard(keysDown) {
        // thrust
        if (keysDown[KEY_W] && this.body.velocity.y > -3) {
            this.body.force.y -= 0.003;
        }
        if (keysDown[KEY_S] && this.body.velocity.y < 3) {
            this.body.force.y += 0.003;
        }
        if (keysDown[KEY_A] && this.body.velocity.x > -3) {
            this.body.force.x -= 0.003;
        }
        if (keysDown[KEY_D] && this.body.velocity.x < 3) {
            this.body.force.x += 0.003;
        }
        if (keysDown[KEY_SPACE] && this.shotCounter === 0) {
            this.shotCounter = this.shotCooldown;
            let bullet = new Bullet(this.world, this, 5);
            let { x, y } = this.body.position;
            Body.setPosition(bullet.body, {x: x, y: y - 20});
            Body.setVelocity(bullet.body, {x: randomFloat(-1, 1), y: -10});
            this.addChild(bullet);
        }
    }
    jump() {
        this.body.force.y -= 0.015;
        this.jumpCounter = this.jumpCooldown;
    }
    
    beforeTick() {
        // input
        this.handleKeyboard(this.keysDown);
        // player angle
        Body.setAngle(this.body, clamp(this.body.angle, degToRad(0), degToRad(-0)));
        // update whether player is on ground
        this.recurse('beforeTick', false);
    }
    afterTick() {
        this.shotCounter = Math.max(this.shotCounter - 1, 0);
        this.recurse('afterTick', false);
    }
}

class Drone extends GameObject {
    constructor(world, prnt, x, y, w, h) {
        super(world, prnt);
        this.body = Bodies.rectangle(x, y, w, h, {isSensor: true});
        this.body.prnt = this;
        World.add(world, this.body);
        this.angleCtr = 0;
    }
    beforeTick() {
        this.angleCtr = (this.angleCtr + 1) % 360;
        let angle = degToRad(this.angleCtr);
        let prntBody = this.prnt.body;
        Body.setPosition(this.body, {
            x: prntBody.position.x + Math.cos(angle) * 50,
            y: prntBody.position.y + Math.sin(angle) * 30
        });
    }
}

class Bullet extends GameObject {
    constructor(world, prnt, r) {
        super(world, prnt);
        this.body = Bodies.circle(0, 0, r);
        this.body.prnt = this;
        World.add(world, this.body);
        this.lifetime = 50;
    }
    afterTick() {
        this.lifetime -= 1;
        if (this.lifetime < 0) {
            this.remove();
        }
    }
    remove() {
        super.remove();
        removeFromArr(this.world.bodies, this.body);
    }
}