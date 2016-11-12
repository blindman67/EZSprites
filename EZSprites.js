
/*===================================================================================================================120
ezSprite properties
    resetAll()
    sprites
        draw(image,index,x,y,scale,rotate,alpha);
        drawCenterScaled(image,index,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
        drawWorld(image,index,x,y,scale,rotate,alpha)
        drawWorldCenterScaled(image,index,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
        drawLocal(image,index,x,y,scale,rotate,alpha)
        drawLocalCenterScaled(image,index,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
    images
        draw(image,x,y,scale,rotate,alpha)
        drawCenterScaled(image,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
        drawWorld(image,x,y,scale,rotate,alpha)
        drawWorldCenterScaled(image,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
        drawLocal(image,x,y,scale,rotate,alpha)
        drawLocalCenterScaled(image,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
    background
        stretch(image)
        fit(image)
        fill(image)
    FX
        setCompMode(name)
        pushCompMode(name)
        popCompMode()
        getCompMode()
        normal()
        lighter()
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
        setTransform(originX,originY,scaleX,scaleY)
        getTransform(returnTransform)
        pushTransform(originX,originY,scaleX,scaleY)
        popTransform()
    namedCompModes
        normal
        lighter
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

        
        
Basic usage. 

You must set up the canvas and context. Load the images and set up the animation loops (if you are animating)

Set up the context

    ezSprites.context.setCtx(context);  // only needed once if you are only using one canvas context        

    // recommend that you create a shorter reference to the sprite types you wanting to use
    var draw = ezSprites.image.draw;
    draw(image,x,y,1,0,1); // draws an image centered at x,y with scale 1 and no rotation and alpha = 1
    draw(image,x,y,2,Math.PI/2,1); // draws image centered at x,y scale 2 90 deg clock wise
    


ezSprite properties
    resetAll()
    sprites
        draw(image,index,x,y,scale,rotate,alpha);
        drawCenterScaled(image,index,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
        drawWorld(image,index,x,y,scale,rotate,alpha)
        drawWorldCenterScaled(image,index,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
        drawLocal(image,index,x,y,scale,rotate,alpha)
        drawLocalCenterScaled(image,index,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
    images
        draw(image,x,y,scale,rotate,alpha)
        drawCenterScaled(image,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
        drawWorld(image,x,y,scale,rotate,alpha)
        drawWorldCenterScaled(image,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
        drawLocal(image,x,y,scale,rotate,alpha)
        drawLocalCenterScaled(image,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha)
    background
        stretch(image)
        fit(image)
        fill(image)
    FX
        setCompMode(name)
        pushCompMode(name)
        popCompMode()
        getCompMode()
        normal()
        lighter()
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
    var ctx;
    var ctxStack = [null,null,null,null,null,null,null,null,null];
    var ctxStackTop = 0;
    var w,h;    // width and height
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
        ctxStack = [null,null,null,null,null,null,null,null,null];
        ctx = null;
        transform.x = 0;
        transform.y = 0;
        transform.sx = 1;
        transform.sy = 1;
        compModeStack = [];
        compModeStackTop = 0;

    }
    
    
    // darker // has limited support so not included
        
    var compModesNames = {
        normal : "source-over",
        lighter : "lighter",
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
    
    
    // return the extent of the fill
    var floodFillExtentAll = function (x, y, w, h, data, extent) {

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
            var scale = Math.min(image.width / ctx.canvas.width,image.height / ctx.canvas.height);
            ctx.setTransform(scale,0,0,scale,w/2,h/2);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-image.width / 2, -image.height / 2);
        },
        fill : function(image,alpha = 1){
            var scale = Math.max(image.width / ctx.canvas.width,image.height / ctx.canvas.height);
            ctx.setTransform(scale,0,0,scale,w/2,h/2);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-image.width / 2, -image.height / 2);
        },
    }
    var images = {
        draw : function(image,x,y,scale,rotation,alpha){
            ctx.setTransform(scale,0,0,scale,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-image.width/2,-image.height/2);
        },
        drawCenterScaled : function(image,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha){
            ctx.setTransform(scaleX,0,0,scaleY,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-centerX,-centerY);
        },            
        drawWorld : function(image,x,y,scale,rotation,alpha){
            ctx.setTransform(transform.sx,0,0,transform.sy,transform.x,transform.y);
            ctx.transform(scale,0,0,scale,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-image.width/2,-image.height/2);
        },        
        drawWorldCenterScaled : function(image,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha){
            ctx.setTransform(transform.sx,0,0,transform.sy,transform.x,transform.y);
            ctx.setTransform(scaleX,0,0,scaleY,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-centerX,-centerY);
        },               
        drawLocal : function(image,x,y,scale,rotation,alpha){
            ctx.transform(scale,0,0,scale,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-image.width/2,-image.height/2);
        },        
        drawLocalCenterScaled : function(image,x,y,centerX,centerY,scaleX,scaleY,rotation,alpha){
            ctx.transform(scaleX,0,0,scaleY,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,-centerX,-centerY);
        },            
    }
    var sprites = {

        draw : function(image,index,x,y,scale,rotation,alpha){
            var sh,sw;
            var spr = image.sprites[index];
            sh = spr.h
            sw = spr.w
            ctx.setTransform(scale,0,0,scale,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,spr.x,spr.y,sw,sh,-sw/2,-sh/2,sw,sh);
        },
        drawCenterScaled : function(image,index,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha){
            var sh,sw;
            var spr = image.sprites[index];
            sh = spr.h
            sw = spr.w
            ctx.setTransform(scaleX,0,0,scaleY,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,spr.x,spr.y,sw,sh,-centerX,-centerY,sw,sh);
        },
        drawWorld : function(image,index,x,y,scale,rotation,alpha){
            var sh,sw;
            var spr = image.sprites[index];
            sh = spr.h
            sw = spr.w
            ctx.setTransform(transform.sx,0,0,transform.sy,transform.x,transform.y);
            ctx.transform(scale,0,0,scale,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,spr.x,spr.y,sw,sh,-sw/2,-sh/2,sw,sh);
        },        
        drawWorldCenterScaled : function(image,index,x,y,centerX,centerY,scaleX,scaleY,rotate,alpha){
            var sh,sw;
            var spr = image.sprites[index];
            sh = spr.h
            sw = spr.w
            ctx.setTransform(transform.sx,0,0,transform.sy,transform.x,transform.y);
            ctx.transform(scaleX,0,0,scaleY,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,spr.x,spr.y,sw,sh,-centerX,-centerY,sw,sh);
        },
        drawLocal : function(image,index,x,y,scale,rotation,alpha){
            var sh,sw;
            var spr = image.sprites[index];
            sh = spr.h
            sw = spr.w
            ctx.transform(scale,0,0,scale,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,spr.x,spr.y,sw,sh,-sw/2,-sh/2,sw,sh);
        },        
        drawLocalCenterScaled : function(image,index,x,y,centerX,centerY,scaleX,scaleY,rotation,alpha){
            var sh,sw;
            var spr = image.sprites[index];
            sh = spr.h
            sw = spr.w
            ctx.transform(scaleX,0,0,scaleY,x,y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image,spr.x,spr.y,sw,sh,-centerX,-centerY,sw,sh);
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
            return sprites.length;
        }
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
