import React from "react";
import "./BetsDataTable.scss";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import { compose } from "redux";
import { connect } from "react-redux";
import { gql } from "apollo-boost";
import { useQuery, useSubscription } from "@apollo/react-hooks";

const EXCHANGE_RATES = gql`
  {
    bets {
      id
      time
      name
      game
      bet
      payout
      profit
    }
  }
`;
const COMMENTS_SUBSCRIPTION = gql`
  subscription onBetAdded {
    betAdded {
      id
      time
      name
      game
      bet
      payout
      profit
    }
  }
`;
const BetsDataTable = () => {
  
  var originData = useQuery(EXCHANGE_RATES).data;
  
  
  const { loading, data: betAdded } = useSubscription(
    COMMENTS_SUBSCRIPTION
  );
  if(!loading) {
    originData.bets.push(betAdded.betAdded);
    if(originData.bets.length > 11) {
      originData.bets.splice(0, 1)
    }
  }
  

  return (
    <>
      <table>
        <thead>
          <tr>
            <th className="td-1">TIME</th>
            <th className="td-2 hide-mobile">BET</th>
            <th className="td-3 hide-mobile">MULTIPLER</th>
            <th className="td-4">PROFIT</th>
          </tr>
        </thead>
        <tbody>
          {originData &&
            originData.bets.map((item, index) => {
              return (
                <tr key={index} className={index===originData.bets.length-1?"new-bet":""}>
                  <td className="td-1">
                    {new Date(item.time).toLocaleString("en-GB")}
                  </td>
                  <td className="td-2 hide-mobile">
                    <FontAwesomeIcon icon={faBitcoin} />
                    {item.bet / 1000}
                  </td>
                  <td className="td-3 hide-mobile">x{item.payout / 4}</td>
                  <td className={item.profit < 0 ? "td-4 negative" : "td-4"}>
                    <FontAwesomeIcon icon={faBitcoin} />
                    {item.profit / 1000}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

const mapState = state => ({});
const mapProps = {};
const enhance = compose(connect(mapState, mapProps), withRouter);
export default enhance(BetsDataTable);
