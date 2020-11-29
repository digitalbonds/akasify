import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Redirect } from "react-router-dom"
import { Button, Layout, Row, Typography, Col, Card, Avatar, Tabs, Tag, Table, Carousel, Tooltip, Badge, Divider, Steps, Form, Input, Modal } from 'antd'
import { EyeOutlined, CalendarOutlined, StarOutlined, TagOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next'
import { useContractLoader, useContractReader, useBalance, useEventListener, useExchangePrice } from "../hooks";
import { Transactor } from "../helpers";
import opportunityAvatar from '../assets/images/opportunity_avatar.png'
import * as moment from 'moment'
import { BigNumber } from '@ethersproject/bignumber'
import { parcelConfig } from '../helpers/parcelConfig';
import { OidcClient, Log } from 'oidc-client';
import oasisLogo from '../assets/images/oasis_logo.png';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Paragraph, Title } = Typography;
const { Step } = Steps;

function OpportunityDetailScreen({
  role,
  address,
  gasPrice,
  userProvider,
  localProvider,
  mainnetProvider
}) {

  let { id } = useParams();
  let history = useHistory();
  const { t } = useTranslation();

  const readContracts = useContractLoader(localProvider);
  const writeContracts = useContractLoader(userProvider);
  const tx = Transactor(userProvider, gasPrice)
  
  // APPLICATION
  const [appId, setAppId] = useState(0);
  const [appOpportunityId, setAppOpportunityId] = useState(0);
  const [appBeneficiaryId, setAppBeneficiaryId] = useState(0);
  const [appCreationDate, setAppCreationDate] = useState(0);
  const [appLastUpdate, setAppLastUpdate] = useState(0);
  const [appStatus, setAppStatus] = useState(0);

  // PRE ACCOMPLISHMENT
  const [preAcId, setPreAcId] = useState(0);
  const [preAcValue, setPreAcValue] = useState("");

  // POST ACCOMPLISHMENT
  const [postAcId, setPostAcId] = useState(0);
  const [postAcValue, setPostAcValue] = useState("");

  // FORM
  const [preAccomplishmentForm] = Form.useForm();
  const [postAccomplishmentForm] = Form.useForm();

  // MODAL
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);  
  const [oasisModalVisible, setOasisModalVisible] = useState(false);
  const [preRequirementModalVisible, setPreRequirementModalVisible] = useState(false);
  

  const opportunity = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunityById", id.replace(":",""));
  const application = useContractReader(readContracts, 'AkasifyCoreContract', "getApplication", [id.replace(":",""), address]);
  const preRequirements = useContractReader(readContracts, 'AkasifyCoreContract', "getPreRequirementsByOpportunityId", id.replace(":",""));
  //const postRequirements = useContractReader(readContracts, 'AkasifyCoreContract', "getPostRequirementsByOpportunityId", id.replace(":",""));  
  const preAccomplishments = useContractReader(readContracts, 'AkasifyCoreContract', 'getPreAccomplishmentsByApplicationId', [appId]);
  //const postAccomplishments = useContractReader(readContracts, 'AkasifyCoreContract', 'getPostAccomplishmentsByApplicationId', [appId]);

  useEffect(() => {
    if (application && application.length > 0 && appLastUpdate != BigNumber.from(application[4]).toNumber()) {
        setAppId(BigNumber.from(application[0]).toNumber());
        setAppOpportunityId(BigNumber.from(application[1]).toNumber());
        setAppBeneficiaryId(BigNumber.from(application[2]).toNumber());
        setAppCreationDate(BigNumber.from(application[3]).toNumber());
        setAppLastUpdate(BigNumber.from(application[4]).toNumber());
        setAppStatus(BigNumber.from(application[5]).toNumber());        
    }
  }, [application]);

  // OASIS PARCEL
  const oidcClient = new OidcClient(parcelConfig);
  const obtainIdToken = async () => {
    localStorage.setItem('akasify-oasis-previous', history.location.pathname);
    const request = await oidcClient.createSigninRequest();
    window.location.assign(request.url);
  };

  // FORM ACTIONS
  const onApplicationCreate =() => {
    tx( writeContracts.AkasifyCoreContract.createApplication(id.replace(":","")) );
  }
  const onPreAccomplishmentCreate = () => {
    if (localStorage.getItem('akasify-oasis-address') == "" && localStorage.getItem('akasify-oasis-token') == "") {
      console.log("calling oasis modal");
      setOasisModalVisible(true);
    } else {
      // OASIS SERVER CALL
      setPreAcValue("");

      // CREATING PRE ACCOMPLISHMENT WITH CONTENT ADDRESS FROM OASIS
      tx(writeContracts.AkasifyCoreContract.createPreAccomplishment(appId, preAcValue));
    }
};

  const preRequirementData = () => {
    let data = [];
    if (preRequirements && preRequirements.length > 0) {
      for (let i = 0; i < preRequirements[0].length; i++) {
        data.push(
          {
            id: BigNumber.from(preRequirements[0][i]).toNumber(),
            key: BigNumber.from(preRequirements[0][i]).toNumber(),
            type: BigNumber.from(preRequirements[1][i]).toNumber(),
            value: BigNumber.from(preRequirements[2][i]).toNumber(),
            name: preRequirements[3][i]
          }
        )
      }
    }
    return data;
};

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Detail',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      key: 'tags',
      dataIndex: 'tags',
      // render: tags => (
      //   <span>
      //     {tags.map(tag => {
      //       let color = tag.length > 5 ? 'geekblue' : 'green';
      //       //if (tag === 'loser') {
      //       //  color = 'volcano';
      //       //}
      //       return (
      //         <Tag color={color} key={tag}>
      //           {tag.toUpperCase()}
      //         </Tag>
      //       );
      //     })}
      //   </span>
      // ),
    }
  ];
  
  const preAccomplishmentData = () => {
    let data = [];

    //test to get data from oasis address
    
    //preAccomplishmentIds, preRequirementIds, preAccomplishDates, preAccomplishCategories, preAccomplishValues
    if (preAccomplishments) {
        for (let i = 0; i < preAccomplishments[0].length; i++) {
            data.push(
                {
                    id: BigNumber.from(preAccomplishments[0][i]).toNumber(),
                    key: BigNumber.from(preAccomplishments[0][i]).toNumber(),
                    type: "some",//BigNumber.from(preAccomplishments[2][i]).toNumber(),
                    value: "hey",//BigNumber.from(preAccomplishments[3][i]).toNumber(),
                    name: "yeap"//preAccomplishments[3][i]
                }
            )
        }
    }
    return data;
};

  const contentStyle = {
    height: '300px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  const tags = (data) => (
    data.map(tag => (
        <Tag key={tag}>{tag}</Tag>
    ))
  );

  return (
    <Layout className="site-layout">
      <Card
        style={{ width: '100%' }}
        cover={
          <Carousel autoplay>
            <div key={1}>
              <h3 style={contentStyle}>1</h3>
            </div>
            <div key={2}>
              <h3 style={contentStyle}>2</h3>
            </div>
          </Carousel>
        }
      >
        <Meta
          avatar={<Avatar src={opportunityAvatar} />}
          title={opportunity && opportunity[1]}
          description={
            <div className="opportunity-detail-card">
              <Row justify="space-between" style={{marginBottom: "8px"}}>
                <Col span={2}>
                  <Tooltip placement="left" title="deadline">
                    <CalendarOutlined />
                  </Tooltip>
                </Col>
                <Col span={22}>
                  {opportunity && moment.unix(opportunity[4]).format("MM-DD-YYYY")}
                </Col>
              </Row>
              <Row justify="space-between">
                <Col span={2}>
                  <Tooltip placement="left" title="tags">
                    <TagOutlined />
                  </Tooltip>
                </Col>
                {/* <Col span={22}>{tags(opportunityData.tags)}</Col> */}
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col span={24}>{opportunity && opportunity[2]}</Col>
              </Row>
              <Divider />
              <Row justify="center">
                <Col span={12}>
                  {role == "beneficiary" && <Button type="primary" style={{marginBottom: '15px'}} block onClick={()=>{
                    setApplicationModalVisible(true)
                  }} disabled={appLastUpdate > 0 ? true : false}>Apply</Button>}
                  {role == "visitor" && <Button type="primary" style={{marginBottom: '15px'}} block href="/register">Register as beneficiary</Button>}                  
                </Col>
              </Row>
            </div>
          }
        />
      </Card>
      <Tabs defaultActiveKey="1" centered={true}>
        <TabPane tab="Pre requirements" key={1}>
          <Row>
            <Col span={5}>              
              <Steps direction="vertical" current={1}>
                {preRequirementData().map(preRequirement => {
                  return (<Step title={preRequirement.name} />)                  
                })}
              </Steps>
            </Col>
            <Col span={18} offset={1}>
              <Table
                columns={columns}
                dataSource={preAccomplishmentData()}
              />
              <Form
                  layout="vertical"
                  style={{marginTop: "12px"}}
                  form={preAccomplishmentForm}
                  onFinish={onPreAccomplishmentCreate}
              >
                <Form.Item
                    name="pre-accomplishment-value"
                    label="Value"
                    valuePropName="pre-accomplishment-value"
                    // rules={[
                    //     {
                    //     required: true,
                    //     message: 'Please input the pre accomplishment value',
                    //     },
                    // ]}
                >
                    <TextArea
                        placeholder="value"
                        autoSize={{ minRows: 10, maxRows: 20 }}
                        disabled={ localStorage.getItem('akasify-oasis-address') == "" && localStorage.getItem('akasify-oasis-token') == "" ? true : false }
                        value={preAcValue}
                        onChange={e => setPreAcValue(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Row gutter={[100, 16]}>
                        <Col span={1}>
                            <Button type="primary" htmlType="submit">{
                              localStorage.getItem('akasify-oasis-address') == "" && localStorage.getItem('akasify-oasis-token') == "" ? "Sign Oasis" : "Save"
                            }</Button>
                        </Col>
                    </Row>
                </Form.Item>
              </Form>
            </Col>
          </Row>          
        </TabPane>
        <TabPane tab="Post requirements" key={2}>
          Content of Tab Pane post
        </TabPane>
      </Tabs>
      <Modal
        title="Application"
        visible={applicationModalVisible}
        onOk={onApplicationCreate}
        onCancel={ () => { setApplicationModalVisible(false) } }
      >
        <Paragraph>
          Are you sure you want to apply for this opportunity?
        </Paragraph>
        <Paragraph type={"secondary"}>Please remember, your commitment with this opportunity will be recorded and it could improve your chances on future opportunities.</Paragraph>
      </Modal>
      <Modal
        title="Data Privacy"
        visible={oasisModalVisible}
        onOk={obtainIdToken}
        onCancel={ () => { setOasisModalVisible(false) } }
      >
        <img src={oasisLogo} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '25px', width: '50%'}} alt='Oasis Labs' />
        <Paragraph>
          Here at Akasify, your privacy is very important to us. We've partned with
          Oasis Labs so you can own your application sensitive data from our app.
        </Paragraph>
        <Paragraph>To set up or Login your Oasis account, click Ok</Paragraph>
      </Modal>
      <Modal
        title="Pre Requirement"
        visible={preRequirementModalVisible}
        onOk={onPreAccomplishmentCreate}
        onCancel={ () => { setPreRequirementModalVisible(false) } }
      >
        <Paragraph>
          Here at Akasify, your privacy is very important to us. We've partned with
          Oasis Labs so you can own your application sensitive data from our app.
        </Paragraph>
        <Paragraph>To set up or Login your Oasis account, click Ok</Paragraph>
      </Modal>
    </Layout>
  )
}

export default OpportunityDetailScreen;