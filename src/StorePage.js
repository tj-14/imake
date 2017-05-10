import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './StorePage.css';
import add_product from './images/add-product.png'
import store_logo from './images/product_images/store-logo.jpg'

class Product extends Component {
  constructor(props) {
    super(props);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.mouseOverRemove = this.mouseOverRemove.bind(this);
    this.mouseOutRemove = this.mouseOutRemove.bind(this);
    this.handleClickRemoveItemBtn = this.handleClickRemoveItemBtn.bind(this);
    this.state = {
      hover: false,
      isEditing: true,
      hoverRemove: false,
    };
  }
  
  mouseOver(){
    this.setState({hover: true});
  }
  mouseOut() {
    this.setState({hover: false});
  }
  
  mouseOverRemove(){
    this.setState({hoverRemove: true});
  }
  mouseOutRemove() {
    this.setState({hoverRemove: false});
  }
  
  handleClickRemoveItemBtn() {
    this.props.removeItem(this.props.value);
  }

  render() {
    const picBoxClass = ["","Grayscale","Brightness","Sepia"][this.props.value.filter ? this.props.value.filter[0] : 0];
    
    const removeItemButton = (this.state.isEditing) ? 
      <div className="btn removeItemBtn" onClick={(event) => {
              if(confirm("Are you sure you want to delete this item?")) {
                this.handleClickRemoveItemBtn();
              }
            }} onMouseEnter={this.mouseOverRemove.bind(this)}
            onMouseLeave={this.mouseOutRemove.bind(this)}>
        <div className="removeItemBtnLabel">{"\u00D7"}</div>
      </div> : null;
    
    const link = this.state.hoverRemove ? "/" : ("/products/"+this.props.value.uid)
          
    return (
      <div className="ProductDiv">
        <Link to={link}>
            <button className="Product" onMouseEnter={this.mouseOver.bind(this)} onMouseLeave={this.mouseOut.bind(this)}>
              {this.state.hover ? (
                <div className="ProductOverlay">
                  {removeItemButton}
                  <img className={"ImageGrid ImageOverlayStorePage "+picBoxClass} src={this.props.value.media[0]}/>
                  <div className="TextOverlayStorePage">
                    <p><b>{this.props.value.name}</b></p>
                    <p>{this.props.value.price}</p>
                  </div>
                </div>) 
                : 
                <div>
                <img className={"ImageGrid "+picBoxClass} src={this.props.value.media[0]}/>
                </div>
              }  
            </button>
          
        </Link>
      </div>
    );
  }
}

class NewProduct extends Component {
  constructor(props) {
    super(props);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.state = {
        hover: false
    };
  }
  
  mouseOver(){
    this.setState({hover: true});
  }
  mouseOut() {
    this.setState({hover: false});
  }
  render() {
    return (
      <div className="ProductDiv">
        <Link to="/newproduct">
            <button className="Product" onMouseEnter={this.mouseOver.bind(this)} onMouseLeave={this.mouseOut.bind(this)}>
              {this.state.hover ? (
                  <div>
                    <img className="ImageGrid ImageOverlayStorePage" src={add_product} />
                    <div className="TextOverlayStorePage">
                      <p><b>Add Item</b></p>
                    </div>
                  </div>) 
              :
                <div>
                <img className="ImageGrid" src={add_product} />
                </div>
            }
            </button>
        </Link>
      </div>
    );
  }
}

class StorePage extends Component {
  render() {
    const productNode = this.props.data.map((product) => {
        return (
          <Product value={product} key={product.uid} removeItem={this.props.removeItem}/>
        )
    });
    
    // expected max number of items in a row is six
    // this is a bit hacky for aligning items in the last row to grid (left, not center)
    const emptyNode = [1,2,3,4,5,6].map(() => {
      return(
        <div className="emptyChild"></div>
      )
    });
    
    return (
      <div className="StorePage">
        <div className="StorePage-Left">
          <div className="leftViewTabStorePage">
            <Link className="leftViewTextStorePage" to="/story">
            View Story
            </Link>
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
            {emptyNode}
          </div>
        </div>
        <div className="StorePage-Right">

        </div>
      </div>
    );
  }
}

export default StorePage;