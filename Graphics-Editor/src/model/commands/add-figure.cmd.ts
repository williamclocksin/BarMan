import { Drawing } from "../drawing";
import { Figure } from "../figure";
import { Command } from "./command";

export class AddFigureCommand implements Command{
    
    constructor(
        private dwg: Drawing,
        private fig: Figure 
    ){}

    undo(): void {
        this.dwg.remFigure(
            this.fig
        )
    }

    redo(): void {
        this.dwg.addFigure(
            this.fig
        )
    }
}