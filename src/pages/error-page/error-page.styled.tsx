import styled from 'styled-components';

export const ErrorPageStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 0px;
  .left {
    width: 65%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .content {
      display: flex;
      flex-direction: column;
    }
  }
  .right {
    display: flex;
    justify-content: center;
    width: 35%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
