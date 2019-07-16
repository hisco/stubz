import { StubzSimpleControl, StubzServer, StubzPluginContainer, StubzVariationSelector, StubzHTTPServer } from '@stubz/core';
import * as express from 'express';

export class StubzExpressControl extends StubzSimpleControl{
    public readonly port:string|number;
    public readonly controlServer: StubzHTTPServer;
    public readonly app: express.Application;
    constructor({
            port,
            stubzServer, 
            pluginsContainer,
            variationSelector 
        }: {
        port: number|string,
        stubzServer: StubzServer;
        pluginsContainer: StubzPluginContainer;
        variationSelector: StubzVariationSelector;
    }){
        super({ stubzServer, pluginsContainer, variationSelector });

        this.port = port;

        this.app = express();
        this.app.disable('etag')
        this.controlServer = new StubzHTTPServer({
            ports:[port] ,
            requestListener : this.app
        });
        this.setupRouting()
    }
    setupRouting(){
        function pretty(res : any, r:any){
            res.set('content-type', 'application/json')
            res.send(JSON.stringify( r, null,2 ))
        }
        this.app.get('/api/v1/plugins' ,(req,res)=>{
            const r =this.getPluginsStatus();
            pretty(res,r);
        })
        this.app.get('/api/v1/variations/' ,(req,res)=>{
            const r = this.variationSelector.getVarationsMap();
            pretty(res,r);
        })
        //For now to ease dev
        this.app.all('/api/v1/variations/:name/:status' ,(req,res)=>{
            const variations = this.variationSelector.getVarationsMap();
            variations[req.params.name] = req.params.status == 'true';
            this.variationSelector.setVariationsByName(variations);
            res.set(204);
            pretty(res,this.variationSelector.getVarationsMap());
        })
    }


}