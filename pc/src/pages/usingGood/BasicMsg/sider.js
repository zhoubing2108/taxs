import React, { Component, Fragment } from 'react';
import { Menu } from 'antd';
import { Link,withRouter } from 'react-router-dom';
import request from '../../../helpers/request';
import store from './store';
import { observer } from 'mobx-react';

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
    let { history } = this.props;
    request({
      url: '/api/v1/sku',
      method: 'GET',
      data: {
        id
      },
      success: (res) => {
        store.defaultData = res;
        store.fileList = [];
        console.log(res);
        store.fileList = res.imgs.map(img=>{
          return {
            name:img.img_id,
            uid:img.img_id,
            url:img.img_url.url,
            response:{id:img.img_id},
            status:'done'
          }
        })
        history.push('/good/basic/modify/');
      }
    })
  }

  render() {
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
              <SubMenu key={`sub${i}`} title={<span>{e.category}</span>} >
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

export default withRouter(BasicSider)