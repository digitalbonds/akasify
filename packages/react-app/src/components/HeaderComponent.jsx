//import React, { useState } from 'react'
import React from 'react'
import { Layout, Menu } from 'antd'
import { NavLink } from 'react-router-dom'
import { ReactComponent as Logo } from '../assets/vectors/akasify_icon.svg'

const { Header } = Layout;

function HeaderComponent({
  role,
  handleProfileDrawer
}) {

  return (
    <Header className='header'>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>
        <Menu.Item key="0">
          <Logo className='menu-logo'/> 
        </Menu.Item>
        <Menu.Item key="1">
          <NavLink className='nav-link' to='/'>About</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink className='nav-link' to='/opportunity'>Opportunities</NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink className='nav-link' to='/organization'>Organizations</NavLink>
        </Menu.Item>
        {role === 'admin' && 
          <Menu.Item key="4">
            <NavLink className='nav-link' to="/admin">Admin</NavLink>
          </Menu.Item>
        }
        <Menu.Item key="5" style={{float: 'right'}}>
          <NavLink
            className='nav-link'
            to='/'
            onClick={handleProfileDrawer}>Profile</NavLink>
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default HeaderComponent