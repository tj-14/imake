import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './StorePage.css';


class Product extends Component {
  render() {
    return (
      <Link to={"/products/"+this.props.value.uid}>
        <button className="Product">
          <img className="ImageGrid" src={this.props.value.media}/>
          <p> {this.props.value.price}</p>
        </button>
      </Link>
    );
  }
}

class NewProduct extends Component {
  render() {
    return (
      <Link to="/newproduct/1">
        <button className="Product">
          +
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
          View Story
        </div>
        <div className="StorePage-Mid">
          <div className="ShopTitle">
            John Doe
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