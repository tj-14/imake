import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import DropZone from 'react-dropzone';
import './ProductPage.css';

class NewProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }
  onDrop(acceptedFiles, rejectedFiles){
    console.log(this.state.files);
    console.log('Accepted files: ', acceptedFiles);
    console.log('Rejected files: ', rejectedFiles);
    console.log(acceptedFiles[0].preview);
    this.setState({
      files: acceptedFiles,
    })
    console.log(this.state);
  }
  render(){
    return (
      <div className="DropPicBox">
        <DropZone onDrop={this.onDrop}>
          test
        </DropZone>
        {this.state.files ? <div>{this.state.files.map((file) => <img src={file.preview} />)}</div> : null}
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