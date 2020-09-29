import React, { useState } from 'react';
import { Row, Col, Card, Table, Layout, Tabs, Typography, Form, Input, Button, Tag, DatePicker, Select, Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useBalance, useEventListener } from "../hooks";
import { Transactor } from "../helpers";
import opportunityAvatar from '../assets/images/opportunity_avatar.png'
import opportunityImage from '../assets/images/opportunity_detail.png'
import moment from 'moment';
import { useTranslation } from 'react-i18next'
//import { BigNumber } from "bignumber.js"
import { BigNumberish, BigNumber } from '@ethersproject/bignumber';
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

function OpportunityManageScreen ({
  address,
  gasPrice,
  userProvider,
  localProvider,
  mainnetProvider,
  tx
}) {

    // Load in your local 📝 contract and read a value from it:
    const readContracts = useContractLoader(localProvider);
    //console.log("read contracts ", readContracts);

    // If you want to make 🔐 write transactions to your contracts, use the userProvider:
    const writeContracts = useContractLoader(userProvider)
    //console.log("🔐 writeContracts",writeContracts)

    const opportunities = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunities");
    console.log("🤗 opportunities:", opportunities);

    //const organizations = useContractReader(readContracts, 'AkasifyCoreContract', "getOrganizations");
    //console.log("🤗 organizations:", organizations);

    //const opportunity = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunity");
    //console.log("🤗 beneficiaries:", beneficiaries);    

    const [oppForm] = Form.useForm();

    const [oppId, setOppId] = useState(0);
    const [oppOrganizationId, setOppOrganizationId] = useState(0);
    const [oppOrganizationName, setOppOrganizationName] = useState("");
    const [oppName, setOppName] = useState("");
    const [oppDescription, setOppDescription] = useState("");
    const [oppCreationDate, setOppCreationDate] = useState(0);
    const [oppPreRequirementDeadline, setOppPreRequirementDeadline] = useState(0);
    const [oppPosRequirementDeadline, setOppPostRequirementDeadline] = useState(0);
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
    
      const preRequirementData = [
        {
          key: '1',
          id: '1',
          name: 'Submit cv.',
          value: '0',
          type: 'automatic'
        },
        {
          key: '2',
          id: '2',
          name: 'Submit commitment letter signed.',
          value: '0',
          type: 'automatic'
        },
        {
          key: '3',
          id: '3',
          name: 'Send video application.',
          value: '0',
          type: 'automatic'
        },
      ];


    const onOppFinish = () => {
        tx(writeContracts.AkasifyCoreContract.createOpportunity(oppName, oppDescription, oppPreRequirementDeadline, oppPosRequirementDeadline, [], [], [], [], [], []));
        // function createOpportunity(
        //     string memory name,
        //     string memory description,
        //     uint[] memory preRequirementTypes,
        //     uint[] memory preRequirementValues,
        //     string[] memory preRequirementNames,
        //     uint[] memory postRequirementTypes,
        //     uint[] memory postRequirementValues,
        //     string[] memory postRequirementNames
        // )
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
                form={oppForm}
                onFinish={onOppFinish}
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
                        value={oppOrganizationName} />
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
                        value={oppName}
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
                            <Button type="primary" htmlType="submit">Next status</Button>
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
                        form={oppForm}
                        onFinish={onOppFinish}
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
                Content of Tab Pane 2
                </TabPane>
            </Tabs>
        </Layout.Content>
    </Layout>
  )
}

export default OpportunityManageScreen;