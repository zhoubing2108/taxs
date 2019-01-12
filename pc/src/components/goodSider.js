import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import globalStore from '../globalStore';
import userIcon from '../imgs/car.svg'

const { SubMenu } = Menu;



class GoodSider extends Component {
  render() {
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <SubMenu key="sub1" title={<span><Icon type="edit" theme="twoTone" />仓库管理</span>}>
          <Menu.Item key="1"><Link to='/good/recipients/'></Link>领用申请</Menu.Item>
          <Menu.Item key="2"><Link to='/good/borrow/'></Link>借用申请</Menu.Item>
          <Menu.Item key="3"><Link to='/good/type/'>定义类别</Link></Menu.Item>
          <Menu.Item key="4"><Link to='/good/basic/default/'>基本资料</Link></Menu.Item>
          <Menu.Item key="5"><Link to='/good/warehousing/'>入库管理</Link></Menu.Item>
          <Menu.Item key="6"><Link to='/good/repair/'>故障报修</Link></Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default GoodSider