import React, { Component } from 'react';
import { Modal, Select, Table } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import request from '../../../../helpers/request';

const Option = Select.Option;
@observer
class Setting extends Component {
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
      title: '角色',
      dataIndex: 'role'
    },
  ];
  render() {
    let { props } = this.props;
    let { visible, data} = props;
    let { check_role } = store;
    check_role.slice();
    data.slice()
    return (
      <Modal visible={visible}
        onCancel={() => { store.params.visible = false }}
        onOk={() => { this.add(data) }}
        width='600px'
        title='角色修改'
        okText='保存'
      >
      <div style={{textAlign:"center"}}>
      <span>角色：</span>
          <Select style={{ width: 150 }} placeholder="请选择角色权限" onChange={(e)=>{store.role_id = e}}>
        {
          check_role.map(e => <Option key={e.id} value={e.id}>{e.name}</Option>)
        }
        </Select>
      </div>
      <Table columns={this.columns} dataSource={data} rowKey='account' pagination={false} />
      </Modal>
    )
  }
  add = (data) => {
    let {role_id} = store;
    let admin_id =  data.map(e => e.id);
    admin_id = admin_id.toString();
    request({
      url: '/api/v1/admin/role/update',
      method: 'POST',
      data: {
       admin_id,
       role_id,
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.params.visible = false;
        this.fetchList(1);
      }
    })
  }
 
  fetchList = (page) => {
    let { role, department, phone, username } = store;
    request({
      url: '/api/v1/admin/list',
      method: 'GET',
      data: {
        role,
        username,
        department,
        phone,
        page,
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

export default Setting