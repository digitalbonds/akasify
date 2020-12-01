import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Layout, Typography, Form, Input, Button, Modal } from "antd";
import { useContractLoader, useEventListener } from "../hooks";
import { parcelConfig } from "../helpers/parcelConfig";
import { OidcClient, Log } from "oidc-client";
import oasisLogo from "../assets/images/oasis_logo.png";

const { Title, Paragraph, Text } = Typography;

function RegisterScreen ({
  address,
  userProvider,
  localProvider,
  tx
}) {

    let history = useHistory();
    const readContracts = useContractLoader(localProvider);
    const writeContracts = useContractLoader(userProvider);
    const oidcClient = new OidcClient(parcelConfig);

    //Listen for broadcast beneficiary events
    const setBeneficiaryEvents = useEventListener(readContracts, "AkasifyCoreContract", "RegisterBeneficiary", localProvider, 1);

    // MODAL
    const [oasisModalVisible, setOasisModalVisible] = useState(false);

    const [benForm] = Form.useForm();

    const onBenFinish = () => {
        if (localStorage.getItem('akasify-oasis-address') == "" && localStorage.getItem('akasify-oasis-token') == "") {
            setOasisModalVisible(true);
        } else {
            tx(writeContracts['AkasifyCoreContract'].registerBeneficiary(localStorage.getItem('akasify-oasis-address')));
        }
    };

    // OASIS PARCEL    
    const obtainIdToken = async () => {
        localStorage.setItem('akasify-oasis-previous', history.location.pathname);
        const request = await oidcClient.createSigninRequest();
        window.location.assign(request.url);
    }

    useEffect(() => {
        if (setBeneficiaryEvents && setBeneficiaryEvents[0] && setBeneficiaryEvents[0].account == address) {       
            console.log("previous page in register: ", localStorage.getItem('akasify-page-previous'));
            history.push(localStorage.getItem('akasify-page-previous'));
        }
    }, [setBeneficiaryEvents]);

  return (
    <Layout className="site-layout">
        <Row justify={"center"} gutter={[100, 16]}>
            <Col span={12}>
                <Typography>
                    <Title style={{ textAlign: "center" }} level={3}>Beneficiary</Title>
                </Typography>
                <Paragraph>
                    <Text>
                        To apply for opportunities, you need to be registered as beneficiary with your ETH address.
                    </Text>
                </Paragraph>
                <Form
                    layout="vertical"
                    form={benForm}
                    onFinish={onBenFinish}
                >
                    <Form.Item
                        name="ben-account"
                        label="Account"
                        valuePropName="ben-account"
                    >
                        <Input
                            placeholder="eth address"
                            disabled={true}
                            value={address} />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit">{
                            localStorage.getItem('akasify-oasis-address') == "" && localStorage.getItem('akasify-oasis-token') == "" ? "Sign Oasis" : "Register"
                        }</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
        <Modal
            title="Data Privacy"
            visible={oasisModalVisible}
            onOk={obtainIdToken}
            onCancel={ () => { setOasisModalVisible(false) } }
        >
            <img src={oasisLogo} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '25px', width: '50%'}} alt='Oasis Labs' />
            <Paragraph>
                Here at Akasify, your privacy is very important to us. We've partned with
                Oasis Labs so you can own your application sensitive data from our app.
            </Paragraph>
            <Paragraph>
                To set up or Login your Oasis account, click Ok
            </Paragraph>
        </Modal>
    </Layout>
  )
}

export default RegisterScreen;