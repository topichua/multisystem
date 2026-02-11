import { PhoneInput as PhoneInputLibrary } from 'react-international-phone';
import styled from 'styled-components';
import 'react-international-phone/style.css';

export const PhoneInput = styled(PhoneInputLibrary)`
  .react-international-phone-input {
    width: 100%;
    border-radius: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
