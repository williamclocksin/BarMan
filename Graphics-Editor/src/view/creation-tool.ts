import { Figure } from '../model/figure';
import { Tool } from './tool';

import app from '../index';

export abstract class CreationTool
    extends Tool {

    protected abstract createFigure(): Figure;
    
    // Template Method
    protected processMouseUp(): void {

        // 0. no empty figures
        if ( this.equal( this.evDown, this.evUp ) ) {
            return;
        }

        // 1. create figure
        const f: Figure = this.createFigure();

        // 2. check figure
        if ( f ) {
            // 3. add figure to the drawing
            app.addFigure(
                f
            );
        }
        else {
            console.error(
                'FIGURE CREATION FAILED'
            );
        }
    }
}