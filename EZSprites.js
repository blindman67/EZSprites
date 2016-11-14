
/*===================================================================================================================120

Basic usage. 
----

You must set up the canvas and context. Load the images and set up the animation loops (if you are animating)

Set up the context

    EZSprites.context.setCtx(context);  // only needed once if you are only using one canvas context        

    // recommend that you create a shorter reference to the sprite types you wanting to use
    var draw = EZSprites.images.draw;
    draw(image,x,y,1,0,1); // draws an image centered at x,y with scale 1 and no rotation and alpha = 1
    draw(image,x,y,2,Math.PI/2,1); // draws image centered at x,y scale 2 90 deg clock wise
    
Helper function 

   EZSprites.sprites.locateSprites (image)
        Scans the supplied image (spritesheet) and locates all the sprites. A sprite is any continuous set of pixels 
        that have a non zero alpha value. Sprites should not overlap. 
        
        Moat.
        For the best results you should have a one pixel transparent boarder (moat) around the sprite. This will prevent
        colour bleeding from neighbouring sprites. Sprites can be butted against the image sides (no boarder required) 
        only inside edges of sprite need a moat. 
        
        If a sprite has a width or height that is not event some draw functions will give a slightly blurred effect. It 
        is best to ensure that the sprite width and heights are even.
        
        If the sprite is discontinuous (some pixels are not touching) they can appear as separate sprites. To connect 
        sprite pixels you can use a very faint alpha pixel (alpha value = 1 (of 255)) to connect them or designate a 
        linking/bounding colour. All pixels of this colour will be considered scaffolding and removed from image 
        
        > **NOTE** scaffold pixels has not yet been implemented. This features usage may change.
        
        > **Note** it is recommended that you use this function to local the sprites during production and then add the sprite list to the image at load time in the release version of your code. This will greatly improve load time and prevent complications that can result if you apply filters or transformations (scale) to the image.
        
        Arguments
            image  The image to scan. Must be from same domain or have COREs clearance.
            
        Returns 
            image  If the image is unmodified then the original is returned. If modified then a new copy is returned

            
Notes on sprites.

    Sprites are defined by an array attached to the image called sprites. Each entry contains details about where on the image the sprite pixels are.
    
    There are two types of sprites that can be mixed into the array.
    
    Standard sprites 
        Just hold details of where on the sprite sheet the sprite is.
    
    Virtual 
        A virtual sprite is a sprite who's size is larger then the pixels contained on the sprite sheet. When you have a character that has a lot of movement the size of the pixels it contains can vary between frames. Rather than waste space on the sprite sheet, and waste rendering time rendering transparent pixels, the virtual sprite allows you to have all sprites the same virtual size. That may be 128 by 128 pixels, but the actual sprite on the sprite sheet is only 28by28, the next may be 32 by 16. But when you render it will be treated as a fixed size.
    
    Each sprite in the array has one of the following structures
    
    Standard sprite
        x,y The top left coordinated of the sprite on the sprite sheet.
        w,h The width and height of the sprite on the sprite sheet.
    Virtual sprite
        x,y The top left coordinated of the sprite on the sprite sheet.
        w,h The width and height of the sprite on the sprite sheet.
        vx,vy The offset from the virtual top left of the sprite to the top left pixel on the sprite sheet
        vw,vh The virtual width and height of the sprite.
        
    
Draw functions

For EZSprites.sprite and EZSprite.image modules the main draw functions are draw, drawCenterScaled, drawAsLine

Drawing
    EZSprites.sprites.draw (image, index, x, y, scale, rotate, alpha)
    EZSprites.images.draw (image,x, y, scale, rotate, alpha)
        Draws sprite or image. If sprite requires index of sprite.
        Arguments
            image The image to draw. If sprite requires attached sprite list.
            index The sprite index used to lookup the sprite sheet coordinates of the sprite
            x,y The coordinates of the center of the sprite
            scale The uniform scale of the sprite. 1 = no scale  
            rotate The amount to rotate the sprite around its center in radians. Positive is clockwise
            alpha The alpha value of the sprite. (WARNING this is not vetted, values out of range <0 or >1 will be ignored.
        Comes in two variants
            drawWorld
                Drawing coordinates in the current world coordinates
            drawLocal
                Drawing coordinates in the current local coordinates. This is also the current context transform.
                
    EZSprites.sprites.drawCenterScaled (image, index, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha)    
    EZSprites.images.drawCenterScaled (image, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha)    
        Draws sprite or image. If sprite requires index of sprite.
        Arguments
            image The image to draw. If sprite requires attached sprite list.
            index The sprite index used to lookup the sprite sheet coordinates of the sprite
            x,y The coordinates of the center of the sprite
            centerX, centerY The sprite coordinates of the sprite center (he point that the sprite is rotated about)
            scaleX, scaleY The non uniform scale of the sprite in the sprites x and y local direction. 1 = no scale  
            rotate The amount to rotate the sprite around its center in radians. Positive is clockwise
            alpha The alpha value of the sprite. (WARNING this is not vetted, values out of range <0 or >1 will be ignored.
        Comes in two variants
            drawWorldCenterScaled
                Drawing coordinates in the current world coordinates
            drawLocalCenterScaled
                Drawing coordinates in the current local coordinates. This is also the current context transform.
    EZSprites.sprites.drawTiles(image,tileObj,x,y,scale,rotation,alpha)
    Not available for EZSprites.images
        Draws sprites as a tile map.
        Arguments
            image The image to draw. If sprite requires attached sprite list.
            tileObj holds details about the tiles to render.
                map An array of sprite indexes
                width Number of sprites (tiles) in the x direction
                height Number of tiles in the y direction
                xSize Optional. The spacing in pixels between tiles. If not given then the spacing is set to the width of the first tile in map.
                ySize Optional. The spacing in pixels between tiles. If not given then the spacing is set to the width of the first tile in map.
            x,y The coordinates of the top left of first (top left) tile
            scale The uniform scale of the sprite. 1 = no scale 
            rotate The amount to rotate the sprite around its center in radians. Positive is clockwise
            alpha The alpha value of the sprite. (WARNING this is not vetted, values out of range <0 or >1 will be ignored.
        Comes in two variants
            drawWorldTiles
                Drawing coordinates in the current world coordinates
            drawLocalTiles
                Drawing coordinates in the current local coordinates. This is also the current context transform.

Overview of EZSprites data structure   
----

EZSprite properties


    resetAll()
    sprites
        draw (image, index, x, y, scale, rotate, alpha);
        drawWorld (image, index, x, y, scale, rotate, alpha)
        drawLocal (image, index, x, y, scale, rotate, alpha)
        drawCenterScaled (image, index, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha)
        drawWorldCenterScaled (image, index, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha)
        drawLocalCenterScaled (image, index, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha)
        drawAsLine (image, index, x1, y1, x2, y2, scaleWidth, alpha)
        drawWorldAsLine (image, index, x1, y1, x2, y2, scaleWidth, alpha)
        drawLocalAsLine (image, index, x1, y1, x2, y2, scaleWidth, alpha)
        locateSprites (image)
        gridSprites ( image , xCount, yCount)
            Creates an sprite list dividing the image into evenly sized sprites consisting of xCount across and yCount down. If the image width and height can not be evenly divided by the count any extra pixels will not be added to the sprite list. If there is an existing sprite list attached to the image the new sprites will be added to the end of the list.
         
    images
        draw (image, x, y, scale, rotate, alpha)
        drawWorld (image, x, y, scale, rotate, alpha)
        drawLocal (image, x, y, scale, rotate, alpha)
        drawCenterScaled (image, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha)
        drawWorldCenterScaled (image, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha)
        drawLocalCenterScaled (image, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha)
        drawAsLine (image, x1, y1, x2, y2, scaleWidth, alpha)
        drawWorldAsLine (image, x1, y1, x2, y2, scaleWidth, alpha)
        drawLocalAsLine (image, x1, y1, x2, y2, scaleWidth, alpha)
    background
        stretch(image)
        fit(image)
        fill(image)
    FX
        setCompMode(name)
        pushCompMode(name)
        popCompMode()
        getCompMode()
        filter(on)
           turn bilinear filtering on and off. If argument on === true bilinear filtering is on. Else it is off
        normal()
        lighter()
        glow()
        fire()
        multiply()
        screen()
        colorDodge()
        colorBurn()
        hardLight()
        softLight()
        overlay()
        difference()
        exclution()
        hue()
        saturation()
        color()
        luminosity()
        sourceAtop()
        sourceIn()
        sourceOut()
        destinationOver()
        destinationAtop()
        destinationIn()
        destinationOut()
        copy()
        xor()
    context
        setCtx(context);
        getCtx();
        pushCtx(context)
        popCtx()
        setWorldLocal(x,y,scaleX,scaleY,rotation)     
        setLocal(x,y,scaleX,scaleY,rotation)
        local()
        setDefaults()
        
    world  
        Use to set world coordinates
        
        setTransform(originX,originY,scaleX,scaleY)
            Set the current world coordinates
            
        getTransform(returnTransform)
            Get the current world coordinates
            
        pushTransform(originX,originY,scaleX,scaleY)
            Push current world coordinates onto the stack and set a new one. Note you must match this with a pop
            
        popTransform()
            Pop a previously saved world coordinates from the stack
            
    namedCompModes // list of named composite operations and the associated context string
        normal
        lighter
        glow
        fire        
        multiply
        screen
        colorDodge
        colorBurn
        hardLight
        softLight
        overlay
        difference
        exclution
        hue
        saturation
        color
        luminosity
        sourceAtop
        sourceIn
        sourceOut
        destinationOver
        destinationAtop
        destinationIn
        destinationOut
        copy
        xor




======================================================================================================================*/
var EZSprites = (function(){
    "use strict";
    var ctx;
    var ctxStack = [null, null, null, null, null, null, null, null, null];
    var ctxStackTop = 0;
    var w,h;    // width and height
    var _x, _y, _x1, _y1, _dist;  // work variables
    var sw, sh, sw1, sh1; // work vars (sprite width and height)
    var spr; // work var
    var transform = {
        x : 0,
        y : 0,
        sx : 1,
        sy : 1,
    }
    var transformStack = [];
    var tStackTop = 0;
    var local = { // local transform
        x : 0,
        y : 0,
        scaleX : 1,
        scaleY : 1,
        rotate : 0,
    }    
    function resetAll(){
        ctxStackTop = 0;
        tStackTop = 0;
        transformStack = [];
        ctxStack = [null, null, null, null, null, null, null, null, null];
        ctx = null;
        transform.x = 0;
        transform.y = 0;
        transform.sx = 1;
        transform.sy = 1;
        compModeStack = [];
        compModeStackTop = 0;

    }
    var compModesNames = { // darker // has limited support so not included 
        normal : "source-over",
        lighter : "lighter",
        glow : "lighter",
        fire : "lighter",
        multiply : "multiply",
        screen : "screen",
        colorDodge : "color-dodge",
        colorBurn : "color-burn",
        hardLight : "hard-light",
        softLight : "soft-light",
        overlay : "overlay",
        difference : "difference",
        exclution : "exclusion",
        hue : "hue",
        saturation : "saturation",
        color : "color",
        luminosity : "luminosity",
        sourceAtop : "source-atop",
        sourceIn : "source-in",
        sourceOut : "source-out",
        destinationOver : "destination-over",
        destinationAtop : "destination-atop",
        destinationIn : "destination-in",
        destinationOut : "destination-out",
        copy : "copy",
        xor : "xor",
    }
    var compModeStack = [];
    var compModeStackTop = 0;
    var floodFillExtentAll = function (x, y, w, h, data, extent) { // return the extent of the fill

        var stack = [];
        var lookLeft = false;
        var lookRight = false;
        var sp = 0;
        var minx = w;
        var maxx = 0;
        var miny= h;
        var maxy = 0;

        var checkColour = function(x,y){
            if( x<0 || y < 0 || y >=h || x >= w){
                return false;
            }
            var ind = y * w + x;
            if( data[ind] !== 0 ){
                return true;
            }
            return false;
        }
        var setPixel = function(x,y){
            minx = Math.min(x,minx);
            maxx = Math.max(x,maxx);
            miny = Math.min(y,miny);
            maxy = Math.max(y,maxy);
            var ind = y * w + x;
            data[ind] = 0
        }
        stack.push([x,y]);                
            
        while (stack.length) {
            var pos = stack.pop();
            x = pos[0];
            y = pos[1];
            while (checkColour(x,y-1)) {
                y -= 1;
            }
            if(!checkColour(x-1,y) && checkColour(x-1,y-1)){
                stack.push([x-1,y-1]);
            }
            if(!checkColour(x+1,y) && checkColour(x+1,y-1)){
                stack.push([x+1,y-1]);
            }
            lookLeft = false;
            lookRight = false;
            while (checkColour(x,y)) {
                setPixel(x,y);
                if (checkColour(x - 1,y)) {
                    if (!lookLeft) {
                        stack.push([x - 1, y]);
                        lookLeft = true;
                    }
                } else 
                if (lookLeft) {
                    lookLeft = false;
                }
                if (checkColour(x+1,y)) {
                    if (!lookRight) {
                        stack.push([x + 1, y]);
                        lookRight = true;
                    }
                } else 
                if (lookRight) {
                    lookRight = false;
                }
                y += 1;
            }
            // check down left 
            if(checkColour(x-1,y) && !lookLeft){
                stack.push([x-1,y]);
            }
            if(checkColour(x+1,y) && !lookRight){
                stack.push([x+1,y]);
            }
        }
        // zero all pixels inside extent
        for(y = miny; y <= maxy; y ++){
            for(x = minx; x <= maxx; x++){
                data[y * w + x] = 0;
            }
        }
        if(extent === undefined){
            extent = {};
            extent.minx = minx;
            extent.miny = miny;
            extent.maxx = maxx;
            extent.maxy = maxy;
        }else{
            if(extent.minx === null){
                extent.minx = minx;
                extent.miny = miny;
                extent.maxx = maxx;
                extent.maxy = maxy;            
            }else{
                extent.minx = Math.min(minx, extent.minx);
                extent.miny = Math.min(miny, extent.miny);
                extent.maxx = Math.max(maxx, extent.maxx);
                extent.maxy = Math.max(maxy, extent.maxy);
            }
        }
        return extent;
    }        
    var FX = {
        setCompMode : function(name){
            ctx.globalCompositeOperation = compModes[name];
        },
        pushCompMode : function(name){
            compModeStack[compModeStackTop++] = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = compModes[name];
        },
        popCompMode : function(){
            if(compModeStackTop > 0){
                compModeStackTop -= 1;
                ctx.globalCompositeOperation = compModes[name];
            }
        },
        getCompMode : function(){
            return ctx.globalCompositeOperation;
        },
        filter : function(val){
            ctx.imageSmoothingEnabled = val === true;
        },
        filterMoz : function(val){
            ctx.mozImageSmoothingEnabled = val === true;
        },         
        normal : function(){ ctx.globalCompositeOperation = "source-over"; },
        sourceOver : function(){ ctx.globalCompositeOperation = "source-over"; },
        lighter : function(){ ctx.globalCompositeOperation = "lighter"; },
        glow : function(){ ctx.globalCompositeOperation = "lighter"; },
        fire : function(){ ctx.globalCompositeOperation = "lighter"; },
        multiply : function(){ ctx.globalCompositeOperation = "multiply"; },
        screen : function(){ ctx.globalCompositeOperation = "screen"; },
        colorDodge : function(){ ctx.globalCompositeOperation = "color-dodge"; },
        colorBurn : function(){ ctx.globalCompositeOperation = "color-burn"; },
        hardLight : function(){ ctx.globalCompositeOperation = "hard-light"; },
        softLight : function(){ ctx.globalCompositeOperation = "soft-light"; },
        overlay : function(){ ctx.globalCompositeOperation = "overlay"; },
        difference : function(){ ctx.globalCompositeOperation = "difference"; },
        exclution : function(){ ctx.globalCompositeOperation = "exclusion"; },
        hue : function(){ ctx.globalCompositeOperation = "hue"; },
        saturation : function(){ ctx.globalCompositeOperation = "saturation"; },
        color : function(){ ctx.globalCompositeOperation = "color"; },
        luminosity : function(){ ctx.globalCompositeOperation = "luminosity"; },
        sourceAtop : function(){ ctx.globalCompositeOperation = "source-atop"; },
        sourceIn : function(){ ctx.globalCompositeOperation = "source-in"; },
        sourceOut : function(){ ctx.globalCompositeOperation = "source-out"; },
        destinationOver : function(){ ctx.globalCompositeOperation = "destination-over"; },
        destinationAtop : function(){ ctx.globalCompositeOperation = "destination-atop"; },
        destinationIn : function(){ ctx.globalCompositeOperation = "destination-in"; },
        destinationOut : function(){ ctx.globalCompositeOperation = "destination-out"; },
        copy :function(){ ctx.globalCompositeOperation =  "copy"; },
        xor : function(){ ctx.globalCompositeOperation = "xor"; },           
    }        
    var context = {
        setCtx : function(_ctx){
            ctx = _ctx;
            w = ctx.canvas.width;
            h = ctx.canvas.height;
        },
        getCtx : function(){
            return ctx;
        },
        pushCtx : function(_ctx){
            ctxStack[ctxStackTop] = ctx;
            ctxStackTop += 1;
            ctx = _ctx;
            w = ctx.canvas.width;
            h = ctx.canvas.height;
        },
        popCtx : function(){
            if(ctxStackTop > 0){
                ctxStackTop -= 1;
                ctx = ctxStack[ctxStackTop];
                ctxStack[ctxStackTop] = null;
                w = ctx.canvas.width;
                h = ctx.canvas.height;
            }
        },
        setDefaults : function(){
            ctx.setTransform(1,0,0,1,0,0);
            ctx.globalAlpha = 1;
            FX.normal();
        },
        setWorldLocal : function(x,y,scaleX,scaleY,rotation){                
            if(rotation === undefined){  // if just one scale passed
                rotation = scaleY;
                scaleY = scaleX;
            }
            local.x = x;
            local.y = y;
            local.scaleX = scaleX;
            local.scaleY = scaleY;
            local.rotate = rotation;
            local.world = true;
            ctx.setTransform(transform.sx,0,0,transform.sy,transform.x,transform.y);
            ctx.transform(scaleX,0,0,scaleY,x,y);
            ctx.rotate(rotation);                
        },
        setLocal : function(x,y,scaleX,scaleY,rotation){
            if(rotation === undefined){  // if just one scale passed
                rotation = scaleY;
                scaleY = scaleX;
            }
            local.x = x;
            local.y = y;
            local.scaleX = scaleX;
            local.scaleY = scaleY;
            local.rotate = rotation;
            local.world = false;
            ctx.setTransform(scaleX,0,0,scaleY,x,y);
            ctx.rotate(rotation);
        },
        local : function(){
            if(local.world){
                ctx.setTransform(transform.sx,0,0,transform.sy,transform.x,transform.y);
                ctx.transform(local.scaleX,0,0,local.scaleY,local.x,local.y);
                ctx.rotate(local.rotate);
            }else{
                ctx.setTransform(local.scaleX,0,0,local.scaleY,local.x,local.y);
                ctx.rotate(local.rotate);
            }
        },            
    }
    var globalTransform = {
        setTransform : function(originX,originY,scaleX,scaleY){
            transform.x = originX;
            transform.y = originY;
            transform.sx = scaleX;
            transform.sy = scaleY;
        },
        getTransform : function(retTransform){
            if(retTransform === undefined){
                retTransform = {};
            }
            retTransform.x = transform.x
            retTransform.y = transform.y
            retTransform.sx = transform.sx
            retTransform.sy = transform.sy
            return retTransform;
        },
        pushTransform : function(originX,originY,scaleX,scaleY){
            var t;
            if(tStackTop >= transformStack.length){                    
                t = {};
                transformStack[tStackTop] = t;
            }else{
                t = transformStack[tStackTop];
            }
            tStackTop += 1;            
            t.x = transform.x;
            t.y = transform.y;
            t.sx = transform.sx;
            t.sy = transform.sy;
            
            transform.x = originX;
            transform.y = originY;
            transform.sx = scaleX;
            transform.sy = scaleY;
        },
        popTransform : function(){
            if(tStackTop > 0){
                tStackTop -= 1;
                t = transformStack[tStackTop];
                transform.x = t.x;
                transform.y = t.y;
                transform.sx = t.sx;
                transform.sy = t.sy;
            }
        },
    }
    var background = {
        stretch : function(image,alpha = 1){
            ctx.setTransform(1,0,0,1,0,0);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,0,0,ctx.canvas.width,ctx.canvas.height);
        },
        fit : function(image,alpha = 1){
            var scale = Math.min(ctx.canvas.width / image.width, ctx.canvas.height / image.height);
            ctx.setTransform(scale,0,0,scale,w/2,h/2);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-image.width / 2, -image.height / 2);
        },
        fill : function(image,alpha = 1){
            var scale = Math.max(ctx.canvas.width / image.width, ctx.canvas.height / image.height);
            ctx.setTransform(scale,0,0,scale,w/2,h/2);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-image.width / 2, -image.height / 2);
        },
    }
    var images = {
        draw : function (image, x, y, scale, rotation, alpha) {
            ctx.setTransform(scale, 0, 0, scale, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
        },
        drawWorld : function (image, x, y, scale, rotation, alpha) {
            ctx.setTransform(transform.sx, 0, 0, transform.sy, transform.x, transform.y);
            ctx.transform(scale, 0, 0, scale, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
        },
        drawLocal : function (image, x, y, scale, rotation, alpha) {
            ctx.transform(scale, 0, 0, scale, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
        },
        drawCenterScaled : function (image, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha) {
            ctx.setTransform(scaleX, 0, 0, scaleY, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, -centerX, -centerY);
        },
        drawWorldCenterScaled : function (image, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha) {
            ctx.setTransform(transform.sx, 0, 0, transform.sy, transform.x, transform.y);
            ctx.setTransform(scaleX, 0, 0, scaleY, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, -centerX, -centerY);
        },
        drawLocalCenterScaled : function (image, x, y, centerX, centerY, scaleX, scaleY, rotation, alpha) {
            ctx.transform(scaleX, 0, 0, scaleY, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, -centerX, -centerY);
        },
        drawAsLine : function (image, x1, y1, x2, y2, scale, alpha) {
            _x = x2 - x1;
            _y = y2 - y1;
            _dist = scale / Math.sqrt(_x * _x + _y * _y); // currently much quicker than Math.hypot on chrome
            ctx.setTransform(_x, _y, -_y * _dist, _x * _dist, x1, y1);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, 0, -image.height / 2, 1, image.height);
        },
        drawWorldAsLine : function (image, x1, y1, x2, y2, scale, alpha) {
            _x = x2 - x1;
            _y = y2 - y1;
            _dist = scale / Math.sqrt(_x * _x + _y * _y); // currently much quicker than Math.hypot on chrome
            ctx.setTransform(transform.sx, 0, 0, transform.sy, transform.x, transform.y);
            ctx.transform(_x, _y, -_y * _dist, _x * _dist, x1, y1);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, 0, -image.height / 2, 1, image.height);
        },
        drawLocalAsLine : function (image, x1, y1, x2, y2, scale, alpha) {
            _x = x2 - x1;
            _y = y2 - y1;
            _dist = scale / Math.sqrt(_x * _x + _y * _y); // currently much quicker than Math.hypot on chrome
            ctx.transform(_x, _y, -_y * _dist, _x * _dist, x1, y1);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, 0, -image.heigh / 2, 1, image.height);
        },
    }
    var sprites = {
        draw : function (image, index, x, y, scale, rotation, alpha) {
            spr = image.sprites[index];
            ctx.setTransform(scale, 0, 0, scale, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            sh = spr.h;
            sw = spr.w;
            if(spr.vx !== undefined){  // virtual sprite dimensions
                _x = -spr.vw / 2 + spr.vx;
                _y = -spr.vh / 2 + spr.vy;
                ctx.drawImage(image, spr.x, spr.y, sw, sh, _x, _y, sw, sh);
                return;
            }
            ctx.drawImage(image, spr.x, spr.y, sw, sh, -sw / 2, -sh / 2, sw, sh);
        },
        drawWorld : function (image, index, x, y, scale, rotation, alpha) {
            spr = image.sprites[index];
            sh = spr.h;
            sw = spr.w;
            ctx.setTransform(transform.sx, 0, 0, transform.sy, transform.x, transform.y);
            ctx.transform(scale, 0, 0, scale, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            if(spr.vx !== undefined){  // virtual sprite dimensions
                _x = -spr.vw / 2 + spr.vx;
                _y = -spr.vh / 2 + spr.vy;
                ctx.drawImage(image, spr.x, spr.y, sw, sh, _x, _y, sw, sh);
                return;
            }
            ctx.drawImage(image, spr.x, spr.y, sw, sh, -sw / 2, -sh / 2, sw, sh);
        },
        drawLocal : function (image, index, x, y, scale, rotation, alpha) {
            spr = image.sprites[index];
            sh = spr.h;
            sw = spr.w;
            ctx.transform(scale, 0, 0, scale, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            if(spr.vx !== undefined){  // virtual sprite dimensions
                _x = -spr.vw / 2 + spr.vx;
                _y = -spr.vh / 2 + spr.vy;
                ctx.drawImage(image, spr.x, spr.y, sw, sh, _x, _y, sw, sh);
                return;
            }
            ctx.drawImage(image, spr.x, spr.y, sw, sh, -sw / 2, -sh / 2, sw, sh);
        },
        drawTiles : function(image,tiles,x,y,scale,rotation,alpha){
            var index = 0;
            var map = tiles.map;
            var mapLen = map.length;
            var spriteList = image.sprites;
            _x1 = tiles.xSize === undefined ? spriteList[map[0]].w : tiles.xSize;
            _y1 = tiles.ySize === undefined ? spriteList[map[0]].h : tiles.ySize;
            ctx.setTransform(scale, 0, 0, scale, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;           
            for(_y = 0; _y < tiles.height; _y+= 1){
                for(_x = 0; _x < tiles.width; _x+= 1){
                    spr = spriteList[map[(index ++)%mapLen]];
                    sh = spr.h;
                    sw = spr.w;
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1 * _x, _y1 * _y, sw, sh);
                }
            }
        },
        drawLocalTiles : function(image,tiles,x,y,scale,rotation,alpha){
            var index = 0;
            var map = tiles.map;
            var mapLen = map.length;
            var spriteList = image.sprites;
            _x1 = tiles.xSize === undefined ? spriteList[map[0]].w : tiles.xSize;
            _y1 = tiles.ySize === undefined ? spriteList[map[0]].h : tiles.ySize;
            ctx.transform(scale, 0, 0, scale, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;           
            for(_y = 0; _y < tiles.height; _y+= 1){
                for(_x = 0; _x < tiles.width; _x+= 1){
                    spr = spriteList[map[(index ++)%mapLen]];
                    sh = spr.h;
                    sw = spr.w;
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1 * _x, _y1 * _y, sw, sh);
                }
            }
        },
        drawWorldTiles : function(image,tiles,x,y,scale,rotation,alpha){
            var index = 0;
            var map = tiles.map;
            var mapLen = map.length;
            var spriteList = image.sprites;
            _x1 = tiles.xSize === undefined ? spriteList[map[0]].w : tiles.xSize;
            _y1 = tiles.ySize === undefined ? spriteList[map[0]].h : tiles.ySize;
            ctx.setTransform(transform.sx, 0, 0, transform.sy, transform.x, transform.y);
            ctx.transform(scale, 0, 0, scale, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;           
            for(_y = 0; _y < tiles.height; _y+= 1){
                for(_x = 0; _x < tiles.width; _x+= 1){
                    spr = spriteList[map[(index ++)%mapLen]];
                    sh = spr.h;
                    sw = spr.w;
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1 * _x, _y1 * _y, sw, sh);
                }
            }
        },
        drawCenterScaled : function (image, index, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha) {
            spr = image.sprites[index];
            sh = spr.h;
            sw = spr.w;
            ctx.setTransform(scaleX, 0, 0, scaleY, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            if(spr.vx !== undefined){  // virtual sprite dimensions
                _x = -centerX + spr.vx;
                _y = -centerY + spr.vy;
                ctx.drawImage(image, spr.x, spr.y, sw, sh, _x, _y, sw, sh);
                return;
            }
            ctx.drawImage(image, spr.x, spr.y, sw, sh, -centerX, -centerY, sw, sh);
        },
        drawWorldCenterScaled : function (image, index, x, y, centerX, centerY, scaleX, scaleY, rotate, alpha) {
            spr = image.sprites[index];
            sh = spr.h;
            sw = spr.w;
            ctx.setTransform(transform.sx, 0, 0, transform.sy, transform.x, transform.y);
            ctx.transform(scaleX, 0, 0, scaleY, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            if(spr.vx !== undefined){  // virtual sprite dimensions
                _x = -centerX + spr.vx;
                _y = -centerY + spr.vy;
                ctx.drawImage(image, spr.x, spr.y, sw, sh, _x, _y, sw, sh);
                return;
            }
            ctx.drawImage(image, spr.x, spr.y, sw, sh, -centerX, -centerY, sw, sh);
        },
        drawLocalCenterScaled : function (image, index, x, y, centerX, centerY, scaleX, scaleY, rotation, alpha) {
            spr = image.sprites[index];
            sh = spr.h;
            sw = spr.w;
            ctx.transform(scaleX, 0, 0, scaleY, x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            if(spr.vx !== undefined){  // virtual sprite dimensions
                _x = -centerX + spr.vx;
                _y = -centerY + spr.vy;
                ctx.drawImage(image, spr.x, spr.y, sw, sh, _x, _y, sw, sh);
                return;
            }
            ctx.drawImage(image, spr.x, spr.y, sw, sh, -centerX, -centerY, sw, sh);
        },
        drawAsLine : function (image, index, x1, y1, x2, y2, scale, alpha) {
            spr = image.sprites[index];
            sh = spr.h;
            sw = spr.w;
            _x = x2 - x1;
            _y = y2 - y1;
            _dist = scale / Math.sqrt(_x * _x + _y * _y); // currently much quicker than Math.hypot on chrome
            ctx.setTransform(_x, _y, -_y * _dist, _x * _dist, x1, y1);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, spr.x, spr.y, sw, sh, 0, -sh / 2, 1, sh);
        },
        drawWorldAsLine : function (image, index, x1, y1, x2, y2, scale, alpha) {
            spr = image.sprites[index];
            sh = spr.h;
            sw = spr.w;
            _x = x2 - x1;
            _y = y2 - y1;
            _dist = scale / Math.sqrt(_x * _x + _y * _y); // currently much quicker than Math.hypot on chrome
            ctx.setTransform(transform.sx, 0, 0, transform.sy, transform.x, transform.y);
            ctx.transform(_x, _y, -_y * _dist, _x * _dist, x1, y1);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, spr.x, spr.y, sw, sh, 0, -sh / 2, 1, sh);
        },
        drawLocalAsLine : function (image, index, x1, y1, x2, y2, scale, alpha) {
            spr = image.sprites[index];
            sh = spr.h;
            sw = spr.w;
            _x = x2 - x1;
            _y = y2 - y1;
            _dist = scale / Math.sqrt(_x * _x + _y * _y); // currently much quicker than Math.hypot on chrome
            ctx.transform(_x, _y, -_y * _dist, _x * _dist, x1, y1);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, spr.x, spr.y, sw, sh, 0, -sh / 2, 1, sh);
        },
        drawAsLineRep : function (image, index, x1, y1, x2, y2, scale, alpha) {
            var i, len;
            if(Array.isArray(index)){
                spr = image.sprites[index[0]];
                i = 1;
                len = index.length;
            }else{
                spr = image.sprites[index];
            }
            sh = spr.h;
            sw = spr.w;
            _x = x2 - x1;
            _y = y2 - y1;
            _dist = Math.sqrt(_x * _x + _y * _y); // currently much quicker than Math.hypot on chrome
            _x *= scale / _dist;
            _y *= scale / _dist;
            ctx.setTransform(_x, _y, -_y, _x, x1, y1);
            ctx.globalAlpha = alpha;
            sh1 = -sh / 2;
            _dist *= 1 / scale;
            if(i !== undefined){
                for(_x1 = 0; _x1 < _dist-sw; _x1 += sw){            
                
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                    spr = image.sprites[index[(i++)%len]];
                }
                if(_dist - _x1 < sw){
                    sw = _dist-_x1;
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                }
            }else{
                for(_x1 = 0; _x1 < _dist-sw; _x1 += sw){            
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                }
                if(_dist - _x1 < sw){
                    sw = _dist-_x1;
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                }
            }
        },
        drawWorldAsLineRep : function (image, index, x1, y1, x2, y2, scale, alpha) {
            var i, len;
            if(Array.isArray(index)){
                spr = image.sprites[index[0]];
                i = 1;
                len = index.length;
            }else{
                spr = image.sprites[index];
            }
            sh = spr.h;
            sw = spr.w;
            _x = x2 - x1;
            _y = y2 - y1;
            _dist = Math.sqrt(_x * _x + _y * _y); // currently much quicker than Math.hypot on chrome
            _x *= scale / _dist;
            _y *= scale / _dist;
            ctx.setTransform(transform.sx, 0, 0, transform.sy, transform.x, transform.y);
            ctx.transform(_x, _y, -_y, _x, x1, y1);
            ctx.globalAlpha = alpha;
            sh1 = -sh / 2;
            _dist *= 1 / scale;
            if(i !== undefined){
                for(_x1 = 0; _x1 < _dist-sw; _x1 += sw){            
                
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                    spr = image.sprites[index[(i++)%len]];
                }
                if(_dist - _x1 < sw){
                    sw = _dist-_x1;
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                }
            }else{
                for(_x1 = 0; _x1 < _dist-sw; _x1 += sw){            
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                }
                if(_dist - _x1 < sw){
                    sw = _dist-_x1;
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                }
            }
        },
        drawLocalAsLineRep : function (image, index, x1, y1, x2, y2, scale, alpha) {
            var i, len;
            if(Array.isArray(index)){
                spr = image.sprites[index[0]];
                i = 1;
                len = index.length;
            }else{
                spr = image.sprites[index];
            }
            sh = spr.h;
            sw = spr.w;
            _x = x2 - x1;
            _y = y2 - y1;
            _dist = Math.sqrt(_x * _x + _y * _y); // currently much quicker than Math.hypot on chrome
            _x *= scale / _dist;
            _y *= scale / _dist;
            ctx.transform(_x, _y, -_y, _x, x1, y1);
            ctx.globalAlpha = alpha;
            sh1 = -sh / 2;
            _dist *= 1 / scale;
            if(i !== undefined){
                for(_x1 = 0; _x1 < _dist-sw; _x1 += sw){            
                
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                    spr = image.sprites[index[(i++)%len]];
                }
                if(_dist - _x1 < sw){
                    sw = _dist-_x1;
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                }
            }else{
                for(_x1 = 0; _x1 < _dist-sw; _x1 += sw){            
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                }
                if(_dist - _x1 < sw){
                    sw = _dist-_x1;
                    ctx.drawImage(image, spr.x, spr.y, sw, sh, _x1, sh1, sw, sh);
                }
            }
        },
        locateSprites : function(image){
            var w,h,c,ct,size,imgData,index,extent,sprites,x,y;
            function findSprite(){
                while(index < size && imgData[index] === 0){
                    index ++;
                }
                if(index < size){
                    return true;
                }
                return false;
            }
            w = image.width;
            h = image.height;
            c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            size = w * h;
            ct = c.getContext("2d");
            ct.drawImage(image,0,0);
            imgData = new Uint32Array(ct.getImageData(0,0,w,h).data.buffer);
            index = 0;
            extent = {minx:null,maxx:null,miny:null,maxy:null};
            sprites = [];
            while(findSprite()){
                x = index % w;
                y = Math.floor(index / w);
                extent.minx = null;
                floodFillExtentAll(x,y,w,h,imgData,extent);
                sprites.push({
                    x : extent.minx,
                    y : extent.miny,
                    w : extent.maxx - extent.minx + 1,
                    h : extent.maxy - extent.miny + 1,
                });
                    
            }
            image.sprites = sprites;
            return image;
        },
        gridSprites : function(image,xCount,yCount){
            var warn = false;
            var sprites = image.sprites;
            if(sprites === undefined){
                sprites = [];
            }
            var xSize = Math.floor(image.width / xCount);
            var ySize = Math.floor(image.height / yCount);
            if(xSize * xCount !== image.width){
                console.warn("EZSprites.sprites.gridSprites Image '"+image.src.substr(0,120)+"' width '"+image.width+"' could not be evenly divided by "+xCount);
                warn = true;
            }
            if(ySize * yCount !== image.height){
                console.warn("EZSprites.sprites.gridSprites Image '"+image.src.substr(0,120)+"' height '"+image.height+"' could not be evenly divided by "+yCount);
                warn = true;
            }
            if(warn){
                console.warn("The grid sprites may be missing some pixels.");
            }
            for(_y = 0; _y < yCount; _y += 1){
                for(_x = 0; _x < xCount; _x += 1){
                    sprites.push({
                        x : _x * xSize,
                        y : _y * ySize,
                        w : xSize,
                        h : ySize,
                    });
                }
            }
            image.sprites = sprites;
            return image;
        }
    }
    // setup any context specific functionality.
    
    if(document.createElement("canvas").getContext("2d").mozImageSmoothingEnabled !== undefined){
        FX.filter = FX.filterMoz;
    }
        
    
    var API = {
        resetAll : resetAll,
        sprites : sprites,
        images : images,
        background : background,
        FX : FX,
        context : context,
        world : globalTransform,
        namedCompModes : compModesNames,
    }
    return API;        
})();
