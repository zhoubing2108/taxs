import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select, Radio, Checkbox, InputNumber } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const selectProduct = ['公务接待', '会议', '培训', '党建活动', '离退休活动', '学会活动'];
const selectArea = ['金瑞酒店', '机关食堂'];
const { RangePicker } = DatePicker
const TextArea = Input.TextArea;

@observer
class Add extends Component {
  render() {
    let { props, form } = this.props;
    let { AddVisible, user_type } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.add() }}
        width='600px'
        title='酒店预定'
      >
        <Form>
          <FormItem {...commonFormProps} label='入住日期'>
            {
              getFieldDecorator('time_begin')(
                <DatePicker showTime format='YYYY-MM-DD HH点'/>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='退房日期'>
            {
              getFieldDecorator('time_end')(
                <DatePicker showTime format='YYYY-MM-DD HH点' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='来访单位'>
            {
              getFieldDecorator('unit')(
                <Input placeholder='请输入来访单位' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='拟入住酒店'>
            {
              getFieldDecorator('hotel')(
                <Input placeholder='请输入酒店名称' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='单人房'>
            {
              getFieldDecorator('single_room')(
                <InputNumber placeholder='间数' style={{ width: 150 }} min={0} />
              )
            }
            <span style={{ marginLeft: 50 }}>双人房：</span>
            {
              getFieldDecorator('double_room')(
                <InputNumber placeholder='间数' style={{ width: 150 }} min={0} />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='男'>
            {
              getFieldDecorator('male')(
                <InputNumber placeholder='人数' style={{ width: 80 }} min={0} />
              )
            }
            <span style={{ marginLeft: 120 }}>女：</span>
            {
              getFieldDecorator('female')(
                <InputNumber placeholder='人数' style={{ width: 80 }} min={0} />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='人员名单'>
            {
              getFieldDecorator('members')(
                <TextArea placeholder='请输入人员名单' />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let {single_room, double_room, female, male, hotel, unit, members, time_begin, time_end  } = values;
    request({
      url: '/api/v1/hotel/save',
      method: 'POST',
      data: {
        single_room,
        double_room,
        female,
        male,
        hotel,
        unit,
        members,
        time_begin: time_begin.format('YYYY-MM-DD HH'),
        time_end: time_end.format('YYYY-MM-DD HH')
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.addParams.AddVisible = false;
        this.props.form.resetFields();
        this.fetchList(1)
      }
    })
  }
  fetchList = (page) => {
    let { department, username, time_begin, time_end, status, meal, meal_type } = store;
    request({
      url: '/api/v1/hotel/list',
      method: 'GET',
      data: {
        department,
        username,
        status,
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
        page: page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        let total = Number(res.total);
        store.total = total;
        store.current = res.current_page
      }
    })
  }
}

export default Form.create()(Add)