import { Factory, Figure } from '../model/figure';

export interface JsonFigure {
    clazz: string;
    object: any;
}

export interface FigureDoc {
    figures: JsonFigure[];
}

export class ApiService {
    private static instance: ApiService;

    private constructor() {
        // singleton
    }

    static getInstance(): ApiService {
        if ( ApiService.instance ) {
            // NOOP
        }
        else {
            ApiService.instance = new ApiService();
        }

        return ApiService.instance;
    }

    registerFactory(
        clazz: string,
        factory: Factory ): void {

        FigureFactory.register(
            clazz, 
            factory
        );
    }

    static readonly _URL_: string = 'https://ungrid.unal.edu.co/ge';

    // Note: Promise starts in ES6 (see tsconfig.json) 
    get(): Promise<string> {

        return new Promise( (resolve, reject) => {
            const options: RequestInit = {
                method: 'GET',
            }

            fetch(
                ApiService._URL_, 
                options
            )
            .then( (res: Response) => {
                const r: any = res.text();

                console.log(
                    `ApiService::get(): TEXT => ${r}`
                );

                resolve(
                    r
                );
            })
            .catch( (error) =>
                reject(
                    error
                )
            );
        });
    }

    // returns # of bytes sent (~written)
    async store(
        account: string,
        fname: string,
        figures: Figure[] ): Promise<{value: string; error: string}> {

        if ( !account || !figures ) {
            return Promise.resolve({
                value: '-1',
                error: 'MISSING PARAMETERS'
            });
        }

        const options: RequestInit = {
            method: 'POST',
            body: JSON.stringify({
                cmd: 'store',
                acc: account,
                fnm: fname,
                fig: FigureFactory.arrayToJSON(
                    figures
                )
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const request: RequestInfo = new Request(
            ApiService._URL_, 
            options
        );

        const response = await fetch(
            request
        );

        return response.json();
    }

    async list(
        account: string ): Promise<{value: string; error: string}> {

        if ( !account ) {
            return Promise.resolve({
                value: '',
                error: 'NO ACCOUNT PROVIDED'
            });
        }
 
        const options: RequestInit = {
            method: 'POST',
            body: JSON.stringify({
                cmd: 'list',
                acc: account,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const request: RequestInfo = new Request(
            ApiService._URL_, 
            options
        );

        const response = await fetch(
            request
        );

        return response.json();
    }

    async load(
        account: string,
        fname: string ): Promise<Figure[]> {

        if ( !account || !fname ) {
            return Promise.resolve(
                []
            );
        }
 
        const options: RequestInit = {
            method: 'POST',
            body: JSON.stringify({
                cmd: 'load',
                acc: account,
                fnm: fname,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const request: RequestInfo = new Request(
            ApiService._URL_, 
            options
        );

        const response = await fetch(
            request
        );

        return response.json()
            .then( (json: any) => {

                if ( json.error ) {
                    console.error(
                        `ApiService::load(): ERROR => ${json.error}`
                    );

                    return [];
                }
                else {
                    console.info(
                        `ApiService::load(): READ => ${json.value}`
                    );
                }

                const figures: Figure[] = [
                ];

                const fdoc: FigureDoc = JSON.parse(
                    json.value
                );

                fdoc.figures
                    .forEach( (json: JsonFigure) => {
                        const f: Figure | undefined = FigureFactory.fromJSON(
                            json
                        );
                        if ( f ) {
                            figures.push(
                                f  
                            );
                        }
                    });

                return figures;
            });
    }

    // NEW
    toJSON(
        f: Figure ): string {

        return FigureFactory.toJSON(
            f
        );
    }

    // NEW
    fromJSON(
        json: JsonFigure ): Figure | undefined {

        return FigureFactory.fromJSON(
            json
        );
    }
}

class FigureFactory {

    static readonly classMap: Map<string, Factory> = new Map();

    static register(
        clazz: string,
        ctor: Factory ): void {

        FigureFactory.classMap
            .set(
                clazz,
                ctor
            );
    }

    static getFactory(
        clazz: string ): Factory | undefined {

        return FigureFactory.classMap
            .get(
                clazz
            );
    }

    static toJSON(
        f: Figure ): string {
            
        let r: string = `{ "clazz": "${f.name}"`;
        
        // NEW
        r += `, "object": ${f.toJSON()}`;
        r += ' }';

        return r;
    }

    static arrayToJSON(
        fa: Figure[] ): string {

        let r: string = '{ "figures": [';

        fa.forEach( (f: Figure, idx: number) => {
            r += FigureFactory.toJSON(
                f
            );
            if ( idx < fa.length - 1 ) {
                r += ',';
            }
        });

        r += '] }';

        return r;
    }

    static fromJSON(
        json: JsonFigure ): Figure | undefined {

        const factory: Factory | undefined = FigureFactory.getFactory(
            json.clazz
        );

        if ( factory ) {
            const f: Figure = factory.create(
                json.object
            );

            return f;
        }
        else {
            alert(
                `ERROR => ${json.clazz} CLASS FACTORY NOT REGISTERED!`
            );
        } 
    }
}

