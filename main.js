window.onload = () => {
    document.body.addEventListener('keydown', function(e) {
        keysDown[e.which] = true;
    });
    document.body.addEventListener('keyup', function(e) {
        keysDown[e.which] = false;
    });

    // create an engine
    var engine = Engine.create();
    
    // create a renderer
    var render = Render.create({
        element: document.body,
        engine: engine
    });
    
    var player = new Player(engine.world, 400, 200, 15, 40, 100);

    var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    // add all of the bodies to the world
    World.add(engine.world, [ground]);

    // run the engine
    Engine.run(engine);
    
    Events.on(engine, 'collisionActive', (event) => {
        for (let pair of event.pairs) {
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;
            if (bodyA.prnt && bodyA.prnt.onCollide !== undefined){
                bodyA.prnt.onCollide(bodyB.prnt);
            }
            if (bodyB.prnt && bodyB.prnt.onCollide !== undefined){
                bodyB.prnt.onCollide(bodyA.prnt);
            }
        }
    });
    var game = {obstacles: [], obstacleCounter: fps * 1};
    console.log(player);
    
    Events.on(engine, "afterTick", function(event) {
        player.afterTick();
    });
    Events.on(engine, "beforeTick", function(event) {
        player.beforeTick();
        // player input
        console.log(player.canJump());
        
        if (keysDown[KEY_W] && player.canJump()) {
            console.log('hop!');
            player.jump();
        } else if (keysDown[KEY_S]) {
            player.body.force.y += 0.005;
        } else if (keysDown[KEY_A] && player.body.velocity.x > -5) {
            player.body.force.x -= 0.003;
        } else if (keysDown[KEY_D] && player.body.velocity.x < 5) {
            player.body.force.x += 0.003;
        }

        for (let obs of game.obstacles) {
            var gravity = engine.world.gravity;
            if (true) {
                Body.applyForce(obs, obs.position, {
                    x: -gravity.x * gravity.scale * obs.mass,
                    y: -gravity.y * gravity.scale * obs.mass
                });
            }
        }
        // add obstacle
        game.obstacleCounter -= 1;
        if (game.obstacleCounter === 0) {
            game.obstacleCounter = fps;
            var obstacle = Bodies.rectangle(800, 600, 50 + Math.random() * 20, 50 + Math.random() * 20);
            Body.setVelocity(obstacle, {x:-4, y:0});
            World.add(engine.world, obstacle);
            game.obstacles.push(obstacle);
        }
    });
    // run the renderer
    Render.run(render);
}