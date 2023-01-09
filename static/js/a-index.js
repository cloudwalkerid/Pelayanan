
(function ($) {
    // USE STRICT
    "use strict";
  
    try {
      //WidgetChart 1
      var ctx = document.getElementById("widgetChart1");
      if (ctx) {
        ctx.height = 130;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            type: 'line',
            datasets: [{
              data: [78, 81, 80, 45, 34, 12, 40],
              label: 'Banyak',
              backgroundColor: 'rgba(255,255,255,.1)',
              borderColor: 'rgba(255,255,255,.55)',
            },]
          },
          options: {
            maintainAspectRatio: true,
            legend: {
              display: false
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            },
            responsive: true,
            scales: {
              xAxes: [{
                gridLines: {
                  color: 'transparent',
                  zeroLineColor: 'transparent'
                },
                ticks: {
                  fontSize: 2,
                  fontColor: 'transparent'
                }
              }],
              yAxes: [{
                display: false,
                ticks: {
                  display: false,
                }
              }]
            },
            title: {
              display: false,
            },
            elements: {
              line: {
                borderWidth: 0
              },
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4
              }
            }
          }
        });
      }
  
  
      //WidgetChart 2
      var ctx = document.getElementById("widgetChart2");
      if (ctx) {
        ctx.height = 130;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            type: 'line',
            datasets: [{
              data: [1, 18, 9, 17, 34, 22],
              label: 'Banyak',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)',
            },]
          },
          options: {
  
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            responsive: true,
            tooltips: {
              mode: 'index',
              titleFontSize: 12,
              titleFontColor: '#000',
              bodyFontColor: '#000',
              backgroundColor: '#fff',
              titleFontFamily: 'Montserrat',
              bodyFontFamily: 'Montserrat',
              cornerRadius: 3,
              intersect: false,
            },
            scales: {
              xAxes: [{
                gridLines: {
                  color: 'transparent',
                  zeroLineColor: 'transparent'
                },
                ticks: {
                  fontSize: 2,
                  fontColor: 'transparent'
                }
              }],
              yAxes: [{
                display: false,
                ticks: {
                  display: false,
                }
              }]
            },
            title: {
              display: false,
            },
            elements: {
              line: {
                tension: 0.00001,
                borderWidth: 1
              },
              point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4
              }
            }
          }
        });
      }
  
  
      //WidgetChart 3
      var ctx = document.getElementById("widgetChart3");
      if (ctx) {
        ctx.height = 130;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            type: 'line',
            datasets: [{
              data: [65, 59, 84, 84, 51, 55],
              label: 'Banyak',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)',
            },]
          },
          options: {
  
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            responsive: true,
            tooltips: {
              mode: 'index',
              titleFontSize: 12,
              titleFontColor: '#000',
              bodyFontColor: '#000',
              backgroundColor: '#fff',
              titleFontFamily: 'Montserrat',
              bodyFontFamily: 'Montserrat',
              cornerRadius: 3,
              intersect: false,
            },
            scales: {
              xAxes: [{
                gridLines: {
                  color: 'transparent',
                  zeroLineColor: 'transparent'
                },
                ticks: {
                  fontSize: 2,
                  fontColor: 'transparent'
                }
              }],
              yAxes: [{
                display: false,
                ticks: {
                  display: false,
                }
              }]
            },
            title: {
              display: false,
            },
            elements: {
              line: {
                borderWidth: 1
              },
              point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4
              }
            }
          }
        });
      }
  
  
      //WidgetChart 4
      var ctx = document.getElementById("widgetChart4");
      if (ctx) {
        ctx.height = 115;
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
              {
                label: "My First dataset",
                data: [78, 81, 80, 65, 58, 75, 60, 75, 65, 60, 60, 75],
                borderColor: "transparent",
                borderWidth: "0",
                backgroundColor: "rgba(255,255,255,.3)"
              }
            ]
          },
          options: {
            maintainAspectRatio: true,
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: false,
                categoryPercentage: 1,
                barPercentage: 0.65
              }],
              yAxes: [{
                display: false
              }]
            }
          }
        });
      }
  
      // Recent Report
      const brandProduct = 'rgba(0,181,233,0.8)'
      const brandService = 'rgba(0,173,95,0.8)'
  
      var elements = 10
      var data1 = [52, 60, 55, 50, 65, 80, 57, 70, 105, 115]
      var data2 = [102, 70, 80, 100, 56, 53, 80, 75, 65, 90]
  
      var ctx = document.getElementById("recent-rep-chart");
      if (ctx) {
        ctx.height = 250;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', ''],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: brandService,
                borderColor: 'transparent',
                pointHoverBackgroundColor: '#fff',
                borderWidth: 0,
                data: data1
  
              },
              {
                label: 'My Second dataset',
                backgroundColor: brandProduct,
                borderColor: 'transparent',
                pointHoverBackgroundColor: '#fff',
                borderWidth: 0,
                data: data2
  
              }
            ]
          },
          options: {
            maintainAspectRatio: true,
            legend: {
              display: false
            },
            responsive: true,
            scales: {
              xAxes: [{
                gridLines: {
                  drawOnChartArea: true,
                  color: '#f2f2f2'
                },
                ticks: {
                  fontFamily: "Poppins",
                  fontSize: 12
                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 5,
                  stepSize: 50,
                  max: 150,
                  fontFamily: "Poppins",
                  fontSize: 12
                },
                gridLines: {
                  display: true,
                  color: '#f2f2f2'
  
                }
              }]
            },
            elements: {
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3
              }
            }
  
  
          }
        });
      }
  
      // Percent Chart
      var ctx = document.getElementById("percent-chart");
      if (ctx) {
        ctx.height = 280;
        var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                label: "My First dataset",
                data: [60, 40],
                backgroundColor: [
                  '#00b5e9',
                  '#fa4251'
                ],
                hoverBackgroundColor: [
                  '#00b5e9',
                  '#fa4251'
                ],
                borderWidth: [
                  0, 0
                ],
                hoverBorderColor: [
                  'transparent',
                  'transparent'
                ]
              }
            ],
            labels: [
              'Products',
              'Services'
            ]
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            cutoutPercentage: 55,
            animation: {
              animateScale: true,
              animateRotate: true
            },
            legend: {
              display: false
            },
            tooltips: {
              titleFontFamily: "Poppins",
              xPadding: 15,
              yPadding: 10,
              caretPadding: 0,
              bodyFontSize: 16
            }
          }
        });
      }
  
    } catch (error) {
      console.log(error);
    }
  
  
  
    try {
  
      // Recent Report 2
      const bd_brandProduct2 = 'rgba(0,181,233,0.9)'
      const bd_brandService2 = 'rgba(0,173,95,0.9)'
      const brandProduct2 = 'rgba(0,181,233,0.2)'
      const brandService2 = 'rgba(0,173,95,0.2)'
  
      var data3 = [52, 60, 55, 50, 65, 80, 57, 70, 105, 115]
      var data4 = [102, 70, 80, 100, 56, 53, 80, 75, 65, 90]
  
      var ctx = document.getElementById("recent-rep2-chart");
      if (ctx) {
        ctx.height = 230;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', ''],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: brandService2,
                borderColor: bd_brandService2,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 0,
                data: data3
  
              },
              {
                label: 'My Second dataset',
                backgroundColor: brandProduct2,
                borderColor: bd_brandProduct2,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 0,
                data: data4
  
              }
            ]
          },
          options: {
            maintainAspectRatio: true,
            legend: {
              display: false
            },
            responsive: true,
            scales: {
              xAxes: [{
                gridLines: {
                  drawOnChartArea: true,
                  color: '#f2f2f2'
                },
                ticks: {
                  fontFamily: "Poppins",
                  fontSize: 12
                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 5,
                  stepSize: 50,
                  max: 150,
                  fontFamily: "Poppins",
                  fontSize: 12
                },
                gridLines: {
                  display: true,
                  color: '#f2f2f2'
  
                }
              }]
            },
            elements: {
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3
              },
              line: {
                tension: 0
              }
            }
  
  
          }
        });
      }
  
    } catch (error) {
      console.log(error);
    }
  
  
    try {
  
      // Recent Report 3
      const bd_brandProduct3 = 'rgba(0,181,233,0.9)';
      const bd_brandService3 = 'rgba(0,173,95,0.9)';
      const brandProduct3 = 'transparent';
      const brandService3 = 'transparent';
  
      var data5 = [52, 60, 55, 50, 65, 80, 57, 115];
      var data6 = [102, 70, 80, 100, 56, 53, 80, 90];
  
      var ctx = document.getElementById("recent-rep3-chart");
      if (ctx) {
        ctx.height = 230;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', ''],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: brandService3,
                borderColor: bd_brandService3,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 0,
                data: data5,
                pointBackgroundColor: bd_brandService3
              },
              {
                label: 'My Second dataset',
                backgroundColor: brandProduct3,
                borderColor: bd_brandProduct3,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 0,
                data: data6,
                pointBackgroundColor: bd_brandProduct3
  
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            responsive: true,
            scales: {
              xAxes: [{
                gridLines: {
                  drawOnChartArea: true,
                  color: '#f2f2f2'
                },
                ticks: {
                  fontFamily: "Poppins",
                  fontSize: 12
                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 5,
                  stepSize: 50,
                  max: 150,
                  fontFamily: "Poppins",
                  fontSize: 12
                },
                gridLines: {
                  display: false,
                  color: '#f2f2f2'
                }
              }]
            },
            elements: {
              point: {
                radius: 3,
                hoverRadius: 4,
                hoverBorderWidth: 3,
                backgroundColor: '#333'
              }
            }
  
  
          }
        });
      }
  
    } catch (error) {
      console.log(error);
    }
  
    try {
      //WidgetChart 5
      var ctx = document.getElementById("widgetChart5");
      if (ctx) {
        ctx.height = 220;
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
              {
                label: "My First dataset",
                data: [78, 81, 80, 64, 65, 80, 70, 75, 67, 85, 66, 68],
                borderColor: "transparent",
                borderWidth: "0",
                backgroundColor: "#ccc",
              }
            ]
          },
          options: {
            maintainAspectRatio: true,
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: false,
                categoryPercentage: 1,
                barPercentage: 0.65
              }],
              yAxes: [{
                display: false
              }]
            }
          }
        });
      }
  
    } catch (error) {
      console.log(error);
    }
  
  })(jQuery);
  
  
  
  (function ($) {
      // USE STRICT
      "use strict";
      $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 900,
        outDuration: 900,
        linkElement: 'a:not([target="_blank"]):not([href^="#"]):not([class^="chosen-single"])',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'page-loader',
        loadingInner: '<div class="page-loader__spin"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: ['animation-duration', '-webkit-animation-duration'],
        overlay: false,
        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'html',
        transition: function (url) {
          window.location.href = url;
        }
      });
    
    
    })(jQuery);

  (function ($) {
    // Use Strict
    "use strict";
    try {
      var progressbarSimple = $('.js-progressbar-simple');
      progressbarSimple.each(function () {
        var that = $(this);
        var executed = false;
        $(window).on('load', function () {
  
          that.waypoint(function () {
            if (!executed) {
              executed = true;
              /*progress bar*/
              that.progressbar({
                update: function (current_percentage, $this) {
                  $this.find('.js-value').html(current_percentage + '%');
                }
              });
            }
          }, {
              offset: 'bottom-in-view'
            });
  
        });
      });
    } catch (err) {
      console.log(err);
    }
  })(jQuery);
  (function ($) {
    // USE STRICT
    "use strict";
  
    // Scroll Bar
    try {
      var jscr1 = $('.js-scrollbar1');
      if(jscr1[0]) {
        const ps1 = new PerfectScrollbar('.js-scrollbar1');      
      }
  
      var jscr2 = $('.js-scrollbar2');
      if (jscr2[0]) {
        const ps2 = new PerfectScrollbar('.js-scrollbar2');
  
      }
  
    } catch (error) {
      console.log(error);
    }
  
  })(jQuery);
  (function ($) {
    // USE STRICT
    "use strict";
  
    // Select 2
    try {
  
      $(".js-select2").each(function () {
        $(this).select2({
          minimumResultsForSearch: 20,
          dropdownParent: $(this).next('.dropDownSelect2')
        });
      });
  
    } catch (error) {
      console.log(error);
    }
  
  
  })(jQuery);
  (function ($) {
    // USE STRICT
    "use strict";
  
    // Dropdown 
    try {
      var menu = $('.js-item-menu');
      var sub_menu_is_showed = -1;
  
      for (var i = 0; i < menu.length; i++) {
        $(menu[i]).on('click', function (e) {
          e.preventDefault();
          $('.js-right-sidebar').removeClass("show-sidebar");        
          if (jQuery.inArray(this, menu) == sub_menu_is_showed) {
            $(this).toggleClass('show-dropdown');
            sub_menu_is_showed = -1;
          }
          else {
            for (var i = 0; i < menu.length; i++) {
              $(menu[i]).removeClass("show-dropdown");
            }
            $(this).toggleClass('show-dropdown');
            sub_menu_is_showed = jQuery.inArray(this, menu);
          }
        });
      }
      $(".js-item-menu, .js-dropdown").click(function (event) {
        event.stopPropagation();
      });
  
      $("body,html").on("click", function () {
        for (var i = 0; i < menu.length; i++) {
          menu[i].classList.remove("show-dropdown");
        }
        sub_menu_is_showed = -1;
      });
  
    } catch (error) {
      console.log(error);
    }
  
    var wW = $(window).width();
      // Right Sidebar
      var right_sidebar = $('.js-right-sidebar');
      var sidebar_btn = $('.js-sidebar-btn');
  
      sidebar_btn.on('click', function (e) {
        e.preventDefault();
        for (var i = 0; i < menu.length; i++) {
          menu[i].classList.remove("show-dropdown");
        }
        sub_menu_is_showed = -1;
        right_sidebar.toggleClass("show-sidebar");
      });
  
      $(".js-right-sidebar, .js-sidebar-btn").click(function (event) {
        event.stopPropagation();
      });
  
      $("body,html").on("click", function () {
        right_sidebar.removeClass("show-sidebar");
  
      });
   
  
    // Sublist Sidebar
    try {
      var arrow = $('.js-arrow');
      arrow.each(function () {
        var that = $(this);
        that.on('click', function (e) {
          e.preventDefault();
          that.find(".arrow").toggleClass("up");
          that.toggleClass("open");
          that.parent().find('.js-sub-list').slideToggle("250");
        });
      });
  
    } catch (error) {
      console.log(error);
    }
  
  
    try {
      // Hamburger Menu
      $('.hamburger').on('click', function () {
        $(this).toggleClass('is-active');
        $('.navbar-mobile').slideToggle('500');
      });
      $('.navbar-mobile__list li.has-dropdown > a').on('click', function () {
        var dropdown = $(this).siblings('ul.navbar-mobile__dropdown');
        $(this).toggleClass('active');
        $(dropdown).slideToggle('500');
        return false;
      });
    } catch (error) {
      console.log(error);
    }
  })(jQuery);

