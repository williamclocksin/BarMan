export interface GraphicsObject {
    paint( 
        ctx: CanvasRenderingContext2D,
        extrinsic?: any ): void;
}

