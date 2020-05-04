import React from 'react';
import stock from '../apis/stock';
import '../css/SearchCard.css';
import '../css/styles.css';
import { FaSearch } from 'react-icons/fa'

class SearchCard extends React.Component{

    // TODO: no duplicate stock

    state = {
        search_stockArray: []
    };

    // @desc: componentDidMount disables the button search when page loads.
    componentDidMount(){
        document.querySelector(".btn-search").disabled = true;
    }

    // @desc: componentDidUpdate checks for the value of button and removes
    //        the disabled state.
    componentDidUpdate(){
        if(document.querySelector(".btn-search").value === ''){
            document.querySelector(".btn-search").disabled = true;
        }
    }

    // @desc: when the button is pressed, this runs the API call which checks
    //        for the user's input of the stock code and gets the latest value
    //        by looking at it's current date and 24 hours of endDate. This calls
    //        the tableData and graphData and sends it back up to App.js as props.
    //        It also makes the input null, and also checks if the stock code exists
    //        within the API.
    sendSearchResult = async () => {
        let stockValue = document.querySelector(".stock-code__value").value.toUpperCase();
        let startDate = Math.round(new Date().getTime() / 1000);
        let endDate = startDate - (72 * 3600);

        const table_response = await stock.get('/quote', {
            params: {
              symbol: stockValue,
              token: 'bqhq9i7rh5rbubolrqd0'
            }
        });

        const graph_response = await stock.get('/stock/candle', {
            params: {
              symbol: stockValue,
              resolution: 5,
              from: endDate,
              to: startDate,
              token: 'bqhq9i7rh5rbubolrqd0'
            }
        });
                
        this.setState({
            search_stockArray: this.state.search_stockArray.concat(stockValue),
        }, () => {
            this.props.sendSearchResult(table_response.data);
            if(table_response.data === "Symbol not supported"){
                this.props.sendSearchGraphResult(true, {stockValue: stockValue, response: graph_response.data});
            }else{
                this.props.sendSearchGraphResult(false, {stockValue: stockValue, response: graph_response.data});
            }
            document.querySelector(".stock-code__value").value = '';
        })
    };

    // @desc: validateBtn checks for the onKeyUp change of the input and disables
    //        or removes the disable of the button.

    // @param: val => string of the input
    validateBtn = (val) => {
        let btnDOM = document.querySelector(".btn-search");
        val === '' || val.length > 4 ? btnDOM.disabled = true : btnDOM.disabled = false;
    };

    render(){
        return (
            <div className="card card-container search">
                <div className="card-body">
                    <h2 className="h6 mb-0">Search Stock Code:</h2>
                    <input type="text" 
                           className="form-control stock-code__value" 
                           placeholder="Stock Code (e.g. AAPL)" 
                           onKeyUp={ (e) => this.validateBtn(e.target.value) }>
                    </input>
                    <button className="btn btn-secondary w-100 btn-search" onClick={ this.sendSearchResult }>Search Results<FaSearch /></button>
                </div>
            </div>
        );
    };
};

export default SearchCard;