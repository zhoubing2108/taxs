import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Table } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../../config/common-form';
import request from '../../../../helpers/request';

const FormItem = Form.Item;
const Option = Select.Option;


@observer
class Append extends Component {
  columns = [
    {
      title: 'id',
      dataIndex: 'id'
    },
    {
      title: '用品名称',
      dataIndex: 'name'
    },
    {
      title: '类别',
      dataIndex: 'category'
    },
    {
      title: '库存',
      dataIndex: 'stock'
    }
  ]
  dataSource = [
    {
      "id": 1,
      "name": "洗手液",
      "category": "打印机耗材",
      "stock": "20"
    }
  ]
  render() {
    let { props, form } = this.props;
    let { AddVisible, user_type } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    let { checkInputVal, skuList, useList } = store;
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.add() }}
        width='600px'
        title='领用申请'
        okText='创建'
      >
        <Form>
          <FormItem {...commonFormProps} label='物品名称'>
            {getFieldDecorator('sku_id')(
              <Select placeholder='请选择物品' style={{ width: 150, marginRight: 10 }} onChange={this.getSkuList}>
                {
                  useList.map(e => <Option value={e.id} key={e.id} >{e.name}</Option>)
                }
              </Select>
            )}
            <span>数量：</span>
            {
              getFieldDecorator('count')(
                <InputNumber style={{ width: 150 }} placeholder='数量' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='领用日期'>
            {
              getFieldDecorator('time_begin')(
                <DatePicker style={{ width: 150, marginRight: 10 }} />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='物品信息' >
            <Table columns={this.columns} dataSource={skuList} size='small' pagination={false} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { count, time_begin, time_end, sku_id } = values;
    time_begin = moment(time_begin).format('YYYY-MM-DD');
    time_end = moment(time_end).format('YYYY-MM-DD');
    console.log(time_begin);
    request({
      url: '/api/v1/collar/use/save',
      method: 'POST',
      data: {
        sku_id,
        count,
        time_begin,
        type: 2
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.addParams.AddVisible = false;
        this.fetchList(1);
        this.props.form.resetFields();
      }
    })
  }
  getSkuList = (id) => {
    let skuList = store.useList.filter(e => e.id == id);
    store.skuList = skuList;
  }
  fetchList = (page) => {
    let { department, time_begin, time_end, status, username, category } = store;
    let t_begin = moment(time_begin).format('YYYY-MM-DD')
    let t_end = moment(time_end).format('YYYY-MM-DD');
    request({
      url: '/api/v1/sku/apply/list',
      method: 'GET',
      data: {
        type: 'collar_use_t',
        category,
        department,
        username,
        status,
        time_begin: t_begin,
        time_end: t_end,
        page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.current = res.current_page;
        store.total = res.total;
      }
    })
  }
}

export default Form.create()(Append)