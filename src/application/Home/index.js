import React from 'react'
import { renderRoutes } from 'react-router-config'
import { Top, Tab } from './style'
import {NavBar} from './utils'
const Home = (props) => {
  const { route } = props
  return (
    <div>
      <Top>
        <span className='iconfont menu'>&#xe65c;</span>
        <span className='title'>JsChen</span>
        <span className='iconfont search'>&#xe62b;</span>
      </Top>
      <Tab>
        <NavBar url='/recommend' text='推荐'/>
        <NavBar url='/singers' text='歌手'/>
        <NavBar url='/rank' text='排行榜'/>
      </Tab>
      {renderRoutes(route.routes)}
    </div>
  )
}

export default React.memo(Home)
