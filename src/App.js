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
          description: "Fancy shmancy straw for divas! Available only in beige and black, but fabulous with any outfits."

        }, {
          name: 'Handwoven Picnic Bag',
          media: [image2],
          price: '$87.00',
          uid: 'bag2',
          description: "Fancy shmancy straw for divas! Available only in beige and black, but fabulous with any outfits."
        }, {
          name: 'Red Glamour Bag',
          media: [image3],
          price: '$76.00',
          uid: 'bag3'
        }, {
          name: 'Brown Pull-Over Tote',
          media: [image4],
          price: '$55.00',
          uid: 'bag4'
        }, {
          name: 'Blue Chic Handbag',
          media: [image5],
          price: '$76.00',
          uid: 'bag5'
        }, {
          name: 'Summer Orange Handbag',
          media: [image6],
          price: '$88.00',
          uid: 'bag6'
        }, {
          name: 'Banana Picnic Bag',
          media: [image7],
          price: '$109.00',
          uid: 'bag7'
        }, {
          name: 'Pretty and Purple Handbag',
          media: [image8],
          price: '$76.00',
          uid: 'bag8'
        }, {
          name: 'Classic Picnic Bag',
          media: [image9],
          price: '$56.00',
          uid: 'bag9'
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
