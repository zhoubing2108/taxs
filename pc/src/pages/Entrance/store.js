import { observable } from 'mobx';
import moment from 'moment';


class Store {
  @observable username = '全部';
  @observable department = '全部';
  @observable status = 3;
  @observable reason = '全部';
  @observable time_begin = moment().startOf('month');
  @observable time_end = moment();
  @observable access = '全部';
  @observable dataSource = [];
  @observable addParams = {
    AddVisible: false,
    user_type: '干部职工',
    access: 'A'
  }
}

export default new Store()