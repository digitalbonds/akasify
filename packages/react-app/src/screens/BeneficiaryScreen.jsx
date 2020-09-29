import React from 'react'
import { Layout } from 'antd'
import * as moment from 'moment'

const { Content, Footer } = Layout;

function BeneficiaryScreen() {

    return (
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
            <div>Hello</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Akasify ©{moment(new Date()).format('YYYY')} Created by Digital Bonds</Footer>
      </Layout>
    )
}

export default BeneficiaryScreen