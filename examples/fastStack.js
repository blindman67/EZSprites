var fastStackContaiment = (function(){
if (Array.prototype.fastStack === undefined) {
     Object.defineProperty(Array.prototype, 'fMaxLength', { // internal and should not be used
        writable : true,
        enumerable : false,
        configurable : false,
        value : undefined
     });
     Object.defineProperty(Array.prototype, 'fLength', { // internal do not use
        writable : true,
        enumerable : false,
        configurable : false,
        value : 0
     });
     Object.defineProperty(Array.prototype, 'flag', {  // internal and do not use;
        writable : true,
        enumerable : false,
        configurable : false,
        value : undefined
     });
    Object.defineProperty(Array.prototype, 'fNextFree', {
        writable : false,
        enumerable : false,
        configurable : false,
        value : function (item) {
            if(this.fLength < this.fMaxLength){
                this.fLength += 1;
                return this[this.fLength-1];
            }
            return undefined;
        }
    });

    var i, tail,count,o,len,item;
    Object.defineProperty(Array.prototype, 'fEach', {
        writable : false,
        enumerable : false,
        configurable : false,
        value : function (func) {
            len = this.fLength;
            i = 0;
            tail = 0;
            count = 0;
            while( i < len ) {
                if( (item = this[i])[this.flag] !== undefined) {
                    count += 1;
                    func(item, i);
                    if(item[this.flag] === undefined) {
                        tail += 1;
                    }else{ // swap unused
                        if(tail > 0){
                            o = this[i - tail];
                            this[i - tail] = this[i];
                            this[i] = o;
                        }
                    }
                }
                i++;
            }
            this.fLength = count-tail;
        }
    });
    Object.defineProperty(Array.prototype, 'fEachQ', {
        writable : false,
        enumerable : false,
        configurable : false,
        value : function (func) {
            var i,len;
            len = this.fLength;
            i = 0;
            while( i < len ) {
                if( this[i][this.flag] !== undefined) {
                    func(this[i], i);
                }
                i++;
            }
        }
    });
    Object.defineProperty(Array.prototype, 'fastStack', {
        writable : false,
        enumerable : false,
        configurable : false,
        value : function (size,item,flag) {
            var i, o, j , keys;
            if(this.fMaxLength === undefined){
                this.fMaxLength = this.length;
            }
            keys = Object.keys(item);
            if(keys.indexOf(flag) === -1){
                throw new ReferenceError("FastArray item descriptor missing matching flag property '"+flag+"'");
            }
            this.flag = flag;
            if(this.fMaxLength < size){
                for(i = this.fMaxLength; i < size; i++){
                    o = {};
                    for(j of keys){
                        o[j] = item[j];
                    }
                    this.push(o);
                }
            }
            
            this.fLength = 0;
            this.fMaxLength = this.fMaxLength < size ? size : this.fMaxLength;
            return this;
        }
    });
}
})();