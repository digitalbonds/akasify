import React, { useState, useEffect } from "react";
import { Row, Col, Table, Layout, Tabs, Typography, Form, Input, Button, Tag, DatePicker, Select } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { useContractLoader, useContractReader } from "../hooks";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { BigNumber } from "@ethersproject/bignumber";
const ipfsClient = require("ipfs-http-client");

const infura = { host: process.env.REACT_APP_INFURA_HOST, port: process.env.REACT_APP_INFURA_PORT, protocol: process.env.REACT_APP_INFURA_PROTOCOL };
const ipfs = ipfsClient(infura);

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;


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
    const dateFormat = process.env.REACT_APP_DATE_FORMAT;

    const readContracts = useContractLoader(localProvider);
    const writeContracts = useContractLoader(userProvider);

    console.log("id param: ", id);

    const opportunity = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunityById", id.replace(":",""));
    const organization = useContractReader(readContracts, 'AkasifyCoreContract', "getOrganizationByAddress", [address]);
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
            setOppImageHash(opportunity[3]);
            setOppPreRequirementDeadline(BigNumber.from(opportunity[4]).toNumber());
            setOppPostRequirementDeadline(BigNumber.from(opportunity[5]).toNumber());
            setOppCreationDate(BigNumber.from(opportunity[6]).toNumber());
            setOppLastUpdate(BigNumber.from(opportunity[7]).toNumber());
            setOppStatus(BigNumber.from(opportunity[8]).toNumber());
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
    const [oppImageHash, setOppImageHash] = useState("");
    const [oppImageStream, setOppImageStream] = useState("");

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

    const requirementColumns = [
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
    
    const requirementTypeText = (requirementTypeNumber) => {
        let requirementType = "";
        switch (requirementTypeNumber) {
            case 1:
                requirementType = "simple";
                break;
            case 2:
                requirementType = "value required";
                break;
            case 3:
                requirementType = "automatic transfer";
                break;
            default:
                break;
        }
        return requirementType;
    }

    const preRequirementData = () => {
        let data = [];
        if (preRequirements) {
            for (let i = 0; i < preRequirements[0].length; i++) {                
                data.push(
                    {
                        id: BigNumber.from(preRequirements[0][i]).toNumber(),
                        key: BigNumber.from(preRequirements[0][i]).toNumber(),
                        type: requirementTypeText(BigNumber.from(preRequirements[1][i]).toNumber()),
                        value: BigNumber.from(preRequirements[2][i]).toNumber(),
                        name: preRequirements[3][i]
                    }
                )
            }
        }
        return data;
    };

    const postRequirementData = () => {
        let data = [];
        if (postRequirements) {
            for (let i = 0; i < postRequirements[0].length; i++) {                
                data.push(
                    {
                        id: BigNumber.from(postRequirements[0][i]).toNumber(),
                        key: BigNumber.from(postRequirements[0][i]).toNumber(),
                        type: BigNumber.from(postRequirements[1][i]).toNumber(),
                        value: BigNumber.from(postRequirements[2][i]).toNumber(),
                        name: requirementTypeText(postRequirements[3][i])
                    }
                )
            }
        }
        return data;
    };

    const onOppCreate = () => {
        let currentId = id.replace(":","");
        if (currentId == "NaN") {
            // New Opportunity
            tx(writeContracts.AkasifyCoreContract.createOpportunity(oppName, oppDescription, oppImageHash, oppPreRequirementDeadline, oppPosRequirementDeadline, [], [], [], [], [], []));
            // Redirect to opportunities page
            history.push('/opportunity');
        } else {
            // Update Opportunity
        }
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
    
    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const added = await ipfs.add(file);
        let v1cid = added.cid.toV1().toBaseEncodedString('base32');
        console.log("ipfs image hash: ", v1cid);
        setOppImageHash(v1cid);
    }

    const onSelectChange = (selectedRowKeys) => {
        setPreRow(selectedRowKeys[0]);
        if (preRequirements) {
            setPreId(BigNumber.from(preRequirements[0][preRow]).toNumber());
            setPreType(2);
            setPreValue(BigNumber.from(preRequirements[2][preRow]).toNumber());            
            setPreName(preRequirements[3][preRow]);
        }        
    };

    const getDataConverted = (unixTime) => {        
        let dateTimeTest = moment.unix(unixTime);
        let dateTimeText = dateTimeTest.format(dateFormat).toString();
        let dateTimeFormatted = moment(dateTimeText, dateFormat);
        return dateTimeFormatted;
    }

    const getPreRequirementConverted = (unixTime) => {        
        let dateTimeTest = moment.unix(unixTime);
        let dateTimeFormatted = moment(moment.unix(unixTime).format("L"), dateFormat);
        return dateTimeFormatted;
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
                                    format={dateFormat}
                                    defaultValue={ getDataConverted(oppCreationDate) }
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
                                    format={dateFormat}
                                    defaultValue={ getPreRequirementConverted(oppPreRequirementDeadline) }
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
                                    format={dateFormat}
                                    defaultValue={ getDataConverted(oppPosRequirementDeadline) }
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
                                    format={dateFormat}
                                    defaultValue={ getDataConverted(oppLastUpdate) }
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
                        <input type="file" onChange={(e) => { uploadImage(e) }} />
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
                            columns={requirementColumns}
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
                                            value={ preType == 0 ? 1 : preType }
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
                                            disabled={preType === 3 ? false : true }
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
                            columns={requirementColumns}
                            dataSource={postRequirementData()}
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