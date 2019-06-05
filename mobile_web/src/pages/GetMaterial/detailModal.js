import React from 'react';
import { Modal, List, Button, WingBlank} from 'antd-mobile';
import request from '../../helpers/request';
import store from './store';
import style from './detailModal.css';
import { observer } from 'mobx-react';
@observer
  class DetailModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modal2: false,
      };
    }
    // componentWillMount(){
    //   let record_id = this.props.mydatasource_id
    //   this.getDetails(record_id);

    // }
    componentDidMount(){
      // console.log('传了',this.props.mydatasource_id);
      let record_id = this.props.mydatasource_id
      this.getDetails(record_id);
    }
    showModal = key => (e) => {
      e.preventDefault(); // 修复 Android 上点击穿透
      this.setState({
        [key]: true,
      });
      let record_id = this.props.mydatasource_id
      this.getDetails(record_id);
    }
    onClose = key => () => {
      this.setState({
        [key]: false,
      });
    }
    getDetails = (record) => {
      let id = record
      request({
        url: '/api/v1/sku/apply/detail',
        method: 'GET',
        data: {
          id,
          type: 'collar_use_t'
        },
        beforeSend: (xml) => {
          xml.setRequestHeader('token', localStorage.getItem('token'))
        },
        success: (res) => {
          store.detailsArr = res;
          // console.log('res呢',res)
        }
      })
    }
    render() {
      let datasource = store.detailsArr;
      // console.log('xiangxishuju',datasource)
      const TableList = () => (datasource.map(
        (item,index) => (
          <tr> 
          <td>{item.sku_name}</td> 
          <td>{item.format}</td> 
          <td>{item.sku_count}</td> 
          <td>{item.category_name}</td> 
          </tr>
        )
      )
      )
      return (
        <WingBlank>
          <Button onClick={this.showModal('modal2')}>查看</Button>
          {/* <a style={{color:'blue'}} onClick={this.showModal('modal2')}>查看</a> */}
          <Modal
            popup
            visible={this.state.modal2}
            onClose={this.onClose('modal2')}
            animationType="slide-up"
          >
          <List>
          <table className={style.table}> 
          <tr>
          <th className={style.spec}>用品名称</th> 
          <th className={style.spec}>规格型号</th> 
          <th className={style.spec}>借用数量</th> 
          <th className={style.spec}>类别</th>
          </tr> 
          <TableList />
          </table>
              <List.Item>
                <Button type="primary" onClick={this.onClose('modal2')}>收起</Button>
              </List.Item>
          </List>
          </Modal>
        </WingBlank>
      );
    }
  }
 export default DetailModal;