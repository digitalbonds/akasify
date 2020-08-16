import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { NavLink } from 'react-router-dom'
import { ReactComponent as Logo } from '../assets/vectors/akasify_icon.svg'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const HeaderComponent = () => {
  return (
    <Header className='header'>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="0">
          {/* <div className='menu-logo' /> */}
          <Logo className='menu-logo'/> 
        </Menu.Item>
        <Menu.Item key="1">
          <NavLink style={{color: '#F6EAD1'}} className='nav-link' to='/'>About</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
        <NavLink style={{color: '#F6EAD1'}} className='nav-link' to='/'>How it works?</NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink style={{color: '#F6EAD1'}} className='nav-link' to='/'>Community</NavLink>
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default HeaderComponent