import React, { Component, Fragment } from 'react';
import { Menu, Icon, Input, Button, Tree } from 'antd';
import { Link } from 'react-router-dom';
import request from '../../../helpers/request';
import store from './store';
import { observer } from 'mobx-react';
import MenuItem from 'antd/lib/menu/MenuItem';

const { TreeNode } = Tree
const { SubMenu } = Menu;


@observer
class BasicSider extends Component {
  componentDidMount() {
    this.getNav();
  }
  getNav = () => {
    request({
      url: '/api/v1/sku/nav',
      method: 'GET',
      success: (res) => {
        store.NavList = res;
      }
    })
  }
  getSkus = (id) => {
    request({
      url: '/api/v1/sku/stock/list',
      method: 'GET',
      data: {
        id
      },
      success: (res) => {
        store.dataSource=res.data;
        console.log(res);
      }
    })
  }

  render(
  ) {
    let { NavList } = store;
    let showNav = NavList.length === 0;
    return (
      <Fragment>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub0']}
          style={{ height: '100%', width: 300, borderRight: 0 }}
        >
          {showNav ? <SubMenu key="sub1" title={<span>打印耗材</span>}></SubMenu> :
            NavList.map((e, i) => 
              <SubMenu key={`sub${i}`} onSelect={()=>{console.log(1)}} title={<span><a onClick={()=>{console.log(111);return false}}></a>{e.category}</span>} >
                {e.skus.map((d) => (
                  <Menu.Item key={d.id} onClick={({ item, key }) => this.getSkus(key)} >{d.name}——库存{d.stock}</Menu.Item>
                ))}
              </SubMenu>)
          }
        </Menu>
      </Fragment>
    );
  }
}

export default BasicSider