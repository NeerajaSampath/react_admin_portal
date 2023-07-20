import { React, useEffect, useState } from "react";
import notify from "../../assets/img/notify.svg";
import avator from "../../assets/img/Avatar.svg";
import downarrow from "../../assets/img/dropdown.svg";
import styled from "styled-components";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL, SUB_URL, MAKER_URL } from "../../Constant";
var CryptoJS = require("crypto-js");

const Header = () => {
  const navigate = useNavigate();
  const [User_name, setUser_name] = useState("");
  useEffect(() => {
    if (sessionStorage.getItem("logindetails") != null) {
      const SECRET_KEY = `${process.env.REACT_APP_CRYPTO_SECRET}`;
      const encrypted_username = sessionStorage.getItem("logindetails");
      const username_decrypt = CryptoJS.AES.decrypt(
        encrypted_username,
        SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      setUser_name(username_decrypt.replace(/^"(.*)"$/, "$1"));
    }
  }, []);
  const LogoutHandle = () => {
    navigate(`/${SUB_URL}/${LOGIN_URL}`);
    sessionStorage.clear();
  };
  return (
    <NavbarStyle>
      <header className="custom-header">
        <div className="container-fluid">
          <div className="nav">
            <div>
              <h1 className="logo">Loyalty Program</h1>
              <span className="powerM2p">
                Powered by
                <br />
                m2p fintech
              </span>
            </div>
            <div>
              <div className="prfl_div">
                <div>
                  <img src={avator} alt="avator" />
                  <span className="avator-name">{User_name}</span>
                  <span className="dropdown">
                    <img src={downarrow} alt="dropdown" />
                  </span>
                </div>
                <div className="dropdown_profile">
                  <ul>
                    {/* <li><LockIcon sx={{fontSize: '0.875rem', marginRight: '7px'}} />Change Password</li> */}
                    <li onClick={LogoutHandle}>
                      <LogoutIcon
                        sx={{ fontSize: "0.875rem", marginRight: "7px" }}
                      />
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </NavbarStyle>
  );
};
export default Header;
export const NavbarStyle = styled.div`
  .custom-header {
    background: var(--brandWhite);
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.07);
    border-radius: 0px 0px 20px 20px;
    padding: 10px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .container-fluid {
      width: 100%;
      padding: 0 15px;
      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        div {
          display: flex;
          align-items: center;
          position: relative;
          .logo {
            font-family: "Ilisarniq";
            color: var(--primary);
            font-size: 18px;
            line-height: 22px;
          }
          .powerM2p {
            margin-left: 10px;
            padding-left: 10px;
            position: relative;
            color: var(--powerbym2p);
            font-size: 12px;
            &:before {
              content: "";
              width: 2px;
              height: 83%;
              position: absolute;
              left: 0px;
              top: 5px;
              right: 0;
              background: var(--lineColor);
            }
          }
          /* .notify{
                    position: relative;
                    margin-right: 30px;
                    cursor: pointer;
                    .notify-color{
                        width: 8px;
                        height: 8px;
                        background: var(--notifyRed);
                        border-radius: 100%;
                        position: absolute;
                        top: 1px;
                        right: 2px;
                        border: 1px solid var(--brandWhite);
                    }
                } */
          .avator-name {
            color: var(--avatorname);
            font-size: 14px;
            margin: 0 10px;
            cursor: pointer;
          }
          .prfl_div {
            position: relative;
            display: inline-block;
            vertical-align: top;
            &:hover {
              .dropdown_profile {
                opacity: 1;
                transition: 0.5s;
                visibility: visible;
              }
            }
            img {
              cursor: pointer;
            }
          }
          .dropdown {
            line-height: 0;
            cursor: pointer;
          }
          .dropdown_profile {
            position: absolute;
            background: #fff;
            padding: 10px 3px;
            /* bottom: -45px;
                    right: 0; */
            width: 100%;
            font-size: 0.875rem;
            line-height: 22px;
            color: #5c5776;
            border: none;
            box-shadow: 0px -5px 30px 0 rgb(31 45 61 / 10%);
            border-radius: 0.5rem;
            z-index: 9;
            opacity: 0;
            visibility: hidden;
            transition: 0.5s;
            display: block;
            &::before {
              position: absolute;
              top: -16px;
              right: 20px;
              display: inline-block;
              content: "";
              border: 8px solid transparent;
              border-bottom-color: #fff;
              content: "";
            }
            ul {
              list-style: none;
              li {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: 7px;
                transition: 0.5s;
                border-radius: 3px;
                &:hover {
                  background: #eee;
                  transition: 0.5s;
                }
              }
            }
          }
        }
      }
    }
  }
`;
