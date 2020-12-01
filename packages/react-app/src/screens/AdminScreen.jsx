import React, { useState } from "react";
import { Row, Col, Table, Layout, Typography, Form, Input, Button } from "antd";
import { useContractLoader, useContractReader } from "../hooks";
import { useTranslation } from "react-i18next";
import { BigNumber } from "@ethersproject/bignumber";

const { Title } = Typography;

function AdminScreen ({
  address,
  gasPrice,
  userProvider,
  localProvider,
  mainnetProvider,
  tx
}) {
    
    const readContracts = useContractLoader(localProvider);
    const writeContracts = useContractLoader(userProvider);

    const organizations = useContractReader(readContracts, 'AkasifyCoreContract', "getOrganizations");
    const beneficiaries = useContractReader(readContracts, 'AkasifyCoreContract', "getBeneficiaries");

    const [orgForm] = Form.useForm();
    const [orgName, setOrgName] = useState("");
    const [orgAccount, setOrgAccount] = useState("");
    
    const [benForm] = Form.useForm();
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
    ];

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
        }
    ];

    const orgData = () => {     
        let data = [];
        if (organizations) {
            for (let i = 0; i < organizations[0].length; i++) {
                let status = "";
                switch (BigNumber.from(organizations[4][i]).toNumber()) {
                    case 1:
                        status = "waiting for approval";
                        break;
                    case 2:
                        status = "deactivated";
                        break;
                    case 3:
                        status = "active";
                        break;
                    default:
                        status = "";
                        break;
                }
                data.push({
                    id: BigNumber.from(organizations[0][i]).toNumber(),
                    key: BigNumber.from(organizations[0][i]).toNumber(),
                    name: organizations[1][i],
                    account: organizations[2][i],
                    status: status
                });
            }   
        }        
        return data;
    }

    const benData = () => {
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

    const onOrgFinish = () => {
        tx(writeContracts.AkasifyCoreContract.registerOrganizationByAdmin(orgName, orgAccount, 3));
    };

    const onBenFinish = () => {
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