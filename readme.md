EZSprites
----

EZSprites is a work in progress.


EZSprites is a very simple sprite rendering utility written in javascript for use with the 2D canvas API. Just set the context and then draw sprites as images or from sprite sheets. The most basic sprite is centered, scaled, rotated and has an alpha.

For example

    EZSprites.context.setCtx(context); // set the context
    EZSprites.images.draw(image, x, y, 1, 0, 1); // draw image centered at x,y, scale 1, no rotation, and alpha 1
    EZSprites.images.draw(image, x, y, 2, Math.PI / 2, 0.5); // draw image centered at x,y, scale 2, 
                                                             // rotated 90 clockwise, and alpha 0.5
    
To render sprites from a sprite sheet. First attach a sprites list to the image, this is just an array containing the top left coordinate of the sprite and its width and height

    var gameSprites = [
      {x : 0, y : 0, w : 10, h : 10},  // sprite 1
      {x : 10, y : 0, w : 20, h : 20}, // sprite 2
    ]
    image.sprites = gameSprites; // attach it to the image only need to do this once.
    
    EZSprites.sprites.draw(image, 0, x, y, 2, Math.PI / 2, 0.5); // draw sprite 0  centered at x,y, scale 2, 
                                                                 // rotated 90 clockwise, and alpha 0.5
    EZSprites.sprites.draw(image, 1, x, y, 0.5, Math.PI / 4, 1); // draw sprite 0  centered at x,y, scale 0.5,
                                                                 // rotated 45 clockwise, and alpha 0.5
    
No need to worry about the transform or much of the math involved in placing the sprite/image. If you only use EZSprites just call as shown above. If you are doing your own rendering then just wrap all the EZSprites calls with a `context.save()` and `context.restore()`. If it is only the default settings then just call `EZSprites.context.setDefaults()` and the canvas will be ready to render to.



Helper function 
----

   EZSprites.sprites.locateSprites (image)
        Scans the supplied image (spritesheet) and locates all the sprites. A sprite is any continuous set of pixels 
        that have a non zero alpha value. Sprites should not overlap. 
        
        Moat.
        For the best results you should have a one pixel transparent boarder (moat) around the sprite. This will prevent colour bleeding from neighbouring sprites. Sprites can be butted against the image sides (no boarder required) only inside edges of sprite need a moat. 
        
        If a sprite has a width or height that is not event some draw functions will give a slightly blurred effect. It is best to ensure that the sprite width and heights are even.
        
        If the sprite is discontinuous (some pixels are not touching) they can appear as separate sprites. To connect sprite pixels you can use a very faint alpha pixel (alpha value = 1 (of 255)) to connect them or designate a linking/bounding colour. All pixels of this colour will be considered scaffolding and removed from image 
        
        > **NOTE** scaffold pixels has not yet been implemented. This features usage may change.
        
        > **Note** it is recommended that you use this function to local the sprites during production and then add the sprite list to the image at load time in the release version of your code. This will greatly improve load time and prevent complications that can result if you apply filters or transformations (scale) to the image.
        
        Arguments
            image  The image to scan. Must be from same domain or have COREs clearance.
            
        Returns 
            image  If the image is unmodified then the original is returned. If modified then a new copy is returned

            
Notes on sprites.
----

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
----

For EZSprites.sprite and EZSprite.image modules the main draw functions are draw, drawCenterScaled, drawAsLine

Drawing
----

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




See the examples for more code examples.


- Tank example shows how to use `drawLocal`, `drawLocalCenterScaled`, `setLocal` to set the local coordinate space. The base of the tank rotates and moves. To draw the turret it needs to rotate and move with the tank base but still have independent rotation scale and rotation. When the tank shoots the flash needs to be at the end of the gun. All you need is the y distance the end of the gun is from the turret center. Code in the script tag of tankDemo.html

- WorldTank shows the use of `drawWorld`,`drawLocal`, `drawLocalCenterScaled`, `setWorldLocal`, `setTransform`, `screen2World`, `zoom2Screen` and is basically the same as Tank but with the ability to zoom and pan the world. Use mouse wheel to zoom and right button to pan.