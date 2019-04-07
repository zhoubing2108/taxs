import React, { Fragment, Component } from 'react';
import { Modal, Form, Input, } from 'antd'
import { observer } from 'mobx-react';
import commonFormProps from '../../../../config/common-form';
import request from '../../../../helpers/request'
import store from '../store';
const FormItem = Form.Item;

@observer
class ModifyType extends Component {
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
  modify = () => {
    let values = this.props.form.getFieldsValue();
    let { name, code, order, remark } = values;
    request({
      url: '/api/v1/category/update',
      method: 'POST',
      data: {
        id:this.props.editItem.id,
        name,
        order,
        code,
        remark
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: () => {
        store.ModifyParams.ModifyVisible = false
        this.fetchList(1);
        this.props.form.resetFields();
      },
    })
  }
  render() {
    let { props, form, editItem } = this.props;
    let { ModifyVisible, user_type } = props;
    let { getFieldDecorator, } = form;
    let {code,name,order,remark} = editItem;
    return (
      <Modal
        title='编辑类别'
        visible={ModifyVisible}
        onOk={() => { this.modify() }}
        onCancel={() => { store.ModifyParams.ModifyVisible = false }}
      >
        <Form>
          <FormItem {...commonFormProps} label='类别名称'>
            {getFieldDecorator('name',{
              initialValue:name
            })(
              <Input placeholder='请填写类别名' />
            )}
          </FormItem>
          <FormItem {...commonFormProps} label='编号'>
            {getFieldDecorator('code',{
              initialValue:code
            })(
              <Input placeholder='请填写编号' />
            )}
          </FormItem>
          <FormItem {...commonFormProps} label='序号'>
            {getFieldDecorator('order',{
              initialValue:order
            })(
              <Input placeholder='请填写序号' />
            )}
          </FormItem>
          <FormItem {...commonFormProps} label='备注'>
            {getFieldDecorator('remark',{
              initialValue:remark
            })(
              <Input placeholder='请填写备注' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModifyType)