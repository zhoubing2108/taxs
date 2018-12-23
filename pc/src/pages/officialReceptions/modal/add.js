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
        title='围餐预定'
      >
        <Form>
          <FormItem {...commonFormProps} label='就餐日期'>
            {
              getFieldDecorator('meal_date')(
                <DatePicker />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='业务内容'>
            {
              getFieldDecorator('content')(
                <Input placeholder='请输入业务内容' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='联系人电话'>
            {
              getFieldDecorator('phone')(
                <Input placeholder='请输入联系人电话' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='承办项目'>
            {
              getFieldDecorator('product', { initialValue: `${selectProduct[0]}` })(
                <Select style={{ width: 130 }}>
                  {selectProduct.map(v => <Option value={v} key={v}>{v}</Option>)}
                </Select>
              )
            }
            <span style={{ marginLeft: 50 }}>餐饮地点：</span>
            {
              getFieldDecorator('meal_space', { initialValue: `${selectArea[0]}` })(
                <Select style={{ width: 160 }}>
                  {selectArea.map(v => <Option value={v} key={v}>{v}</Option>)}
                </Select>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='餐饮人数'>
            {
              getFieldDecorator('member')(
                <InputNumber placeholder='人数' style={{ width: 80 }} />
              )
            }
            <span style={{ marginLeft: 20 }}>陪同人数：</span>
            {
              getFieldDecorator('table_number')(
                <InputNumber placeholder='人数' style={{ width: 80 }} />
              )
            }
            <span style={{ marginLeft: 20 }}>桌数：</span>
            {
              getFieldDecorator('table_number')(
                <InputNumber placeholder='请输入桌数' style={{ width: 100 }} />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='餐类'>
            {
              getFieldDecorator('meal_type')(
                <RadioGroup>
                  <Radio value='工作餐'>工作餐</Radio>
                  <Radio value='会议餐'>会议餐</Radio>
                  <Radio value='培训餐'>培训餐</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='早餐'>
            {
              getFieldDecorator('breakfast')(
                <RadioGroup>
                  <Radio value='自助餐'>自助餐</Radio>
                  <Radio value='围餐'>围餐</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='午餐'>
            {
              getFieldDecorator('lunch')(
                <RadioGroup>
                  <Radio value='自助餐'>自助餐</Radio>
                  <Radio value='围餐'>围餐</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='晚餐'>
            {
              getFieldDecorator('dinner')(
                <RadioGroup>
                  <Radio value='自助餐'>自助餐</Radio>
                  <Radio value='围餐'>围餐</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { meal_type, breakfast, lunch, dinner, table_number, meal_space, product, content, meal_date, member, phone } = values;
    breakfast === undefined ? '' : breakfast;
    lunch === undefined ? '' : lunch;
    dinner === undefined ? '' : dinner;
    let meals = '早餐,' + breakfast + 'A午餐,' + lunch + 'A晚餐,' + dinner;
    request({
      url: '/api/v1/official/save',
      method: 'POST',
      data: {
        meal_type,
        table_number,
        meal_space,
        product,
        content,
        meal_date: meal_date.format('YYYY-MM-DD'),
        member,
        meals: meals,
        phone
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
      url: '/api/v1/official/list',
      method: 'GET',
      data: {
        department,
        username,
        status,
        meal,
        meal_type,
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