import { ApiService } from '../api/api-service';
import { BoundBox } from './bound-box';
import { Color, ColorHelper } from '../util/color-helper';
import { Factory } from './figure';
import { Figure } from './figure';

export class Text extends Figure {

    static readonly className: string = 'Text';

    constructor(
        bbox: BoundBox,
        color: Color,
        protected userText: string,
        protected userSizeText: string,
        protected userTextSerif: string) {

        super(
            bbox,
            color
        );
    }

    get name(): string {
        return Text.className;
    }
        
    doPaint( ctx: CanvasRenderingContext2D ): void {

        ctx.strokeStyle = ColorHelper.colorAsString(
            this.color
        );

        // ctx.font = `${this.userSizeText} ${this.userTextSerif ? this.userTextSerif : "serif"}`;
        // ctx.font = this.userSizeText + ' serif';
        ctx.font = '48px serif';
        /*ctx.textBaseline = "hanging";*/
        ctx.strokeText(this.userText, 10, 50);
        // ctx.fillText(this.userText, 10, 50);
        // ctx.strokeText('Hello world', 10, 50);

    }
}

class TextFactory implements Factory {

    create(json: any): Text {
        return new Text(
            new BoundBox(
                {
                    x: json.bbox.position.x,
                    y: json.bbox.position.y
                },
                {
                    w: json.bbox.size.w,
                    h: json.bbox.size.h
                }),
            json.color,
            json.userText,
            json.lineStyle,
            json.lineStyle,
        );
    }
}

ApiService.getInstance()
    .registerFactory(
        Text.className,
        new TextFactory()
    );
