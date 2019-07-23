import { StubzSimpleControl, StubzServer, StubzPluginContainer, StubzVariationSelector, StubzHTTPServer } from '@stubz/core';
import { readFileSync , existsSync } from 'fs';

export class StubzFSControl extends StubzSimpleControl{
    private controlPath: string;
    constructor({
            fsControl,
            stubzServer, 
            pluginsContainer,
            variationSelector 
        }: {
        fsControl:{
            path:string
        },
        stubzServer: StubzServer;
        pluginsContainer: StubzPluginContainer;
        variationSelector: StubzVariationSelector;
    }){
        super({ stubzServer, pluginsContainer, variationSelector });
        if (!fsControl){
            fsControl = <any>{};
        }

        let controlPath = fsControl.path;
        if (!controlPath){
            controlPath = process.env.STUBZ_CONFIG_FILE || './stubz.json';
        }
        this.controlPath = controlPath;
        
    }

    async start(){
        const variations:any = {};
        if (existsSync(this.controlPath)){
            const stubzConfig = JSON.parse(`${readFileSync(this.controlPath)}`);
            if (stubzConfig.variations){
                Object.keys(stubzConfig.variations).forEach((key)=>{
                    variations[key] = stubzConfig.variations[key];
                });
                this.variationSelector.setVariationsByName(variations)
            }
        }
    }
}