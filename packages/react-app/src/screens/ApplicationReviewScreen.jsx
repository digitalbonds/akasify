import React, { useState, useEffect } from "react";
import { Row, Col, Table, Layout, Tabs, Typography, Form, Input, Button, DatePicker } from "antd";
import { useParams, useHistory, NavLink } from "react-router-dom";
import { useContractLoader, useContractReader } from "../hooks";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { BigNumber } from "@ethersproject/bignumber";
const { Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

function ApplicationReviewScreen ({
  address,
  gasPrice,
  userProvider,
  localProvider,
  mainnetProvider,
  tx
}) {

    let { id } = useParams();
    let history = useHistory();

    const readContracts = useContractLoader(localProvider);
    const writeContracts = useContractLoader(userProvider);

    const opportunity = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunityById", id.replace(":",""));
    const organization = useContractReader(readContracts, 'AkasifyCoreContract', "getOrganizationById", id.replace(":",""));
    const applications = useContractReader(readContracts, 'AkasifyCoreContract', "getApplicationsByOpportunityId", id.replace(":",""));
    
    const oppOrganization = () => {
        if (organization)
            return organization[1];
        return "";
    }

    useEffect(() => {
        if (opportunity && oppLastUpdate != BigNumber.from(opportunity[6]).toNumber()) {
            setOppId(BigNumber.from(opportunity[0]).toNumber());
            setOppName(opportunity[1]);
            setOppDescription(opportunity[2]);
            setOppImage(opportunity[3]);
            setOppPreRequirementDeadline(BigNumber.from(opportunity[4]).toNumber());
            setOppPostRequirementDeadline(BigNumber.from(opportunity[5]).toNumber());
            setOppCreationDate(BigNumber.from(opportunity[6]).toNumber());
            setOppLastUpdate(BigNumber.from(opportunity[7]).toNumber());
            setOppStatus(BigNumber.from(opportunity[8]).toNumber());
        }
    }, [opportunity]);

    const [oppForm] = Form.useForm();

    // OPPORTUNITY
    const [oppId, setOppId] = useState(0);
    const [oppOrganizationId, setOppOrganizationId] = useState(0);
    const [oppOrganizationName, setOppOrganizationName] = useState("");
    const [oppName, setOppName] = useState();
    const [oppDescription, setOppDescription] = useState("");
    const [oppImage, setOppImage] = useState("");
    const [oppPreRequirementDeadline, setOppPreRequirementDeadline] = useState(moment().unix());
    const [oppPosRequirementDeadline, setOppPostRequirementDeadline] = useState(moment().unix());    
    const [oppCreationDate, setOppCreationDate] = useState(moment().unix());
    const [oppLastUpdate, setOppLastUpdate] = useState(moment().unix());
    const [oppStatus, setOppStatus] = useState(0);

    // APPLICATION
    const [preRow, setPreRow] = useState(0);

    const statusText = () => {
        let status = "";
        if (oppStatus) {
            switch (oppStatus) {
                case 1:
                    status = "draft";
                    break;
                case 2:
                    status = "open to applications";
                    break;
                case 3:
                    status = "reviewing applications";
                    break;
                case 4:
                    status = "applications selected";
                    break;
                case 5:
                    status = "opportunity initiated";
                    break;
                case 6:
                    status = "opportunity finalized";
                    break;
                case 7:
                    status = "postRequirements concluded";
                    break;
                default:
                    break;
            }
        }
        return status;
    }

    const applicationColumns = [
        {
          title: 'No.',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: 'Beneficiary',
          dataIndex: 'beneficiary',
          key: 'beneficiary',
        },
        {
          title: 'Action',
          key: 'action',
          dataIndex: 'action',
          render: (applicationId) => (
            <span>
                <NavLink
                    disabled={ oppStatus == 3 ? false : true}
                    to={`/applicationdetail:${applicationId}`}>
                    <Button>
                        Review Application
                    </Button>                
                </NavLink>
            </span>
          ),
        }
    ];

    const applicationData = () => {
        let data = [];
        if (applications) {
            for (let i = 0; i < applications[0].length; i++) {
                data.push(
                    {
                        id: BigNumber.from(applications[0][i]).toNumber(),
                        key: BigNumber.from(applications[0][i]).toNumber(),
                        beneficiary: applications[1][i],
                        action: BigNumber.from(applications[0][i]).toNumber()
                    }
                )
            }
        }
        return data;
    };

    const onOppUpdateStatus = (e) => {
        e.preventDefault();
        tx(writeContracts.AkasifyCoreContract.updateOpportunityStatus(oppId, oppStatus + 1));
    };

    const onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys[0]);
        setPreRow(selectedRowKeys[0]);
        console.log('preRow: ', preRow);
        console.log('applications: ', applications);

        if (applications) {
            //setPreId(BigNumber.from(applications[0][preRow]).toNumber());
            //setPreType(2);
            //setPreValue(BigNumber.from(applications[2][preRow]).toNumber());            
            //setPreName(applications[3][preRow]);
        }        
    };

    return (
        <Layout className="site-layout">
            <Layout.Content>
                <Typography>
                    <Title level={3}>Opportunity</Title>
                </Typography>
                <Form
                    layout="vertical"
                    style={{marginTop: "12px"}}
                    form={oppForm}
                >
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                name="opp-id"
                                label="Id"
                                valuePropName="opp-id"
                            >
                                <Input
                                    placeholder="opportunity id"
                                    disabled
                                    value={oppId}
                                    onChange={e => setOppId(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item
                                name="opp-organization-name"
                                label="Organization"
                                valuePropName="opp-organization-name"
                            >
                                <Input
                                    disabled
                                    placeholder="organization name"
                                    value={oppOrganization()} />
                            </Form.Item>
                        </Col>
                    </Row>                                        
                    <Form.Item
                        name="opp-name"
                        label="Name"
                        valuePropName="opp-name"
                        rules={[
                            {
                            required: true,
                            message: 'Please input the opportunity name',
                            },
                        ]}
                    >
                        <Input
                            disabled
                            placeholder="opportunity name"
                            value={oppName}
                            onChange={e => setOppName(e.target.value)} />
                    </Form.Item>                        
                    <Form.Item
                        name="opp-description"
                        label="Description"
                        valuePropName="opp-description"
                        rules={[
                            {
                            required: true,
                            message: 'Please input the opportunity description',
                            },
                        ]}
                    >
                        <TextArea
                            disabled
                            placeholder="description"
                            value={oppDescription}
                            onChange={e => setOppDescription(e.target.value)}
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Form.Item>
                    <Row gutter={[100, 0]}>
                        <Col span={6}>
                            <Form.Item
                            name="opp-creation-date"
                            label="Creation date"
                            valuePropName="opp-creation-date"
                            >
                                <DatePicker
                                    disabled
                                    format={"YYYY-MM-DD"}
                                    defaultValue={ moment.unix(oppCreationDate) }
                                    onChange={ (date) => { setOppCreationDate(moment(date).unix()) } }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="opp-pre-requirement-deadline"
                                label="Pre requirement deadline"
                                valuePropName="opp-pre-requirement-deadline"
                            >
                                <DatePicker
                                    disabled
                                    format={"YYYY-MM-DD"}
                                    defaultValue={ moment.unix(oppPreRequirementDeadline) }
                                    onChange={ (date) => { setOppPreRequirementDeadline(moment(date).unix()) } }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="opp-post-requirement-deadline"
                                label="Post requirement deadline"
                                valuePropName="opp-post-requirement-deadline"
                            >
                                <DatePicker
                                    disabled
                                    format={"YYYY-MM-DD"}
                                    defaultValue={ moment.unix(oppPosRequirementDeadline) }
                                    onChange={ (date) => { setOppPostRequirementDeadline(moment(date).unix()) } }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="opp-last-update"
                                label="Last update"
                                valuePropName="opp-last-update"
                            >
                                <DatePicker
                                    disabled
                                    format={"YYYY-MM-DD"}
                                    defaultValue={ moment.unix(oppLastUpdate) }
                                    onChange={ (date) => { setOppLastUpdate(moment(date).unix()) } }
                                />
                            </Form.Item>
                        </Col>
                    </Row>                        
                    <Form.Item
                        name="opp-status"
                        label="Status"
                        valuePropName="opp-status"
                    >
                        <Input
                            disabled
                            placeholder={0}
                            value={statusText()}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={[100, 0]}>
                            <Col span={1}>
                                <Button type="primary" onClick={(e) => {onOppUpdateStatus(e)}} htmlType="submit">Next Status</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
                <Tabs defaultActiveKey="0" centered={true}>
                    <TabPane tab="Applications" key={0}>
                        <Table
                            rowSelection={{
                                preRow,
                                onChange: onSelectChange,
                              }}
                            columns={applicationColumns}
                            dataSource={applicationData()}
                        />
                    </TabPane>
                </Tabs>
            </Layout.Content>
        </Layout>
    )
}

export default ApplicationReviewScreen;