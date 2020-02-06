import React, { useState, useRef, useEffect } from "react";
import "./Progress.scss";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import { compose } from "redux";
import { connect } from "react-redux";

const Progress = () => {
  
  const [value, setValue] = useState(64);
  const [start, setStart] = useState(false);
  const ref = useRef(null);
  const ref1 = useRef(null);

  const move = (e, v) => {
    if(v>100) {
      v=100;
    } else if(v<0) {
      v=0;
    }
    setValue(v)
    e.preventDefault();
    e.returnValue = false;
    return false
  }

  const mouseMove = (e) => {
    if(start) {
      let v
      v=Math.round(100-(e.clientY-ref.current.getBoundingClientRect().top)*100/ref.current.clientHeight);
      move(e, v);
    } 
  }
  const moveTo = (e) => {
    if(e.clientX>ref1.current.getBoundingClientRect().right ||
      e.clientX<ref1.current.getBoundingClientRect().left) return;
    setStart(true);
    let v
    v=Math.round(100-(e.clientY-ref.current.getBoundingClientRect().top)*100/ref.current.clientHeight);
    move(e, v);
  }
  const moveUp = (e) => {
    setStart(false);
  }
  
  const touchMove = (e) => {
    console.log(e)
    if(start) {
      let v
      if(e.touches) {
        v=Math.round(100-(e.touches[0].clientY-ref.current.getBoundingClientRect().top)*100/ref.current.clientHeight);
      } else {  
        v=0;
      }
      move(e, v);
    } 
  }
  const touchStart = (e) => {
    console.log(e)
    if(e.touches[0].clientX>ref1.current.getBoundingClientRect().right ||
      e.touches[0].clientX<ref1.current.getBoundingClientRect().left) return;
    setStart(true);
    let v=0
    if(e.touches) {
      v=Math.round(100-(e.touches[0].clientY-ref.current.getBoundingClientRect().top)*100/ref.current.clientHeight);
    }
    move(e, v);
  }
  useEffect(()=>{
    if(ref.current) {
      ref.current.addEventListener("touchstart", touchStart);
      ref.current.addEventListener("mousedown", moveTo);
      ref.current.addEventListener("mouseup", moveUp);
      ref.current.addEventListener("touchmove", touchMove, {
        passive: false
      });
      ref.current.addEventListener("mousemove", mouseMove, {
        passive: false
      });
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("touchstart", touchStart);
        ref.current.removeEventListener("mousedown", moveTo);
        ref.current.removeEventListener("mouseup", moveUp);
        ref.current.removeEventListener("touchmove", touchMove, {
          passive: false
        });
        ref.current.removeEventListener("mousemove", mouseMove, {
          passive: false
        });
      }
    };

  })
  return (
    <>
      <div className={start?"progress cursor":"progress"} ref={ref} >
        <div className="progress-label">
          <span>100</span>
          <span>0</span>
        </div>
        <div className="progress-bar" >
          <div className="value" style={{height: value+'%'}}>
            <div className="value-tag" ref={ref1}>
              <div className="div">
                <div className="arrow"></div>
                <span>{value}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bet-amount">
        <div className="value">
          <div className="label">BET AMOUNT</div>
          <div className="amount">
            <FontAwesomeIcon icon={faBitcoin} />
            <input className="amount-input" defaultValue="0.04885313" placeholder="Bet Amount" />
          </div>
        </div>
        <div className="sub-tag">
          1/2
        </div>
        <div className="sub-tag right-tag">
          x2
        </div>
      </div>
    </>
  );
};

const mapState = state => ({
});
const mapProps = {
};
const enhance = compose(connect(mapState, mapProps), withRouter);
export default enhance(Progress);
