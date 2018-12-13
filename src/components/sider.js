import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import globalStore from '../globalStore'

const { SubMenu } = Menu;


class SiderMenu extends Component {
  render() {
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <SubMenu key="sub1" title={<span><Icon type="book" theme="filled" />会议签到</span>}>
          <Menu.Item key="1"><Link to='/meetings/new'>新增会议</Link></Menu.Item>
          <Menu.Item key="2"><Link to='/meetings/checkIn'>签到明细</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="book" theme="filled" />门禁权限</span>}>
          <Menu.Item key="3"><Link to='/entrance/authority'>门禁权限申请</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="book" theme="filled" />场地使用</span>}>
          <Menu.Item key="4"><Link to='/space/activity'>文体活动场地</Link></Menu.Item>
          <Menu.Item key="5"><Link to='/space/fnRoom'>功能室</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="sub5" title={<span><Icon type="book" theme="filled" />教育培训预定</span>}>
          <Menu.Item key="6"><Link to='/education/meetingplace'>会场预定</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="sub6" title={<span><Icon type="book" theme="filled" />公务接待</span>}>
          <Menu.Item key="7"><Link to='/reception/diningaround'>围餐预定</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="sub7" title={<span><Icon type="book" theme="filled" />会议、接待</span>}>
          <Menu.Item key="8"><Link to='/meetingReception'>会议、接待</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="sub8" title={<span><Icon type="book" theme="filled" />公务用车</span>}>
          <Menu.Item key="9"><Link to='/useCar'>公务用车</Link></Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default SiderMenu