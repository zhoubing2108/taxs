import React, { Component, Fragment } from 'react';
import st from './header.css';
import { observer } from 'mobx-react';
import { Menu } from 'antd';
import globalStore from '../globalStore'
import { Link } from 'react-router-dom';

class HeaderInclude extends Component {
  render() {
    let pathName = this.props.history.location.pathname;
    let atLogin = pathName === '/login'
    return (
      <Fragment>
        <div className={st.logo}>税务局一卡通</div>
        {atLogin ? null : (<Menu
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
          <Menu.Item key="7"><Link onClick={() => { localStorage.removeItem('token'); return false; }} to='/login' >退出账号</Link></Menu.Item>
        </Menu>)}
      </Fragment>
    )
  }
}

export default HeaderInclude