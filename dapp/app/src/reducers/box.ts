import { ADD_BOX } from "../actions/box"

const initialState = {
  box: {}
}

export const boxReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case ADD_BOX:
            console.log('box_reducer', action.data)
            return Object.assign({}, state, { box: action.data })
        default:
            return state
    }
}
