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
            <div className="cube-image"><img src={this.props.img[j]} alt={j+1} className="cubeimg"/></div>
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
  constructor() {
    super();
    this.state = {
      img: Array(6).fill(null),
      productNameInput: "",
      priceInput: 0,
      descriptionInput: "",
      isEditing: true,
      isAddingHotspot: false,
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
  
  handleClickOkBtn() {
    this.setState({
      isEditing: !this.state.isEditing,
    });
  }
  
  handleClickHotspotBtn() {
    this.setState({
      isAddingHotspot: !this.state.isAddingHotspot,
    });
  }
                  
  handleChangeProductName(event) {
    this.setState({
      productNameInput: event.target.value,
    });
  }
  
  handleChangePrice(event) {
    this.setState({
      priceInput: event.target.value,
    });
  }
  
  handleChangeDescription(event) {
    this.setState({
      descriptionInput: event.target.value,
    });
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
    
    const productNameDiv = this.state.isEditing ? 
      <input className="productNameInput form-control input-lg" placeholder="Product name" type="text" value={this.state.productNameInput} onChange={this.handleChangeProductName.bind(this)} />
      : <div className="productName">{this.state.productNameInput}</div>;
    
    const priceDiv = this.state.isEditing ? 
      <input className="priceInput form-control" placeholder="price" type="number" min="0" step="0.01" value={this.state.priceInput} onChange={this.handleChangePrice.bind(this)}/>
      : <span className="labelData">${this.state.priceInput}</span>
    
    const descriptionDiv = this.state.isEditing ?
      <textarea rows="10" className="descriptionInput form-control" placeholder="Description" type="text" value={this.state.descriptionInput} onChange={this.handleChangeDescription.bind(this)}/>
      : <span className="description">{this.state.descriptionInput}</span>
    
    const submitButtonLabel = this.state.isEditing ? "OK" : "Edit";
    
    let hotspotButtonLabel;
    if (!this.state.img[sid-1]) {
      hotspotButtonLabel = "Add photo first!";
    } else if (this.state.isAddingHotspot) {
      hotspotButtonLabel = "Adding a hotspot";
    } else {
      hotspotButtonLabel = "Add a hotspot";
    }
    
    return (
      <div style={{width: "100%"}}>
        <div className="productNameRow">
          {productNameDiv}
          <div className="ProductPage-Right"></div>
        </div>

        <div className="detailRow">
          <div className="DropPicBox">
            <DropZone className="DropZone" onDrop={this.onDrop} accept='image/*'>
              {this.state.img[sid-1] ? 
                <div>
                  <span className="PicBox-helper" />
                  <img className="PicBox" src={this.state.img[sid-1]} />
                </div> 
                : <div className="plusSign">+</div>}
            </DropZone>
            
            <div className="cubeDiv">
              <Cube sid={this.props.match.params.sid} img={this.state.img} />
            </div>
            
            <Link to={"/newproduct/"+next_sid[0]}>
              <div className="arrowLeft">{"\u25c0"}</div>
            </Link>
            <Link to={"/newproduct/"+next_sid[1]}>
              <div className="arrowUp">{"\u25b2"}</div>
            </Link>
            <Link to={"/newproduct/"+next_sid[2]}>
              <div className="arrowRight">{"\u25b6"}</div>
            </Link>
            <Link to={"/newproduct/"+next_sid[3]}>
              <div className="arrowDown">{"\u25bc"}</div>
            </Link>
          </div>
          <div className="ProductPage-Right">
            <div className="descriptionBox">
              <span className="label">Price:</span>
              {priceDiv}
              <br></br>
              {descriptionDiv}
            </div>
          </div>
        </div>
        
        <div className="reviewsRow">
          <div className="hotspotButtonDiv">
            <button type="button" className="btn btn-secondary hotspotBtn" onClick={() => this.handleClickHotspotBtn()}>
              {hotspotButtonLabel}
            </button>
          </div>
          <div className="submitButtonDiv">
            <button type="button" className="btn btn-secondary submitBtn" onClick={() => this.handleClickOkBtn()}>
              {submitButtonLabel}
            </button>
          </div>
          <div className="ProductPage-Right"></div>
        </div>
      </div>
    );
  }
}

class ReviewButton extends Component {
  constructor() {
    super();
    this.state = {
      isExpanded: false,
      label: "\u25bc",
    };
  }
  
  reviewClick() {
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
          <p>Example Review</p>
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
          <ReviewButton />
        </div>
      ) 
    });

    return (
      <div style={{width: "100%"}}>
        <div className="productNameRow">
          <div className="productName">{product[0].name}</div>
          <div className="ProductPage-Right"></div>
        </div>
        
        <div className="detailRow">
          <div className="thumbnail">
            <img src={product[0].media} alt={product[0].name}/>
          </div>
          <div className="ProductPage-Right">
            <div className="descriptionBox">
              <span className="label">Price:</span><span className="labelData">${product[0].price}</span>
              <br></br>
              <span className="description">{product[0].description}</span>
            </div>
          </div>
        </div>
        
        <div className="reviewsRow">
          <div className="reviews">{reviewBox}</div>
          <div className="ProductPage-Right"></div>
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
          <Link to="/">
            <div className="leftViewTab">
              <div className="leftViewText">
                    View Store
              </div>
            </div>
          </Link>
        </div>
        <div className="ProductPage-Mid">
          <Router>
            <div style={{width: "100%"}}>
              <Route path="/products/:uid" render={(props) => (<ProductDetail {...props} data={this.props.data}/>)}/>
              <Route path="/newproduct/:sid" render={(props) => (<NewProductPage {...props}/>)}/>
            </div>
          </Router>
        </div>
      </div>
    );
  }
}



export default ProductPage;