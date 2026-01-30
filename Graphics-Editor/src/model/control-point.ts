import { GraphicsObject } from './graphics-object';
import { Position, BoundBox } from './bound-box';
import { Figure } from './figure';

export enum Cardinal {
    NORTH,
    NORTH_EAST,
    EAST,
    SOUTH_EAST,
    SOUTH,
    SOUTH_WEST,
    WEST,
    NORTH_WEST
}

export class ControlPoint 
    implements GraphicsObject {
    
    static readonly HSIZE: number = 4;

    constructor(
        private cardinal: Cardinal ) {
    }

    paint( 
        ctx: CanvasRenderingContext2D,
        owner: Figure ): void {

        const pos: Position = this.getPosition(
            owner
        );

        ctx.fillStyle = BoundBox.color;

        ctx.fillRect( 
            pos.x - ControlPoint.HSIZE, pos.y - ControlPoint.HSIZE, 
            2 * ControlPoint.HSIZE, 2 * ControlPoint.HSIZE 
        );
    }

    // NEW
    contains(
        ev: MouseEvent,
        owner: Figure ): boolean {

        const pos: Position = this.getPosition(
            owner
        );

        const left:   number = pos.x - ControlPoint.HSIZE;
        const right:  number = pos.x + ControlPoint.HSIZE;
        const top:    number = pos.y - ControlPoint.HSIZE;
        const bottom: number = pos.y + ControlPoint.HSIZE;
                
        return left <= ev.offsetX && ev.offsetX <= right
            && top <= ev.offsetY && ev.offsetY <= bottom;
    }

    getCursor(): string {
    
        // TODO: complete switch

        switch ( this.cardinal ) {
            case Cardinal.SOUTH:
            case Cardinal.NORTH: 
                return 's-resize';
            case Cardinal.EAST:
            case Cardinal.WEST: 
                return 'w-resize';
            case Cardinal.NORTH_WEST:
                return 'nw-resize';
            case Cardinal.SOUTH_EAST:
                return 'sw-resize';
            case Cardinal.SOUTH_WEST:
                return 'se-resize';
            case Cardinal.NORTH_EAST:
                return 'ne-resize';
        }
    }

    move(
        dx: number, 
        dy: number,
        owner: Figure ): void {
        
        // TODO: complete switch

        switch ( this.cardinal ) {
            case Cardinal.NORTH:
                owner.move(
                    0, dy
                );
                owner.resize( 
                    0, -dy
                );
                break;
            case Cardinal.SOUTH:
                owner.resize( 
                    0, dy 
                );
                break;
            case Cardinal.SOUTH_EAST:
                owner.move(
                    dx, 0
                );
                owner.resize( 
                    -dx, dy
                );
                break;
            case Cardinal.EAST:
                owner.resize( 
                    dx, 0
                );
                break;
            case Cardinal.WEST:
                owner.move(
                    dx, 0
                );
                owner.resize( 
                    -dx, 0
                );
                break;
            case Cardinal.NORTH_WEST:
                owner.move(
                    dx, dy
                );
                owner.resize( 
                    -dx, -dy
                );
                break;
            case Cardinal.NORTH_EAST:
                owner.move(
                    0, dy
                );
                owner.resize( 
                    dx, -dy
                );
                break;
            case Cardinal.SOUTH_WEST:
                owner.resize( 
                    dx, dy
                );
                break;
        }
    }

    // private methods --------------------------------

    getPosition(
        owner: Figure ): Position {

        let x: number = 0;
        let y: number = 0;

        // TODO: complete switch

        switch ( this.cardinal ) {
            case Cardinal.NORTH:
                x = owner.x + owner.w / 2;
                y = owner.y;
                break;
            case Cardinal.NORTH_EAST:
                x = owner.x + owner.w;
                y = owner.y;
                break;
            case Cardinal.EAST:
                x = owner.x + owner.w;
                y = owner.y + owner.h/2;
                break;
            case Cardinal.SOUTH_EAST:
                x = owner.x;
                y = owner.y + owner.h;
                break;
            case Cardinal.SOUTH:
                x = owner.x + owner.w / 2;
                y = owner.y + owner.h;
                break;
            case Cardinal.SOUTH_WEST:
                x = owner.x + owner.w;
                y = owner.y + owner.h;
                break;
            case Cardinal.WEST:
                x = owner.x;
                y = owner.y + owner.h/2;
                break;
            case Cardinal.NORTH_WEST:
                x = owner.x;
                y = owner.y;
                break;
        }

        return {
            x, y
        };
    }
}
