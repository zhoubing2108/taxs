import { observable } from 'mobx';
import moment from 'moment';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
class Store {
    @observable tabSelect = {
        selectedTab: 'blueTab'
    };
    @observable data = [];
    @observable dataleft = [];
    @observable apply_date = now;
    @observable time_begin = now;
    @observable time_end = now;
    @observable project = '';
    @observable unit = '';
    @observable leader = '';
    @observable post = '';
    @observable grade = '';
    @observable departmental = [''];
    @observable section = [''];
    @observable under_section = ['3'];
    @observable meeting_begin = ''
    @observable info = {};
    @observable check_con = '';
    @observable meeting_place = '';
    @observable meeting_date = '';
    @observable meeting_count = [''];
    @observable accompany_count = [''];
    @observable accompany = '';
    @observable letter_size = '';
    @observable letter_title = '';
    @observable users = '';
    @observable detail = '';
    @observable deadline = new Date(Date.now());
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