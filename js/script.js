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

      var bgimgwidth = yeti.chooseImageSize();
      yeti.sizeBackgroundImage(bgimgwidth);
      $(window).resize(function(){
        console.log("RESIZE");
        var bgimgwidth = yeti.chooseImageSize();
        yeti.sizeBackgroundImage(bgimgwidth);
      });

    },
    chooseImageSize:function(){

      console.log("CHOOSE IMAGE SIZE");
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

      console.log("SIZE BACKGROUND IMAGE");
      var imgpath = $bgimg.data().path;
      var imgratio = $bgimg.data().ratio;

      //replace image src for right sized image
      $bgimg.attr('src',imgpath+size+'.jpg');

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

    }

  }

  yetiapp.init();

});