import { ButtonArea } from "./Components/Common/Elements";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { SUB_URL } from "./Constant";
import useAuth from "./Hooks/useAuth";

export const ErrorPage = (props) => {
  const { setunauth } = useAuth();
  const CustomNavigate = useNavigate();
  const Goback = () => {
    CustomNavigate(`/${SUB_URL}`);
    setunauth(false);
  };
  return (
    <>
      <ErrorStyle>
        <span>{props.statusCode}</span>
        <h1>{props.msg}</h1>
        <p>{props.description}</p>
        <ButtonArea
          onClick={Goback}
          value="Go Back Home"
          className="GoBack"
          variant="contained"
        />
      </ErrorStyle>
    </>
  );
};
const ErrorStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
  span {
    font-size: 50px;
  }
  h1 {
    font-size: 35px;
    font-weight: 900;
  }
  p {
    margin: 15px 0;
  }
  .GoBack {
    margin-top: 10px;
  }
`;
