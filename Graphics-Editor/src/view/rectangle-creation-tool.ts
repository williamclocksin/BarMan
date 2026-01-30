import { BoundBox } from '../model/bound-box';
import { CreationTool } from './creation-tool';
import { Figure } from '../model/figure';
import { Rectangle } from '../model/rectangle';

export class RectangleCreationTool extends CreationTool {

    getName(): string {
        return 'RectangleCreationTool';
    }
        
    // non-public members ------------------------------------

    protected showFeedback(
        ctx: CanvasRenderingContext2D,
        ev: MouseEvent ): void {

        ctx.beginPath();
        ctx.strokeRect(
            this.evDown.offsetX,
            this.evDown.offsetY,
            ev.offsetX - this.evDown.offsetX,
            ev.offsetY - this.evDown.offsetY,
        ); 
        ctx.stroke();
    }
    
    protected createFigure(): Figure {
        return new Rectangle(
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
            },5,[5,15]
        );
    }    
}