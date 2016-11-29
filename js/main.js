// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


jQuery(document).ready(function($) {

    $('.offerSlider').slick({
        fade: true,
        dots: false,
        arrows: false
    });

    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.menu-button'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.on('ready scroll', function(event) {
            event.preventDefault();
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });
      

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.menu-button').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('active');
        $(this).siblings('header').toggleClass('active');
        if ($('header').hasClass('active')) {
                $('body').css('overflow', 'hidden');
                $('section').css('filter', 'blur(2px)');
            } else {
                $('body').css('overflow', 'auto');
                $('section').css('filter', 'none');
            }
    });


    /*---------------------------
                                  Scroll down
    ---------------------------*/
    $('.mainNav a, .offer__slide__list a').on('click', function(event) {
        event.preventDefault();
        var target = $('' + $(this).attr('href') + '');
        $('.mainNav a').removeClass('active');
        $(this).addClass('active');
        $('html, body').animate( { scrollTop: target.offset().top }, 800 );

        if( $(window).width() < 1000 ) {
            $('header, .menu-button').removeClass('active');
            $('body').css('overflow', 'auto');
            $('section').css('filter', 'none');
        }
    });

    var $sections = $('section');
    $(window).scroll(function(){
        var currentScroll = $(this).scrollTop();
        var $currentSection;
        var windowHalf = $(window).height() / 2;
        
        $sections.each(function(){
          var divPosition = $(this).offset().top - windowHalf;
          
          if( divPosition - 1 < currentScroll ){
            $currentSection = $(this);
          }
        var id = $currentSection.attr('id');
          $('a').removeClass('active');
          $("[href=#"+id+"]").addClass('active');
        })
    });

    $('.scroll-down').on('click', function(event) {
        event.preventDefault();
        var target = $(this).parent().next();

        $('html, body').animate( { scrollTop: target.offset().top }, 600 );
    });


    /*---------------------------
                                  Sliders
    ---------------------------*/
    $('.charther-slider').slick({
        dots: false,
        arrows: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 630,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 430,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    })


    /*---------------------------
                                  Magnific popup
    ---------------------------*/
    $('.magnific').magnificPopup({
        type: 'inline',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'auto',
        modal: false,

        closeBtnInside: true,
        preloader: false,
        
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom'
    });


    /*---------------------------
                                  Magnific gallery
    ---------------------------*/
    $('.charther-slider').magnificPopup({
        delegate: '.slide',
        type: 'image',
        closeOnContentClick: false,
        closeBtnInside: false,
        fixedContentPos: false,
        fixedBgPos: true,
        overflowY: 'auto',
        mainClass: 'mfp-with-zoom mfp-img-mobile',
        image: {
            verticalFit: true,
        },
        gallery: {
            enabled: true
        },
        zoom: {
            enabled: true,
            duration: 300, // don't foget to change the duration also in CSS
            opener: function(element) {
                return element.find('img');
            }
        }
        
    });



    /*----------------------------
                              SEND FORM
    -------------------------*/
    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.magnificPopup.open({
            items: {
              src: popup
            },
            type: 'inline',
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            modal: false,
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 300,
            mainClass: 'my-mfp-slide-bottom'
        }, 0);
    }

    $('form').on('submit', function(event) {
        event.preventDefault();
        /* Act on the event */
        var data = $(this).serialize();
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            success: function(result){
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        })
        .always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
            });
        });
        
    });




    /*----------------------------
                              Google map
    -------------------------*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);


        var mapOptions = {
            center: mapCenterCoord,
            zoom: 14,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map_styles = [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}]

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"Регистратор №1"
        });

        var styledMapType = new google.maps.StyledMapType(map_styles, {name: 'Styled'});
        map.mapTypes.set('Styled', styledMapType);
        map.setMapTypeId('Styled');
      
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( $('#map_canvas').length > 0) {
        googleMap_initialize();   
    }

}); // end file