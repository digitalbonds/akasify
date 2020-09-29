import React from 'react';
import { Row, Col, Tag, Badge, Card, Avatar, List, Layout, Tooltip, Button } from 'antd';
import { EyeOutlined, CalendarOutlined, FormOutlined, StarOutlined, TagOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom'
import { useContractLoader, useContractReader, useBalance, useEventListener } from "../hooks";
import opportunityAvatar from '../assets/images/opportunity_avatar.png'
import opportunityImage from '../assets/images/opportunity_detail.png'
import moment from 'moment';
import { BigNumber } from '@ethersproject/bignumber'
import { useTranslation } from 'react-i18next'

const { Meta } = Card;

function OpportunityScreen ({
  address,
  gasPrice,
  userProvider,
  localProvider,
  mainnetProvider
}) {
  //console.log("local provider ", localProvider);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);
  //console.log("read contracts ", readContracts);
  const opportunities = useContractReader(readContracts, 'AkasifyCoreContract', "getOpportunities");
  //console.log("🤗 opportunities:", opportunities);
    
  const length = 250;

  const oppData = () => {        
    let data = [];
    if (opportunities) {
        for (let i = 0; i < opportunities[0].length; i++) {
            data.push({
                id: BigNumber.from(opportunities[0][i]).toNumber(),
                organizationName: opportunities[1][i],
                name: opportunities[2][i],
                description: opportunities[3][i],                
                preRequirementsDeadline: BigNumber.from(opportunities[4][i]).toNumber(),
                status: BigNumber.from(opportunities[5][i]).toNumber(),
                image: opportunityImage,
                avatar: opportunityAvatar,
                tags: ["youth", "activism"]
            });
        }   
    }
    console.log('accessing opportunities ', data);     
    return data;
}

  // const listData = [
  //     {
  //         id: 0,
  //         name: "Encuentro Regional de Jóvenes Iberoamericanos 2020",
  //         deadline: 100000,
  //         tags: ["youth", "activism"],
  //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque hendrerit arcu eget mi egestas, eget ultricies quam mattis. Phasellus sed mauris lacus. Nullam sed rhoncus metus, in viverra felis. Sed efficitur suscipit maximus. Sed vitae velit quis enim aliquam ultricies vel ac nisi. Sed at augue quam. Vivamus ut dictum ligula. Nullam ac egestas ligula, id elementum nunc. Morbi accumsan tristique enim, sit amet mattis ante laoreet quis. Vestibulum rutrum placerat lectus ut feugiat. Praesent ultrices nisl vitae dictum aliquam. Donec euismod porttitor justo vel porttitor. Vestibulum elementum facilisis mollis. Suspendisse tristique leo id nibh eleifend egestas.",
  //         status: 2,
  //         image: opportunityImage,
  //         avatar: opportunityAvatar
  //     },
  //     {
  //         id: 1,
  //         name: "opp 2",
  //         deadline: 10000,
  //         tags: ["democracy", "social"],
  //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus rutrum tellus pellentesque eu tincidunt. Posuere urna nec tincidunt praesent semper. Pellentesque eu tincidunt tortor aliquam. Pretium lectus quam id leo in vitae turpis massa. In aliquam sem fringilla ut morbi tincidunt. Sagittis nisl rhoncus mattis rhoncus urna neque. Amet purus gravida quis blandit turpis cursus. Pulvinar etiam non quam lacus. Etiam sit amet nisl purus in. Amet commodo nulla facilisi nullam vehicula ipsum a.",
  //         status: 2,
  //         image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  //         avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
  //     },
  //     {
  //         id: 2,
  //         name: "opp 3",
  //         deadline: 10000,
  //         tags: ["democracy", "social"],
  //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed libero enim sed faucibus turpis in eu. A diam maecenas sed enim. Lectus urna duis convallis convallis. Etiam dignissim diam quis enim lobortis scelerisque fermentum. Id velit ut tortor pretium viverra suspendisse potenti nullam. Eu sem integer vitae justo eget magna fermentum iaculis eu. Id donec ultrices tincidunt arcu non sodales neque sodales ut. Congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Volutpat odio facilisis mauris sit.",
  //         status: 2,
  //         image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  //         avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
  //     },
  //     {
  //         id: 3,
  //         name: "opp 4",
  //         deadline: 10000,
  //         tags: ["democracy", "social"],
  //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu ultrices vitae auctor eu augue ut lectus. Malesuada nunc vel risus commodo viverra maecenas accumsan. Eget felis eget nunc lobortis mattis. Enim praesent elementum facilisis leo vel. Placerat duis ultricies lacus sed turpis tincidunt id aliquet risus. Est ultricies integer quis auctor elit sed vulputate mi sit. Vulputate sapien nec sagittis aliquam malesuada. Consectetur lorem donec massa sapien. Integer vitae justo eget magna fermentum iaculis eu. Vel risus commodo viverra maecenas accumsan. Eu facilisis sed odio morbi quis commodo odio aenean. Magna ac placerat vestibulum lectus mauris ultrices eros. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Senectus et netus et malesuada fames ac turpis egestas maecenas. Diam vulputate ut pharetra sit amet aliquam id diam. Non nisi est sit amet facilisis. Vitae sapien pellentesque habitant morbi tristique senectus et netus. Massa id neque aliquam vestibulum morbi. Malesuada pellentesque elit eget gravida.",
  //         status: 2,
  //         image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  //         avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
  //     },
  //     {
  //         id: 4,
  //         name: "opp 5",
  //         deadline: 10000,
  //         tags: ["democracy", "social"],
  //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Integer quis auctor elit sed vulputate. Et leo duis ut diam quam nulla. Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu. Et leo duis ut diam quam nulla porttitor massa. Cursus vitae congue mauris rhoncus. Porttitor eget dolor morbi non arcu. Ultrices neque ornare aenean euismod elementum nisi quis eleifend quam. Purus viverra accumsan in nisl nisi scelerisque eu. Molestie ac feugiat sed lectus. Ornare lectus sit amet est placerat in egestas erat imperdiet. Diam donec adipiscing tristique risus nec feugiat in. Aliquam faucibus purus in massa tempor. Ac ut consequat semper viverra nam libero. Consectetur adipiscing elit duis tristique sollicitudin nibh sit. Nec feugiat in fermentum posuere urna. Sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Sapien pellentesque habitant morbi tristique senectus et netus et.",
  //         status: 2,
  //         image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  //         avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
  //     }
  // ];

  const tags = (data) => (
      data.map(tag => (
          <Tag key={1}>{tag}</Tag>
      ))
      // <Tag key={0}>Youth</Tag>
  )

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
              <div>
                <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                data-testid="add-contact-button"
              >
                <NavLink style={{color: "#FFF"}} to="/manage">Create</NavLink>
              </Button>
              </div>
            </div>
          }
          renderItem={item => (
            <List.Item>
              <Card
                key={item.id}
                cover={
                  <img
                    alt={item.name}
                    src={item.image}
                  />
                }
                actions={[
                  <Tooltip placement="bottom" title="views">
                    <Badge count={1} offset={[15, 0]}><EyeOutlined key="views" /></Badge>
                  </Tooltip>,
                  <Tooltip placement="bottom" title="saved">
                    <StarOutlined key="bookmark" />
                  </Tooltip>,
                  <Tooltip placement="bottom" title="application">
                    <NavLink to={'/opportunity:' + item.id}><FormOutlined key="apply" /></NavLink>
                  </Tooltip>
                ]}
              >
                <Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.name}
                  description={
                    <div className="opportunity-detail-card">
                      <Row justify="space-between">
                        <Col span={2}>
                          <Tooltip placement="left" title="deadline">
                            <CalendarOutlined />
                          </Tooltip>
                        </Col>
                        <Col span={22}>
                          {moment.unix(item.preRequirementsDeadline).format("MM-DD-YYYY")}
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={2}>
                          <Tooltip placement="left" title="tags">
                            <TagOutlined />
                          </Tooltip>
                        </Col>
                        <Col span={22}>{tags(item.tags)}</Col>
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