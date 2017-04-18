import React, { Component } from 'react';
import {BrowserRouter as Router, Route, browserHistory, Link} from 'react-router-dom';
import './App.css';
import StorePage from './StorePage';
import ProductPage from './ProductPage';
import image1 from './images/product_images/bag1.jpg'
import image2 from './images/product_images/bag2.jpg'
import image3 from './images/product_images/bag3.jpg'
import image4 from './images/product_images/bag4.jpg'
import image5 from './images/product_images/bag5.jpg'

const data = [
    {
      id: 1,
      name: 'Honda Accord Crosstour',
      year: '2010',
      model: 'Accord Crosstour',
      make: 'Honda',
      media: image1,
      price: '$16,811',
      uid: 'honda'

    },
    {
      id: 2,
      name: 'Mercedes-Benz AMG GT Coupe',
      year: '2016',
      model: 'AMG',
      make: 'Mercedes Benz',
      media: image2,
      price: '$138,157',
      uid: 'benz'

    },
    {
      id: 3,
      name: 'BMW X6 SUV',
      year: '2016',
      model: 'X6',
      make: 'BMW',
      media: image3,
      price: '$68,999',
      uid: 'bmw'
    },
    {
      id: 4,
      name: 'Ford Edge SUV',
      year: '2016',
      model: 'Edge',
      make: 'Ford',
      media: image4,
      price: '$36,275',
      uid: 'ford'
    },
    {
      id: 5,
      name: 'Dodge Viper Coupe',
      year: '2017',
      model: 'Viper',
      make: 'Dodge',
      media: image5,
      price: '$123,890',
      uid: 'viper'
    }
];

class AppHeader extends Component {
  render(){
    return (
      <div className="App-header">
        <Link to="/" className="Logo"><img src={require('./images/logo-search.png')} /></Link>
        <div className="SearchBox"><img src={require('./images/search-box.png')} /></div>
      </div>
    );
  }
}

class App extends Component {
  
  render() {
    
    return (
      <div className="App">
        <Router history={browserHistory}>
          <div>
            <Route path="/" component={AppHeader} />
            <Route exact path="/" render={() => (<StorePage data={data}/>)}/>
            <Route path="/newproduct/:sid" render={(props) => (<ProductPage {...props} />)}/>
            <Route path="/products/:uid" render={(props) => (<ProductPage {...props} data={data}/>)}/>
          </div>
        </Router>
      </div>
    );
  }
}




export default App;
