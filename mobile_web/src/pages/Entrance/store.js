import { observable } from 'mobx';
import moment from 'moment';

class Store {
  @observable tabSelect = {
    selectedTab: 'blueTab'
  };
  @observable data = [];
  @observable dataleft = [];
  @observable RadioValue = 0;
  @observable total = 5;
  @observable totalleft = 5;
  @observable RadioValue = 0;
  @observable deadline = '';
  @observable userList = [];
  @observable total = 5;
  @observable needTotal = 5;
  @observable dataSource = []
  @observable needList = [];
  @observable current = 1;
  @observable needCurrent = 1;
  @observable info = {};
  @observable check_con = '';

  @observable isvisiable = true;
}

export default new Store();