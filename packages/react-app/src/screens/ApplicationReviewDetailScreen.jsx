import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Layout, Row, Typography, Col, Card, Tabs, Table, Tooltip, Steps, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { useContractLoader, useContractReader, useEventListener } from "../hooks";
import { Transactor } from "../helpers";
import * as moment from "moment";
import { BigNumber } from "@ethersproject/bignumber";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Paragraph } = Typography;
const { Step } = Steps;

function ApplicationReviewDetailScreen({
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
  const parcelUrlAPI = "http://localhost:5000";
  const dateFormat = 'MM/DD/YYYY';

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

  // BENEFICIARY
  const [benId, setBenId] = useState(0);
  const [benAccount, setBenAccount] = useState("");
  const [benOasisAddress, setBenOasisAddress] = useState("");

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
  const application = useContractReader(readContracts, 'AkasifyCoreContract', "getApplication", [id.replace(":",""), address]);
  const beneficiary = useContractReader(readContracts, 'AkasifyCoreContract', "getBeneficiaryById", [appBeneficiaryId]);
  
  //console.log("application: ", application);
  const preRequirements = useContractReader(readContracts, 'AkasifyCoreContract', "getPreRequirementsByOpportunityId", id.replace(":",""));
  //console.log("pre requirements: ", preRequirements);
  //const postRequirements = useContractReader(readContracts, 'AkasifyCoreContract', "getPostRequirementsByOpportunityId", id.replace(":",""));  
  const preAccomplishments = useContractReader(readContracts, 'AkasifyCoreContract', 'getPreAccomplishmentsByApplicationId', [appId]);
  //console.log("pre accomplishments: ", preAccomplishments);
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
    if (beneficiary) {
        setBenId(BigNumber.from(beneficiary[0]).toNumber());
        setBenAccount(beneficiary[1]);
        setBenOasisAddress(beneficiary[2]);
    }
  }, [beneficiary]);
  
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

  const currentPreRequirement = () => {
    if (preAccomplishments && preAccomplishments.length > 0 && preAccomplishments[0].length > 0) {
      //console.log("step 2, ", preAccomplishments);
      if (BigNumber.from(preAccomplishments[1][preAccomplishments[1].length - 1]).toNumber()) {
        //console.log("step 3");
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

  // FORM ACTIONS

  const disclosureDataset = async (datasetAddress) => {      
      if (datasetAddress.length > 0) {
        setPreAcValue("Loading...");
        const response = await fetch(`${parcelUrlAPI}/organizations/getStep`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                datasetAddress: datasetAddress
            })
          }).then((res) => res.json())
          .catch((error) => "permission_denied");
          if (response === "permission_denied") {
            setPreAcValue("The dataset policy has been revoked, please contact the beneficiary.");
          } else {
            const secretData = JSON.parse(response.datasetData);
            setPreAcValue(secretData.data);  
          }
      }      
  }

  const approveOrReject = (decision) => {
    if (decision) {
        tx(writeContracts.AkasifyCoreContract.updateApplicationStatus(appId, 3));
    } else {
        tx(writeContracts.AkasifyCoreContract.updateApplicationStatus(appId, 4));
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
            name: preRequirements[3][i],
          }
        )
      }
    }
    return data;
};

  const accomplishmentColumns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>
    },
    {
      title: 'Detail',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Type',
      key: 'tags',
      dataIndex: 'tags'
    },
    {
        title: 'Action',
        key: 'action',
        dataIndex: 'action',
        render: (datasetAddress) => (
          <span>
                <Button
                    onClick={ () => { disclosureDataset(datasetAddress) } }
                >
                    Disclosure
                </Button>
          </span>
        ),
    }
  ];
  
  const preAccomplishmentData = () => {
    let data = [];    
    if (preAccomplishments) {
      for (let i = 0; i < preAccomplishments[0].length; i++) {
        let aT = "";
        let datasetAddress = "";
        if (BigNumber.from(preAccomplishments[3][i]).toNumber() == 1) {
            aT = "step initiated automatically by smart contract";
          } else {
            aT = preAccomplishments[4][i];
          }
        if (BigNumber.from(preAccomplishments[3][i]).toNumber() == 2) {
          datasetAddress = preAccomplishments[4][i];
        }
        data.push(
            {
                id: BigNumber.from(preAccomplishments[0][i]).toNumber(),
                key: BigNumber.from(preAccomplishments[0][i]).toNumber(),
                tags: BigNumber.from(preAccomplishments[3][i]).toNumber() == 1 ? "started" : "finished",
                value: preAccomplishments[4][i],
                name: aT,
                action: datasetAddress
            }
        );
      }
    }
    return data;
};

  const applicationStatusText = () => {
    let status = "";
    if (appStatus) {
        switch (appStatus) {
            case 1:
                status = "pre requirements started";
                break;
            case 2:
                status = "pre requirements finalized";
                break;
            case 3:
                status = "application approved";
                break;
            case 4:
                status = "application rejected";
                break;
            case 5:
                status = "post requirement started";
                break;
            case 6:
                status = "post requirement finalized";
                break;
            case 7:
                status = "application complete";
                break;
            case 8:
                status = "application incomplete";
                break;
            default:
                break;
        }
    }
    return status;
}

  return (
    <Layout className="site-layout">
      <Card
        style={{ width: '100%' }}
      >
        <Meta
          title={opportunity ? `Application ${id.replace(":","")}` : "Application none"}
          description={
            <div className="opportunity-detail-card">
              <Row justify="space-between" style={{marginBottom: "8px"}}>
                <Col span={4}>
                  <Tooltip placement="left" title="deadline">
                    Application initiated:
                  </Tooltip>
                </Col>
                <Col span={20}>
                  {application && moment.unix(application[3]).format(dateFormat)}
                </Col>
              </Row>
              <Row justify="space-between" style={{marginBottom: "8px"}}>
                <Col span={4}>
                  <Tooltip placement="left" title="deadline">
                    Last update:
                  </Tooltip>
                </Col>
                <Col span={20}>
                  {application && moment.unix(application[4]).format(dateFormat)}
                </Col>
              </Row>
              <Row justify="space-between" style={{marginBottom: "8px"}}>
                <Col span={4}>
                  <Tooltip placement="left" title="deadline">
                    Status:
                  </Tooltip>
                </Col>
                <Col span={20}>
                  {applicationStatusText() }
                </Col>
              </Row>              
              <Row justify="center" 
                    style={{marginTop: '15px'}}>
                <Col span={5}>
                    <Button
                        type="primary"
                        block
                        disabled={ appStatus == 3 ? true : false }
                        onClick={()=>{
                            approveOrReject(true)
                        }}>
                        Approve
                    </Button>
                </Col>
                <Col span={5} offset={2}>
                    <Button
                        type="primary"
                        block
                        disabled={ appStatus == 4 ? true : false }
                        onClick={() => {
                            approveOrReject(false)
                        }}>Reject</Button>
                  
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
                columns={accomplishmentColumns}
                dataSource={preAccomplishmentData()}
              />
              <Form
                  layout="vertical"
                  style={{marginTop: "12px"}}
                  form={preAccomplishmentForm}
              >
                <Form.Item
                    name="pre-accomplishment-value"
                    label="Encrypted value"
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
                        style={{fontSize: '20px'}}
                        disabled={ true }
                        value={preAcValue}
                        onChange={e => setPreAcValue(e.target.value)}
                    />
                </Form.Item>
              </Form>
            </Col>
          </Row>          
        </TabPane>
        <TabPane tab="Post requirements" key={2}>
          Content of Tab Pane post
        </TabPane>
      </Tabs>      
    </Layout>
  )
}

export default ApplicationReviewDetailScreen;