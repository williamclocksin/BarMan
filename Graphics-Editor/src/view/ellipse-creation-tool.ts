import { BoundBox } from '../model/bound-box';
import { CreationTool } from './creation-tool';
import { Figure } from '../model/figure';
import { Ellipse } from '../model/ellipse';

export class EllipseCreationTool extends CreationTool {

    getName(): string {
        return 'EllipseCreationTool';
    }
        
    // non-public members ------------------------------------

    protected showFeedback(
        ctx: CanvasRenderingContext2D,
        ev: MouseEvent ): void {

        ctx.beginPath();
        ctx.ellipse(this.evDown.offsetX+((ev.offsetX-this.evDown.offsetX)/2), this.evDown.offsetY+((ev.offsetY-this.evDown.offsetY)/2), (ev.offsetX-this.evDown.offsetX)/2, (ev.offsetY-this.evDown.offsetY)/2,0,0,Math.PI*2);
        ctx.closePath();
        ctx.stroke();      
        }
        /*  ctx.ellipse(
            this.evDown.offsetX, 
            this.evDown.offsetY,
            ev.offsetX - this.evDown.offsetX,
            ev.offsetY - this.evDown.offsetY,
            0,0,
            2*Math.PI
        );

        // ctx.ellipse(
        //     this.evDown.offsetX+((ev.offsetX-this.evDown.offsetX)/2),
        //     this.evDown.offsetY+((ev.offsetY-this.evDown.offsetY)/2),
        //     (ev.offsetX - this.evDown.offsetX)/2,
        //     (ev.offsetY - this.evDown.offsetY)/2,
        //     0,0,
        //     Math.PI*2
        // );

        ctx.stroke();
    }*/
   /* protected createFigure(): Figure {
        return new Elipse(
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
            }
        );
    }  
   */ 

    protected createFigure(): Figure {
        return new Ellipse(
            new BoundBox(
                { 
                    x: this.evDown.offsetX /*- (this.evUp.offsetX - this.evDown.offsetX)*/, 
                    y: this.evDown.offsetY/* - (this.evUp.offsetY - this.evDown.offsetY)*/
                },
                { 
                    w: this.evUp.offsetX - this.evDown.offsetX, 
                    h: this.evUp.offsetY - this.evDown.offsetY
                }
            ),
            { 
                r: 0, g: 0, b: 0, a: 255   // color ?
            },5,[5,15], true,
            this.evDown.offsetX,
            this.evDown.offsetY,
            this.evUp.offsetX - this.evDown.offsetX,
            this.evUp.offsetY - this.evDown.offsetY,
            0,0,
            2*Math.PI

            // new BoundBox(
            //     { 
            //         x: this.evDown.offsetX, 
            //         y: this.evDown.offsetY
            //     },
            //     { 
            //         w: this.evUp.offsetX - this.evDown.offsetX, 
            //         h: this.evUp.offsetY - this.evDown.offsetY
            //     }
            // ),
            // { 
            //     r: 0, g: 0, b: 0, a: 255   // color ?
            // },5,[5,15], true,
            // this.evDown.offsetX,
            // this.evDown.offsetY,
            // this.evUp.offsetX - this.evDown.offsetX,
            // this.evUp.offsetY - this.evDown.offsetY,
            // 0,0,
            // 2*Math.PI
        );
    }    
}