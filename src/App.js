import React, { Component } from 'react';
import {BrowserRouter as Router, Route, browserHistory, Link} from 'react-router-dom';
import './App.css';
import StorePage from './StorePage';
import ProductPage from './ProductPage';

const data = [
    {
      id: 1,
      name: 'Honda Accord Crosstour',
      year: '2010',
      model: 'Accord Crosstour',
      make: 'Honda',
      media: 'http://media.ed.edmunds-media.com/honda/accord-crosstour/2010/oem/2010_honda_accord-crosstour_4dr-hatchback_ex-l_fq_oem_4_500.jpg',
      price: '$16,811',
      uid: 'honda'

    },
    {
      id: 2,
      name: 'Mercedes-Benz AMG GT Coupe',
      year: '2016',
      model: 'AMG',
      make: 'Mercedes Benz',
      media: 'http://media.ed.edmunds-media.com/mercedes-benz/amg-gt/2016/oem/2016_mercedes-benz_amg-gt_coupe_s_fq_oem_1_717.jpg',
      price: '$138,157',
      uid: 'benz'

    },
    {
      id: 3,
      name: 'BMW X6 SUV',
      year: '2016',
      model: 'X6',
      make: 'BMW',
      media: 'http://media.ed.edmunds-media.com/bmw/x6/2016/oem/2016_bmw_x6_4dr-suv_xdrive50i_fq_oem_1_717.jpg',
      price: '$68,999',
      uid: 'bmw'
    },
    {
      id: 4,
      name: 'Ford Edge SUV',
      year: '2016',
      model: 'Edge',
      make: 'Ford',
      media: 'http://media.ed.edmunds-media.com/ford/edge/2016/oem/2016_ford_edge_4dr-suv_sport_fq_oem_6_717.jpg',
      price: '$36,275',
      uid: 'ford'
    },
    {
      id: 5,
      name: 'Dodge Viper Coupe',
      year: '2017',
      model: 'Viper',
      make: 'Dodge',
      media: 'http://media.ed.edmunds-media.com/dodge/viper/2017/oem/2017_dodge_viper_coupe_acr_fq_oem_3_717.jpg',
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
            <Route path="/newproduct" component={ProductPage} />
            <Route path="/products/:uid" render={(props) => (<ProductPage {...props} data={data}/>)}/>
          </div>
        </Router>
      </div>
    );
  }
}




export default App;
