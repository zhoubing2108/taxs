import React, { Component, Fragment } from 'react';
import { Button, Table, Card } from 'antd';
import { observer } from 'mobx-react';
import store from './store';
import Activity from './ActivityModal/ActivityModal';
import {withRouter} from 'react-router-dom';
import request from '../../../../helpers/request';
import moment from 'moment';

const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '流程中',
  '2': '通过'
}

const proColumns = [
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

@observer
class ActProgress extends Component {
  columns = [
    {
      title: '日期',
      dataIndex: 'create_time'
    },
    {
      title: '申请人',
      dataIndex: 'username'
    },
    {
      title: '使用单位',
      dataIndex: 'unit'
    },
    {
      title: '使用时间',
      dataIndex: 'time_begin'
    },
    {
      title: '使用人数',
      dataIndex: 'user_count'
    },
    {
      title: '场地名称',
      dataIndex: 'space'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => (<span>{_status[text]}</span>)
    },
  ]
  render() {
    let { params, dataSource, info,data } = store;
    let {proDataSource} = info;
    let { history } = this.props;
    let { id } = this.props.match.params;
    let disabled = data.check === 1;
    return (
      <Fragment>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <Button style={{ marginRight: 15 }} onClick={()=>{history.goBack()}} >返回</Button>
            <Button type='primary' onClick={() => store.params.visible = true} disabled={!disabled} >审批</Button>
          </div>
          <div style={{ marginBottom: 60 }}>
            <Table title={() => <div style={{ textAlign: 'center' }}>基本信息</div>} dataSource={dataSource} columns={this.columns} bordered ></Table>
          </div>
          <div>
            <Table title={() => <div style={{ textAlign: 'center' }}>申请进度</div>} dataSource={proDataSource} columns={proColumns} bordered ></Table>
          </div>
        </Card>
        <Activity params={params} wf_fid={id} props={data} />
      </Fragment>
    )
  }
  componentDidMount(){
    this.fetchList();
  }
  fetchList = () => {
    let { id } = this.props.match.params;
    var pro = [];
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_type: 'space_recreational_t',
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
        pro.shift();
        store.info.proDataSource = pro;
      },
      complete: () => {
      }
    })
  }
}

export default withRouter(ActProgress);