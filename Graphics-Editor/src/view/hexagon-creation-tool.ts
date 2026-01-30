import { BoundBox } from '../model/bound-box';
import { CreationTool } from './creation-tool';
import { Figure } from '../model/figure';
import { Hexagon } from '../model/hexagon';

export class HexagonCreationTool extends CreationTool {

    getName(): string {
        return 'HexagonCreationTool';
    }
        
    // non-public members ------------------------------------

    protected showFeedback(
        ctx: CanvasRenderingContext2D,
        ev: MouseEvent ): void {

        ctx.beginPath();
        new Hexagon(
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
            },5,[5,15], true, 0, 30
        );
        ctx.stroke();
    }
    
    protected createFigure(): Figure {
        return new Hexagon(
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
            },5,[5,15], true, 0, 30
        );
    }    
}