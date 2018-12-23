import { observable } from 'mobx';
import moment from 'moment';


class Store {
  @observable username = '全部';
  @observable department = '全部';
  @observable status = 3;
  @observable reason = '全部';
  @observable selectedReason = '';
  @observable time_begin = moment().startOf('month');
  @observable time_end = moment();
  @observable dataSource = [];
  @observable total = 10;
  @observable current = 1;
  @observable addParams = {
    AddVisible: false
  }
}

export default new Store()