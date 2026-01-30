import { ApiService } from '../api/api-service';
import { Color } from '../util/color-helper';
import { ControlPoint } from './control-point';
import { Figure, } from './figure';
import { Group, } from './group';
import { Line } from './line';
import { Position} from './bound-box';
import { 
    AddFigureEdit,
    DrawingEdit,
    FigureColorEdit,
    FigureMoveEdit,
    FigureResizeEdit,
    GroupEdit,
    RemFigureEdit, 
    UndoHelper,
} from './undo-helper';
import { 
    BoundBox, 
    Dimension, 
} from './bound-box';

export enum DrawingEvent {
    FIGURE_ADDED,
    FIGURE_REMOVED,
    FIGURE_SELECTED,
    FIGURE_MODIFIED,
    // etc.
    
    DRAWING_CLEARED,
    DRAWING_SAVED,
    DRAWING_LOADED,         // NEW
    // etc.
    
    GROUP,
    UNGROUP,
    UNDO_REDO,
    // etc.
}

export interface DrawingListener {
    onDrawingChange( ev: DrawingEvent ): void;
}

export class Drawing {

    private figures: Figure[] = [];
    private listeners: DrawingListener[] = [];

    // NEW
    private undoHelper: UndoHelper = UndoHelper.getInstance();

    private modified = false;
    private name: string | null = null;

    addListener( 
        dl: DrawingListener ): void {

        if ( dl ) this.listeners
            .push(
                dl
            );
    }
    remListener( 
        dl: DrawingListener ): void {

        // TODO: Taller 59
    }

    numSelected(): number {
        let count: number = 0;
        
        this.figures.forEach( 
            (f: Figure) => { if ( f.selected ) count++; }
        );
            
        return count;
    }

    // NEW --------------------------------------------
    canUndo(): boolean {
        return this.undoHelper
            .canUndo();
    }

    canRedo(): boolean {
        return this.undoHelper
            .canRedo();
    }

    undo(): void {
        this.undoHelper
            .undo();

        this.notifyListeners(
            DrawingEvent.UNDO_REDO
        );
    } 

    redo(): void {
        this.undoHelper
            .redo();

        this.notifyListeners(
            DrawingEvent.UNDO_REDO
        );
    }

    setFigureColor(
        f: Figure, 
        newColor: Color,
        isUserEvent = true ) {
        
        if ( isUserEvent ) {
            const oldColor: Color = f.getColor();

            this.addEdit(
                new FigureColorEdit(
                    this,
                    f,
                    oldColor,
                    newColor,
                )
            );
        }

        f.setColor(
            newColor
        );

        // notify change
        this.notifyListeners(
            DrawingEvent.FIGURE_MODIFIED
        );
    }

    colorTest(): void {
        const r: number = Math.floor( Math.random() * 255 );
        const g: number = Math.floor( Math.random() * 255 );
        const b: number = Math.floor( Math.random() * 255 );

        const color: Color = {
            r, g, b, a: 255
        };

        this.figures
            .forEach( (f: Figure) => { 
                if ( f.selected ) {
                    this.setFigureColor(
                        f,
                        color
                    );
                }
            });
    }

    endFigureMove(
        f: Figure,
        oldPosition: Position ): void {

        const newPosition: Position = {
            x: f.x,
            y: f.y
        };

        this.addEdit(
            new FigureMoveEdit(
                this,
                f,
                oldPosition,
                newPosition,
            )
        );
    }

    endFigureResize(
        f: Figure,
        cp: ControlPoint,
        oldSize: Dimension ): void {

        const newSize: Dimension = {
            w: f.w,
            h: f.h
        };

        this.addEdit(
            new FigureResizeEdit(
                this,
                f,
                cp,
                oldSize,
                newSize,
            )
        );
    }

    // undo/redo
    setFigurePosition(
        f: Figure, 
        position: Position ) {
        
        this.moveFigure(
            f,
            position.x - f.x,
            position.y - f.y
        );
    }

    // undo/redo
    setFigureSize(
        f: Figure,
        cp: ControlPoint, 
        size: Dimension ) {
        
        this.resizeFigure(
            f,
            cp,
            size.w - f.w,
            size.h - f.h
        );
    }
    
