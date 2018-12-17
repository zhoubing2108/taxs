import {observable} from 'mobx';
import moment from 'moment';

 class Store {
   @observable addParams = {
     AddVisible: false,
   }
   @observable modifyParams = {
     ModifyVisible: false
   }
   @observable theme = '全部';
   @observable address = '全部';
   @observable time_begin = moment().startOf('month');
   @observable time_end = moment();
   @observable dataSource = [];
   @observable editItem = {};
   @observable username = '全部'
   @observable department = '全部';
   @observable check_time_end = moment();
   @observable check_time_begin = moment().startOf('month');
   @observable check_address = '全部';
   @observable check_theme = '全部';
   @observable check_dataSource = [];
 }

 export default new Store()