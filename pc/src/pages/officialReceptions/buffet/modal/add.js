import React, { Component } from 'react';
import { Modal, Form, Button, Input, TimePicker, DatePicker, Select, Radio, } from 'antd';
import moment from 'moment';
import store from '../store';
import { observer } from 'mobx-react';
import commonFormProps from '../../../../config/common-form';
import request from '../../../../helpers/request';

const TextArea = Input.TextArea;
const {RangePicker} = DatePicker;
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
        title='自助餐预定'
      >
        <Form>
          <FormItem {...commonFormProps} label='公务时间'>
            {
              getFieldDecorator('meal_date')(
                <RangePicker 请选择公务时间 />
              )
            }
          </FormItem>
          <FormItem {...commonFormProps} label='来访单位'>
            {
              getFieldDecorator('unit')(
                <Input placeholder='请输入业务内容' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='公务活动项目'>
            {
              getFieldDecorator('project')(
                <Input placeholder='请输入公务活动项目' />)
            }
          </FormItem>
          <FormItem {...commonFormProps} label='订餐信息'>
            <span>就餐日期,餐次,用餐人数，费用(如需开票请备注金额)----(注意：逗号必须使用用英文逗号,多条数据换行填写)--例(2018-01-01,早餐,12,250)注意：使用英文逗号！！多条数据换行填写</span>
            {
              getFieldDecorator('meals')(
                <TextArea placeholder='2018-01-01,早餐,12,250' />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { meals, project, meal_date, unit} = values;
    meals = meals.replace(/[\r\n]/g, 'A');
    let time_begin = meal_date[0].format('YYYY-MM-DD')
    let time_end = meal_date[1].format('YYYY-MM-DD')
    request({
      url: '/api/v1/buffet/save',
      method: 'POST',
      data: {
        meals: meals,
        time_begin,
        time_end,
        project,
        unit
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
    let { department, username, time_begin, time_end, status,  } = store;
    request({
      url: '/api/v1/buffet/list',
      method: 'GET',
      data: {
        department,
        username,
        status,
        time_begin: moment(time_begin).format('YYYY-MM-DD'),
        time_end: moment(time_end).format('YYYY-MM-DD'),
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