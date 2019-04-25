import { observable } from 'mobx';
import moment from 'moment';

class Store {
  @observable tabSelect = {
    selectedTab: 'blueTab'
  };
  @observable name = '';
  @observable address = '';
  @observable remark = '';
  @observable type = '';
  @observable imgs = [];
  @observable repair_type = '';
  @observable check_con = '';
  @observable RadioValue = 0;
  @observable deadline = new Date(Date.now());
  @observable userList = [];
  @observable total = 5;
  @observable needTotal = 5;
  @observable dataSource = []
  @observable needList = [];
  @observable current = 1;
  @observable needCurrent = 1;
  @observable check_con = '';
  @observable info = {};
  @observable myvisiable = false;
  @observable machineVisible = false;
  @observable modalData = [];
  @observable approvalList = [];
  @observable feedback = '';
}
export default new Store();