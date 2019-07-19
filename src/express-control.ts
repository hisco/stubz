import { StubzSimpleControl, StubzServer, StubzPluginContainer, StubzVariationSelector, StubzHTTPServer } from '@stubz/core';
import * as express from 'express';
import * as bodyParser from 'body-parser';

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
    private setupRouting(){
        this.setupV1Routing();
    }
    private setupV1Routing(){
        function pretty(res : any, r:any){
            res.set('content-type', 'application/json')
            res.send(JSON.stringify( r, null,2 ))
        }
        this.app.use((req , res , next)=>{
            res.set({
                'Access-Control-Allow-Origin':'*',
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE"
            })
            if (req.method == 'options'){
                res.send('')
            }
            next();
        })
        this.app.use(bodyParser.json());
        this.app.get('/api/v1/plugins' ,(req,res)=>{
            const r =this.getPluginsStatus();
            pretty(res,r);
        })
        this.app.get('/api/v1/variations/' ,(req,res)=>{
            const r = this.variationSelector.getVarationsMap();
            pretty(res,r);
        })
        this.app.patch('/api/v1/variations/:name/:status' ,(req,res)=>{
            const variations = this.variationSelector.getVarationsMap();
            variations[req.params.name] = req.params.status == 'true';
            this.variationSelector.setVariationsByName(variations);
            res.set(200);
            pretty(res,this.variationSelector.getVarationsMap());
        });
        this.app.patch('/api/v1/variations' ,(req,res)=>{
            const variations = this.variationSelector.getVarationsMap();
            Object.keys(req.body).forEach((key)=>{
                variations[key] = req.body[key];
            })
            this.variationSelector.setVariationsByName(variations);
            res.set(200);
            pretty(res,this.variationSelector.getVarationsMap());
        });
        this.app.put('/api/v1/variations' ,(req,res)=>{
            const variations:any = {};
            Object.keys(req.body).forEach((key)=>{
                variations[key] = req.body[key];
            })
            this.variationSelector.setVariationsByName(variations);
            res.set(200);
            pretty(res,this.variationSelector.getVarationsMap());
        });
        //For now to ease dev
        this.app.all('/api/v1/variations/:name/:status' ,(req,res)=>{
            const variations = this.variationSelector.getVarationsMap();
            variations[req.params.name] = req.params.status == 'true';
            this.variationSelector.setVariationsByName(variations);
            res.set(200);
            pretty(res,this.variationSelector.getVarationsMap());
        })
    }


}