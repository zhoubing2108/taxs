import React, { Component, Fragment } from 'react';
import { Modal, Carousel } from 'antd';
import store from './store';
import { observer } from 'mobx-react';
import './detail.css'
@observer
class ImagesDetail extends Component {
  render() {
    let { props } = this.props;
    let { detailsArr } = store;
    let { visible } = props;
    return (
      <Fragment>
        <Modal width='1300px' visible={visible} title='报修图片' okType='default' footer={null} onCancel={() => store.details.visible = false}>
        <Carousel>
        {detailsArr.map((item,index) => {return(
            <div style={{display:'table-cell',verticalAlign:'middle',alignItems:'center'}}>
            <img style={{width:'100%',height:'900px',padding:'30px 30px 30px 30px'}} src={item.img_url.url}/>
            </div>
        )})}
        </Carousel>
        </Modal>
      </Fragment>
    )
  }
}

export default ImagesDetail