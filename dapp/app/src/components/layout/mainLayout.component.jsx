import React from 'react'
import { drizzleReactHooks } from "@drizzle/react-plugin"
import { Layout, Typography, Avatar, Menu, Breadcrumb } from 'antd';
import { MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined } from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const { useDrizzle, useDrizzleState } = drizzleReactHooks

function MainLayout() {

    const { drizzle } = useDrizzle()
    const state = useDrizzleState(state => state)
    console.log('state: ', state)

    const toggle = () => {
        this.setState({
            collapsed: !state.ux.ux.collapsed,
        });
    };

    return (
        <Layout>
          <Sider trigger={null} collapsible collapsed={state.ux.ux.collapsed}>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1" icon={<UserOutlined />}>
                nav 1
              </Menu.Item>
              <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                nav 2
              </Menu.Item>
              <Menu.Item key="3" icon={<UploadOutlined />}>
                nav 3
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(state.ux.ux.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: toggle,
              })}
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
              }}
            >
              Content
            </Content>
          </Layout>
        </Layout>
    )
}

export default MainLayout