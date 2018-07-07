class GameObject {
    constructor(world, parent) {
        this.world = world;
        this.children = [];
        this.parent = parent || null;
        if (parent)
        this.name = name;
    }
    addChild(gameObj) {
        this.children.push(gameObj);
    }
    removeChild(gameObj){
        let childIdx = this.children.indexOf(gameObj);
        if (childIdx > -1){
            this.children.splice(childIdx, 1);
        }
    }
    recurse(fnName) {
        this[fnName]();
        for (let child of this.children) {
            child.recurse(fnName);
        }
    }
}

// var world = {};
// var mothership = new GameObject(world, 'mothership');

// var fighter = new GameObject(world, 'fighter', mothership);
// mothership.addChild(fighter);
// var interceptor = new GameObject(world, 'interceptor', mothership);
// mothership.addChild(interceptor);

// var interceptorCannon1 = new GameObject(world, 'interceptorCannon1', interceptor);
// interceptor.addChild(interceptorCannon1);
// var interceptorCannon2 = new GameObject(world, 'interceptorCannon2', interceptor);
// interceptor.addChild(interceptorCannon2);
// var fighterCannon1 = new GameObject(world, 'fighterCannon1', fighter);
// fighter.addChild(fighterCannon1);
// var fighterCannon2 = new GameObject(world, 'fighterCannon2', fighter);
// fighter.addChild(fighterCannon2);

// mothership.recurse('generic');
