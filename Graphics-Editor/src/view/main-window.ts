import { App } from '../controller/app';
import { MenuHelper } from './menu-helper';

export class MainWindow {
    [x: string]: any;
    
    // NEW -------------------------------------------
    private menu: MenuHelper;
    // NEW -------------------------------------------

    private canvas: DrawingCanvas;
    private feedback: FeedbackCanvas;

    constructor() {
        this.menu = new MenuHelper();
        this.canvas = new DrawingCanvas();
        this.feedback = new FeedbackCanvas();
    }

    init(): void {
        // NEW
        this.menu
            .init();

        this.canvas
            .init();
        this.feedback
            .init();
            
        this.canvas
            .repaint();
        
        // this.App.list();
    }

    getContext(): CanvasRenderingContext2D {
        return this.canvas
            .getContext();
    }

    getFeedback(): CanvasRenderingContext2D {
        return this.feedback
            .getContext();
    }

    clearFeedback(): void {
        this.feedback
            .clear();
    }

    setCursor(
        cursor: string ): void {
            
        this.feedback
            .setCursor(
                cursor
            );
    }
            
    setActiveTool( 
        t: number ) {

        this.feedback
            .setActiveTool(
                t
            );
    }

    // NEW
    getMenuHeight(): number {
        return this.menu
            .getHeight();
    }
}

// module private -----------------------------------------------------------

abstract class Canvas {

    abstract init(): void;

    protected htmlElement: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D | null;

    static readonly PAGE_WIDTH: number = 2000;
    static readonly PAGE_HEIGHT: number = 2000;

    constructor() {
        this.htmlElement = document.createElement(
            'canvas'
        );
        this.htmlElement.width = Canvas.PAGE_WIDTH;
        this.htmlElement.height = Canvas.PAGE_HEIGHT;

        this.htmlElement.style.position = 'absolute';
        this.htmlElement.style.width  = `${Canvas.PAGE_WIDTH}px`;
        this.htmlElement.style.height = `${Canvas.PAGE_HEIGHT}px`;

        const content: HTMLElement = document.getElementById(
            'content'
        );

        content.appendChild( 
            this.htmlElement 
        );

        this.ctx = this.htmlElement
            .getContext(
                '2d'
            );
    }

    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }
    
    get width(): number {
        return this.htmlElement.width;
    }
    
    get height(): number {
        return this.htmlElement.height;
    }
}

import { DrawingListener } from '../model/drawing';

class DrawingCanvas 
    extends Canvas
    implements DrawingListener {            // NEW

    static readonly GRID_SIZE: number = 100;
    static readonly GRID_COLOR: string = '#DDD0DD';

    constructor() {
        super();
    }

    init(): void {
        this.htmlElement.style.backgroundColor = '#FAFAFA';

        // NEW
        App.getInstance()
            .addListener(
                this
            );
    }

    // NEW
    onDrawingChange(
        ev: DrawingEvent ): void {
        
        // TODO: not all events require repainting
        this.repaint();
    }

    repaint(): void {
        this.drawGrid(
            this.ctx
        );

        App.getInstance()
            .paint(
                this.ctx
            );
    }

    // private methods ------------------------------------------------------

    private clear(
        ctx: CanvasRenderingContext2D ): void {
        
        ctx.fillStyle = this.htmlElement.style.backgroundColor;
        ctx.fillRect( 0, 0, this.width, this.height );
    }

    private drawGrid(
        ctx: CanvasRenderingContext2D | null ): void {
            
        if ( ctx ) {
            this.clear(
                ctx
            );

            ctx.lineWidth = 1;
            ctx.strokeStyle = DrawingCanvas.GRID_COLOR;

            // TODO: use document size
            const numVerticals: number = this.width / DrawingCanvas.GRID_SIZE;
            const numHorizontals: number = this.height / DrawingCanvas.GRID_SIZE;

            // verticals
            for ( let v: number = 1; v < numVerticals; v++ ) {
                ctx.beginPath();
                ctx.moveTo( 
                    v * DrawingCanvas.GRID_SIZE, 
                    0 
                );
                ctx.lineTo(
                    v * DrawingCanvas.GRID_SIZE, 
                    Canvas.PAGE_HEIGHT 
                );
                ctx.stroke();
            }

            // horizontals
            for ( let h: number = 1; h < numHorizontals; h++ ) {
                ctx.beginPath();
                ctx.moveTo( 
                    0, 
                    h * DrawingCanvas.GRID_SIZE 
                );
                ctx.lineTo(
                    Canvas.PAGE_WIDTH, 
                    h * DrawingCanvas.GRID_SIZE 
                );
                ctx.stroke();
            }
        }
    }
}

