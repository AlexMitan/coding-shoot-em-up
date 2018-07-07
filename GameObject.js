var id = 0;
class GameObject {
    constructor(world, parent, addToParent=true) {
        this.world = world;
        this.children = [];
        this.parent = parent || null;
        if (parent && addToParent) {
            parent.addChild(this);
        }
        this.id = id;
        id += 1;
    }
    addChild(gameObj) {
        let childIdx = this.children.indexOf(gameObj);
        if (childIdx == -1){
            this.children.push(gameObj);
        }
    }
    removeChild(gameObj){
        let childIdx = this.children.indexOf(gameObj);
        if (childIdx > -1){
            this.children.splice(childIdx, 1);
        }
    }
    getID() {
        console.log(this.id);
    }
    recurse(fnName) {
        this[fnName]();
        for (let child of this.children) {
            child.recurse(fnName);
        }
    }
}

var world = {};
var mothership = new GameObject(world);

var fighter = new GameObject(world, mothership);
var fighterCannon1 = new GameObject(world, fighter);
var fighterCannon2 = new GameObject(world, fighter);

var interceptor = new GameObject(world, mothership);
var interceptorCannon1 = new GameObject(world, interceptor);
var interceptorCannon2 = new GameObject(world, interceptor);


mothership.recurse('getID');
