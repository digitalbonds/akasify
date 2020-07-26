import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from '@drizzle/store'
import { dataReducer } from './reducers/data'
import { boxReducer } from './reducers/box'

const reducer = combineReducers({
  routing: routerReducer,
  ...drizzleReducers,
  ux: dataReducer,
  box: boxReducer
})

export default reducer
