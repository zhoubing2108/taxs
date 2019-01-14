import React, { Component, Fragment } from 'react';
import { Modal, Radio, Input, Form, Select, Upload, Icon, Button } from 'antd';
import { observer } from 'mobx-react';
import store from '../store';
import request from '../../../../../helpers/request';
import commonFormProps from '../../../../../config/common-form';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

const repair_man = [
  { name: '水电维修', value: 'a', },
  { name: '电器维修', value: 'b', },
  { name: '家具维修', value: 'c', },
  { name: '门窗维修', value: 'd', },
  { name: '电子设备维修', value: 'e', },
]

@observer
class Approval extends Component {

  render() {
    let { params, form } = this.props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    let { visible, loading } = params;
    let { info, dataSource, } = store;
    let { proDataSource } = info;
    let step_now = proDataSource.length;
    let wf_type = dataSource[0].wf_type;
    let address = dataSource[0].address;
    let name = dataSource[0].name;
    return (
      <Fragment>
        <Modal title='审批' visible={visible} width='500px' onCancel={this.handleCancel} onOk={this.handleOk} okText='确定' cancelText='取消' >
          {wf_type == 'repair_other_t' && step_now == 4 ? <Form>
            <FormItem {...commonFormProps} label='物品名称'><Input disabled value={name} /> </FormItem>
            <FormItem  {...commonFormProps} label='门牌位置'><Input disabled value={address} /> </FormItem>
            <FormItem {...commonFormProps} label='反馈说明'>
              {
                getFieldDecorator('feedback')(<TextArea rows={4} style={{ marginTop: 15 }} ></TextArea>)
              }
            </FormItem>
            <FormItem {...commonFormProps} label='反馈照片'>
              <Upload
                action='/api/v1/image/upload'
                listType='picture'
                onChange={({ fileList }) => { store.fileList = fileList }}
              >
                <Button><Icon type="upload" />上传图片</Button>
              </Upload>
            </FormItem>
            <div>
            </div>
          </Form> :
            (
              wf_type == 'repair_other_t' && step_now == 3 ? <Form>
                <div style={{ textAlign: 'center' }}>
                  <span>分配跟进人员：</span>
                  {
                    getFieldDecorator('type')(
                      <Select style={{ width: 200 }} placeholder='请选择跟进人员类别'>
                        {repair_man.map(e => <Option value={e.value}>{e.name}</Option>)}
                      </Select>
                    )
                  }
                </div>
              </Form> : 
              (
                  wf_type == 'repair_other_t' ? <Form>
                    <div style={{ textAlign: 'center' }}>
                      {
                        getFieldDecorator('submit_to_save')(
                          <RadioGroup name='submit_to_save'>
                            <Radio value='back' style={{ marginRight: 15 }}>不通过</Radio>
                            <Radio value='ok'>通过</Radio>
                          </RadioGroup>
                        )
                      }
                    </div>
                    <div style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <span style={{ lineHeight: 7 }} >审批意见：</span>
                      {
                        getFieldDecorator('check_con')(<TextArea rows={4} style={{ width: '60%', marginTop: 15 }} ></TextArea>)
                      }
                    </div>
                  </Form> : null
              )
            )
          }
          {
            wf_type == 'repair_machine_t' && step_now == 3 ? 
              <Form>
                <FormItem {...commonFormProps} label='物品名称'><Input disabled value={name} /> </FormItem>
                <FormItem  {...commonFormProps} label='门牌位置'><Input disabled value={address} /> </FormItem>
                <FormItem {...commonFormProps} label='反馈说明'>
                  {
                    getFieldDecorator('feedback')(<TextArea rows={4} style={{ marginTop: 15 }} ></TextArea>)
                  }
                </FormItem>
                <FormItem {...commonFormProps} label='反馈照片'>
                  <Upload
                    action='/api/v1/image/upload'
                    listType='picture'
                    onChange={({ fileList }) => { store.fileList = fileList }}
                  >
                    <Button><Icon type="upload" />上传图片</Button>
                  </Upload>
                </FormItem>
                <div>
                </div>
              </Form>
              : null
          }
          {
            wf_type == 'repair_machine_t' && step_now == 5 ? <Form>
              <FormItem {...commonFormProps} label='物品名称'><Input disabled value={name} /> </FormItem>
              <FormItem  {...commonFormProps} label='门牌位置'><Input disabled value={address} /> </FormItem>
              <FormItem {...commonFormProps} label='反馈说明'>
                {
                  getFieldDecorator('feedback')(<TextArea rows={4} style={{ marginTop: 15 }} ></TextArea>)
                }
              </FormItem>
              <FormItem {...commonFormProps} label='反馈照片'>
                <Upload
                  action='/api/v1/image/upload'
                  listType='picture'
                  onChange={({ fileList }) => { store.fileList = fileList }}
                >
                  <Button><Icon type="upload" />上传图片</Button>
                </Upload>
              </FormItem>
              <div>
              </div>
            </Form>
              : (
                wf_type == 'repair_machine_t'  && step_now !==3 ? <Form>
                  <div style={{ textAlign: 'center' }}>
                    {
                      getFieldDecorator('submit_to_save')(
                        <RadioGroup name='submit_to_save'>
                          <Radio value='back' style={{ marginRight: 15 }}>不通过</Radio>
                          <Radio value='ok'>通过</Radio>
                        </RadioGroup>
                      )
                    }
                  </div>
                  <div style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <span style={{ lineHeight: 7 }} >审批意见：</span>
                    {
                      getFieldDecorator('check_con')(<TextArea rows={4} style={{ width: '60%', marginTop: 15 }} ></TextArea>)
                    }
                  </div>
                </Form> : null
              )
          }
          {/* (
                 
                    <Form>
                      <div style={{ textAlign: 'center' }}>
                        {
                          getFieldDecorator('submit_to_save')(
                            <RadioGroup name='submit_to_save'>
                              <Radio value='back' style={{ marginRight: 15 }}>不通过</Radio>
                              <Radio value='ok'>通过</Radio>
                            </RadioGroup>
                          )
                        }
                      </div>
                      <div style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <span style={{ lineHeight: 7 }} >审批意见：</span>
                        {
                          getFieldDecorator('check_con')(<TextArea rows={4} style={{ width: '60%', marginTop: 15 }} ></TextArea>)
                        }
                      </div>
                    </Form>
                ) */}
        </Modal>
      </Fragment>
    )
  }

