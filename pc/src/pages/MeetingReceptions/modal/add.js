import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select, Radio, Checkbox, InputNumber  } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../config/common-form';
import request from '../../../helpers/request';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const selectProduct = ['公务接待', '会议', '培训', '党建活动', '离退休活动', '学会活动'];
const selectArea = ['金瑞酒店', '机关食堂'];
const { RangePicker } = DatePicker;

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
          <FormItem {...commonFormProps} label='公务时间'>
            {
              getFieldDecorator('date_time')(
                <RangePicker />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='来访单位'>
            {
              getFieldDecorator('unit')(
                <Input placeholder='请输入来访单位' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='领队人'>
            {
              getFieldDecorator('leader')(
                <Input style={{ width: 100, marginRight: 10 }} />)
            }
            <span>职务：</span>
            {
              getFieldDecorator('post')(
                <Input style={{ width: 100, marginRight: 10 }} />)
            }
            <span>级别：</span>
            {
              getFieldDecorator('grade')(
                <Input style={{ width: 105 }} />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='厅级人数'>
            {
              getFieldDecorator('departmental')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />)
            }
            <span>处级人数：</span>
            {
              getFieldDecorator('section')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />)
            }
            <span>处级以下人数：</span>
            {
              getFieldDecorator('under_section')(
                <InputNumber style={{ width: 100 }} placeholder='人数' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='男'>
            {
              getFieldDecorator('male')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />)
            }
            <span>女：</span>
            {
              getFieldDecorator('female')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />)
            }
            <span>拟住酒店：</span>
            {
              getFieldDecorator('hotel')(
                <Input style={{ width: 175 }} placeholder='酒店名称' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='使用会场'>
            {
              getFieldDecorator('meeting_place')(
                <Input style={{ width: 130, marginRight: 10 }} placeholder='会场名称' />)
            }
            <span>会议时间：</span>
            {
              getFieldDecorator('meeting_date')(
                <DatePicker format='YYYY-MM-DD HH:mm:ss' showTime placeholder='请选择日期时间' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='会议人数'>
            {
              getFieldDecorator('meeting_count')(
                <InputNumber style={{ width: 60, marginRight: 10 }} placeholder='人数' />
              )
            }
            <span>陪同人员名单：</span>
            {
              getFieldDecorator('accompany')(
                <Input style={{ width: 245 }} />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='公务活动项目'>
            {
              getFieldDecorator('project')(
                <Input />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='订餐信息'>
            <span>就餐日期,餐次,用餐人数,就餐地点,费用----(注意：逗号必须使用用英文逗号,多条数据换行填写)--例(2018-01-01,早餐,12,食堂,250) </span>
            {
              getFieldDecorator('meals')(
                <TextArea placeholder='2018-01-01,早餐,12,食堂,250' rows={3} />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { date_time, meeting_date, unit, post, leader, grade, departmental, section, under_section, male, female, meeting_place, hotel, accompany, meals, project, meeting_count } = values;
    let apply_date = moment().format('YYYY-MM-DD');
    meeting_date = meeting_date.format('YYYY-MM-DD HH:mm:ss');
    let time_begin = date_time[0].format('YYYY-MM-DD');
    let time_end = date_time[1].format('YYYY-MM-DD');
    meals = meals.replace(/[\r\n]/g, 'A');
    request({
      url: '/api/v1/meeting/recept/save',
      method: 'POST',
      data: {
        meeting_date,
        apply_date,
        time_begin,
        time_end,
        unit,
        post,
        leader,
        grade,
        departmental,
        section,
        under_section,
        male,
        female,
        meeting_place,
        hotel,
        accompany,
        meals,
        project,
        meeting_count
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