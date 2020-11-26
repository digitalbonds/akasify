import React from 'react'
import { Button, Layout, Row, Typography, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import Faucet from '../../../../packages/react-app/src/components/Faucet'
import akasifyCommunity from '../assets/images/logo_with_phrase.png'
import * as moment from 'moment'

const { Content, Footer } = Layout;
const { Paragraph } = Typography

function LandingPage({
  localProvider,
  mainnetProvider,
  price
}) {

    const { t } = useTranslation()

    return (
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Row type="flex" align="middle">
              <Col span={12} offset={6} className='gutter-row'>
                <img src={akasifyCommunity} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '60%'}} alt='Join our community' />
                <Paragraph style={{textAlign: 'justify', textJustify: 'inter-word'}}>{t('description')}</Paragraph>
                <Row type="flex" align="middle" gutter={[16, 16]}>
                  <Col span={12} offset={6} className='gutter-row'>
                    <Button block type="primary" onClick={()=> window.open("https://docs.google.com/presentation/d/1BOSZX_r_qw9tSglhVz3pGjxtTPj88st9ytD0I6YFQmE/edit?usp=sharing", "_blank")}>Pitch</Button>
                  </Col>
                </Row>
                <Row type="flex" align="middle" gutter={[16, 16]}>
                  <Col span={12} offset={6} className='gutter-row'>
                    <Button block  onClick={()=> window.open("https://bit.ly/2P6LsyI", "_blank")}>Video</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          {/* {
            localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf("localhost")>=0 && !process.env.REACT_APP_PROVIDER && price > 1 ? (
              <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider}/>
            ) : (
              ""
            )
          } */}
        </Content>
        <Footer style={{ textAlign: 'center' }}>Akasify ©{moment(new Date()).format('YYYY')} Created by Digital Bonds</Footer>
      </Layout>
    )
}

export default LandingPage