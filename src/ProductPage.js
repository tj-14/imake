import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import DropZone from 'react-dropzone';
import './ProductPage.css';
import CurrencyInput from 'react-currency-input';

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
      priceInput: "$0.00",
      descriptionInput: "",
      isEditing: true,
      isAddingHotspot: false,
      hotSpots: Array(0),
      curX: null,
      curY: null,
      hoveredHotSpotImg: null,
    };
    this.onDrop = this.onDrop.bind(this);
    this.handleAddHotSpotDiv = 
      this.handleAddHotSpotDiv.bind(this);
    this.hotSpotOnDrop = 
      this.hotSpotOnDrop.bind(this);
    this.hotspotMouseOver = 
      this.hotspotMouseOver.bind(this);
    this.hotspotMouseOut =
      this.hotspotMouseOut.bind(this);
  }
  
  onDrop(acceptedFiles){
    const img = this.state.img.slice();
    const sid = parseInt(this.props.match.params.sid);
    img[sid-1] = acceptedFiles[0].preview;
    this.setState({
      img: img,
    })
  }
  
  handleAddHotSpotDiv(event) {
    this.setState({
      curX: event.nativeEvent.offsetX,
      curY: event.nativeEvent.offsetY,
    })
  }
  
  hotSpotOnDrop(acceptedFiles){
    const hotSpots = this.state.hotSpots.slice();
    this.setState({
      hotSpots: hotSpots.concat([{
        curX: this.state.curX,
        curY: this.state.curY,
        img: acceptedFiles[0].preview,
      }]),
    })
  }
  
  hotspotMouseOver = (img) => {
    this.setState({
      hoveredHotSpotImg: img
    });
  }
  
  hotspotMouseOut() {
    this.setState({
      hoveredHotSpotImg: null
    });
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
  
  handleChangePrice(newValue) {
    this.setState({
      priceInput: newValue,
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
      <div className="priceDataDiv">
        <CurrencyInput className="priceInput form-control" prefix="$" value={this.state.priceInput} onChange={this.handleChangePrice.bind(this)}/>
      </div>
      : <div className="priceDataDiv">{this.state.priceInput}</div>
    
    const descriptionDiv = this.state.isEditing ?
      <div className="descriptionDiv">
        <textarea rows="10" className="descriptionInput form-control" placeholder="Description" type="text" value={this.state.descriptionInput} onChange={this.handleChangeDescription.bind(this)}/>
      </div>
      : <div className="descriptionDiv">{this.state.descriptionInput}</div>
    
    const submitButtonLabel = this.state.isEditing ? "OK" : "Edit";
    
    const hotSpots = this.state.hotSpots.map((hotSpot) => {
      const styles = {
        top: hotSpot.curY,
        right: hotSpot.curX,
      }
      return (
        <div className="HotSpot" style={styles} onMouseEnter={this.hotspotMouseOver.bind(this, hotSpot.img)} onMouseLeave={this.hotspotMouseOut}/>
      )
    });
    
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
            {
              this.state.isAddingHotspot ? 
              <DropZone className="HotSpotZone" onClick={this.handleAddHotSpotDiv} onDrop={this.hotSpotOnDrop} accept='image/*'>
                <img className="PicBox" src={this.state.img[sid-1]} />
              </DropZone> 
              :
              <DropZone className="DropZone" onDrop={this.onDrop} accept='image/*'>
                {this.state.img[sid-1] ? 
                  <div>
                    <img className="PicBox" src={this.state.img[sid-1]} />
                    {hotSpots}
                  </div> 
                  : <div className="plusSign">+</div>}
              </DropZone>
            }
            
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
            {
              (this.state.hoveredHotSpotImg == null)
              ?
              <div className="dataBox">
                <div className="priceLabel">Price:</div>
                {priceDiv}
                {descriptionDiv}
              </div>
              :
              <div>
                <img className="HotSpotImg" src={this.state.hoveredHotSpotImg} />
              </div>
            }
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
            <div className="dataBox">
              <div className="priceLabel">Price:</div><div className="priceDataDiv">{product[0].price}</div>
              <div className="descriptionDiv">{product[0].description}</div>
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