import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { TabBar } from 'antd-mobile';
import MyEntrance from './myMainEntrance';
import { observer } from 'mobx-react';
import st from './entrance.css';
import Order from './meeting_reception';
import store from './store';
import request from '../../helpers/request'

const tabs = [
  { title: '申请' },
  { title: '我的' },
];



@observer
class Meeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'blueTab',
      hidden: false,
      fullScreen: true,
    };
  }
  componentDidMount() {
    document.title = '围餐预定'
  }
  getNeedList = () => {
    request({
      url: '/api/v1/flow/ready',
      method: 'GET',
      data: {
        wf_type: 'meeting_recept_t',
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.needList = res;
      }
    })
  }
  fetchList = (page) => {
    request({
      url: '/api/v1/flow/complete',
      method: 'GET',
      data: {
        wf_type: 'meeting_recept_t',
        page: page,
        size: 10
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', sessionStorage.getItem('token'))
      },
      success: (res) => {
        store.dataSource = res.data;
        store.total = res.last_page
      }
    })

  }
  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          Click to show/hide tab-bar
        </a>
        <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              fullScreen: !this.state.fullScreen,
            });
          }}
        >
          Click to switch fullscreen
        </a>
      </div>
    );
  }

  render() {
    return (
      <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="申请"
            key="apply"
            icon={<div className={st.unSelectedIcon} />}
            selectedIcon={<div className={st.selectedIcon} />}
            selected={store.tabSelect.selectedTab === 'blueTab'}
            onPress={() => { store.tabSelect.selectedTab = 'blueTab'; }}
            data-seed="logId"
          >
            <Order />
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={st.mineSelectedIcon} />}
            selectedIcon={<div className={st.unMineSelectedIcon} />}
            title="我的"
            key="mine"
            selected={store.tabSelect.selectedTab === 'redTab'}
            onPress={() => {
              store.tabSelect.selectedTab = 'redTab';
              this.fetchList(1);
              this.getNeedList();
            }}
            data-seed="logId1"
          >
            <MyEntrance />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default withRouter(Meeting);