    flushChildren( 
        f: Figure ): Figure[] {

        const children: Figure[] = f.flushChildren();


        return children;
    }
    // NEW --------------------------------------------

    moveFigure(
        f: Figure,
        dx: number,
        dy: number ): void {

        if ( f ) {    
            f.move(
                dx, dy
            );

            this.notifyListeners(
                DrawingEvent.FIGURE_MODIFIED
            );
            
            // !
            this.undoHelper
                .flushRedo();
        }
    }

    resizeFigure(
        f: Figure,
        cp: ControlPoint,
        dx: number,
        dy: number ): void {
            
        if ( f && cp ) {
            cp.move(
                dx, dy, f
            );
            
            this.notifyListeners(
                DrawingEvent.FIGURE_MODIFIED
            );
            
            // !
            this.undoHelper
                .flushRedo();
        }
    }

    group(): void {
        let parent: Figure = new Group(
            new BoundBox(
                { x: 0, y: 0 },
                { w: 0, h: 0 }
            ),
            {
                r: 0, g: 0, b: 0, a: 0
            }
        );

        this.figures
            .forEach( (f: Figure) => {            
                if ( f.selected ) {
                    parent.addChild(
                        f
                    );

                    this.remFigure(
                        f,
                        false
                    );
                }
                else {
                    // skip it
                }
            });

        parent.selected = true;

        this.addFigure(
            parent,
            false
        );

        this.notifyListeners(
            DrawingEvent.FIGURE_SELECTED
        );

        this.addEdit(
            new GroupEdit(
                this,
                parent
            )
        );
    }

    unGroup(): void {
        alert( 'Drawing => UNGROUP' );
    /*    for ( let i = 0; i < this.figures.length; i++ ) {
            const f: Figure = this.figures[ i ];
            if ( f.selected ) {
                f.remChild(
                    f
                );
            }
        }

        this.figures
            .forEach( (f: Figure) => {            
                if ( f.selected ) {
                    parent.addChild(
                        f
                    );

                    this.remFigure(
                        f,
                        false
                    );
                }
                else {
                    // skip it
                }
            });

        parent.selected = true;

        this.addFigure(
            parent,
            false
        );

        this.notifyListeners(
            DrawingEvent.FIGURE_SELECTED
        );

        this.addEdit(
            new GroupEdit(
                this,
                parent
            )
        );*/

        // TODO: Taller 58
    }

    // polymorphism in action
    paint(
        ctx: CanvasRenderingContext2D ): void {

        this.figures.forEach( 
            (f: Figure) => f.paint( ctx ) 
        );
    }

    // TODO: delete this
    addTestFigures(): void {               
        const redLine: Line = new Line(
            new BoundBox( { x: 100, y: 100 }, { w: 400, h: 100 } ),   // NEW
            { r: 255, g: 0, b: 0, a: 255 }, 0, [5,15]
        );
        this.figures
            .push(
                redLine
            );

        const greenLine: Line = new Line(
            new BoundBox( { x: 100, y: 100 }, { w: 400, h: 200 } ),   // NEW
            { r: 0, g: 255, b: 0, a: 255 },0, [5,15]
        );
        this.figures
            .push(
                greenLine
            );

        const blackLine: Line = new Line(
            new BoundBox( { x: 100, y: 100 }, { w: 400, h: 300 } ),   // NEW
            { r: 0, g: 0, b: 0, a: 255 },0, [5,15]
        );
        this.figures
            .push(
                blackLine
            );
    }

    selectAll(): void {
        this.figures.forEach( 
            (f: Figure) => f.selected = true 
        );

        // NEW
        this.notifyListeners(
            DrawingEvent.FIGURE_SELECTED
        );
    }

    deselectAll() {
        this.figures.forEach( 
            (f: Figure) => f.selected = false 
        );

        // NEW
        this.notifyListeners(
            DrawingEvent.FIGURE_SELECTED
        );
    }

