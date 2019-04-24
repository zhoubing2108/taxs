import {observable} from 'mobx';
import moment from 'moment';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class Store{
  @observable tabSelect = {
    selectedTab: 'blueTab'
  };
    @observable time_begin = now;
    @observable time_end = now;
    @observable unit = '';
    @observable project = '';
    @observable  meals = '';
    @observable RadioValue = 0;
    @observable deadline = new Date(Date.now());
    @observable userList = [];
    @observable total = 5;
    @observable needTotal = 5;
    @observable dataSource = []
    @observable needList = [];
    @observable current = 1;
    @observable needCurrent = 1;
  @observable info = {};
  @observable check_con = '';
    
}
export default new Store();