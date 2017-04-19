import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './StorePage.css';
import add_product from './images/add-product.png'
import store_logo from './images/product_images/store-logo.jpg'

class Product extends Component {
  constructor(props) {
        super(props);
        // 1. bind your functions in the constructor.
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.state = {
            hover: false
        };
    }

    // 2. bind it with fat arrows.
    mouseOver = () => {
        this.setState({hover: true});
    }
    mouseOut() {
        this.setState({hover: false});
    }

  render() {
    return (
      <Link to={"/products/"+this.props.value.uid}>
        <button className="Product" onMouseEnter={this.mouseOver.bind(this)} onMouseLeave={this.mouseOut.bind(this)}>
          <img className="ImageGrid" src={this.props.value.media}/>
          {this.state.hover ? (
            <div className="ImageOverlay"> 
              <div className="TextOverlay">
                <p><b>{this.props.value.name}</b></p>
                <p>${this.props.value.price}</p>
              </div>
            </div>) : null}  
        </button>
      </Link>
    );
  }
}

class NewProduct extends Component {
  constructor(props) {
        super(props);
        // 1. bind your functions in the constructor.
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.state = {
            hover: false
        };
    }

    // 2. bind it with fat arrows.
    mouseOver = () => {
        this.setState({hover: true});
    }
    mouseOut() {
        this.setState({hover: false});
    }
  render() {
    return (
      <Link to="/newproduct/1">
        <button className="Product" onMouseEnter={this.mouseOver.bind(this)} onMouseLeave={this.mouseOut.bind(this)}>
          <img className="ImageGrid" src={add_product} />
          {this.state.hover ? (
            <div className="ImageOverlay"> 
              <div className="TextOverlay">
                <p><b>Add Item</b></p>
              </div>
            </div>) : null}  
        </button>
      </Link>
    );
  }
}

class StorePage extends Component {
  render() {
    const productNode = this.props.data.map((product) => {
        return (
          <Product value={product}/>
        )
    });
    return (
      <div className="StorePage">
        <div className="StorePage-Left">
          <div className="leftViewTab">
            <div className="leftViewText">
              View Story
            </div>
          </div>
        </div>
        <div className="StorePage-Mid">
          <div>
            <img className="StoreLogo" src={store_logo}/>
          </div>
          <div className="ShopTitle">
            <b>Spring Naturals by John Doe</b>
          </div>
          <div className="Listing">
            <NewProduct />
            {productNode}
          </div>
        </div>
        <div className="StorePage-Right">

        </div>
      </div>
    );
  }
}

export default StorePage;