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
const selectItem = [
  '1号气排球场',
  '2号气排球场',
  '1号羽毛球场',
  '2号羽毛球场',
  '1号网球场',
  '2号网球场',
  '1号乒乓球场',
  '2号乒乓球场',
  '1号健身室',
  '2号健身室',
  '1号棋牌室',
  '2号棋牌室',
  '英式台球',
  '美式台球',
  '健身舞室',
  '篮球',
]

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
        title='文体活动场地申请'
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
                <CheckboxGroup name='spaceGroup'>
                  {selectItem.map(v => <Checkbox value={v} key={v}>{v}</Checkbox>)}
                </CheckboxGroup>)
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
          <FormItem {...commonFormProps} label='使用人数'>
            {
              getFieldDecorator('user_count')(<Input placeholder='请输入使用人数' />)
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { space, user_count, unit, time_begin, time_end} = values;
    space = space.join(',');
    let format= 'YYYY-MM-DD';
    request({
      url: '/api/v1/recreational/save',
      method: 'POST',
      data: {
        space,
        unit,
        user_count,
        time_begin: time_begin.format(format),
        time_end: time_end.format(format),
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

export default Form.create()(Add)