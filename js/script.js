/*
SITE: nadastrom.com
AUTHOR: meghan louttit
VER: 2
*/

$(document).ready(function(){

  var yetiapp = {

    init:function(){

      var yeti = this;

      //dom elements
      $container = $('.container');
      $bgimgcont = $container.find('#bg-image');
      $bgimg = $bgimgcont.find('img');
      $bannerimg = $('#banner img');
      $insideTop = $('nav#inside-top');
      $headerHome = $('header#header-home');

      var socialul = $('#social ul');
      var socialimg = $('#social ul li img');

      //check for mobile
      $isMobile = yeti.checkForMobile();

      var bgimgwidth = yeti.chooseImageSize();
      yeti.sizeBackgroundImage(bgimgwidth);
      $(window).resize(function(){
        yeti.resizeEvents();
      });

      yeti.pageManager();

    },
    resizeEvents:function(){
      var yeti = this;
      var bgimgwidth = yeti.chooseImageSize();
      yeti.sizeBackgroundImage(bgimgwidth);
      $isMobile = yeti.checkForMobile();
    },
    pageManager:function(){

      var yeti = this;

      var cache = {
        '':$('.bbq-default')
      }

      $(window).bind('hashchange',function(e){

        var url = $.param.fragment();

        $('a.bbq-current').removeClass('bbq-current');
        $('.bbq-content').children(':visible').hide();
        url && $('a[href="#'+url+'"]').addClass('bbq-current');

        if(cache[url]){
          cache[url].show();
        } else {
          $('.bbq-loading').show();
          cache[url] = $('<section id="page-'+url+'" class="bbq-item"/>')
            .appendTo('.bbq-content')
            .load(url,function(){
              $('.bbq-loading').hide();
            });
        }

        if(url === ''){
          $insideTop.hide();
          $('html,body').addClass('home');
          $('html,body').removeClass('inside');
        }else{
          $insideTop.show();
          $('html,body').removeClass('home');
          $('html,body').addClass('inside');
        }

        setTimeout(function(){
          if(url === 'news'){
            $('#featured-news-move').appendTo('#featured-news-container');
            $('#featured-news').removeClass('hidden');
          } else {
            $('#featured-news-move').appendTo('#featured-news');
            $('#featured-news').addClass('hidden');
          }
        },500);

        yeti.resizeEvents();

        //scroll to top
        $('html,body').scrollTop(0);

        yeti.updateNav(url);

      });

      $(window).trigger('hashchange');

    },
    checkForMobile:function(){

      if(Modernizr.touch && Modernizr.mq('only all and (max-width: 760px)')){
        $('html').addClass('mobile');
        var isMobile = true;
      } else {
        $('html').removeClass('mobile');
        var isMobile = false;
      }

      return isMobile;

    },
    updateNav:function(page){

      var insideNavLinks = $('#inside-top ul.nav-list li');

      $.each(insideNavLinks,function(index,navitem){
        var navid = $(navitem).attr('id');
        if(navid === page){
          $(navitem).addClass('active');
        } else {
          $(navitem).removeClass('active');
        }
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
      var ml = (!$isMobile) ? extrawidth / 2 : extrawidth / 1.3 ;

      var extraheight = ih - wh;
      var mt = extraheight / 2;

      $bgimg.css({
        width:iw+'px',
        height:ih+'px',
        marginLeft:'-'+ml+'px',
        marginTop:'-'+mt+'px'
      });

    },
    newsCarousel:function(){

      $newsFeed = $('#nadastromNewsFeed');
      $newsItems = $('#nadastromNewsFeed div');
      $activeItem = 0;
      $newsLength = $newsItems.length;
      var leftArrow = $('span.arrow.prev');
      var rightArrow = $('span.arrow.next');
      switchNewsItem();

      $('span.arrow').on('click',function(){
        $activeItem = ($(this).hasClass('next')) ? $activeItem + 1 : $activeItem - 1;

        if($activeItem < 0){
          $activeItem = 0;
          $
        } else if($activeItem > $newsLength){
          $activeItem = $newsLength ;
        }

        switchNewsItem();
      });

      function switchNewsItem(){
        _.each($newsItems,function(item,index){
          if(index == $activeItem){
            $(item).addClass('active-item');
          } else if($activeItem >= 0 && $activeItem < $newsLength) {
            $(item).removeClass('active-item');
          }
        });
      }

    }

  }

  yetiapp.init();

});