
/*===================================================================================================================120
Its all about performance.
----

    Since my first 8 bit game in 1980 written in assemble to the game I am writing at the moment in JavaScript (I am always writing a game) the number one overriding objective for the code is performance. Code performance means I do not have to limit my imagination (as much) and can feel confident when adding extra FX, or more sophisticated logic that it will not effect the frame rate.
    
    EZSprites is no exception and is designed with performance in mind. There is hence no error checking or vetting in this code as this adds overhead reduces the amount of code that is dedicated to the game per frame. As a user of this utility you need to be careful and code in such a way as to avoid sending bad values to EZSprites function.
    
    One potential source of error is the sprite sheet index that you pass as a second argument to the EZSprites.sprites functions. If you pass an index that is out of range the default JavaScript error will be thrown. There is no acceptable default behaviour that can solve this problem (don't draw anything ??, use a place holder image??? are just as bad as crashing). So be carefull.
    
    **Pools and static memory.**
    
    Javascript comes with Garbage Collection (GC) and for any that have ever had to manage their own memory will know is the greatest thing since sliced bread. But it has its dark side, you have no control over it, and when it does its thing it will block your code. Its easy to tell if a game is badly managing its memory as every few second it will pause. To avoid this use pools and pre assign memory (static memory).
    
    A pool is a predefined set of objects that have been created and assigned memory at the start of the performance section of code. Typically at the level start. The objects are not deleted until performance is not needed, the end of level. As you need object you get them from the pool, use them until not needed, then returned to the pool for use again latter.
    
    Static memory is just the memory assigned to pools or arrays to the start of the performance section. When using an array you should initialise it with the maximum size you expect it to grow to. You should not try to avoid increasing its size because increasing an arrays size means internally JS makes a new copy of the array to accommodate the extra length, and dumps the old copy for GC to clean up.
    
    Some of the functions in EZSprites have an optional return object (for example EZSprites.world.screen2World(x,y,retPosition)) if you do not supply the return object a new one is created for you and returned. If you do this every frame then you will add more work to the GC and degrade the performance. To avoid GC hits create the return object at the start of the game/level and use that same object every time you make that call. Never delete it.
    
    **EZSprites uses pools and static memory** 
    
    > **Note:** Care has been taken to not hold references to object outside the control of EZSprite. Do not rely on EZSprites to hold references to images, context, or any objects unless they are on one of the various internal stacks. You must ensure that every function called that begins with `push` must have a associated `pop`
    
    > If you have a condition that may cause the code to stop using EZSprites at some point and you have lost track of what stacks you have used, call `EZSprites.resetAll` it will empty all the stacks and reassign static memory for any internal memory it needs. 
    
    > The stacks used are pre assigned 16 items. If you expect the depth of push,pop operations to be deeper than 16 call resetAll with the max depth you expect the stacks to be.
    
    
    


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
            Set the current context. Overwrites existing if any.
        getCtx();
            Get the current context being used.
        pushCtx(context)
            Push the current context onto a stack and set the new context to the the argument given.
        popCtx()
            Pops the last pushed context from the stack and sets it as the current context.
        setWorldLocal(x,y,scaleX,scaleY,rotation)     
            Sets the context transform to the World and local transform
        setLocal(x,y,scaleX,scaleY,rotation)
            Argument options
                (x,y,scaleX,scaleY,rotation)
                (x,y,scale,rotation)
            Sets the context transform to the local transform. 
        local()
            Recalls last transform set by setLocal, or setWorldLocal
        setDefaults()
            Restores used context settings to canvas default. globalAlpha, currentTransform, globalCompositeOperation.
        
    world  
        Use to set world coordinates
        
        setTransform(originX,originY,scaleX,scaleY)
            Argument options
                (originX,originY,scaleX,scaleY)
                (originX,originY,scale)
            Set the current world coordinates. If scaleY is not supplied then scaleX is used as the uniform scale.
        setPosition(originX,originY){
            Set the current world origin coordinates.
        setScale(scaleX,scaleY){
            Argument options
                (scaleX,scaleY)
                (scale)
            Set the world scale.If scaleY is not supplied then scaleX is used as the uniform scale.
        zoom2Screen(x,y,amount,invert)
            Zooms by amount (amount is a scaling multiplier) at the world position corresponding to the screen coordinates x,y. If invert is true the direction of zoom is reversed
        screen2World(x, y, retPosition)
            Converts screen coordinates to current world coordinates. retPosition is optional. If not supplied a new one is created. (WARNING retPostion should be used, if you don't each call to this function will allocate new memory and if you do not keep a reference then it will also incur addition GC overhead)
        world2Screen(x, y, retPosition)
            Converts current world coordinates to screen coordinates.retPosition is optional. If not supplied a new one is created. (WARNING retPostion should be used, if you don't each call to this function will allocate new memory and if you do not keep a reference then it will also incur addition GC overhead)
        getTransform(returnTransform)
            Get the current world coordinates            
        pushTransform(originX,originY,scaleX,scaleY)
            Argument options
                (originX,originY,scaleX,scaleY)
                (originX,originY,scale)
            Push current world coordinates onto the stack and set a new one. Note you must match this with a pop. If scaleY is not supplied then scaleX is used as the uniform scale.            
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
    const PI2 = Math.PI * 2;
    const PI = Math.PI;
    var ctx;
    var ctxStack = [null, null, null, null, null, null, null, null, null];
    var ctxStackTop = 0;
    var w,h;    // width and height
    var _x, _y, _x1, _y1, _dist;  // work variables
    var sw, sh, sw1, sh1; // work vars (sprite width and height)
    var spr,t; // work var
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
    function resetAll(staticMemoryCount){
        var i;
        staticMemoryCount = staticMemoryCount === undefined ? 16 : staticMemoryCount;
        ctxStackTop = 0;
        tStackTop = 0;
        transformStack = [];
        ctxStack = [];
        compModeStack = [];
        // fill the transform array with static objects
        for(i = 0; i < staticMemoryCount; i += 1){
            ctxStack.push(null);
            compModeStack.push(null);
            globalTransform.pushWorld(0,0,1);
        }
        for(i = 0; i < staticMemoryCount; i += 1){
            globalTransform.popWorld();
        }
        ctx = null;
        transform.x = 0;
        transform.y = 0;
        transform.sx = 1;
        transform.sy = 1;
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
    const getImageData = function(image,format){
        var w,h,c,ct;
        w = image.width;
        h = image.height;
        c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        ct = c.getContext("2d");
        ct.drawImage(image,0,0);
        if(format === "32bit"){
            return new Uint32Array(ct.getImageData(0,0,w,h).data.buffer);            
        }
        return ct.getImageData(0,0,w,h).data;            
    }
    const floodFillExtentAll = function (x, y, w, h, data, extent) { // return the extent of the fill

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
    const FX = {
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
    const collision = {
        createRadialPerimiterMap : function(image,spriteIndex,imageData, rCount = 32){
            // creates a perimeter map of a sprite or image
            // if the image has sprite then supply the spriteIndex
            // rCount (radial count) is the number of radial segments. High segment count do not effect the performance
            // for all but the full collision test.
            var max,min,i,maxRadius,rad,xx,yy,ind,count,perimeter,val,mean,c,x,y,w,h,data,dw;
            if(image.sprites !== undefined){
                x = image.sprites[spriteIndex].x;
                y = image.sprites[spriteIndex].y;
                w = image.sprites[spriteIndex].w;
                h = image.sprites[spriteIndex].h;                
            }else{
                x = 0;
                y = 0;
                w = image.width;
                h = image.height;                
            }
            if(imageData !== undefined){
                if(imageData.buffer === undefined){
                    if(imageData.data !== undefined){
                        data = new Uint32Array(imageData.data.buffer);
                    }
                }else{
                    data = new Uint32Array(imageData.buffer);
                }
            }
            if(data === undefined){
                data = getImageData(image,"32bit");                
            }
            dw = image.width;

            perimeter = {
                dist :[],
                min : undefined,
                max : undefined,
                mean : undefined,
            };
            max = -Infinity;
            min = Infinity;
            mean = 0;
            c = 0;
            maxRadius = Math.ceil(Math.sqrt(w*w+h*h)/2)+2;
            for(i = 0; i < PI2; i += PI2/rCount, count ++){
                rad = maxRadius;
                do{
                    xx = Math.round(Math.cos(i) * rad + x + w/2);
                    yy = Math.round(Math.sin(i) * rad + y + h/2);
                    if(xx >= x && xx < x+w && yy >= y && yy < y + h){
                        ind = xx * 4 + yy * iw4;
                        val = data[xx + yy * dw];
                    }else{
                        val = 0;
                    }
                    rad -= 1;
                }while(val === 0 && rad > -1)
                rad += 1;
                min = Math.min(min,rad);
                max = Math.max(max,rad);
                mean += rad;
                c += 1;
                perimiter.dist.push(rad);
            }
            perimiter.max = max;
            perimiter.min = min;
            perimiter.mean = mean / c; 
            return perimiter;
        },
        testPerimiterCollision : function(image1,sprIndex1,x1,y1,s1,r1,image2,sprIndex2,x2,y2,s2,r2,details){
            var dist,x,y,p1,p2,d1,d2,dir,dist1,dist2;
            if(image1.sprites !== undefined){
                p1 = image1.sprites[sprIndex1].perim;
            }else{
                p1 = image1.perim;
            }
            if(image2.sprites !== undefined){
                p2 = image2.sprites[sprIndex2].perim;
            }else{
                p2 = image2.perim;
            }
            details.dx = x = x2-x1;
            details.dy = y = y2-y1;
            details.dist = dist = Math.sqrt(x*x + y*y);
            if(dist < p1.max * s1 + p2.max * s2){
                details.dir = dir = Math.atan2(y,x);
                d1 = dir - r1;
                d2 = dir + Math.PI - r2;
                d1 = (((d1 % PI2) + PI2 ) % PI2) / PI2;
                d2 = (((d2 % PI2) + PI2 ) % PI2) / PI2;
                d1 = Math.round(d1 * p1.dist.length) % p1.dist.length;
                d2 = Math.round(d2 * p2.dist.length) % p2.dist.length;
                dist1 = p1.dist[d1] * s1;
                dist2 = p2.dist[d2] * s2;
                if(dist < dist1 + dist2){
                    var rat = dist1 / (dist1 + dist2);
                    var xx = x1 + x * rat;
                    var yy = y1 + y * rat;
                    x /= dist;
                    y /= dist;
                    details.x1 = xx - x * dist1;
                    details.y1 = yy - y * dist1;
                    details.d1 = dist1;
                    details.x2 = xx + x * dist2;
                    details.y2 = yy + y * dist2;
                    details.d2 = dist2;
                    details.cx = xx;
                    details.cy = yy;
                    details.dir = dir;    
                    details.dist =dist1 + dist2;
                    return true;
                }
            }
            return false;
        },        
        testPerimiterCollisionSimple : function(image1,sprIndex1,x1,y1,s1,r1,image2,sprIndex2,x2,y2,s2,r2){
            var dist,x,y,p1,p2,d1,d2,dir,dist1,dist2;
            if(image1.sprites !== undefined){
                p1 = image1.sprites[sprIndex1].perim;
            }else{
                p1 = image1.perim;
            }
            if(image2.sprites !== undefined){
                p2 = image2.sprites[sprIndex2].perim;
            }else{
                p2 = image2.perim;
            }
            x = x2-x1;
            y = y2-y1;
            dist = Math.sqrt(x*x + y*y);
            if(dist < p1.max * s1 + p2.max * s2){
                dir = Math.atan2(y,x);
                d1 = dir - r1;
                d2 = dir + Math.PI - r2;
                d1 = (((d1 % PI2) + PI2 ) % PI2) / PI2;
                d2 = (((d2 % PI2) + PI2 ) % PI2) / PI2;
                d1 = Math.round(d1 * p1.dist.length) % p1.dist.length;
                d2 = Math.round(d2 * p2.dist.length) % p2.dist.length;
                dist1 = p1.dist[d1] * s1;
                dist2 = p2.dist[d2] * s2;
                if(dist < dist1 + dist2){
                    return true;
                }
            }
            return false;
        }        
        
    }
    const context = {
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
    const globalTransform = {
        setWorld : function(originX,originY,scaleX,scaleY){
            transform.x = originX;
            transform.y = originY;
            transform.sx = scaleX;
            transform.sy = scaleY !== undefined ? scaleY : scaleX;
        },
        setPosition : function(originX, originY){
            transform.x = originX;
            transform.y = originY;
        },
        setScale : function(scaleX, scaleY){
            transform.sx = scaleX;
            transform.sy = scaleY !== undefined ? scaleY : scaleX;
        },
        zoom2Screen : function(x, y, amount, invert){
            amount = invert === true ? 1 / amount : amount;
            _x = x - transform.x;
            _y = y - transform.y;
            transform.sx *= amount;
            transform.sy *= amount;
            transform.x = x - (x - transform.x) * amount;
            transform.y = y - (y - transform.y) * amount;
        },
        screen2World : function(x,y,retPosition){
            if(retPosition === undefined){
                retPosition = {};
            }
            retPosition.x = (x - transform.x) / transform.sx;
            retPosition.y = (y - transform.y) / transform.sy;
            return retPosition;
        },
        world2Screen : function(x, y, retPosition){
            if(retPosition === undefined){
                retPosition = {};
            }
            retPosition.x = x * transform.sx + transform.x;
            retPosition.y = y * transform.sy + transform.y;
            return retPosition;
        },
        getWorld : function(retTransform){
            if(retTransform === undefined){
                retTransform = {};
            }
            retTransform.x = transform.x
            retTransform.y = transform.y
            retTransform.sx = transform.sx
            retTransform.sy = transform.sy
            return retTransform;
        },
        pushWorld : function(originX,originY,scaleX,scaleY){
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
            transform.sy = scaleY !== undefined ? scaleY : scaleX;
        },
        popWorld : function(){
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
    const background = {
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
    const images = {
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
    const sprites = {
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
        
    
    const API = {
        resetAll : resetAll,
        sprites : Object.freeze(sprites),
        images : Object.freeze(images),
        background : Object.freeze(background),
        FX : Object.freeze(FX),
        context : Object.freeze(context),
        world : Object.freeze(globalTransform),
        namedCompModes : Object.freeze(compModesNames),
    }
    resetAll();
    return API;        
})();
