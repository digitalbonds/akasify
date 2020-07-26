import styled from 'styled-components';
import { Layout, Button, Col } from 'antd';


const StyledContent = styled(Layout.Content)`
  padding: 0px 50px 50px 50px;
`;

const RegisterWrapper = styled.div`
  margin-top: 0px;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
`;

const ButtonsWrapper = styled.div`
  margin-top: 40px;
  display: flex;
`;

const StyledButton = styled(Button)`
  width: 50%;
  margin-right: 20px;
`;

const Image = styled.img`
  width: 80%;
  height: auto;
`;

const StyledColLeft = styled(Col)`
  margin-top: 0px;
`;

export default {
  StyledContent,
  RegisterWrapper,
  ButtonsWrapper,
  StyledButton,
  Image,
  StyledColLeft,
};