import {fromJS} from 'immutable'
import * as actionTypes from './constants'

const defaultState = fromJS({
  singerList: [],
  enterLoading:true,
  pullUpLoading:false,
  pullDownLoading: false,
  pageCount: 0 // 当前页面
})

const dispatch = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data)
    case actionTypes.CHANGE_PAGE_COUNT:
      return state.set('pageCount', action.data)
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterloading', action.data)
    case actionTypes.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data)
    case actionTypes.CHANGE_PULLDOWN_LOADING:
      return state.set('pullDownLoading', action.data)
    default:
      return state
  }
}

export default dispatch