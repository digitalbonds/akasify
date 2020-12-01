import React, { useState, useEffect } from "react";
import { Row, Col, Table, Layout, Tabs, Typography, Form, Input, Button, Tag, DatePicker, Select } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useParams, useHistory, NavLink } from "react-router-dom";
import { useContractLoader, useContractReader, useBalance, useEventListener } from "../hooks";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { BigNumber } from "@ethersproject/bignumber";
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
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
            setOppPreRequirementDeadline(BigNumber.from(opportunity[3]).toNumber());
            setOppPostRequirementDeadline(BigNumber.from(opportunity[4]).toNumber());
            setOppCreationDate(BigNumber.from(opportunity[5]).toNumber());
            setOppLastUpdate(BigNumber.from(opportunity[6]).toNumber());
            setOppStatus(BigNumber.from(opportunity[7]).toNumber());
        }
    }, [opportunity]);

    const [oppForm] = Form.useForm();

    // OPPORTUNITY
    const [oppId, setOppId] = useState(0);
    const [oppOrganizationId, setOppOrganizationId] = useState(0);
    const [oppOrganizationName, setOppOrganizationName] = useState("");
    const [oppName, setOppName] = useState();
    const [oppDescription, setOppDescription] = useState("");
    const [oppPreRequirementDeadline, setOppPreRequirementDeadline] = useState(moment().unix());
    const [oppPosRequirementDeadline, setOppPostRequirementDeadline] = useState(moment().unix());    
    const [oppCreationDate, setOppCreationDate] = useState(moment().unix());
    const [oppLastUpdate, setOppLastUpdate] = useState(moment().unix());
    const [oppStatus, setOppStatus] = useState(0);

    // APPLICATION
    const [preRow, setPreRow] = useState(0);

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
            title: 'Submission',
            dataIndex: 'submission',
            key: 'submission',
          },
        {
          title: 'Action',
          key: 'action',
          dataIndex: 'action',
          render: (type) => (
            <span>
                <NavLink to={`/application/${id.replace(":","")}`}>
                    {type}
                </NavLink>
            </span>
          ),
        }
    ];

    const applicationData = () => {
        let data = [];
        if (applications) {
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

    const onOppUpdateStatus = (e) => {
        e.preventDefault();
        tx(writeContracts.AkasifyCoreContract.updateOpportunityStatus(oppId, oppStatus + 1));
    };

    const onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys[0]);
        setPreRow(selectedRowKeys[0]);
        console.log('preRow: ', preRow);
        console.log('preRequirements: ', preRequirements);

        if (preRequirements) {
            setPreId(BigNumber.from(preRequirements[0][preRow]).toNumber());
            setPreType(2);
            setPreValue(BigNumber.from(preRequirements[2][preRow]).toNumber());            
            setPreName(preRequirements[3][preRow]);
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
                    onFinish={onOppCreate}
                >
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
                    <Row gutter={[100, 16]}>
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
                            value={oppStatus}
                            onChange={e => setOppStatus(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={[100, 16]}>
                            <Col span={1}>
                                <Button type="primary" htmlType="submit">Save</Button>
                            </Col>
                            <Col span={1}>
                                <Button type="primary" onClick={(e) => {onOppUpdateStatus(e)}} htmlType="submit">Complete Evaluation</Button>
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