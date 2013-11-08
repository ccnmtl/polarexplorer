var source;
var draw;
var cycle;

var MAX_CYCLES = 20;
var TILE_WIDTH = 10;
var TILE_HEIGHT = 10;
var TILE_CENTER_WIDTH = 5;
var TILE_CENTER_HEIGHT = 5;
var SOURCERECT = {x:0, y:0, width:300, height:300};
var PAINTRECT = {x:0, y:0, width:300, height:300};
var SPEED = 50;
var ROWS = SOURCERECT.height / TILE_HEIGHT;
var COLS = SOURCERECT.width / TILE_WIDTH;
var tiles;


function initExplosion(outputcanvas) {
    draw = outputcanvas.getContext('2d');
    
    tiles = new Array(ROWS);    
    for (var row=0, y=0; row < ROWS; row++, y+=TILE_HEIGHT) {
        tiles[row] = new Array(COLS);
        for (var col=0, x=0; col < COLS; col++, x+=TILE_WIDTH) {
            var tile = new Tile();
            tiles[row][col] = tile;            
        }
    }    
}

function initializeTiles() {
    var offsetX = TILE_CENTER_WIDTH+(PAINTRECT.width-SOURCERECT.width)/2;
    var offsetY = TILE_CENTER_HEIGHT+(PAINTRECT.height-SOURCERECT.height)/2;
    
    for (var row=0, y=0; row < ROWS; row++, y+=TILE_HEIGHT) {
        for (var col=0, x=0; col < COLS; col++, x+=TILE_WIDTH) {
            var tile = tiles[row][col];
            tile.videoX = x;
            tile.videoY = y;
            tile.originX = offsetX + x;
            tile.originY = offsetY + y;
            tile.currentX = tile.originX;
            tile.currentY = tile.originY;
            tile.force = 0;
        }
    }
}

var RAD = Math.PI/180;
var randomJump = false;
function processFrame(){
    draw.clearRect(PAINTRECT.x, PAINTRECT.y,PAINTRECT.width,PAINTRECT.height);
    
    cycle++;
    if (cycle > MAX_CYCLES) {
        return;
    }
    for (var col=0; col < COLS; col++) {
        for (var row=0; row < ROWS; row++) {
            var tile = tiles[row][col];
            
            if (tile.force > 0.0001){
                tile.moveX *= tile.force;
                tile.moveY *= tile.force;
                tile.moveRotation *= tile.force;
                tile.currentX += tile.moveX;
                tile.currentY += tile.moveY;
                tile.rotation += tile.moveRotation;
                tile.rotation %= 360;
                tile.force *= 1.05;
                if (tile.currentX <= 0 || tile.currentX >= PAINTRECT.width){
                    tile.moveX *= -1;
                }
                if(tile.currentY <= 0) {
                    tile.moveY *= -1;
                }
            }
            draw.save();
            
            //The translate() method remaps the (0,0) position on the canvas.
            draw.translate(tile.currentX, tile.currentY);
            draw.rotate(tile.rotation*RAD);
            draw.drawImage(source,
                // where to pick up the image from the source canvas.
                tile.videoX, tile.videoY, TILE_WIDTH, TILE_HEIGHT,
                // where to draw it on the output canvas
                -TILE_CENTER_WIDTH, -TILE_CENTER_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            draw.restore();
        }
    }
    setTimeout(processFrame, SPEED);
}

function explode(sourceImage, x, y) {
    source = sourceImage;
    cycle = 0;
    initializeTiles();
    
    for (var row=0; row < ROWS; row++) {
        for (var col=0; col < COLS; col++) {
            var tile = tiles[row][col];
            
            var xdiff = -(tile.currentX-x);
            var ydiff = y;
            var dist = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
            
            var randRange = 220+(Math.random()*30);
            var range = randRange-dist;
            tile.force = 3*(range/randRange);
            var radians = Math.atan2(ydiff, xdiff);
            tile.moveX = Math.cos(radians);
            tile.moveY = Math.sin(radians);
            tile.moveRotation = 0.5-Math.random();
        }
    }
    
    processFrame();
}


function Tile(){
    this.originX = 0;
    this.originY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = 0;
    this.force = 0;
    this.z = 0;
    this.moveX= 0;
    this.moveY= 0;
    this.moveRotation = 0;
    
    this.videoX = 0;
    this.videoY = 0;
}


/*
    getPixel
    return pixel object {r,g,b,a}
*/
function getPixel(imageData, x, y){
    var data = imageData.data;
    var pos = (x + y * imageData.width) * 4;
    return {r:data[pos], g:data[pos+1], b:data[pos+2], a:data[pos+3]}
}
/*
    setPixel
    set pixel object {r,g,b,a}
*/
function setPixel(imageData, x, y, pixel){
    var data = imageData.data;
    var pos = (x + y * imageData.width) * 4;
    data[pos] = pixel.r;
    data[pos+1] = pixel.g;
    data[pos+2] = pixel.b;
    data[pos+3] = pixel.a;
}
/*
    copyPixel
    faster then using getPixel/setPixel combo
*/
function copyPixel(sImageData, sx, sy, dImageData, dx, dy){
    var spos = (sx + sy * sImageData.width) * 4;
    var dpos = (dx + dy * dImageData.width) * 4;
    dImageData.data[dpos] = sImageData.data[spos];     //R
    dImageData.data[dpos+1] = sImageData.data[spos+1]; //G
    dImageData.data[dpos+2] = sImageData.data[spos+2]; //B
    dImageData.data[dpos+3] = sImageData.data[spos+3]; //A
}
