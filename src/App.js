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


const popular_store_items = [
    {
      id: 1,
      name: 'Straw Tote',
      year: '2010',
      model: 'Tote',
      make: 'Straw',
      media: image1,
      price: '$98.00',
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
      price: '$87.00',
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
      price: '$76.00',
      uid: 'bag3'
    }
];


const reviewData = [
  {
    id: 1,
    stars: 1,
    text: "I did not like it, the color was not as shown and it was larger then described on the web site, I also did not receive any paperwork in the package."
  },
  {
    id: 2,
    stars: 2,
    text: "after one use the inside lining had holes in it! so disappointed because I love the look of it!"
  },
  {
    id: 3,
    stars: 3,
    text: "i doubt it will last more than a few months of the season,pretty cheaply made.price ok but i would pay more for a better bag,this is why i dont shop that much on sites that carry no name products."
  },
  {
    id: 4,
    stars: 4,
    text: "Who doesn't love a summer straw purse? This one is very roomy, the straps go comfortably on the shoulder or in the hand, and it's lined for extra sturdiness. The construction is the standard loose straw weave, and it should last a few years with care. I wish it had feet on the bottom and that the lining fabric was thicker, but for a classic summer bag this is it. I will heed the listing warning not to overload. I do adore the casual look and feel, as well as the pliability and softness of the straw. I'm torn between a four and five star rating. Five for looks, four for practicality. Really like, don't love this bag. If you're looking for a large bag for moderate use, get this."
  },
  {
    id: 5,
    stars: 5,
    text: "This bag is a perfect summer tote. It can be carried as a tote or as a hobo satchel. Perfect if your are into the bohemian look. Color is a natural looking straw with dark brown straps. It also has clasp on both in ends so that you can change the look from tote to satchel. It's lined with a paisley satin look fabric with two inside pouches. I would use caution with liquids inside the tote. Overall you won't regret your purchase."
  },
  {
    id: 6,
    stars: 5,
    text: "Straw bag arrived when it was supposed to. It is made of paper straw and does not fall out. It is somewhat stiff, but holds shape well. Lining is pretty paisley acetate and has helpful pockets and zipper."
  },
    {
    id: 7,
    stars: 5,
    text: "I ordered this item for a trip. When it first arrived I wondered how durable it would be. The first part of my trip involved an air flight. The bag can be used 2 ways and I chose to use it as a Hobo bag and carry it as my main purse. It was easy to open and get things in and out. The second part of my trip was a drive frim WA to FL. It not only survived but lives to travel again, even after a water spill. Well worth the price!"
  },
  {
    id: 8,
    stars: 4,
    text: "It's really cute inside and out just a little too big for my liking :("
  },
  {
    id: 9,
    stars: 1,
    text: "Color is totally off from online pic. It's much whiter than expected"
  },
];

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
          genderDistribution: [40, 60],
          filter: [1,0,0,0,0,0],
        }, {
          name: 'Handwoven Picnic Bag',
          media: [image2],
          price: '$87.00',
          uid: 'bag2',
          description: "Fancy shmancy straw for divas! Available only in beige and black, but fabulous with any outfits.",
          continentSales: ['20500', '5000', '1000', '500', '0', '20000'],
          genderDistribution: [30, 70]
        }, {
          name: 'Red Glamour Bag',
          media: [image3],
          price: '$76.00',
          uid: 'bag3',
          continentSales: ['65', '1000', '33000', '60000', '6000', '2500'],
          genderDistribution: [80, 20]
        }, {
          name: 'Brown Pull-Over Tote',
          media: [image4],
          price: '$55.00',
          uid: 'bag4',
          continentSales: ['15000', '500', '21000', '870', '0', '2000'],
          genderDistribution: [25, 75]
        }, {
          name: 'Blue Chic Handbag',
          media: [image5],
          price: '$76.00',
          uid: 'bag5',
          continentSales: ['1500', '50000', '3000', '0', '0', '200'],
          genderDistribution: [43, 57]
        }, {
          name: 'Summer Orange Handbag',
          media: [image6],
          price: '$88.00',
          uid: 'bag6',
          continentSales: ['80000', '900', '39000', '15500', '7700', '0'],
          genderDistribution: [35, 65]
        }, {
          name: 'Banana Picnic Bag',
          media: [image7],
          price: '$109.00',
          uid: 'bag7',
          continentSales: ['190', '50000', '30000', '5000', '150000', '2000'],
          genderDistribution: [41, 59]
        }, {
          name: 'Pretty and Purple Handbag',
          media: [image8],
          price: '$76.00',
          uid: 'bag8',
          continentSales: ['47000', '8000', '3500', '0', '2570', '53000'],
          genderDistribution: [19, 81]
        }, {
          name: 'Classic Picnic Bag',
          media: [image9],
          price: '$56.00',
          uid: 'bag9',
          continentSales: ['11500', '50', '300', '8000', '0', '2500'],
          genderDistribution: [50, 50]
        }
      ],
    }
  }
  
  addNewData(detail){
    const data = this.state.data.slice();
    const product = data.filter((elt) => {
      if (elt.uid == detail.uid) {
        return elt;
      }
    })[0];
    const index = data.indexOf(product);
    
    if (index != -1) {
      // if already existed (index found), update data
      product.name = detail.name;
      product.media = detail.media;
      product.price = detail.price;
      product.uid = detail.uid;
      product.description = detail.description;
      product.filter = detail.filter;
      product.continentSales = detail.continentSales;
      product.genderDistribution = detail.genderDistribution;
      product.hotspots = detail.hotspots;
      data[index] = product;
      this.setState({
        data: data
      });
      alert("Information updated!");
    } else {
      // if new product, add to data
      this.setState({
        data: data.concat([{
          name: detail.name,
          media: detail.media,
          price: detail.price,
          uid: detail.uid,
          description: detail.description,
          filter: detail.filter,
          continentSales: detail.continentSales,
          genderDistribution: detail.genderDistribution,
          hotspots: detail.hotspots,
        }]),
      });
      alert("New product added!");
    }
  }
  
  render() {
    
    return (
      <div className="App">
        <Router history={browserHistory}>
          <div>
            <Route path="/" component={AppHeader} />

            <Route exact path="/" render={() => (<StorePage data={this.state.data}/>)}/>
            <Route exact path="/newproduct" render={(props) => (<ProductPage {...props} data={this.state.data} addNewData={(detail) => this.addNewData(detail)} reviewData={reviewData}/>)}/>
            <Route path="/products/:uid" render={(props) => (<ProductPage {...props} data={this.state.data} addNewData={(detail) => this.addNewData(detail)} data={this.state.data} reviewData={reviewData}/>)}/>
            <Route path="/story" component={StoryPage} />
          </div>
        </Router>
      </div>
    );
  }
}




export default App;
