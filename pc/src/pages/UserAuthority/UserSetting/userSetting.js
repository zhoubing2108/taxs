import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Card,Input,Table,Button } from 'antd';
import store from './store';
import {observer} from 'mobx-react';
import request from '../../../helpers/request';
import Setting from './modal/change';


const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    store.params.data = selectedRows;
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

@observer
class UserSetting extends Component {
  columns=[
    {
      title:'账号',
      dataIndex:'account'
    },
    {
      title:'姓名',
      dataIndex:'username'
    },
    {
      title:'手机号码',
      dataIndex:'phone'
    },
    {
      title:'部门',
      dataIndex:'department'
    },
    {
      title:'角色',
      dataIndex:'role'
    },
    {
      title:'操作',
      render: (text, record, columns) => (<span><a style={{ marginRight: 5 }} onClick={() => { store.params.visible=true;store.params.data.clear();store.params.data.push(record)}}>修改</a></span>)
    }
  ];
  render() {
    let { dataSource, total, current, params} = store;
    dataSource = Array.from(dataSource);
    return (
      <Fragment>
        <Card>
          <div>
            <span>姓名：</span><Input style={{ width: 120, marginRight: 10 }} placeholder='全部' onChange={(e) => { store.username = e.target.value }}/>
            <span>手机号码：</span><Input style={{ width: 120, marginRight: 10 }} placeholder='手机号码' onChange={(e) => {store.phone = e.target.value} } />
            {/* <span>申请人：</span> <Input style={{ width: 120, marginRight: 10 }} placeholder='全部' onChange={(e) => { store.username = e.target.value }} /> */}
            <Button type='primary' style={{ marginRight: 10 }} onClick={() => {this.fetchList(1)}} >查询</Button>
            <Button type='primary' onClick={()=>{store.params.visible = true}} >修改</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={this.columns} dataSource={dataSource} rowSelection={rowSelection} rowKey='id' bordered pagination={{ current: current, onChange: (e) => { this.fetchList(e) }, total: total, }} />
          </div>
        </Card>
        <Setting props={params} />
      </Fragment>
    )
  }
  componentDidMount() {
    this.fetchList(1);
    this.getRole()
  }
  getRole = () => {
    request({
      url: '/api/v1/role/list',
      method: 'GET',
      success: (res) => {
        store.check_role = res;
      }
    })
  }
  fetchList = (page) => {
    let {role, department,phone,username} = store;
    request({
      url:'/api/v1/admin/list',
      method:'GET',
      data:{
        role,
        username,
        department,
        phone,
        page,
        size:10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.total = res.total;
        store.current = res.current_page;
      }
    })
  }
}

export default withRouter(UserSetting);