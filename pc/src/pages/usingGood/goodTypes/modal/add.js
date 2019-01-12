import React, { Fragment, Component } from 'react';
import { Modal, Form, Input, } from 'antd'
import { observer } from 'mobx-react';
import commonFormProps from '../../../../config/common-form';
import request from '../../../../helpers/request'
import store from '../store';
const FormItem = Form.Item;

@observer
class AddType extends Component {
  fetchList = (page) => {
    let { category, category_id, order_number } = store
    request({
      url: '/api/v1/category/list',
      method: 'GET',
      data: {
        category,
        order_number,
        category_id,
        page,
        size: 10,
      },
      success: (res) => {
        store.dataSource = res.data;
        store.total = res.total;
        store.current = res.current_page;
      }
    })
  }
  add = () => {
    let values = this.props.form.getFieldsValue();
    let { name, code, order, remark } = values;
    request({
      url: '/api/v1/category/save',
      method: 'POST',
      data: {
        name,
        order,
        code,
        remark
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: () => {
        store.addParams.AddVisible = false;
        this.fetchList(1);
        this.props.form.resetFields();
      },
    })
  }
  render() {
    let { props, form } = this.props;
    let { AddVisible, user_type } = props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    return (
      <Modal
        title='借用申请'
        visible={AddVisible}
        onOk={() => { this.add() }}
        onCancel={() => { store.addParams.AddVisible = false }}
      >
        <Form>
          <FormItem {...commonFormProps} label='类别名称'>
            {getFieldDecorator('name')(
              <Input placeholder='请填写类别名' />
            )}
          </FormItem>
          <FormItem {...commonFormProps} label='编号'>
            {getFieldDecorator('code')(
              <Input placeholder='请填写编号' />
            )}
          </FormItem>
          <FormItem {...commonFormProps} label='序号'>
            {getFieldDecorator('order')(
              <Input placeholder='请填写序号' />
            )}
          </FormItem>
          <FormItem {...commonFormProps} label='备注'>
            {getFieldDecorator('remark')(
              <Input placeholder='请填写备注' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddType)