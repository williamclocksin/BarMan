import { Figure } from "./figure";
import { Drawing } from "./drawing";
import { Color } from "../util/color-helper";
import { ControlPoint } from "./control-point";
import { Dimension, Position } from './bound-box';

export interface DrawingEdit {
    undo(): void;
    redo(): void;

    label(): string;
}

export class AddFigureEdit
    implements DrawingEdit {

    constructor( 
        private _dwg: Drawing,
        private _fig: Figure ) {
    }

    label(): string {
        return 'ADD FIGURE';
    }

    undo(): void {
        this._dwg
            .remFigure(
                this._fig,
                false
            );
    }

    redo(): void {
        this._dwg
            .addFigure(
                this._fig,
                false
            );
    }
}

export class RemFigureEdit
    extends AddFigureEdit {

    constructor( 
        dwg: Drawing,
        fig: Figure ) {
    
        super( 
            dwg,
            fig
        );
    }

    label(): string {
        return 'DELETE FIGURE';
    }

    undo(): void {
        super.redo();
    }

    redo(): void {
        super.undo();
    }
}

export class FigureColorEdit
    implements DrawingEdit {

    constructor( 
        private _dwg: Drawing,
        private _fig: Figure,
        private _oldColor: Color,
        private _newColor: Color ) {
    }

    label(): string {
        return 'FIGURE COLOR';
    }

    undo(): void {
        this._dwg
            .setFigureColor(
                this._fig,
                this._oldColor,
                false
            );
    }

    redo(): void {
        this._dwg
            .setFigureColor(
                this._fig,
                this._newColor,
                false
            );
    }
}

export class FigureMoveEdit
    implements DrawingEdit {

    constructor( 
        private _dwg: Drawing,
        private _fig: Figure,
        private _oldPosition: Position,
        private _newPosition: Position ) {
    }

    label(): string {
        return 'FIGURE POSITION';
    }

    undo(): void {
        this._dwg
            .setFigurePosition(
                this._fig,
                this._oldPosition
            );
    }

    redo(): void {
        this._dwg
            .setFigurePosition(
                this._fig,
                this._newPosition
            );
    }
}

export class FigureResizeEdit
    implements DrawingEdit {

    constructor( 
        private _dwg: Drawing,
        private _fig: Figure,
        private _cp: ControlPoint,
        private _oldSize: Dimension,
        private _newSize: Dimension ) {
    }

    label(): string {
        return 'FIGURE SIZE';
    }

    undo(): void {
        this._dwg
            .setFigureSize(
                this._fig,
                this._cp,
                this._oldSize
            );
    }

    redo(): void {
        this._dwg
            .setFigureSize(
                this._fig,
                this._cp,
                this._newSize
            );
    }
}

export class GroupEdit
    implements DrawingEdit {

    private _children: Figure[];

    constructor( 
        private _dwg: Drawing,
        private _fig: Figure ) {
    }

    label(): string {
        return 'GROUP';
    }

    undo(): void {

        this._children = this._fig
            .flushChildren();

        this._children
            .forEach( (f: Figure) => {
                f.selected = true;

                this._dwg
                    .addFigure(
                        f,
                        false
                    );
            });

        this._dwg
            .remFigure(
                this._fig,
                false
            );
    }

    redo(): void {
        this._children
            .forEach( (f: Figure) => {
                this._dwg
                    .remFigure(
                        f,
                        false
                    );

                this._fig
                    .addChild(
                        f
                    );
            });

        this._dwg
            .addFigure(
                this._fig,
                false
            );
    }
}

export class UndoHelper {
    private static instance: UndoHelper;

    private undoStack: DrawingEdit[] = [
    ];
    private redoStack: DrawingEdit[] = [
    ];

    private constructor() {
    }

    static getInstance(): UndoHelper {
        if ( UndoHelper.instance ) {
            // NOOP
        }
        else {
            UndoHelper.instance = new UndoHelper();
        }

        return UndoHelper.instance;
    }

    addEdit( 
        de: DrawingEdit ): void {

        if ( de ) this.undoStack
            .push(                      // or unshift
                de
            );
    }

    canUndo(): boolean {
        return (this.undoStack.length > 0);
    }

    canRedo(): boolean {
        return (this.redoStack.length > 0);
    }

    flushUndo(): void {
        this.undoStack = [];
    }

    flushRedo(): void {
        this.redoStack = [];
    }

    undo(): void {
        if ( this.canUndo() ) {
            // pop undo cmd
            const cmd: DrawingEdit = this.undoStack
                .pop();                 // or shift

            // execute cmd's undo
            cmd.undo();

            // push redo cmd
            this.redoStack
                .push(                  // or unshift       
                    cmd
                );
        }   
    } 

    redo(): void {
        if ( this.canRedo() ) {
            const cmd: DrawingEdit = this.redoStack
                .pop();                 // or shift

            cmd.redo();

            this.undoStack
                .push(                  // or unshift
                    cmd
                );
        }   
    }

    getUndoLabel(): string {
        if ( this.canUndo() ) {
            const cmd: DrawingEdit = this.undoStack[
                this.undoStack.length - 1
            ];

            return cmd.label();
        }
        
        return '';
    }

    getRedoLabel(): string {
        if ( this.canRedo() ) {
            const cmd: DrawingEdit = this.redoStack[
                this.redoStack.length - 1
            ];

            return cmd.label();
        }
        
        return '';
    }
}