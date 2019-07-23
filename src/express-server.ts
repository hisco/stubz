import { StubzHTTPServer, StubzPluginContainer, StubzPlugin, StubzSimpleVariationSelector, StubzVariationSelector, StubzControl } from '@stubz/core';
import { StubzRouterApplication } from './express-router';
import { StubzExpressControl } from './express-control';
import { StubzFSControl } from './fs-control';

export class StubzExpress{
    stubzServer: StubzHTTPServer;
    pluginsContainer:StubzPluginContainer;
    variationSelector: StubzVariationSelector;
    expressControl: StubzExpressControl;
    fsControl: StubzFSControl;
    constructor({
        fsControl,
        ports,
        adminPort
    }:{
        fsControl?:{
            path:string
        },
        ports: (number|string)[],
        adminPort?: (number|string)
    }){
        const stubzServer = this.stubzServer = new StubzHTTPServer({ports});
        StubzRouterApplication.setupServer(stubzServer);
        const pluginsContainer = new StubzPluginContainer({
            stubzServer
        });
        const variationSelector = new StubzSimpleVariationSelector({
            pluginsContainer,
        });
        this.pluginsContainer = pluginsContainer;
        this.variationSelector = variationSelector;
        if (adminPort!=undefined){
            this.expressControl = new StubzExpressControl({
                expressControl: {
                    port: adminPort
                },
                pluginsContainer,
                variationSelector,
                stubzServer
            })
        }
        if (fsControl){
            this.fsControl = new StubzFSControl({
                fsControl,
                pluginsContainer,
                variationSelector,
                stubzServer
            });
        }
    }
    addPlugins(plugins: StubzPlugin[]){
        this.pluginsContainer.addPlugins(plugins);
    }
    async start(){
        if (this.fsControl){
            await this.fsControl.start();
        }
        if (this.expressControl){
            await this.expressControl.controlServer.start();
        }
        return this.stubzServer.start();
    }
}