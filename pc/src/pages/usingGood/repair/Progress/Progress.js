import React, { Component, Fragment } from 'react';
import { Button, Table, Card, Modal, Badge } from 'antd';
import { observer } from 'mobx-react';
import Approval from './ApprovalModal/Modal';
import request from '../../../../helpers/request';
import moment from 'moment';
import { withRouter } from "react-router-dom";
import store from './store';

const confirm = Modal.confirm;
const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '流程中',
  '2': '通过'
}


@observer
class EntranceProgress extends Component {
  basicMsg = [
    {
      title: '日期',
      dataIndex: 'create_time'
    },
    {
      title: '报修人',
      dataIndex: 'username'
    },
    {
      title: '部门',
      dataIndex: 'department'
    },
    {
      title: '物品名称',
      dataIndex: 'name'
    },
    {
      title: '具体门牌位置',
      dataIndex: 'address'
    },
    {
      title: '详细描述',
      dataIndex: 'remark'
    },
    {
      title: '反馈说明',
      dataIndex: 'feedback'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text,record,index) => (record.check == 1 ? <span><Badge offset={[7,-5]} dot>{_status[text]}</Badge></span>
        :<span>{_status[text]}</span>)
    },
  ]

  proColumns = [
    {
      title: '序号',
      dataIndex: 'id'
    },
    {
      title: '处理人',
      dataIndex: 'user'
    },
    {
      title: '处理步骤',
      dataIndex: 'step',
      render: (text) => {
        var splits = text.split("(", 1).toString();
        return (
          <span>{splits}</span>
        )
      }
    },
    {
      title: '送达时间',
      dataIndex: 'dateline',
      render: (text) => (<span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>)
    },
    {
      title: '处理时间',
      dataIndex: 'handleTime',
    },
    {
      title: '耗时',
      dataIndex: 'waste'
    },
    {
      title: '处理意见',
      dataIndex: 'content'
    }
  ]

  componentDidMount() {
    this.fetchList();
  }
  render() {
    let { params, data, dataSource, info } = store;
    let { proDataSource } = info;
    let wf_type = dataSource[0].wf_type;
    let { id } = this.props.match.params;
    let _check = data.check === 1;
    let _cancel = data.cancel === 1;
    let { history } = this.props;
    return (
      <Fragment>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <Button style={{ marginRight: 15 }} onClick={() => { history.goBack() }}>返回</Button>
            {_cancel ? <Button style={{ marginRight: 15 }} onClick={() => { this.showDeleteConfirm() }}>撤销</Button> : null}
            {_check ? <Button type='primary' onClick={() => store.params.visible = true}>审批</Button> : null}
          </div>
          <div style={{ marginBottom: 60 }}>
            <Table title={() => <div style={{ textAlign: 'center', fontSize: 20 }}>基本信息</div>} rowKey='id' columns={this.basicMsg} dataSource={dataSource} bordered ></Table>
          </div>
          <div>
            <Table title={() => <div style={{ textAlign: 'center', fontSize: 20 }}>申请进度</div>} rowKey='id' columns={this.proColumns} dataSource={proDataSource} bordered ></Table>
          </div>
        </Card>
        <Approval params={params} props={data} wf_fid={id} wf_type={wf_type} />
      </Fragment>
    )
  }
  fetchList = () => {
    let { id } = this.props.match.params;
    let { dataSource } = store;
    var pro = [];
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_type: dataSource[0] ? dataSource[0].wf_type : '',
        wf_fid: id
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
          if (step[index]) {
            pro.push(Object.assign({}, e, { 'step': step[index] }))
          } else {
            pro.push(Object.assign({}, e, { 'step': '结束' }))
          }
        });
        pro.shift();
        store.info.proDataSource = pro;
      },
    })
  }

  cancel = () => {
    let { id } = this.props.match.params;
    let { data, dataSource } = store;
    let run_id = data.info.run_id;
    let { history } = this.props;
    request({
      url: '/api/v1/flow/check/pass',
      method: 'POST',
      data: {
        wf_fid: id,
        check_con: '',
        flow_id: '',
        run_id,
        flow_process: '',
        run_process: '',
        npid: '',
        submit_to_save: 'cancel',
        wf_type: dataSource[0] ? dataSource[0].wf_type : '',
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        history.push('/good/repair/')
      }
    })
  }
  showDeleteConfirm = () => {
    confirm({
      title: '是否撤销该申请',
      content: '撤销后将不可撤回',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        this.cancel();
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }


}

export default withRouter(EntranceProgress)