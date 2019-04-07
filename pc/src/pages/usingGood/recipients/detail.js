import React, { Component, Fragment } from 'react';
import { Modal, Table } from 'antd';
import store from './store';
import { observer } from 'mobx-react';

@observer
class GoodDetail extends Component {
  columns = [
    {
      title: '用品名称',
      dataIndex: 'sku_name'
    },
    {
      title: '规格型号',
      dataIndex: 'format'
    },
    {
      title: '借用数量',
      dataIndex: 'sku_count'
    },
    {
      title: '类别',
      dataIndex: 'category_name'
    },
  ]
  render() {
    let { props } = this.props;
    let { detailsArr } = store;
    let { visible } = props;
    return (
      <Fragment>
        <Modal visible={visible} title='物品信息' okType='default' footer={null} onCancel={() => store.details.visible = false}>
          <Table columns={this.columns} dataSource={detailsArr} rowKey='sku_id'>
          </Table>
        </Modal>
      </Fragment>
    )
  }
}

export default GoodDetail
