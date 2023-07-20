import React from "react";
import "./assets/Styles/style.css";
import loader from './assets/img/loader.gif';

function Loading() {
  return (
    <div className='overlay_div'>
    <img src={loader} alt='loading image' />
</div>
  );
}

export default Loading;
