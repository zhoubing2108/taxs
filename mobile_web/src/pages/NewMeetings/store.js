import { observable } from 'mobx';
import moment from 'moment';
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);


class Store {
  @observable tabSelect = {
    selectedTab: 'blueTab'
  };
  @observable hostList = [];
  @observable roomList = [];
  @observable address = '';
  @observable host = '';
  @observable theme = '';
  @observable outline = '';
  @observable remark = '';
  @observable meeting_date = '';
  @observable time_begin = '';
  @observable time_end = '';
  @observable meeting_begin = '';
  @observable meeting_end = '';
  @observable info = {};
  @observable check_con = '';
  @observable total = 5;
  @observable needTotal = 5;
  @observable dataSource = []
  @observable needList = [];
  @observable current = 1;
  @observable needCurrent = 1;
}
export default new Store();