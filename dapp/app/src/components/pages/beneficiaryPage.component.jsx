import React, { useState, useEffect } from 'react'
import { Layout, Row, Typography, Col, Tabs } from 'antd';
import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useTranslation } from 'react-i18next'
import StyledComponents from './styles'
//import SignUp from '../signUp/signUp.component'
//import Sider from '../layout/sider'
//import AccountSettings from '../accountSettings'
//import PathwaySettings from '../pathwaySettings'

const { TabPane } = Tabs;

const { StyledContent, Header, ButtonsWrapper, StyledButton, Image, StyledColLeft, StyledColRight, RegisterWrapper } = StyledComponents
const { Title, Paragraph } = Typography

const { useDrizzle } = drizzleReactHooks

function BeneficiaryPage() {

    const { drizzle } = useDrizzle()
    const [balance, setBalance] = useState()
    const { t } = useTranslation()
    const content = ''

    // const getContent = (content) => {
    //   if (content === 'settings') {
    //     return (
    //       <div>
    //         <Title>
    //           Configure your account
    //         </Title>
    //         <Paragraph>
    //           Here you can configure the basic details of your account.
    //         </Paragraph>
    //         {/* <AccountSettings /> */}
    //         <Title>
    //           Configure your token economy
    //         </Title>
    //         <Paragraph>
    //           In order to enable transactions between your employees you need to configure the available pathways from your economy. This pathways will determinate how many tokens will be transfered to each employee.
    //         </Paragraph>
    //         {/* <PathwaySettings /> */}
    //       </div>
    //     )
    //   }
  
    //   return (
    //     <div>
    //       <Title>
    //         Welcome to your dashboard
    //       </Title>
    //       <Paragraph>
    //         This is the dashboard of the company. Through it you have the opportunity to transfer your company's tokens so that your workers can make good collaborations public.
    //       </Paragraph>
    //       <Tabs defaultActiveKey="1">
    //         <TabPane tab="Registered Employees" key="1">
    //           {/* <Employees /> */}
    //         </TabPane>
    //         <TabPane tab="Transactions" key="2">
    //           {/* <Transactions /> */}
    //         </TabPane>
    //       </Tabs>
    //     </div>
    //   )
    // }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* <Sider selectedSiderItem={content === 'settings' ? 'settings' : 'home'}/> */}
        <Layout className="site-layout">

          <StyledContent>
            <Row gutter={50}>
              <Col className="gutter-row" span={16}>
                {/* {getContent(content)} */}asdfasdf
              </Col>
              <Col className="gutter-row" span={8}>
                {/* <RegisterWorkerCard />
                <TokenSuppliedCard />
                <WorkersCard /> */}
              </Col>         
            </Row>
          </StyledContent>
        </Layout>
      </Layout>
    );
}

export default BeneficiaryPage