import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Layout, Row, Typography, Col, Card, Avatar, Tabs, Result, Table, Carousel, Tooltip, Divider, Steps, Form, Input, Modal } from "antd";
import { CalendarOutlined, LoadingOutlined, TagOutlined, FileProtectOutlined, DatabaseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useContractLoader, useContractReader, useBalance, useEventListener, useExchangePrice } from "../hooks";
import { Transactor } from "../helpers";
import opportunityAvatar from "../assets/images/opportunity_avatar.png";
import * as moment from "moment";
import { BigNumber } from "@ethersproject/bignumber";
import oasisLogo from "../assets/images/oasis_logo.png";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Paragraph, Text } = Typography;
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

  //const [oppImage, setOppImage] = useState("");

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
  const [preAccomplishmentModalStep, setPreAccomplishmentModalStep] = useState(0);
  const [preAccomplishmentModalVisible, setPreAccomplishmentModalVisible] = useState(false);

  // SMART CONTRACT HOOKS
  const opportunity = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunityById", id.replace(":",""));
  //setOppImage(opportunity && opportunity[3]);
  console.log("opportunity data: ", opportunity && opportunity[3]);
  const application = useContractReader(readContracts, 'AkasifyCoreContract', "getApplication", [id.replace(":",""), address]);
  const preRequirements = useContractReader(readContracts, 'AkasifyCoreContract', "getPreRequirementsByOpportunityId", id.replace(":",""));
  //const postRequirements = useContractReader(readContracts, 'AkasifyCoreContract', "getPostRequirementsByOpportunityId", id.replace(":",""));  
  const preAccomplishments = useContractReader(readContracts, 'AkasifyCoreContract', 'getPreAccomplishmentsByApplicationId', [appId]);
  //const postAccomplishments = useContractReader(readContracts, 'AkasifyCoreContract', 'getPostAccomplishmentsByApplicationId', [appId]);  

  // SMART CONTRACT BROADCAST
  const setApplicationCreateEvents = useEventListener(readContracts, "AkasifyCoreContract", "RegisterApplication", localProvider, 1);
  const setPreAccomplishmentCreateEvents = useEventListener(readContracts, "AkasifyCoreContract", "RegisterApplicationPreAccomplishment", localProvider, 1);

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
  
  useEffect(() => {
    if (setApplicationCreateEvents) {
        setApplicationModalVisible(false);
    }
  }, [setApplicationCreateEvents]);

  useEffect(() => {
    if (setPreAccomplishmentCreateEvents && setPreAccomplishmentCreateEvents[0] && setPreAccomplishmentCreateEvents[0].id > 0) {
        setPreAccomplishmentModalStep(preAccomplishmentModalStep + 1);
        setPreAcValue("");
    }
  }, [setPreAccomplishmentCreateEvents]);

  // OASIS PARCEL
  const assignPermission = async () => {
    localStorage.setItem('akasify-oasis-previous', history.location.pathname);
    const permissionUrl = `${process.env.REACT_APP_PARCEL_STEWARD_URL}/${process.env.REACT_APP_PARCEL_APP_ID}/join?redirect_uri=${process.env.REACT_APP_PARCEL_CALLBACK_URL}`;
    window.open(permissionUrl);
  }

  const registerBeneficiary = async () => {
    localStorage.setItem('akasify-page-previous', history.location.pathname);
    window.location.assign("/register");
  };

  const currentPreRequirement = () => {
    if (preAccomplishments && preAccomplishments.length > 0 && preAccomplishments[0].length > 0) {
      if (BigNumber.from(preAccomplishments[1][preAccomplishments[1].length - 1]).toNumber()) {
        if (BigNumber.from(preAccomplishments[3][preAccomplishments[3].length - 1]).toNumber() == 1) {
          // PRE REQUIREMENT INITIATED
          return BigNumber.from(preAccomplishments[1][preAccomplishments[1].length - 1]).toNumber();
        } else {
          // PRE REQUIREMENT FINALIZED
          return BigNumber.from(preAccomplishments[1][preAccomplishments[1].length - 1]).toNumber() + 1;
        }
      }
    }
    return 0;
  }

  const uploadData = async () => {
    console.log("api token: ", localStorage.getItem('akasify-oasis-token'));
    const response = await fetch(`${process.env.REACT_APP_PARCEL_API_URL}/beneficiaries/createStep`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicationId: appId,
        opportunityId: appOpportunityId,
        value: preAcValue,
        beneficiaryAddress: localStorage.getItem('akasify-oasis-address')
      })
    }).then((res) => res.json());
    createPreAccomplishment(response.datasetAddress);
  }

  const createPreAccomplishment = async (datasetAddress) => {
    setPreAccomplishmentModalStep(preAccomplishmentModalStep + 1);
    console.log("dataset address: ", datasetAddress);
    // CREATING PRE ACCOMPLISHMENT WITH CONTENT ADDRESS FROM OASIS
    tx(writeContracts.AkasifyCoreContract.createPreAccomplishment(appId, datasetAddress));
  }

  // FORM ACTIONS
  const onApplicationCreate =() => {
    tx( writeContracts.AkasifyCoreContract.createApplication(id.replace(":","")) );
  }

  const onPreAccomplishmentCreate = () => {
    if (localStorage.getItem('akasify-oasis-address') == "" && localStorage.getItem('akasify-oasis-token') == "") {
      setOasisModalVisible(true);
    } else {
      setPreAccomplishmentModalStep(0);
      setPreAccomplishmentModalVisible(true);

      // UPLOADING DATA TO OASIS
      uploadData();
    }
  }

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
      dataIndex: 'tags'
    }
  ];
  
  const preAccomplishmentData = () => {
    let data = [];    
    if (preAccomplishments) {
      for (let i = 0; i < preAccomplishments[0].length; i++) {
        let aT = "";
        if (BigNumber.from(preAccomplishments[3][i]).toNumber() == 1) {
          aT = "step initiated automatically by smart contract";
        } else {
          aT = preAccomplishments[4][i];
        }
        data.push(
            {
                id: BigNumber.from(preAccomplishments[0][i]).toNumber(),
                key: BigNumber.from(preAccomplishments[0][i]).toNumber(),
                tags: BigNumber.from(preAccomplishments[3][i]).toNumber() == 1 ? "started" : "finished",
                value: preAccomplishments[4][i],
                name: aT
            }
        );
      }
    }
    return data;
};

  const contentStyle = {
    width: "100%",
    height: "300px",
    objectFit: "cover",

    // maxWidth: "100%",
    // height: "300px",
    // display: "block",
    // marginLeft: "auto",
    // marginRight: "auto",
    // overflow: "hidden",

    // width: "100%",
    // height: "300px",
    // overflow: "hidden",
    // backgroundSize: "cover",
    // backgroundPosition: "center center"
  };

  return (
    <Layout className="site-layout">
      { role === "beneficiary" && application && appLastUpdate > 0 && appStatus == 3 &&
        <Result
          status={ "success" }
          title={ "Congratulations" }
          subTitle={ "Your application has been approved! The organization will contact you shortly." }
        >
        </Result>
      }
      { role === "beneficiary" && application && appLastUpdate > 0 && appStatus == 4 &&
        <Result
          status={ "error" }
          title={ "Sorry" }
          subTitle={ "You application wasn't selected this time." }
        >
        </Result>
      }
      <Card
        style={{ width: '100%' }}
        cover={
          <Carousel>
            <div key={1}>
              <img
                style={contentStyle}
                src={`https://${opportunity ? opportunity[3] : ""}.${process.env.REACT_APP_INFURA_GATEWAY}`} />            
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
                <Col span={4}>
                  <Tooltip placement="left" title="deadline">
                    Pre requirement deadline:
                  </Tooltip>
                </Col>
                <Col span={20}>
                  {opportunity && moment.unix(opportunity[4]).format(process.env.REACT_APP_DATE_FORMAT)}
                </Col>
              </Row>
              <Row justify="space-between" style={{marginBottom: "8px"}}>
                <Col span={4}>
                  <Tooltip placement="left" title="deadline">
                    Post requirement deadline:
                  </Tooltip>
                </Col>
                <Col span={20}>
                  {opportunity && moment.unix(opportunity[5]).format(process.env.REACT_APP_DATE_FORMAT)}
                </Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col span={24}>{opportunity && opportunity[2]}</Col>
              </Row>
              <Divider />
              <Row justify="center">
                <Col span={12}>                  
                  { role === "beneficiary" && <Button
                      type="primary"
                      block
                      disabled={appLastUpdate > 0 ? true : false}
                      onClick={()=>{
                        setApplicationModalVisible(true)
                      }}>Apply</Button>}
                  { role === "visitor" && <Button
                      type="primary"
                      style={{marginTop: '15px'}}
                      block
                      onClick={() => { registerBeneficiary() }}>Register as beneficiary</Button>
                  }
                  { role === "beneficiary" && appStatus === 2 && <Button
                      type="primary"
                      style={{marginTop: '15px'}}
                      block
                      onClick={() => { setOasisModalVisible(true) }}>Verify Privacy Policy</Button>
                  }
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
              <Steps direction="vertical" current={currentPreRequirement()}>
                {preRequirementData().map(preRequirement => {
                  return (<Step key={preRequirement.id} title={preRequirement.name} />)
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
                        autoSize={{ minRows: 10, maxRows: 20 }}
                        disabled={ appStatus === 1 ? false : true }
                        value={preAcValue}
                        onChange={e => setPreAcValue(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Row gutter={[100, 16]}>
                        <Col span={1}>
                            <Button type="primary" htmlType="submit" disabled={ appStatus === 1 ? false : true }>Save</Button>
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
        title="Privacy Policy"
        visible={oasisModalVisible}
        okText={"Verify"}
        onOk={assignPermission}
        onCancel={ () => { setOasisModalVisible(false) } }
      >
        <img src={oasisLogo} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '25px', width: '50%'}} alt='Oasis Labs' />
        <Paragraph>
          In Akasify, you are the sole owner of your data. Because of that, you need to give permission the organization to read your application data.
        </Paragraph>
        <Paragraph>Remember you can grant and revoke access at any time, but please, remember an invalid permission during reviewing application may result in a rejection.</Paragraph>
      </Modal>
      <Modal
        title="Pre Accomplishment"
        visible={preAccomplishmentModalVisible}        
        onOk={ () => { setPreAccomplishmentModalVisible(false) } }
        onCancel={ () => { setPreAccomplishmentModalVisible(false) } }
      >
        <Steps direction="vertical" current={preAccomplishmentModalStep}>
          <Step title={"Securing"} description={"Your data is being encrypted with you as the only owner."} icon={ preAccomplishmentModalStep == 0 ? <LoadingOutlined /> : <FileProtectOutlined /> }/>
          <Step title={"Storing"} description={"The encrypted data is being stored on the blockchain."} icon={ preAccomplishmentModalStep == 1 ?<LoadingOutlined /> : <DatabaseOutlined /> } />
          <Step title={"Completed"} description={"The pre accomplishment has been stored securely."} icon={ <CheckCircleOutlined /> } />
        </Steps>
      </Modal>
    </Layout>
  )
}

export default OpportunityDetailScreen;