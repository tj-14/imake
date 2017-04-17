import React, { Component } from 'react';
import './ProductPage.css';

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
          <ProductDetail {...this.props} data={this.props.data}/>
        </div>
        <div className="ProductPage-Right">
          
        </div>
      </div>
    );
  }
}

export default ProductPage;