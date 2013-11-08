var source;
var draw;

var RAD = Math.PI/180;
var TILE_WIDTH = 12;
var TILE_HEIGHT = 12;
var TILE_CENTER_WIDTH = 6;
var TILE_CENTER_HEIGHT = 6;
var tiles;
var gRows, gCols;

function crumbleInit(outputcanvas, sourceWidth, sourceHeight) {
    draw = outputcanvas.getContext('2d');       

    gRows = Math.round(sourceHeight / TILE_HEIGHT);
    gCols = Math.round(sourceWidth / TILE_WIDTH);

    tiles = new Array(gRows);
    for (var row=0, y=0; row < gRows; row++, y+=TILE_HEIGHT) {
        tiles[row] = new Array(gCols);
        for (var col=0, x=0; col < gCols; col++, x+=TILE_WIDTH) {
            var tile = new Tile();
            tiles[row][col] = tile;
        }
    }    
}


function crumbleFrame() {
    for (var col=0; col < gCols; col++) {
        for (var row=0; row < gRows; row++) {
            var tile = tiles[row][col];
            
            draw.clearRect(tile.currentX-(TILE_CENTER_WIDTH+2),
                           tile.currentY-(TILE_CENTER_HEIGHT+2),
                           TILE_WIDTH+2, TILE_HEIGHT+2);
            
            
            if (tile.force > 0.0001) {
                tile.moveX *= tile.force;
                tile.moveY *= tile.force;
                tile.currentX += tile.moveX;
                tile.currentY += tile.moveY;
                
                tile.moveRotation *= tile.force;
                tile.rotation += tile.moveRotation;
                tile.rotation %= 360;
                tile.force *= 1.05;
            }
            draw.save();
            
            draw.drawImage(source,
                // where to pick up the image from the source canvas.
                tile.sourceX, tile.sourceY, TILE_WIDTH, TILE_HEIGHT,
                // where to draw it on the output canvas
                tile.currentX-TILE_CENTER_WIDTH, tile.currentY-TILE_CENTER_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            draw.restore();
        }
    }
}

function crumbleStart(sourceImage, step) {
    source = sourceImage;
    
    var sourceX = step.x;
    var sourceY = step.y;
    var sourceWidth = step.w;
    var sourceHeight = step.h;
    var outputWidth = step.w1;
    var outputHeight = step.h1;
    
    gRows = Math.round(sourceHeight / TILE_HEIGHT);
    gCols = Math.round(sourceWidth / TILE_WIDTH);
    
    for (var row=0, y=0; row < gRows; row++, y+=TILE_HEIGHT) {
        for (var col=0, x=0; col < gCols; col++, x+=TILE_WIDTH) {
            var tile = new Tile();
            tiles[row][col] = tile;
            
            tile.sourceX = sourceX + x;
            tile.sourceY = sourceY + y;
            
            tile.currentX = sourceX  + x; 
            tile.currentY = sourceY + y;
            
            var xdiff = outputWidth - tile.currentX;
            var ydiff = outputHeight;
            
            var dist = Math.sqrt(xdiff*xdiff + ydiff*ydiff);        
            var randRange = 220+(Math.random()*30);
            
            var range = randRange-dist;            
            tile.force = 4*(range/randRange);
            
            var radians = Math.atan2(ydiff, xdiff);            
            tile.moveX = Math.cos(radians);
            tile.moveY = Math.sin(radians);
            
            tile.moveRotation = 0.5-Math.random();
        }
    }
}


function Tile(){
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = 0;
    this.force = 0;
    this.z = 0;
    this.moveX= 0;
    this.moveY= 0;
    this.moveRotation = 0;
    
    this.sourceX = 0;
    this.sourceY = 0;
}

