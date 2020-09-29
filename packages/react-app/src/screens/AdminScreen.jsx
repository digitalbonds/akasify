import React, { useState } from 'react';
import { Row, Col, Card, Table, Layout, Space, Typography, Form, Input, Button, Tag } from 'antd';
import { useContractLoader, useContractReader, useBalance, useEventListener } from "../hooks";
import { Transactor } from "../helpers";
import opportunityAvatar from '../assets/images/opportunity_avatar.png'
import opportunityImage from '../assets/images/opportunity_detail.png'
import moment from 'moment';
import { useTranslation } from 'react-i18next'
import { BigNumber } from '@ethersproject/bignumber'
const { Title, Paragraph, Text } = Typography;

const { Meta } = Card;

function AdminScreen ({
  address,
  gasPrice,
  userProvider,
  localProvider,
  mainnetProvider,
  tx
}) {
    //console.log("local provider ", localProvider);
    // The transactor wraps transactions and provides notificiations
    //const tx = Transactor(userProvider, gasPrice);

    // Load in your local 📝 contract and read a value from it:
    const readContracts = useContractLoader(localProvider);
    //console.log("read contracts ", readContracts);

    // If you want to make 🔐 write transactions to your contracts, use the userProvider:
    const writeContracts = useContractLoader(userProvider)
    //console.log("🔐 writeContracts",writeContracts)

    //const opportunities = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunities");
    //console.log("🤗 opportunities:", opportunities);

    const organizations = useContractReader(readContracts, 'AkasifyCoreContract', "getOrganizations");
    //console.log("🤗 organizations:", organizations);

    const beneficiaries = useContractReader(readContracts, 'AkasifyCoreContract', "getBeneficiaries");
    //console.log("🤗 beneficiaries:", beneficiaries);    

    if (beneficiaries) {
        let test = beneficiaries[0][0];
        //console.log("value test ", test);
        //console.log("big int value test ", BigNumber.from(test));
    }    

    const [orgForm] = Form.useForm();
    const [benForm] = Form.useForm();

    const [orgName, setOrgName] = useState("");
    const [orgAccount, setOrgAccount] = useState("");

    const [benAccount, setBenAccount] = useState("");

    const orgColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Account',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    const benStatus = (status) => {
        let color = 'gray';
        let statusText = 'none';
        switch (status) {
            case 1:
                color = 'gray';
                statusText = 'pending';
                break;
            case 2:
                color = 'red';
                statusText = 'rejected';
                break;
            case 1:
                color = 'green';
                statusText = 'valid';
                break;
            default:
                break;
        }
        return (
            <Tag color={color} key={status}>
            {   statusText.toUpperCase()}
            </Tag>
        )
    }

    const benColumns = [
        {
            title: 'Account',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: status => (
              <span>
                  <Tag color={'gray'} key={BigNumber.from(status).toNumber()}>
                    {BigNumber.from(status).toNumber()}
                </Tag>
              </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <a>Delete</a>
                </Space>
            ),
        }
    ];

    const orgData = () => {    
        //console.log('accessing org data');    
        let data = [];
        if (organizations) {
            for (let i = 0; i < organizations[0].length; i++) {
                data.push({
                    id: 0,
                    name: organizations[1][i],
                    account: organizations[2][i]
                });
            }   
        }        
        return data;
    }

    //console.log('org data test', orgData());

    const benData = () => {
        //console.log('accessing ben data');    
        let data = [];
        if (beneficiaries) {
            for (let i = 0; i < beneficiaries[0].length; i++) {
                data.push({
                    id: 0,
                    status: beneficiaries[3][i],
                    account: beneficiaries[1][i]
                });
            }   
        }        
        return data;
    }

    //console.log('ben data: ', benData());

    const onOrgFinish = () => {
        //console.log(orgName);
        //console.log(orgAccount);
        tx(writeContracts.AkasifyCoreContract.registerOrganizationByAdmin(orgName, orgAccount, 3));
    };

    const onBenFinish = () => {
        console.log('ben account ', benAccount);
        tx(writeContracts['AkasifyCoreContract'].registerBeneficiaryByAdmin(benAccount, 3));
    };

  return (
    <Layout className="site-layout">
        <Row gutter={[100, 16]}>            
            <Col span={12}>
                <Typography>
                    <Title level={3}>Organizations</Title>
                </Typography>
                <Form
                    layout="vertical"
                    form={orgForm}
                    onFinish={onOrgFinish}
                >
                    <Form.Item
                        name="org-name"
                        label="Name"
                        valuePropName="org-name"
                        rules={[
                            {
                              required: true,
                              message: 'Please input the organization name',
                            },
                        ]}
                    >
                        <Input
                            placeholder="name"
                            value={orgName}
                            onChange={e => setOrgName(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        name="org-account"
                        label="Account"
                        valuePropName="org-account"
                        rules={[
                            {
                              required: true,
                              message: 'Please input the organization account',
                            },
                        ]}
                    >
                        <Input
                            placeholder="eth address"
                            value={orgAccount}
                            onChange={e => setOrgAccount(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
                <Table columns={orgColumns} dataSource={orgData()} />
            </Col>
            <Col span={12}>
                <Typography>
                    <Title level={3}>Beneficiaries</Title>
                </Typography>
                <Form
                    layout="vertical"
                    form={benForm}
                    onFinish={onBenFinish}
                >
                    <Form.Item
                        name="ben-account"
                        label="Account"
                        valuePropName="ben-account"
                        rules={[
                            {
                              required: true,
                              message: 'Please input the beneficiary account',
                            },
                        ]}
                    >
                        <Input
                            placeholder="eth address"
                            value={benAccount}
                            onChange={e => setBenAccount(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
                <Table columns={benColumns} dataSource={benData()} />
            </Col>
        </Row>
    </Layout>
  )
}

export default AdminScreen;