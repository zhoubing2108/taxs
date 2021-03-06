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
  @observable total = 10;
  @observable current = 1;
  @observable disabled_k = false;
  @observable disabled_d = false;
  @observable checkInputVal_k = '科室门牌号'
  @observable checkInputVal_d = '档案室门牌号(5、6楼)'
  @observable members = [];
}

export default new Store()