import { App } from '../controller/app';
import { UndoHelper } from '../model/undo-helper';

import { 
    DrawingEvent, 
    DrawingListener, 
} from '../model/drawing';

import { 
    LINE_CREATION,
    RECT_CREATION,
    ELLI_CREATION,
    TEXT_CREATION,
    SELECTION,
} from './main-window';

export class MenuHelper implements DrawingListener {

    constructor() {
        const menubar: HTMLElement = document.getElementById(
            'menubar'
        );

        menubar.style.position = 'sticky';
        menubar.style.top = '0';
        menubar.style.left = '0';
        menubar.style.width = '2000px';     // TODO: get this from drawing
        menubar.style.height = '28px';      // TODO: get this from app
        menubar.style.zIndex = '99';
    }

    // NEW 
    onDrawingChange(
        event: DrawingEvent ): void {

        const app: App = App.getInstance();

        if ( event === DrawingEvent.FIGURE_SELECTED ) {
            const selected: number = app.numSelected();

            this.enableItem( 
                this.group,
                selected > 1
            );

            this.enableItem( 
                this.color,
                selected > 0
            );
        }
        else if ( event === DrawingEvent.FIGURE_ADDED ) {
            this.enableItem(
                this.undo,
                true
            );
            this.enableItem(
                this.redo,
                false
            );

            // restore original label
            this.resetRedoLabel();
        }
        else if ( event === DrawingEvent.UNDO_REDO ) {
            this.setUndoLabel();
            this.setRedoLabel();
        }
        else if ( event === DrawingEvent.DRAWING_CLEARED ) {
            this.resetUndoLabel();
            this.resetRedoLabel();
        }
    }

    private group: HTMLElement = document.getElementById(
        'group'
    );
    private unGroup: HTMLElement = document.getElementById(
        'ungroup'
    );
    private undo: HTMLElement = document.getElementById(
        'undo'
    );
    private redo: HTMLElement = document.getElementById(
        'redo'
    );
    private undoHTML: string = this.undo.innerHTML;
    private redoHTML: string = this.redo.innerHTML;

    private color: HTMLElement = document.getElementById(
        'color'
    );

