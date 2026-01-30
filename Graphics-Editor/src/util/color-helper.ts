export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

export class ColorHelper {

    static colorAsString(
        color: Color ): string {

        return 'rgba('
            + color.r
            + ','
            + color.g
            + ','
            + color.b
            + ','
            + (color.a / 255)
            + ')';
    }
}
