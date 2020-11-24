const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
var x = document.getElementById("video");
const webcam = new Webcam(webcamElement, 'enviroment');
const canvas = document.getElementById('canvas_capture');
const context = canvas.getContext('2d');
let model = null;
let cameraFrame = null;
let handCount = 0;
let fireElements = [];
var count=0;
var sum=0;
var content = paramValue;
var yy = 81;

$('.md-modal').addClass('md-show');
webcam.start(false)
    .then(result =>{
        //startHandMagic();
    })
    .catch(err => {
        displayError();
});

console.log("edu.js")

x.onloadedmetadata = function() {
    console.log('metadata loaded!');
    console.log(this.duration);//this refers to myVideo
};

  
x.ontimeupdate = function () {myFunction ()};
var h_1 = document.querySelector('h1');
var process_bar = document.getElementById('bar');

function myFunction () {
  // Display id = "demo" of <p> elements in the video playback position
  console.log(x.currentTime)
  if(x.currentTime >81.31 && x.currentTime < 82 && yy ==81){
    eight(81,count,0);
    yy = 115;
  }else if(x.currentTime >115.7 && x.currentTime < 116 && yy == 115){
    eight(115,count,1);
    yy=0;
  }
    
}

function eight(time,value,ss){
    
    if(parseInt(x.currentTime) == time && value == ss){
        x.hidden=true;
        x.pause();
        count++;
        // startHandMagic();
        webcam.stream()
            .then(result => {
                cameraStarted();
                loadModel().then(res => {
                    // cameraFrame = startDetection();
                    // startHandMagic();
                    interval = setInterval(sendImage, 700);
                })
                .catch(err => {
                    displayError('Fail to load hand tracking model, please refresh the page to try again');
                });
            })
            .catch(err => {
                displayError();
            });


    
      }

}


$('#cameraFlip').click(function() {
    if(cameraFrame!= null){
        cancelAnimationFrame(cameraFrame);
    }
    webcam.flip();
    startHandMagic();
    
});


function ozit_interval_test(){
    console.log("??????????????????????????????????");
        
        x.hidden = false;
        x.play();
        stop();
        if(yy == 115){
            x.currentTime = 81.519934;
            console.log("currentTIme!!!!!!!!!", x.currentTime);
        }else{
            x.currentTime = 115.952325;
            console.log("*********************************");
        }
        stopCamera();
        h_1.innerHTML=""
        process_bar.width = 0
}

$('#closeError').click(function() {
    $("#webcam-switch").prop('checked', false).change();
});

function startHandMagic(){
    webcam.stream()
        .then(result => {
            cameraStarted();
            loadModel().then(res => {
                cameraFrame = startDetection();
            })
            .catch(err => {
                displayError('Fail to load hand tracking model, please refresh the page to try again');
            });
        })
        .catch(err => {
            displayError();
        });
}



function stopCamera(){
    cameraStopped();
    webcam.stop();
    if(cameraFrame!= null){
        cancelAnimationFrame(cameraFrame);
    }
}

function displayError(err = ''){
    if(err!=''){
        $("#errorMsg").html(err);
    }
    $("#errorMsg").removeClass("d-none");
}

async function loadModel() {
    // $(".loading").removeClass('d-none');
    var flipWebcam = (webcam.facingMode =='user') ? true: false
    return new Promise((resolve, reject) => {
        const modelParams = {
            flipHorizontal: flipWebcam,   // flip e.g for video  
            maxNumBoxes: 20,        // maximum number of boxes to detect
            iouThreshold: 0.5,      // ioU threshold for non-max suppression
            scoreThreshold: 0.8,    // confidence threshold for predictions.
        }

        handTrack.load(modelParams).then(mdl => { 
            model = mdl;
            // $(".loading").addClass('d-none');
            resolve();
        }).catch(err => {
            reject(error);
        });
    });
}

function startDetection() {
    model.detect(webcamElement).then(predictions => {
        //console.log("Predictions: ", predictions);
        showFire(predictions);
        cameraFrame = requestAnimFrame(startDetection);
    });
}

function showFire(predictions){
    if(handCount != predictions.length){
        $("#canvas").empty();
        fireElements = [];
        //dots = [];
    }   
    handCount = predictions.length;

    for (let i = 0; i < predictions.length; i++) {
        //bbox: [x, y, width, height]
        var hand_center_point = getHandCenterPoint(predictions[i].bbox);
        //if(dots.length > i){
            //dot = dots[i];
        //}
        //else{
            //dot = $("<div class='dot'></div>");
            //dots.push(dot);
            //dot.appendTo($("#canvas"));
        //}
        //dot.css({top:hand_center_point[0], left:hand_center_point[1], position:'absolute'});

        if (fireElements.length > i) { 
            fireElement = fireElements[i];
        }else{
            fireElement = $("<div class='fire_in_hand'></div>");
            fireElements.push(fireElement);
            fireElement.appendTo($("#canvas"));
        }
        var fireSizeWidth = fireElement.css("width").replace("px","");
        var fireSizeHeight = fireElement.css("height").replace("px","");
        var firePositionTop = hand_center_point[0]- fireSizeHeight;
        var firePositionLeft = hand_center_point[1] - fireSizeWidth/2;
        fireElement.css({top: firePositionTop, left: firePositionLeft, position:'absolute'});
        setTimeout("ozit_interval_test()", 50000);
        startTimer();
   
    }
}


