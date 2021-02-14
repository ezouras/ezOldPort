//circle variables
const circlePlacementX=400;
const circlePlacementY=300;
let numberOfCircles=10;
let smallestRadius=40;
let separationBetween=30;
var radius;
var transformValue;
var circleFillInDelay=900;

//delay the initial color in
let isInitial=true;

//HTML elements
var title;
var portfolioMenuItem;
var portMenuItemParent;
var resumeMenuItem;
var resumeMenuItemParent;
let groupAndCircleElements=[];

let w = window;
let windowWidth;
let windowHeight;
let onMobile=false;
let orientationLandscape=false;

var themes={
                  portfolio:{titleColor:portfolioTitleColor,footerColor:portfolioFooterColor,backgroundMain:portfolioThemeFooterBGMainColor,backgroundAlt:portfolioThemeFooterBGAltColor,circleColors:reds,isColorReplaced:false},
                  resume:{titleColor:resumeTitleColor,footerColor:resumeFooterColor,backgroundMain:resumeThemeFooterBGMainColor,backgroundAlt:resumeThemeFooterBGAltColor,circleColors:purples,isColorReplaced:false}
            };



/***************  main code body ********************/

setDeviceSettings();
setCircleVariables();
createCircleHTMLElements();
setRestOfHTMLElements();
addHTMLCirclesToScreen();
addCircleFillColor(mainFillColors,circleFillInDelay);
if(!onMobile)
addHomePageEvents();


/*************  FUNCTIONS ****************/


/////////////*Set Device Settings *//////////

function setDeviceSettings(){
//on mobile?
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
       onMobile=true;
       w.addEventListener('orientationchange', reload);
       if(w.orientation==90 || w.orientation==-90) {
         orientationLandscape=true;
         smallestRadius=5;
    }
  }
  //set width and height of window:
  windowWidth=w.innerWidth;
  windowHeight=w.innerHeight;

}

//////////* set circle variables *////////////

function setCircleVariables() {
  setCircleTransformValue();
  setCircleSeparation();
  radius=getLargestRadius(smallestRadius,separationBetween,numberOfCircles);
  }


function setCircleTransformValue(){
    if(orientationLandscape){
      transformValue="translate(0,-40%)";
      if(windowHeight<500)
      transformValue="translate(0px, -55%)";
      if(windowWidth>1000)
      transformValue="translate(0px,0)";
    }
    else{
      //mobile in portrait mode
        if(windowHeight<675)
        transformValue="translate(0,-15%)";
        else if(windowHeight>900){
          transformValue="translate(0,3%)";
        }
        else{
          transformValue="translate(0,-10%)";
        }
    }
  }

function setCircleSeparation(){
    if(orientationLandscape) {
      separationBetween=15;

      //for iphonex and pixel 2xl
      if(windowHeight<500)
      separationBetween=10;

      //for ipad and ipad pro
      if(windowWidth>1000){
        separationBetween=25;

      }
    }else{
      //orientation portrait
      if(windowWidth<550 || windowHeight<550){
        separationBetween=15;
      }else if(windowHeight<900 || windowWidth<900){
        separationBetween=20;
      }
    }

  }

  function getLargestRadius(smallestRadius,separationBetween,numberOfCircles){
    return smallestRadius+(separationBetween * (numberOfCircles-1));

  }



////////////////* set non-circle html elements *////////////////////

function setRestOfHTMLElements(){
  title=document.getElementById("title");
  portfolioMenuItem=document.getElementById("portfolio");
  portMenuItemParent=portfolioMenuItem.parentElement;
  resumeMenuItem=document.getElementById("resume");
  resumeMenuItemParent=resumeMenuItem.parentElement;
  themes.portfolio["footerMenuElement"]=portfolioMenuItem;
  themes.resume["footerMenuElement"]=resumeMenuItem;
  themes.portfolio["footerMenuElementParent"]=portMenuItemParent;
  themes.resume["footerMenuElementParent"]=resumeMenuItemParent;

}


////////////////* create circle elements  *////////////////////


