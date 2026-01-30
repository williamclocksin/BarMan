import { ColorHelper } from '../util/color-helper';

import app from '../index';

// NEW: resize figures

export abstract class Tool {
    abstract getName(): string;
    
    protected abstract processMouseUp(): void;
    protected abstract showFeedback( 
        ctx: CanvasRenderingContext2D,
        ev: MouseEvent ): void;

    protected evDown: MouseEvent;
    protected evUp:   MouseEvent;

    onMouseDown(
        ev: MouseEvent ): void {

        if ( ev.y <= app.getMenuHeight() ) {
            return;
        }

        this.evDown = ev;

        this.startFeedback(
            ev
        );
    }

    // Template Method
    onMouseUp(
        ev: MouseEvent ): void {

        // 0. check event is inside canvas
        if ( !this.evDown ) {
            return;
        }

        // 1. save event
        this.evUp = ev;

        // 2. do something w/ the events
        this.processMouseUp();
        
        // 3. NEW         
        this.evDown = null;
        this.endFeedback();
    }

    // Template Method
    onMouseMove(
        ev: MouseEvent ): void {

        // 1. check mouse pressed (dragging)
        if ( this.evDown ) {

            // 2. clear feedback layer
            app.clearFeedbackContext();

            // 3. show feedback
            this.showFeedback(
                app.getFeedbackContext(),
                ev
            );
        }
        else {
            // 4. set cursor
            app.setCursor(
                this.getCursor(
                    ev
                )
            );
        }
    }

    // non-public members ------------------------------------

    protected equal(
        ev1: MouseEvent,
        ev2: MouseEvent ): boolean {

        return ev1.offsetX === ev2.offsetX 
            && ev1.offsetY === ev2.offsetY;
    }

    protected startFeedback( 
        ev: MouseEvent ): void {

        const ctx: CanvasRenderingContext2D = app.getFeedbackContext();

        ctx.strokeStyle = ColorHelper.colorAsString({
            r: 28, g: 116, b: 232, a: 255
        });
    }

    protected endFeedback(): void {
        app.clearFeedbackContext();
    }

    protected getCursor( 
        ev: MouseEvent ): string {

        return 'default';
    }
}