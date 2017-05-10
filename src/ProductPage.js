import React, { Component } from 'react';
import {HashRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import DropZone from 'react-dropzone';
import './ProductPage.css';
import CurrencyInput from 'react-currency-input';
import ReactDOM from 'react-dom'
import ReactTooltip from 'react-tooltip'
import PieChart from "react-svg-piechart"

import store_icon from './images/icons/home.gif'
import store_icon_close from './images/icons/hide-home.gif'
import filter_icon from './images/icons/filter.gif'
import filter_icon_close from './images/icons/hide-filter.gif'
import analytics_icon from './images/icons/analytics.gif'
import analytics_icon_close from './images/icons/hide-analytics.gif'
import hotspot_icon from './images/icons/hotspot.gif'
import hotspot_icon_close from './images/icons/hide-hotspot.gif'
import store_logo from './images/product_images/store-logo.jpg'
import heatmap_icon from './images/heatmap.png'
import show_all from './images/icons/show.gif'
import hide_all from './images/icons/hide.gif'

// this thing sets what the drop zone for pictures accepts and looks like
var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
};

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
        <button className="Product_Left" onMouseEnter={this.mouseOver.bind(this)} onMouseLeave={this.mouseOut.bind(this)}>
          <img className="ImageGrid_Left" src={this.props.value.media[0]}/>
          {this.state.hover ? (
            <div className="ImageOverlay_Left"> 
              <div className="TextOverlay_Left">
                <p><b>{this.props.value.name}</b></p>
                <p>{this.props.value.price}</p>
              </div>
            </div>) : null}  
        </button>
      </Link>
    );
  }
}
// Color for different continent sales:
var continentColors = ['#adadb5', '#f9ae59','#d37543', '#aa450f', '#ff5d00', '#d83002'];

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
        const ft = this.props.filter[j-1] ? ["PicBox","PicBoxGrayscale","PicBoxBrightness","PicBoxSepia"][this.props.filter[j-1]] : "PicBox";
        return (
          <div className="side">
            <div className="cube-image">
             { this.props.img[j-1] ?
              <img src={this.props.img[j-1]} alt={j} className={"cubeimg "+ft}/>
                : j
              }
            </div>
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
    this.mouseOverFilter = this.mouseOverFilter.bind(this);
    this.mouseOverAll = this.mouseOverAll.bind(this);
    this.mouseOverOff = this.mouseOverOff.bind(this);
    this.arrowButton = this.arrowButton.bind(this);
    this.mouseOverMap = this.mouseOverMap.bind(this);
    this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this);
    this.peekClick = this.peekClick.bind(this);
    this.peekHide = this.peekHide.bind(this);
    this.filterClick = this.filterClick.bind(this);
    this.filterHide = this.filterHide.bind(this);
    this.hotspotClick = this.hotspotClick.bind(this);
    this.hotspotHide = this.hotspotHide.bind(this);
    this.analyticsHide = this.analyticsHide.bind(this);
    this.analyticsClick = this.analyticsClick.bind(this);
    this.mouseOverHover = this.mouseOverHover.bind(this);
    this.mouseOutHover = this.mouseOutHover.bind(this);
    this.mouseClickHeat = this.mouseClickHeat.bind(this);
    this.smallClick = this.smallClick.bind(this);
    this.mediumClick = this.mediumClick.bind(this);
    this.largeClick = this.largeClick.bind(this);

    this.mouseHotspotHover = this.mouseHotspotHover.bind(this);
    this.mouseClickHotspot = this.mouseClickHotspot.bind(this);
    this.mouseHotspotOut = this.mouseHotspotOut.bind(this);
    this.state = {
      img: Array(6).fill(null),
      lastsid: null,
      sid: 1,
      productNameInput: "",
      priceInput: "$0.00",
      descriptionInput: "",
      isEditing: true,
      isAddingHotspot: false,
      hotSpots: Array(6).fill(Array(0)),
      curX: null,
      curY: null,
      hoveredHotSpotImg: null,
      isChoosingFilter: false,
      filter: Array(6).fill(0),
      applyFilterAll: false,
      redirect: null,
      continentSales: ['0', '0', '0', '0', '0', '0'],
      genderDistribution: [50, 50],
      expandedSector: null,
      isExistingProduct: false,
      peekaboo: false,
      peekaboo_analytics: false,
      peekaboo_hotspot: false,
      hotspot_class: "cbp-spmenu-hotspot cbp-spmenu-vertical cbp-spmenu-left",
      peekaboo_class: "cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left",
      peekaboo_tab: "leftViewTabShow leftViewTabTransition",
      peekaboo_text: "VIEW STORE",
      filter_class:"cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left",
      analytics_class: "cbp-spmenu-analytics cbp-spmenu-vertical cbp-spmenu-left",
      hover_heatmap: false,
      heat_click: false,
      heatmap_show: false,
      hotspot_size: 0,
      hotspotButton: false,
      hotspotHover: false,
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
    mouseOverHover = () => {
        this.setState({hover_heatmap: true});
        this.state.heat_click ? null : this.setState({heatmap_show: true});

    }
    mouseOutHover() {
        this.setState({hover_heatmap: false});
        this.state.heat_click ? null: this.setState({heatmap_show:false});
    }

  smallClick = () => {
    this.state.hotspot_size == 1 ? 
    (this.setState({ hotspot_size: 0}))
    :
    (this.setState({ hotspot_size: 1}))
  }

  mediumClick = () => {
    this.state.hotspot_size == 2 ? 
    (this.setState({ hotspot_size: 0}))
    :
    (this.setState({ hotspot_size: 2}))
  }

  largeClick = () => {
    this.state.hotspot_size == 3 ? 
    (this.setState({ hotspot_size: 0}))
    :
    (this.setState({ hotspot_size: 3}))
  }


  peekClick = () => {
    this.setState({ peekaboo: true, 
                    peekaboo_class: "cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left cbp-spmenu-open",
                    peekaboo_tab: "leftViewTabTransition leftViewTabHide",
                    peekaboo_text: "HIDE"});
  }

  peekHide = () => {
    this.setState({ peekaboo: false, 
                    peekaboo_class: "cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left",
                    peekaboo_tab: "leftViewTabTransition leftViewTabShow",
                    peekaboo_text: "Show Store"});
  }

  hotspotClick = () => {
    this.setState({ peekaboo_hotspot: true, 
                    hotspot_class: "cbp-spmenu-hotspot cbp-spmenu-vertical cbp-spmenu-left cbp-spmenu-open"});
  }

  hotspotHide = () => {
    this.setState({ peekaboo_hotspot: false, 
                    hotspot_class: "cbp-spmenu-hotspot cbp-spmenu-vertical cbp-spmenu-left"});
  }

  filterClick = () => {
    this.setState({ isChoosingFilter: true, 
                    filter_class: "cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left cbp-spmenu-open"});
  }

  filterHide = () => {
    this.setState({ isChoosingFilter: false, 
                    filter_class: "cbp-spmenu-analytics cbp-spmenu-vertical cbp-spmenu-left"});
  }

  analyticsClick = () => {
    this.setState({ peekaboo_analytics: true, 
                    analytics_class: "cbp-spmenu-analytics cbp-spmenu-vertical cbp-spmenu-left cbp-spmenu-open"});
  }

  analyticsHide = () => {
    this.setState({ peekaboo_analytics: false, 
                    analytics_class: "cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left",
                    heatmap_show: false,
                    heat_click: false});
  }

  mouseClickHeat = () => {
    this.state.heat_click ? this.setState({heat_click: false, heatmap_show: false}) : this.setState({heat_click: true, heatmap_show: true});
  }

 mouseClickHotspot = () => {
    this.state.hotspotButton ? this.setState({hotspotButton: false}) : this.setState({hotspotButton: true});
  }

  mouseHotspotHover = () => {  
    this.setState({hover_heatmap: true});
    this.state.heat_click ? null : null;
  }

  mouseHotspotOut = () => {  
    this.setState({hover_heatmap: false});
    this.state.heat_click ? null : null;
  }


 





  mouseOverOriginal = () => {
        this.setState({original: true, filter1: false, filter2: false, filter3: false});}

  mouseOverFilter1 = () => {
        this.setState({original: false, filter1: true, filter2: false, filter3: false});}

  mouseOverFilter2 = () => {
        this.setState({original: false, filter1: false, filter2: true, filter3: false});}
  
  checkIfProductExisted() {
    if('uid' in this.props.match.params){
      const uid = this.props.match.params.uid;
      const products = this.props.data;
      const product = products.filter(product => {
          if(product.uid == uid) {
            return product;
          }
      })[0];
      this.setState({
        uid: uid,
        isExistingProduct: true,
        isEditing: false,
        productNameInput: product.name,
        priceInput: product.price,
        descriptionInput: product.description,
        img: product.media,
        filter: product.filter || Array(6).fill(0),
        continentSales: product.continentSales || ['0', '0', '0', '0', '0', '0'],
        genderDistribution: product.genderDistribution || [50, 50],
        heatmap_data: product.heatmap_data || [],
        hotSpots: product.hotspots || Array(6).fill(Array(0)),
        heatMap: true,
      })
    }
  }

  componentWillMount() {
    this.checkIfProductExisted();
  }

  componentWillReceiveProps() {
    this.checkIfProductExisted();
  }

  mouseOverMap(){
    this.setState({
      hover: true,
    });
  }
  
  // pie chart
  handleMouseEnterOnSector(sector) {
      this.setState({expandedSector: sector})
  }
  
  mouseOverFilter(sf){
    const filter = this.state.filter.slice()
    filter[this.state.sid-1] = sf
    this.setState({
      filter: filter,
    })
  }

  mouseOverAll(){
    const filter = Array(6).fill(this.state.filter[this.state.sid-1]);
    this.setState({
      applyFilterAll: true,
      filter: filter,
    });
  }
  
  mouseOverOff(){
    this.setState({applyFilterAll: false});
  }
  
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
    const sid = this.state.sid;
    hotSpots[sid-1] = hotSpots[sid-1].concat([{
        curX: this.state.curX,
        curY: this.state.curY,
        img: acceptedFiles[0].preview,
      }]);
    this.setState({
      hotSpots: hotSpots,
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
    const isSubmitButtonDisable = (this.state.productNameInput == "");
    if (isSubmitButtonDisable){
      this.productNameInput.focus(); 
    }
    else{
      this.setState({
        isEditing: !this.state.isEditing,
      });
      if(this.state.isEditing == true)
        this.handleSave();
    }
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
    var randomInt = (Math.floor(Math.random() * 99) + 1).toString();
    var uid = this.state.isExistingProduct ? this.state.uid : (this.state.productNameInput+'item' + randomInt);

    const newDataDetail = {
      name: this.state.productNameInput,
      media: this.state.img,
      price: this.state.priceInput,
      description: this.state.descriptionInput,
      uid: uid,
      hotspots: this.state.hotSpots,
      filter: this.state.filter,
      continentSales: this.state.continentSales,
      genderDistribution: this.state.genderDistribution,
    };
    this.props.addNewData(newDataDetail);
    
    if (!this.state.isExistingProduct) {
      this.setState({
        redirect: "/products/"+newDataDetail.uid,
      })
    }
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
    

    let heat_data
    if (this.state.heatmap_data !== undefined){
      if(this.state.heatmap_data[sid-1] !==null){
        heat_data =  this.state.heatmap_data[sid-1]
      }
    } else {
      heat_data = []
    }

    const ReactHeatmap = require('react-heatmap');
    //const heat_data = 
    const heatmap_insert = <ReactHeatmap max={5} data={heat_data} />

    const productNameDiv = this.state.isEditing ? 
      <input className="productNameInput form-control input-lg" placeholder="Product name" type="text" value={this.state.productNameInput} onChange={this.handleChangeProductName.bind(this)} ref={(input) => { this.productNameInput = input; }} />
      : <div className="productName">{this.state.productNameInput}</div>;
    
    const priceDiv = this.state.isEditing ? 
      <CurrencyInput className="priceInput form-control input-lg" prefix="$" value={this.state.priceInput} onChange={this.handleChangePrice.bind(this)}/>
      : <div className="price">{this.state.priceInput}</div>
    
    const descriptionDiv = this.state.isEditing ?
      <div className="descriptionDiv">
        <textarea rows="5" className="descriptionInput form-control" placeholder="Description" type="text" value={this.state.descriptionInput} onChange={this.handleChangeDescription.bind(this)}/>
      </div>
      : <div className="descriptionDiv">{this.state.descriptionInput}</div>
    
    const submitButtonLabel = this.state.isEditing ? "Save" : "Edit";
    


    const hotSpots = this.state.hotSpots[sid-1].map((hotSpot) => {
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
    
    const picBoxClass = ["PicBox","PicBoxGrayscale","PicBoxBrightness","PicBoxSepia"][this.state.filter[sid-1]];
    let dropPicBoxChild;
    if (!this.state.isEditing) {
      dropPicBoxChild = 
        <div className="ImgZone">
          {this.state.heatmap_show? (<div className="heatMapShow">{heatmap_insert}</div>) : null}
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
    
    const hasImgUploaded = this.state.img.some(function(i) { return i !== null; })
    
    var salesTxt = ['0', '0', '0', '0', '0', '0']

    for (var i=0; i < 6; i++) {
      var numeral = require('numeral');
      salesTxt[i] = numeral(this.state.continentSales[i]).format('0,0');
    }

    // Colors for continents:
    const colors=['0', '0', '0', '0', '0', '0'];


    const productNode = this.props.data.map((product) => {
        return (
          <Product value={product}/>
        )
    });

    const genderData = [
      {label: "Female", value: this.state.genderDistribution[0], color: "#bc390f"},
      {label: "Male", value: this.state.genderDistribution[1], color: "#39387c"}
    ];

    const {expandedSector} = this.state;
    // Set colors for continents:
    for (var i=0; i < 6; i++) {
        var salesCount =  this.state.continentSales[i]
        if (salesCount < 100) {
          colors[i] = continentColors[0];
        } else if (salesCount < 500) {
          colors[i] = continentColors[1];
        } else if (salesCount < 2500) {
          colors[i] = continentColors[2];
        } else if (salesCount < 12500) {
          colors[i] = continentColors[3];
        } else if (salesCount < 62500) {
          colors[i] = continentColors[4];
        } else if (salesCount < 312500) {
          colors[i] = continentColors[5];
        }
    }

    const peekabooHotspot = <div className="layoutFilter">
      {this.state.peekaboo_hotspot ? (
              <div className="leftHotspotHide" onClick={this.hotspotHide}>
                  <img className="analyticsIconClose" src={hotspot_icon_close} />
              </div>
              ) : (
              <div className="leftHotspotShow" onClick={this.hotspotClick}>
                  <img className="analyticsIcon" src={hotspot_icon} />
              </div>
              )}
      {<div className={this.state.hotspot_class}>
                  <div className="hotspotHeader"><b>HOTSPOT MENU</b></div>
                  <div className="hotspotDetails">
                  iMake lets you add details to any part of the image by adding hotspots! Choose a size and then hover
                  over the image you uploaded. Press on the part that you want to add details to! A window will show up,
                  asking you to upload a photo. Add the detailed photo and then add a description. Hovering or clicking
                  a hotspot will reveal the details!
                  </div>
                  <div className = "smallHotspot" onClick={this.smallClick.bind(this)}>
                    <div className="smallBox"> </div>
                  </div>

                  <div className = "mediumHotspot" onClick={this.mediumClick.bind(this)}>
                    <div className="mediumBox"> </div>
                  </div>

                  <div className = "largeHotspot" onClick={this.largeClick.bind(this)}>
                    <div className="largeBox"> </div>
                  </div>

                <div className={this.state.hotspotButton? "hotspotVisibilityClick" : "hotspotVisibilityButton"} onMouseEnter={this.mouseHotspotHover.bind(this)} onMouseLeave={this.mouseHotspotOut.bind(this)} onClick={this.mouseClickHotspot.bind(this)}>
                  {this.state.hover_heatmap? (
                    null
                    ):(
                    null
                    )
                }
                  {this.state.hotspotButton? <img className="heatMapIcon" src={hide_all}/> : <img className="heatMapIcon" src={show_all}/> }
            </div>
      </div>}
    </div>;


    const peekabooAnalytics= <div className="layoutFilter">
      {this.state.peekaboo_analytics ? (
              <div className="leftAnalyticsHide" onClick={this.analyticsHide}>
                  <img className="analyticsIconClose" src={analytics_icon_close} />
              </div>
              ) : (
              <div className="leftAnalyticsShow" onClick={this.analyticsClick}>
                  <img className="analyticsIcon" src={analytics_icon} />
              </div>
              )}
      {<div className={this.state.analytics_class}>
              <div className="analyticsHeader"><b>ANALYTICS</b></div>
               <div className="genderBox">
                  <div className="genderDistributionLabel"><b>SALES BY GENDER</b></div>
                    <div className="genderDistributionChart">
                      <PieChart sectorStrokeWidth={5} expandPx={1} data={ genderData } expandedSector={expandedSector} onSectorHover={this.handleMouseEnterOnSector} sectorStrokeWidth={2} expandOnHover/>
                  </div>

                  <div className="genderDistributionValues">
                      {genderData.map((element, i) => (
                        <div key={i}>
                          <span style={{background: element.color}}></span>
                          <span style={{color:element.color, fontWeight: this.state.expandedSector === i ? "bold" : null}}>
                              {element.label} : {element.value + '%'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              <div className="continentDiv">
                <div className="continentLabel"><b>SALES WORLDWIDE</b></div>
                {/*  The continent map skeleton is from the react package react-world-map */}
                <div className="continentContainer">
                <svg className="continentMap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 315">
                  <defs><linearGradient id="linearGradient4299"><stop offset="0" id="stop4301" stopColor="#cc5252"></stop></linearGradient><linearGradient id="linearGradient4293"><stop offset="0" id="stop4295" stopColor="#84297f"></stop></linearGradient></defs>
                  <g id="AF" fill={colors[0]} data-tip={"Africa<br/>"+salesTxt[0]} onMouseEnter={this.mouseOverMap.bind(this, "AF")}><path id="path4307" d="M345.902 112.802c-.17.07-.465-.25-.712-.27-4.522-.397-8.758-1.617-12.802-3.765-3.034-1.612-4.46-.522-4.662 2.886-.083 1.41-1.59 2.89-2.388 2.6-2.33-.84-5.66-.743-6.844-2.497-1.98-2.928-4.745-3.15-7.454-3.954-2.822-.838-3.82-2.355-3.362-5.1.232-1.41-.062-3.027-.87-4.077-1.022-1.326-2.538-.395-3.773.174-2.42 1.114-5.057.88-7.43.463-3.982-.7-7.45.41-10.57 2.353-3.217 2.005-6.126 2.44-9.33.388-.89-.568-1.57-.542-2.092.522-.986 2.016-2.6 3.41-4.584 4.4-2.34 1.162-3.488 3.376-3.594 5.652-.13 2.84-1.84 4.387-3.778 5.472-2.85 1.593-4.95 3.8-6.516 6.475-1.57 2.686-3.01 5.426-4.79 7.998-.936 1.353-1.45 3.018-.583 4.844 1.364 2.873 1.865 5.848.457 8.94-1.026 2.25-3.17 4.5-.41 7.02.17.157-.84.53-.112.962-2.044 1.885.48 2.86 1.136 3.413 2.413 2.036 4.23 4.46 5.466 7.25.53 1.202 1.027 2.303 1.875 3.315 1.513 1.808 3.355 3.207 5.19 4.632 2.15 1.66 4.487 2.358 7.178 1.57 1.965-.573 4.045-1.78 5.958-1.218 2.726.802 5.014.213 7.458-.707 2.313-.868 4.68-1.602 7.055-2.278 2.103-.6 5.36.928 5.86 2.954.424 1.7.94 1.963 2.638 1.51 3.457-.927 6.375 1.536 6.468 5.097.045 1.752-.163 3.427-.74 5.1-.643 1.857-1.513 3.932.178 5.61 3.446 3.41 5.434 7.51 7.28 11.96.896 2.16-.156 4.12.832 5.864 1.913 3.39.45 6.11-1.116 9.128-2.437 4.693-3.19 9.58.055 14.384 2.876 4.262 4.066 9.067 4.505 14.142.152 1.773-.015 3.83 1.088 5.245 2.082 2.677 3.54 5.682 5.264 8.55.564.938.853 1.618.55 2.82-.747 2.93 1.544 5 4.478 4.35 2.745-.605 5.488-1.696 8.314-.373.563.263.974.07 1.46-.147 3.6-1.622 6.623-3.885 9.203-6.964 1.934-2.312 3.53-4.934 5.783-6.935.9-.8 1.245-1.22.97-2.485-.54-2.477.076-4.417 2.812-5.604 4.124-1.79 4.638-3.683 2.556-7.79-.642-1.263-1.128-2.546-.002-3.562 2.824-2.547 4.426-6.274 8.454-7.728 3.474-1.255 4.783-4.753 4.377-8.378-.44-3.88-.828-7.66-2.61-11.294-.963-1.958-1.395-4.338-.81-6.787 1.685-7.023 7.57-10.894 11.763-16.02 1.952-2.39 5.308-3.368 6.88-6.143 2.305-4.066 4.287-8.315 6.575-12.39 1.193-2.124 1.39-4.085.162-6.344-3.516 2.275-7.657 2.108-11.426 3.32-1.82.583-4.3-1.108-4.76-3.08-.65-2.768-2.467-4.555-4.49-6.396-1.663-1.508-4.207-2.326-4.675-4.952-.25-1.41-.9-2.558-1.822-3.618-1.9-2.177-3.655-4.407-3.25-7.61.06-.477-.496-1.06-.826-1.55-3.618-5.377-5.79-11.577-9.615-16.83-.366-.5-.496-.97.034-1.334" /><path id="path5906" d="M390.758 215.407c-1.126 4.07-4.206 6.355-7.395 8.04-3.08 1.623-4.565 3.03-3.67 6.426.538 2.044.475 3.746-.954 5.293-2.31 2.5-1.826 5.44-1.14 8.27.46 1.886 2.024 2.625 4.012 2.35 2.547-.35 4.203-1.945 4.528-4.27.878-6.33 3.857-11.94 5.758-17.912.96-3.024.438-5.497-1.14-8.197z"></path></g>
                  <g id="SA" fill={colors[1]} data-tip={"South America<br/>"+salesTxt[1]} onMouseEnter={this.mouseOverMap.bind(this, "SA")}><path id="path5918" d="M115.618 166.174c-.415 1.425.243 2.418.6 3.565 1.137 3.644.977 7.03-1.524 10.18-2.03 2.56-4.198 5.048-5.47 8.15-.393.966-.787 2.178.092 2.588 3.028 1.41.873 2.67.053 3.96-1.37 2.154-1.048 4.542 1 6.016 1.174.848 1.857 1.98 2.586 3.18 1.58 2.6 1.826 5.79 3.77 8.22 1.605 2.013 3.28 3.943 4.124 6.505.725 2.197 2.425 3.567 4.602 4.603 5.66 2.694 10.344 6.27 10.638 13.36.15 3.602-.243 7.18-.033 10.82.198 3.464.227 6.988.716 10.46.625 4.445 2.04 8.945.958 13.358-.95 3.9 1.106 7.085 1.628 10.576.352 2.36 3.356 3.75 4.09 6.826.866 3.615 1.584 4.13-1.22 6.74 1.314.826 2.84 1.408 3.365 3.066 1.238 3.9 3.232 7.28 6.362 10.034 1.42 1.25 5.01 1.734 6.428.405.427-.402.932-.71.423-1.495-1.376-2.128-.534-4.14.584-6.04 1.206-2.053 1.067-3.652-1.116-4.982-1.025-.625-2.42-2.097-1.822-2.843 1.68-2.098 1.874-4.722 3.084-7.057-1.285-.557-2.43-1.407-2.888-2.943-.145-.49-.527-.903-.074-1.424.555-.638 1.052-.168 1.63-.03.885.21 1.667 1.71 2.665.49.745-.912 1.322-1.992.48-3.305-.818-1.272.053-1.71 1.183-1.798.778-.06 1.59.107 2.342-.05 2.254-.46 4.63-1.172 5.095-3.717.39-2.127-1.12-3.816-2.623-5.265-.516-.497-1.858-.546-1.458-1.48.383-.906 1.49-.477 2.3-.208.736.247 1.513.444 2.173.833 2.03 1.192 3.83.246 4.808-1.202 3.157-4.665 5.83-9.626 7.665-14.997.438-1.285.54-2.54-.095-3.736-.59-1.11-.343-1.89.518-2.752 2.245-2.25 5.44-2.937 7.85-4.903.213-.174.723-.165 1.008-.042 2.866 1.232 4.393-.71 5.25-2.72 2.402-5.634 4.383-11.423 3.233-17.752-.203-1.113-.26-2.46.613-3.22 2.544-2.218 3.312-5.68 5.685-7.918 1.616-1.523 1.937-3.455 2.37-5.33.55-2.396-.897-4.25-3.3-4.924-2.624-.736-5.027-1.852-6.545-4.304-.174-.282-.47-.673-.727-.69-3.424-.2-6.822-2.28-10.27-.255-.964.568-1.528.082-1.33-.65.87-3.205-1.976-3.083-3.512-4.054-1.675-1.06-2.744.294-3.78 1.298-1.18 1.15-2.397 1.63-3.943.62.774-.364 1.553-.687 2.087-1.387.44-.58 1.382-.977.698-1.928-.6-.828-1.408-1.364-2.433-.913-.698.304-1.33.798-1.918 1.295-.663.56-1.23 1.228-1.864 1.825-.418.397-.845 1.084-1.514.552-.8-.628-.15-1.316.236-1.784.71-.86 1.557-1.586 2.48-2.265 1.01-.745 2.167-2.147 1.472-3.222-.894-1.387-1.017-2.896-1.56-4.314-1.174-3.07-5.613-6.326-8.444-5.77-3.636.712-6.402-.76-8.173-3.595-1.276-2.04-2.967-3.473-4.895-4.405-2.033-.98-3.938-2.6-6.434-2.435-3.293.22-6.36-.177-9.023-2.47-.862-.74-2.192-2.053-3.404-.793-.89.923-3.702 1.082-1.93 3.597.534.755-.227 1.43-.725 2.004-.283.327-.672.67-1.07.187-.432-.532-.912-1.15-.717-1.864.48-1.767.28-3.723 1.71-5.283-2.368-.584-2.823 2.05-4.29 2.204-3.052.317-4.325 2.25-5.64 4.628-.806 1.455-2.192 3.004-4.224.975"></path><path id="path5872" d="M169.258 314.69c-2.768-.79-4.725-2.848-7.143-4.092-.854-.44-1.802-1.486-2.774-.485-.535.556-.99 1.625-.83 2.312.22.956 1.198 1.495 2.18 1.995 2.835 1.442 5.705.296 8.57.27z"></path><path id="path5842" d="M178.366 306.535c-1.333-.773-2.788-.467-4.18-.606-.96-.1-1.134.7-1.27 1.21-.196.735.636.665 1.093.9 1.92.987 3.192.083 4.355-1.506z"></path></g>
                  <g id="EU" fill={colors[2]} data-tip={"Europe<br/>"+salesTxt[2]} onMouseEnter={this.mouseOverMap.bind(this, "EU")}><path id="path5896" d="M314.54 12.017c-.95.52-2.082-.24-2.718.828 1.143.663 2.173 1.27 3.214 1.86.726.413 1.568.678 1.98-.274.474-1.097 1.535-1.59 2.175-2.51 1.29-1.85 2.49-1.655 3.312.56.157.425.237.99.616.713 1.317-.97 2.53.273 4.03.078-1.355-2.037-4.132-1.85-5.448-3.937 2.526.016 4.722 1.5 7.046.302.48-.248 1.064-.418 1.012-.996-.066-.715-.765-.55-1.246-.562-1.736-.038-3.628.388-5.175-.163-2.225-.794-2.97.183-3.69 2.165-.646-1.42-1.195-2.776-2.865-1.106-.43.43-1.75.282-2.516.002-1.715-.624-3.44-.287-5.16-.37-.56-.027-1.32-.193-1.46.67-.134.818.615 1.025 1.13 1.215 1.353.498 2.62 1.547 4.237.492.774-.507 1.17.304 1.528 1.035z"></path><path id="path5216" d="M368.885 86.945c.68.07 1.6.203 3.463.162 1.22-.026 2.524-.132 3.695-.39 1.17-.258 2.21-.67 2.896-1.305.61-.567 1.063-1.253 1.395-2.017.332-.765.54-1.607.666-2.48.25-1.75.16-3.63.015-5.292-.056-.644-.233-1.282-.49-1.916-.26-.634-.6-1.263-.987-1.887-.778-1.247-1.743-2.473-2.608-3.675-.866-1.203-1.633-2.382-2.012-3.534-.19-.574-.282-1.142-.242-1.705.04-.562.21-1.12.552-1.668.262-.42.764-.658 1.37-.78.605-.12 1.314-.123 1.99-.073 1.352.1 2.574.41 2.574.41s.916.513 2.113 1.088c1.198.576 2.678 1.214 3.8 1.46.725.158 1.195.067 1.493-.197.3-.265.425-.702.463-1.243.077-1.08-.205-2.57-.184-3.88.02-1.23-.34-2.653-.66-4.372-.157-.86-.304-1.792-.39-2.812-.084-1.02-.105-2.127-.01-3.334.12-.414.06-1.166-.102-2.133-.163-.966-.427-2.145-.723-3.412-.59-2.533-1.304-5.414-1.542-7.633-.123-1.144.227-2.392.402-3.592.088-.6.13-1.188.05-1.746-.057-.384-.283-.728-.485-1.078-.08.023-.1.092-.252.064-3.3-.615-6.512 2.358-9.766.04-.39-.28-1.2-.102-1.774.038-1.847.45-3.572 1.125-5.2 2.212-1.44.96-3.622 2.236-4.66-.04-.83-1.816-1.71-1.054-2.675-1.136-.537 1.22 2.034 2.685-.544 3.492-1.764.552-4.196.022-4.63 2.895-.056.37-1.14.838-2.075.484-.77-.295-1.58-.937-2.6-.577.55.844 1.74.714 2 1.706-2.47 1.53-5.52.7-7.078-2.03-.58-1.014-1.148-1.92-2.287-2.34-.49-.18-1.15-.42-1.018-1.004.16-.69.906-.722 1.527-.674.6.045 1.192.195 1.79.235 2.32.157 4.35 1.685 6.798 1.348 1.31-.178 2.946-.323 3.172-1.578.235-1.28-1.458-1.405-2.488-1.76-1.635-.563-3.25-1.215-4.918-1.642-1.395-.356-2.816-1.2-4.278-.63-1.06.413-1.728.14-2.594-.443-4.967-3.332-10.502-3.06-16.03-2.203-1.575.24-2.997 1.624-4.558 1.782-4.802.484-7.253 4.187-9.8 7.315-2.51 3.08-5.278 5.313-8.98 6.46-3.05.944-4.05 2.317-3.585 5.218.764 4.768 2.865 5.867 6.91 3.373 1.187-.733 1.852-.695 2.564.31.643.91 1.33 1.824 1.745 2.838.28.68 1.187 1.643.06 2.287-1.15.66-2.37 1.885-3.704 1.36-1.243-.493.33-1.63.044-2.513-.102-.316-.07-.675-.104-1.043-3.082 1.48-3.65 2.46-2.332 5.406.842 1.88-.168 2.99-1.39 2.934-2.882-.13-4.55 1.467-6.44 3.15-1.63 1.456-4.06 2.196-5.293 3.873-2.366 3.217-6.22 2.734-9.172 4.383-.596.333-2.31-.804-2.614.482-.306 1.308 1.41 1.085 2.233 1.545.3.17.63.294.933.46 2.07 1.153 2.593 3.53 1.707 7.43-.512 2.258-2.19 2.33-4.022 2.333-2.44.004-4.78-.58-7.154-.996-1.744-.305-3.93.095-3.72 2.096.31 2.972-.8 5.55-1.085 8.312-.157 1.5-.846 4.13 1.26 4.483 2.41.406 4.063 1.542 5.79 3.283.703-1.97 2.14-2.125 3.81-2.09 2.645.05 6.444-2.163 6.577-4.237.275-4.202 3.554-5.62 6.264-7.623.44-.326 1.03-.166.97-1.145-.12-1.952 1.33-3.18 3.246-2.488 2.535.916 4.42-.198 6.265-1.408 2.59-1.7 3.394-1.665 4.724 1.192 1.074 2.304 3.113 4.37 4.93 4.997 3.827 1.32 6.6 2.745 6.303 7.487 1.095-.98 2.356-1.516 1.564-3.11-1.124-2.262.304-2.087 1.77-1.77.464.102.893.54 1.33-.016-.114-.53-.54-.672-.947-.815-4.473-1.582-7.53-5.046-10.79-8.21-.74-.725-1.588-1.844-.33-2.92 1.097-.944 1.622.12 2.525.59 2.636 1.38 4.57 3.92 7.393 4.782 3.024.924 4.338 2.77 4.61 5.737.213 2.35 1.616 3.74 3.886 4.25.726.164 1.9-.206 2.002.74.125 1.19-1.426.535-1.93 1.166.068.876.663 1.422 1.123 2.046 1.02 1.38 1.495 1.472 2.376-.342.928-1.915.12-3.122-.793-4.43-.9-1.285-.912-2.196.71-2.744 2.2-.743 4.28-1.707 6.803-1.015 1.093.297 2.66.022 3.87-1.1-2.237-.976-2.114-2.503-1.424-4.342 1.22-3.26 2.417-6.512 5.806-8.193 1.33-.658 3.584.975 3.535 2.475-.04 1.313 1.472 2.358 2.83 1.845.936-.352 1.8-.907 2.96-1.508-1.333-.265-2.706-.325-2.735-1.552-.018-.83 1.25-1.013 2.065-1.287 1.702-.576 3.195-1.704 5.048-1.944.057.687-.02 1.245-.264 1.934-1.455 4.02-1.392 4.038 2.486 6.19 1.057.587 2.137 1.146 3.133 1.827 1.086.74 2.357 1.76 2.088 3.044z"></path><path id="path6886" d="M385.316 25.78c-1.236-.632-2.444-1.58-3.953-.43 1.243 1.145 2.547.888 3.862.548"></path><path id="path5898" d="M283.92 52.29c-.8-.667-2.085-.028-2.218-1.31-.075-.732-.402-.546-.834-.344-1.246.578-2.165 2.204-1.772 2.82.692 1.075-.67 3.574 2.005 3.3 1.126-.116 1.243.633 1.458 1.405.2.727.878 1.87.03 2.073-2.02.476-2.228 2.374-3.29 3.46.58 1.223 2.895.085 2.74 1.622-.11 1.093-2.045.89-3.096 1.42-.28.14-.53.35-1.21.81 3.788-.542 7.028-1.343 10.337-1.74.692-.082 1.272-2.41 2.52-3.254-.25-.22-.56-.68-.736-.632-2.476.65-2.51-1.476-3.118-2.794-.66-1.436-1.29-3.172-2.684-3.664-2.69-.956-1.55-1.9-.13-3.17z"></path><path id="path5890" d="M391.468 14.513c-1.184-.953-2.1-.57-3.038-.524-1.653.08-3.117 1.17-4.8.852-5.142-.97-7.895 2.407-10.448 5.912-.216.297-1.68 1.82-.366 2.283 2.025.71 3.94 2.29 6.397 1.56-2.326-2.385-2.277-3.196.2-5.7 1.862-1.88 4.287-2.475 6.737-2.99 1.72-.36 3.544-.312 5.318-1.395z"></path><path id="path5884" d="M266.588 34.804c-.973-1.158-2.09-1.99-3.777-1.498-1.063.312-2.175 1.223-3.207.735-2.296-1.082-3.937.786-5.92 1.03-1.027.127-1.097 1.13-1.008 2.026 2.086-.83 3.2 1.882 4.86 1.543 2.83-.58 5.826-.907 8.21-2.87.328-.27.75-.41.844-.965z"></path><path id="path5878" d="M275.71 56.592c-2.365-.143-3.486 1.895-5.354 2.25-.102.02-.255.543-.17.634 1.18 1.263.038 2.246-.43 3.246-.325.698-.06 1.16.243 1.68.497.862 1.06.216 1.54.004 2.28-1.005 5.355-1.204 5.095-4.88-.01-.152.094-.342.2-.47 1.644-2.038.552-2.496-1.126-2.464z"></path><path id="path5834" d="M305.46 91.166c-.052-.83.15-1.928-1.02-2.024-.794-.066-1.616.716-1.398 1.473.27.928.06 2.515 1.462 2.573 1.173.048.91-1.197.956-2.022z"></path><path id="path5832" d="M311.93 96.563c1.167.615 2.14 1.154 3.14 1.65.617.304 1.155.653 1.47-.5.28-1.014.194-1.256-.874-1.53-1.24-.322-2.336-.422-3.735.38z"></path><path id="path5828" d="M333.694 102.073c2.108 1.235 3.815 2.096 6.053.893-1.875-1.272-3.754-.968-6.053-.893z"></path></g>
                  <g id="AS" fill={colors[3]} data-tip={"Asia<br/>"+salesTxt[3]} onMouseEnter={this.mouseOverMap.bind(this, "AS")}><path id="path5928" d="M563.326 80.01l-.22-.625c-.09.068-.266.186-.26.196.11.183.242.35.37.524-.166 1.17 1.466 1.9.63 3.34-1.11 1.913-.78 2.61 1.426 4.105.115-.878-.667-2.7 1.068-2.09 2.394.834 4.014.275 5.508-1.74-2.823-1.23-5.67-2.47-8.522-3.71z"></path><path id="path5910" d="M542.156 183.11c-.19-.267-.387-.548-.59-.828-1.89-2.548-2.482-4.92.117-7.568 1.364-1.39-.698-2.145-1.426-3.027-.616-.745-1.607-2.077-2.503-.96-1.676 2.082-4.86 2.994-5.785 4.7-1.645 3.03-5.388 3.535-6.48 6.715-.215.636-.76.403-1.307.27-1.883-.458-2.908.484-2.506 2.35.378 1.76.94 3.484 1.395 5.232.572 2.192 1.99 2.974 4.212 3.455 2.027.434 4.12-.64 5.984.535 2.024 1.278 2.94.02 3.79-1.545 1.598-2.95 1.838-6.638 4.786-8.86.127-.098.19-.283.31-.47z"></path><path id="path5902" d="M491.98 172.796c.398 2.03 1.385 3.21 2.56 4.267 3.85 3.465 6.463 7.942 8.86 12.337 1.682 3.08 3.66 5.798 5.82 8.45.727.89 1.793 1.683 3.138 1.295 1.308-.376 2.11-1.49 2.212-2.664.12-1.37-.138-2.742-1.28-3.946-1.713-1.8-3.424-3.735-4.54-5.917-.625-1.216-.985-2.357-2.204-3.182-2.054-1.395-4.514-2.516-5.798-4.643-1.996-3.313-4.97-4.798-8.768-5.994z"></path><path id="path5900" d="M564.96 106.815c1.06-2.906 1.06-2.906 3.614-3.267 3.424-.483 4.355-2.182 3.166-5.536-.305-.864-.865-1.733-.613-2.738.59-2.353-.683-3.89-2.345-5.194-.687-.538-1.475-1.513-2.45-.69-.94.798.168 1.527.37 2.288.378 1.44 2.108 2.516 1.37 4.222-1.31 3.03-4.095 5.588-6.805 5.695-2.86.113-3.99 1.95-6.315 2.838 3.374 1.746 7.63-3.202 10.007 2.382z"></path><path id="path5892" d="M551.677 188.043c-1.16.266-2.35.444-3.475.818-1.423.475-1.982-.65-2.392-1.433-.483-.926.178-1.916 1.096-2.294 1.334-.546 2.673-1 4.226-.25 2.86 1.383 3.984.772 5.068-2.998-2.152 2.17-4.34 1.827-6.54 1.518-2.95-.415-4.083.224-4.834 3.006-.616 2.28-.284 4.83-2.067 6.774-.433.468-.01 1.073.267 1.417.712.877 1.137 1.678.498 2.805-.262.466-.004 1.017.475 1.36.545.396.968-.002 1.42-.222.595-.287.606-.772.463-1.314-.196-.75-.31-1.528-.607-2.236-.54-1.29.493-1.87 1.203-2.24 1.08-.568 1.225.716 1.407 1.285.444 1.403 1.048 2.45 2.824 2.57-.062-1.098.23-2.063-.367-2.93-1.632-2.38-1.192-4.17 1.333-5.636z"></path><path id="path5886" d="M534.297 205.555c-2.236-1.525-5.075-1.93-7.21-3.665-.525-.43-1.14.04-1.72.14-1.797.31-3.508.846-5.346-.438-1.17-.815-2.86-1.293-4.44-.81-.684.21-1.707.4-1.685 1.35.02.783.952.83 1.557 1.098 2.008.892 4.392.2 6.157.822 3.644 1.286 7.457 1.093 11.06 2.17.626.187 1.207.172 1.628-.667z"></path><path id="path5880" d="M552.243 155.018c-.677-2.027-.897-2.283-1.863-2.354-3.69-.264-4.7-1.772-3.36-5.117.87-2.174-.4-3.637-1.77-4.868-1.085-.977-1.708-.1-1.814 1.06-.095 1.023-.018 2.026-.47 3.04-.947 2.13 3 7.81 5.323 7.787.08 0 .166-.04.24-.08 1.26-.773 2.307.144 3.712.53z"></path><path id="path5874" d="M549.998 168.35c2.586-1.304 3.528.042 3.995 2.223.105.486.436.94.735 1.36.482.673 1.063.32 1.612.067.32-.148 1.036.01.728-.68-1.413-3.17.93-1.37 1.963-1.4-.05-2.603-1.276-4.78-2.306-7.018-1.343 3.1-1.678 3.326-5.037 3.343-1.227.007-1.535.806-1.688 2.106z"></path><path id="path5866" d="M560.677 70.273c-2.185-2.732-4.12-4.07-6.555-4.448 2.496 2.9 3.98 6.103 5.615 9.23.574 1.095 1.47 2.347 3.246 1.634-.624-2.01-2.407-2.874-3.484-4.31-.894-1.185-1.173-2.19 1.176-2.108z"></path><path id="path5864" d="M458.767 163.702c-1.307 2.007-.894 3.82-.45 5.68.243 1.013.048 2.223 1.74 1.696 1.295-.405 2.034-.916 1.61-2.573-.475-1.87-1.852-3.046-2.9-4.803z"></path><path id="path5856" d="M542.205 126.675c-1.378.634-1.965 2.03-2.204 3.285-.206 1.078.454 2.31 1.65 2.92.39.2.633.062.72-.38.32-1.622 1.426-3.146.59-4.92-.176-.372-.14-.867-.754-.905z"></path><path id="path5848" d="M560.382 206.897c-4.303-1.72-6.326-.855-8.423 3.335 2.827-1.02 4.65-3.57 8.42-3.335z"></path><path id="path5844" d="M556.83 111.988c1.587-2.33 1.214-3.86-.99-5.163-.475-.28-.874-.967-1.446-.108-.408.62-.304 1.11.248 1.546 1.117.886 1.613 2.16 2.19 3.725z"></path><path id="path5840" d="M521.392 139.15c-1.76-.195-3.2-.105-3.945 1.44-.403.836.396 1.74 1.045 1.798 2.148.19 1.972-1.87 2.9-3.24z"></path><path id="path5838" d="M543.214 159.992c-1.89 1.585-3.346 3.248-4.48 5.468 2.805-.74 4.462-2.755 4.48-5.468z"></path><path id="path5836" d="M564.156 180.526c-1.55-.513-1.775.56-2.22 1.34-.442.774.563 1.596-.16 2.418-.473.533-.537 1.248.212 1.76.35.238.738.607 1.086.127.383-.53.805-1.075.378-1.86-.74-1.353-.78-2.68.704-3.783z"></path><path id="path5826" d="M549.81 206.694c-.846-1.096-2.04-.703-2.944-1.183-.642-.34-1.528-.247-1.545.644-.01.64.7 1.25 1.457 1.176.995-.1 1.973-.405 3.033-.636z"></path><path id="path5824" d="M549.676 60.696c1.136 1.65 1.652 3.168 3.625 3.76-.486-1.984-1.24-3.277-3.623-3.76z"></path><path id="path5822" d="M541.805 206.455c-1.587-.842-2.855-.805-4.13-.23-.072.036-.083.494.027.605 1.09 1.09 2.22.068 3.34.015.15-.007.29-.143.763-.39z"></path><path id="path5820" d="M561.594 106.698c.065-.657-.212-1.044-.69-.966-.713.113-1.655.177-1.634 1.195.01.422.25 1.156.834 1.138.86-.027 1.273-.727 1.49-1.367z"></path><path id="path5816" d="M553.543 156.906c1.16 2.464 1.35 2.62 3.134 2.682-.682-1.18-1.24-2.477-3.134-2.682z"></path><path id="path5814" d="M562.766 193.17c1.39 1.234 2.67 1.57 4.2.232-1.4.002-2.605-1.12-4.2-.233z"></path><path id="path5920" d="M385.225 25.898c-.124.64.724 1.848.162 2.01.202.35.428.694.484 1.078.084.558.04 1.147-.047 1.746-.175 1.2-.525 2.448-.402 3.592.24 2.22.95 5.1 1.544 7.633.296 1.267.56 2.446.723 3.412.162.965.22 1.717.1 2.13-.093 1.208-.072 2.315.013 3.335.084 1.02.23 1.953.39 2.812.317 1.72.677 3.142.658 4.372-.02 1.31.26 2.8.185 3.88-.038.54-.164.977-.463 1.242-.298.264-.768.355-1.492.197-1.123-.247-2.603-.885-3.8-1.46-1.198-.575-2.114-1.088-2.114-1.088s-1.222-.31-2.574-.41c-.676-.05-1.385-.047-1.99.074-.606.12-1.108.358-1.37.78-.34.548-.512 1.105-.552 1.667-.04.563.052 1.13.242 1.707.38 1.153 1.146 2.332 2.012 3.535.865 1.202 1.83 2.428 2.607 3.675.386.624.726 1.253.984 1.887.258.634.435 1.272.49 1.916.145 1.662.236 3.543-.013 5.29-.124.875-.333 1.717-.665 2.482-.332.764-.785 1.45-1.397 2.017-.687.636-1.726 1.047-2.897 1.305-1.17.258-2.475.364-3.694.39-1.863.04-2.782-.09-3.463-.162 0 .004.005.006.004.01-.288 1.317-1.29 2.3-3.03 2.727-2.568.63-4.545-.373-6.678-1.258-3.32-1.38-6.64-2.707-9.964.017-.258.213-.67.478-.93.41-3.65-.94-5.565 3.5-9.09 2.92-.02-.004-.09.293-.17.555 1.28.684 1.794 1.738 2.033 3.274.51 3.235 3.71 4.755 6.774 3.5.68-.28 1.555-.484 2.014-.113 2.433 1.974 4.683 1.347 7.17.047 1.24-.648 3.007-.136 2.816 1.565-.365 3.26-1.194 6.47-1.928 9.682-.24 1.042-.616 2.156-2.002 2.294-3.325.332-6.694-1.112-10.006.23l7.518 3.178c.61-.42.887.245 1.252.54 1.032.84 1.23 2.51 2.78 2.86.476-.813-.295-2.34 1.003-2.413.968-.054.966 1.383 1.114 2.123.396 1.947 1.254 3.528 2.608 4.967 2.068 2.198 4.323 4.65 5.328 7.22 1.624 4.137 3.544 7.898 6.455 11.173 2.38 2.68 3.17 5.825 3.743 9.29.637 3.87 2.84 4.637 6.55 2.96 2.368-1.067 4.684-2.25 7.085-3.228 2.35-.958 4.55-1.956 5.982-4.262.687-1.105 2.083-1.69 3.348-1.815 2.515-.25 3.98-1.867 5.443-3.587 1.9-2.23 2.743-5.21 5.148-7.106 1.145-.904.664-1.922-.332-2.566-1.665-1.078-2.975-2.646-4.9-3.367-1.36-.51-2.04-1.592-1.78-3.06.118-.675.02-1.13-.668-1.584-.658 1.38-1.776 2.342-2.816 3.37-2.054 2.032-4.58 2.46-6.317-1.41-.327-.74-.637-1.536-1.53-.276-.843 1.19-2.03.905-2.35-.367-.714-2.86-2.37-5.118-3.982-7.47-.773-1.128.028-2.398.746-3.32.73-.94 1.673-.285 2.58.054 1.614.602 1.98 2.098 2.643 3.37 1.616 3.1 6.6 5.365 9.837 4.2 1.39-.5 2.358-.387 3.158.77 2.424 3.503 5.88 3.574 9.596 3.047 1.357-.192 2.767-.285 4.13.187 1.194.42 2.374.388 3.517-.234 2.054-1.125 3.765-.036 4.635 1.484 1.082 1.888 3.202 2.316 4.37 3.93.59.813 1.86-.598 2.296.47.53 1.293-.896 1.145-1.47 1.636-.065.058 0 .313.056.46.533 1.467 1.69 2.206 3.14 2.376 1.278.15 2.497-.04 2.315-1.857-.06-.616.31-1.004.878-1.078.48-.065.822.305.95.732.25.817.757 1.747.567 2.48-.907 3.56.58 6.578 1.903 9.65 2.557 5.936 5.735 11.606 7.6 17.843.516 1.716 2.717 2.268 3.785 1.04 3.468-3.993 3.9-8.802 3.318-13.716-.153-1.313-.217-2.34.856-2.883 3.004-1.516 4.533-4.562 7.07-6.6 1.603-1.286 2.68-3.275 4.796-4.08.223-.082.48-.588.422-.83-.634-2.815 1.568-2.79 3.236-3.248 1.16-.317 2.475-.28 3.506-.81 1.963-1.01 2.948-.153 3.61 1.512.74 1.847 2.07 2.928 3.71 4.065 2.214 1.533 3.297 4.22 3.54 6.875.105 1.122.05 1.927 1.046 2.553 1.247.787 1.694-.382 2.336-.956 1.806-1.62 2.645-1.42 3.39.885.64 1.967.937 4.137 1.98 5.857 1.387 2.29 1.253 4.346.913 6.865-.256 1.89-1.86 4.557.906 6.127 2.282 1.3 3.402 3.164 3.895 5.753.747 3.93 2.604 7.268 6.34 9.246.71.376 1.942.87 1.677-.208-.828-3.358-1.01-7.068-3.862-9.637-2.06-1.856-4.11-3.482-5.607-6.127-1.623-2.862-1.647-5.167-.84-7.956.15-.517-.124-1.182-.278-1.757-.212-.79-.39-1.593.37-2.137.83-.595 1.555.083 2.07.545 2.16 1.94 4.98 3.16 6.46 5.86.253.462.42 1.234 1.316.823 2.608-1.19 2.172.444 1.774 1.963-.14.537-.246 1.045.205 1.44.72.636 1.214-.16 1.496-.493 1.616-1.906 3.54-3.34 5.708-4.587.826-.475 1.442-1.83 1.254-3.01-.698-4.336-1.99-8.423-5.71-11.214-1.2-.904-2.17-1.942-2.974-3.205-1.615-2.53-.98-5.002 1.79-6.662 2.934-1.756 4.307-1.374 6.048 1.838 1.805-2.503 4.038-3.71 7.242-3.987 2.495-.216 5.294-1.098 7.29-3.028 3.85-3.717 4.15-8.947 5.548-13.684.66-2.23-3.455-1.347-2.5-2.48 1.924-2.27-.048-2.675-1.076-3.42-1.013-.733-1.898-1.45-2.422-2.606-.674-1.484-1.24-3.023-3.03-3.67-.868-.314-.668-1.136-.522-1.998.408-2.442 2.923-2.74 4.26-4.358-1.388-.785-2.825-1.39-4.216-1.08-2.208.494-5.145-.246-6.49-1.947-.538-.68-.725-1.374.115-1.687 1.574-.584 2.377-1.91 3.424-3.034 1.532-1.645 2.61-1.396 3.153.8.516 2.092 1.163 2.884 3.246 1.264 1.833-1.428 4.823.084 4.79 2.346-.02 1.104.397 1.414 1.256 1.508 1.19.13 2.04.79 2.943 1.502 1.633 1.284 1.94 3.255 2.7 4.96.717 1.597 1.503 1.777 2.84.862 1.205-.82 3.35-.795 2.03-3.412-1.533-3.032-4.41-4.25-6.893-6.04-1.26-.908-2.098-1.743-.024-2.733 1.25-.596 2.036-1.262 1.086-3.01-.836-1.53 1.093-2.682 1.61-4.084.4-1.098 1.62-.152 2.28.116 1.12.45 2.067.126 2.57-.585 1.704-2.406 2.762-5.11 2.957-8.1.277-4.202-.272-8.112-3.89-10.93-.062-.05-.095-.148-.125-.228-.935-2.668-3.448-3.76-5.416-5.388-.548-.454-1.252-.676-1.938-.214-1.886 1.274-3.632.33-5.372-.35-1.827-.712-3.55-1.452-1.607-3.87.54-.674.522-1.798.757-2.716.96-3.755 3.834-5.518 7.662-4.576.96.238 1.942.492 2.81.156 2.57-1.005 4.93-.826 7.432.402 1.73.853 3.043-.33 2.94-2.28-.165-3.046 1.048-3.994 4.028-3.337 1.12.246 2.13.572 3.103 1.208 1.238.81 2.173.68 1.953-1.145-.182-1.523 1.016-1.992 1.86-1.568 1.393.7 2.768 2.37 2.132 3.742-.963 2.082-.702 4.46-1.965 6.38-.53.812-.387 1.552.065 2.403 2.632 4.97 7.956 7.337 11.228 11.688.496.66 1.235.257 1.897-.063 1.065-.514.424-1.145.174-1.71-.29-.644-.174-1.428-.373-1.936-.62-1.58.703-3.09.273-4.25-1.013-2.733-2.115-5.56-5.613-6.42-1.77-.434-2.815-3.69-1.735-3.968 2.733-.708 5.11-3.476 8.34-1.703 1.345.737 2.242-.18 2.756-1.068 1.33-2.305 3.108-3.375 5.768-2.828.56.117 1.153-.097 1.32-.572.242-.68-.527-.822-.938-.988-2.16-.875-4.37-1.618-6.503-2.547-.654-.285-2.145-.04-1.76-1.27.3-.958 1.436-.607 2.277-.252.298.127.65.12.946.168.502-.998-1.464-1.267-.523-2.232.722-.74 1.463-.054 2.172.14 2.664.735 5.344 1.43 7.967 2.287 1.306.426 2.44.584 3.586-.42-.318-.258-.6-.45-.84-.69-2.054-2.06-4.07-4.14-7.393-2.38-.66.35-1.34-.27-1.892-.63-2.166-1.403-4.616-2.003-7.094-2.215-1.944-.165-3.666-.803-5.483-1.368-5.93-1.843-12.09-2.338-18.248-2.963-.273 1.083 1.323 1.397.677 2.188-.8.977-1.534-.137-2.29-.35-2.832-.81-5.752-1.73-8.65-1.11-3.606.773-6.837.26-10.005-1.425-.833-.443-1.66-1.006-2.692-.712-4.31 1.232-8.586-.677-12.895-.163-.374.046-.832-.252-1.192-.48-3.136-1.975-6.808-1.798-10.246-2.536-1.665-.358-3.39-.91-5.123-.497-.677.16-1.653.095-1.94.92-.77 2.216-1.53 2.62-3.698 2.366-1.605-.19-3.448-1.335-4.766-.48-3.562 2.313-6.026.126-8.62-1.618-2.065-1.39-4.188-2.34-6.735-2.314-4.388.042-8.843 1.817-13.166-.416-.19-.098-.528-.01-.754.09-2.097.937-4.144.74-6.215-.14-1.392-.592-2.815-.35-4.273-.032-1.48.322-3.355 1.91-4.34.273-.42-.7 2.097-1.813 3.44-2.495 1.33-.674 1.542-1.21.074-2.054-2.772-1.593-5.71-1.795-8.73-1.18-1.434.293-2.56.08-3.917-.59-2.42-1.194-5.013-2.21-7.643-2.762-4.484-.942-9.08-1.285-13.393-3.068-.67-.276-1.423-.523-2.166-.52-.742.004-1.476.26-2.104.99-.237.276-.883.445-.568.977.146.246.576.488.853.46 3.933-.36 7.64 1.715 11.575 1.065 1.706-.28 2.228.512 2.01 2.41 1.655-1.707 3.35-1.34 4.965-1.314.86.014 1.21.634.52 1.127-1.584 1.132-2.717 3.048-5.36 2.268-3.537-1.046-6.932.757-10.4 1.242-.57.077-1.034.274-.698 1.006 1.035 2.25-1.146 2.175-1.9 1.973-2.662-.71-4.418.554-6.3 2.045-1.45 1.15-3.017 2.365-5.074 2.04-.69-.107-1.47-.52-1.916.124-.528.76.197 1.48.557 2.135.434.795 1.272 1.158 2.056 1.53 1.462.693 2.4 1.806 2.25 3.44-.16 1.73-1.405 2.646-2.97 3.214-.62.227-1.198.397-1.66-.16-.48-.584.124-.97.43-1.3 1.53-1.663.954-2.996-.43-4.42-.89-.918-1.393-2.207-2.286-3.12-1.02-1.05-1.46-2.574-2.89-3.28-1.652-.817-4.563-.208-5.224 1.474-.725 1.848.496 3.007 2.11 3.767.63.297 1.234.634 1.853.948.61.31 1.487.594 1.017 1.455-.398.736-1.076 1.212-2.14.706-3.86-1.827-8.073-2.306-12.192-3.136"></path><path id="path5810" d="M355.887 101.243c-.717.492-.965.725-1.26.85-.454.193-.935.326-1.414.45-.946.25-.877.956-.203 1.133 1.005.262 1.867-.447 2.524-1.232.138-.164.14-.443.353-1.2z"></path></g>
                  <g id="NA" fill={colors[4]} data-tip={"North America<br/>"+salesTxt[4]} onMouseEnter={this.mouseOverMap.bind(this, "NA")}><path id="path5926" d="M181.233 66.485c-2.833 1.613-4.37 4.582-7.332 6.61 3.753.416 6.997 1.23 10.343.204 1.626-.5 1.465-1.2.786-2.4-.475-.847-1.305-.918-1.96-1.074-1.91-.454-2.29-1.542-1.744-3.23.208-.073.418-.148.626-.22-.067-.092-.186-.267-.194-.26-.182.11-.35.24-.523.368z"></path><path id="path5924" d="M174.493 9.605c-.5-.607-1.072-.64-1.925-.117.747.093 1.288.163 1.83.23-.012.945-.56 1.23-1.42 1.52-2.127.72-4.235.51-6.382.065 2.207 1.568 2.75 1.805 4.56 1.238 1.634-.51 3.036-.272 4.474.533.703.393 1.305.72 2.343.205 6.22-3.09 12.53-5.937 19.554-6.832 3.82-.49 6.97-2.796 10.383-4.415-10.137 1.13-20.33.96-30.36 2.765 2.818-.336 5.516 1.285 8.354.403.72-.225 1.527-.453 1.755.39.245.905-.82.97-1.37 1.213-.527.234-1.186.228-1.785.21-2.066-.052-4.136.21-6.19-.435-.888-.28-2.72.206-2.224 1.002 1.73 2.777-.44 1.883-1.6 2.03z"></path><path id="path5916" d="M115.952 165.48c-1.38-2.408-3.415-2.033-5.458-1.218-3.344 1.33-7.49-2.097-6.936-5.733.39-2.548.87-5.08 1.322-7.615.258-1.44-.303-2.025-1.724-2.59-2.418-.96-4.624.173-6.916.216-2.364.044-2.258-.8-1.527-2.41 1.353-2.977 2.606-6.003 4.04-8.942.876-1.794-.184-2.366-1.48-2.235-2.222.228-4.53.187-5.47 3.25-1.116 3.657-4.785 4.01-7.88 4.37-2.426.286-4.375-1.48-5.164-3.66-1.145-3.165-2.646-6.405-.89-9.944.76-1.525 1.32-3.213 1.62-4.89.574-3.148 1.98-5.455 5.185-6.426.57-.17 1.144-.467 1.604-.843 2.627-2.152 5.257-3.027 8.53-1.05.78.474 2.514 1.89 3.78-.193 1.47-2.414 3.327-2.718 6.13-1.808 1.46.474 2.737 1.69 4.65.916 1.2-.488 3.39 2.204 2.864 3.54-.97 2.456.317 4.407 1.125 6.426.51 1.274 1.343 1.64 2.317.016 1.545-2.567.247-5.048.018-7.52-.195-2.144-.364-4.07 1.132-5.873 2.25-2.718 5.12-4.602 8.223-6.067 3.72-1.76 5.165-3.715 5.088-7.787-.025-1.326.387-1.667 2.143-1.612.4.014.32-.205.445-.383 2.508-3.644 5.88-6.108 10.07-7.547 1.555-.534 3.525-.71 4.075-2.71.412-1.498 1.39-2.266 2.72-2.832 1.907-.814 3.757-1.772 5.687-2.528 1.758-.69 3.58-1.226 5.397-1.754.6-.174 1.372-.02 1.48.685.09.564-.594.69-1.1.875-.887.326-1.76.73-2.582 1.2-.403.232-1.078.6-.82 1.124.277.556.946.656 1.576.284 2.39-1.427 5.084-2.114 7.664-3.077.79-.295 1.453-.783 1.934-1.508-.882-.405-1.553.233-2.302.3-1.865.173-3.31-.5-4.4-2.12-1.16-1.724-.018-2.383 1.118-3.31.565-.463 1.144-1.27.812-2.24-2.286-.35-4.34.164-6.3 1.217-.917.492-1.872.91-2.796 1.385-.455.234-.838.212-1.11-.225-.288-.457-.083-.914.314-1.11 4.305-2.134 8.465-5.182 13.55-4.39 5.54.86 10.095-1.367 14.7-3.682 1.25-.63 2.75-1.738 1.914-3.388-.877-1.73-2.623-1.744-4.318-.982-.238.107-.493.182-.716.314-.52.312-1.013.337-1.328-.235-.283-.513.19-.865.512-1.032 1.247-.653.667-1.384.347-2.312-.395-1.144-1.73-1.866-1.244-3.453.562-1.84-.278-3.705-.44-5.56-.136-1.538-1.12-.718-1.59-.32-1.4 1.188-2.905 2.165-4.54 2.98-.875.434-1.63.958-2.487-.092-.708-.863-1.763-1.487-.794-2.842.907-1.268.347-2.305-.8-3.062-1.006-.667-2.012-1.425-3.134-1.806-4.798-1.63-6.515-.92-8.947 3.595-.52.962-1.198 1.64-2.137 2.175-.884.503-1.488 1.34-1.108 2.4 1.093 3.044-1.005 4.72-3.025 5.74-3.306 1.67-6.222 3.372-6.81 7.41-.034.244-.163.53-.343.69-1.037.927-2.205 1.94-3.62 1.61-1.162-.267-1.556-1.72-1.706-2.734-.135-.91.415-1.995.865-2.903.876-1.758 1.152-3.003-1.46-3.278-1.52-.163-2.916-.858-4.26-1.747-1.256-.828-2.61-1.7-4.287-1.703-2.78-.006-3.258-2.717-4.164-4.35-.683-1.234.994-2.984 2.44-3.854 2.88-1.737 5.672-3.652 8.906-4.725.61-.2 1.522-.067 1.404-1.12-.163-1.475.457-1.395 1.694-1.24 2.558.324 4.895-.687 7.424-1.6-.49-.544-.754-.78-.94-1.063-.287-.443-1.207-.684-.6-1.442.546-.68 1.154-.158 1.615.143 1.045.688 1.993.42 2.904-.17 1.23-.798 2.56-1.02 3.98-.9 3.216.272 5.988-.35 7.86-3.368.426-.684 1.553-1.185 1.15-2.048-.345-.742-1.406-.83-2.32-.868-1.203-.05-2.212.18-3 1.17-1.047 1.323-2.42 2.232-3.972 2.85-.654.262-1.325 1.077-2.08.183-.62-.736-.01-1.416.364-1.86.95-1.126.22-1.74-.665-1.633-2.984.357-2.755-1.16-1.99-3.075.206-.52.406-.956-.09-1.4-.542-.485-1.095-.396-1.684-.093-1.453.744-2.912 1.475-4.416 2.237 2.15 2.163 1.793 3.516-1.05 4.195-.863.207-1.707.403-2.367.957-1.448 1.217-2.845 1.815-4.373.15-.604-.66-1.497-.747-2.18-.455-2.127.91-4.057.1-6.056-.407-3.125-.795-5.895-.306-7.984 2.407-.658.86-1.34 1.23-1.823-.127-.666-1.866-1.77-2.265-3.648-1.557-.995.375-2.235.115-3.365.118-1.94.005-1.648-.852-.644-1.994-.84-.067-1.68.058-2.347-.222-3.303-1.386-6.587-2.676-10.26-1.477-.285.093-.725-.022-.993-.193-2.777-1.772-5.728-.727-8.49-.258-4.58.78-8.975 2.177-13.782 1.054-9.175-2.142-18.322-4.244-27.975-2.777-5.577.85-10.628 3.483-16.257 3.936-1.31.106-1.786 1.056-.495 2.08 1.49 1.177.69 1.732-.537 2.3-1.13.524-2.186.852-3.485.48-2.895-.838-5.31.376-7.998 1.988 2.402.966 4.34 1.967 6.504.536.553-.364 1.254-.337 1.58.323.337.673-.4.77-.77 1.08-1.34 1.118-2.673 2.058-4.58 2.15-1.87.093-3.745.518-5.57.99-1.314.34-3.41 1.174-3.087 2.256.936 3.144-1.37 3.857-3.2 5.107 1.416 1.05 2.682 1.927 4.306.795.46-.32 1.004-.504 1.37.044.514.774-.31 1.067-.716 1.39-.46.373-1.087.532-1.608.837C5.774 52.233 2.3 53.295-1.54 54.98c1.3 0 2.066.203 2.664-.03 6.262-2.432 12.82-4.353 18.633-7.605 4.615-2.58 10.05-.497 14.25-3.704.15-.112.62.25.956.308 5.086.884 9.933 2.386 14.386 5.11 1.465.897 2.083 2.02 1.936 3.62-.215 2.302.94 4.857-1.347 6.8-.49.416.04 1.13.274 1.688.194.45.578.927.063 1.418-1.653 1.57-.303 2.596.834 3.24 1.746.992 2.48 2.568 3.18 4.24.38.912-1.648 4.42-2.58 4.512-.404.043-.708-.21-.74-.546-.068-.66.166-1.32-.98-1.286-1.09.03-1.23.72-1.473 1.462-1.768 5.36-6.98 8.58-8.71 13.97-.072.224-.356.375-.533.566-1.54 1.646-2.095 5.028-1.128 7.077.177.38.223.7.266 1.12.327 3.294-.67 7.082 3.67 8.886 1.39.58 2.335 2.51 1.83 3.995-.89 2.603.277 4.523 1.295 6.61.394.81 1.146 1.532.464 2.615-.952 1.514-.23 2.52 1.114 3.407.9.596 2.156 1.24 1.815 2.59-.78 3.06 1.84 3.853 3.173 5.507-1.766-5.405-2.766-11.015-5.227-16.13-.747-1.55-.33-3.003 1.165-3.36 1.427-.343 2.338.644 2.644 2.408.92 5.272 3.722 9.697 6.81 13.967 2.114 2.92 4.563 5.813 2.85 9.846-.29.683-.2 1.15.3 1.615 1.454 1.347 2.647 2.962 4.552 3.824 3.627 1.643 7.214 3.38 10.78 5.146 1.02.504 1.89.48 2.95.114 3.85-1.33 4.905-.955 7.32 2.326 1.5 2.044 6.67 4.537 8.41 3.653 1.473-.748 1.513.014 1.87.917.93 2.357 2.08 4.884 3.508 6.66 2.21 2.748 5.567 4.708 9.172 5.803.91.274 1.543.723 1.632-.884.103-1.847 1.802-1.872 3.153-1.755.828.075 2.3.306 2.296.78"></path><path id="path5912" d="M273.78 4.48c-.535-.026-.986-.153-1.378-.05-3.173.843-6.138.513-8.884-1.383-.258-.177-.68-.097-1.005-.2-6.163-2.004-12.413.126-18.644-.34-3.66-.275-7.42 1.393-11.174 1.642-3.31.215-6.53 1.16-10.006.396-5.284-1.16-10.554-.763-15.6 1.736-2.43 1.2-4.902 2.483-7.76 2.69-1.876.135-3.767.122-5.653.564-1.092.257-.913.75-1.163 1.444-.36.998.145 1.365.818 1.518 1.734.396 3.367.994 5.307.528 4.8-1.153 9.172 1.244 9.906 7.196.085.69.432.822.82 1.108 2.74 2.015 2.697 5.004-.12 6.902-.856.576-1.807 1.018-2.647 1.617-1.64 1.166-2.883 2.534-1.667 4.714.39.7.353 1.344-.1 1.945-.867 1.15-.4 2.287-.04 3.435.84 2.655 3.296 3.36 5.393 4.53 2.297 1.277 3.99.238 5.446-1.394.853-.956 1.456-2.135 2.162-3.22 2.315-3.555 5.194-6.08 9.76-6.365 1.627-.102 3.47-.29 4.938-1.315 3.373-2.347 6.476-4.62 11.23-4.024 3.098.388 6.457-1.3 9.717-2.06-1.25-1.398-1.27-1.476-2.246-1.246-.91.213-2.01.957-2.622-.003-.748-1.17.93-.812 1.215-1.345 1.07-2.02 1.086-2.1 3.023-.464 1.258 1.058 2.417 1.38 3.806.328-.993-1.81-2.97-2.094-4.42-3.135-.37-.263-.987-.586-.605-1.21.137-.22.594-.39.873-.354 5.527.71 8.2-3.324 11.247-6.735.143-.162.21-.446.213-.677.082-2.926 1.463-4.18 4.41-4.836 1.808-.398 4.075.193 5.447-1.936z"></path><path id="path5908" d="M176.88 40.817c-.365-.3-.778-.5-.967-.828-.398-.696-2.09-.54-1.48-1.67.545-1.014 1.646-.364 2.563-.053.79.267 1.544 1.51 2.492.403.906-1.05.733-2.186.04-3.35-.35-.587-1.146-1.312-.167-2.01.715-.507 1.487-.85 2.383-.224.562.394 1.26.588 1.84.963 1.8 1.162 2.747-.015 3.5-1.34.9-1.59-.624-1.897-1.532-2.367-1.472-.766-2.97-1.835-2.555-3.49.527-2.088-.797-2.283-1.962-2.537-1.94-.415-3.66-.975-4.604-2.916-.288-.59-.817-.957-1.493-.494-2.075 1.423-3.616.113-5.087-1.07-1.31-1.047-2.494-1.468-4.262-.964-1.592.45-2.846 1.122-3.96 2.27-.345.357-.707 1.236-1.424.472-.616-.66.075-1.056.417-1.525.473-.653 1.45-.95 1.44-2.08-2.477.11-4.48 1.047-6.283 2.665-.895.802-2.47 1.516-1.842 2.688.585 1.095 2.296 1.862 3.676 1.3 2.15-.875 4.09.044 6.104.275.673.075 1.24.327 1.98.058 3.664-1.34 5.136-.724 7.183 2.776.734 1.255 1.377 2.616 2.903 3.162.478.17 1.097.366.975.993-.112.582-.772.573-1.262.743-.738.254-1.42.64-2.21.103-1.807-1.235-3.384-.14-4.26 1.087-1.143 1.6-2.382 1.52-3.83 1.108-1.697-.484-3.216-.45-4.536.854.815 1.298 1.883.722 2.783.403 2.623-.926 4.444-.546 5.945 2.174 1.394 2.527 5.03 3.447 7.495 2.416z"></path><path id="path5904" d="M117.705 18.228c-6.614-3.958-11.746.023-17.03 3.194.808 1.675 1.84 1.718 3.538 1 2.026-.857 4.136-2.597 6.57-.75.338.256.85.374.726.87-.066.25-.48.445-.768.604-.455.252-1.18-.29-1.548.578 1.288 0 2.5-.01 3.714.003.684.007 1.668-.112 1.708.738.042.884-.933.813-1.613.818-1.604.012-3.21.005-5.468.005 4.47 2.767 8.422 4.118 12.84 1.727 1.015-.55 1.99-.876 3.2-.345 3.137 1.38 5.78.037 8.432-1.696-.796-1.178-3.904-1.127-1.824-3.64.44-.535 1.45-1.443.414-2.163-.794-.55-1.62.15-2.24.827-.413.446-.84.885-1.314 1.265-.633.512-1.31.303-1.342-.433-.09-2.037-1.02-1.67-2.05-.78-.687.59-1.235.19-1.903.107-1.974-.245-3.725-1.475-5.865-1.13.445-.917 1.405-.17 1.82-.797z"></path><path id="path5882" d="M105.365 133.753c.857-.284 1.734-.514 2.562-.863.964-.405 1.816-.708 2.957-.38 3.08.88 3.103.796 7.09 5.32.095.104.336.16.48.123 2.528-.59 5.145 1.478 7.62-.277-2.385-2.636-10.515-6.354-13.885-6.477-2.614-.094-5.037.172-6.826 2.552z"></path><path id="path5876" d="M174.648 15.067c-1.117-.953-2.286-.684-3.397-.74-3.34-.164-6.813 1.125-9.95-1.285-1.12-.86-2.253.423-3.24 1.025-.35.21-.628.915-.566 1.34.096.665.817.454 1.298.48 1.636.075 3.327.41 4.872.35 3.62-.146 7.544 1.93 10.986-1.17z"></path><path id="path5870" d="M124.458 142.107c4.672.65 8.935 1.055 13.178-.793-2.463-2.608-5.536-2.38-8.644-2.182.91 4.545-2.784 1.804-4.534 2.975z"></path><path id="path5862" d="M145.41 17.703c-3.242-.82-5.278 3.316-8.686 2.018 1.765.43 2.276 3.36 4.96 1.98 1.854-.955 3.424-1.794 3.727-3.996z"></path><path id="path5860" d="M162.733 7.783c2.802.123 4.995 1.846 7.206-.304.51-.495 1.85-.42 1.53-1.376-.3-.888-1.447-1.295-2.403-1.112-2.068.404-4.117.95-6.335 2.79z"></path><path id="path5858" d="M153.99 37.486c.07-.516-.256-.808-.547-1.12-1.803-1.95-4.668-1.945-6.513.044-.364.393-1.16.692-.74 1.422.36.623.99.532 1.6.284 1.637-.664 3.24-.833 4.824.216.985.653 1.06-.357 1.377-.846z"></path><path id="path5854" d="M52.22 70.54c.113-1.048-2.633-4.082-3.64-3.866-.757.162-1.707.412-1.03 1.727.78 1.505 2.14 2.13 3.522 2.75.405.183 1.06.14 1.148-.61z"></path><path id="path5852" d="M154.517 18.318c-2.084-1.03-5.58-.62-6.883.703-.28.285-.75.543-.428 1.048.122.19.524.446.6.393 1.93-1.38 4.644-.26 6.71-2.14z"></path><path id="path5830" d="M139.343 26.585c-.525-.296-.804-.51-1.12-.62-1.415-.488-2.467.38-3.518 1.066-.306.2.105.585.33.805 1.194 1.16 1.985-.256 2.954-.495.394-.097.736-.4 1.352-.755z"></path><path id="path5818" d="M116.688 142.047c1.697 1.355 1.697 1.355 3.773.653-1.215-.782-2.297-1.51-3.77-.653z"></path><path id="path5808" d="M143.03 142.054c-.368-.47-.964-.39-1.527-.383-.548.01-1.19.215-1.162.75.038.704.744.816 1.38.783.65-.033 1.143-.27 1.312-1.148z"></path></g>
                  <g id="OC" fill={colors[5]} data-tip={"Oceanica<br/>"+salesTxt[5]} onMouseEnter={this.mouseOverMap.bind(this, "OC")}><path id="path5922" d="M610.708 211.614c.172.126.34.26.523.37.01.007.13-.17.2-.258l-.623-.226c-.46-1.705-2.208-2.034-3.295-3.07-1.68-1.608-3.786-3.635-3.54-5.62.317-2.562-.706-3.446-2.328-4.708-3.884-3.022-8.545-4.387-12.83-6.534-3.37-1.687-5.854-1.676-8.62.578-.462.377-1.037.58-1.298 1.19-.503 1.158-1.074.737-1.73.096-.643-.632-1.07-1.378-1.33-2.202-1.307-4.2-2.23-4.577-6.12-2.304 1.053.553 2.037 1.08 3.027 1.59.912.464 1.798.676.42 1.897-1.092.97-.305 2.38.94 2.37 3.283-.023 5.667 1.99 8.368 3.24 3.533 1.637 3.98 3.92 1.485 6.636.308.17.658.536.902.475 2.053-.51 3.39.376 4.9 1.75 1.926 1.75 4.35 1.064 5.673-1.215.897-1.55 1.967-2.29 3.804-1.422 1.38.648 2.74 1.452 3.376 2.74 1.695 3.452 4.824 4.104 8.102 4.626z"></path><path id="path5914" d="M592.347 212.718c-1.676 2.43-2.453 5.122-2.457 7.982-.006 3.14-1.982 5.24-4.06 6.847-1.767 1.366-2.935-1.346-4.49-2.004-1.08-.454-1.958-1.396-2.918-2.132-2.44-1.88-2.515-2.87-.924-5.604.38-.647 2.353-1.68.255-2.57-2.424-1.025-4.905-2.29-7.548-.388-.61.44-1.395.78-2.138.87-2.26.28-3.21 2.044-3.962 3.71-1.127 2.478-1.507 2.736-3.595 1.14-2.285-1.748-4.63-1.7-6.173.748-1.194 1.892-4.147 2.463-3.94 5.35.02.276-.532.43-.865.197-1.774-1.23-2.21.234-2.686 1.388-1.02 2.47-2.693 4.645-5.26 4.99-4.41.6-8.13 2.735-12.14 4.26-1.81.69-2.414 1.916-3.26 3.34-1.2 2.03.01 4.028-.254 6.067-.45 3.537-1.448 7.133-.29 10.78.97 3.06.118 5.71-2.35 7.803-.924.782-.376 1.512.292 1.857 1.262.657 2.492 1.344 4.14.71 2.96-1.14 5.92-2.315 9.157-2.606 1.604-.143 3.296.19 4.813-.79 2.807-1.8 5.988-2.915 9.225-3.215 3.582-.334 7.445-2.246 10.774 1.222 1.4 1.453 1.902 3.224 2.844 4.9 1.102-1.456 3.03-1.817 4.276-3.156.256-.275.86-.69 1.378-.13.493.537.197.984-.205 1.34-.818.725-.554 1.23-.27 2.266.414 1.504 1.616 2.935 1.132 4.65-.258.91-1.392 1.8.07 2.652 1.74 1.007 3.446 2.66 5.585 1.563 1.336-.685 2.163-.796 3.026.434.8 1.14 1.438.854 2.465.062 1.682-1.302 3.51-2.626 5.914-1.677.73.287 1.11-.235 1.412-.804 1.926-3.653 6.05-5.412 7.892-9.154.2-.403.81-.608 1.24-.89 5.444-3.58 8.532-8.59 9.14-15.088.186-1.985 1.023-4.063-.876-5.775-1.838-1.658-2.853-3.83-3.833-6.078-.955-2.2-1.692-4.64-3.733-6.162-1.716-1.277-1.858-2.765-1.342-4.688.656-2.435.15-4.96-1.388-6.782-1.402-1.66-2.373-3.34-2.843-5.39-.17-.75-.325-1.51-1.227-2.04z"></path><path id="path5894" d="M613.547 295.613c.733.085 1.64-.095 2.505-.57 5.202-2.86 9.813-6.66 15.065-9.452.816-.43 1.155-1.26.443-2.395-.89-1.412-1.636-.475-2.192-.015-3.34 2.77-6.926 5.095-11.045 6.518-2.13.734-4.122 1.716-6.004 2.955-.804.526-1.974 1.013-1.68 2.03.33 1.155 1.663.89 2.906.93z"></path><path id="path5888" d="M640.457 268.668c.056 1.076.002 1.865.153 2.614.73 3.616.495 4.213-2.614 6.003-.913.528-2.353 1.445-1.988 2.11 1.18 2.146-.315 3.026-1.733 4.145 2.273.347 11.038-5.828 11.682-7.96-2.444.634-4.858-1.664-4.232-4.24.296-1.22.275-1.972-1.268-2.672z"></path><path id="path5868" d="M575.345 288.723c1.727-.734 3.34-1.59 4.624-2.88.564-.566 1.434-1.382 1.13-2.15-.45-1.13-1.456-.377-2.243-.153-.916.26-1.657-.41-2.505-.5-3.392-.355-.618 2.814-2.093 3.705-.66.4-.703 1.38.4 1.758.237.08.48.155.684.22z"></path><path id="path5850" d="M633.99 230.644c-.344 3.255 2.323 6.848 5.894 8.17-2.182-2.37-4.14-4.91-5.894-8.17z"></path><path id="path5846" d="M614.595 196.652c-1.6 2.38-4.126 2.97-6.725 3.58 2.963 1.975 5.975.485 6.725-3.58z"></path><path id="path5812" d="M668.022 228.1c-1.566-.425-2.163-1.58-3.172-.844-.675.495-.14 1.192.218 1.532.983.94 1.52-.233 2.954-.688z"></path><path id="path5806" d="M614.22 193.67c-.906-.638-1.63-1.175-2.652-.996.744.49 1.338 1.337 2.653.996z"></path><path id="path5804" d="M616.436 196.223c-.057-.457-.22-.727-.62-.695-.092.01-.226.24-.24.38-.04.37.164.648.518.703.105.017.257-.284.342-.386z"></path><path id="path5253" d="M568.205 268.9c.088-.32.183-.597.225-.88.008-.057-.18-.14-.28-.214-.145.276-.297.552-.426.837-.003.01.227.12.48.257z"></path></g>
                </svg>
                <ReactTooltip border={true} html={true} data-multiline={true} />
                </div>
            </div>

            <div className={this.state.heat_click? "HeatMapClick" : "HeatMapButton"} onMouseEnter={this.mouseOverHover.bind(this)} onMouseLeave={this.mouseOutHover.bind(this)} onClick={this.mouseClickHeat.bind(this)}>
                {this.state.hover_heatmap? (
                    <div className="HeatMapButton2">
                      <b>HEATMAP OF CUSTOMER INTERACTION</b>
                    </div>
                    ):(
                    null
                    )
                };
                  <img className="heatMapIcon" src={heatmap_icon}/>
            </div>

      </div>}
    </div>;


    const peekabooFilter = <div className="layoutFilter">
      {this.state.isChoosingFilter ? (
              <div className="leftFilterHide" onClick={this.filterHide}>
                  <img className="filterIconClose" src={filter_icon_close} />
              </div>
              ) : (
              <div className="leftFilterShow" onClick={this.filterClick}>
                  <img className="filterIcon" src={filter_icon} />
              </div>
              )}
      {<div className={this.state.filter_class}>
              <div className="filterContainer">
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
                  {this.state.applyFilterAll? (
                    <div className="applyButton-clicked" onClick={this.mouseOverOff}>
                        Cancel Apply to All
                      </div>):
                    (<div className="applyButton" onClick={this.mouseOverAll}>
                        Apply to All
                      </div>)}
              </div>
      </div>}
    </div>;

    const peekabooStore = 
          <div className="layoutStore">
            {this.state.peekaboo ? (
              <div className="leftViewTabHide" onClick={this.peekHide}>
                  <img className="storeIconClose" src={store_icon_close} />
              </div>
              ) : (
              <div className="leftViewTabShow" onClick={this.peekClick}>
                  <img className="storeIcon" src={store_icon} />
              </div>
              )}
          <div className={this.state.peekaboo_class}>
            <div>
                <Link to={"/"}>
                  <b>SPRING NATURALS</b>
                </Link>
            </div>
            {productNode}
          </div>
         {/* </Link> */}
        </div>;

    const peekabooAll = <div className="ProductPage-Left">
      {peekabooStore}
      {peekabooFilter}
      {peekabooAnalytics}
      {peekabooHotspot}
      </div>;

    return (
      <div>
      <div style={{width: "100%"}} className="NewProductPage">
        {peekabooAll}
        <div className="NewProductPage-Mid">
          <div className="productNameRow">
            {productNameDiv}
            <div className="priceLabel">Price: </div>
            {priceDiv}
          </div>
          <div className="DropPicBox">
            {dropPicBoxChild}
            <div className="cubeDiv">
              <Cube sid={this.state.sid} img={this.state.img} lastsid={this.state.lastsid} filter={this.state.filter}/>
            </div>

            {
              !this.state.isAddingHotspot ?
                <div>
                  {next_sid[0] != null ? <div className="arrowLeft" onClick={this.arrowButton.bind(this, next_sid[0])}>{"\u25c0"}</div> : null}
                  {next_sid[1] != null ? <div className="arrowUp" onClick={this.arrowButton.bind(this, next_sid[1])}>{"\u25b2"}</div> : null}
                  {next_sid[2] != null ? <div className="arrowRight" onClick={this.arrowButton.bind(this, next_sid[2])}>{"\u25b6"}</div> : null}
                  {next_sid[3] != null ? <div className="arrowDown" onClick={this.arrowButton.bind(this, next_sid[3])}>{"\u25bc"}</div> : null}
                </div>
              : null
            }
          </div>
          
          {descriptionDiv}
          <div className="buttons">
            <div className="hotspotButtonDiv">
              <button type="button" className="btn btn-secondary hotspotBtn" onClick={() => this.handleClickHotspotBtn()} disabled={isHotspotButtonDisable}>
                {hotspotButtonLabel}
              </button>
              {hotspotHint}
            </div>
            {
              hasImgUploaded ?
              <div className="submitButtonDiv">
                <button type="button" className="btn btn-secondary submitBtn" onClick={() => this.handleClickOkBtn()}>
                  {submitButtonLabel}
                </button>
              </div>
              : null
            }
          </div>
          <br/><br/>
          <ReviewBlock reviewData={this.props.reviewData}/>
        </div>
        <div className="NewProductPage-Right">
          {
            (this.state.hoveredHotSpotImg == null)
            ?
            null
            :
            <div>
              <img className={"HotSpotImg "+picBoxClass+"SamePos"} src={this.state.hoveredHotSpotImg} />
            </div>
          }
        </div>
      </div>
      </div>
    );
  }
}

class ReviewButton extends Component {
  render() {
    const reviewBtnClassName = "btn btn-secondary reviewBtn " + (this.props.isClicked ? "reviewBtnClicked" : "");
    return (
      <div>
        <button type="button" className={reviewBtnClassName} onClick={() => this.props.onClick()}>
          {this.props.label}
        </button>
      </div>
    );
  }
}

class ReviewBlock extends Component {
  constructor() {
    super();
    this.state = {
      isShowing: 5,
    };
  }
  
  reviewClick(i) {
    this.setState({
      isShowing: i,
    });
  }
  
  renderReviewButton(i) {
    return (
      <ReviewButton
        label={Array(i+1).join("\u2605 ")}
        onClick={() => this.reviewClick(i)}
        isClicked={this.state.isShowing==i}
      />
    );
  }
  
  render() {
    const reviewTabs = [5,4,3,2,1].map((i) => {
      return(
        <div className="reviewTab">
          {this.renderReviewButton(i)}
        </div>
      ) 
    });
    
    const reviewData = this.props.reviewData;
    const matchedReviews = reviewData.filter((review) => {
        if(review.stars == this.state.isShowing) {
          return review;
        }
    });
    var reviewDivs = [];
    for (var i=0; i < matchedReviews.length; i++) {
      reviewDivs.push(
        <div className="reviewText">
          {matchedReviews[i].text}
        </div>
      );
    }
    
    
    return (
      <div className="reviews">
        Reviews
        <div className="reviewTabs">{reviewTabs}</div>
        {reviewDivs}
      </div>
    );
  }
}

class ProductPage extends Component {

  render() {

    return (
      <div className="ProductPage">
        <div className="ProductPage-Mid">
          <Router>
            <div style={{width: "100%"}}>
              <Route exact path="/newproduct" render={(props) => (<NewProductPage {...props} addNewData={this.props.addNewData} data={this.props.data} reviewData={this.props.reviewData}/>)}/>
              <Route path="/products/:uid" render={(props) => (<NewProductPage {...props} addNewData={this.props.addNewData} data={this.props.data} reviewData={this.props.reviewData}/>)}/>
            </div>
          </Router>
        </div>
      </div>
    );
  }
}



export default ProductPage;