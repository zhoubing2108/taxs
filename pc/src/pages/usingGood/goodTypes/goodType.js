import React, { Component, Fragment } from 'react';
import { Card, Button, Input, Table } from 'antd';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import AddType from './modal/add';
import store from './store'
import request from '../../../helpers/request';

@observer
class GoodType extends Component {
  columns = [
    {
      title: '类别名称',
      dataIndex: 'name'
    },
    {
      title: '编号',
      dataIndex: 'code'
    },
    {
      title: '序号',
      dataIndex: 'order'
    },
    {
      title: '备注',
      dataIndex: 'remark',
    }
  ];
  componentDidMount() {
    this.fetchList(1);
  }
  fetchList = (page)=>{
    let {category,category_id,order_number} = store
    request({
      url:'/api/v1/category/list',
      method:'GET',
      data:{
        category,
        order_number,
        category_id,
        page,
        size:10,
      },
      success:(res)=>{
        store.dataSource = res.data;
        store.total = res.total;
        store.current = res.current_page;
      }
    })
  }
  render() {
    let {addParams,dataSource,current,total} = store;
    return (
      <Fragment>
        <Card>
          <div>
            <span>类别名称：</span><Input style={{ width: 120, marginRight: 10 }} onChange={(e)=>{store.category = e.target.value}} />
            <span>编号：</span><Input style={{ width: 80, marginRight: 10 }} onChange={(e) => { store.order_number = e.target.value }}/>
            <span>序号：</span> <Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.category_id = e.target.value }} />
            <Button type='primary' style={{ marginRight: 5 }} onClick={()=>{this.fetchList(1)}}>查询</Button>
            <Button type='primary' style={{ marginRight: 5 }} onClick={()=>{store.addParams.AddVisible = true}}>新建</Button>
            <Button type='primary' style={{ marginRight: 5 }}>编辑</Button>
            <Button type='primary' style={{ marginRight: 5 }}>删除</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={this.columns} dataSource={dataSource} bordered pagination={{ current: current, onChange: (e) => { store.current = e; this.fetchList(e) }, total: total, }}></Table>
          </div>
        </Card>
        <AddType props={addParams} />
      </Fragment>
    )
  }
}

export default withRouter(GoodType)