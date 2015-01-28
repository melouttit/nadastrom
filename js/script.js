/*
SITE: nadastrom.com
AUTHOR: meghan louttit
VER: 2
*/

$(document).ready(function(){

  var yetiapp = {

    init:function(){

      console.log("YETI READY");
      var yeti = this;

      //dom elements
      $container = $('.container');
      $bgimgcont = $container.find('#bg-image');
      $bgimg = $bgimgcont.find('img');
      $bannerimg = $('#banner img');

      var socialul = $('#social ul');
      var socialimg = $('#social ul li img');

      var bgimgwidth = yeti.chooseImageSize();
      yeti.sizeBackgroundImage(bgimgwidth);
      yeti.centerBlock($bannerimg);
      $(window).resize(function(){
        var bgimgwidth = yeti.chooseImageSize();
        yeti.sizeBackgroundImage(bgimgwidth);
      });

    },
    chooseImageSize:function(){

      var imgwidths = $bgimg.data().widths;
      var ww = $(window).width();
      var closestwidth = null;

      //loop through available sizes
      //calculate differece with window size
      //and choose closest size that is bigger
      //than the window width
      $.each(imgwidths,function(index,width){

        var difference = Math.abs(width - ww);
        var target = Math.abs(closestwidth - ww);

        if(width > ww && difference < target){
          closestwidth = width;
        } 

      });

      return closestwidth;

    },
    sizeBackgroundImage:function(size){

      var imgpath = $bgimg.data().path;
      var imgratio = $bgimg.data().ratio;

      //replace image src for right sized image
      if(size !== null){
        $bgimg.attr('src',imgpath+size+'.jpg');
      } else {
        $bgimg.attr('src',imgpath+'300.jpg');
      }
      
      //window vars
      var ww = $(window).width();
      var wh = $(window).height();

      //portrait
      var ih = wh;
      var iw = Math.round(ih / (imgratio * 1));

      //landscape
      if(iw < ww){
        iw = ww;
        ih = Math.round(iw * (imgratio * 1));
      }

      //calculate new margins
      var extrawidth = iw - ww;
      var ml = extrawidth / 2;

      var extraheight = ih - wh;
      var mt = extraheight / 2;

      $bgimg.css({
        width:iw+'px',
        height:ih+'px',
        marginLeft:'-'+ml+'px',
        marginTop:'-'+mt+'px'
      });

    },
    centerBlock:function(img){

      var ww = $(window).width();
      var iw = $(img).width();

      var extra = ww - iw;
      var marginLeft = extra / 2;

      $(img).css({
        marginLeft:marginLeft+'px'
      });

    }

  }

  yetiapp.init();

});