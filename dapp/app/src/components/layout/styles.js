import styled from 'styled-components';
import { Layout, Button } from 'antd';
import { ReactComponent as Icon } from '../../assets/akasify_icon.svg'
import { ReactComponent as Logo } from '../../assets/akasify_logo.svg'

const HeaderWrapper = styled(Layout.Header)`
  background-color: #F26B55;
  position: fixed;
  z-index: 1;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const Navigation = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  margin-right: 20px;
`;

const SignInButton = styled(Button)`
  width: 100%;
`;

const AkasifyIcon = styled(Icon)`
  height: 35px;
  margin-right: 15px;
  fill: #c3c4c5
`;

const AkasifyLogo = styled(Logo)`
  height: 45px;
  fill: #1890ff;
`;

export default {
  HeaderWrapper,
  Header,
  Navigation,
  Image,
  SignInButton,
  AkasifyLogo,
  AkasifyIcon,
};