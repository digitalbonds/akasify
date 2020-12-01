import React, { useState, useEffect } from "react";
import { Row, Col, Table, Layout, Tabs, Typography, Form, Input, Button, Tag, DatePicker, Select, Upload, Modal } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useParams, useHistory } from "react-router-dom";
import { useContractLoader, useContractReader, useBalance, useEventListener } from "../hooks";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { BigNumber } from "@ethersproject/bignumber";
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

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

    const readContracts = useContractLoader(localProvider);
    const writeContracts = useContractLoader(userProvider);

    const opportunity = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunityById", id.replace(":",""));
    const organization = useContractReader(readContracts, 'AkasifyCoreContract', "getOrganizationById", id.replace(":",""));
    const preRequirements = useContractReader(readContracts, 'AkasifyCoreContract', "getPreRequirementsByOpportunityId", id.replace(":",""));
    const postRequirements = useContractReader(readContracts, 'AkasifyCoreContract', "getPostRequirementsByOpportunityId", id.replace(":",""));
    
    const oppOrganization = () => {
        if (organization)
            return organization[1];
        return "";
    }

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
    const [preRequirementForm] = Form.useForm();
    const [postRequirementForm] = Form.useForm();

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

    // PRE-REQUIREMENT
    const [preRow, setPreRow] = useState(0);
    const [preId, setPreId] = useState(0);
    const [preName, setPreName] = useState("");
    const [preValue, setPreValue] = useState(0);
    const [preType, setPreType] = useState(0);

    // POST-REQUIREMENT
    const [postId, setPostId] = useState(0);
    const [postName, setPostName] = useState("");
    const [postValue, setPostValue] = useState(0);
    const [postType, setPostType] = useState(0);

    const preRequirementColumns = [
        {
          title: 'No.',
          dataIndex: 'id',
          key: 'id'
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
                    {type}
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
    
    const preRequirementData = () => {
        let data = [];
        if (preRequirements) {
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

    const postRequirementData = [];

    const onOppCreate = () => {
        tx(writeContracts.AkasifyCoreContract.createOpportunity(oppName, oppDescription, oppPreRequirementDeadline, oppPosRequirementDeadline, [], [], [], [], [], []));        
    };

    const onOppUpdateStatus = (e) => {
        e.preventDefault();
        tx(writeContracts.AkasifyCoreContract.updateOpportunityStatus(oppId, oppStatus + 1));
    };

    const onPreRequirementCreate = () => {
        tx(writeContracts.AkasifyCoreContract.createPreRequirement(oppId, preType, preValue, preName));
    }

    const onPostRequirementCreate = () => {
        tx(writeContracts.AkasifyCoreContract.createPostRequirement(oppId, preType, preValue, preName));
    }

    const uploadImage = async (data) => {
        console.log("image data: ", data);
        const imageStream = await getBase64(data);
        console.log("image stream: ", imageStream);
        const response = await fetch('https://rinkeby.infura.io/v3/dfd1cdc752364456af19b6315fb9e415/add', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: imageStream
        }).then((res) => res.json());
        const hash = response;
        console.log("hash: ", hash);
    }

    const uploadButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys[0]);
        setPreRow(selectedRowKeys[0]);
        console.log('preRow: ', preRow);
        console.log('preRequirements: ', preRequirements);

        if (preRequirements) {
            console.log("validating data");
            console.log("pre data: ", preRequirements[0]);
            console.log("pre row: ", preRow);
            console.log("pre id: ", BigNumber.from(preRequirements[0][preRow]).toNumber());
            console.log("pre type: ", BigNumber.from(preRequirements[1][preRow]).toNumber());
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
                            value={statusText()} />
                    </Form.Item>
                    <Form.Item
                        name="opp-images"
                        label="Images"
                        valuePropName="opp-images"
                    >
                        <Upload action={uploadImage}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                        {/* <Upload
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
                        </Modal> */}
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
                            rowSelection={{
                                preRow,
                                onChange: onSelectChange,
                              }}
                            columns={preRequirementColumns}
                            dataSource={preRequirementData()}
                        />
                        <Form
                            layout="vertical"
                            style={{marginTop: "12px"}}
                            form={preRequirementForm}
                            onFinish={onPreRequirementCreate}
                        >
                            <Row gutter={[100, 16]}>
                                <Col span={8}>
                                    <Form.Item
                                        name="pre-requirement-id"
                                        label="Id"
                                        valuePropName="pre-requirement-id"
                                    >
                                        <Input
                                            disabled
                                            value={preId}
                                            onChange={e => setPreId(e.target.value)} />
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
                                            defaultValue={preType}
                                            value={preType}
                                            onChange={(value) => setPreType(value)}
                                            allowClear
                                        >
                                            <Option value={1}>simple</Option>
                                            <Option value={2}>value required</Option>
                                            <Option value={3}>automatic transfer</Option>
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
                                            placeholder="0"
                                            value={preValue}
                                            onChange={e => setPreValue(e.target.value)} />
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
                                    value={preName}
                                    onChange={e => setPreName(e.target.value)}
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
                            onFinish={onPostRequirementCreate}
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