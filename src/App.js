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
import image6 from './images/product_images/bag6.jpg'
import image7 from './images/product_images/bag7.jpg'
import image8 from './images/product_images/bag8.jpg'
import image9 from './images/product_images/bag9.jpg'

const data = [
    {
      id: 1,
      name: 'Straw Tote',
      year: '2010',
      model: 'Tote',
      make: 'Straw',
      media: image1,
      price: '98.00',
      uid: 'bag1',
      description: "Fancy shmancy straw for divas! Available only in beige and black, but fabulous with any outifts."

    },
    {
      id: 2,
      name: 'Handwoven Picnic Bag',
      year: '2016',
      model: 'Picnic Bag',
      make: 'Straw',
      media: image2,
      price: '87.00',
      uid: 'bag2',
      description: "Fancy shmancy straw for divas! Available only in beige and black, but fabulous with any outifts."


    },
    {
      id: 3,
      name: 'Red Glamour Bag',
      year: '2017',
      model: 'Glamour',
      make: 'Straw',
      media: image3,
      price: '76.00',
      uid: 'bag3'
    },
    {
      id: 4,
      name: 'Brown Pull-Over Tote',
      year: '2015',
      model: 'Pull-Over',
      make: 'Straw',
      media: image4,
      price: '55.00',
      uid: 'bag4'
    },
    {
      id: 5,
      name: 'Blue Chic Handbag',
      year: '2017',
      model: 'Chic',
      make: 'Straw',
      media: image5,
      price: '76.00',
      uid: 'bag5'
    },
    {
      id: 6,
      name: 'Summer Orange Handbag',
      year: '2017',
      model: 'Summer',
      make: 'Straw',
      media: image6,
      price: '88.00',
      uid: 'bag6'
    },
    {
      id: 7,
      name: 'Banana Picnic Bag',
      year: '2017',
      model: 'Banana',
      make: 'Straw',
      media: image7,
      price: '109.00',
      uid: 'bag7'
    },
    {
      id: 8,
      name: 'Pretty and Purple Handbag',
      year: '2017',
      model: 'Pretty and Purple',
      make: 'Straw',
      media: image8,
      price: '76.00',
      uid: 'bag8'
    },
    {
      id: 9,
      name: 'Classic Picnic Bag',
      year: '2017',
      model: 'Classic',
      make: 'Straw',
      media: image9,
      price: '56.00',
      uid: 'bag9'
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
