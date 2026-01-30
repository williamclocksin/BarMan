import { BoundBox } from './bound-box';
import { Color } from '../util/color-helper';
import { Cardinal, ControlPoint } from './control-point';
import { GraphicsObject } from './graphics-object';

export interface Factory {
    create( obj: any ): Figure;
}

export abstract class Figure 
    implements GraphicsObject {

    abstract get name(): string;

    protected abstract doPaint( 
        ctx: CanvasRenderingContext2D ): void;

    // public interface -------------------------------
    
    constructor(
        protected bbox: BoundBox,
        protected color: Color ) {

        if ( Figure.ctrlPoints.length === 0 ) {
            this.addControlPoints();
        }
    }

    // NEW --------------------------------------------
    setColor(
        color: Color ): void {

        this.color = color;

        this.children
            .forEach( 
                (f: Figure) => f.setColor( color ) 
            );
    }
    getColor(): Color {
        return this.color;
    }
    // NEW --------------------------------------------

    get selected(): boolean {
        return this._selected;
    }

    set selected( b: boolean ) {
        this._selected = b;
    }

    // Template Method
    paint( 
        ctx: CanvasRenderingContext2D ): void {

        // 1. paint figure
        this.doPaint(
            ctx
        );

        // 2. paint children
        this.children
            .forEach( 
                (f: Figure) => f.paint( ctx ) 
            );

        // 3. paint bounding box
        if ( this.selected ) {
            this.bbox
                .paint(
                    ctx
                );

            // 4. draw control points
            Figure.ctrlPoints
                .forEach( 
                    (cp: ControlPoint) => cp.paint( ctx, this ) 
                );
        }
    }

    select( 
        evDown: MouseEvent,
        evUp?: MouseEvent ): void {
        
        this.selected = this.bbox
            .select( 
                evDown, 
                evUp 
            );
    }

    contains(
        ev: MouseEvent ): boolean {
        
        return this.bbox
            .contains(
                ev
            );
    }

    getControlPoint(
        ev: MouseEvent ): ControlPoint | undefined {
    
        for ( let i: number = 0; i < Figure.ctrlPoints.length; i++ ) {
            const cp: ControlPoint = Figure.ctrlPoints[
                i
            ];
            if ( cp.contains( ev, this ) ) {
                return cp;
            }
        }
    }

    move(
        dx: number, 
        dy: number) {

        this.bbox
            .move(
                dx, 
                dy
            );

        // NEW
        this.children
            .forEach( 
                (f: Figure) => f.move( dx, dy )     // !!!
            );
    }

    resize(
        dx: number, 
        dy: number ): void {

        this.bbox
            .resize( 
                dx,
                dy
            );

        this.children
            .forEach( 
                (f: Figure) => f.resize( dx, dy ) 
            );
    }

    // NEW
    hasChildren(): boolean {
        return (this.children.length > 0);
    }

    get x(): number {
        return this.bbox.x;
    }
    get y(): number {
        return this.bbox.y;
    }
    get w(): number {
        return this.bbox.w;
    }
    get h(): number {
        return this.bbox.h;
    }

    toJSON(): string {
        return JSON.stringify({
            bbox: this.bbox,
            color: this.color,
        });
    }
    
    addChild( 
        f: Figure ): void {

        f.selected = false;

        if ( f ) this.children
            .push( 
                f
            );

        this.recomputeBoundBox();
    }

    /*remChild( 
        f: Figure ): void {

        f.selected = false;

        // const idx: number = this.children
        //     .indexOf( f );

        // if ( idx >= 0 ) {
        //     this.children = this.children
        //         .splice( idx, 1 );
        // }

        if ( f ) this.children = this.children.splice( f , 1 );

        this.recomputeBoundBox();
    }*/

    flushChildren(): Figure[] {

        const fa = this.children;

        // reset children
        this.children = [];

        // reset group bbox
        this.bbox
            .moveTo( 
                0, 0 
            );
        this.bbox
            .scale( 
                0, 0 
            );
    
        return fa;
    }

    // non-public members -----------------------------

    protected children: Figure[] = [];

    private recomputeBoundBox(): void {
        this.bbox
            .reset();
            
        // start with first child position & size 
        let left:   number = this.children[ 0 ].x;
        let top:    number = this.children[ 0 ].y;
        let right:  number = this.children[ 0 ].x + this.children[ 0 ].w;
        let bottom: number = this.children[ 0 ].y + this.children[ 0 ].h;

        this.children
            .forEach( (f: Figure) => {
                if ( f.x < left ) left = f.x;
                if ( f.y < top  ) top  = f.y;

                const fRight: number = f.x + f.w;
                if ( fRight > right ) right = fRight;

                const fBottom: number = f.y + f.h;
                if ( fBottom > bottom ) bottom = fBottom;
            });

        this.bbox
            .moveTo(
                left, top
            );

        this.bbox
            .resize(
                right - left, 
                bottom - top
            );
    }

    protected _selected: boolean = false;
    
    static readonly ctrlPoints: ControlPoint[] = [];

    private addControlPoints(): void {

        // target = ES2017+
        //
        // Object.values(
        //     Cardinal
        // )
        // .map( (cardinal: Cardinal) =>
        //     this.ctrlPoints
        //         .push(
        //             new ControlPoint(
        //                 this,
        //                 cardinal
        //             )
        //         )
        // );

        // target = ES5
        //
        Object.keys(
            Cardinal
        )
        .map( (key: string) => {
            const cardinal: number = Number( 
                key 
            );

            if ( !isNaN( cardinal ) ) {
                Figure.ctrlPoints
                    .push(
                        new ControlPoint(
                            cardinal
                        )
                    );
                }
        });
    }
}
