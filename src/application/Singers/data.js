import React, { createContext, useReducer } from 'react'
import { fromJS } from 'immutable'

export const CategoryDataContext = createContext({})

export const CHANGE_CATEGORY = `singers/CHANGE_CATEGORY`
export const CHANGE_TYPE = `singers/CHANGE_TYPE`
export const CHANGE_AREA = `singers/CHANGE_AREA`
export const CHANGE_ALPHA = `singers/CHANGE_ALPHA`

const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CATEGORY:
      return state.set('category', action.data)
    case CHANGE_ALPHA:
      return state.set('alpha', action.data)
    case CHANGE_TYPE:
      return state.set('type', action.data)
    case CHANGE_AREA:
      return state.set('area', action.data)
    default:
      return state
  }
}

export const Data = props => {
  const [data, dispatch] = useReducer(reducer, fromJS({
    category: '',
    alpha: '',
    type: '',
    area: ''
  }))

  return (
    <CategoryDataContext.Provider value={{data, dispatch}}>
      {props.children}
    </CategoryDataContext.Provider>
  )
}

