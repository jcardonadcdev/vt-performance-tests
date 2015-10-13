var Pbf = require('../node_modules/mapbox-gl/node_modules/pbf'),
    VectorTile = require('vector-tile').VectorTile,
    Benchmark = require('benchmark'),
    fs = require('fs'),
    TilePyramid = require('../node_modules/mapbox-gl/js/source/tile_pyramid'),
    WorkerTile = require('../node_modules/mapbox-gl/js/source/worker_tile'),
    TileCoord= require('../node_modules/mapbox-gl/js/source/tile_coord'),
    util = require('../node_modules/mapbox-gl/js/util/util');

console.log('All requires worked');

var countId = 1;

function createPyramid(options) {
    return new TilePyramid(util.extend({
        tileSize: 512,
        minzoom: 0,
        maxzoom: 14,
        load: function() {},
        abort: function() {},
        unload: function() {},
        add: function() {},
        remove: function() {}
    }, options));
}

function getChildPos(childId, parentId){
    var tilePos = TileCoord.fromID(childId);
    var parentPos = TileCoord.fromID(parentId);
    var dz = tilePos.z - parentPos.z;
    var xPos = tilePos.x & ((1 << dz) - 1);
    var yPos = tilePos.y & ((1 << dz) - 1);
    return {
        dz: dz,
        xPos: xPos,
        yPos: yPos
    };
}

var source = JSON.parse(fs.readFileSync(__dirname + '/../fixtures/clipping/source.json', 'utf-8'));
var layers = source.layers;

var timerun = 0;

var index = JSON.parse(fs.readFileSync(__dirname + '/../fixtures/index.json', 'utf-8')).index;

var pyramidIndex;
var pyramid;

var coord1 = new TileCoord(11, 354, 798, 0),
    coord2 = new TileCoord(11, 354, 799, 0),
    coord3 = new TileCoord(11, 355, 798, 0),
    coord4 = new TileCoord(11, 355, 799, 0);

var coord5 = new TileCoord(11, 354, 798, 0),
    coord6 = new TileCoord(11, 354, 799, 0),
    coord7 = new TileCoord(11, 355, 798, 0),
    coord8 = new TileCoord(11, 355, 799, 0);

var suite1 = new Benchmark.Suite(),
    data_1_oz = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-oz-10-177-399.pbf');

var suite2 = new Benchmark.Suite(),
    data_1_f1 = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-f-11-354-798.pbf'),
    data_1_f2 = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-f-11-354-799.pbf'),
    data_1_f3 = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-f-11-355-798.pbf'),
    data_1_f4 = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-f-11-355-799.pbf');

var suite3 = new Benchmark.Suite(),
    data_2_oz = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-oz-10-177-401.pbf');

var suite4 = new Benchmark.Suite(),
    data_2_f1 = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-f-11-354-802.pbf'),
    data_2_f2 = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-f-11-354-803.pbf'),
    data_2_f3 = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-f-11-355-802.pbf'),
    data_2_f4 = fs.readFileSync(__dirname + '/../fixtures/clipping/vc-f-11-355-803.pbf');

suite1
.add('process leaf tile 1 overzoomed tile lvl 11', function() {
    readTile(data_1_oz, layers, coord1, true);
    readTile(data_1_oz, layers, coord2, true);
    readTile(data_1_oz, layers, coord3, true);
    readTile(data_1_oz, layers, coord4, true);
})
.on('start', function(){
    timerun = 0;
    pyramidIndex = createPyramid({
        index: index
    });
    pyramid = createPyramid();
    console.log("\nSUITE 1");
})
.on('cycle', function(event) {
    console.log('\n**' + event.target.name);
    console.log('**** num samples' + ": " + event.target.stats.sample.length);
    var total = 0;
    for(var i = 0; i < event.target.stats.sample.length; i++){
        total += event.target.stats.sample[i];
    }
    //console.log("**** timerun: ", timerun);
    console.log("**** time per run: ", timerun / event.target.stats.sample.length);
    console.log("**** avg time from samples: ", total / event.target.stats.sample.length);
    console.log("**** num processes per second: ", String(event.target) + '\n');
})
.run();

