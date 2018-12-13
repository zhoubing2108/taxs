import React, { Component, Fragment } from 'react';
import { Modal, Radio, Input } from 'antd';
import { observer } from 'mobx-react';
import store from '../../store';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

@observer
class FnModal extends Component {
  state = {
    value: 1
  }

  render() {
    let { params } = this.props;
    let { visible, loading } = params
    return (
      <Fragment>
        <Modal title='审批' visible={visible} onCancel={this.handleCancel} onOk={this.handleOk} okText='确定' cancelText='取消'>
          <div style={{ textAlign: 'center' }}>
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio value={0} style={{ marginRight: 15 }}>不通过</Radio>
              <Radio value={1}>通过</Radio>
            </RadioGroup>
          </div>
          <div style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <span style={{ lineHeight: 7 }} >审批意见：</span>
            <TextArea rows={4} style={{ width: '60%', marginTop: 15 }} ></TextArea>
          </div>
        </Modal>
      </Fragment>
    )
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleCancel = () => {
    store.params.visible = false
  }

  handleOk = () => {
    store.params.visible = false
  }
}

export default FnModal