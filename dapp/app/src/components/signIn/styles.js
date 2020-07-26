import styled from 'styled-components';
import { Form, Button, Radio, Typography } from 'antd';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const RadioGroup = styled(Radio.Group)`
  margin-bottom: 12px;
`;

const Text = styled(Typography.Text)`
  margin-bottom: 12px;
`;

const SignInButton = styled(Button)`
  width: 100%;
`;

export default {
  StyledForm,
  SignInButton,
  RadioGroup,
  Text,
};