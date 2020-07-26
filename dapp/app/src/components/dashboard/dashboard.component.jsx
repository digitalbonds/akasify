import React from 'react'
import { drizzleReactHooks } from "@drizzle/react-plugin"

const { useDrizzle, useDrizzleState } = drizzleReactHooks

function Dashboard() {

    const { drizzle } = useDrizzle()
    const state = useDrizzleState(state => state)
    const stateApp = {}

    const handleChange = (e, x) => {
        stateApp[e.target.id] = e.target.value
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const createOpportunity = async () => {
        console.log(state)
        console.log(drizzle)
        console.log('Hey man')
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Create Opportunity</h5>
                <div className="input-field">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" onChange={handleChange} />
                </div>
                <div className="input-field">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" onChange={handleChange} />
                </div>
                <div className="input-field">
                    <button value="Submit" onClick={createOpportunity} className="btn pink lighten-1 z-depth-0">Create</button>
                </div>
            </form>
        </div>
    )
}

export default Dashboard