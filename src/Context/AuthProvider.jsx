import { createContext, useState, useEffect } from "react";
import { GetMasterConfig } from "../apiConfig";
import axios from "../api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState("");
  const [username, setUsername] = useState();
  const [Masterget, setMasterget] = useState(false);
  const [refresh_Token, setrefresh_Token] = useState("");
  const [loading, setLoading] = useState(false);
  const [unauth, setunauth] = useState(false);
  const [ToastOpen, setToastOpen] = useState(false);
  const [master_update, setmaster_update] = useState([]);
  const [master_create_update, setmaster_create_update] = useState(false);
  const [Config_update, setConfig_update] = useState(false);
  useEffect(() => {
    MastergetAPI();
  }, [master_create_update]);
  const master_filter_myop =
    master_update.length !== 0
      ? master_update
          .filter((item) => item?.isEnabled === true)
          .map((items) => items?.isMYOPEnabled)
      : [false];
  const MastergetAPI = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `${GetMasterConfig}/0/5000`,
      });
      setmaster_update(res?.data?.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        Config_update,
        setConfig_update,
        auth,
        setAuth,
        username,
        setUsername,
        setMasterget,
        Masterget,
        refresh_Token,
        setrefresh_Token,
        loading,
        setLoading,
        unauth,
        setunauth,
        master_update,
        setmaster_update,
        ToastOpen,
        setToastOpen,
        master_create_update,
        setmaster_create_update,
        master_filter_myop,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
