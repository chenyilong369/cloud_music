import React, { useEffect } from 'react'
import Slider from '../../components/slider/'
import { connect } from 'react-redux'
import * as actionTypes from './store/actionCreators'
import RecommendList from '../../components/list/'
import Scroll from '../../baseUI/scroll/index'
import { Content } from './style'
import { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading/index'

function Recommend(props) {
  const { bannerList, recommendList, enterLoading } = props

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props

  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch()
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch()
    }
  }, [bannerList, getBannerDataDispatch, getRecommendListDataDispatch, recommendList])

  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []

  return (
    <Content>
      <Scroll bounceTop={false} onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      {enterLoading ? <Loading /> : null}
    </Content>
  )
}

const mapStateToProps = (state) => ({
  enterLoading: state.getIn(['recommend', 'enterLoading']),
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
})

const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList())
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList())
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend))
