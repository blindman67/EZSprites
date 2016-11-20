/* canvas and mouse functions for full page animations */

var mouseCanvas = (function(){
    const RESIZE_DEBOUNCE_TIME = 100;
    var w, h, cw, ch, canvas, ctx, mouse, createCanvas, resizeCanvas, setGlobals, globalTime = 0, resizeCount = 0;
    createCanvas = function () {
        var c,
        cs;
        cs = (c = document.createElement("canvas")).style;
        cs.position = "absolute";
        cs.top = cs.left = "0px";
        cs.zIndex = 1000;
        document.body.appendChild(c);
        return c;
    }
    resizeCanvas = function () {
        if (canvas === undefined) {
            canvas = createCanvas();
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext("2d");
        if (typeof setGlobals === "function") {
            setGlobals();
        }
        if (typeof onResize === "function" || notificationList.length > 0) {
            resizeCount += 1;
            setTimeout(debounceResize, RESIZE_DEBOUNCE_TIME);
        }
    }
    function debounceResize() {
        var i;
        resizeCount -= 1;
        if (resizeCount <= 0) {
            if(typeof onResize === "function"){
                onResize();
            }
            for(i = 0; i < notificationList.length; i++){
                notificationList[i](ctx);
            }
        }
    }
    setGlobals = function () {
        cw = (w = canvas.width) / 2;
        ch = (h = canvas.height) / 2;
        mouse.updateBounds();
    }
    mouse = (function () {
        function preventDefault(e) {
            e.preventDefault();
        }
        var mouse = {
            x : 0,
            y : 0,
            w : 0,
            alt : false,
            shift : false,
            ctrl : false,
            buttonRaw : 0,
            over : false,
            bm : [1, 2, 4, 6, 5, 3],
            active : false,
            bounds : null,
            crashRecover : null,
            mouseEvents : "mousemove,mousedown,mouseup,mouseout,mouseover,mousewheel,DOMMouseScroll".split(",")
        };
        var m = mouse;
        function mouseMove(e) {
            var t = e.type;
            m.x = e.pageX - m.bounds.left;
            m.y = e.pageY - m.bounds.top;
            m.alt = e.altKey;
            m.shift = e.shiftKey;
            m.ctrl = e.ctrlKey;
            if (t === "mousedown") {
                m.buttonRaw |= m.bm[e.which - 1];
            } else if (t === "mouseup") {
                m.buttonRaw &= m.bm[e.which + 2];
            } else if (t === "mouseout") {
                m.buttonRaw = 0;
                m.over = false;
            } else if (t === "mouseover") {
                m.over = true;
            } else if (t === "mousewheel") {
                m.w = e.wheelDelta;
            } else if (t === "DOMMouseScroll") {
                m.w = -e.detail;
            }
            if (m.callbacks) {
                m.callbacks.forEach(c => c(e));
            }
            e.preventDefault();
        }
        m.updateBounds = function () {
            if (m.active) {
                m.bounds = m.element.getBoundingClientRect();
            }
        }
        m.addCallback = function (callback) {
            if (typeof callback === "function") {
                if (m.callbacks === undefined) {
                    m.callbacks = [callback];
                } else {
                    m.callbacks.push(callback);
                }
            } else {
                throw new TypeError("mouse.addCallback argument must be a function");
            }
        }
        m.start = function (element, blockContextMenu) {
            if (m.element !== undefined) {
                m.removeMouse();
            }
            m.element = element === undefined ? document : element;
            m.blockContextMenu = blockContextMenu === undefined ? false : blockContextMenu;
            m.mouseEvents.forEach(n => {
                m.element.addEventListener(n, mouseMove);
            });
            if (m.blockContextMenu === true) {
                m.element.addEventListener("contextmenu", preventDefault, false);
            }
            m.active = true;
            m.updateBounds();
        }
        m.remove = function () {
            if (m.element !== undefined) {
                m.mouseEvents.forEach(n => {
                    m.element.removeEventListener(n, mouseMove);
                });
                if (m.contextMenuBlocked === true) {
                    m.element.removeEventListener("contextmenu", preventDefault);
                }
                m.element = m.callbacks = m.contextMenuBlocked = undefined;
                m.active = false;
            }
        }
        return mouse;
    })();


    var renderList = [];    
    var notificationList = [];
    var stop = false;

    function update(timer) { // Main update loop
        var i;
        if(!stop){
            requestAnimationFrame(update);
        }
        for(i = 0; i < renderList.length; i ++){
            renderList[i].func(timer,ctx,renderList[i], w, h); 
            if(renderList[i].close === true){
                console.log("Remove render");
                renderList.splice(i,1);
                i-=1;
            }
            
        }

    }
    return {
        start : function(){
            resizeCanvas();
            mouse.start(canvas, true);
            window.addEventListener("resize", resizeCanvas);
            this.mouse = mouse;
            this.canvas = canvas;
            this.ctx = ctx;
            requestAnimationFrame(update);
        },
        stop : function(){stop = true;},
        addRender : function(renderFunction){
            renderList.push({
                func : renderFunction,
            });
        },
        addNotification : function(notifyFunction){
            notificationList.push(notifyFunction);
        },
        mouse : mouse,
        canvas : canvas,
        ctx : ctx ,
    }
        
})();