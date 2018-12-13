import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select, Radio, Checkbox } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
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
        title='文体活动场地申请'
      >
        <Form>
          <FormItem {...commonFormProps} label='申请部门'>
            {
              getFieldDecorator('unit')(
                <Input placeholder='请输入申请部门' style={{ width: '150px', marginRight: 10 }} />)
            }
            <span>陪餐人数:</span>
            {
              getFieldDecorator('meals_count')(
                <Input placeholder='请输入陪餐人数' style={{ width: '150px', marginRight: 10, marginLeft: 5 }} />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='接待时间'>
            {
              getFieldDecorator('apply_date')(
                <DatePicker  />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='公函字号'>
            {
              getFieldDecorator('letter_size')(
                <Input placeholder='请输入公函字号' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='公函标题'>
            {
              getFieldDecorator('letter_title')(
                <Input placeholder='请输入公函标题' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='接待对象'>
            <span>单位,姓名,职务----按以下格式输入（中国移动,张三,正式员工）<br/>注意：使用英文逗号！！多条数据换行填写</span>
            {
              getFieldDecorator('users')(
                <TextArea placeholder='中国移动,张三,正式员工' />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='接待明细'>
            <span>时间,项目内容,地点,费用----按以下格式输入（2018-12-01,内部员工培训,会议室,200） 注意：使用英文逗号！！多条数据换行填写</span>
            {
              getFieldDecorator('detail')(
                <TextArea placeholder='2018-12-01,内部员工培训,会议室,200' />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { unit, meals_count, detail, users, apply_date, letter_title, letter_size } = values;
    detail = detail.replace(/[\r\n]/g, 'A');
    users = users.replace(/[\r\n]/g, 'A');
    request({
      url: '/api/v1/meeting/place/save',
      method: 'POST',
      data: {
        apply_date: apply_date.format('YYYY-MM-DD'),
        meals_count,
        detail,
        users,
        letter_title, 
        letter_size
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