import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Card, Input, Button, Upload, Select, Form, Divider, Icon, Modal, Checkbox, Table, message } from 'antd';
import BasicSider from './sider';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';
import store from './store';
import Append from './modal/add';
import { observer } from 'mobx-react'

const FormItem = Form.Item;
const { Content, Sider } = Layout;
@observer
class Warehousing extends Component {
  columns = [
    {
      title: '物品名称',
      dataIndex: 'sku_name',
    },
    {
      title: '类别',
      dataIndex: 'category_name'
    },
    {
      title: '库存',
      dataIndex: 'stock'
    },
    {
      title: '入库',
      dataIndex: 'all_count'
    },
    {
      title: '单价',
      dataIndex: 'price'
    },
    {
      title: '入库日期',
      dataIndex: 'stock_date'
    },
    {
      title: '最高显示数量',
      dataIndex: 'max',
    },
    {
      title: '最低警示数量',
      dataIndex: 'min'
    },
    {
      title: '操作员',
      dataIndex: 'admin_name'
    },
    {
      title:'操作',
      render: (text, record, index) => <a onClick={()=>{this._delete(record.id);return false}}>删除</a>
    }
  ];
  componentDidMount() {
    this.fetchList(1);
    this.getSkusUse();
  }
  fetchList = (p) => {
    let {category, category_id, order_number} = store;
    request({
      url: '/api/v1/stock/list',
      method: 'GET',
      data:{
        category,
        category_id,
        order_number,
        page:p,
        size:10
      },
      success: (res) => {
        store.dataSource = res.data;
      }
    })
  }
  getSkusUse = () => {
    request({
      url: '/api/v1/sku/list/use',
      method: 'GET',
      success: (res) => {
       store.skuList = res;
      }
    })
  }
  _delete = (id)=>{
    request({
      url:'/api/v1/stock/handel',
      method:'POST',
      data:{
        id
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success:()=>{
        this.fetchList(store.current);
        message.success('删除成功')
      }
    })
  }
  render() {
    let { dataSource, current, total,addParams } = store
    return (
      <Fragment>
        <Layout style={{ background: '#fff' }}>
          <Sider theme='light' style={{ width: 300 }} >
            <BasicSider />
          </Sider>
          <Content style={{ height: 800, marginLeft: 100,marginRight:10 }} >
            <Card bordered={false}>
              <span>类别名称：</span><Input style={{ width: 150, marginRight: 5 }} onChange={(e)=>{ store.category = e.target.value }} />
              {/* <span>类别编号：</span><Input style={{ width: 100, marginRight: 5 }} onChange={(e)=>{store.category_id = e.target.value}} />
              <span>序号：</span><Input style={{ width: 100, marginRight: 5 }} onChange={(e)=>{store.order_number = e.target.value}} /> */}
              <Button type='primary' style={{marginRight:5}} onClick={()=>{this.fetchList(1);}}>查询</Button>
              <Button type='primary' style={{marginRight:5}} >删除</Button>
              <Button type='primary' style={{marginRight:5}} onClick={()=>{store.addParams.AddVisible = true}} >新增</Button>
              <Button type='primary'>导出</Button>
            </Card>
            <Table columns={this.columns} dataSource={store.dataSource} bordered rowKey='id' pagination={{ current: current, onChange: (e) => { this.fetchList(e) }, total: total, }}></Table>
          </Content>
        </Layout>
        <Append props={addParams} />
      </Fragment>
    )
  }
}

export default withRouter(Warehousing)