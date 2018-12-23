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
        <div className={st.logo}></div>
        <span style={{ fontSize: 24, color:'#cc0033'}}>机关后勤服务之窗</span>
          {atLogin ? null : (<Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            className={st.menuHeader}
            style={{ lineHeight: '60px', float: 'right',fontSize:16,fontWeight:'bold'  }}
          >
            <Menu.Item key="1"><Link to='/userAuthority/user'></Link>角色权限</Menu.Item>
            <Menu.Item key="2"><Link to='/meetings'></Link>预约申请</Menu.Item>
            <Menu.Item key="3">用品管理</Menu.Item>
            <Menu.Item key="4">个人订餐</Menu.Item>
            <Menu.Item key="5">部门人员</Menu.Item>
            <Menu.Item key="6">结算管理</Menu.Item>
          <Menu.Item key="7"><Link onClick={() => { localStorage.removeItem('token'); return false; }} to='/login' ></Link>退出账号</Menu.Item>
          </Menu>)}
      </Fragment>
    )
  }
}

export default HeaderInclude