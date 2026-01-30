import { ApiService } from '../api/api-service';
import { ControlPoint } from '../model/control-point';
import { Drawing, DrawingListener } from '../model/drawing';
import { Figure } from '../model/figure';
import { MainWindow, SELECTION } from '../view/main-window';
import { Position, Dimension } from '../model/bound-box';

// Singleton => Immutable
export class App {
    private static instance: App;

    private drawing: Drawing;
    private mainWindow: MainWindow;
    private title: string;
    private documentName: string;

    private constructor() {
        this.drawing = new Drawing();
        this.mainWindow = new MainWindow();

        this.title = document.title = 'Graphics Editor Final version';
    }

    // lazy initialization (preferred)
    static getInstance(): App {
        if (App.instance) {
            // NOOP
        }
        else {
            App.instance = new App();
        }

        return App.instance;
    }

    run(): void {
        this.mainWindow
            .init();
    }

    // from view to model
    paint(
        ctx: CanvasRenderingContext2D): void {

        this.drawing
            .paint(
                ctx
            );
    }

    select(
        evDown: MouseEvent,
        evUp?: MouseEvent): void {

        this.drawing
            .select(
                evDown,
                evUp
            );
    }

    addFigure(
        f: Figure): void {

        this.drawing
            .addFigure(
                f
            );
    }

    remFigure(
        f: Figure): void {

        this.drawing
            .remFigure(
                f
            );
    }

    // NEW --------------------------------------------
    endFigureMove(
        f: Figure,
        oldPosition: Position): void {

        this.drawing
            .endFigureMove(
                f,
                oldPosition
            );
    }

    endFigureResize(
        f: Figure,
        cp: ControlPoint,
        oldSize: Dimension): void {

        this.drawing
            .endFigureResize(
                f,
                cp,
                oldSize
            );
    }

    undo(): void {
        this.drawing
            .undo();
    }

    redo(): void {
        this.drawing
            .redo();
    }

    colorTest(): void {
        this.drawing
            .colorTest();
    }
    // NEW --------------------------------------------

    moveFigure(
        f: Figure,
        dx: number,
        dy: number): void {

        this.drawing
            .moveFigure(
                f, dx, dy
            );
    }

    resizeFigure(
        f: Figure,
        cp: ControlPoint,
        dx: number,
        dy: number): void {

        this.drawing
            .resizeFigure(
                f, cp, dx, dy
            );
    }

    addListener(
        dl: DrawingListener): void {

        this.drawing
            .addListener(
                dl
            );
    }

    remListener(
        dl: DrawingListener): void {

        this.drawing
            .remListener(
                dl
            );
    }

    selectAll(): void {
        this.drawing
            .selectAll();

        this.setActiveTool(
            SELECTION
        );
    }

    deselectAll(): void {
        this.drawing
            .deselectAll();
    }

    numSelected(): number {
        return this.drawing
            .numSelected();
    }

    group(): void {
        this.drawing
            .group();
    }

    unGroup(): void {
        this.drawing
            .unGroup();
    }

    setActiveTool(
        t: number) {

        this.mainWindow
            .setActiveTool(
                t
            );
    }

    setToolTitle(
        title: string) {

        document.title = this.title
            + ' - '
            + title;
    }

    getGraphicsContext(): CanvasRenderingContext2D {
        return this.mainWindow
            .getContext();
    }

    getFeedbackContext(): CanvasRenderingContext2D {
        return this.mainWindow
            .getFeedback();
    }

    clearFeedbackContext(): void {
        this.mainWindow
            .clearFeedback();
    }

    setCursor(
        cursor: string): void {

        this.mainWindow
            .setCursor(
                cursor
            );
    }

    getControlPoint(
        ev: MouseEvent): ControlPoint {

        return this.drawing
            .getControlPoint(
                ev
            );
    }

    getSelectedFigure(
        ev: MouseEvent): Figure {

        return this.drawing
            .getSelectedFigure(
                ev
            );
    }

    clear(): void {
        this.drawing
            .clear();
    }

    // NEW
    getMenuHeight(): number {
        return this.mainWindow
            .getMenuHeight();
    }

    static readonly _MY_ID_: string = '0000000000'; // cada uno debe colocar su cedula

    testBackEnd(): void {
        this.testServlet();
    }

