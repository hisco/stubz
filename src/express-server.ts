import { StubzHTTPServer, StubzPluginContainer, StubzPlugin } from "@stubz/core";
import { StubzRouterApplication } from "./express-router";

export class StubzExpress{
    stubzServer: StubzHTTPServer;
    plugins:StubzPluginContainer;
    constructor({
        ports
    }:{
        ports: (number)[]
    }){
        const stubzServer:any = this.stubzServer = new StubzHTTPServer({ports});
        StubzRouterApplication.setupServer(stubzServer);
        this.plugins = new StubzPluginContainer({
            stubzServer
        })
        
    }
    addPlugins(plugins: StubzPlugin[]){
        this.plugins.addPlugins(plugins);
    }
    async start(){
        return this.stubzServer.start();
    }
}