import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Table, Radio } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../../config/common-form';
import request from '../../../../helpers/request';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@observer
class Append extends Component {
  state = {
    m_pack: '',
    m_pack_count: '',//拆箱比
    all_money: 0
  }
  componentDidMount() {
    // this.getSkuInfo(1);
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
  getSkuInfo = (id) => {
    let values = this.props.form.getFieldsValue();
    let { price } = values;
    request({
      url: '/api/v1/sku',
      method: 'GET',
      data: {
        id
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        this.setState({
          m_pack: res.pack,
          m_pack_count: res.count,
        })
      }
    })
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { stock_code, count, price, type,sku_id } = values;
    let {all_money} = this.state;
    let all_count = count * this.state.m_pack_count;
    request({
      url: '/api/v1/stock/save',
      data: {
        sku_id,
        count,
        all_count,
        type,
        stock_code,
        price,
        all_money
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success:()=>{
        this.props.form.resetFields();
        this.getNav();
        store.addParams.AddVisible = false;
      }
    })
  }
  render() {
    let { props, form } = this.props;
    let { AddVisible, user_type } = props;
    let { skuList, } = store;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.add() }}
        width='600px'
        title='新增入库'
        okText='保存'
      >
        <Form>
          <FormItem label='入库单编号'{...commonFormProps}>
            {
              getFieldDecorator('stock_code')(
                <Input placeholder='请输入入库单编号' />
              )
            }
          </FormItem>
          <FormItem label='办公用品'{...commonFormProps}>
            {
              getFieldDecorator('sku_id')(
                <Select placeholder='请选择用品' onChange={this.getSkuInfo}>
                  {skuList.map(e =>
                    <Option value={e.id} key={e.id} >{e.name}</Option>
                  )}
                </Select>
              )
            }
          </FormItem>
          <FormItem label='单价'{...commonFormProps}>
            {
              getFieldDecorator('price')(
                <InputNumber onBlur={(e) => {
                  let all_money = e.target.defaultValue * this.props.form.getFieldsValue().count * this.state.m_pack_count;
                  this.setState({ all_money: all_money });
                }} placeholder='单价' min={0} />
              )
            }
          </FormItem>
          <FormItem label='入库数量'{...commonFormProps}>
            {
              getFieldDecorator('count')(
                <InputNumber style={{ width: '20%', marginRight: 5 }}
                  onBlur={(e) => {
                    let all_money = e.target.defaultValue * this.props.form.getFieldsValue().price * this.state.m_pack_count;
                    this.setState({ all_money: all_money });
                  }} placeholder='数量' min={0} />
              )
            }
            {
              getFieldDecorator('type')(
                <RadioGroup>
                  <Radio value={1}>增加</Radio>
                  <Radio value={2}>减少</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem label='进货包装'{...commonFormProps} >
            <Input style={{ width: 100, marginRight: 5 }} value={this.state.m_pack} disabled />
            <span>拆箱比：</span><Input style={{ width: 100 }} value={this.state.m_pack_count} disabled />
          </FormItem>
          <FormItem label='金额'{...commonFormProps}>
            <InputNumber placeholder='金额' value={this.state.all_money} disabled />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(Append)