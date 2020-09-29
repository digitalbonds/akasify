import React from 'react'
import { Row, Col, Drawer, Button, Divider } from 'antd';
import PropTypes from 'prop-types';
import AkAddress from "./AkAddress";
import Balance from "./Balance";
import Wallet from "./Wallet";
import Isotype from "../assets/images/isotype.png";

const ProfileDrawer = ({
    show,
    handleOnClose,
    address,
    userProvider,
    localProvider,
    mainnetProvider,
    price,
    minimized,
    role,
    web3Modal,
    loadWeb3Modal,
    logoutOfWeb3Modal
}) => {

    const modalButtons = [];
    if (web3Modal) {
        if (web3Modal.cachedProvider) {
        modalButtons.push(
            <Button
            key="logoutbutton"
            style={{ verticalAlign: "top", marginLeft: 0, marginTop: 4 }}
            size="large"
            onClick={logoutOfWeb3Modal}
            >
            logout
            </Button>,
        );
        } else {
        modalButtons.push(
            <Button
            key="loginbutton"
            style={{ verticalAlign: "top", marginLeft: 0, marginTop: 4 }}
            size="large"
            type={minimized ? "default" : "primary"}
            onClick={loadWeb3Modal}
            >
            connect
            </Button>,
        );
        }
    }

    return (
        <Drawer
            width={412}
            data-testid = 'profile-drawer'
            title = 'Profile'
            visible = {show}
            onClose = {handleOnClose}
            maskClosable = {true}
        >
            <Row justify="center">
                <Col span={4}>
                    <img
                        src={Isotype}
                        alt="Profile"
                        style={{
                            borderRadius: '50%',
                            width: '100px',
                            height: '100px'
                        }}
                    />
                </Col>
            </Row>
            <Divider orientation="center">{role}</Divider>
            <Row>
                <Col span={9}>
                    <h3>Address:</h3>
                </Col>
                <Col span={15}>
                    {address ? <AkAddress value={address} ensProvider={mainnetProvider} /> : "Connecting..."}
                </Col>
            </Row>
            <Row justify="center">
                <Col span={6}>
                    {modalButtons}
                </Col>
            </Row>
            <Divider orientation="center">Last appllications</Divider>
            <Divider orientation="center">Balance</Divider>
            <Row>
                <Col span={9}>
                    <h3>Available:</h3>
                </Col>
                <Col span={15}>
                    <Balance address={address} provider={localProvider} dollarMultiplier={price} />
                    <Wallet address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} />
                </Col>
            </Row>
        </Drawer>
    );
};

ProfileDrawer.propTypes = {
    show: PropTypes.bool.isRequired,
    handleOnClose: PropTypes.func.isRequired
}

export default ProfileDrawer;