suite2
.add('process full tiles 1 lvl 11', function() {
    readTile(data_1_f1, layers, coord1, false);
    readTile(data_1_f2, layers, coord2, false);
    readTile(data_1_f3, layers, coord3, false);
    readTile(data_1_f4, layers, coord4, false);
})
.on('start', function(){
    timerun = 0;
    pyramidIndex = createPyramid({
        index: index
    });
    pyramid = createPyramid();
    console.log("\nSUITE 2");
})
.on('cycle', function(event) {
    console.log('\n**' + event.target.name);
    console.log('**** num samples' + ": " + event.target.stats.sample.length);
    var total = 0;
    for(var i = 0; i < event.target.stats.sample.length; i++){
        total += event.target.stats.sample[i];
    }
    //console.log("**** timerun: ", timerun);
    console.log("**** time per run: ", timerun / event.target.stats.sample.length);
    console.log("**** avg time from samples: ", total / event.target.stats.sample.length);
    console.log("**** num processes per second: ", String(event.target) + '\n');
})
.run();

suite3
    .add('process leaf tile 2 overzoomed tile lvl 11', function() {
        readTile(data_2_oz, layers, coord5, true);
        readTile(data_2_oz, layers, coord6, true);
        readTile(data_2_oz, layers, coord7, true);
        readTile(data_2_oz, layers, coord8, true);
    })
    .on('start', function(){
        timerun = 0;
        pyramidIndex = createPyramid({
            index: index
        });
        pyramid = createPyramid();
        console.log("\nSUITE 3");
    })
    .on('cycle', function(event) {
        console.log('\n**' + event.target.name);
        console.log('**** num samples' + ": " + event.target.stats.sample.length);
        var total = 0;
        for(var i = 0; i < event.target.stats.sample.length; i++){
            total += event.target.stats.sample[i];
        }
        //console.log("**** timerun: ", timerun);
        console.log("**** time per run: ", timerun / event.target.stats.sample.length);
        console.log("**** avg time from samples: ", total / event.target.stats.sample.length);
        console.log("**** num processes per second: ", String(event.target) + '\n');
    })
    .run();

suite4
    .add('process full tiles 2 lvl 11', function() {
        readTile(data_2_f1, layers, coord5, false);
        readTile(data_2_f2, layers, coord6, false);
        readTile(data_2_f3, layers, coord7, false);
        readTile(data_2_f4, layers, coord8, false);
    })
    .on('start', function(){
        timerun = 0;
        pyramidIndex = createPyramid({
            index: index
        });
        pyramid = createPyramid();
        console.log("\nSUITE 4");
    })
    .on('cycle', function(event) {
        console.log('\n**' + event.target.name);
        console.log('**** num samples' + ": " + event.target.stats.sample.length);
        var total = 0;
        for(var i = 0; i < event.target.stats.sample.length; i++){
            total += event.target.stats.sample[i];
        }
        //console.log("**** timerun: ", timerun);
        console.log("**** time per run: ", timerun / event.target.stats.sample.length);
        console.log("**** avg time from samples: ", total / event.target.stats.sample.length);
        console.log("**** num processes per second: ", String(event.target) + '\n');
    })
    .run();


function readTile(data, layers, tileCoord, useIndex){
    countId++;
    var start = Date.now();

    //make VectorTile - it contains layer info for tile
    var buf = new Pbf(data),
        vt = new VectorTile(buf);

    var dz = 0,
        xPos = 0,
        yPos = 0;

    //add coord to pyramid so parentId set
    var pyramidTile;
    if (useIndex){
        pyramidTile = pyramidIndex.addTile(tileCoord);
    }
    else{
        pyramidTile = pyramid.addTile(tileCoord);
    }

    //console.log(pyramidTile.parentId);

    if (pyramidTile.parentId){
        var childPos = getChildPos(tileCoord.id, pyramidTile.parentId);
        dz = childPos.dz;
        xPos = childPos.xPos;
        yPos = childPos.yPos;
    }

    var worker = new WorkerTile({
        angle: 0,
        collisionDebug: false,
        coord: tileCoord,
        maxZoom: 22,
        overscaling: 1,
        pitch: 0,
        source: "esri",
        tileSize: 512,
        uid: countId,
        url: "",
        zoom: tileCoord.z
    });

    var actor = {
        send: function(){}
    };
    
    worker.parse(vt, layers, actor, function(){}, dz, xPos, yPos);
    var end = Date.now();
    timerun += (end - start);
};
