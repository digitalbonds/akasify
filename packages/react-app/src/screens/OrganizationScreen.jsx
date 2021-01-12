import React from "react";
import { Row, Col, Avatar, List, Layout, Statistic } from "antd";
import { FormOutlined } from "@ant-design/icons";
import { useContractLoader, useContractReader } from "../hooks";
import moment from "moment";
import { BigNumber } from "@ethersproject/bignumber";

function OrganizationScreen ({
  show,
  handleOnClose,
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal
}) {

  const readContracts = useContractLoader(localProvider);
  const organizations = useContractReader(readContracts, 'AkasifyCoreContract', "getOrganizations");
  const opportunities = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunities");

  const orgData = () => {
    let data = [];
    if (organizations) {
        for (let i = 0; i < organizations[0].length; i++) {

            let opportunityCount = 0;

            if (opportunities) {
                for (let j = 0; j < opportunities[0].length; j++) {
                    let opportunityOrganizationId = BigNumber.from(opportunities[1][j]).toNumber();
                    let organizationId = BigNumber.from(organizations[0][i]).toNumber();
                    if (opportunityOrganizationId == organizationId) {
                        opportunityCount++;
                    }
                }
            }
            
            data.push({
                id: BigNumber.from(organizations[0][i]).toNumber(),
                key: BigNumber.from(organizations[0][i]).toNumber(),
                name: organizations[1][i],
                image: organizations[2][i],
                account: organizations[3][i],
                registerDate: BigNumber.from(organizations[4][i]).toNumber(),
                status: BigNumber.from(organizations[5][i]).toNumber(),
                opportunityCount: opportunityCount
            });
        }   
    }
    return data;
  }

  return (
    <Layout className="site-layout">
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
            pageSize: 3,
        }}
        dataSource={orgData()}
        renderItem={item => (
            <List.Item
                key={item.title}
                extra={
                    <Statistic title="Opportunities" value={item.opportunityCount} prefix={<FormOutlined />} />
                }
            >
                <List.Item.Meta
                    avatar={
                        <Avatar
                            src={`https://${item.image}.${process.env.REACT_APP_INFURA_GATEWAY}`}
                        />
                    }
                    title={<a href={item.href}>{item.name}</a>}
                    description={
                        <div className="opportunity-detail-card">
                            <Row justify="space-between">
                                <Col span={4}>Register date:</Col>
                                <Col span={20}>
                                    {moment.unix(item.registerDate).format(process.env.REACT_APP_DATE_FORMAT)}
                                </Col>
                            </Row>
                        </div>
                    }
                />
                    {item.content}
                </List.Item>
            )}
        />
    </Layout>
  )
}

export default OrganizationScreen;