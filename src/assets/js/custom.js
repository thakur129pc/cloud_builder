var properJsonObj = [];
var categoryJsonObj = [];
var categorymoneyJsonObj = [];
var categoryexpectcustJsonObj = [];
var categorylibcreditJsonObj = [];
var categorylibloanJsonObj = [];
var categoryincomeJsonObj = [];
var categorydiscountJsonObj = [];
var categoryoperatingJsonObj = [];
var categorycostexpJsonObj = [];
var categoryequitybusJsonObj = [];
var categoryequityretainJsonObj = [];
$(document).ready(function () {
  $.fn.extend({
    treed: function (o) {
      var openedClass = 'fa-minus';
      var closedClass = 'fa-plus';

      if (typeof o != 'undefined') {
        if (typeof o.openedClass != 'undefined') {
          openedClass = o.openedClass;
        }
        if (typeof o.closedClass != 'undefined') {
          closedClass = o.closedClass;
        }
      }

      //initialize each of the top levels
      var tree = $(this);
      tree.addClass('tree');
      tree
        .find('li')
        .has('ul')
        .each(function () {
          var branch = $(this); //li with children ul
          branch.prepend("<i class='indicator fa " + closedClass + "'></i>");
          branch.addClass('branch');
          branch.on('click', function (e) {
            if (this == e.target) {
              var icon = $(this).children('i:first');
              icon.toggleClass(openedClass + ' ' + closedClass);
              $(this).children().children().toggle();
            }
          });
          branch.children().children().toggle();
        });
      //fire event from the dynamically added icon
      tree.find('.branch .indicator').each(function () {
        $(this).on('click', function () {
          $(this).closest('li').click();
        });
      });
      //fire event to open branch if the li contains an anchor instead of text
      tree.find('.branch>a').each(function () {
        $(this).on('click', function (e) {
          $(this).closest('li').click();
          e.preventDefault();
        });
      });
      //fire event to open branch if the li contains a button instead of text
      tree.find('.branch>button').each(function () {
        $(this).on('click', function (e) {
          $(this).closest('li').click();
          e.preventDefault();
        });
      });
    },
  });

  //Initialization of treeviews
});
// JAVASCRIPT DOCUMENT
$(document).ready(function () {
  $('#tree1').treed();
  setTimeout(function () {
    $('#tree1').show();
  }, 500);

  var customers = [
    { CustomerId: 1, Name: 'John Hammond', Country: 'United States' },
    { CustomerId: 2, Name: 'Mudassar Khan', Country: 'India' },
    { CustomerId: 3, Name: 'Suzanne Mathews', Country: 'France' },
    { CustomerId: 4, Name: 'Robert Schidner', Country: 'Russia' },
  ];
  $('.bs-searchbox input').attr('placeholder', 'Search');
});

(function ($) {
  //TREE CLICK FUNCTION
  $('body').on('click', '.booktree', function () {
    var accordionid = $(this).attr('data-tree');
    var tabname = $(this).attr('data-tabname');
    //PARTICULAR ACCORDION COLLAPSE
    if ($('#' + accordionid).hasClass('in')) {
    } else {
      $('#' + accordionid)
        .prev('.panel-heading')
        .find('a')
        .trigger('click');
    }
    //PARTICULAR TAB ACTIVE
    $('#myTab a[href="#' + tabname + '"]').trigger('click');
    //$(window).scrollTop($("#"+accordionid).prev('.panel-heading').offset().top);
    $('html, body').animate(
      {
        scrollTop:
          $('#' + accordionid)
            .prev('.panel-heading')
            .offset().top - 45,
      },
      600
    );
  });

  $('body').on('click', '.booksubtree', function () {
    var accordionid = $(this)
      .parent()
      .parent()
      .parent('li')
      .find('a')
      .attr('data-tree');
    var tabname = $(this)
      .parent()
      .parent()
      .parent('li')
      .find('a')
      .attr('data-tabname');
    //PARTICULAR ACCORDION COLLAPSE
    if ($('#' + accordionid).hasClass('in')) {
    } else {
      $('#' + accordionid)
        .prev('.panel-heading')
        .find('a')
        .trigger('click');
    }
    //PARTICULAR TAB ACTIVE
    $('#myTab a[href="#' + tabname + '"]').trigger('click');

    $('html, body').animate(
      {
        scrollTop:
          $('#' + accordionid)
            .prev('.panel-heading')
            .offset().top - 45,
      },
      600
    );
  });
})(jQuery);
