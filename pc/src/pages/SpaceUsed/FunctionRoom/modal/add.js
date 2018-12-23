import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select, Radio, Checkbox } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../../config/common-form';
import request from '../../../../helpers/request';

const FormItem = Form.Item;
const Option = Select.Option;
const format = 'HH:mm';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const spaceItem = ['多功能演播室','荷塘月色露台','职工书屋']

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
        title='多媒体室申请'
      >
        <Form>
          <FormItem {...commonFormProps} label='申请单位'>
            {
              getFieldDecorator('unit')(
                <Input placeholder='请输入申请单位' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='场地名称'>
            {
              getFieldDecorator('space')(
               <Select style={{width:250}} placeholder='请选择场地'>
                 {spaceItem.map( e => <Option key={e} value={e}>{e}</Option> )}
               </Select>
               )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='开始使用时间'>
            {
              getFieldDecorator('time_begin')(
                <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' placeholder='请选择日期时间' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='结束使用时间'>
            {
              getFieldDecorator('time_end')(
                <DatePicker format='YYYY-MM-DD HH:mm:ss' placeholder='请选择日期时间' showTime />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='使用事由'>
            {
              getFieldDecorator('reason')(<Input placeholder='请输入使用原因' />)
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { space, reason, unit, time_begin, time_end} = values;
    let format= 'YYYY-MM-DD HH:mm:ss';
    request({
      url: '/api/v1/multi/save',
      method: 'POST',
      data: {
        space,
        unit,
        reason,
        time_begin: time_begin.format(format),
        time_end: time_end.format(format),
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.addParams.AddVisible = false;
        this.fetchList(1)
      }
    })
  }
  fetchList = (page) => {
    let { department, time_begin, time_end, status, username, space } = store;
    request({
      url: '/api/v1/multi/list',
      method: 'GET',
      data: {
        department,
        username,
        status,
        space,
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
        page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.current = res.current;
        store.total = res.total;
      }
    })
  }
}

export default Form.create()(Add)