import React, { Component, Fragment } from 'react';
import { Card, Table, Button } from 'antd';
import { observer } from 'mobx-react';
import store from './store';
import request from '../../../helpers/request';
import moment from 'moment';
import Approval from './ApprovalModal/Modal';
import { withRouter } from 'react-router-dom';


const _status = {
  '-1': '不通过',
  '0': '审批中',
  '1': '流程中',
  '2': '通过'
}

const basicMsg = [
  {
    title: '日期',
    dataIndex: 'create_time'
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
    title: '联系人电话',
    dataIndex: 'phone'
  },
  {
    title: '人数',
    dataIndex: 'member'
  },
  {
    title: '桌数',
    dataIndex: 'table_number'
  },
  {
    title: '就餐地点',
    dataIndex: 'meal_space'
  },
  {
    title: '就餐日期',
    dataIndex: 'meal_date'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (text) => (<span>{_status[text]}</span>)
  }
]
const nextColumns = [
  {
    align: 'center',
    title: '项目',
    dataIndex: 'product'
  },
  {
    align: 'center',
    title: '业务内容',
    dataIndex: 'content'
  }
]

const thirdColumns = [
  {
    align: 'center',
    title: '餐次',
    dataIndex: 'meal_type'
  },
  {
    align: 'center',
    title: '餐类',
    dataIndex: 'meals_time'
  },
  {
    align: 'center',
    title: '菜式',
    dataIndex: 'cuisine'
  }
]
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
class DinningPg extends Component {
  componentDidMount() {
    this.fetchList();
    this.getDetail();
  }
  render() {
    let { params,data, info, dataSource } = store;
    let { id } = this.props.match.params;
    let {proDataSource, meals} = info;
    console.log(proDataSource);
    let { history } = this.props;
    let disabled = data.check === 1;
    return (
      <Fragment>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 15, }}>
            <Button style={{ marginRight: 15 }} onClick={() => { history.goBack() }} >返回</Button>
            <Button type='primary' onClick={() => store.params.visible = true} disabled={!disabled} >审批</Button>
          </div>
          <div style={{ marginBottom: 60 }}>
            <Table title={() => <div style={{ textAlign: 'center', fontSize: 20 }}>基本信息</div>} columns={basicMsg} dataSource={dataSource} pagination={false} bordered rowKey='id'></Table>
            <Table columns={nextColumns} bordered rowKey='id' dataSource={dataSource} pagination={false} ></Table>
            <Table columns={thirdColumns} bordered rowKey='id' dataSource={meals} pagination={false} ></Table>
          </div>
          <div>
            <Table title={() => <div style={{ textAlign: 'center', fontSize: 20 }}>申请进度</div>} columns={proColumns} dataSource={proDataSource} bordered rowKey='id' ></Table>
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
        wf_type: 'official_recept_t',
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
  getDetail = ()=> {
    let { id } = this.props.match.params;
    request({
      url:'/api/v1/official',
      method:'GET',
      data:{
        id
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res)=> {
        console.log(res);
        let meals_list = res.meals;
        let meals_time = res.meal_type;
        meals_list.forEach(e => {
          Object.assign(e,{meals_time});
        })
        console.log(meals_list);
        store.info.meals = meals_list;
      }
    })
  }
}

export default withRouter(DinningPg)