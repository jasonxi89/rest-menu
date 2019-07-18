import React from 'react';
import axios from 'axios';

import './App.css';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {
        isLoading: false,
        data: [],
        error: null
      },
      detail: {
        isLoading: false,
        sn: "",
        data: [],
        error: null,
      }
    };
  }
  componentDidMount() {
    this.setState({
      category: {
        isLoading: true,
        data: this.state.category.data,
        error: null
      }
    });
    axios.get("http://stream-restaurant-menu-svc.herokuapp.com/category",{cancelToken: source.token})
      .then(res => {
        this.setState({
          category: {
            isLoading: false,
            data: res.data,
            error: null
          }
        });
      })
      .catch(error => {
        this.setState({
          category: {
            isLoading: false,
            error: error,
          }
        });
      });
  }

  componentWillUnmount(){
    source.cancel('Customer Exit!');
  }
  handleClick = (sn) => {
    this.setState({
      detail: {
        isLoading: true,
        sn: this.state.detail.sn,
        data: this.state.detail.data,
        error: null,
      }
    });
    axios.get(`https://stream-restaurant-menu-svc.herokuapp.com/item?category=${sn}`,{cancelToken: source.token})
      .then(res => {
        // console.log(res);
        this.setState(
          {
            detail: {
              isLoading: false,
              sn: sn,
              data: res.data,
              error: null
            }
          }
        );
      })
      .catch(error => {
        this.setState(
          {
            detail: {
              isLoading: false,
              sn: this.state.detail.sn,
              data: this.state.detail.data,
              error: error
            }
          }
        );
      });
  };

  render() {
    const {category: { data, isLoading },detail} = this.state;
    return (
      <div className="App">
        <h4 className="head">Menu Categories</h4>
        <div className="container">
          <div className="items">
            {isLoading ? <h4>Menu Is Loading...</h4> : 
              <ul>
                {data.map((c, i) => {
                  return <li key={i} onClick={() => this.handleClick(c.short_name)}>{`${c.name} - (${c.short_name})`}</li>
                })}
              </ul>}
          </div>
          
          {detail.data.length ?
            <div className="details">
              <h4>{`Items in Category: (${detail.sn})`}</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.data.map((d, i) => {
                    return (
                      <tr key={i}>
                        <td>{d.name}</td>
                        <td>{d.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
                </table>
              </div>:null}
        </div>
      </div>
    );
  }

}

export default App;