    save(): void {
        if (confirm('¿Estás seguro de que quieres guardar esto en la base de datos?')) {
            // Save it!
            this.drawing
            .save(
                App._MY_ID_,
                this.documentName = prompt("Ingrese el nombre del archivo") // TODO: let the user specify this name  
            )
            .then((r: boolean) => {
                if (r) {
                    alert("El dibujo ha sido guardado con exito")
                }
                else {
                    console.error(
                        'App::save() => FAILED'
                    );
                }
            });
        }
    }

    list(): object {
        return this.drawing
            .list(
                App._MY_ID_
            )
            .then((fnames: string[]) => {
                // const openList: HTMLElement = document.getElementById(
                //     'listRecentFilesCreates'
                // );
                // if (openList) openList.addEventListener(
                //     'mousedown', (ev: MouseEvent) => {
                    if (fnames) {
                        console.log(fnames);
                        console.log(typeof (fnames));

                //         for (let item of fnames) {
                //             let prop = document.createElement('x-menuitem');
                //             prop.innerHTML =
                //                 `
                //                 <x-label>
                //                 ${item}
                //                 </x-label>
                //             `
                //             openList.appendChild(prop.cloneNode(true))
                //         }
                //             // TODO: do something with the file names ...
                        }
                    else {
                            console.error(
                                'App::list() => FAILED'
                            );
                        }
                // }
                // )
                console.log("entre a este then");
            /*    const openList: HTMLElement = document.getElementById(
                    'listRecentFilesCreates'
                );
                if (openList) openList.addEventListener(
                    'mousedown', (ev: MouseEvent) => {
                        ev.stopPropagation();
                        if (fnames) {
                            console.log(fnames);
                            console.log(typeof (fnames));

                            
                            for (let item of fnames) {
                                let prop = document.createElement('x-menuitem');
                                prop.innerHTML =
                                    `
                                    <x-label>
                                    ${item}
                                    </x-label>
                                `
                                openList.appendChild(prop.cloneNode(true))
                            }
                                // TODO: do something with the file names ...
                            }
                        else {
                                console.error(
                                    'App::list() => FAILED'
                                );
                            }

                        }
                )

                return "No documents actives";*/
            });
    }

    open(): void {
        this.drawing
            .open(
                App._MY_ID_,
                this.documentName = prompt("Ingrese el nombre del archivo a abrir")          // TODO: let the user choose which one
            )
            .then((r: boolean) => {
                if (r) {
                    // alert("El dibujo no ha sido encontrado")
                }
            });
    }

    // About function
    about(): void {
        this.showMessageaAbout();
    }

    protected showMessageaAbout(): void {
        let newWindow = window.open("", "myWindow", "width=500,height=600");
        newWindow.document.write(`Programa realizado para el curso de POO del ingeniero <b> Gabriel Jose Mañana Guichon </b> dentro de la Universidad Nacional de Colombia.
        
        Este proyecto es un software de dibujo en el que se pueden realizar 3 figuras (rectangulos, elipses y lineas) y la escritura de textos. El este proyecto se desarrollaron las siguientes capacidades: <br>

        <ul>
            <li>Analizar un problema específico a ser solucionado mediante la implementación de una aplicación web y en consecuencia establecer los requisitos funcionales y de calidad (no funcionales) asociados.
            </li>  
            <br>

            <li>Diseñar la aplicación web analizada utilizando una metodología orientada a objetos. Para esto el estudiante estará en capacidad de identificar las clases de objetos necesarias, sus responsabilidades: conocimiento (atributos) y comportamiento (métodos), así como los esquemas de colaboración (protocolos de comunicación) con las otras clases de la aplicación.</li>
            <br>

            <li>Implementar la aplicación web diseñada, utilizando para esto un lenguaje de programación orientado a objetos tal como JavaScript / TypeScript. Para este objetivo, el estudiante estará en capacidad de aprovechar mecanismos tales como la herencia y el polimorfismo.</li>
            <br>

            <li>El nivel de apropiación y aplicación de los conceptos y tecnologías anteriores será medido mediante el desarrollo de múltiples talleres (60+) y la implementación de dos aplicaciones web: Juego Bricks Breaking (JavaScript) y Editor Gráfico Vectorial (TypeScript).</li>  
            <br>
        </ul>
        `);
    }

    // private members ------------------------------------------------------

    protected testServlet(): void {
        const api: ApiService = ApiService.getInstance();

        api.get(
        )
            .then((read: string) => {
                alert(
                    `App::test(): GET => ${read}`
                );
            })
            .catch((error) => {
                alert(
                    `App::test(): ERROR => ${error.message}`
                );
            });
    }
}
