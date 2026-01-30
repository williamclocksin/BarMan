import { ApiService,} from '../api/api-service';
import { BoundBox, } from './bound-box';
import { Color, ColorHelper, } from '../util/color-helper';
import { Factory, } from './figure';
import { GeomFigure } from './geometric-figure';

export class Line extends GeomFigure {

    static readonly className: string = 'Line';

    constructor(
        bbox: BoundBox,
        color: Color,
        lineThickness: number,
        lineStyle: Array<number> ) {

        super(
            bbox,
            color,
            lineThickness,
            lineStyle
        );
    }
        
    get name(): string {
        return Line.className;
    }

    doPaint(
        ctx: CanvasRenderingContext2D ): void {

        ctx.strokeStyle = ColorHelper.colorAsString(
            this.color
        );

        ctx.beginPath();
        ctx.moveTo(
            this.bbox.x, 
            this.bbox.y
        );
        ctx.lineTo(
            this.bbox.x + this.bbox.w, 
            this.bbox.y + this.bbox.h
        );
        ctx.stroke();
    }
}

class LineFactory  implements Factory {

    create( 
        obj: any ): Line {

        return new Line(
            new BoundBox(
            { 
                x: obj.bbox.position.x, 
                y: obj.bbox.position.y
            },
            { 
                w: obj.bbox.size.w, 
                h: obj.bbox.size.h 
            }),
            obj.color,
            obj.lineThickness,
            obj.lineStyle,
        );
    }
}

ApiService.getInstance()
    .registerFactory(
        Line.className,
        new LineFactory()
    );
