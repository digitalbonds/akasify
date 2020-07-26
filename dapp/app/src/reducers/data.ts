import { ADD_DATA } from "../actions/data"

const initialState = {
  ux: {
    'collapsed': false
  },
}

export const dataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_DATA:
      return state
      //return Object.assign({}, state, { dataArray: state.ux.concat(action.data) })
    default:
      return state
  }
}
