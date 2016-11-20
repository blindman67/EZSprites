function Chaser(value,accel,drag,clampMin,clampMax){
    this.value = value;
    this.real = value;
    this.clamped = value;
    this.chase = 0;
    this.accel = accel;
    this.drag = drag;
    this.clampedFlags = 0;
    if(clampMin !== undefined && clampMin !== null){
        this.min = clampMin;
        this.clampedFlags = 1;
    }
    if(clampMax !== undefined && clampMax !== null){
        this.max = clampMax;
        this.clampedFlags += 2;
    }
}
Chaser.prototype = {
    update : function(){
        if(this.accel === 1){
            this.chase = 0;
            this.real = this.value;            
        }else{
            this.chase += (this.value-this.real) * this.accel;
            this.chase *= this.drag;
            this.real += this.chase;
        }
        if(this.clampedFlags !== 0){
            this.clamp();
        }
    },
    isStill : function(){
        return Math.abs(this.chase) < 0.01 && Math.abs(this.real-this.value) < 0.01;
    },
    snap : function(value){
        this.chase = 0;
        this.value = value !== undefined ? value : this.value;
        this.real = this.value;
        if(this.clampedFlags !== 0){
            this.clamp();
        }
    },
    clamp : function(){
        if(this.clampedFlags===1){
            this.clamped = this.real < this.min ? this.min : this.real;
        }else if(this.clampedFlags === 2){
            this.clamped = this.real > this.max ? this.max : this.real;                
        }else if(this.clampedFlags === 3){
            this.clamped = this.real > this.max ? this.max : this.real < this.min ? this.min : this.real;  
        }        
    }

}