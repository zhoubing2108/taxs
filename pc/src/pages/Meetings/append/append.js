import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';


const FormItem = Form.Item;
const Option = Select.Option;
const format = 'YYYY-MM-DD HH:mm';

@observer
class Append extends Component {
  render() {
    let { props, form } = this.props;
    let { AddVisible } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    return (
      <Modal visible={AddVisible}
        onCancel={() => { store.addParams.AddVisible = false }}
        onOk={() => { this.addMeeting() }}
        width='600px'
        title='新增会议'
        okText='创建'
      >
        <Form>
          <FormItem {...commonFormProps} label='日期'>
            {
              getFieldDecorator('meeting_date')(<DatePicker />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='签到地点'>
            {
              getFieldDecorator('address')(<Input />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='签到开始时间'>
            {
              getFieldDecorator('time_begin')(<DatePicker showTime format='YYYY-MM-DD HH:mm' placeholder='请选择日期和时间' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='签到截止时间'>
            {
              getFieldDecorator('time_end')(<DatePicker showTime format='YYYY-MM-DD HH:mm' placeholder='请选择日期和时间'  />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='会议开始时间'>
            {
              getFieldDecorator('meeting_begin')(<DatePicker showTime format='YYYY-MM-DD HH:mm' placeholder='请选择日期和时间' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='会议主题'>
            {
              getFieldDecorator('theme')(<Input />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='内容概要'>
            {
              getFieldDecorator('outline')(<Input />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='备注'>
            {
              getFieldDecorator('remark')(<Input />)
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  addMeeting = () => {
    let values = this.props.form.getFieldsValue();
    let { meeting_date, address, time_begin, time_end, meeting_begin, theme, outline, remark } = values;
    request({
      url: '/api/v1/meeting/save',
      method: 'POST',
      data: {
        outline,
        remark,
        address,
        theme,
        meeting_begin: meeting_begin.format(format),
        meeting_date: meeting_date.format('YYYY-MM-DD'),
        time_begin: time_begin.format(format),
        time_end: time_end.format(format)
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.addParams.AddVisible = false;
      }
    })
  }
}

export default Form.create()(Append)