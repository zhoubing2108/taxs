import React, { Component, Fragment } from 'react';
import { Button, Table, Card, Steps } from 'antd';
import { observer } from 'mobx-react';
import Approval from './ApprovalModal/Modal';
import request from '../../../helpers/request';
import moment from 'moment';
import { withRouter } from "react-router-dom";
import store from './store';


const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '流程中',
  '2': '通过'
}

@observer
class EducationProgress extends Component {
  columns = [
    {
      title: '日期',
      dataIndex: 'create_time'
    },
    {
      title: '姓名',
      dataIndex: 'username'
    },
    {
      title: '使用单位',
      dataIndex: 'unit'
    },
    {
      title: '申请使用事由',
      dataIndex: 'reason'
    },
    {
      title: '场地名称',
      dataIndex: 'place'
    },
    {
      title: '场地用途',
      dataIndex: 'purpose'
    },
    {
      title: '开始时间',
      dataIndex: 'time_begin'
    },
    {
      title: '结束时间',
      dataIndex: 'time_end'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => (<span>{_status[text]}</span>)
    },
  ]
  proColumns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '处理人',
      dataIndex: 'user'
    },
    {
      title: '处理步骤',
      dataIndex: 'step'
    },
    {
      title: '送达时间',
      dataIndex: 'dateline',
      render: (text) => (<span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>)
    },
    {
      title: '处理时间',
      dataIndex: 'handleTime'
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
    let { id } = this.props.match.params;
    let { proDataSource } = info;
    let _check = data.check === 1;
    let _cancel = data._cancel === 1;
    let { history } = this.props;
    console.log(dataSource);
    return (
      <Fragment>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <Button style={{ marginRight: 15 }} onClick={() => { history.goBack() }}>返回</Button>
            {_cancel ? <Button style={{ marginRight: 15 }} onClick={() => { this.getDetail() }}>撤销</Button> : null}
            {_check ? <Button type='primary' onClick={() => store.params.visible = true}>审批</Button> : null}
          </div>
          <div style={{ marginBottom: 60 }}>
            <Table title={() => <div style={{ textAlign: 'center', fontSize: 20 }}>基本信息</div>} rowKey='id' columns={this.columns} dataSource={dataSource} bordered pagination={false} ></Table>
          </div>
          <div>
            <Table title={() => <div style={{ textAlign: 'center', fontSize: 20 }}>申请进度</div>} rowKey='id' columns={this.proColumns} dataSource={proDataSource} pagination={false} bordered ></Table>
          </div>
        </Card>
        <Approval params={params} props={data} wf_fid={id} />
      </Fragment>
    )
  }

  fetchList = () => {
    let { id } = this.props.match.params;
    var pro = [];
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_type: 'meetingplace_t',
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
          pro.push(Object.assign({}, e, { 'step': step[index] }))
        });
        // console.log(pro)
        pro.shift();
        // console.log(pro)
        store.info.proDataSource = pro;
      },
    })
  }
  getDetail = () => {
    let { id } = this.props.match.params;
    request({
      url: '/api/v1/meeting/place',
      method: 'GET',
      data: {
        id
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        console.log(res);
      }
    })
  }
}

export default withRouter(EducationProgress);