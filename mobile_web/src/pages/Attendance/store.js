import { observable } from 'mobx';
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
import moment from 'moment';

const attendance_time = [
]
class Store {
    @observable theme = '';
    @observable address = '';
    @observable time_begin = now;
    @observable time_end = now;
    @observable listParams = {
        time_begin: moment().startOf('month'),
        time_end: moment(),
        access: '全部',
        username: '全部',
        department: '全部',
        status: 3,
    }
    @observable total = 5;
    @observable needTotal = 5;
    @observable dataSource = attendance_time;
    @observable needList = [];
    @observable current = 1;
    @observable needCurrent = 1;

}

export default new Store();