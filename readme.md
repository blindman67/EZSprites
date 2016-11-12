EZSprites



EZSprites is a very simple sprite rendering utility writen in javascript for use with the 2D canvas API. Just set the context and then draw sprites as images or from sprite sheets. The most basic sprite is centered, scaled, rotated and has an alpha.

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

You can also draw with more control `drawCenterScaled` takes 

- image   Image containing the sprites
- spriteIndex  Index of the sprite to render
- x, y  Render location, where the center is rendered
- centerX, centerY Where on the sprite the center is (can be outside the sprite)
- scaleX, scaleY The scale in the X and Y directions
- rotation The amount of rotation
- alpha The amount of alpha

Example
   
   
    EZSprites.sprites.drawCenterScaled(image, 0, x, y, 2, 5, 2, 1, Math.PI / 4, 1); // rotate 45 around sprite pixel (2,5) 
                                                                                    // scale 2 times in the sprites x direction and
                                                                                    // normal scale in the y direction.
    
For each sprite draw function there is a matching image render function. Just pass the image and dont add the sprite index

    EZSprites.images.drawCenterScaled(image, x, y, 2, 5, 2, 1, Math.PI / 4, 1); // rotate 45 around image pixel (2,5) 
                                                                                // scale 2 times in the sprites x direction and 
                                                                                // normal scale in the y direction.

To render a tank from a sprite sheet first draw the sprite using draw

    var myTank = {
        x ; 0,y :0,
        direction : 1,
        scale : 0,
        baseSpriteIndex : 0,
        turrent : {
            x : 10,
            y : 10,
            direction : -1,
            turrentSpriteIndex : 1,
        }
    }
    EZSprite.sprites.draw(tankImage, myTank.baseSpriteIndex, myTank.x, myTank.y, myTank.scale, mytank.direction, 1);

Then draw the turrent ontop in the tanks local coordinates.
    
    
    EZSprite.sprites.drawLocal(
        tankImage,
        myTank.turrentSpriteIndex, 
        myTank.turrent.x, 
        myTank.turrent.y, 
        myTank.scale,
        mytank.turrent.direction,
        1
    );
    
Each draw leaves the the 2D context in the local space fot that sprite. So you could add a radar ontop of the turrnet that follows the tank, then turrnent then has its own scale, position and direction


If you have several items to draw in the sprites local coordinate system then use the local coordinates helpers.

    EZSprite.sprites.draw(
        tankImage, 
        myTank.baseSpriteIndex, 
        myTank.x, 
        myTank.y, 
        myTank.scale, 
        mytank.direction,
        1
    );    
    // set the local cordinate system to match the tank base
    EZSprite.context.setLocal(
        myTank.x, 
        myTank.y,   
        myTank.scale, 
        myTank.scale, 
        mytank.direction
    ); // set the local coordinates.
    EZSprite.sprites.drawLocal(
        tankImage, 
        myTank.baseSpriteIndex, 
        myTank.turrent1.x, 
        myTank.turrent1.y, 
        myTank.scale, 
        mytank.turrent.direction,
        1
    );
    EZSprite.context.local(); // go back to the base coordnate system.
    EZSprite.sprites.drawLocal(
        tankImage,  
        myTank.baseSpriteIndex, 
        myTank.turrent2.x, 
        myTank.turrent2.y, 
        myTank.scale, 
        mytank.turrent2.direction,
        1
    );
    
    
    

