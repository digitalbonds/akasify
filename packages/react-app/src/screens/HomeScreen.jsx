import React from 'react'
import { Layout, Row, Typography, Col } from 'antd'
import { useTranslation } from 'react-i18next'
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
              <img src={akasifyCommunity} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%'}} alt='Join our community' />
              <Paragraph style={{textAlign: 'center', textJustify: 'inter-word'}}>{t('description')}</Paragraph>                
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Akasify {moment(new Date()).format('YYYY')} Created by Nestor Bonilla <br/> Digital Bonds</Footer>
    </Layout>
  )
}

export default LandingPage