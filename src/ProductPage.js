import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import DropZone from 'react-dropzone';
import './ProductPage.css';

// this thing sets what the drop zone for pictures accepts and looks like
var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
};


class Cube extends Component {
  render() {
    return (
    <div id="wrapper">
      <div className="viewport">
        <div className="cube">
          <div className="side">
            <div className="cube-image">1</div>
          </div>
          <div className="side">
            <div className="cube-image">2</div>
          </div>
          <div className="side">
            <div className="cube-image">3</div>
          </div>
          <div className="side">
            <div className="cube-image">4</div>
          </div>
          <div className="side">
            <div className="cube-image">5</div>
          </div>
          <div className="side">
            <div className="cube-image active">6</div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}


class NewProductPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      img: Array(6).fill(null),
    };
    this.onDrop = this.onDrop.bind(this);
  }
  onDrop(acceptedFiles){
    const img = this.state.img.slice();
    const sid = this.props.match.params.sid;
    img[sid] = acceptedFiles[0].preview;
    this.setState({
      img: img,
    })
  }
  render(){
    const sid = this.props.match.params.sid;
    const prev_sid = parseInt(sid)-1;
    const next_sid = parseInt(sid)+1;
    return (
      <div className="DropPicBox">
        <DropZone onDrop={this.onDrop}>
          {this.state.img[sid] ? 
            <div>
              <img className="PicBox" src={this.state.img[sid]} />
            </div> 
            : null}
        </DropZone>
        <div>
          <Link to={"/newproduct/"+prev_sid}>
            prev
          </Link>
          
          <Link to={"/newproduct/"+next_sid}>
            next
          </Link>
        </div>
      </div>
    );
  }
}



class ProductDetail extends Component {
  render(){
    const products = this.props.data;
    const uid = this.props.match.params.uid;
    const product = products.filter(product => {
        if(product.uid == uid) {
            return product;
        }
    });

    return (
      <div>
        <h1>{product[0].name}</h1>
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <div className="thumbnail">
              <img src={product[0].media} alt={product[0].name} />
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <ul>
              <li><strong>Model</strong>: {product[0].model}</li>
              <li><strong>Make</strong>: {product[0].make}</li>
              <li><strong>Year</strong>: {product[0].year}</li>
              <li><strong>Price</strong>: {product[0].price}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

class ProductPage extends Component {
  render() {
    return (
      <div className="ProductPage">
        <div className="ProductPage-Left">
          View Store
        </div>
        <div className="ProductPage-Mid">
          <Router>
            <div>
              <Route path="/products/:uid" render={(props) => (<ProductDetail {...props} data={this.props.data}/>)}/>
              <Route path="/newproduct/:sid" render={(props) => (<NewProductPage {...props}/>)}/>
            </div>
          </Router>
        </div>
        <div className="ProductPage-Right">
          
        </div>
      </div>
    );
  }
}

export default ProductPage;