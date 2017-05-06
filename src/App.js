import React, { Component } from 'react';
import {HashRouter as Router, Route, browserHistory, Link} from 'react-router-dom';
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

class StoryPage extends Component {
  render(){
    return (
    <div>
      Story Page is now in construction...
    </div>)
  }
}

class AppHeader extends Component {
  render(){
    return (
      <div className="App-header">
        <Link to="/" className="Logo"><img src={require('./images/logo-search.png')} /></Link>
        <div className="SearchBox">
          <input className="searchInput form-control" placeholder="Search for items or shops" type="text" />
          <button type="button" className="searchBtn btn btn-secondary">
            Search
          </button>
        </div>
        <div className="headerRightColumn"></div>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [{
          name: 'Straw Tote',
          media: [image1],
          price: '$98.00',
          uid: 'bag1',
          description: "Fancy shmancy straw for divas! Available only in beige and black, but fabulous with any outfits.",
          continentSales: ['1500', '50000', '3000', '0', '0', '200'],
          continentSalesTxt: ['1.500', '50.000', '3.000', '0', '0', '200']
        }, {
          name: 'Handwoven Picnic Bag',
          media: [image2],
          price: '$87.00',
          uid: 'bag2',
          description: "Fancy shmancy straw for divas! Available only in beige and black, but fabulous with any outfits.",
          continentSales: ['20500', '5000', '1000', '500', '0', '20000'],
          continentSalesTxt: ['25.000', '5.000', '1.000', '500', '0', '20.000']
        }, {
          name: 'Red Glamour Bag',
          media: [image3],
          price: '$76.00',
          uid: 'bag3',
          continentSales: ['65', '1000', '33000', '60000', '6000', '2500'],
          continentSalesTxt: ['65', '1.000', '33.000', '60.000', '6.000', '2.500']
        }, {
          name: 'Brown Pull-Over Tote',
          media: [image4],
          price: '$55.00',
          uid: 'bag4',
          continentSales: ['15000', '500', '21000', '870', '0', '2000'],
          continentSalesTxt: ['15.000', '500', '21.000', '870', '0', '2.000']
        }, {
          name: 'Blue Chic Handbag',
          media: [image5],
          price: '$76.00',
          uid: 'bag5',
          continentSales: ['1500', '50000', '3000', '0', '0', '200'],
          continentSalesTxt: ['1.500', '50.000', '3.000', '0', '0', '200']
        }, {
          name: 'Summer Orange Handbag',
          media: [image6],
          price: '$88.00',
          uid: 'bag6',
          continentSales: ['80000', '900', '39000', '15500', '7700', '0'],
          continentSalesTxt: ['80.000', '900', '39.000', '15.500', '7.700', '0']
        }, {
          name: 'Banana Picnic Bag',
          media: [image7],
          price: '$109.00',
          uid: 'bag7',
          continentSales: ['190', '50000', '30000', '5000', '150000', '2000'],
          continentSalesTxt: ['190', '50.000', '30.000', '5.000', '150.000', '2.000']
        }, {
          name: 'Pretty and Purple Handbag',
          media: [image8],
          price: '$76.00',
          uid: 'bag8',
          continentSales: ['47000', '8000', '3500', '0', '2570', '53000'],
          continentSalesTxt: ['47.000', '8.000', '3.500', '0', '2.570', '53.000']
        }, {
          name: 'Classic Picnic Bag',
          media: [image9],
          price: '$56.00',
          uid: 'bag9',
          continentSales: ['11500', '50', '300', '8000', '0', '2500'],
          continentSalesTxt: ['11.500', '50', '3000', '8.000', '0', '2.500']
        }
      ],
    }
  }
  
  addNewData(detail){
    const data = this.state.data.slice();
    this.setState({
      data: data.concat([{
        name: detail.name,
        media: detail.media,
        price: detail.price,
        uid: detail.uid,
        filter: detail.filter,
        continentSales: detail.continentSales,
        continentSalesTxt: detail.continentSalesTxt
      }]),
    });
  }
  
  render() {
    
    return (
      <div className="App">
        <Router history={browserHistory}>
          <div>
            <Route path="/" component={AppHeader} />
            <Route exact path="/" render={() => (<StorePage data={this.state.data}/>)}/>
            <Route path="/newproduct" render={(props) => (<ProductPage {...props} addNewData={(detail) => this.addNewData(detail)}/>)}/>
            <Route path="/products/:uid" render={(props) => (<ProductPage {...props} data={this.state.data}/>)}/>
            <Route path="/story" component={StoryPage} />
          </div>
        </Router>
      </div>
    );
  }
}




export default App;
