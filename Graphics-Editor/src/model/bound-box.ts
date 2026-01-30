import { ControlPoint } from './control-point';
import { ColorHelper } from '../util/color-helper';
import { GraphicsObject } from './graphics-object';

export interface Position {
    x: number;
    y: number;
}

export interface Dimension {
    w: number;
    h: number;
}

export class BoundBox 
    implements GraphicsObject {

    static readonly color: string = ColorHelper.colorAsString({
        r: 28,
        g: 116,
        b: 232,
        a: 255,
    });

    // public interface -------------------------------

    constructor(
        private position: Position,
        private size: Dimension ) {
    }

    paint( 
        ctx: CanvasRenderingContext2D ): void {

        // draw bound box
        ctx.strokeStyle = BoundBox.color;
        ctx.beginPath();
        ctx.rect( 
            this.position.x, this.position.y, 
            this.size.w,     this.size.h 
        );
        ctx.stroke();
    }

    get x(): number {return this.position.x; }
    get y(): number {return this.position.y; }
    get w(): number {return this.size.w; }
    get h(): number {return this.size.h; }

    get xr(): number {return (()=>{if(this.size.w>0){return this.position.x}else{return this.position.x+this.size.w}})();}
    get yr(): number {return (()=>{if(this.size.h>0){return this.position.y}else{return this.position.y+this.size.h}})();}
    get wr(): number {return (()=>{if(this.size.w>0){return this.size.w}else{return -this.size.w}})();}
    get hr(): number {return (()=>{if(this.size.h>0){return this.size.h}else{return -this.size.h}})();}


    select(
        evDown: MouseEvent,
        evUp?: MouseEvent ): boolean {
         
        if ( evUp ) {
            // bound box selection
            return this.contained(
                evDown, evUp
            );
        }

        // point selection
        return this.contains(
            evDown
        );
    }

    contains(ev: MouseEvent ): boolean {
        const left:   number = this.xr - ControlPoint.HSIZE;
        const right:  number = this.xr + this.wr + ControlPoint.HSIZE;
        const top:    number = this.yr - ControlPoint.HSIZE;
        const bottom: number = this.yr + this.hr + ControlPoint.HSIZE;
                
        return left <= ev.offsetX && ev.offsetX <= right
            && top <= ev.offsetY && ev.offsetY <= bottom;
    }
    
    move(
        dx: number, 
        dy: number ): void {
        
        this.position.x += dx;
        this.position.y += dy;
    }

    // NEW
    moveTo(
        x: number, 
        y: number ): void {

        this.position.x = x;
        this.position.y = y;
    }

    resize(
        dx: number, 
        dy: number ): void {

        this.size.w += dx;
        this.size.h += dy;
    }

    scale(
        rx: number, 
        ry: number ): void {

        this.size.w *= rx;
        this.size.h *= ry;
    }

    reset(): void {

        this.position.x = 0;
        this.position.y = 0;

        this.size.w = 0;
        this.size.h = 0;
    }

    // non-public members -----------------------------
    
    // NEW

    private contained(
        evDown: MouseEvent,
        evUp: MouseEvent ): boolean {
        
        let X=evDown.offsetX;
        let Y=evDown.offsetY;
        let W=evUp.offsetX - evDown.offsetX;
        let H=evUp.offsetY - evDown.offsetY;

        const horizontal1: boolean =  ( ()=> {if(H < 0) {
                                            return this.position.y > Y+H} 
                                            else {return this.position.y >Y}} )();
        const horizontal2: boolean =  ( ()=> {if(H < 0) {
                                            return this.position.y + this.size.h < Y}
                                            else {return this.position.y + this.size.h < Y+H}} )();
        const vertical1: boolean =  ( ()=> {if(W < 0) {
                                            return this.position.x > X+W}
                                            else {return this.position.x > X}} )();
        
        const vertical2: boolean =  ( ()=> {if(W < 0) {
                                            return this.position.x + this.size.w < X}
                                            else {return this.position.x + this.size.w < X+W}} )();
    
        return vertical1 && vertical2 && horizontal1 && horizontal2;
    }

}

/*
private contained(
        evDown: MouseEvent,
        evUp: MouseEvent ): boolean {

        const bbox: BoundBox = new BoundBox(
            { x: evDown.x, y: evDown.y },
            { w: evUp.x - evDown.x, h: evUp.y - evDown.y }
        );

        return this.intersects(
            bbox
        );
    }
private intersects(
        bbox: BoundBox ): boolean {

        const x_overlap: number = Math.max(
            0, 
            Math.min( this.x + this.w, bbox.x + bbox.w ) - Math.max( this.x, bbox.x ) 
        );
        const y_overlap: number = Math.max(
            0, 
            Math.min( this.y + this.h, bbox.y + bbox.h ) - Math.max( this.y, bbox.y )
        );

        return (x_overlap * y_overlap > 0);
    }*/