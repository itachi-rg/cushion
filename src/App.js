import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './bootstrap.css';
import ReactDOM from 'react-dom'
import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'https://cushion.ai/', origresponse:'', response:'', freq:''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleWordClick(val) {
    console.log('clicked '+val)
    var re = new RegExp('\\b'+val+'\\b',"ig");
    var highlighted = this.state.origresponse.replace(re,'<span class="badge badge-success"><b>'+val+'</b></span>')
    window.scrollTo(0, 0)
    this.setState({response:highlighted})
  }

  handleSubmit(event) {
    var baseUrl = 'proxyrequest?p='
    var proxyUrl = 'https://cryptic-headland-94862.herokuapp.com/',
    targetUrl = this.state.value
    var urltofetch = baseUrl+proxyUrl+targetUrl
    fetch(urltofetch)
    .then(blob => blob.text())
    .then(data => {
      if(data=="ERROR_FETCH") {
        this.setState({response:"Please Enter A Valid URL"})
        this.setState({freq:listview})
      } else {
      
        this.setState({response:data})
        this.setState({origresponse:data})

        var wordsArray = data.split(/[^a-zA-Z]+/);
        var wordsMap = {};
        wordsArray.forEach(function (key) {
          key = String(key).toUpperCase();
          if (wordsMap.hasOwnProperty(key)) {
            wordsMap[key]++;
          } else {
            wordsMap[key] = 1;
          }
        });

        var finalWordsArray = [];
        finalWordsArray = Object.keys(wordsMap).map(function (key) {
          return {
            name: key,
            total: wordsMap[key]
          };
        });

        finalWordsArray.sort(function (a, b) {
          return b.total - a.total;
        });

        var listview = []
        for (var i = 0; i < 10; i++) {
          var word = finalWordsArray[i].name
          var count = finalWordsArray[i].total

          listview.push(<tr onClick={this.handleWordClick.bind(this,word)}><td>{word}</td><td>{count}</td></tr>)
        }

        this.setState({freq:listview})
      }
    })
    .catch(e => {
      console.log("Caught error" + e);
      this.setState({freq:[]})
      return e;
    });
    event.preventDefault();
  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Cushion Test</h1>
        </header>
        <br/>
        <div className="container">
        <form class="form-group" onSubmit={this.handleSubmit}>
        <label >
          Enter URL :
          <input class="form-control" type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <p>{this.state.value}</p>
        <input class="btn btn-info" type="submit" value="Submit" />
      </form>
      <div class="card">
      <div class="card-body" dangerouslySetInnerHTML={{__html: this.state.response}} ></div>
      </div>
      <hr/>
      <table class="table table-dark">{this.state.freq}</table>
      </div>
      </div>

    );
  }
}


export default App;

