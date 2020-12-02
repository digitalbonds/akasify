import React from "react";
import { Row, Col, Tag, Avatar, List, Layout, Space, Statistic } from "antd";
import { CalendarOutlined, FormOutlined } from "@ant-design/icons";
import { useContractLoader, useContractReader } from "../hooks";
import organizationAvatar from "../assets/images/opportunity_avatar.png";
import organizationImage from "../assets/images/opportunity_detail.png";
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
    
  const length = 250;
  const dateFormat = 'MM/DD/YYYY';
  const readContracts = useContractLoader(localProvider);
  const organizations = useContractReader(readContracts, 'AkasifyCoreContract', "getOrganizations");

  const orgData = () => {
    let data = [];
    if (organizations) {
        for (let i = 0; i < organizations[0].length; i++) {
            data.push({
                id: BigNumber.from(organizations[0][i]).toNumber(),
                key: BigNumber.from(organizations[0][i]).toNumber(),
                name: organizations[1][i],
                account: organizations[2][i],
                registerDate: BigNumber.from(organizations[3][i]).toNumber(),
                status: BigNumber.from(organizations[4][i]).toNumber(),
                image: organizationImage,
                avatar: organizationAvatar
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
        header={
        <div>
            
        </div>
        }
        renderItem={item => (
            <List.Item
                key={item.title}
                extra={
                    <Statistic title="Opportunities" value={10} prefix={<FormOutlined />} />
                }
            >
                <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.name}</a>}
                description={
                <div className="opportunity-detail-card">
                    <Row justify="space-between">
                        <Col span={4}>Register date:</Col>
                        <Col span={20}> {moment.unix(item.deadline).format(dateFormat)}</Col>
                    </Row>
                    <Row justify="space-between">
                        <Col span={24}>{item.description.substring(0, length)}...</Col>
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