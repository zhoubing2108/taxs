import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form'
import request from '../../../helpers/request';

const FormItem = Form.Item;

@observer
class Modify extends Component {
  render() {
    let { props, form } = this.props;
    let { ModifyVisible } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    return (
      <Modal visible={ModifyVisible}
        onCancel={() => { store.modifyParams.ModifyVisible = false }}
        width='600px'
        title='修改会议'
        okText='保存'
        onOk={()=>{this.edit()}}
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
              getFieldDecorator('time_end')(<DatePicker showTime format='YYYY-MM-DD HH:mm' placeholder='请选择日期和时间' />)
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
  edit = () => {
    let values = this.props.form.getFieldsValue();
    let editItem = this.props.editItem;
    let { id } = editItem;
    let { meeting_date, address, time_begin, time_end, meeting_begin, theme, outline, remark } = values;
    request({
      url:'/api/v1/meeting/update',
      method:'POST',
      data:{
        id,
        meeting_date:meeting_date.format('YYYY-MM-DD'),
        address,
        time_begin:time_begin.format('YYYY-MM-DD'),
        time_end:time_end.format('YYYY-MM-DD'),
        meeting_begin: meeting_begin.format('YYYY-MM-DD'),
        theme,
        outline,
        remark
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success:() => {
        store.addParams.AddVisible = false;
      }
    })
  }
}

export default Form.create()(Modify)