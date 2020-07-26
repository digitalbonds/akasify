import React, { useState, useEffect } from 'react'
import { drizzleReactHooks } from "@drizzle/react-plugin"
import { useTranslation } from 'react-i18next'
import StyledComponents from './styles'
import { Button, Modal, Typography, Form, Input, Result } from 'antd';
import 'antd/dist/antd.css'

const { Paragraph, Text } = Typography;
const { RegisterWrapper, StyledButton, StyledForm } = StyledComponents;

const { useDrizzle } = drizzleReactHooks

function SignUp() {

    const ethereumAddress = "";
    const [showMetamaskWarning, setShowMetamaskWarning] = useState(false);
  const [registerForm] = Form.useForm();
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [isProcessingRegistration, setIsProcessingRegistration] = useState(false);
  const [isSuccessRegistered, setIsSuccessRegistered] = useState(false);
  const [buttonText, setButtonText] = useState('Sign In');

    const { drizzle } = useDrizzle();
    const [balance, setBalance] = useState()
    const { t } = useTranslation()

    const getModalTitle = () => {
        if (isSuccessRegistered) {
            return 'Congratulations';
        }

        return 'Register';
    }

    const getModalText = () => {
        if (isSuccessRegistered) {
            return (
            <Result
                status="success"
                title="Successfully Registered"
            />
        )}
        return 'Register your organization';
    }
    
    const toggleModalVisibility = (isVisible) => {
        setRegisterModalVisible(isVisible);
      };
    
    const handleSubmit = async () => {
    
    };

    return (
        <RegisterWrapper>
            <StyledButton size="large" type="primary" onClick={() => toggleModalVisibility(true)}>
                Register
            </StyledButton>
            <Modal
                title={getModalTitle()}
                visible={registerModalVisible}
                onCancel={() => toggleModalVisibility(false)}
                footer={[
                <Button key="cancel" onClick={() => toggleModalVisibility(false)}>
                    Cancel
                </Button>,
                <Button key="register" type="primary" disabled={isSuccessRegistered} loading={isProcessingRegistration} onClick={() => handleSubmit()}>
                    {buttonText}
                </Button>,
                ]}
            >
                <Paragraph>
                {getModalText()}
                </Paragraph>
                {ethereumAddress && <Text strong>Your ethereum address: {ethereumAddress}</Text>}
                {showMetamaskWarning && <Text type="warning">You need to enable Metamask to register the account and create your Token</Text>}
                {
                !isSuccessRegistered &&
                <StyledForm form={registerForm} name="register">
                    <Form.Item
                    name="email" 
                    rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                    <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                    name="name" 
                    rules={[{ required: true, message: 'Please input your organization name!' }]}
                    >
                    <Input placeholder="Organization Name" />
                    </Form.Item>

                    <Form.Item
                    name="password" 
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                    <Input.Password placeholder="Password" />
                    </Form.Item>
                </StyledForm>
                }
            </Modal>
        </RegisterWrapper>
    )
}

export default SignUp