  handleCancel = () => {
    store.params.visible = false
  }

  handleOk = () => {
    store.imgs.clear();
    let { fileList } = store;
    fileList.forEach(e => {
      store.imgs.push(e.response.id)
    });
    let imgs = store.imgs.toString();
    let { props, wf_fid, wf_type } = this.props;
    let { info } = props;
    let { flow_id, run_id, flow_process, run_process, nexprocess, } = info;
    let step_now = store.info.proDataSource.length;
    let values = this.props.form.getFieldsValue();
    let { check_con, submit_to_save, feedback, type } = values;
    if (store.data.repair ===3 && wf_type == 'repair_machine_t' && step_now == 2 ) type = 'e';
    request({
      url: '/api/v1/flow/check/pass/repair',
      method: 'POST',
      data: {
        check_con,
        flow_id,
        run_id,
        flow_process,
        run_process,
        npid: nexprocess.id,
        wf_fid,
        submit_to_save,
        wf_type,
        repair: store.data.repair,
        type,
        feedback,
        imgs,
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: () => {
        store.params.visible = false;
        this.fetchList();
      },
      complete: (res) => {
      }
    })
  }
  fetchList = () => {
    let { props, wf_fid, wf_type } = this.props;
    var pro = [];
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_type: wf_type,
        wf_fid: wf_fid
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        store.data = res;
        store.info.log = res.info.log;
        store.info.preprocess = res.info.preprocess;
        store.info.proDataSource.clear();
        let step = Object.values(store.info.preprocess);
        store.info.log.forEach((e, index) => {
          pro.push(Object.assign({}, e, { 'step': step[index] }))
        });
        pro.shift();
        store.info.proDataSource = pro;
      },
    })
  }
}

export default Form.create()(Approval)