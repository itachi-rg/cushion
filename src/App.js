import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './css/bootstrap.css';

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
    var regexp = new RegExp(val,"ig");
    var highlighted = this.state.origresponse.replace(regexp,'<span class="highlight"><b>'+val+'</b></span>')
    this.setState({response:highlighted})
  }

  handleSubmit(event) {
    var proxyUrl = 'https://cryptic-headland-94862.herokuapp.com/',
    targetUrl = this.state.value
    fetch(proxyUrl + targetUrl)
    .then(blob => blob.text())
    .then(data => {
      var el = document.createElement('html');
      el.innerHTML = data;
      var textdata = (el.getElementsByTagName('body'))[0].innerText; // Live NodeList of your anchor elements
      var ell = document.createElement('div');
      ell.innerHTML = textdata
      var newtext = ell.innerText

    console.log("data" + textdata);
    this.setState({response:newtext})
    this.setState({origresponse:newtext})

    var words = textdata.split(/[^a-zA-Z]+/);
    var wordsMap = {};
    words.forEach(function (key) {
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
    })
    .catch(e => {
      console.log("error" + e);
      return e;
    });
    event.preventDefault();
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Cushion test</h1>
        </header>
        <br/>
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <label>
              Enter URL :
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <p>{this.state.value}</p>
            <input type="submit" value="Submit" />
          </form>
          <div className="Textview container-fluid pages_container">
          <p dangerouslySetInnerHTML={{__html: this.state.response}} />
        </div>
        <table class="table table-dark">{this.state.freq}</table>
        </div>
      </div>
    );
  }
}


export default App;
