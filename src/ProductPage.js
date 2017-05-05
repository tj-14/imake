import React, { Component } from 'react';
import {HashRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import DropZone from 'react-dropzone';
import './ProductPage.css';
import CurrencyInput from 'react-currency-input';
import ReactDOM from 'react-dom'

// this thing sets what the drop zone for pictures accepts and looks like
var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
};


class Cube extends Component {
  nextside(cur, n) {
    return (cur+n-1)%4+1
  }
  render() {
    const sid = parseInt(this.props.sid);
    const lsid = parseInt(this.props.lastsid);
    const cubeOrder = 
          [[5,3,2,1,4,6],
           [5,4,3,2,1,6],
           [5,1,4,3,2,6],
           [5,2,1,4,3,6],
           [this.nextside(lsid,2),
            6,
            this.nextside(lsid,1),
            5,
            this.nextside(lsid,3),
            lsid],
           [lsid,
            5,
            this.nextside(lsid,1),
            6,
            this.nextside(lsid,3),
            this.nextside(lsid,2)]]
    const cubeSides = [0,1,2,3,4,5].map((i) => {
        const j = cubeOrder[sid-1][i];
        return (
          <div className="side">
            <div className="cube-image"><img src={this.props.img[j-1]} alt={j} className={"cubeimg "+this.props.picBoxClass}/></div>
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
    this.mouseOverFilter = this.mouseOverFilter.bind(this);
    this.mouseOverDone = this.mouseOverDone.bind(this);
    this.arrowButton = this.arrowButton.bind(this);

    this.state = {
      img: Array(6).fill(null),
      lastsid: null,
      sid: 1,
      productNameInput: "",
      priceInput: "$0.00",
      descriptionInput: "",
      isEditing: true,
      isAddingHotspot: false,
      hotSpots: Array(0),
      curX: null,
      curY: null,
      hoveredHotSpotImg: null,
      isChoosingFilter: false,
      filter: 0,
      redirect: null,
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
    this.handleSave =
      this.handleSave.bind(this);
  }
  
  mouseOverFilter(sf){
    this.setState({
      filter: sf,
    })
  }

  mouseOverDone(){
    this.setState({isChoosingFilter: false});}
  
  arrowButton(next_sid){
    this.setState({
      lastsid: this.state.sid,
      sid: next_sid,
    })
  }

  onDrop(acceptedFiles){
    const img = this.state.img.slice();
    const sid = this.state.sid;
    img[sid-1] = acceptedFiles[0].preview;
    this.setState({
      img: img,
      isChoosingFilter: true,
    })
  }
  
  handleAddHotSpotDiv(event) {
    const node = ReactDOM.findDOMNode(this.refs.HotSpotZoneRef);
    const rect = node.getBoundingClientRect();
    
    this.setState({
      curX: event.nativeEvent.pageX - (rect.left + window.scrollX),
      curY: event.nativeEvent.pageY - (rect.top + window.scrollY),
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
  
  hotspotMouseOver(img){
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
  
  handleSave() {
    const newDataDetail = {
      name: this.state.productNameInput,
      media: this.state.img,
      price: this.state.priceInput,
      description: this.state.descriptionInput,
      uid: this.state.productNameInput+'xx',
      hotspots: this.state.hotSpots,
    };
    this.props.addNewData(newDataDetail);
    this.setState({
      redirect: "/products/"+newDataDetail.uid,
    })
  }
  
  render(){
    if (this.state.redirect != null) {
      return <Redirect push to={this.state.redirect} />;
    }
    
    const sid = this.state.sid;
    const next_sid = [
      [4,6,2,5],
      [1,6,3,5],
      [2,6,4,5],
      [3,6,1,5],
      [null,this.state.lastsid,null,null],
      [null,null,null,this.state.lastsid],
    ][sid-1]; // left, up, right, down
    
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
    
    const submitButtonLabel = this.state.isEditing ? "Preview" : "Edit";
    
    const hotSpots = this.state.hotSpots.map((hotSpot) => {
      const styles = {
        top: hotSpot.curY,
        left: hotSpot.curX,
      }
      return (
        <div className="HotSpot" style={styles} onMouseEnter={this.hotspotMouseOver.bind(this, hotSpot.img)} onMouseLeave={this.hotspotMouseOut}/>
      )
    });
    
    var hotspotHint = null;
    let hotspotButtonLabel;
    let isHotspotButtonDisable;
    if (!this.state.img[sid-1]) {
      hotspotButtonLabel = "Add photo first!";
      isHotspotButtonDisable = true;
    } else if (this.state.isAddingHotspot) {
      hotspotButtonLabel = "Done adding hotspots";
      hotspotHint = "Click on image to add hotspot!";
      isHotspotButtonDisable = false;
    } else {
      hotspotButtonLabel = "Add hotspots";
      isHotspotButtonDisable = false;
    }
    
    let isSubmitButtonDisable = (this.state.productNameInput == "") || (this.state.descriptionInput == "");
    
    const picBoxClass = ["PicBox","PicBoxGrayscale","PicBoxBrightness","PicBoxSepia"][this.state.filter];
    let dropPicBoxChild;
    if (!this.state.isEditing) {
      dropPicBoxChild = 
        <div className="ImgZone">
          <img className={picBoxClass} src={this.state.img[sid-1]} />
        {hotSpots}
      </div> 
    } else if (this.state.isAddingHotspot) {
      dropPicBoxChild = 
        <DropZone className="HotSpotZone" ref="HotSpotZoneRef" onClick={this.handleAddHotSpotDiv} onDrop={this.hotSpotOnDrop} accept='image/*'>
            <img className={picBoxClass} src={this.state.img[sid-1]} />
            {hotSpots}
        </DropZone> ;
    } else if (this.state.isChoosingFilter) {
      dropPicBoxChild = 
        <div className= "ImgZone">
                  <div className = "WhiteColumn"> </div>
                  <div className = "Original" onClick={this.mouseOverFilter.bind(this, 0)}>
                    <img className="PicBox" src={this.state.img[sid-1]} />
                  </div>

                  <div className = "Filter1" onClick={this.mouseOverFilter.bind(this, 1)}>
                    <img className="PicBoxGrayscale" src={this.state.img[sid-1]} />
                  </div>

                  <div className = "Filter2" onClick={this.mouseOverFilter.bind(this, 2)}>
                    <img className="PicBoxBrightness" src={this.state.img[sid-1]} />
                  </div>

                  <div className = "Filter3" onClick={this.mouseOverFilter.bind(this, 3)}>
                    <img className="PicBoxSepia" src={this.state.img[sid-1]} />
                  </div>

                  <button type="button" className="btn btn-secondary DoneFilter" onClick={this.mouseOverDone}>
                    Done Editing
                  </button>
                  <div>
                    <img className={picBoxClass} src={this.state.img[sid-1]} />
                  </div> 
                </div>
    } else {
      dropPicBoxChild = 
        <DropZone className="DropZone" onDrop={this.onDrop} accept='image/*'>
          {
            this.state.img[sid-1] ? (
            <div>
              <img className={picBoxClass} src={this.state.img[sid-1]} />
              {hotSpots}
            </div>) 
            : 
            <div className="plusSign">+</div>
          }
        </DropZone>
    }
    
    return (
      <div style={{width: "100%"}}>
        <div className="productNameRow">
          {productNameDiv}
          <div className="ProductPage-Right"></div>
        </div>

        <div className="detailRow">
          <div className="DropPicBox">
            {dropPicBoxChild}
            <div className="cubeDiv">
              <Cube sid={this.state.sid} img={this.state.img} lastsid={this.state.lastsid} picBoxClass={picBoxClass}/>
            </div>
            
            {next_sid[0] != null ? <div className="arrowLeft" onClick={this.arrowButton.bind(this, next_sid[0])}>{"\u25c0"}</div> : null}
            {next_sid[1] != null ? <div className="arrowUp" onClick={this.arrowButton.bind(this, next_sid[1])}>{"\u25b2"}</div> : null}
            {next_sid[2] != null ? <div className="arrowRight" onClick={this.arrowButton.bind(this, next_sid[2])}>{"\u25b6"}</div> : null}
            {next_sid[3] != null ? <div className="arrowDown" onClick={this.arrowButton.bind(this, next_sid[3])}>{"\u25bc"}</div> : null}
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
                <img className={"HotSpotImg "+picBoxClass+"SamePos"} src={this.state.hoveredHotSpotImg} />
              </div>
            }
          </div>
        </div>
        
        <div className="reviewsRow">
          <div className="reviews">
            <div className="hotspotButtonDiv">
              <button type="button" className="btn btn-secondary hotspotBtn" onClick={() => this.handleClickHotspotBtn()} disabled={isHotspotButtonDisable}>
                {hotspotButtonLabel}
              </button>
              {hotspotHint}
            </div>
            <div className="submitButtonDiv">
              <button type="button" className="btn btn-secondary submitBtn" onClick={() => this.handleClickOkBtn()} disabled={isSubmitButtonDisable}>
                {submitButtonLabel}
              </button>
            </div>
            <div>
             <br/><br/>
              <button type="button" className="btn btn-secondary submitBtn" onClick={() => this.handleSave()}> 
                Save
              </button>
            </div>
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
            <img src={product[0].media[0]} alt={product[0].name}/>
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
              <Route path="/newproduct" render={(props) => (<NewProductPage {...props} addNewData={this.props.addNewData}/>)}/>
            </div>
          </Router>
        </div>
      </div>
    );
  }
}



export default ProductPage;