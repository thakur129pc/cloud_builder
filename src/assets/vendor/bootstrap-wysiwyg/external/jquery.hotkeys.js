!(function (e) {
  function t(t) {
    if ('string' == typeof t.data) {
      var a = t.handler,
        s = t.data.toLowerCase().split(' '),
        r = [
          'text',
          'password',
          'number',
          'email',
          'url',
          'range',
          'date',
          'month',
          'week',
          'time',
          'datetime',
          'datetime-local',
          'search',
          'color',
        ];
      t.handler = function (t) {
        if (
          this === t.target ||
          !(
            /textarea|select/i.test(t.target.nodeName) ||
            e.inArray(t.target.type, r) > -1
          )
        ) {
          var i = 'keypress' !== t.type && e.hotkeys.specialKeys[t.which],
            f = String.fromCharCode(t.which).toLowerCase(),
            o = '',
            l = {};
          t.altKey && 'alt' !== i && (o += 'alt+'),
            t.ctrlKey && 'ctrl' !== i && (o += 'ctrl+'),
            t.metaKey && !t.ctrlKey && 'meta' !== i && (o += 'meta+'),
            t.shiftKey && 'shift' !== i && (o += 'shift+'),
            i
              ? (l[o + i] = !0)
              : ((l[o + f] = !0),
                (l[o + e.hotkeys.shiftNums[f]] = !0),
                'shift+' === o && (l[e.hotkeys.shiftNums[f]] = !0));
          for (var n = 0, h = s.length; h > n; n++)
            if (l[s[n]]) return a.apply(this, arguments);
        }
      };
    }
  }
  (e.hotkeys = {
    version: '0.8',
    specialKeys: {
      8: 'backspace',
      9: 'tab',
      13: 'return',
      16: 'shift',
      17: 'ctrl',
      18: 'alt',
      19: 'pause',
      20: 'capslock',
      27: 'esc',
      32: 'space',
      33: 'pageup',
      34: 'pagedown',
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      45: 'insert',
      46: 'del',
      96: '0',
      97: '1',
      98: '2',
      99: '3',
      100: '4',
      101: '5',
      102: '6',
      103: '7',
      104: '8',
      105: '9',
      106: '*',
      107: '+',
      109: '-',
      110: '.',
      111: '/',
      112: 'f1',
      113: 'f2',
      114: 'f3',
      115: 'f4',
      116: 'f5',
      117: 'f6',
      118: 'f7',
      119: 'f8',
      120: 'f9',
      121: 'f10',
      122: 'f11',
      123: 'f12',
      144: 'numlock',
      145: 'scroll',
      191: '/',
      224: 'meta',
    },
    shiftNums: {
      '`': '~',
      1: '!',
      2: '@',
      3: '#',
      4: '$',
      5: '%',
      6: '^',
      7: '&',
      8: '*',
      9: '(',
      0: ')',
      '-': '_',
      '=': '+',
      ';': ': ',
      "'": '"',
      ',': '<',
      '.': '>',
      '/': '?',
      '\\': '|',
    },
  }),
    e.each(['keydown', 'keyup', 'keypress'], function () {
      e.event.special[this] = { add: t };
    });
})(jQuery);
