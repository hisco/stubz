import { StubzRouter, HTTPRouter, StubzHTTPServer } from '@stubz/core';
import { Router} from 'express';
import * as express from 'express';

export class StubzRouterApplication{
    static setupServer(server : StubzHTTPServer){
        server.setRequestListener((<any>server)['routerApplication'] = express());
        
    }
}
export class StubzExpressRouter extends StubzRouter{
    public stack:any[];
    router: HTTPRouter;
    constructor({ name, route }: {
        name: string;
        route?: string | RegExp;
    }){
        let router = <any>Router();
        router.clearRoutes = ()=>{
            this.clearRoutes();
        }
        super({ name, route ,router});
    }
    clearRoutes():void{
        (<any>this.router).stack.length = 0;
    }
}