    select( 
        evDown: MouseEvent,
        evUp?: MouseEvent ): void {
        
        for ( let i = this.figures.length - 1; i >= 0; i-- ) {
            const f: Figure = this.figures[
                i
            ];

            f.select( 
                evDown, 
                evUp 
            );
            
            if ( f.selected ) {
                this.notifyListeners(
                    DrawingEvent.FIGURE_SELECTED
                );

                if ( evUp ) {
                    // area selection
                }
                else {
                    // point selection
                    break;
                }
            }
        }
    }

    addFigure(
        f: Figure,
        isUserEvent = true ): void {
    
        this.figures
            .push(
                f
            );

        this.notifyListeners(
            DrawingEvent.FIGURE_ADDED
        );

        // NEW
        if ( isUserEvent ) {
            this.addEdit(
                new AddFigureEdit(
                    this,
                    f
                )
            );
            
            // !
            this.undoHelper
                .flushRedo();
        }
    }

    remFigure(
        f: Figure,
        isUserEvent = true ): void {
    
        this.figures = this.figures
            .filter( 
                (ff: Figure) => f != ff
            );

    
        
        this.notifyListeners(
            DrawingEvent.FIGURE_REMOVED
        );

        // NEW
        if ( isUserEvent ) {
            this.addEdit(
                new RemFigureEdit(
                    this,
                    f
                )
            );
            
            // !
            this.undoHelper
                .flushRedo();
        }
    }



    getControlPoint(
        ev: MouseEvent ): ControlPoint {
        
        let cp: ControlPoint;

        for ( let i = this.figures.length - 1; i >= 0; i-- ) {
            const f: Figure = this.figures[
                i
            ];

            if ( f.selected ) {
                cp = f.getControlPoint(
                    ev
                );

                if ( cp ) {
                    break;
                }
            }
        }

        return cp;
    }
    
    getSelectedFigure(
        ev: MouseEvent ): Figure {
        
        for ( let i = this.figures.length - 1; i >= 0; i-- ) {
            const f: Figure = this.figures[
                i
            ];

            if ( f.selected && f.contains( ev ) ) {
                return f;
            }
        }
    }

    clear(): void {
        this.figures = [
        ];

        this.notifyListeners(
            DrawingEvent.DRAWING_CLEARED
        );

        this.undoHelper
            .flushUndo();
        this.undoHelper
            .flushRedo();
    }

    async save(
        account: string,
        fname: string ): Promise<boolean> {

        const api: ApiService = ApiService.getInstance();

        const result: {value: string, error: string} = await api.store(
            account,
            fname,
            this.figures
        );

        if ( result.error ) {
            console.error(
                `Drawing::save(): ERROR => ${result.error}`
            );

            return false;
        }

        if ( result.value ) {
            console.log(
                `Drawing::save(): BYTES WRITTEN => ${result.value}`
            );

            this.notifyListeners(
                DrawingEvent.DRAWING_SAVED
            );
    
            return true;
        }

        return false;
    }

    async list(
        account: string ): Promise<string[]> {

        const api: ApiService = ApiService.getInstance();

        const result: {value: string, error: string} = await api.list(
            account
        );

        if ( result.error ) {
            console.error( 
                `Drawing::list(): ERROR => ${result.error}`
            );
        }

        if ( result.value ) {
            const fnames: string[] = [
            ];
    
            const names: string[] = JSON.parse(
                result.value
            );

            names.forEach( (fname: string) => {
                fnames.push( 
                    fname
                );
            });
            
            return fnames;
        }
    }

    async open(
        account: string,
        fname: string ): Promise<boolean> {

        const api: ApiService = ApiService.getInstance();

        return await api.load(
            account,
            fname
        )
        .then( (figures: Figure[]) => {
            this.figures = figures;
            
            this.notifyListeners(
                DrawingEvent.DRAWING_LOADED
            );

            return this.figures.length > 0;
        })
        .catch( (error) => {
            alert(
                `Drawing::open(): ERROR => ${error.message}`
            );
            return false;
        });
    }

    private addEdit( 
        de: DrawingEdit ): void {

        this.undoHelper
            .addEdit(
                de
            );

        this.notifyListeners(
            DrawingEvent.UNDO_REDO
        );
    }
    
    private notifyListeners( 
        de: DrawingEvent ) {

        this.listeners
            .forEach( (dl: DrawingListener) => 
                dl.onDrawingChange( 
                    de 
                )
            );
    }
}
