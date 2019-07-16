import { StubzHTTPServer, StubzPluginContainer, StubzPlugin, StubzSimpleVariationSelector, StubzVariationSelector, StubzControl } from '@stubz/core';
import { StubzRouterApplication } from './express-router';
import { StubzExpressControl } from './express-control';

export class StubzExpress{
    stubzServer: StubzHTTPServer;
    pluginsContainer:StubzPluginContainer;
    variationSelector: StubzVariationSelector;
    control: StubzExpressControl;
    constructor({
        ports,
        adminPort
    }:{
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
        if (adminPort!=undefined)
        this.control = new StubzExpressControl({
            port: adminPort,
            pluginsContainer,
            variationSelector,
            stubzServer
        })
    }
    addPlugins(plugins: StubzPlugin[]){
        this.pluginsContainer.addPlugins(plugins);
    }
    async start(){
        if (this.control){
            await this.control.controlServer.start();
        }
        return this.stubzServer.start();
    }
}