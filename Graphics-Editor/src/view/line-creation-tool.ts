import { BoundBox } from '../model/bound-box';
import { CreationTool } from './creation-tool';
import { Figure } from '../model/figure';
import { Line } from '../model/line';

export class LineCreationTool extends CreationTool {

    getName(): string {
        return 'LineCreationTool';
    }
        
    // non-public members ------------------------------------

    protected showFeedback(
        ctx: CanvasRenderingContext2D,
        ev: MouseEvent ): void {

        ctx.beginPath();
        ctx.moveTo(
            this.evDown.offsetX, 
            this.evDown.offsetY
        );
        ctx.lineTo(
            ev.offsetX, 
            ev.offsetY
        );
        ctx.stroke();
    }
    
    protected createFigure(): Figure {
        return new Line(
            new BoundBox(
                { 
                    x: this.evDown.offsetX, 
                    y: this.evDown.offsetY 
                },
                { 
                    w: this.evUp.offsetX - this.evDown.offsetX, 
                    h: this.evUp.offsetY - this.evDown.offsetY
                }
            ),
            { 
                r: 0, g: 0, b: 0, a: 255   // color ?
            },0,[5,15]
        );
    }    
}