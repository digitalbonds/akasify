import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";

const { useDrizzleState } = drizzleReactHooks; 

function Loader({children}) {
    const drizzleStatus = useDrizzleState(state => state.drizzleStatus);
    if(drizzleStatus.initialized === false) {
        return (
            <main>
                <h1><span>⚙️</span></h1>
                <p>Loading dapp...</p>
            </main>)
    } else {
        return(
            <>
                { children }
            </>
        )
    }
}

export default Loader;