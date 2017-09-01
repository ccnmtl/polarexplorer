/* exported crumbleInit, crumbleFrame, crumbleStart */

var source;
var draw;

var TILE_WIDTH = 12;
var TILE_HEIGHT = 12;
var TILE_CENTER_WIDTH = 6;
var TILE_CENTER_HEIGHT = 6;

var tiles;
var gRows;
var gCols;
var gSourceY;
var gForceFactor;
var gScreenDescriptor;

function getForceFactor(screenDescriptor) {
    if (screenDescriptor === 'desktop') {
        return 2.75;
    } else if (screenDescriptor === 'tablet') {
        return 4.25;
    } else {
        return 4;
    }
}

function getOffset(screenDescriptor, orientation) {
    if (screenDescriptor === 'phone') {
        if (orientation === 'portrait') {
            return {x: 0.31, y: 0.31};
        } else if (orientation === 'landscape') {
            return {x: 0.56, y: 0.56};
        }
    } else if (orientation === 'portrait') {
        return {x: 0.75, y: 0.75};
    } else if (orientation === 'landscape') {
        return {x: 1, y: 1};
    }
}

function crumbleInit(outputcanvas, screenDescriptor, sourceY,
    sourceWidth, sourceHeight) {
    draw = outputcanvas.getContext('2d');

    gScreenDescriptor = screenDescriptor;
    gForceFactor = getForceFactor(screenDescriptor);
    gSourceY = sourceY;
    gRows = Math.round(sourceHeight / TILE_HEIGHT);
    gCols = Math.round(sourceWidth / TILE_WIDTH);

    tiles = new Array(gRows);
    for (var row = 0, y = 0; row < gRows; row++, y += TILE_HEIGHT) {
        tiles[row] = new Array(gCols);
        for (var col = 0, x = 0; col < gCols; col++, x += TILE_WIDTH) {
            var tile = new Tile();
            tiles[row][col] = tile;
        }
    }
}

function crumbleFrame() {
    for (var col = 0; col < gCols; col++) {
        for (var row = 0; row < gRows; row++) {
            var tile = tiles[row][col];

            draw.clearRect(tile.currentX - (TILE_CENTER_WIDTH + 2),
                tile.currentY - (TILE_CENTER_HEIGHT + 2),
                TILE_WIDTH + 2, TILE_HEIGHT + 2);

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
                tile.currentX - TILE_CENTER_WIDTH,
                tile.currentY - TILE_CENTER_HEIGHT,
                TILE_WIDTH, TILE_HEIGHT);
            draw.restore();
        }
    }
}

function crumbleStart(sourceImage, sourceX, orientation) {
    var outputWidth = sourceX * 0.1;
    var outputHeight = gSourceY * 0.6;
    var offset = getOffset(gScreenDescriptor, orientation);

    source = sourceImage;

    for (var row = 0, y = 0; row < gRows; row++, y += TILE_HEIGHT) {
        for (var col = 0, x = 0; col < gCols; col++, x += TILE_WIDTH) {
            var tile = tiles[row][col];

            tile.sourceX = sourceX + x;
            tile.sourceY = gSourceY + y;

            tile.currentX = (sourceX  + x) * offset.x;
            tile.currentY = (gSourceY + y) * offset.y;

            var xdiff = -(outputWidth + x);
            var ydiff = outputHeight;

            var dist = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            var randRange = 220 + (Math.random() * 30);

            var range = randRange - dist;
            tile.force = gForceFactor * (range / randRange);

            var radians = Math.atan2(ydiff, xdiff);
            tile.moveX = Math.cos(radians);
            tile.moveY = Math.sin(radians);

            tile.moveRotation = 0.5 - Math.random();
        }
    }
}

function Tile() {
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = 0;
    this.force = 0;
    this.z = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.moveRotation = 0;
    this.sourceX = 0;
    this.sourceY = 0;
}
