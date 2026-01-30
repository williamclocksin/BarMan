import { BoundBox } from './bound-box';
import { Color } from '../util/color-helper';
import { GeomFigure } from './geometric-figure';

export class ClosedFigure extends GeomFigure {

    constructor(
        bbox: BoundBox,
        color: Color,
        lineThickness: number,
        lineStyle: Array<number>,
        protected fillColor?: boolean ) {

        super(
            bbox,
            color,
            lineThickness,
            lineStyle
        );
    }

    doPaint(
        ctx: CanvasRenderingContext2D ): void {
        ctx.lineWidth = this.lineThickness;
        ctx.setLineDash(this.lineStyle);
    }
}