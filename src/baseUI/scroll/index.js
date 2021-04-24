import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, useMemo } from 'react'
import BScroll from 'better-scroll'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Loading from '../loading/index'
import LoadingV2 from '../loading-v2/index'
import {debounce} from '../../api/utils'
const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`
const PullUpLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`

export const PullDownLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`

const Scroll = forwardRef((props, ref) => {
  const [scroll, setScroll] = useState()
  const scrollContaninerRef = useRef()
  const {
    direction,
    click,
    refresh,
    pullUp,
    pullDown,
    onScroll,
    pullUpLoading,
    pullDownLoading,
    bounceTop,
    bounceBottom,
  } = props

  const PullUpdisplayStyle = pullUpLoading ? { display: '' } : { display: 'none' }
  const PullDowndisplayStyle = pullDownLoading ? { display: '' } : { display: 'none' }

  let pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300) 
  },[pullUp])
  // 不然拿到的始终是第一次 pullUp 函数的引用，相应的闭包作用域变量都是第一次的，产生闭包陷阱。下同。

  let pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300)
  }, [pullDown]) 

  useEffect(() => {
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === 'horizontal',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
    })
    setScroll(scroll)
    return () => {
      setScroll(null)
    }
  }, [bounceBottom, bounceTop, click, direction])

  // 每次重新渲染都要刷新实例，防止无法滑动
  useEffect(() => {
    if (refresh && scroll) {
      scroll.refresh()
    }
  })

  useEffect(() => {
    if (!scroll || !onScroll) return
    scroll.on('scroll', (e) => {
      onScroll(e)
    })
    return () => {
      scroll.off('scroll')
    }
  }, [onScroll, scroll])

  useEffect(() => {
    if (!scroll || !pullUp) return
    const handlePullUp = () => {
      if(scroll.y <= scroll.maxScrollY +100) {
        pullUpDebounce()
      }
    }
    scroll.on('scrollEnd', handlePullUp)
    return () => {
      scroll.off('scrollEnd')
    }
  }, [pullUp, pullUpDebounce, scroll])

  useEffect(() => {
    if (!scroll || !pullDown) return
    const handlePullDown = (pos) => {
      if (pos.y > 50) {
        pullDownDebounce()
      }
    }
    scroll.on('touchEnd', handlePullDown)
    return () => {
      scroll.off('touchEnd')
    }
  }, [pullDown, pullDownDebounce, scroll])
  
  useImperativeHandle(ref, () => ({
    refresh() {
      if (scroll) {
        scroll.refresh()
        scroll.scrollTo(0, 0)
      }
    },
    getScroll() {
      if (scroll) {
        return scroll
      }
    },
  }))

  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={PullUpdisplayStyle}>
        <Loading></Loading>
      </PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={PullDowndisplayStyle}>
        <LoadingV2></LoadingV2>
      </PullDownLoading>
    </ScrollContainer>
  )
})

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizontal']), // 滚动的方向
  click: true, // 是否支持点击
  refresh: PropTypes.bool, // 是否刷新
  onScroll: PropTypes.func, // 滑动触发的回调函数
  pullUp: PropTypes.func, // 上拉加载逻辑
  pullDown: PropTypes.func, // 下拉加载逻辑
  pullUpLoading: PropTypes.bool, // 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool, // 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool, // 是否支持向上吸顶
  bounceBottom: PropTypes.bool, // 是否支持向下吸底
}

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true,
}

export default Scroll
