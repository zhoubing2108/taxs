import React, { Component, Fragment } from 'react';
import { Button, Table, Card } from 'antd';
import { observer } from 'mobx-react';
import store from '../store';
import FnModal from './fnModal/fnModal'

const basicMsg = [
  {
    title: '日期',
    dataIndex: 'date'
  },
  {
    title: '申请人',
    dataIndex: 'name'
  },
  {
    title: '使用单位',
    dataIndex: 'company'
  },
  {
    title: '使用时间',
    dataIndex: 'useTime'
  },
  {
    title: '申请使用事由',
    dataIndex: 'reason'
  },
  {
    title: '场地名称',
    dataIndex: 'spaceName'
  },
  {
    title: '状态',
    dataIndex: 'status'
  }
]

const proColumns = [
  {
    title: '序号',
    dataIndex: 'num'
  },
  {
    title: '处理人',
    dataIndex: 'handler'
  },
  {
    title: '处理步骤',
    dataIndex: 'step'
  },
  {
    title: '送达时间',
    dataIndex: 'arriveTime'
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
    dataIndex: 'advices'
  }
]

@observer
class fnProgress extends Component {
  render() {
    let { params } = store;
    return (
      <Fragment>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <Button style={{ marginRight: 15 }} >返回</Button>
            <Button type='primary' onClick={() => this.onClick()}>审批</Button>
          </div>
          <div style={{ marginBottom: 60 }}>
            <Table title={() => <div style={{ textAlign: 'center' }}>基本信息</div>} columns={basicMsg} bordered ></Table>
          </div>
          <div>
            <Table title={() => <div style={{ textAlign: 'center' }}>申请进度</div>} columns={proColumns} bordered ></Table>
          </div>
        </Card>
        <FnModal params={params} />
      </Fragment>
    )
  }

  onClick = () => {
    store.params.visible = true;
  }
}

export default fnProgress