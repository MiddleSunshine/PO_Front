import React from "react";
import {TLDraw,TldrawApp,TDDocument,TLPageState} from "@tldraw/tldraw";

class WhiteBord extends React.Component{
    render() {
        const myDoc:TDDocument={
            id:"doc",
            version:1,
            pages:{
                page1:{
                    id:"page1",
                    shapes:{},
                    bindings:{}
                }
            },
            pageStates:{
                page1: {

                }
            }
        }
        return <div>
            <TLDraw
                document={myDoc}
            />
        </div>
    }
}

export default WhiteBord