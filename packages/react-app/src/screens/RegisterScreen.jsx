import React from 'react';
import { useHistory } from "react-router-dom";
import { Row, Col, Layout, Typography, Form, Input, Button } from 'antd';
import { useContractLoader, useEventListener } from "../hooks";
import { useEffect } from 'react';
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

    //📟 Listen for broadcast events
  const setBeneficiaryEvents = useEventListener(readContracts, "AkasifyCoreContract", "RegisterBeneficiary", localProvider, 1);

    const [benForm] = Form.useForm();

    const onBenFinish = () => {
        tx(writeContracts['AkasifyCoreContract'].registerBeneficiary());
    };

    useEffect(() => {
        if (setBeneficiaryEvents && setBeneficiaryEvents[0] && setBeneficiaryEvents[0].account == address) {
            history.push("/sucess");
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
                        <Button type="primary" htmlType="submit">Register</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    </Layout>
  )
}

export default RegisterScreen;