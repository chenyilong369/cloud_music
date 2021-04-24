import React, { useState, useEffect, useContext } from 'react'
import HorizenItem from '../../baseUI/horizen-item'
import { NavContainer, List, ListItem, ListContainer } from './style.js'
import { alphaTypes, categoryTypes } from '../../api/config'
import Scroll from '../../baseUI/scroll'
import LazyLoad, { forceCheck, forceVisible } from 'react-lazyload'
import Loading from '../../baseUI/loading/index'
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList,
} from './store/actionCreators'
import { connect } from 'react-redux'
import {CategoryDataContext, CHANGE_CATEGORY, CHANGE_ALPHA, CHANGE_TYPE, CHANGE_AREA} from './data'
const Singers = (props) => {
  const {
    singerList,
    updateDispatch,
    pullDownRefreshDispatch,
    pullUpRefreshDispatch,
    pageCount,
    pullUpLoading,
    pullDownLoading,
    enterLoading,
    getHotSingerDispatch
  } = props
  const {data, dispatch} = useContext(CategoryDataContext)
  const {category, alpha, type, area} = data.toJS()

  useEffect(() => {
    if(!singerList.size) {
      getHotSingerDispatch()
    }
  }, [])

  let handleUpdateAlpha = (val) => {
    dispatch({type: CHANGE_ALPHA, data: val.key})
    updateDispatch(type, area, val.key)
  }

  let handleUpdateCategory = (val) => {
    dispatch({type: CHANGE_CATEGORY, data: val.key})
    dispatch({type: CHANGE_TYPE, data: val.type})
    dispatch({type: CHANGE_AREA, data: val.area})
    updateDispatch(val.type, val.area, alpha)
  }

  const handlePullUp = () => {
    pullUpRefreshDispatch(type, area, alpha, category === '', pageCount)
  }

  const handlePullDown = () => {
    pullDownRefreshDispatch(type, area, alpha)
  }

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : []
    return (
      <List>
        {list.map((item, index) => {
          return (
            <ListItem key={item.accountId + '' + index}>
              <div className='img_wrapper'>
                <LazyLoad
                  placeholder={
                    <img width='100%' height='100%' src={require('./singer.png')} alt='music' />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width='100%'
                    height='100%'
                    alt='music'
                  />
                </LazyLoad>
              </div>
              <span className='name'>{item.name}</span>
            </ListItem>
          )
        })}
      </List>
    )
  }

  return (
    <div>
      <NavContainer>
        <HorizenItem
          list={categoryTypes}
          title={'分类：'}
          handleClick={val => handleUpdateCategory(val)}
          oldVal={category}
        />
        <HorizenItem
          list={alphaTypes}
          title={'首字母：'}
          handleClick={val => handleUpdateAlpha(val)}
          oldVal={alpha}
        />
      </NavContainer>
      <ListContainer>
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          onScroll={forceCheck}
        >
          {renderSingerList()}
        </Scroll>
        <Loading show={enterLoading} />
      </ListContainer>
    </div>
  )
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
})
const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList())
      dispatch(changeEnterLoading(false))
    },
    updateDispatch(type, area, alpha) {
      dispatch(changePageCount(0)) //由于改变了分类，所以pageCount清零
      dispatch(changeEnterLoading(true)) //loading，现在实现控制逻辑，效果实现放到下一节，后面的loading同理
      dispatch(getSingerList(type, area, alpha))
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch(type, area, alpha, hot, count) {
      dispatch(changePullUpLoading(true))
      dispatch(changePageCount(count + 1))
      if (hot) {
        dispatch(refreshMoreHotSingerList())
      } else {
        dispatch(refreshMoreSingerList(type, area, alpha))
      }
    },
    //顶部下拉刷新
    pullDownRefreshDispatch(type, area, alpha) {
      dispatch(changePullDownLoading(true))
      dispatch(changePageCount(0)) //属于重新获取数据
      if (type === '' && alpha === '' && area === '') {
        dispatch(getHotSingerList())
      } else {
        dispatch(getSingerList(type, area, alpha))
      }
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Singers)
