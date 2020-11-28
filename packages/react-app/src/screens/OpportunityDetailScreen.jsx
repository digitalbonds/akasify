import React from 'react'
import { useParams, useHistory, Redirect } from "react-router-dom"
import { Button, Layout, Row, Typography, Col, Card, Avatar, Tabs, Tag, Table, Carousel, Tooltip, Badge, Divider  } from 'antd'
import { EyeOutlined, CalendarOutlined, StarOutlined, TagOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next'
import { useContractLoader, useContractReader, useBalance, useEventListener, useExchangePrice } from "../hooks";
import { Transactor } from "../helpers";
import opportunityAvatar from '../assets/images/opportunity_avatar.png'
import * as moment from 'moment'
import { BigNumber } from '@ethersproject/bignumber'
import { parcelConfig } from '../helpers/parcelConfig';
import { OidcClient, Log } from 'oidc-client';

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Paragraph } = Typography

function OpportunityDetailScreen({
  role,
  address,
  gasPrice,
  userProvider,
  localProvider,
  mainnetProvider
}) {

  let { id } = useParams();
  let history = useHistory();
  const { t } = useTranslation();

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);
  //console.log("read contracts ", readContracts);

  const status = useContractReader(readContracts, 'AkasifyCoreContract', "getBeneficiaryStatusByAddress", [address]);
  // console.log("role: ", role);
  // console.log("address: ", address);
  // console.log("status: ", status && BigNumber.from(status).toNumber());

  const opportunity = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunityById", id.replace(":",""));
  //console.log("🔐 opportunity data, ", opportunity);

  const application = useContractReader(readContracts, 'AkasifyCoreContract', "getApplication", [id.replace(":",""), address]);
  //console.log("🔐 opportunity data, ", opportunity);
    
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(mainnetProvider); //1 for xdai

  const writeContracts = useContractLoader(localProvider)
  //console.log("write contracts ", writeContracts);

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  //console.log("oasis config: ", config);

  const oidcClient = new OidcClient(parcelConfig);

  const obtainIdToken = async () => {    
    const request = await oidcClient.createSigninRequest();
    window.location.assign(request.url);
  };

  // function getOpportunity() {
  //   //console.log('accessing ben data, ', opportunity);    
  //   let data = [];
  //   if (opportunitySC) {
  //     data.push({
  //       id: BigNumber.from(opportunitySC[0]).toNumber(),
  //       key: BigNumber.from(opportunitySC[0]).toNumber(),
  //       name: opportunitySC[1],
  //       deadline: 100000,
  //       tags: ["youth", "activism"],
  //       description: opportunitySC[2],
  //       status: 2,
  //       image: [""],
  //       avatar: opportunityAvatar
  //     });  
  //   }

  //   setOpportunity(data);
  // }

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Detail',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            //if (tag === 'loser') {
            //  color = 'volcano';
            //}
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    }
  ];

  const data = [
    {
      key: '1',
      name: 'New York No. 1 Lake Park',
      tags: ['value needed'],
    },
    {
      key: '2',
      name: 'London No. 1 Lake Park',
      tags: ['automatic'],
    },
    {
      key: '3',
      name: 'Sidney No. 1 Lake Park',
      tags: ['automatic'],
    },
  ];

  // const opportunityData = {
  //   key: 0,
  //   name: "Encuentro Regional de Jóvenes Iberoamericanos 2020",
  //   deadline: 100000,
  //   tags: ["youth", "activism"],
  //   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque hendrerit arcu eget mi egestas, eget ultricies quam mattis. Phasellus sed mauris lacus. Nullam sed rhoncus metus, in viverra felis. Sed efficitur suscipit maximus. Sed vitae velit quis enim aliquam ultricies vel ac nisi. Sed at augue quam. Vivamus ut dictum ligula. Nullam ac egestas ligula, id elementum nunc. Morbi accumsan tristique enim, sit amet mattis ante laoreet quis. Vestibulum rutrum placerat lectus ut feugiat. Praesent ultrices nisl vitae dictum aliquam. Donec euismod porttitor justo vel porttitor. Vestibulum elementum facilisis mollis. Suspendisse tristique leo id nibh eleifend egestas.",
  //   status: 2,
  //   image: [""],
  //   avatar: opportunityAvatar
  // };
  // const opportunityData = () => {
  //   console.log('accessing ben data, ', opportunity);    
  //   let data = [];
  //   if (opportunity) {
  //     data.push({
  //       id: BigNumber.from(opportunity[0]).toNumber(),
  //       key: BigNumber.from(opportunity[0]).toNumber(),
  //       name: opportunity[1],
  //       deadline: 100000,
  //       tags: ["youth", "activism"],
  //       description: opportunity[2],
  //       status: 2,
  //       image: [""],
  //       avatar: opportunityAvatar
  //     });  
  //   }
  //   console.log("opportunity parsed: ", data);
  //   return data;
  // }

  const contentStyle = {
    height: '300px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  const tags = (data) => (
    data.map(tag => (
        <Tag key={tag}>{tag}</Tag>
    ))
  );

  return (
    <Layout className="site-layout">
      <Card
        style={{ width: '100%' }}
        cover={
          <Carousel autoplay>
            <div key={1}>
              <h3 style={contentStyle}>1</h3>
            </div>
            <div key={2}>
              <h3 style={contentStyle}>2</h3>
            </div>
          </Carousel>
        }
        actions={[
          <Tooltip placement="bottom" title="views">
            <Badge count={1} offset={[15, 0]}><EyeOutlined key="views" /></Badge>
          </Tooltip>,
          <Tooltip placement="bottom" title="saved">
            <StarOutlined key="bookmark" />
        </Tooltip>
        ]}
      >
        <Meta
          avatar={<Avatar src={opportunityAvatar} />}
          title={opportunity && opportunity[1]}
          description={
            <div className="opportunity-detail-card">
              <Row justify="space-between" style={{marginBottom: "8px"}}>
                <Col span={2}>
                  <Tooltip placement="left" title="deadline">
                    <CalendarOutlined />
                  </Tooltip>
                </Col>
                <Col span={22}>
                  {opportunity && moment.unix(opportunity[4]).format("MM-DD-YYYY")}
                </Col>
              </Row>
              <Row justify="space-between">
                <Col span={2}>
                  <Tooltip placement="left" title="tags">
                    <TagOutlined />
                  </Tooltip>
                </Col>
                {/* <Col span={22}>{tags(opportunityData.tags)}</Col> */}
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col span={24}>{opportunity && opportunity[2]}</Col>
              </Row>
              <Divider />
              <Row justify="center">
                <Col span={12}>
                  {role == "beneficiary" && <Button type="primary" style={{marginBottom: '15px'}} block onClick={()=>{
                    tx( writeContracts.AkasifyCoreContract.createApplication(id.replace(":","")) )
                  }}>Apply</Button>}
                  {role == "visitor" && <Button type="primary" block href="/register">Register as beneficiary</Button>}
                  
                  {/* {application && BigNumber.from(application[1]).toNumber() == id.replace(":","") &&  */}
                    <Button type="primary" block onClick={()=>{
                      obtainIdToken()
                    }}>Connect with Oasis</Button>
                  {/* } */}
                </Col>
              </Row>
            </div>
          }
        />
      </Card>
      <Tabs defaultActiveKey="1" centered={true}>
        <TabPane tab="Pre requirements" key={1}>
          <Table
            columns={columns}
            dataSource={data}
            key={data.id}
          />
        </TabPane>
        <TabPane tab="Post requirements" key={2}>
          Content of Tab Pane post
        </TabPane>
      </Tabs>
    </Layout>
  )
}

export default OpportunityDetailScreen;