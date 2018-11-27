import React, { Component, Fragment } from 'react'
import { Menu } from 'antd';

class HeaderInclude extends Component {
  render() {
    return (
      <Fragment>
        <div></div>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px', float: 'right' }}
          >
            <Menu.Item key="1">角色权限</Menu.Item>
            <Menu.Item key="2">预约申请</Menu.Item>
            <Menu.Item key="3">用品管理</Menu.Item>
            <Menu.Item key="4">个人订餐</Menu.Item>
            <Menu.Item key="5">部门人员</Menu.Item>
            <Menu.Item key="6">结算管理</Menu.Item>
            <Menu.Item key="7">退出账号</Menu.Item>
          </Menu>
      </Fragment>
    )
  }
}

export default HeaderInclude