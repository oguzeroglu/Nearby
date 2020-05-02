var Nearby = require("../build/Nearby");
var expect = require('expect.js');

asciiArt();

describe("Nearby", function(){

  it("should create world", function(){

    var nearby = new Nearby(100, 200, 300, 50);

    expect(nearby.limitBox).to.exist;

    var box = nearby.limitBox;
    var minX = box.minX, maxX = box.maxX, minY = box.minY, maxY = box.maxY, minZ = box.minZ, maxZ = box.maxZ;

    expect(minX).to.be.eql(-50);
    expect(minY).to.be.eql(-100);
    expect(minZ).to.be.eql(-150);
    expect(maxX).to.be.eql(50);
    expect(maxY).to.be.eql(100);
    expect(maxZ).to.be.eql(150);
  });

  it("should create box", function(){

    var nearby = new Nearby(100, 200, 300, 50);

    var box = nearby.createBox(0, 0, 0, 100, 200, 300);

    var minX = box.minX, maxX = box.maxX, minY = box.minY, maxY = box.maxY, minZ = box.minZ, maxZ = box.maxZ;

    expect(minX).to.be.eql(-50);
    expect(minY).to.be.eql(-100);
    expect(minZ).to.be.eql(-150);
    expect(maxX).to.be.eql(50);
    expect(maxY).to.be.eql(100);
    expect(maxZ).to.be.eql(150);
  });

  it("should create object", function(){

    var nearby = new Nearby(100, 200, 300, 50);

    var box = nearby.createBox(0, 0, 0, 100, 200, 300);
    var obj = nearby.createObject("obj1", box);

    expect(obj).to.be.eql({id: "obj1", box: box, binInfo: new Map()});
  });


  it("should insert object", function(){

    var nearby = new Nearby(1000, 1000, 1000, 100);
    var box = nearby.createBox(10, 10, 10, 10, 10, 10);
    var obj = nearby.createObject("obj1", box);

    nearby.insert(obj);
    expect(nearby.bin.size).to.be.eql(1);
    expect(obj.binInfo.size).to.be.eql(1);
  });

  it("should delete object", function(){

    var nearby = new Nearby(1000, 1000, 1000, 100);
    var box = nearby.createBox(10, 10, 10, 10, 10, 10);
    var obj = nearby.createObject("obj1", box);

    nearby.insert(obj);
    nearby.delete(obj);
    expect(nearby.bin.size).to.be.eql(0);
  });

  it("should not insert if out of bounds", function(){

    var nearby = new Nearby(1000, 1000, 1000, 100);
    var box = nearby.createBox(-5000, -5000, -5000, 10, 10, 10);
    var obj = nearby.createObject("obj1", box);

    nearby.insert(obj);
    expect(nearby.bin.size).to.be.eql(0);
  });

  it("should query", function(){

    var nearby = new Nearby(1000, 1000, 1000, 100);
    var box = nearby.createBox(10, 10, 10, 10, 10, 10);
    var obj = nearby.createObject("obj1", box);

    nearby.insert(obj);

    var res1 = nearby.query(0, 0, 0);

    expect(res1.size).to.be.eql(1);

    for (var key of res1.keys()){
      expect(key).to.be.eql(obj);
    }

    var res2 = nearby.query(300, 300, 300);
    expect(res2.size).to.be.eql(0);
  });

  it("should update object", function(){

    var nearby = new Nearby(1000, 1000, 1000, 100);
    var box1 = nearby.createBox(10, 10, 10, 10, 10, 10);
    var box2 = nearby.createBox(500, 500, 500, 10, 10, 10);

    var obj1 = nearby.createObject("obj1", box1);
    var obj2 = nearby.createObject("obj2", box2);

    nearby.insert(obj1);
    nearby.insert(obj2);

    var res1 = nearby.query(0, 0, 0);

    expect(res1.size).to.be.eql(1);

    for (var obj of res1.keys()){
      expect(obj).to.be.eql(obj1);
    }

    nearby.update(obj1, 500, 500, 500, 10, 10, 10);

    var res2 = nearby.query(0, 0, 0);
    expect(res2.size).to.be.eql(0);

    nearby.update(obj2, 10, 10, 10, 10, 10, 10);

    var res3 = nearby.query(0, 0, 0);
    expect(res3.size).to.be.eql(1);

    for (var obj of res3.keys()){
      expect(obj).to.be.eql(obj2);
    }
  });
});

function asciiArt(){
  console.log(" _   _                 _   ");
  console.log("| \\ | |               | |    ");
  console.log("|  \\| | ___  __ _ _ __| |__  _   _");
  console.log("| . ` |/ _ \\/ _` | '__| '_ \\| | | |");
  console.log("| |\\  |  __/ (_| | |  | |_) | |_| |");
  console.log("\\_| \\_/\\___|\\__,_|_|  |_.__/ \\__, |");
  console.log("                             __/  |");
  console.log("                            |____/");
}