function createCircleHTMLElements(){
  let thisRadius=radius;
  let id=numberOfCircles;
  let group;
  let circle;
  let cId;
  let gId;

  for(x=numberOfCircles;x>0;x--)
  {
      cId="circle"+id;
      gId="group"+id;
      group = makeSVG("g",{id:gId});
      circle =makeSVG('circle', {id:cId, cx:circlePlacementX, cy:circlePlacementY, r:thisRadius});
      var object={id:x,circleElement:circle,groupElement:group};
      groupAndCircleElements.push(object);
      id--;
      thisRadius=thisRadius-separationBetween;
    }
  }




  /////**** draw circles to screen ******/

  function addHTMLCirclesToScreen(){
    let previousElement=document.getElementById('svg');
    groupAndCircleElements.forEach((element,index)=>{
      previousElement.appendChild(element.groupElement);
      element.groupElement.appendChild(element.circleElement);
      previousElement=element.groupElement;
    });
    //set transform value to the largest group.
    groupAndCircleElements[0].groupElement.style.transform=transformValue;
  }

  ///////////////*  add fill colors to circles */////////////////

  function addCircleFillColor(fillColors,circleDelay){
    let colorIndex=0;
    //start with smallest circle which is the last one.
    let circleIndex=groupAndCircleElements.length-1;
    for(i=circleIndex;i>=0;i--){
    setDelayOnFillMethod(groupAndCircleElements[i].circleElement,fillColors[colorIndex],circleDelay)
    colorIndex++;
    if(isInitial)
    circleDelay=circleDelay+100;
    else
    circleDelay=circleDelay+50;
     }
     isInitial=false;
    }

  function setDelayOnFillMethod(circle,fillColor,delay){
      setTimeout(()=>{
        setCircleColors(circle,fillColor);
      },delay);
    }

    function setCircleColors(circle,fillColor){
      return Morf.transition(circle,{"fill":fillColor},{duration:0});
    }


  ////////////////* add events  *////////////////////


function addHomePageEvents(){
  //add circle events
  addCircleEvents();
  //add footer menu items events
  setDelayOnEvents("mouseover",setThemeFromHover,themes.portfolio.footerMenuElementParent,2500);
  setDelayOnEvents("mouseover",setThemeFromHover,themes.resume.footerMenuElementParent,2500);
  //add window event
  window.addEventListener('orientationchange',reload);


}

        ////////circle events

function addCircleEvents(){
  groupAndCircleElements.forEach((htmlGroup,index)=>{
    //before you can mouse over, let intro end
    setDelayOnEvents("mouseover",setThemeFromHover,htmlGroup.circleElement,2500);
    htmlGroup.circleElement.addEventListener("click",loadPageFromCircleClick);
  });
}
function loadPageFromCircleClick(e){
    var res=e.target.id.split("circle")[1];
    if(res>6)//load Portfolio
    window.location.href="./portfolio/index.html";
    else
    window.location.href="./resume/index.html";
}
function setThemeFromHover(e){
  if(e.target.id.includes("circle")){
    let res=e.target.id.split("circle")[1];
    if(res>6)
      setTheme(themes.portfolio);
    else
      setTheme(themes.resume);
  }
  else if(e.target.className.includes("portfolio"))
  setTheme(themes.portfolio,true);
  else if(e.target.className.includes("resume"))
  setTheme(themes.resume,true);
  else{
    console.log("I don't know what I hover");
  }
}


function setTheme(theme,isFooter){
  //if already replaced don't do anything:
  if(!theme.isColorReplaced){
    //set circle colors
    addCircleFillColor(theme.circleColors,0);
    //set title color
    title.style.color=theme.titleColor;
    //set footer menuItem colors
    for(key in themes){
      if(themes[key]===theme){
          theme.isColorReplaced=true;
          theme.footerMenuElement.style.background=theme.backgroundMain;
          theme.footerMenuElement.style.color=theme.footerColor;
          theme.footerMenuElementParent.style.width="75%";

      }
      if(themes[key]!==theme){
        themes[key].isColorReplaced=false;
        themes[key].footerMenuElement.style.background=theme.backgroundAlt;
        themes[key].footerMenuElement.style.color=theme.footerColor;
        themes[key].footerMenuElementParent.style.width="25%"
      }
  }
}
}






/***** auxillary functions ********/

function reload(){
  window.location.reload();

}

function makeSVG(tag, attrs) {
  var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs)
    el.setAttribute(k, attrs[k]);//k is the key,  attrs[k] is the value
  return el;
}



  function setDelayOnEvents(event,methodToCall,circleHTMLElement,delay){
      setTimeout(()=>{
        circleHTMLElement.addEventListener(event,methodToCall);
      },delay)
  }
