//==============================================================================
// helper function
function $(query,q1,index){  // query 
    const setProperties = (src,dest) => {
        for(var i in src){
            if(i === "style" && typeof src.style === "object"){
                setProperties(src.style,dest.style);
            }else{
                dest[i] = src[i];
            }
        }        
    }
    if(typeof q1 === "number"){        
        if(typeof query === "string"){
            return document.querySelectorAll(query)[q1];
        }
        return query;
    }
    if(q1 !== undefined){
        if(typeof query === "string"){
            var e = document.createElement(query);
            if(typeof q1 !== "string"){
                if(Array.isArray(q1)){
                    q1.forEach(item => {
                        setProperties(item,e);
                    });
                }else{
                    setProperties(q1,e);
                }
            }else{
                e.id = q1;
            }
            return e;            
        }
        if(typeof index === "number"){
            return query.querySelectorAll(q1)[index];
        }
        return [...query.querySelectorAll(q1)];
    }
    if(typeof query === "string"){
        return [...document.querySelectorAll(query)];
    }
    return query; // just in case an element is passed
}
function $$(element,e1){   // appends
    if(e1 !== undefined){
        if(typeof element === "string"){
            element = $(element,0);
        }
        if(Array.isArray(e1)){
            e1.forEach(e => {
                if(Array.isArray(e)){
                    element.appendChild($(e[0],e[1]));
                }else{
                    element.appendChild(e);
                }
            });                
            return element
        }
        element.appendChild(e1);
        return element;
    }
    document.body.appendChild(element);
    return element;
}
function $B(element,keep){  // keep is a string with LTRBWH and defines what properties to get
                            // L is left, T= top, R=right, B = bottom, W = width , H = height
                            // Pos return left,top,right,bottom
                            // Size returns width and height
                            // Box return left,top, width,height
    if(keep === null || keep === undefined || keep === "" || keep.length === 6 || typeof keep !== "string"){ // any 6 character string is all
        return $(element,0).getBoundingClientRect();
    }
    keep = keep.toUpperCase();
    var b = $(element,0).getBoundingClientRect();
    var rect = {};
    if(keep === "POS"){
        rect.left = b.left;
        rect.top = b.top;
        rect.right = b.right;
        rect.bottom = b.bottom;
        return rect;
    }
    if(keep === "SIZE"){
        rect.width = b.width;
        rect.height = b.height;
        return rect;
    }
    if(keep === "BOX"){
        rect.left = b.left;
        rect.top = b.top;
        rect.width = b.width;
        rect.height = b.height;
        return rect;
    }
    if(keep.indexOf("L") > -1){rect.left = b.left;}
    if(keep.indexOf("T") > -1){rect.top = b.top;}
    if(keep.indexOf("R") > -1){rect.right = b.right;}
    if(keep.indexOf("B") > -1){rect.bottom = b.bottom;}
    if(keep.indexOf("W") > -1){rect.width = b.width;}
    if(keep.indexOf("H") > -1){rect.height = b.height;}
    return rect;
}
function $E(element,types,listener){ // adds event listeners
    if(typeof types === "string"){
        types = types.split(",");
    }
    element = $(element,0);
    types.forEach(t=>{
        element.addEventListener(t,listener)    
    });
    return element;
}


var pageHead;
var demoInstructions;
var info;
var menu;
function addExtras(title,instrut){
    $$(document.body,pageHead = $("div",{id:"title",className:"pageInfo",textContent:"EZSprites "+title}));
    $$(document.body,demoInstructions = $("div",{id:"instructions",className:"pageInfo",textContent:instrut}));
    $$(document.body,info = $("div",{id:"stats",className:"pageInfo"}));

}
const links = [
    ["../tank/tankDemo.html","Local coordinates"],
    ["../worldTank/tankDemo.html","World coordinates"],
    ["../particles/particles.html","Particles"],
    ["../linking/linking.html","Link sprites"],
    ["https://github.com/blindman67/EZSprites","Github"],
]

