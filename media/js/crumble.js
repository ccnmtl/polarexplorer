var source;
var draw;
var cycle;

var RAD = Math.PI/180;
var MAX_CYCLES = 30;
var TILE_WIDTH = 10;
var TILE_HEIGHT = 10;
var TILE_CENTER_WIDTH = 5;
var TILE_CENTER_HEIGHT = 5;
var SOURCERECT = {x:0, y:0, width:100, height:110};
var PAINTRECT = {x:0, y:0, width:100, height:110};
var SPEED = 100;
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

function processFrame(){
    draw.clearRect(PAINTRECT.x, PAINTRECT.y,PAINTRECT.width,PAINTRECT.height);
    
    cycle++;
    if (cycle > MAX_CYCLES) {
        return;
    }
    for (var col=0; col < COLS; col++) {
        for (var row=0; row < ROWS; row++) {
            var tile = tiles[row][col];
            
            draw.clearRect(tile.currentX-TILE_CENTER_WIDTH-1,
                    tile.currentY-TILE_CENTER_HEIGHT-1, TILE_WIDTH+1, TILE_HEIGHT+1);
            
            
            if (tile.force > 0.0001) {
                tile.moveX *= tile.force;
                tile.moveY *= tile.force;
                tile.currentX += tile.moveX;
                tile.currentY += tile.moveY;
                
                tile.moveRotation *= tile.force;
                tile.rotation += tile.moveRotation;
                tile.rotation %= 360;
                tile.force *= 1.05;
                /**                
                if (tile.currentX <= 0 || tile.currentX >= PAINTRECT.width){
                    tile.moveX *= -1;
                }
                if(tile.currentY <= 0) {
                    tile.moveY *= -1;
                }
                **/
            }
            draw.save();
            
            //The translate() method remaps the (0,0) position on the canvas.
            draw.drawImage(source,
                // where to pick up the image from the source canvas.
                tile.sourceX, tile.sourceY, TILE_WIDTH, TILE_HEIGHT,
                // where to draw it on the output canvas
                tile.currentX-TILE_CENTER_WIDTH, tile.currentY-TILE_CENTER_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            draw.restore();
        }
    }
    setTimeout(processFrame, SPEED);
}

function crumble(sourceImage, sourceX, sourceY, sourceWidth, sourceHeight) {
    source = sourceImage;
    cycle = 0;
    
    var debugSourceY = sourceY - 200; // For debugging purposes
    
    for (var row=0, y=0; row < ROWS; row++, y+=TILE_HEIGHT) {
        for (var col=0, x=0; col < COLS; col++, x+=TILE_WIDTH) {                
            var tile = tiles[row][col];
            tile.sourceX = sourceX + x;
            tile.sourceY = sourceY + y;
            
            tile.currentX = sourceX + x; 
            tile.currentY = debugSourceY + y;
            
            var xdiff = sourceWidth - tile.currentX;
            var ydiff = sourceHeight;
            
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

