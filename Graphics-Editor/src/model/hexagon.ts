import { BoundBox } from './bound-box';
import { Color, ColorHelper } from '../util/color-helper';
import { ClosedFigure } from './closed-figure';

export class Hexagon extends ClosedFigure {

    constructor(
        bbox: BoundBox,
        color: Color,
        lineThickness: number,
        lineStyle: Array<number>,
        fillColor: boolean,
        private positionX: number,
        private positionY: number
    ) {

        super(
            bbox,
            color,
            lineThickness,
            lineStyle,
            fillColor
        );
    }

    doPaint(ctx: CanvasRenderingContext2D): void {

        ctx.lineWidth=this.lineThickness;
        // ctx.setLineDash(this.lineStyle);

        ctx.strokeStyle = ColorHelper.colorAsString(
            this.color
        );

        let angleInGrades = 2 * Math.PI / 6;
        
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(
                this.positionX + this.positionY * Math.cos(angleInGrades * i), 
                this.positionY + this.positionY * Math.sin(angleInGrades * i)
            );
        }
        ctx.closePath();

        if(this.fillColor){
            ctx.fillStyle = ColorHelper.colorAsString(
                this.color
            );
            ctx.fill();
        }
        
        ctx.stroke();
    }
}