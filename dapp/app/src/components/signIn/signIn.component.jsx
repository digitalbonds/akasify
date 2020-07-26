import React, { useState, useEffect } from 'react'
import { drizzleReactHooks } from "@drizzle/react-plugin"
import { useTranslation } from 'react-i18next'
import StyledComponents from './styles'
import { Form, Input, Radio } from 'antd'
import 'antd/dist/antd.css'

const { StyledForm, SignInButton, RadioGroup, Text } = StyledComponents;

const { useDrizzle } = drizzleReactHooks

function SignIn() {

    const { drizzle } = useDrizzle();
    const [balance, setBalance] = useState()
    const { t } = useTranslation()

    const showSignScreen = () => {
        console.log("yes")
    }

    return (
        <StyledForm name="sign_in" onClick={() => showSignScreen()}>
            <RadioGroup>
                <Radio value="organizations">Organizations</Radio>
                <Radio value="changeMakers">Change-makers</Radio>
            </RadioGroup>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password placeholder="Password" />
            </Form.Item>
            <SignInButton type="primary" htmlType="submit">
                Log In
            </SignInButton>
        </StyledForm>   
    )
}

export default SignIn