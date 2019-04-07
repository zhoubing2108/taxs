import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Input, Table, Button, Select } from 'antd';
import store from './store';
import { observer } from 'mobx-react';
import request from '../../../helpers/request';
import Setting from './modal/change';

const Option = Select.Option


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
  columns = [
    {
      title: '账号',
      dataIndex: 'account'
    },
    {
      title: '姓名',
      dataIndex: 'username'
    },
    {
      title: '手机号码',
      dataIndex: 'phone'
    },
    {
      title: '部门',
      dataIndex: 'department'
    },
    {
      title: '职务',
      dataIndex: 'post'
    },
    {
      title: '角色',
      dataIndex: 'role'
    },
    // {
    //   title:'操作',
    //   render: (text, record, columns) => (<span><a style={{ marginRight: 5 }} onClick={() => { store.params.visible=true;store.params.data.clear();store.params.data.push(record)}}>修改</a></span>)
    // }
  ];
  render() {
    let { dataSource, total, current, params, department, departmentList } = store;
    dataSource = Array.from(dataSource);
    let disabled = sessionStorage.getItem('role') === 26;
    return (
      <Fragment>
        <Card>
          <div>
            <span>姓名：</span><Input style={{ width: 120, marginRight: 10 }} placeholder='名字' onChange={(e) => { store.username = e.target.value }} />
            <span>手机号码：</span><Input style={{ width: 120, marginRight: 10 }} placeholder='手机号码' onChange={(e) => { store.phone = e.target.value }} />
            <span>部门：</span>
            <Select defaultValue={department} onChange={(v) => { store.department = v }} style={{ width: 150, marginRight: 10 }}>
              <Option value={'全部'}>全部</Option>
              {departmentList.map(e => <Option value={e.name}>{e.name}</Option>)}
            </Select>
            <span>职务：</span><Input style={{ width: 120, marginRight: 10 }} placeholder='职务' onChange={(e) => { store.post = e.target.value }} />
            <Button type='primary' style={{ marginRight: 10 }} onClick={() => { this.fetchList(1) }} >查询</Button>
            {disabled ?
              <Button type='primary' onClick={() => { store.params.visible = true }} >修改</Button>
              : null}
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={this.columns} dataSource={dataSource} rowSelection={rowSelection} rowKey='id' bordered pagination={{ current: current, onChange: (e) => { store.current = e; this.fetchList(e) }, total: total, }} />
          </div>
        </Card>
        <Setting props={params} />
      </Fragment>
    )
  }
  componentDidMount() {
    this.fetchList(1);
    this.getRole();
    this.getDepartment();
  }
  getDepartment = () => {
    request({
      url: '/api/v1/department/list',
      method: 'GET',
      success: (res) => {
        store.departmentList = res;
      }
    })
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
    let { phone, username, department, post } = store;
    request({
      url: '/api/v1/admin/list',
      method: 'GET',
      data: {
        username,
        phone,
        page,
        department,
        post,
        size: 10
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