import React, { useState, useEffect } from 'react'
import { Layout, Row, Typography } from 'antd'
import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useTranslation } from 'react-i18next'
import StyledComponents from './styles'
import SignUp from '../signUp/signUp.component'

const { StyledContent, ButtonsWrapper, StyledButton, Image, StyledColLeft, StyledColRight, RegisterWrapper } = StyledComponents
const { Title, Paragraph } = Typography

const { useDrizzle } = drizzleReactHooks

function OrganizationPage() {

    const { drizzle } = useDrizzle()
    const [balance, setBalance] = useState()
    const { t } = useTranslation()

    async function getBalance() {
        const balance = 4 //await drizzle.contracts.SimpleStorage.methods.get().call();
        setBalance(balance);
    }

    useEffect(() => {    
        getBalance();
    }, []);

    return balance ? (
        <StyledContent>
        <RegisterWrapper>
          <Row gutter={50}>
            <StyledColLeft className="gutter-row" span={12}>
              <Title>{t('layout.title')}</Title>
              <Paragraph>{t('layout.description')}</Paragraph>
              <ButtonsWrapper>
                <SignUp />
                <StyledButton size="large" disabled={true}>Take a tour</StyledButton>
              </ButtonsWrapper>
            </StyledColLeft>
          </Row>
        </RegisterWrapper>
      </StyledContent>
    ) : (
        <div className="section">
            <h5 className="section-header info-color white-text text-center py-4">
                <strong>Loading...</strong>
            </h5>
        </div>
    );
}

export default OrganizationPage