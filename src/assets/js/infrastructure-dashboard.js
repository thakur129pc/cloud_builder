// check chat_version in local storage
var currentVersion = '1.5.8';
if (localStorage.getItem('chat_version') === null) {
  localStorage.clear();
  localStorage.setItem('chat_version', currentVersion);
} else {
  let chat_version = localStorage.getItem('chat_version');
  if (chat_version.localeCompare(currentVersion) != 0) {
    localStorage.clear();
    localStorage.setItem('chat_version', currentVersion);
    console.log('chat_version', currentVersion);
  } else {
    console.log('chat_version', currentVersion);
  }
}

//JS DOCUMENT
$(document).ready(function () {
  $('#Best-selling').DataTable({
    paging: false, // Table pagination
    info: false, // Bottom left status text
  });

  $('#campaigncheckboxsect').hide();
  $('#campaigndashboard').click(function () {
    if ($(this).val() == 'Campaigns') {
      $('#pagehead_sect').html('SmartAds');
      $('#campaignsect,#campaigncheckboxsect').show();
      $('#storesect,#storecheckboxsect').hide();
    }
  });
  $('#storedashboard').click(function () {
    if ($(this).val() == 'Store') {
      $('#pagehead_sect').html('Ecommerce');
      $('#storesect,#storecheckboxsect').show();
      $('#campaignsect,#campaigncheckboxsect').hide();
    }
  });
  $('#refreshbtn').click(function () {
    var start = moment().subtract(6, 'days');
    var end = moment();
    localStorage.setItem('start', start);
    localStorage.setItem('end', end);
    localStorage.setItem('rangeslabel', null);
  });
});

// CHART SPLINE
// -----------------------------------
(function (window, document, $, undefined) {
  $(function () {
    var labelsTotalSalesArray = [];
    var labelsOrdersArray = [];
    var labelsCustomersArray = [];

    if (
      localStorage.getItem('rangeslabel') == 'Today' ||
      localStorage.getItem('rangeslabel') == 'Yesterday'
    ) {
      if (
        localStorage.getItem('start') === null &&
        localStorage.getItem('end') === null
      ) {
        for ($k = 0; $k <= 24; $k++) {
          var randomnumber = Math.floor(Math.random() * 150);
          var randomnumber_order = Math.floor(Math.random() * 150);
          var randomnumber_cust = Math.floor(Math.random() * 150);
          labelsTotalSalesArray.push([$k, randomnumber]);
          labelsOrdersArray.push([$k, randomnumber_order]);
          labelsCustomersArray.push([$k, randomnumber_cust]);
        }
      } else {
        for ($k = 0; $k <= 24; $k++) {
          var randomnumber = Math.floor(Math.random() * 150);
          var randomnumber_order = Math.floor(Math.random() * 150);
          var randomnumber_cust = Math.floor(Math.random() * 150);
          labelsTotalSalesArray.push([$k, randomnumber]);
          labelsOrdersArray.push([$k, randomnumber_order]);
          labelsCustomersArray.push([$k, randomnumber_cust]);
        }
      }
    } else {
      if (
        localStorage.getItem('start') === null &&
        localStorage.getItem('end') === null
      ) {
        const currentMoment = moment().subtract(6, 'days');
        const endMoment = moment().add(1, 'days');
        while (currentMoment.isBefore(endMoment, 'day')) {
          var randomnumber = Math.floor(Math.random() * 150);
          var randomnumber_order = Math.floor(Math.random() * 150);
          var randomnumber_cust = Math.floor(Math.random() * 150);
          labelsTotalSalesArray.push([
            currentMoment.format('MMM DD'),
            randomnumber,
          ]);
          labelsOrdersArray.push([
            currentMoment.format('MMM DD'),
            randomnumber_order,
          ]);
          labelsCustomersArray.push([
            currentMoment.format('MMM DD'),
            randomnumber_cust,
          ]);
          currentMoment.add(1, 'days');
        }
      } else {
        const currentMoment = moment(localStorage.getItem('start'));
        const endMoment = moment(localStorage.getItem('end')).add(1, 'days');
        while (currentMoment.isBefore(endMoment, 'day')) {
          var randomnumber = Math.floor(Math.random() * 150);
          var randomnumber_order = Math.floor(Math.random() * 150);
          var randomnumber_cust = Math.floor(Math.random() * 150);
          labelsTotalSalesArray.push([
            currentMoment.format('MMM DD'),
            randomnumber,
          ]);
          labelsOrdersArray.push([
            currentMoment.format('MMM DD'),
            randomnumber_order,
          ]);
          labelsCustomersArray.push([
            currentMoment.format('MMM DD'),
            randomnumber_cust,
          ]);
          currentMoment.add(1, 'days');
        }
      }
    }
    var datav3 = [
      {
        label: 'CPU usage',
        color: '#23b7e5',
        data: labelsTotalSalesArray,
      },
      {
        label: 'Memory usage',
        color: '#7266ba',
        data: labelsOrdersArray,
      },
      {
        label: 'Tokens per minute',
        color: '#5d9cec',
        data: labelsCustomersArray,
      },
    ];

    var options = {
      series: {
        lines: {
          show: false,
        },
        points: {
          show: true,
          radius: 4,
        },
        splines: {
          show: true,
          tension: 0.4,
          lineWidth: 1,
          fill: 0.5,
        },
      },
      grid: {
        borderColor: '#eee',
        borderWidth: 1,
        hoverable: true,
        backgroundColor: '#fcfcfc',
      },
      tooltip: true,
      tooltipOpts: {
        content: function (label, x, y) {
          return x + ' : ' + y;
        },
      },
      xaxis: {
        tickColor: '#fcfcfc',
        mode: 'categories',
      },
      yaxis: {
        min: 0,
        tickColor: '#eee',
        //position: 'right' or 'left',
        tickFormatter: function (v) {
          return v /* + ' visitors'*/;
        },
      },
      shadowSize: 0,
    };

    var chartv3 = $('.chart-splinev3');
    if (chartv3.length) $.plot(chartv3, datav3, options);
  });
})(window, document, window.jQuery);

// CHART PIE
// -----------------------------------
(function (window, document, $, undefined) {
  $(function () {
    var data = [
      {
        label: 'Advertisements',
        color: '#4acab4',
        data: 30,
      },
      {
        label: 'Mobile App',
        color: '#ffea88',
        data: 40,
      },
      {
        label: 'Website',
        color: '#ff8153',
        data: 90,
      },
      {
        label: 'Android',
        color: '#878bb6',
        data: 75,
      },
      {
        label: 'iOS',
        color: '#b2d767',
        data: 120,
      },
    ];

    var options = {
      series: {
        pie: {
          show: true,
          innerRadius: 0,
          label: {
            show: true,
            radius: 0.8,
            formatter: function (label, series) {
              return (
                '<div class="flot-pie-label">' +
                //label + ' : ' +
                Math.round(series.percent) +
                '%</div>'
              );
            },
            background: {
              opacity: 0.8,
              color: '#222',
            },
          },
        },
      },
    };

    var chart = $('.chart-pie');
    if (chart.length) $.plot(chart, data, options);
  });
})(window, document, window.jQuery);
