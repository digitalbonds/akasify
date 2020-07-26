import React, { useState, useEffect } from 'react'
import { Layout, Row, Typography, Col } from 'antd'
import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useTranslation } from 'react-i18next'
import StyledComponents from './styles'
import akasifyCommunity from '../../assets/logo_with_phrase.png'
import SignUp from '../signUp/signUp.component'

const { StyledContent, ButtonsWrapper, StyledButton, Image, StyledColLeft, RegisterWrapper } = StyledComponents
const { Title, Paragraph } = Typography

const { useDrizzle } = drizzleReactHooks

function LandingPage() {

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
          <Row>
            <Col span={12} offset={6} className="gutter-row">
              <Image src={akasifyCommunity} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '60%'}} alt="Join our community" />
              <Paragraph style={{textAlign: 'justify', textJustify: 'inter-word'}}>{t('layout.description')}</Paragraph>
              <ButtonsWrapper>
                <SignUp />
                <StyledButton size="large" disabled={true}>Take a tour</StyledButton>
              </ButtonsWrapper>
            </Col>
          </Row>
        </RegisterWrapper>
      </StyledContent>
    ) : (
        <div className="section">
            <h5 className="section-header info-color white-text text-center py-4">
                <strong>{t('layout.loading')}...</strong>
            </h5>
        </div>
    );
}

export default LandingPage