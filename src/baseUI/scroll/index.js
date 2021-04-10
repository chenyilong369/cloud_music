import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import BScroll from 'better-scroll'
import PropTypes from 'prop-types'
import styled from 'styled-components'
const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
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
    scroll.on('scrollEnd', () => {
      if (scroll.y <= scroll.maxScroll + 100) {
        pullUp()
      }
    })
    return () => {
      scroll.off('scrollEnd')
    }
  }, [pullUp, scroll])

  useEffect(() => {
    if (!scroll || !pullDown) return
    scroll.on('touchEnd', (pos) => {
      if (pos.y > 50) {
        pullDown()
      }
    })
    return () => {
      scroll.off('touchEnd')
    }
  }, [pullDown, scroll])

  useImperativeHandle(ref, () => ({
    refresh() {
      if (scroll) {
        scroll.refresh()
        scroll.scrollTo(0, 0)
      }
    },
    getScroll() {
      if(scroll) {
        return scroll
      }
    }
  }))

  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
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
