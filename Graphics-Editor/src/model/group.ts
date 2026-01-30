import { ApiService, JsonFigure } from '../api/api-service';
import { BoundBox } from './bound-box';
import { Color } from '../util/color-helper';
import { Factory, Figure } from './figure';

export class Group 
    extends Figure {

    static readonly className: string = 'Group';

    constructor(
        bbox: BoundBox,
        color: Color ) {

        super(
            bbox,
            color
        );
    }
        
    get name(): string {
        return Group.className;
    }

    protected doPaint(
        ctx: CanvasRenderingContext2D ): void {
        // NOOP
    }

    toJSON(): string {

        const api: ApiService = ApiService.getInstance();

        let json: string = '{ "children": [ ';

        this.children
            .forEach( (f: Figure, idx: number) => {
                json += api.toJSON(
                    f
                );

                if ( idx < this.children.length - 1 ) {
                    json += ',';
                }
            });

        return json + ' ] }';
    }
}

class GroupFactory 
    implements Factory {

    create( 
        obj: any ): Group {

        const group: Group = new Group(
            new BoundBox(
                { x: 0, y: 0 },
                { w: 0, h: 0 }
            ),
            { r: 0, g: 0, b: 0, a: 0 }
        );

        const children: JsonFigure[] = obj.children;
        
        children.forEach( (jf: JsonFigure) => {
            const f: Figure = ApiService.getInstance()
                .fromJSON(
                    jf
                );
        
            if ( f ) group.addChild(
                f
            );
        });

        return group;
    }
}

ApiService.getInstance()
    .registerFactory(
        Group.className,
        new GroupFactory()
    );
