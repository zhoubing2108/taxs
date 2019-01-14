import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import globalStore from '../globalStore';
import userIcon from '../imgs/car.svg'

const { SubMenu } = Menu;



class UserSider extends Component {
  render() {
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <SubMenu key="sub1" title={<span><Icon type="edit" theme="twoTone" />用户权限</span>}>
          <Menu.Item key="1"><Link to='/userAuthority/user'></Link>角色设置</Menu.Item>
          {/* <Menu.Item key="2"><Link to='/userAuthority/psw'>密码设置</Link></Menu.Item> */}
        </SubMenu>
      </Menu>
    )
  }
  // <img src={userIcon} style={{ width: 21, height: 21, }} alt="" />
}

export default UserSider