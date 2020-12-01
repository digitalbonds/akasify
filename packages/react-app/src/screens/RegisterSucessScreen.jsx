import React from "react";
import { Layout, Typography, Button, Result, Steps } from "antd";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
const { Paragraph, Text } = Typography;

const { Step } = Steps;

function RegisterSucessScreen () {

    const { t } = useTranslation()

    return (
        <Layout className="site-layout">
            <Result
                status="success"
                title={t('beneficiary_register_sucess_title')}
                subTitle={t('beneficiary_register_sucess_description')}
                extra={[
                    <NavLink to="/opportunity">
                        <Button type="primary" key="console">
                            Return to Opportunity
                        </Button>
                    </NavLink>,
                    <NavLink to="/">
                        <Button key="buy">Go Home</Button>
                    </NavLink>,
                ]}
            >
                <div className="desc">
                    <Paragraph>
                        <Text
                        strong
                        style={{
                            fontSize: 16,
                        }}
                        >
                        Please, bear in mind the following suggested steps to make your experience even better:
                        </Text>
                    </Paragraph>
                    <Paragraph>
                        <Steps direction="vertical" current={1} percent={0}>
                            <Step title="Register" description="Register as beneficiary." />
                            <Step title="Apply" description="Apply to opportunities and complete all the pre-requirements." />
                            <Step title="Receive" description="Receive an opportunity, and complete all the post-requirements to improve your chances in your next opportunities." />
                        </Steps>
                    </Paragraph>
                </div>
            </Result>
        </Layout>
    )

}

export default RegisterSucessScreen;