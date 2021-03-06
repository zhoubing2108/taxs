import { observable } from 'mobx';
import moment from 'moment';
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);


const texts = [
  {
    label: '文体活动场地',
    value: '文体活动场地',
  },
  {
    label: '功能室场地',
    value: '功能室场地',
  },
];
class Store {
  @observable tabSelect = {
    selectedTab: 'blueTab'
  };
  @observable data = [];
  @observable dataleft = [];
  @observable unit = '';
  @observable prespace_type = [];
  @observable space = '';
  @observable cols = 1;
  @observable asyncValue = ['文体活动场地'];
  @observable user_count = '';
  @observable reason = '';
  @observable time_begin = now;
  @observable time_end = now;
  @observable info = {};
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

}
export default new Store();