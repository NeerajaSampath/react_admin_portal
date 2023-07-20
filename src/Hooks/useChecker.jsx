import { useContext } from "react";
import CheckerContext from "../Context/CheckerProvider";

const useChecker = ()=>{
    return useContext(CheckerContext);
}

export default useChecker;