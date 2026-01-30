import { BoundBox } from './bound-box';

import { Color,ColorHelper } from '../util/color-helper';

import { ClosedFigure } from './closed-figure';

export class Rectangle extends ClosedFigure {

    constructor(
        bbox: BoundBox,
        color: Color,
        lineThickness: number,
        lineStyle: Array<number>,
        fillColor?: boolean ) {

        super(
            bbox,
            color,
            lineThickness,
            lineStyle, 
            fillColor
        );
    }
        
    doPaint(
        ctx: CanvasRenderingContext2D ): void {

        ctx.beginPath();
        ctx.lineWidth=this.lineThickness;
        // ctx.setLineDash(this.lineStyle);
        if(this.fillColor){
            ctx.fillStyle = ColorHelper.colorAsString(
                this.color
            );
            ctx.fillRect(
                this.bbox.x, 
                this.bbox.y,
                this.bbox.w, 
                this.bbox.h
            );
        }
        else {
            ctx.strokeStyle = ColorHelper.colorAsString(
                this.color
            );
            ctx.strokeRect(
                this.bbox.x, 
                this.bbox.y,
                this.bbox.w, 
                this.bbox.h
            );
        }
        ctx.stroke();
    }
}