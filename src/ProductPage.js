import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import DropZone from 'react-dropzone';
import './ProductPage.css';

// this thing sets what the drop zone for pictures accepts and looks like
var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
};


//const element = <h1>Hello, world</h1>;


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
      img: null,
    };
    this.onDrop = this.onDrop.bind(this);
  }
  onDrop(acceptedFiles){
    this.setState({
      img: acceptedFiles[0].preview,
    })
  }
  render(){
    return (
      <div>
        <Cube />
        <div className="DropPicBox">
          <DropZone onDrop={this.onDrop}>
            {this.state.img ? 
              <div>
                <img className="PicBox" src={this.state.img} />
              </div> 
              : null}
          </DropZone>
        </div>
        </div>
    );
  }
}

class ReviewButton extends Component {
  constructor(){
    super();
    this.state = {
      isExpanded: false,
      label: "\u25bc",
    };
  }
  
  reviewClick(){
    const newLabel = this.state.isExpanded ? '\u25bc' : '\u25b2';
    this.setState({
      isExpanded: !this.state.isExpanded,
      label: newLabel,
    });
  }
  
  render() {
    let reviewTextDiv;
    if (this.state.isExpanded) {
      reviewTextDiv = 
        <div className="reviewText">
          <p>Pros - Exactly as described and depicted - works with phones and laptops as a quick card reader</p>
          <p>Cons - Lack of instruction for memory card insertion & microUSB is a bit difficult to utilize.</p>
        </div>;
    }
    
    return (
      <div>
        <button type="button" className="btn btn-secondary reviewBtn" onClick={() => this.reviewClick()}>
          {this.state.label}
        </button>
        {reviewTextDiv}
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
    
    const reviewBox = [5,4,3,2,1].map((i) => {
      return(
        <div className="reviewCol">
          <div className="stars">
            {Array(i+1).join("\u2605 ")}
          </div>
          <ReviewButton/>
        </div>
      ) 
    });

    return (
      <div>
        <div className="productName">{product[0].name}</div>
        <div className="detailBox">
          <div className="thumbnail">
            <img src={product[0].media} alt={product[0].name} />
          </div>
          <div className="description">
            <ul>
              <li><span className="label">Price</span>: {product[0].price}</li>
              <li><span className="label">Model</span>: {product[0].model}</li>
              <li><span className="label">Make</span>: {product[0].make}</li>
              <li><span className="label">Year</span>: {product[0].year}</li>
            </ul>
          </div>
        </div>
        <div className="reviews">
          {reviewBox}
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
              <Route path="/products/:uid" render={() => (<ProductDetail {...this.props} data={this.props.data}/>)}/>
              <Route path="/newproduct" component={NewProductPage} />
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