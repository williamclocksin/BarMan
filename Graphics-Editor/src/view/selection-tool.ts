import { ControlPoint } from '../model/control-point';
import { Figure } from '../model/figure';
import { Dimension, Position } from '../model/bound-box';
import { Tool } from './tool';

import app from '../index';

export class SelectionTool extends Tool {
    
    getName(): string {
        return 'SelectionTool';
    }

    // private methods ------------------------------------------------------

    private fSelected: Figure;
    private fCtrlPoint: ControlPoint;

    // override
    onMouseDown(
        ev: MouseEvent ): void {

        if ( ev.y <= app.getMenuHeight() ) {
            return;
        }

        if ( this.fSelected || this.fCtrlPoint ) {
            // NOOP
        }
        else {
            app.deselectAll();
        }

        super.onMouseDown(
            ev
        );
    }

    // override
    protected getCursor( 
        ev: MouseEvent ): string {

        this.fCtrlPoint = app.getControlPoint(
            ev
        );

        this.fSelected = app.getSelectedFigure(
            ev
        );

        if ( this.fCtrlPoint ) {
            return this.fCtrlPoint
                .getCursor()
        }

        return this.fSelected
            ? 'move'
            : super.getCursor( ev );
    }

    protected showFeedback(
        ctx: CanvasRenderingContext2D,
        ev: MouseEvent ): void {

        if ( this.fCtrlPoint ) {
            this.moveControlPoint(
                ev
            );
        }
        else {
            if ( this.fSelected ) {
                this.moveSelected(
                    ev
                );
            }
            else {
                this.drawFeedback(
                    ctx,
                    ev
                );
            }
        }
    }

    protected drawFeedback(
        ctx: CanvasRenderingContext2D,
        ev: MouseEvent ): void {

        ctx.beginPath();
        ctx.rect(
            this.evDown.offsetX, 
            this.evDown.offsetY,
            ev.offsetX - this.evDown.offsetX, 
            ev.offsetY - this.evDown.offsetY
        );
        ctx.stroke();
    }

    protected processMouseUp(): void {

        if ( this.fCtrlPoint ) {
            // resizing (set undo)
            app.endFigureResize(
                this.fSelected,
                this.fCtrlPoint,
                this.orgFigureSize
            );
        }
        else {
            if ( this.fSelected ) {
                // moving (set undo)
                app.endFigureMove(
                    this.fSelected,
                    this.orgFigurePos
                );
            }
            else {
                if ( this.equal( this.evDown, this.evUp ) ) {
                    // point selection
                    app.select(
                        this.evUp
                    );
                }
                else {
                    // bound box selection
                    app.select(
                        this.evDown,
                        this.evUp
                    );
                }
            }
        }

        this.cleanUp();
    }

    private orgFigurePos: Position;
    private orgFigureSize: Dimension;

    protected moveSelected(
        ev: MouseEvent ): void {

        if ( this.orgFigurePos ) {
            // OK
        }
        else {
            this.orgFigurePos = {
                x: this.fSelected.x,
                y: this.fSelected.y
            };
        }

        app.moveFigure(
            this.fSelected,
            ev.offsetX - this.evDown.offsetX,
            ev.offsetY - this.evDown.offsetY
        );
                
        this.evDown = ev;
    } 

    protected moveControlPoint(
        ev: MouseEvent ): void {

        if ( this.orgFigureSize ) {
            // OK
        }
        else {
            this.orgFigureSize = {
                w: this.fSelected.w,
                h: this.fSelected.h
            };
        }

        app.resizeFigure(
            this.fSelected,
            this.fCtrlPoint,
            ev.offsetX - this.evDown.offsetX,
            ev.offsetY - this.evDown.offsetY
        );
                
        this.evDown = ev;
    }

    protected cleanUp() {
        this.fSelected = null;
        this.fCtrlPoint = null;
        this.orgFigurePos = null;
        this.orgFigureSize = null;
    }
}