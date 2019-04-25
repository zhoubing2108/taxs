import React, { Component } from 'react';
import { List, Flex, InputItem, WhiteSpace, Radio, TextareaItem, Button } from 'antd-mobile';

import { Upload, Icon, Modal } from 'antd';
import store from './store';
import request from '../../helpers/request';
import { observer } from 'mobx-react';
const repair_types = [
	{
		label: '是',
		value: '1',
	},

	{
		label: '否',
		value: '2',
	},
];
@observer
class Repair extends Component {
	state = {
		previewVisible: false,
		previewImage: '',
		fileList: [],
	};

	handleCancel = () => this.setState({ previewVisible: false })

	handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}

	handleChange = ({ fileList }) => { this.setState({ fileList }) }


	handleData = (e) => {
		console.log(store);
		let { type, name, address, remark } = store;
		store.imgs.clear();
		let { fileList } = this.state;
		fileList.forEach((e) => {
			store.imgs.push(e.response.id)
		});
		let imgs = store.imgs.toString();

		request({
			url: '/api/v1/repair/save',
			method: 'POST',
			data: {
				type,
				name,
				address,
				remark,
				imgs
			},
			beforeSend: (xml) => {
				xml.setRequestHeader('token', sessionStorage.getItem('token'))
			},
			success: (res) => {
				alert('提交成功');
				store.tabSelect.selectedTab = 'redTab';
				this.getNeedList();
				this.fetchList(1);
			}
		})
	};
	getNeedList = () => {
		request({
			url: '/api/v1/flow/ready',
			method: 'GET',
			data: {
				wf_type: 'repair_t',
			},
			beforeSend: (xml) => {
				xml.setRequestHeader('token', sessionStorage.getItem('token'))
			},
			success: (res) => {
				store.needList = res;
			}
		})
	}

	fetchList = (page) => {
		request({
			url: '/api/v1/flow/complete',
			method: 'GET',
			data: {
				wf_type: 'repair_t',
				page: page,
				size: 10
			},
			beforeSend: (xml) => {
				xml.setRequestHeader('token', sessionStorage.getItem('token'))
			},
			success: (res) => {
				store.dataSource = res.data;
				store.total = res.last_page
			}
		})
	}
	render() {
		let { materialType, time_begin, materialMessages, type } = store;
		const { previewVisible, previewImage, fileList } = this.state;
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		);
		return (
			<div>
				<List className="calendar-list" style={{ backgroundColor: 'white' }}>
					<Flex style={{ padding: '15px', fontSize: 14, backgroundColor: 'white' }}>
						<Flex.Item>
							是否为电子设备：
                                </Flex.Item>
						<div style={{ height: '6px' }}></div>
						{repair_types.map((i) => (
							<Flex.Item key={i.value}>
								<div style={{ height: '11px' }}></div>
								<Radio className='my-radio' checked={store.type === i.value} onChange={(e) => { store.type = i.value }}>{i.label}</Radio>
								<WhiteSpace size="lg" />
							</Flex.Item>
						))}
					</Flex>
					<InputItem placeholder="请输入" onChange={(e) => { store.name = e }}>物品名称：</InputItem>
					<InputItem placeholder="请输入" onChange={(e) => { store.address = e }}>具体位置：</InputItem>
					<List>
						<TextareaItem
							title="详细描述："
							placeholder='请输入'
							rows={3}
							labelNumber={5}
							value={store.remark}
							onChange={e => { store.remark = e }}
						/>
					</List>
					<Upload
						action="/api/v1/image/upload"
						listType="text"
						fileList={fileList}
						onPreview={this.handlePreview}
						onChange={this.handleChange}
					>
						<Button type='primary'>上传图片</Button>
					</Upload>
					<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
						<img alt="example" style={{ width: '50%' }} src={previewImage} />
					</Modal>
				</List>
				<Button style={{ position: 'absolute', width: '100%', bottom: 0 }} type="primary" onClick={this.handleData}>确认报修</Button>
			</div>
		)
	}
}
export default Repair;