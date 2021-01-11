import React, { useState } from "react";
import { Row, Col, Tag, Card, Avatar, List, Layout, Tooltip, Button } from "antd";
import { FileSearchOutlined, CalendarOutlined, FormOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useContractLoader, useContractReader } from "../hooks";
import opportunityAvatar from "../assets/images/opportunity_avatar.png";
import opportunityImage from "../assets/images/opportunity_detail.png";
import moment from "moment";
import { BigNumber } from "@ethersproject/bignumber";
import { useTranslation } from "react-i18next";
//const ipfsClient = require("ipfs-http-client");

const { Meta } = Card;

function OpportunityScreen ({
  address,
  gasPrice,
  userProvider,
  localProvider,
  mainnetProvider,
  role
}) {
  
  const readContracts = useContractLoader(localProvider);
  const opportunities = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunities");
  //const [imageUrl, setImageUrl] = useState();
  //const [imageHash, setImageHash] = useState();
  const [imageStream, setImageStream] = useState();
  
  const dateFormat = process.env.REACT_APP_DATE_FORMAT;
  const length = 250; // description max characters to show in preview
  let count = 0;

  const oppData = () => {
    let data = [];
    if (opportunities) {
      for (let i = 0; i < opportunities[0].length; i++) {
        data.push({
          id: BigNumber.from(opportunities[0][i]).toNumber(),
          key: BigNumber.from(opportunities[0][i]).toNumber(),
          organizationName: opportunities[1][i],
          name: opportunities[2][i],
          description: opportunities[3][i],
          imageHash: opportunities[4][i],
          preRequirementsDeadline: BigNumber.from(opportunities[5][i]).toNumber(),
          status: BigNumber.from(opportunities[6][i]).toNumber(),
          image: opportunityImage,
          avatar: opportunityAvatar
        });
      }   
    }
    return data;
  }

  return (
    <Layout className="site-layout">      
      <Layout.Content>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
          onChange: page => {
              console.log(page);
          },
          pageSize: 10,
          }}
          grid={{ gutter: 16, column: 3 }}
          dataSource={oppData()}
          header={
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20
            }}>
              <div></div>
              {role === "organization" && (
                <div>
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    data-testid="add-contact-button"
                  >
                    <NavLink style={{color: "#FFF", padding:"12px"}} to="/opportunityedit:0">Create</NavLink>
                  </Button>
                </div>
              )}              
            </div>
          }
          renderItem={item => (
            <List.Item>
              <Card
                key={item.id}
                cover={
                  <img
                    alt={item.name}
                    src={`https://${item.imageHash}.${process.env.REACT_APP_INFURA_GATEWAY}`}
                  />
                }
                actions={ role === "organization" && [
                  <Tooltip placement="bottom" title="edit opportunity">
                    <NavLink to={'/opportunityedit:' + item.id}><FormOutlined key="edit" /></NavLink>
                  </Tooltip>,
                  <Tooltip placement="bottom" title="review applications">
                    <NavLink to={'/applications:' + item.id}><FileSearchOutlined key="review" /></NavLink>
                  </Tooltip>
                ]}
              >
                <Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={ <NavLink to={ role === "organization" ? `/opportunityedit:${item.id}` : `/opportunity:${item.id}`}>{item.name}</NavLink>}
                  description={
                    <div className="opportunity-detail-card">
                      <Row justify="space-between">
                        <Col span={2}>
                          <Tooltip placement="left" title="deadline">
                            <CalendarOutlined />
                          </Tooltip>
                        </Col>
                        <Col span={22}>
                          {moment.unix(item.preRequirementsDeadline).format(dateFormat)}
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={24}>{item.description.substring(0, length)}</Col>
                      </Row>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Layout.Content>
    </Layout>
  )
}

export default OpportunityScreen;