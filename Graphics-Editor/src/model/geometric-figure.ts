import { BoundBox } from './bound-box';
import { Color } from '../util/color-helper';
import { Figure } from './figure';

export class GeomFigure extends Figure {
    get name(): string {
        throw new Error('Method not implemented.');
    }

    constructor(
        bbox: BoundBox,
        color: Color,
        protected lineThickness: number,
        protected lineStyle: Array<number>) {

        super(
            bbox,
            color
        );
    }
    
    // 1. paint lineWidth and lineDashOffset
    doPaint(
        ctx: CanvasRenderingContext2D ): void {
        ctx.lineWidth = this.lineThickness;
        ctx.setLineDash(this.lineStyle);
    }
    
    
}