function sideMenu(){
    var width = new Chaser(6,0.6,0.4);
    var opening = false;
    var closing = false;
    var open = false;
    var mouseOver = false;
    function mouseInOut(event){        
        function slideIn(time,ctx,me){
            width.update();
            if(width.isStill() || !closing){
                me.close = true;
                closing = false;
                open = false;
                width.real = width.value;
            }
            menu.style.width = width.real + "px";
        }
        function slideOut(time,ctx,me){
            width.update();
            if(width.isStill()|| !opening){
                me.close = true;
                opening = false;
                open = true;
                width.real = width.value;
            }
            menu.style.width = width.real + "px";
        }
        if(event.type === "mouseover"){
            mouseOver = true;
            if((!open || closing) && opening === false){
                closing = false;
                opening = true;
                mouseCanvas.addRender(slideOut);
                width.value = 140;
            }                
        }else{
            mouseOver = false;
            if((open || opening ) && closing === false){
                opening = false;
                closing = true;
                mouseCanvas.addRender(slideIn);
                width.value = 0;
            }                
        }
    }
    menu = $("div",{id:"menu",className:"menu"})
    $$(menu,$("div",{className:"menuTitle",textContent:"EZSprites Demos"}));

    links.forEach(link=>{
        if(location.href.indexOf(link[0].replace("..","")) === -1){
            $$(menu , $("a",{href : link[0],textContent : link[1],className : "menuLink"}))
        }
    });
    $E(menu,"mouseover,mouseout",mouseInOut);

    
    
    $$(document.body,menu);
    
    
}
const addForker = (function(){
    var git,gitSleep,drawGit,gitCount,mouse,x,y,ww,hh,blink;
    const wobbleA = 0.1;
    const wobbleD = 0.6;
    var angle = new Chaser(1,0.1,0.6);
    var scale = new Chaser(1,0.1,0.6);
    var alpha = new Chaser(1,0.1,0.6,0.1,1);
    gitCount = 0;
    git = new Image();
    gitSleep = new Image();
    git.src = "../resources/Git.png";
    gitSleep.src = "../resources/GitSleep.png";
    git.onload = () => {gitCount += 1;}
    gitSleep.onload = () => {gitCount += 1;}
    
    
    function draw(time,ctx){
        var bt;
        if(gitCount === 2){
            drawGit = git;
            gitCount = 3;
            ww = git.width;
            hh = git.height;
            x = ww/2.0;
            y = hh/1.5;
        }else if(gitCount === 3){
            angle.update();
            scale.update();
            alpha.update();
            EZSprites.images.draw(drawGit, ctx.canvas.width - x + (alpha.real-0.8)*15, y+ (alpha.real-0.8)*15, scale.real, angle.real, alpha.clamped/3);
            EZSprites.images.draw(drawGit, ctx.canvas.width - x , y, scale.real, angle.real, alpha.clamped);
            if(mouse.x >ctx.canvas.width - ww && mouse.y < hh*1.5){
                if(blink === undefined){
                    blink = time;
                }
                bt = time - blink;
                if(bt > 1000 && bt < 1200 || bt > 2000 && bt < 2200){
                    drawGit = gitSleep;
                }else{
                    drawGit = git;
                    if(Math.random() < 0.01){
                        blink = undefined;
                    }
                }
                angle.value = 0;
                alpha.value = 1;
                scale.value = 1.2;
                mouseCanvas.canvas.title = "Fork me at Github";
                mouseCanvas.canvas.style.cursor = "pointer";
                if(mouse.buttonRaw & 1){
                    location = "https://github.com/blindman67/EZSprites";
                }
            }else{
                angle.value = 1;
                alpha.value = 0.8;
                scale.value = 0.8;
                mouseCanvas.canvas.title = "";
                mouseCanvas.canvas.style.cursor = "default";
                drawGit = gitSleep;
            }
        }
        
        
        
    }
    return function(){
        mouseCanvas.addRender(draw);
        mouse = mouseCanvas.mouse;
    }

})();

const mMath = (function(){
    var xx;
    const API = {
        easeInOut : function (x, pow) {
            x = x < 0 ? 0 : x > 1 ? 1 : x;
            xx = Math.pow(x,pow);
            return xx / ( xx + Math.pow(1 - x, pow));
        }
    } 
    return API;
    
})();