function getHandCenterPoint(bbox){
    var ratio = canvasElement.clientHeight/webcamElement.height;
    if(webcam.webcamList.length ==1 || window.innerWidth/window.innerHeight >= webcamElement.width/webcamElement.height){
        var leftAdjustment = 0;
    }else{
        var leftAdjustment = ((webcamElement.width/webcamElement.height) * canvasElement.clientHeight - window.innerWidth)/2 
    }
    var x = bbox[0];
    var y = bbox[1];
    var w = bbox[2];
    var h = bbox[3];
    var hand_center_left = x*ratio + (w*ratio/2) - leftAdjustment;
    var hand_center_top = y*ratio + (h*ratio/2);
    return [hand_center_top, hand_center_left];
}

$(window).resize(function() {
    var ratioWebCamWidth = webcamElement.scrollHeight * (webcamElement.width/webcamElement.height);
    var canvasWidth = (ratioWebCamWidth < window.innerWidth) ? ratioWebCamWidth : window.innerWidth;
    $("#canvas").css({width: canvasWidth});
});

function cameraStarted(){
    $("#errorMsg").addClass("d-none");
    $("#webcam-caption").html("on");
    $("#webcam-control").removeClass("webcam-off");
    $("#webcam-control").addClass("webcam-on");
    $(".webcam-container").removeClass("d-none");
    var ratioWebCamWidth = webcamElement.scrollHeight * (webcamElement.width/webcamElement.height);
    var webCamFullWidth = webcamElement.scrollWidth;
    $("#canvas").css({width: ((ratioWebCamWidth < webCamFullWidth) ? ratioWebCamWidth : webCamFullWidth)});
    if( webcam.webcamList.length > 1){
        $("#cameraFlip").removeClass('d-none');
    }
    if(webcam.facingMode == 'user'){
        $("#webcam").addClass("webcam-mirror");
    }
    else{
        $("#webcam").removeClass("webcam-mirror");
    }
    $("#wpfront-scroll-top-container").addClass("d-none");
    window.scrollTo(0, 0); 
    $('body').css('overflow-y','hidden');
}

function cameraStopped(){
    $("#wpfront-scroll-top-container").removeClass("d-none");
    // $("#webcam-control").removeClass("webcam-on");
    // $("#webcam-control").addClass("webcam-off");
    $("#cameraFlip").addClass('d-none');
    $(".webcam-container").addClass("d-none");
    // $("#webcam-caption").html("Click to Start Camera");
    $('body').css('overflow-y','scroll');
    // $([document.documentElement, document.body]).animate({
    //     scrollTop: ($("#hand-app").offset().top - 80)
    // }, 1000);
    // $('.md-modal').removeClass('md-show');
}


window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelAnimationFrame = (function(){
    return  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
})();



function sendAjax(imageData){
    //"http://localhost:8000/ajax"
    // var url =null; 
    // if(content == 1){
    //     url = "http://localhost:8000/mask"
    // }else{
    //     url = "http://localhost:8000/ajax"
    // }
    $.ajax({
        url: "http://ec2-13-125-208-57.ap-northeast-2.compute.amazonaws.com:8000/ajax", // 클라이언트가 요청을 보낼 서버의 URL 주소
        type: "POST",
        data:{
            imageBase64: imageData
        }
    })
    // HTTP 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨.
    .done(function(json) {
        console.log(json["label"]);
        h_1.innerHTML = json["label"];
        // if(json["label"] == "활쏘기"){
            // if (yy == 78){
                if(yy== 115){
                    if(h_1.innerHTML == "노젓기"){
                        if (process_bar.width <= 520){
                            process_bar.width += 50;
                        }else if(process_bar.width > 520){
                            h_1.innerHTML ="잠시후 화면이 넘어갑니다."
                            setTimeout("ozit_interval_test()", 1000);
                        }
                    }

                }else if(yy==0){
                    if(h_1.innerHTML == "활쏘기"){
                        if (process_bar.width <= 520){
                            process_bar.width += 50;
                        }else if(process_bar.width > 520){
                            h_1.innerHTML ="잠시후 화면이 넘어갑니다."
                            setTimeout("ozit_interval_test()", 1000);
                        }
                    }
                }


                // if(json.label == '활쏘기'){
                //     if (process_bar.width <= 520){
                //         process_bar.width += 50;
                //     }else if(process_bar.width > 520){
                //         h_1.innerHTML ="잠시후 화면이 넘어갑니다."
                //         setTimeout("ozit_interval_test()", 1000);
                //     }

                // }
                
                // console.log("ya!!!!!!!!!!!!!")
        // }
        // if(json == "No Mask"){
        //     setTimeout("ozit_interval_test()", 6000);
        // }else{

        // }
        // $("<h1>").text(json.title).appendTo("body");
        // $("<div class=\"content\">").html(json.html).appendTo("body");
    })
    // HTTP 요청이 실패하면 오류와 상태에 관한 정보가 fail() 메소드로 전달됨.
    .fail(function(xhr, status, errorThrown) {
        console.log("error");
    })
}

const minPartConfidence = 0.7;
const minPoseConfidence = 0.4;
var label = document.querySelector("#label");
var interval;

async function sendImage() {
    var image, data, i, r, g, b, brightness;

    // var imgData = context.getImageData(0, 0, video.width, video.height);
    context.drawImage(webcamElement, 0, 0, webcamElement.width, webcamElement.height);
    var dataURL = canvas.toDataURL();
    // console.log(dataURL)
    // var imageData = context.getImageData(0, 0, parseInt(webcam.width), parseInt(webcam.height));
    await sendAjax(dataURL);
    console.log("찰칵");
    // setTimeout( draw, 10, video, context, width, height );
}

function stop(){
    clearInterval(interval);
}

