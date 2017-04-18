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
    const sid = parseInt(this.props.sid);
    const cubeSides = [0,1,2,3,4,5].map((i) => {
        const j = (sid+i)%6;
        return (
          <div className="side">
            <div className="cube-image"><img src={this.props.img[j]} alt={j+1}/></div>
          </div>
        )
    });
    return (
    <div id="wrapper">
      <div className="viewport">
        <div className="cube">
          {cubeSides}
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
    const sid = parseInt(this.props.match.params.sid);
    img[sid-1] = acceptedFiles[0].preview;
    this.setState({
      img: img,
    })
  }
  render(){
    const sid = this.props.match.params.sid;
    const next_sid = [
      [6,3,4,5],
      [1,4,5,6],
      [2,5,6,1],
      [3,6,1,2],
      [4,1,2,3],
      [5,2,3,4],
    ][sid-1];
    return (
      <div className="DropPicBox">
        <Cube sid={this.props.match.params.sid} img={this.state.img}/>
        <DropZone onDrop={this.onDrop}>
          {this.state.img[sid-1] ? 
            <div>
              <img className="PicBox" src={this.state.img[sid-1]} />
            </div> 
            : null}
        </DropZone>
        <div>
          <Link to={"/newproduct/"+next_sid[0]}>
            {"<"}
          </Link>
          <Link to={"/newproduct/"+next_sid[1]}>
            {"^"}
          </Link>
          <Link to={"/newproduct/"+next_sid[2]}>
            {">"}
          </Link>
          <Link to={"/newproduct/"+next_sid[3]}>
            {"v"}
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