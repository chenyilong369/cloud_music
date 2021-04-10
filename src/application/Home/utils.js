import React from 'react'
import { NavLink } from 'react-router-dom';
import {
  TabItem,
} from './style';
const NavBar = (props) => {
  const {url, text} = props
  return (
    <NavLink to={url} activeClassName='selected'>
      <TabItem>
        <span>{text}</span>
      </TabItem>
    </NavLink>
  )
}

export {NavBar}