    init(): void {
        const app: App = App.getInstance();

        // start disabled
        this.enableItem(
            this.undo,
            false
        );
        this.enableItem(
            this.redo,
            false
        );
        this.enableItem(
            this.group,
            false
        );
        this.enableItem(
            this.unGroup,
            false
        );
        this.enableItem(
            this.color,
            false
        );

        // FILE
        const clear: HTMLElement = document.getElementById(
            'new'
        );
        if ( clear ) clear.addEventListener( 
            'mousedown', (ev: MouseEvent) => { 
                ev.stopPropagation(); 
                app.clear(); 
            }
        );

        // Open 
        const open: HTMLElement = document.getElementById(
            'open'
        );
        if ( open ) open.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.open();
            }
        );

        // open List 
        // const openList: HTMLElement = document.getElementById(
        //     'listRecentFilesCreates'
        // );
        // if ( openList ) openList.addEventListener( 
        //     'mousedown', (ev: MouseEvent) => {
        //         ev.stopPropagation(); 

        //         fnames.forEach((item)=>{
        //             let li = document.createElement("x-label");
        //             li.innerText = item;
        //             lista = li;
        //         })

        //         let i = app.list();
        //         openList.appendChild(i);
        //     }
        // );

        const save: HTMLElement = document.getElementById(
            'save'
        );
        if ( save ) save.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.save();
            }
        );

        // EDIT
        this.undo.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.undo();

                this.enableItem(
                    this.undo,
                    UndoHelper.getInstance().canUndo()
                );

                this.enableItem(
                    this.redo,
                    true
                );
            }
        );
        this.redo.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.redo();

                this.enableItem(
                    this.undo,
                    true
                );
                
                this.enableItem(
                    this.redo,
                    UndoHelper.getInstance().canRedo()
                );
            }
        );
        this.color.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.colorTest();
            }
        );

        if ( this.group ) this.group.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.group();
            }
        );
        if ( this.unGroup ) this.unGroup.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.unGroup();
            }
        );

        const selectAll: HTMLElement = document.getElementById(
            'select-all'
        );
        if ( selectAll ) selectAll.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.selectAll();
            }
        );
        const deselectAll: HTMLElement = document.getElementById(
            'deselect-all'
        );
        if ( deselectAll ) deselectAll.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.deselectAll();
            }
        );

        // TOOL
        const line: HTMLElement = document.getElementById(
            'line'
        );
        if ( line ) line.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.setActiveTool( LINE_CREATION );
            }
        );

        const rect: HTMLElement = document.getElementById(
            'rect'
        );
        if ( rect ) rect.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.setActiveTool( RECT_CREATION );
            }
        );

        const elli: HTMLElement = document.getElementById(
            'elli'
        );
        if ( elli ) elli.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.setActiveTool( ELLI_CREATION );
            }
        );

        const text: HTMLElement = document.getElementById(
            'text'
        );
        if ( text ) text.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.setActiveTool( TEXT_CREATION );
            }
        );

        const sele: HTMLElement = document.getElementById(
            'sele'
        );
        if ( sele ) sele.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.setActiveTool( SELECTION );
            }
        );

        const test: HTMLElement = document.getElementById(
            'test'
        );
        if ( test ) test.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.testBackEnd();
            }
        );

        const list: HTMLElement = document.getElementById(
            'list'
        );
        if ( list ) list.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.list();
                console.log("entre al boton de list");
            }
        );

        const about: HTMLElement = document.getElementById(
            'about'
        );
        if ( about ) about.addEventListener( 
            'mousedown', (ev: MouseEvent) => {
                ev.stopPropagation(); 
                app.about();
            }
        );

        // NEW
        app.addListener(
            this
        );
    }

    getHeight(): number {
        const menubar: HTMLElement = document.getElementById(
            'menubar'
        );

        return +menubar.style.height.substring(
            0, menubar.style.height.length - 2 
        );
    }

    // private methods ------------------------------------------------------
    enableItem(
        item: HTMLElement,
        enable: boolean ): void {

        if ( enable ) {
            item.removeAttribute( 'disabled' );
        }
        else {
            item.setAttribute( 'disabled', 'true' );
        }
    }

    private resetUndoLabel(): void {
        this.undo.innerHTML = this.undoHTML;
        this.enableItem(
            this.undo,
            false
        );
    }

    private resetRedoLabel(): void {
        this.redo.innerHTML = this.redoHTML;
        this.enableItem(
            this.redo,
            false
        );
    }
    
    private setUndoLabel() {
        if ( UndoHelper.getInstance().canUndo() ) {

            const label: string = UndoHelper.getInstance()
                .getUndoLabel();

            const html: string = this.undo.innerHTML;

            const iHdr: number = html.indexOf(
                '<x-label>'
            );
            const iTlr: number = html.indexOf(
                '</x-label>'
            );
            
            this.undo.innerHTML = html.substring( 0, iHdr )
                + '<x-label> Undo '
                + label
                + html.substring( iTlr );
        }
        else {
            this.resetUndoLabel()
        }
    }

    private setRedoLabel() {
        if ( UndoHelper.getInstance().canRedo() ) {

            const label: string = UndoHelper.getInstance()
                .getRedoLabel();

            const html: string = this.redo.innerHTML;

            const iHdr: number = html.indexOf(
                '<x-label>'
            );
            const iTlr: number = html.indexOf(
                '</x-label>'
            );
            
            this.redo.innerHTML = html.substring( 0, iHdr )
                + '<x-label> Redo '
                + label
                + html.substring( iTlr );
        }
        else {
            this.resetRedoLabel()
        }
    }
}