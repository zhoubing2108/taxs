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
class MeetingPlaceProgress extends Component {
  columns = [
    {
      title: '日期',
      dataIndex: 'apply_date'
    },
    {
      title: '申请人',
      dataIndex: 'username'
    },
    {
      title: '部门',
      dataIndex: 'department'
    },
    {
      title: '来访单位',
      dataIndex: 'unit'
    },
    {
      title: '领队人姓名',
      dataIndex: 'leader'
    },
    {
      title: '级别',
      dataIndex: 'grade'
    },
    {
      title: '公务项目',
      dataIndex: 'project'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => (<span>{_status[text]}</span>)
    },
  ]
  detailColumns = [
    {
      title: '厅级人数',
      dataIndex: 'departmental',
      render: (text) => (<span>{text}人</span>)
    },
    {
      title: '处级人数',
      dataIndex: 'section',
      render: (text) => (<span>{text}人</span>)
    },
    {
      title: '处级以下人数',
      dataIndex: 'under_section',
      render: (text) => (<span>{text}人</span>)
    },
    {
      title: '男',
      dataIndex: 'male',
      render: (text) => (<span>{text}人</span>)
    },
    {
      title: '女',
      dataIndex: 'female',
      render: (text) => (<span>{text}人</span>)
    },
    {
      title: '会议人数',
      dataIndex: 'count',
      render: (text) => (<span>{text}人</span>)
    },
    {
      title: '使用会场',
      dataIndex: 'meeting_place'
    },
    {
      title: '会议时间',
      dataIndex: 'official_time'
    },
  ];
  meal_columns = [
    {
      title: '就餐日期',
      dataIndex: 'meal_date'
    },
    {
      title: '餐次',
      dataIndex: 'meal_type'
    },
    {
      title: '就餐人数',
      dataIndex: 'count'
    },
    {
      title: '就餐地点',
      dataIndex: 'address'
    },
    {
      title: '费用',
      dataIndex: 'money'
    }
  ];
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
    this.getDetail();
  }
  render() {
    let { params, data, dataSource, info } = store;
    let { id } = this.props.match.params;
    let { proDataSource, mealData } = info;
    let disabled = data.check === 1;
    let { history } = this.props;
    return (
      <Fragment>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <Button style={{ marginRight: 15 }} onClick={() => { history.goBack() }}>返回</Button>
            <Button type='primary' onClick={() => store.params.visible = true} disabled={!disabled}>审批</Button>
          </div>
          <div style={{ marginBottom: 60 }}>
            <Table style={{ marginBottom: -2 }} title={() => <div style={{ textAlign: 'center', fontSize: 20 }}>基本信息</div>} rowKey='id' columns={this.columns} dataSource={dataSource} bordered pagination={false} ></Table>
            <Table style={{ marginBottom: -2 }} title={() => <div style={{ textAlign: 'center', marginBottom: -10, marginTop: -10 }}>接待明细</div>} rowKey='id' columns={this.detailColumns} dataSource={dataSource} bordered pagination={false} ></Table>
            <Table title={() => <div style={{ textAlign: 'center', marginBottom: -10, marginTop: -10 }}>就餐信息</div>} rowKey='id' columns={this.meal_columns} dataSource={mealData} bordered pagination={false} ></Table>
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
        wf_type: 'meeting_recept_t',
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
    })
  }
  getDetail = () => {
    let { id } = this.props.match.params;
    request({
      url: '/api/v1/meeting/recept',
      method: 'GET',
      data: {
        id
      },
      success: (res) => {
        console.log(res);
        store.info.mealData = res.meals;
      }
    })
  }
}

export default withRouter(MeetingPlaceProgress);