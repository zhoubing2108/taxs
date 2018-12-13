import { observable } from 'mobx';
import moment from 'moment';


class Store {
  @observable username = '全部';
  @observable department = '全部';
  @observable status = 3;
  @observable time_begin = moment().startOf('month');
  @observable time_end = moment();
  @observable dataSource = [];
}

export default new Store()