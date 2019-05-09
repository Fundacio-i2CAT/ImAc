/**
 * @author isaac.fraile@i2cat.net
 */

/************************************************************************************
    SysClock, objecte rellotge.

    Utilitzat cada vegada que es vol definir un nou rellotge.
    Idealment s'inicialitza utilitzant un temps NTP.
************************************************************************************/


class SysClock {

    constructor( tickRate ) 
    {
        this.tickRate = tickRate || 1000000;
        this.ticks = performance.now();
        this.offset = 0;
        this.speed = 1.0;
        this.last = 0;
        this.name = 'SysClock';
    }

    get time() 
    {
        return ( performance.now() * this.tickRate * this.speed ) + this.offset;
    }

    get precision() 
    {
        var sampleSize = 10000;
        var diffs = [];
        while ( diffs.length < sampleSize ) 
        {
            var a = this.time;
            var b = this.time;
            if ( a < b ) diffs.push( b - a );
        }
        return Math.min.apply( null, diffs ) / this.tickRate;
    }

    set ajustOffset( value )
    {
        this.offset += value;
    }
}