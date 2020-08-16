<div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      </div>

      {/*
          🎛 this scaffolding is full of commonly used components
          this <Contract/> component will automatically parse your ABI
          and give you a form to interact with it locally
      */}

      <Contract name="YourContract" signer={userProvider.getSigner()} provider={localProvider} address={address} />

      <Hints address={address} yourLocalBalance={yourLocalBalance} price={price} mainnetProvider={mainnetProvider} />

      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} />
          </Col>

          <Col span={8} style={{textAlign:"center", opacity:0.8}}>
            <GasGauge gasPrice={gasPrice}/>
          </Col>
          <Col span={8} style={{textAlign:"center", opacity:1}}>
            <Button onClick={()=>{window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA")}} size="large" shape="round">
              <span style={{marginRight:8}} role="img" aria-label="support">💬</span>
              Support
            </Button>
          </Col>
        </Row>

        <Button>Hello</Button>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              (localProvider && !process.env.REACT_APP_PROVIDER)?
              <Faucet localProvider={localProvider} price={price} />:
              ""
            }
          </Col>
        </Row>
      </div>