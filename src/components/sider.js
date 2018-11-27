import React, {Component} from 'react';
import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;


class SiderMenu extends Component {
  render(){
    return( 
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <SubMenu key="sub1" title={<span><Icon type="book" theme="filled" />会议签到</span>}>
          <Menu.Item key="1">新增会议</Menu.Item>
          <Menu.Item key="2">签到明细</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="book" theme="filled" />门禁权限</span>}>
          <Menu.Item key="3">门禁权限申请</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="book" theme="filled" />场地使用</span>}>
          <Menu.Item key="4">文体活动场地</Menu.Item>
          <Menu.Item key="5">功能室</Menu.Item>
        </SubMenu>
        <SubMenu key="sub5" title={<span><Icon type="book" theme="filled" />教育培训预定</span>}>
          <Menu.Item key="6">会场预定</Menu.Item>
          <Menu.Item key="7">用餐预定</Menu.Item>
        </SubMenu>
        <SubMenu key="sub6" title={<span><Icon type="book" theme="filled" />公务接待</span>}>
          <Menu.Item key="8">围餐预定</Menu.Item>
        </SubMenu>
        <SubMenu key="sub7" title={<span><Icon type="book" theme="filled" />会议接待</span>}>
          <Menu.Item key="9">会议接待</Menu.Item>
        </SubMenu>
        <SubMenu key="sub8" title={<span><Icon type="book" theme="filled" />公务用车</span>}>
          <Menu.Item key="9">公务用车</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default SiderMenu