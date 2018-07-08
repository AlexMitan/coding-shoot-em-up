// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    // Composites = Matter.Composites,
    // MouseConstraint = Matter.MouseConstraint,
    // Mouse = Matter.Mouse,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Body = Matter.Body;

var KEY_W = 87,
    KEY_S = 83,
    KEY_A = 65,
    KEY_D = 68;
var fps = 60,
    keysDown = {};

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
    player.setKeysDown(keysDown);
    player.body.friction = 0.95;
    player.body.frictionStatic = 0.95;
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

        // add obstacle
        game.obstacleCounter -= 1;
        
        if (game.obstacleCounter === 0) {
            game.obstacleCounter = randomInt(0, fps);
            var obstacle = Bodies.rectangle(randomInt(0, 600), 0, randomInt(10, 70), randomInt(10, 70));
            // var obstacle = Bodies.rectangle(600, 550, 80, 30);
            obstacle.friction = 0.95;
            obstacle.frictionStatic = 0.95;
            World.add(engine.world, obstacle);
            game.obstacles.push(obstacle);
        }
        for (let obs of game.obstacles) {
            var gravity = engine.world.gravity;
            if (true) {
                // Body.applyForce(obs, obs.position, {
                //     x: -gravity.x * gravity.scale * obs.mass,
                //     y: -gravity.y * gravity.scale * obs.mass
                // });
                // Body.setAngle(obs, 0);
            }
            // Body.setVelocity(obs, {x:-3, y:0});
        }
    });
    // run the renderer
    Render.run(render);
}