import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import HeaderInclude from '../components/header';
import SiderMenu from '../components/sider';

const { Header, Content, Sider, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Layout>
        <Header style={{background: '#fff'}} className="header">
          <HeaderInclude />
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <SiderMenu />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
          <span>
            您现在的位置：
            <Breadcrumb style={{ margin: '16px 0', display:'inline' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
          </span>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              Content
        </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default App