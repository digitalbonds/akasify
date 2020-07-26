import React from 'react'
import { drizzleConnect } from '@drizzle/react-plugin'
import { NavLink } from 'react-router-dom'
import { drizzleReactHooks } from '@drizzle/react-plugin'
import { Menu, Popover, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import SignIn from '../signIn/signIn.component'
import Box from '3box'
import ProfileHover from 'profile-hover'

import StyledComponents from './styles'
import { addBox } from '../../actions/box'
const { useDrizzle } = drizzleReactHooks

const { HeaderWrapper, Header, Navigation, AkasifyIcon, AkasifyLogo } = StyledComponents

const Navbar = () => {

    const { drizzle } = useDrizzle()

    /*const login = async () => {
        let accounts = await drizzle.web3.eth.getAccounts()
        let account = accounts[0] 
        console.log('account', accounts[0])
        console.log('window', drizzle)
        window.ethereum
          .enable()
          .then(async () => {
            const ipfs = await Box.getIPFS();
            console.log(ipfs);
            window.box.auth([], { address: account, provider: window.ethereum });
            window.box.onSyncDone(() => {
              //setBoxSyncDone(true);
            });
          })
          .catch(console.error);
          
    }*/

    const getAddress = async () => {
        let accounts = await drizzle.web3.eth.getAccounts()
        return accounts[0]
    }

    const auth3box = async () => {
        console.log('drizzle before', drizzle)
        let accounts = await drizzle.web3.eth.getAccounts()
        const address = accounts[0]
        const spaces = ['akasify']
        const box = await Box.create(window.ethereum)
        await box.auth(spaces, { address })
        await box.syncDone

        console.log('box', box)
        //dispatch({ type: 'ADD_BOX' })
        //addBox(box)
        console.log('drizzle after', drizzle)
        //this.setState({ box })
    }


    return (
        <HeaderWrapper>
            <Header>
                <Navigation>
                <AkasifyIcon />
                <Menu mode="horizontal" style={{backgroundColor: '#F26B55'}}>
                    <Menu.Item key="1">
                        <NavLink style={{color: '#F6EAD1'}} className="nav-link" to="/">About</NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <NavLink style={{color: '#F6EAD1'}} className="nav-link" to="/">How it works?</NavLink>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <NavLink style={{color: '#F6EAD1'}} className="nav-link" to="/">Community</NavLink>
                    </Menu.Item>
                </Menu>
                </Navigation>
                <Popover placement="bottomRight" content={<SignIn />} trigger="click">
                    <Button type="primary" shape="circle" style={{color: '#3A2040', backgroundColor: '#F6EAD1', borderColor: '#F6EAD1'}} icon={<UserOutlined />} />
                </Popover>
                {/* <Button type="primary" shape="circle" icon={<UserOutlined />} onClick={<SignIn />} /> */}
                
            </Header>
        </HeaderWrapper>
    )
}

const mapDispachToProps = dispatch => {
    return {
        addBox: (box) => dispatch({ type: 'ADD_BOX', value: box })
    }
}

export default Navbar
//export default drizzleConnect(mapDispachToProps)(Navbar);