import { SelectionTool } from './selection-tool';
import { Tool } from './tool';
import { DrawingEvent } from '../model/drawing';
import { LineCreationTool } from './line-creation-tool';
import { RectangleCreationTool } from './rectangle-creation-tool';
import { EllipseCreationTool } from './ellipse-creation-tool';
import { TextCreationTool } from './text-creation-tool';

// NEW
export const LINE_CREATION: number = 0;
export const RECT_CREATION: number = 1;
export const ELLI_CREATION: number = 2;
export const TEXT_CREATION: number = 3;
export const SELECTION:     number = 4;

class FeedbackCanvas 
    extends Canvas {

    private tools: Tool[] = [
    ];
    private activeTool: Tool;

    constructor() {
        super();
    }

    init(): void {

        this.buildTools();
        
        this.setActiveTool(
            LINE_CREATION
        );

        // TODO: register for mouse events
        // down, up, move, drag, doubleclick
        // enter, exit

        window.addEventListener( 
            'mousedown', 
            this.handleMouseDown
                .bind(
                    this
                )
        );

        window.addEventListener( 
            'mouseup', 
            this.handleMouseUp
                .bind(
                    this
                )
        );

        window.addEventListener( 
            'mousemove', 
            this.handleMouseMove
                .bind(
                    this
                )
        );

        window.addEventListener( 
            'keyup', 
            this.handleKeyPressed
                .bind(
                    this
                )
        );
    }

    setActiveTool( t: number ) {

        console.log(
            `TOOL => ${t}`
        );

        if ( this.activeTool == this.tools[ SELECTION ]
            && t != SELECTION ) {

            App.getInstance()
                .deselectAll();        
        }
        
        this.activeTool = this.tools[ t ];

        App.getInstance()
            .setToolTitle(
                this.activeTool
                    .getName()
            );
    }

    clear(): void {
        const ctx: CanvasRenderingContext2D = this.getContext();

        this.ctx
            .clearRect( 
                0, 0, this.width, this.height
            );
    }

    setCursor(
        cursor: string ): void {

        this.htmlElement
            .style
            .cursor = cursor;
    }

    about():void{
        let newWindow = window.open("", "myWindow", "width=500,height=500");
        newWindow.document.write("<p>Código desarollado para la materia POO</p>");
    }

    // private methods ------------------------------------------------------

    // TODO: add remaining tools
    private buildTools(): void {

        this.tools[ LINE_CREATION ] = new LineCreationTool();
        this.tools[ RECT_CREATION ] = new RectangleCreationTool();
        this.tools[ ELLI_CREATION ] = new EllipseCreationTool();
        this.tools[ TEXT_CREATION ] = new TextCreationTool();
        this.tools[ SELECTION ] = new SelectionTool();
    }

    // State Pattern
    private handleMouseDown(
        ev: MouseEvent ): void {

        this.activeTool
            .onMouseDown(
                ev
            );
    }

    // State Pattern
    private handleMouseUp(
        ev: MouseEvent ): void {

        this.activeTool
            .onMouseUp(
                ev
            );
    }

    private handleMouseMove(
        ev: MouseEvent ): void {

        this.activeTool
            .onMouseMove(
                ev
            );
    }

    // Close Window 
    quitWindow():void{
        console.log("entre a cerrar el la pagina web")
        window.open('', '_self', '');
        window.close();
    }

    private handleKeyPressed(
        ke: KeyboardEvent ): void {

            if ( ke ) {
                ke.preventDefault();         // do not bubble
    
                console.log("El valor de ke.ctrlKey es: " + ke.ctrlKey);
    
                if ( ke.code === 'KeyL' ) {
                    this.setActiveTool(
                        LINE_CREATION    
                    );
                }
                
                else if ( ke.code === 'KeyR' ){
                    this.setActiveTool(
                        RECT_CREATION
                    );
                }
    
                else if ( ke.code === 'KeyE' ) {
                    this.setActiveTool(
                        ELLI_CREATION
                    );
                }

                else if ( ke.code === 'KeyT' ) {
                    this.setActiveTool(
                        TEXT_CREATION
                    );
                }
    
                else if ( ke.code === 'KeyS' ) {
                    this.setActiveTool(
                        SELECTION    
                    );
                }

                else if ( ke.code === 'KeyQ' ) {
                    this.quitWindow();
                }
        }
    }
}
