# Nearby
Nearby is an easy-to-use lightweight JS library for your 2D/3D games that helps you get the nearby objects in a constant time `O(1)` instead of simple brute force algorithms that run on `O(n)`.

Ported from the [WorldBinHandler class of ROYGBIV engine](https://github.com/oguzeroglu/ROYGBIV/blob/master/js/handler/WorldBinHandler.js).

# The Problem
In most of the games (2D/3D), collision checks are essential both for physics or AI (steering behaviors such as obstacle avoidance, collision avoidance). Many naive implementations depend on comparing a certain bounding box with the bounding box of every other object of the scene:

    forEach object of the scene
	    checkIfCollided(box, object.box)

This naive approach runs on `O(n)` and this is a problem especially for rather crowded scenes with many dynamic/static objects.

In order to overcome this problem, game engines use [Octree](https://en.wikipedia.org/wiki/Octree) data structure. However Octree is not so easy to implement for dynamic objects. A tree needs to be reconstructed in that case, which triggers GC activity and slows down the main thread in Javascript.
# The Solution

While working on [ROYGBIV engine](https://github.com/oguzeroglu/ROYGBIV) particle collisions, I experimented with couple of solutions and ended up implementing a binning algorithm that splits the world into bins, insert the object into different bins based on their bounding boxes. This helps us finding nearby objects of a given point in constant time `O(1)`. This library is a standalone version of the same algorithm.
# Performance Comparison
Run the [performance-test](https://github.com/oguzeroglu/Nearby/blob/master/performance-test.html) in your browser. In order to test the efficiency of Nearby, a defined amount of objects are created and put into random positions. Then the closest object to the point `(0, 0, 0)` is searched first with Nearby algorithm and then with the naive approach (brute forcing).

Here are the results:
| Number of objects | Nearby | Naive approach |
|--|--|--|
| 1000000 | 1.33 ms | 51 ms |
| 100000 | 0.2 ms | 11 ms |
| 10000 | 0.18 ms | 2 ms |

As you can see Nearby offers a much faster solution.

# Usage

Include the Nearby.js in your HTML
```HTML
<head>
	<script src="[Path to Nearby.js]"></script>

```

Then with Javascript:
```javascript
// INITIALIZE
var sceneWidth = 1000, sceneHeight = 1000, sceneDepth = 1000;
var binSize = 50;
// Creates a world centered in (0, 0, 0) of size (1000x1000x1000)
// The world is splitted into cubes of (50x50x50).
var nearby = new Nearby(sceneWidth, sceneHeight, sceneDepth, binSize);

// CREATE AN OBJECT REPRESENTATION
var objectPosX = 0, objectPosY = 100, objectPosZ = -100;
var objectWidth = 10, objectHeight = 50, objectDepth = 100;

// Creates a new bounding box of (10x50x100) size, located at
// the position (x: 0, y: 100, z: -100)
var box = nearby.createBox(
	objectPosX, objectPosY, objectPosZ,
	objectWidth, objectHeight, objectDepth
);

var objectID = "my_collidable_object";
var object = nearby.createObject(objectID, box);

// INSERT THE OBJECT INTO THE WORLD
nearby.insert(object);
```

To find Nearby objects:
```javascript
var searchX = 0, searchY = 0, searchZ = 0;

// Find the nearby objects from (searchX, searchY, searchZ)
//
// Nearby returns the object within range (3 * binSize) / 2
// So for this example the max distance that makes an object "nearby"
// is (50 * 3) / 2 = 75

// returns a Map having keys: inserted objects
var result = nearby.query(searchX, searchY, searchZ);

for (var object of result.keys()){
	console.log(object.id + " is found nearby!");
}
```

To update an object:
```javascript
var newPosX = -500, newPosY = 100, newPosZ = 100;
var newWidth = 1000, newHeight = 1000, newDepth = 1000;
nearby.update(
	object, newPosX, newPosY, newPosZ,
	newWidth, newHeight, newDepth
);
```

To delete an object:
```javascript
nearby.delete(object);
```
# In Action
This algorithm is used by ROYGBIV engine in many demos.
For instance in [this demo](https://oguzeroglu.github.io/ROYGBIV/demo/blaster/application.html) and [this demo](https://oguzeroglu.github.io/ROYGBIV/demo/plasmaGun/application.html) Nearby algorithm is used to check if a ParticleSystem is collided with walls or objects. In [this demo](https://oguzeroglu.github.io/ROYGBIV/demo/shooter/application.html) the algorithm is used to perform Ray checks from the weapon (when the user shoots).

# License
Nearby uses MIT license.
