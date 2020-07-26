import styled from 'styled-components';
import { Button, Form } from 'antd';

const RegisterWrapper = styled.div`
  width: 50%;
  margin-right: 20px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  background: #3A2040;
  border-color: #3A2040;
`;

const StyledForm = styled(Form)`
  margin-top: 30px;
`;

export default {
  RegisterWrapper,
  StyledButton,
  StyledForm
};