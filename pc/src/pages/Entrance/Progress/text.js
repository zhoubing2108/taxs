export default[ {
  "check": 1,
  "info": {
    "sing_st": 0,
    "flow_id": 2,
    "run_id": 12,
    "status": {
      "id": 12,
      "uid": 1,
      "run_id": 12,
      "run_flow": 2,
      "run_flow_process": 4,
      "parent_flow": 0,
      "parent_flow_process": 0,
      "run_child": 0,
      "remark": "",
      "is_receive_type": 0,
      "auto_person": 5,
      "sponsor_text": "局长,普通员工,机服中心,机服主管局长,机服负责人,管理员,车队,部门主管局长,部门主管领导,部门局领导,部门负责人",
      "sponsor_ids": "36,27,33,35,34,26,37,31,30,29,28",
      "is_sponsor": 0,
      "is_singpost": 0,
      "is_back": 0,
      "status": 0,
      "js_time": 1544516328,
      "bl_time": 0,
      "jj_time": 0,
      "is_del": 0,
      "updatetime": 0,
      "dateline": 1544516328
    },
    "flow_process": 4,
    "run_process": 12,
    "flow_name": "门禁权限",
    "process": {
      "id": 4,
      "process_name": "申请",
      "process_type": "is_one",
      "process_to": "5",
      "auto_person": 5,
      "auto_sponsor_ids": "",
      "auto_role_ids": "36,27,33,35,34,26,37,31,30,29,28",
      "auto_sponsor_text": "",
      "auto_role_text": "局长,普通员工,机服中心,机服主管局长,机服负责人,管理员,车队,部门主管局长,部门主管领导,部门局领导,部门负责人",
      "range_user_ids": "",
      "range_user_text": "",
      "is_sing": 1,
      "sign_look": 0,
      "is_back": 1,
      "todo": "局长,普通员工,机服中心,机服主管局长,机服负责人,管理员,车队,部门主管局长,部门主管领导,部门局领导,部门负责人"
    },
    "nexprocess": {
      "id": 5,
      "process_name": "部门负责人审核",
      "process_type": "is_step",
      "process_to": "6",
      "auto_person": 5,
      "auto_sponsor_ids": "",
      "auto_role_ids": "28",
      "auto_sponsor_text": "",
      "auto_role_text": "部门负责人",
      "range_user_ids": "",
      "range_user_text": "",
      "is_sing": 1,
      "sign_look": 0,
      "is_back": 1,
      "todo": "部门负责人"
    },
    "preprocess": [
      "退回制单人修改"
    ],
    "singuser": [
      {
        "id": 1,
        "username": "朱明良",
        "role": 1
      },
      {
        "id": 2,
        "username": "部门负责人",
        "role": 28
      },
      {
        "id": 3,
        "username": "机服中心",
        "role": 33
      },
      {
        "id": 4,
        "username": "机服中心负责人",
        "role": 34
      }
    ],
    "log": [
      {
        "id": 2,
        "uid": 1,
        "from_id": 22,
        "from_table": "access_control_t",
        "run_id": 12,
        "run_flow": 0,
        "content": "同意",
        "dateline": 1544516328,
        "btn": "Send",
        "art": "",
        "user": "朱明良"
      }
    ]
  }
}]