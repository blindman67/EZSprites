EZSprites



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


See the examples for more code examples.

- Tank example shows how to use `drawLocal`, `drawLocalCenterScaled`, `setLocal` to set the local coordinate space. The base of the tank rotates and moves. To draw the turret it needs to rotate and move with the tank base but still have independent rotation scale and rotation. When the tank shoots the flash needs to be at the end of the gun. All you need is the y distance the end of the gun is from the turret center. Code in the script tag of tankDemo.html