import React, { useEffect } from "react";
import "./assets/Styles/style.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { LOGIN_URL, SUB_URL } from "./Constant";
import { ErrorBoundary } from "./ErrorBoundary";
import Login from "./Components/Login";
import Admin from "./Admin";
import useAuth from "./Hooks/useAuth";
import { CheckerProvider } from "./Context/CheckerProvider";
import Loading from "./Loading";
import { ErrorPage } from "./ErrorPage";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function App() {
  const location = useLocation();
  // const navigate = useNavigate();
  const { loading, unauth } = useAuth();
  useEffect(() => {
    if (window.location.reload) {
      // navigate(`/${SUB_URL}/${LOGIN_URL}`);
      // sessionStorage.clear();
    }
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CheckerProvider>
        <ErrorBoundary>
          {loading && <Loading />}
          {unauth ? (
            <ErrorPage
              statusCode="503"
              msg="Service Unavailable"
              description="Service Temporarily Unavailable"
            />
          ) : location.pathname === `/${SUB_URL}` ||
            location.pathname === `/${SUB_URL}/${LOGIN_URL}` ? (
            <Routes>
              <Route path={`/${SUB_URL}`} element={<Login />} />
              <Route
                path={`/${SUB_URL}/${LOGIN_URL}`}
                index
                element={<Login />}
              />
            </Routes>
          ) : (
            <Admin />
          )}
        </ErrorBoundary>
      </CheckerProvider>
    </LocalizationProvider>
  );
}

export default App;
