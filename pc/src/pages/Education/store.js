import { observable } from 'mobx';
import moment from 'moment';


class Store {
  @observable username = '全部';
  @observable department = '全部';
  @observable status = 3;
  @observable time_begin = moment().startOf('month');
  @observable time_end = moment();
  @observable dataSource = [];
  @observable username = '全部';
  @observable addParams = {
    AddVisible: false
  }
  @observable alertDepartment = [];
  @observable total = 10;
  @observable current = 1;
}

export default new Store()