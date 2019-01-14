import React, { Component, Fragment } from 'react';
import { Modal, Radio, Input, Form, Select } from 'antd';
import { observer } from 'mobx-react';
import store from '../store';
import request from '../../../../helpers/request';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const carList = [
  { name: '粤J65036', info: '核载人数7' },
  { name: '粤J49635', info: '核载人数5' },
  { name: '粤J44406', info: '核载人数23' },
  { name: '粤J17088', info: '核载人数5' },
  { name: '粤J53728', info: '核载人数7' },
  { name: '粤J82033', info: '核载人数5' },
  { name: '粤J64973', info: '核载人数7' },
  { name: '粤J50562', info: '核载人数7' },
  { name: '粤J63543', info: '核载人数5' },
  { name: '粤J70855', info: '核载人数7' },
  { name: '粤JGS607', info: '核载人数5' },
  { name: '粤JGS617', info: '核载人数5' },
  { name: '粤JD7863', info: '核载人数5' },
  { name: '粤JD7868', info: '核载人数5' },
  { name: '粤J73739', info: '核载人数5' },
  { name: '粤J68291', info: '核载人数5' },
  { name: '粤J72309', info: '核载人数5' },
  { name: '粤J72335', info: '核载人数5' },
  { name: '粤J72355', info: '核载人数5' },
  { name: '粤J23681', info: '核载人数5' },
  { name: '粤J73052', info: '核载人数9' },
  { name: '粤J64282', info: '核载人数10' },
  { name: '粤J49565', info: '核载人数10' },
];
@observer
class Approval extends Component {

  render() {
    let { params, form } = this.props;
    let { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    let { visible, loading } = params;
    let role = localStorage.getItem('role');
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Fragment>
        <Modal title='审批' visible={visible} onCancel={this.handleCancel} onOk={this.handleOk} okText='确定' cancelText='取消'>
          {role != 37 && role != 34 ? <Form>
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
          </Form> : null}
          {role == 34 ?
            <Form>
              <div style={{ textAlign: 'center' }}>
                {
                  getFieldDecorator('arrange')(
                    <RadioGroup name='arrange'>
                      <Radio style={radioStyle} value='安排定向化保证车辆'>安排定向化保证车辆</Radio>
                      <Radio style={radioStyle} value='租赁社会化车辆'>租赁社会化车辆</Radio>
                      <Radio style={radioStyle} value={3}>不符合申请条件</Radio>
                    </RadioGroup>
                  )
                }</div>
            </Form>
            : null
          }
          {role == 37 ?
            <Form>
              <div style={{ textAlign: 'center' }}>
                {
                  getFieldDecorator('word1')(
                    <RadioGroup name='arCar'>
                      <Radio value={1}>公车</Radio>
                      <Radio value={2}>租车</Radio>
                    </RadioGroup>
                  )
                }
                <div style={{ marginTop: 10 }}>
                  <span>车辆:
                {
                      getFieldDecorator('word2')(
                        <Select style={{ width: 200 }}>
                          {carList.map(e => <Option value={e.name + e.info}>{e.name}{e.info}</Option>)}
                        </Select>
                      )
                    }
                  </span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <span>司机:
                {
                      getFieldDecorator('word3')(
                     <Input placeholder='请输入司机及手机号码'/>
                      )
                    }
                  </span>
                </div>
              </div>
            </Form>
            : null
          }
        </Modal>
      </Fragment>
    )
  }



  handleCancel = () => {
    store.params.visible = false
  }

  handleOk = () => {
    let { props, wf_fid } = this.props;
    let { info } = props;
    let { flow_id, run_id, flow_process, run_process, nexprocess } = info;
    let values = this.props.form.getFieldsValue();
    let { check_con, submit_to_save, arrange, word1, word2, word3 } = values;
    let role = localStorage.getItem('role');
    let type;
    let car_info;
    let driver;
    if (arrange == 3) {
      submit_to_save = 'back';
      check_con = '不符合申请条件';
    } else if (arrange) {
      submit_to_save = 'ok'
      check_con = arrange;
    }
    if (role == 37) {
      type = word1;
      car_info = word2;
      driver = word3;
      submit_to_save = 'ok';
      check_con = '';
    }
    request({
      url: '/api/v1/flow/check/pass',
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
        wf_type: 'car_t',
        type,
        car_info,
        driver
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: () => {
        store.params.visible = false;
        this.fetchList();
      },
      complete: (res) => {
        console.log(res);
      }
    })
  }
  fetchList = () => {
    let { wf_fid } = this.props;
    var pro = [];
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_type: 'car_t',
        wf_fid
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