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
        <DropZone className="DropZone" onDrop={this.onDrop} accept='image/*'>
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
            <div className="ProductPage-Mid-Child">
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