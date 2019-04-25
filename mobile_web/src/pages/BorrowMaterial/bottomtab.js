import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { TabBar } from 'antd-mobile';
import MyEntrance from './myMainEntrance';
import { observer } from 'mobx-react';
import st from './borrowmaterial.css';
import BorrowMaterial from './BorrowMaterial';
import store from './store';
import request from '../../helpers/request'

@observer
class Meeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedTab: 'blueTab',
      hidden: false,
      fullScreen: true,
    };
  }
  componentDidMount() {
    document.title = '物品借用'
  }
  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }} onClick={(e) => { e.preventDefault(); this.setState({ hidden: !this.state.hidden, }); }}>
          Click to show/hide tab-bar
        </a>
        <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }} onClick={(e) => { e.preventDefault(); this.setState({ fullScreen: !this.state.fullScreen, }); }}        >
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
            <BorrowMaterial />
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={st.mineSelectedIcon} />}
            selectedIcon={<div className={st.unMineSelectedIcon} />}
            title="我的"
            key="mine"
            selected={store.tabSelect.selectedTab === 'redTab'}
            onPress={() => { store.tabSelect.selectedTab = 'redTab';this.getNeedList();this.fetchList(1) }}
            data-seed="logId1"
          >
            <MyEntrance />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
  getNeedList = () => {
    request({
      url: '/api/v1/flow/ready',
      method: 'GET',
      data: {
        wf_type: 'borrow_t',
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
        wf_type: 'borrow_t',
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
}

export default withRouter(Meeting);