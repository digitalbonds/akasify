import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Layout, Tabs, Typography, Form, Input, Button, Tag, DatePicker, Select, Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams, useHistory } from "react-router-dom";
import { useContractLoader, useContractReader, useBalance, useEventListener } from "../hooks";
import opportunityAvatar from '../assets/images/opportunity_avatar.png'
import opportunityImage from '../assets/images/opportunity_detail.png'
import moment from 'moment';
import { useTranslation } from 'react-i18next'
import { BigNumber } from '@ethersproject/bignumber'
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Meta } = Card;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function OpportunityEditScreen ({
  address,
  gasPrice,
  userProvider,
  localProvider,
  mainnetProvider,
  tx
}) {

    let { id } = useParams();
    let history = useHistory();

    // Load in your local 📝 contract and read a value from it:
    const readContracts = useContractLoader(localProvider);

    // If you want to make 🔐 write transactions to your contracts, use the userProvider:
    const writeContracts = useContractLoader(userProvider)

    const opportunity = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunityById", id.replace(":",""));
    console.log("opportunity data from sc: ", opportunity);
    console.log("opportunity data from sc, status: ", opportunity && BigNumber.from(opportunity[7]).toNumber());

    //opportunity.organizationId;
    const organization = useContractReader(readContracts, 'AkasifyCoreContract', "getOrganizationById", id.replace(":",""));
    
    const oppOrganization = () => {
        if (organization)
            return organization[1];
        return "";
    }

    // const oppNameData = () => {
    //     //if (data && data.length > 0)            
    //         //return data;
    //     if (organization)
    //         return opportunity[1];
    //     return "";
    // }

    useEffect(() => {
        if (opportunity) {
            console.log("id param: ", id.replace(":",""));
            console.log("id from sc: ", BigNumber.from(opportunity[0]).toNumber());            
        }        
        if (opportunity && oppCreationDate != BigNumber.from(opportunity[5]).toNumber()) {
            setOppName(opportunity[1]);
            setOppDescription(opportunity[2]);
            setOppCreationDate(opportunity[5]);
        }
    }, [opportunity]);


    const [oppForm] = Form.useForm();
    const [preRequirementForm] = Form.useForm();
    const [postRequirementForm] = Form.useForm();

    const [oppId, setOppId] = useState(0);
    const [oppOrganizationId, setOppOrganizationId] = useState(0);
    const [oppOrganizationName, setOppOrganizationName] = useState("");
    const [oppName, setOppName] = useState();
    const [oppDescription, setOppDescription] = useState("");
    const [oppPreRequirementDeadline, setOppPreRequirementDeadline] = useState(0);
    const [oppPosRequirementDeadline, setOppPostRequirementDeadline] = useState(0);    
    const [oppCreationDate, setOppCreationDate] = useState(0);
    const [oppLastUpdate, setOppLastUpdate] = useState(0);
    const [oppStatus, setOppStatus] = useState(0);

    const preRequirementColumns = [
        {
          title: 'No.',
          dataIndex: 'id',
          key: 'id',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
          },
        {
          title: 'Type',
          key: 'type',
          dataIndex: 'type',
          render: type => (
            <span>
                <Tag color={'gray'} key={type}>
                    {type.toUpperCase()}
                </Tag>
            </span>
          ),
        }
    ];

    const postRequirementColumns = [
        {
          title: 'No.',
          dataIndex: 'id',
          key: 'id',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
          },
        {
          title: 'Type',
          key: 'type',
          dataIndex: 'type',
          render: type => (
            <span>
                <Tag color={'gray'} key={type}>
                    {type.toUpperCase()}
                </Tag>
            </span>
          ),
        }
    ];
    
    const preRequirementData = [];

    const postRequirementData = [];

    const onOppCreate = () => {
        //console.log("transaction sent: ", oppName, ", ", oppDescription, ", ", oppPreRequirementDeadline, ", ", oppPosRequirementDeadline, ", [], [], [], [], [], []");
        tx(writeContracts.AkasifyCoreContract.createOpportunity(oppName, oppDescription, oppPreRequirementDeadline, oppPosRequirementDeadline, [], [], [], [], [], []));        
    };

    const onOppUpdateStatus = (e) => {
        e.preventDefault();
        const newStatus = oppStatus + 2;
        console.log("opportunity data id = ", oppId);
        console.log("opportunity data status = ", parseInt(newStatus));
        tx(writeContracts.AkasifyCoreContract.updateOpportunityStatus(oppId, parseInt(newStatus)));
    };

    const uploadButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      );

    function onOppPreRequirementDeadlineChange(date) {        
        console.log("value ", oppPreRequirementDeadline);
        console.log("new ", moment(date).unix());
        setOppPreRequirementDeadline(moment(date).unix());
      }

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
                                //value={oppPreRequirementDeadline}
                                //onChange={onOppPreRequirementDeadlineChange}
                                //onChange={(date) => { console.log(date.unix()) }}
                                onChange={(date) => { setOppCreationDate(date.unix()) }}
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
                                //value={oppPreRequirementDeadline}
                                //onChange={onOppPreRequirementDeadlineChange}
                                //onChange={(date) => { console.log(date.unix()) }}
                                onChange={(date) => { setOppPreRequirementDeadline(date.unix()) }}
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
                                //value={oppPreRequirementDeadline}
                                //onChange={onOppPreRequirementDeadlineChange}
                                //onChange={(date) => { console.log(date.unix()) }}
                                onChange={(date) => { setOppPostRequirementDeadline(date.unix()) }}
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
                                //value={oppPreRequirementDeadline}
                                //onChange={onOppPreRequirementDeadlineChange}
                                //onChange={(date) => { console.log(date.unix()) }}
                                onChange={(date) => { setOppLastUpdate(date.unix()) }}
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
                <Form.Item
                    name="opp-images"
                    label="Images"
                    valuePropName="opp-images"
                >
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        >
                        {uploadButton}
                    </Upload>
                    <Modal
                        visible={false}
                        title={"Test"}
                        footer={null}
                        >
                        <img alt="example" style={{ width: '100%' }} />
                    </Modal>
                </Form.Item>                
                <Form.Item>
                    <Row gutter={[100, 16]}>
                        <Col span={1}>
                            <Button type="primary" htmlType="submit">Save</Button>
                        </Col>
                        <Col span={1}>
                            <Button type="primary" onClick={(e) => {onOppUpdateStatus(e)}} htmlType="submit">Next status</Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
            <Tabs defaultActiveKey="1" centered={true}>
                <TabPane tab="Pre requirements" key={1}>
                    <Table
                        columns={preRequirementColumns}
                        dataSource={preRequirementData}
                    />
                    <Form
                        layout="vertical"
                        style={{marginTop: "12px"}}
                        form={preRequirementForm}
                    >
                        <Row gutter={[100, 16]}>
                            <Col span={8}>
                                <Form.Item
                                    name="pre-requirement-id"
                                    label="Id"
                                    valuePropName="pre-requirement-id"
                                >
                                    <Input
                                        placeholder="0"
                                        disabled/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="pre-requirement-type"
                                    label="Type"
                                    valuePropName="pre-requirement-type"
                                >
                                    <Select
                                        placeholder="Select a type"
                                        allowClear
                                    >
                                        <Option value="simple">simple</Option>
                                        <Option value="value_required">value required</Option>
                                        <Option value="automatic transfer">automatic transfer</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="pre-requirement-value"
                                    label="Value"
                                    valuePropName="pre-requirement-value"
                                >
                                    <Input
                                        placeholder="0" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="pre-requirement-name"
                            label="Name"
                            valuePropName="pre-requirement-name"
                            rules={[
                                {
                                required: true,
                                message: 'Please input the pre requirement name',
                                },
                            ]}
                        >
                            <TextArea
                                placeholder="name"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={[100, 16]}>
                                <Col span={1}>
                                    <Button type="primary" htmlType="submit">Save</Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="Post requirements" key={2}>
                    <Table
                        columns={postRequirementColumns}
                        dataSource={postRequirementData}
                    />
                    <Form
                        layout="vertical"
                        style={{marginTop: "12px"}}
                        form={postRequirementForm}
                    >
                        <Row gutter={[100, 16]}>
                            <Col span={8}>
                                <Form.Item
                                    name="post-requirement-id"
                                    label="Id"
                                    valuePropName="post-requirement-id"
                                >
                                    <Input
                                        placeholder="0"
                                        disabled/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="post-requirement-type"
                                    label="Type"
                                    valuePropName="post-requirement-type"
                                >
                                    <Select
                                        placeholder="Select a type"
                                        allowClear
                                    >
                                        <Option value="simple">simple</Option>
                                        <Option value="value_required">value required</Option>
                                        <Option value="automatic transfer">automatic transfer</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="post-requirement-value"
                                    label="Value"
                                    valuePropName="post-requirement-value"
                                >
                                    <Input
                                        placeholder="0" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="post-requirement-name"
                            label="Name"
                            valuePropName="post-requirement-name"
                            rules={[
                                {
                                required: true,
                                message: 'Please input the post requirement name',
                                },
                            ]}
                        >
                            <TextArea
                                placeholder="name"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={[100, 16]}>
                                <Col span={1}>
                                    <Button type="primary" htmlType="submit">Save</Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>
        </Layout.Content>
    </Layout>
  )
}

export default OpportunityEditScreen;