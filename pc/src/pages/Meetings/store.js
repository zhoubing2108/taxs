import {observable} from 'mobx';
import moment from 'moment';

 class Store {
   @observable addParams = {
     AddVisible: false,
   }
   @observable modifyParams = {
     ModifyVisible: false
   }
   @observable alertDepartment = [];
   @observable meetingRooms = [];
   @observable selectedRoom = {};
   @observable roomName = '';
   @observable theme = '全部';
   @observable address = '全部';
   @observable host ='全部';
   @observable time_begin = moment().startOf('month');
   @observable time_end = moment();
   @observable dataSource = [];
   @observable editItem = {};
   @observable total = 10;
   @observable current = 1;
   @observable username = '全部'
   @observable department = '全部';
   @observable check_department = '全部';
   @observable check_time_end = moment();
   @observable check_time_begin = moment().startOf('month');
   @observable check_address = '全部';
   @observable check_theme = '全部';
   @observable check_dataSource = [];
   @observable check_total = 10;
   @observable check_current = 1;

   @observable currentEdit = {
    outline:'',
    remark:'',
    host:'',
    push:'',
    address:'',
    theme:'',
    card:'',
    meeting_begin: '',
    meeting_end: '',
    meeting_date: '',
    time_begin: '',
    time_end: ''
   }
  //  @observable currentDepartment = '全部';


        
 }

 export default new Store()