!(function (e, t) {
  'function' == typeof define && define.amd
    ? define(['d3'], function (i) {
        return (e.Rickshaw = t(i));
      })
    : 'object' == typeof exports
      ? (module.exports = t(require('d3')))
      : (e.Rickshaw = t(d3));
})(this, function (e) {
  var t = {
    namespace: function (e) {
      for (var i = e.split('.'), n = t, r = 1, s = i.length; s > r; r++) {
        var a = i[r];
        (n[a] = n[a] || {}), (n = n[a]);
      }
      return n;
    },
    keys: function (e) {
      var t = [];
      for (var i in e) t.push(i);
      return t;
    },
    extend: function (e, t) {
      for (var i in t) e[i] = t[i];
      return e;
    },
    clone: function (e) {
      return JSON.parse(JSON.stringify(e));
    },
  };
  return (
    (function (e) {
      function t(e) {
        return d.call(e) === w;
      }
      function i(e, t) {
        for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
        return e;
      }
      function n(e) {
        if (r(e) !== v) throw new TypeError();
        var t = [];
        for (var i in e) e.hasOwnProperty(i) && t.push(i);
        return t;
      }
      function r(e) {
        switch (e) {
          case null:
            return u;
          case void 0:
            return f;
        }
        var t = typeof e;
        switch (t) {
          case 'boolean':
            return p;
          case 'number':
            return m;
          case 'string':
            return g;
        }
        return v;
      }
      function s(e) {
        return 'undefined' == typeof e;
      }
      function a(e) {
        var t = e
          .toString()
          .match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
          .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
          .replace(/\s+/g, '')
          .split(',');
        return 1 != t.length || t[0] ? t : [];
      }
      function h(e, t) {
        var i = e;
        return function () {
          var e = o([l(i, this)], arguments);
          return t.apply(this, e);
        };
      }
      function o(e, t) {
        for (var i = e.length, n = t.length; n--; ) e[i + n] = t[n];
        return e;
      }
      function c(e, t) {
        return (e = y.call(e, 0)), o(e, t);
      }
      function l(e, t) {
        if (arguments.length < 2 && s(arguments[0])) return this;
        var i = e,
          n = y.call(arguments, 2);
        return function () {
          var e = c(n, arguments);
          return i.apply(t, e);
        };
      }
      var d = Object.prototype.toString,
        u = 'Null',
        f = 'Undefined',
        p = 'Boolean',
        m = 'Number',
        g = 'String',
        v = 'Object',
        w = '[object Function]',
        y = Array.prototype.slice,
        k = function () {},
        x = (function () {
          function e() {}
          function r() {
            function n() {
              this.initialize.apply(this, arguments);
            }
            var r = null,
              s = [].slice.apply(arguments);
            if (
              (t(s[0]) && (r = s.shift()),
              i(n, x.Methods),
              (n.superclass = r),
              (n.subclasses = []),
              r)
            ) {
              (e.prototype = r.prototype), (n.prototype = new e());
              try {
                r.subclasses.push(n);
              } catch (a) {}
            }
            for (var h = 0, o = s.length; o > h; h++) n.addMethods(s[h]);
            return (
              n.prototype.initialize || (n.prototype.initialize = k),
              (n.prototype.constructor = n),
              n
            );
          }
          function s(e) {
            var i = this.superclass && this.superclass.prototype,
              r = n(e);
            o &&
              (e.toString != Object.prototype.toString && r.push('toString'),
              e.valueOf != Object.prototype.valueOf && r.push('valueOf'));
            for (var s = 0, c = r.length; c > s; s++) {
              var d = r[s],
                u = e[d];
              if (i && t(u) && '$super' == a(u)[0]) {
                var f = u;
                (u = h(
                  (function (e) {
                    return function () {
                      return i[e].apply(this, arguments);
                    };
                  })(d),
                  f
                )),
                  (u.valueOf = l(f.valueOf, f)),
                  (u.toString = l(f.toString, f));
              }
              this.prototype[d] = u;
            }
            return this;
          }
          var o = (function () {
            for (var e in { toString: 1 }) if ('toString' === e) return !1;
            return !0;
          })();
          return { create: r, Methods: { addMethods: s } };
        })();
      e.exports ? (e.exports.Class = x) : (e.Class = x);
    })(t),
    t.namespace('Rickshaw.Compat.ClassList'),
    (t.Compat.ClassList = function () {
      'undefined' == typeof document ||
        'classList' in document.createElement('a') ||
        !(function (e) {
          'use strict';
          var t = 'classList',
            i = 'prototype',
            n = (e.HTMLElement || e.Element)[i],
            r = Object,
            s =
              String[i].trim ||
              function () {
                return this.replace(/^\s+|\s+$/g, '');
              },
            a =
              Array[i].indexOf ||
              function (e) {
                for (var t = 0, i = this.length; i > t; t++)
                  if (t in this && this[t] === e) return t;
                return -1;
              },
            h = function (e, t) {
              (this.name = e),
                (this.code = DOMException[e]),
                (this.message = t);
            },
            o = function (e, t) {
              if ('' === t)
                throw new h(
                  'SYNTAX_ERR',
                  'An invalid or illegal string was specified'
                );
              if (/\s/.test(t))
                throw new h(
                  'INVALID_CHARACTER_ERR',
                  'String contains an invalid character'
                );
              return a.call(e, t);
            },
            c = function (e) {
              for (
                var t = s.call(e.className),
                  i = t ? t.split(/\s+/) : [],
                  n = 0,
                  r = i.length;
                r > n;
                n++
              )
                this.push(i[n]);
              this._updateClassName = function () {
                e.className = this.toString();
              };
            },
            l = (c[i] = []),
            d = function () {
              return new c(this);
            };
          if (
            ((h[i] = Error[i]),
            (l.item = function (e) {
              return this[e] || null;
            }),
            (l.contains = function (e) {
              return (e += ''), -1 !== o(this, e);
            }),
            (l.add = function (e) {
              (e += ''),
                -1 === o(this, e) && (this.push(e), this._updateClassName());
            }),
            (l.remove = function (e) {
              e += '';
              var t = o(this, e);
              -1 !== t && (this.splice(t, 1), this._updateClassName());
            }),
            (l.toggle = function (e) {
              (e += ''), -1 === o(this, e) ? this.add(e) : this.remove(e);
            }),
            (l.toString = function () {
              return this.join(' ');
            }),
            r.defineProperty)
          ) {
            var u = { get: d, enumerable: !0, configurable: !0 };
            try {
              r.defineProperty(n, t, u);
            } catch (f) {
              -2146823252 === f.number &&
                ((u.enumerable = !1), r.defineProperty(n, t, u));
            }
          } else r[i].__defineGetter__ && n.__defineGetter__(t, d);
        })(window);
    }),
    (('undefined' != typeof RICKSHAW_NO_COMPAT && !RICKSHAW_NO_COMPAT) ||
      'undefined' == typeof RICKSHAW_NO_COMPAT) &&
      new t.Compat.ClassList(),
    t.namespace('Rickshaw.Graph'),
    (t.Graph = function (i) {
      var n = this;
      (this.initialize = function (t) {
        if (!t.element) throw 'Rickshaw.Graph needs a reference to an element';
        if (1 !== t.element.nodeType)
          throw 'Rickshaw.Graph element was defined but not an HTML element';
        (this.element = t.element),
          (this.series = t.series),
          (this.window = {}),
          (this.updateCallbacks = []),
          (this.configureCallbacks = []),
          (this.defaults = {
            interpolation: 'cardinal',
            offset: 'zero',
            min: void 0,
            max: void 0,
            preserve: !1,
            xScale: void 0,
            yScale: void 0,
            stack: !0,
          }),
          this._loadRenderers(),
          this.configure(t),
          this.validateSeries(t.series),
          (this.series.active = function () {
            return n.series.filter(function (e) {
              return !e.disabled;
            });
          }),
          this.setSize({ width: t.width, height: t.height }),
          this.element.classList.add('rickshaw_graph'),
          (this.vis = e
            .select(this.element)
            .append('svg:svg')
            .attr('width', this.width)
            .attr('height', this.height)),
          this.discoverRange();
      }),
        (this._loadRenderers = function () {
          for (var e in t.Graph.Renderer)
            if (e && t.Graph.Renderer.hasOwnProperty(e)) {
              var i = t.Graph.Renderer[e];
              i &&
                i.prototype &&
                i.prototype.render &&
                n.registerRenderer(new i({ graph: n }));
            }
        }),
        (this.validateSeries = function (e) {
          if (!(Array.isArray(e) || e instanceof t.Series)) {
            var i = Object.prototype.toString.apply(e);
            throw 'series is not an array: ' + i;
          }
          e.forEach(function (e) {
            if (!(e instanceof Object))
              throw 'series element is not an object: ' + e;
            if (!e.data) throw 'series has no data: ' + JSON.stringify(e);
            if (!Array.isArray(e.data))
              throw 'series data is not an array: ' + JSON.stringify(e.data);
            if (e.data.length > 0) {
              var t = e.data[0].x,
                i = e.data[0].y;
              if ('number' != typeof t || ('number' != typeof i && null !== i))
                throw (
                  'x and y properties of points should be numbers instead of ' +
                  typeof t +
                  ' and ' +
                  typeof i
                );
            }
            if (
              e.data.length >= 3 &&
              (e.data[2].x < e.data[1].x ||
                e.data[1].x < e.data[0].x ||
                e.data[e.data.length - 1].x < e.data[0].x)
            )
              throw (
                'series data needs to be sorted on x values for series name: ' +
                e.name
              );
          }, this);
        }),
        (this.dataDomain = function () {
          var t = this.series.map(function (e) {
              return e.data;
            }),
            i = e.min(
              t.map(function (e) {
                return e[0].x;
              })
            ),
            n = e.max(
              t.map(function (e) {
                return e[e.length - 1].x;
              })
            );
          return [i, n];
        }),
        (this.discoverRange = function () {
          var t = this.renderer.domain();
          (this.x = (this.xScale || e.scale.linear())
            .copy()
            .domain(t.x)
            .range([0, this.width])),
            (this.y = (this.yScale || e.scale.linear())
              .copy()
              .domain(t.y)
              .range([this.height, 0])),
            (this.x.magnitude = e.scale
              .linear()
              .domain([t.x[0] - t.x[0], t.x[1] - t.x[0]])
              .range([0, this.width])),
            (this.y.magnitude = e.scale
              .linear()
              .domain([t.y[0] - t.y[0], t.y[1] - t.y[0]])
              .range([0, this.height]));
        }),
        (this.render = function () {
          this.stackData();
          this.discoverRange(),
            this.renderer.render(),
            this.updateCallbacks.forEach(function (e) {
              e();
            });
        }),
        (this.update = this.render),
        (this.stackData = function () {
          var i = this.series
              .active()
              .map(function (e) {
                return e.data;
              })
              .map(function (e) {
                return e.filter(function (e) {
                  return this._slice(e);
                }, this);
              }, this),
            r = this.preserve;
          r ||
            this.series.forEach(function (e) {
              e.scale && (r = !0);
            }),
            (i = r ? t.clone(i) : i),
            this.series.active().forEach(function (e, t) {
              if (e.scale) {
                var n = i[t];
                n &&
                  n.forEach(function (t) {
                    t.y = e.scale(t.y);
                  });
              }
            }),
            this.stackData.hooks.data.forEach(function (e) {
              i = e.f.apply(n, [i]);
            });
          var s;
          if (!this.renderer.unstack) {
            this._validateStackable();
            var a = e.layout.stack();
            a.offset(n.offset), (s = a(i));
          }
          (s = s || i),
            this.renderer.unstack &&
              s.forEach(function (e) {
                e.forEach(function (e) {
                  e.y0 = void 0 === e.y0 ? 0 : e.y0;
                });
              }),
            this.stackData.hooks.after.forEach(function (e) {
              s = e.f.apply(n, [i]);
            });
          var h = 0;
          return (
            this.series.forEach(function (e) {
              e.disabled || (e.stack = s[h++]);
            }),
            (this.stackedData = s),
            s
          );
        }),
        (this._validateStackable = function () {
          var e,
            t = this.series;
          t.forEach(function (t) {
            if (((e = e || t.data.length), e && t.data.length != e))
              throw (
                'stacked series cannot have differing numbers of points: ' +
                e +
                ' vs ' +
                t.data.length +
                '; see Rickshaw.Series.fill()'
              );
          }, this);
        }),
        (this.stackData.hooks = { data: [], after: [] }),
        (this._slice = function (e) {
          if (this.window.xMin || this.window.xMax) {
            var t = !0;
            return (
              this.window.xMin && e.x < this.window.xMin && (t = !1),
              this.window.xMax && e.x > this.window.xMax && (t = !1),
              t
            );
          }
          return !0;
        }),
        (this.onUpdate = function (e) {
          this.updateCallbacks.push(e);
        }),
        (this.onConfigure = function (e) {
          this.configureCallbacks.push(e);
        }),
        (this.registerRenderer = function (e) {
          (this._renderers = this._renderers || {}),
            (this._renderers[e.name] = e);
        }),
        (this.configure = function (e) {
          (this.config = this.config || {}),
            (e.width || e.height) && this.setSize(e),
            t.keys(this.defaults).forEach(function (t) {
              this.config[t] =
                t in e ? e[t] : t in this ? this[t] : this.defaults[t];
            }, this),
            t.keys(this.config).forEach(function (e) {
              this[e] = this.config[e];
            }, this),
            'stack' in e && (e.unstack = !e.stack);
          var i =
            e.renderer || (this.renderer && this.renderer.name) || 'stack';
          this.setRenderer(i, e),
            this.configureCallbacks.forEach(function (t) {
              t(e);
            });
        }),
        (this.setRenderer = function (e, t) {
          if ('function' == typeof e)
            (this.renderer = new e({ graph: n })),
              this.registerRenderer(this.renderer);
          else {
            if (!this._renderers[e]) throw "couldn't find renderer " + e;
            this.renderer = this._renderers[e];
          }
          'object' == typeof t && this.renderer.configure(t);
        }),
        (this.setSize = function (e) {
          if (((e = e || {}), void 0 !== typeof window))
            var t = window.getComputedStyle(this.element, null),
              i = parseInt(t.getPropertyValue('width'), 10),
              n = parseInt(t.getPropertyValue('height'), 10);
          (this.width = e.width || i || 400),
            (this.height = e.height || n || 250),
            this.vis &&
              this.vis.attr('width', this.width).attr('height', this.height);
        }),
        this.initialize(i);
    }),
    t.namespace('Rickshaw.Fixtures.Color'),
    (t.Fixtures.Color = function () {
      (this.schemes = {}),
        (this.schemes.spectrum14 = [
          '#ecb796',
          '#dc8f70',
          '#b2a470',
          '#92875a',
          '#716c49',
          '#d2ed82',
          '#bbe468',
          '#a1d05d',
          '#e7cbe6',
          '#d8aad6',
          '#a888c2',
          '#9dc2d3',
          '#649eb9',
          '#387aa3',
        ].reverse()),
        (this.schemes.spectrum2000 = [
          '#57306f',
          '#514c76',
          '#646583',
          '#738394',
          '#6b9c7d',
          '#84b665',
          '#a7ca50',
          '#bfe746',
          '#e2f528',
          '#fff726',
          '#ecdd00',
          '#d4b11d',
          '#de8800',
          '#de4800',
          '#c91515',
          '#9a0000',
          '#7b0429',
          '#580839',
          '#31082b',
        ]),
        (this.schemes.spectrum2001 = [
          '#2f243f',
          '#3c2c55',
          '#4a3768',
          '#565270',
          '#6b6b7c',
          '#72957f',
          '#86ad6e',
          '#a1bc5e',
          '#b8d954',
          '#d3e04e',
          '#ccad2a',
          '#cc8412',
          '#c1521d',
          '#ad3821',
          '#8a1010',
          '#681717',
          '#531e1e',
          '#3d1818',
          '#320a1b',
        ]),
        (this.schemes.classic9 = [
          '#423d4f',
          '#4a6860',
          '#848f39',
          '#a2b73c',
          '#ddcb53',
          '#c5a32f',
          '#7d5836',
          '#963b20',
          '#7c2626',
          '#491d37',
          '#2f254a',
        ].reverse()),
        (this.schemes.httpStatus = {
          503: '#ea5029',
          502: '#d23f14',
          500: '#bf3613',
          410: '#efacea',
          409: '#e291dc',
          403: '#f457e8',
          408: '#e121d2',
          401: '#b92dae',
          405: '#f47ceb',
          404: '#a82a9f',
          400: '#b263c6',
          301: '#6fa024',
          302: '#87c32b',
          307: '#a0d84c',
          304: '#28b55c',
          200: '#1a4f74',
          206: '#27839f',
          201: '#52adc9',
          202: '#7c979f',
          203: '#a5b8bd',
          204: '#c1cdd1',
        }),
        (this.schemes.colorwheel = [
          '#b5b6a9',
          '#858772',
          '#785f43',
          '#96557e',
          '#4682b4',
          '#65b9ac',
          '#73c03a',
          '#cb513a',
        ].reverse()),
        (this.schemes.cool = [
          '#5e9d2f',
          '#73c03a',
          '#4682b4',
          '#7bc3b8',
          '#a9884e',
          '#c1b266',
          '#a47493',
          '#c09fb5',
        ]),
        (this.schemes.munin = [
          '#00cc00',
          '#0066b3',
          '#ff8000',
          '#ffcc00',
          '#330099',
          '#990099',
          '#ccff00',
          '#ff0000',
          '#808080',
          '#008f00',
          '#00487d',
          '#b35a00',
          '#b38f00',
          '#6b006b',
          '#8fb300',
          '#b30000',
          '#bebebe',
          '#80ff80',
          '#80c9ff',
          '#ffc080',
          '#ffe680',
          '#aa80ff',
          '#ee00cc',
          '#ff8080',
          '#666600',
          '#ffbfff',
          '#00ffcc',
          '#cc6699',
          '#999900',
        ]);
    }),
    t.namespace('Rickshaw.Fixtures.RandomData'),
    (t.Fixtures.RandomData = function (e) {
      e = e || 1;
      var t = 200,
        i = Math.floor(new Date().getTime() / 1e3);
      (this.addData = function (n) {
        var r = 100 * Math.random() + 15 + t,
          s = n[0].length,
          a = 1;
        n.forEach(function (t) {
          var n = 20 * Math.random(),
            h =
              r / 25 +
              a++ +
              15 * (Math.cos((s * a * 11) / 960) + 2) +
              7 * (Math.cos(s / 7) + 2) +
              1 * (Math.cos(s / 17) + 2);
          t.push({ x: s * e + i, y: h + n });
        }),
          (t = 0.85 * r);
      }),
        (this.removeData = function (t) {
          t.forEach(function (e) {
            e.shift();
          }),
            (i += e);
        });
    }),
    t.namespace('Rickshaw.Fixtures.Time'),
    (t.Fixtures.Time = function () {
      var t = this;
      (this.months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]),
        (this.units = [
          {
            name: 'decade',
            seconds: 315576e3,
            formatter: function (e) {
              return 10 * parseInt(e.getUTCFullYear() / 10, 10);
            },
          },
          {
            name: 'year',
            seconds: 31557600,
            formatter: function (e) {
              return e.getUTCFullYear();
            },
          },
          {
            name: 'month',
            seconds: 2635200,
            formatter: function (e) {
              return t.months[e.getUTCMonth()];
            },
          },
          {
            name: 'week',
            seconds: 604800,
            formatter: function (e) {
              return t.formatDate(e);
            },
          },
          {
            name: 'day',
            seconds: 86400,
            formatter: function (e) {
              return e.getUTCDate();
            },
          },
          {
            name: '6 hour',
            seconds: 21600,
            formatter: function (e) {
              return t.formatTime(e);
            },
          },
          {
            name: 'hour',
            seconds: 3600,
            formatter: function (e) {
              return t.formatTime(e);
            },
          },
          {
            name: '15 minute',
            seconds: 900,
            formatter: function (e) {
              return t.formatTime(e);
            },
          },
          {
            name: 'minute',
            seconds: 60,
            formatter: function (e) {
              return e.getUTCMinutes();
            },
          },
          {
            name: '15 second',
            seconds: 15,
            formatter: function (e) {
              return e.getUTCSeconds() + 's';
            },
          },
          {
            name: 'second',
            seconds: 1,
            formatter: function (e) {
              return e.getUTCSeconds() + 's';
            },
          },
          {
            name: 'decisecond',
            seconds: 0.1,
            formatter: function (e) {
              return e.getUTCMilliseconds() + 'ms';
            },
          },
          {
            name: 'centisecond',
            seconds: 0.01,
            formatter: function (e) {
              return e.getUTCMilliseconds() + 'ms';
            },
          },
        ]),
        (this.unit = function (e) {
          return this.units
            .filter(function (t) {
              return e == t.name;
            })
            .shift();
        }),
        (this.formatDate = function (t) {
          return e.time.format('%b %e')(t);
        }),
        (this.formatTime = function (e) {
          return e.toUTCString().match(/(\d+:\d+):/)[1];
        }),
        (this.ceil = function (e, t) {
          var i, n, r;
          if ('month' == t.name) {
            if (
              ((i = new Date(1e3 * e)),
              (n = Date.UTC(i.getUTCFullYear(), i.getUTCMonth()) / 1e3),
              n == e)
            )
              return e;
            r = i.getUTCFullYear();
            var s = i.getUTCMonth();
            return (
              11 == s ? ((s = 0), (r += 1)) : (s += 1), Date.UTC(r, s) / 1e3
            );
          }
          return 'year' == t.name
            ? ((i = new Date(1e3 * e)),
              (n = Date.UTC(i.getUTCFullYear(), 0) / 1e3),
              n == e ? e : ((r = i.getUTCFullYear() + 1), Date.UTC(r, 0) / 1e3))
            : Math.ceil(e / t.seconds) * t.seconds;
        });
    }),
    t.namespace('Rickshaw.Fixtures.Time.Local'),
    (t.Fixtures.Time.Local = function () {
      var t = this;
      (this.months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]),
        (this.units = [
          {
            name: 'decade',
            seconds: 315576e3,
            formatter: function (e) {
              return 10 * parseInt(e.getFullYear() / 10, 10);
            },
          },
          {
            name: 'year',
            seconds: 31557600,
            formatter: function (e) {
              return e.getFullYear();
            },
          },
          {
            name: 'month',
            seconds: 2635200,
            formatter: function (e) {
              return t.months[e.getMonth()];
            },
          },
          {
            name: 'week',
            seconds: 604800,
            formatter: function (e) {
              return t.formatDate(e);
            },
          },
          {
            name: 'day',
            seconds: 86400,
            formatter: function (e) {
              return e.getDate();
            },
          },
          {
            name: '6 hour',
            seconds: 21600,
            formatter: function (e) {
              return t.formatTime(e);
            },
          },
          {
            name: 'hour',
            seconds: 3600,
            formatter: function (e) {
              return t.formatTime(e);
            },
          },
          {
            name: '15 minute',
            seconds: 900,
            formatter: function (e) {
              return t.formatTime(e);
            },
          },
          {
            name: 'minute',
            seconds: 60,
            formatter: function (e) {
              return e.getMinutes();
            },
          },
          {
            name: '15 second',
            seconds: 15,
            formatter: function (e) {
              return e.getSeconds() + 's';
            },
          },
          {
            name: 'second',
            seconds: 1,
            formatter: function (e) {
              return e.getSeconds() + 's';
            },
          },
          {
            name: 'decisecond',
            seconds: 0.1,
            formatter: function (e) {
              return e.getMilliseconds() + 'ms';
            },
          },
          {
            name: 'centisecond',
            seconds: 0.01,
            formatter: function (e) {
              return e.getMilliseconds() + 'ms';
            },
          },
        ]),
        (this.unit = function (e) {
          return this.units
            .filter(function (t) {
              return e == t.name;
            })
            .shift();
        }),
        (this.formatDate = function (t) {
          return e.time.format('%b %e')(t);
        }),
        (this.formatTime = function (e) {
          return e.toString().match(/(\d+:\d+):/)[1];
        }),
        (this.ceil = function (e, t) {
          var i, n, r;
          if ('day' == t.name) {
            var s = new Date(1e3 * (e + t.seconds - 1)),
              a = new Date(0);
            return (
              a.setMilliseconds(0),
              a.setSeconds(0),
              a.setMinutes(0),
              a.setHours(0),
              a.setDate(s.getDate()),
              a.setMonth(s.getMonth()),
              a.setFullYear(s.getFullYear()),
              a.getTime() / 1e3
            );
          }
          if ('month' == t.name) {
            if (
              ((i = new Date(1e3 * e)),
              (n = new Date(i.getFullYear(), i.getMonth()).getTime() / 1e3),
              n == e)
            )
              return e;
            r = i.getFullYear();
            var h = i.getMonth();
            return (
              11 == h ? ((h = 0), (r += 1)) : (h += 1),
              new Date(r, h).getTime() / 1e3
            );
          }
          return 'year' == t.name
            ? ((i = new Date(1e3 * e)),
              (n = new Date(i.getUTCFullYear(), 0).getTime() / 1e3),
              n == e
                ? e
                : ((r = i.getFullYear() + 1), new Date(r, 0).getTime() / 1e3))
            : Math.ceil(e / t.seconds) * t.seconds;
        });
    }),
    t.namespace('Rickshaw.Fixtures.Number'),
    (t.Fixtures.Number.formatKMBT = function (e) {
      var t = Math.abs(e);
      return t >= 1e12
        ? e / 1e12 + 'T'
        : t >= 1e9
          ? e / 1e9 + 'B'
          : t >= 1e6
            ? e / 1e6 + 'M'
            : t >= 1e3
              ? e / 1e3 + 'K'
              : 1 > t && e > 0
                ? e.toFixed(2)
                : 0 === t
                  ? ''
                  : e;
    }),
    (t.Fixtures.Number.formatBase1024KMGTP = function (e) {
      var t = Math.abs(e);
      return t >= 0x4000000000000
        ? e / 0x4000000000000 + 'P'
        : t >= 1099511627776
          ? e / 1099511627776 + 'T'
          : t >= 1073741824
            ? e / 1073741824 + 'G'
            : t >= 1048576
              ? e / 1048576 + 'M'
              : t >= 1024
                ? e / 1024 + 'K'
                : 1 > t && e > 0
                  ? e.toFixed(2)
                  : 0 === t
                    ? ''
                    : e;
    }),
    t.namespace('Rickshaw.Color.Palette'),
    (t.Color.Palette = function (i) {
      var n = new t.Fixtures.Color();
      if (
        ((i = i || {}),
        (this.schemes = {}),
        (this.scheme = n.schemes[i.scheme] || i.scheme || n.schemes.colorwheel),
        (this.runningIndex = 0),
        (this.generatorIndex = 0),
        i.interpolatedStopCount)
      ) {
        var r,
          s,
          a = this.scheme.length - 1,
          h = [];
        for (r = 0; a > r; r++) {
          h.push(this.scheme[r]);
          var o = e.interpolateHsl(this.scheme[r], this.scheme[r + 1]);
          for (s = 1; s < i.interpolatedStopCount; s++)
            h.push(o((1 / i.interpolatedStopCount) * s));
        }
        h.push(this.scheme[this.scheme.length - 1]), (this.scheme = h);
      }
      (this.rotateCount = this.scheme.length),
        (this.color = function (e) {
          return (
            this.scheme[e] ||
            this.scheme[this.runningIndex++] ||
            this.interpolateColor() ||
            '#808080'
          );
        }),
        (this.interpolateColor = function () {
          if (Array.isArray(this.scheme)) {
            var t;
            return (
              this.generatorIndex == 2 * this.rotateCount - 1
                ? ((t = e.interpolateHsl(
                    this.scheme[this.generatorIndex],
                    this.scheme[0]
                  )(0.5)),
                  (this.generatorIndex = 0),
                  (this.rotateCount *= 2))
                : ((t = e.interpolateHsl(
                    this.scheme[this.generatorIndex],
                    this.scheme[this.generatorIndex + 1]
                  )(0.5)),
                  this.generatorIndex++),
              this.scheme.push(t),
              t
            );
          }
        });
    }),
    t.namespace('Rickshaw.Graph.Ajax'),
    (t.Graph.Ajax = t.Class.create({
      initialize: function (e) {
        (this.dataURL = e.dataURL),
          (this.onData =
            e.onData ||
            function (e) {
              return e;
            }),
          (this.onComplete = e.onComplete || function () {}),
          (this.onError = e.onError || function () {}),
          (this.args = e),
          this.request();
      },
      request: function () {
        jQuery.ajax({
          url: this.dataURL,
          dataType: 'json',
          success: this.success.bind(this),
          error: this.error.bind(this),
        });
      },
      error: function () {
        console.log('error loading dataURL: ' + this.dataURL),
          this.onError(this);
      },
      success: function (e) {
        (e = this.onData(e)),
          (this.args.series = this._splice({
            data: e,
            series: this.args.series,
          })),
          (this.graph = this.graph || new t.Graph(this.args)),
          this.graph.render(),
          this.onComplete(this);
      },
      _splice: function (e) {
        var t = e.data,
          i = e.series;
        return e.series
          ? (i.forEach(function (e) {
              var i = e.key || e.name;
              if (!i) throw 'series needs a key or a name';
              t.forEach(function (t) {
                var n = t.key || t.name;
                if (!n) throw 'data needs a key or a name';
                if (i == n) {
                  var r = ['color', 'name', 'data'];
                  r.forEach(function (i) {
                    t[i] && (e[i] = t[i]);
                  });
                }
              });
            }),
            i)
          : t;
      },
    })),
    t.namespace('Rickshaw.Graph.Annotate'),
    (t.Graph.Annotate = function (e) {
      this.graph = e.graph;
      this.elements = { timeline: e.element };
      var i = this;
      (this.data = {}),
        this.elements.timeline.classList.add('rickshaw_annotation_timeline'),
        (this.add = function (e, t, n) {
          (i.data[e] = i.data[e] || { boxes: [] }),
            i.data[e].boxes.push({ content: t, end: n });
        }),
        (this.update = function () {
          t.keys(i.data).forEach(function (e) {
            var t = i.data[e],
              n = i.graph.x(e);
            if (0 > n || n > i.graph.x.range()[1])
              return (
                t.element &&
                  (t.line.classList.add('offscreen'),
                  (t.element.style.display = 'none')),
                void t.boxes.forEach(function (e) {
                  e.rangeElement && e.rangeElement.classList.add('offscreen');
                })
              );
            if (!t.element) {
              var r = (t.element = document.createElement('div'));
              r.classList.add('annotation'),
                this.elements.timeline.appendChild(r),
                r.addEventListener(
                  'click',
                  function () {
                    r.classList.toggle('active'),
                      t.line.classList.toggle('active'),
                      t.boxes.forEach(function (e) {
                        e.rangeElement &&
                          e.rangeElement.classList.toggle('active');
                      });
                  },
                  !1
                );
            }
            (t.element.style.left = n + 'px'),
              (t.element.style.display = 'block'),
              t.boxes.forEach(function (e) {
                var r = e.element;
                if (
                  (r ||
                    ((r = e.element = document.createElement('div')),
                    r.classList.add('content'),
                    (r.innerHTML = e.content),
                    t.element.appendChild(r),
                    (t.line = document.createElement('div')),
                    t.line.classList.add('annotation_line'),
                    i.graph.element.appendChild(t.line),
                    e.end &&
                      ((e.rangeElement = document.createElement('div')),
                      e.rangeElement.classList.add('annotation_range'),
                      i.graph.element.appendChild(e.rangeElement))),
                  e.end)
                ) {
                  var s = n,
                    a = Math.min(i.graph.x(e.end), i.graph.x.range()[1]);
                  s > a &&
                    ((a = n),
                    (s = Math.max(i.graph.x(e.end), i.graph.x.range()[0])));
                  var h = a - s;
                  (e.rangeElement.style.left = s + 'px'),
                    (e.rangeElement.style.width = h + 'px'),
                    e.rangeElement.classList.remove('offscreen');
                }
                t.line.classList.remove('offscreen'),
                  (t.line.style.left = n + 'px');
              });
          }, this);
        }),
        this.graph.onUpdate(function () {
          i.update();
        });
    }),
    t.namespace('Rickshaw.Graph.Axis.Time'),
    (t.Graph.Axis.Time = function (e) {
      var i = this;
      (this.graph = e.graph),
        (this.elements = []),
        (this.ticksTreatment = e.ticksTreatment || 'plain'),
        (this.fixedTimeUnit = e.timeUnit);
      var n = e.timeFixture || new t.Fixtures.Time();
      (this.appropriateTimeUnit = function () {
        var e,
          t = n.units,
          i = this.graph.x.domain(),
          r = i[1] - i[0];
        return (
          t.forEach(function (t) {
            Math.floor(r / t.seconds) >= 2 && (e = e || t);
          }),
          e || n.units[n.units.length - 1]
        );
      }),
        (this.tickOffsets = function () {
          for (
            var e = this.graph.x.domain(),
              t = this.fixedTimeUnit || this.appropriateTimeUnit(),
              i = Math.ceil((e[1] - e[0]) / t.seconds),
              r = e[0],
              s = [],
              a = 0;
            i > a;
            a++
          ) {
            var h = n.ceil(r, t);
            (r = h + t.seconds / 2), s.push({ value: h, unit: t });
          }
          return s;
        }),
        (this.render = function () {
          this.elements.forEach(function (e) {
            e.parentNode.removeChild(e);
          }),
            (this.elements = []);
          var e = this.tickOffsets();
          e.forEach(function (e) {
            if (!(i.graph.x(e.value) > i.graph.x.range()[1])) {
              var t = document.createElement('div');
              (t.style.left = i.graph.x(e.value) + 'px'),
                t.classList.add('x_tick'),
                t.classList.add(i.ticksTreatment);
              var n = document.createElement('div');
              n.classList.add('title'),
                (n.innerHTML = e.unit.formatter(new Date(1e3 * e.value))),
                t.appendChild(n),
                i.graph.element.appendChild(t),
                i.elements.push(t);
            }
          });
        }),
        this.graph.onUpdate(function () {
          i.render();
        });
    }),
    t.namespace('Rickshaw.Graph.Axis.X'),
    (t.Graph.Axis.X = function (t) {
      var i = this,
        n = 0.1;
      (this.initialize = function (t) {
        (this.graph = t.graph),
          (this.orientation = t.orientation || 'top'),
          (this.pixelsPerTick = t.pixelsPerTick || 75),
          t.ticks && (this.staticTicks = t.ticks),
          t.tickValues && (this.tickValues = t.tickValues),
          (this.tickSize = t.tickSize || 4),
          (this.ticksTreatment = t.ticksTreatment || 'plain'),
          t.element
            ? ((this.element = t.element),
              this._discoverSize(t.element, t),
              (this.vis = e
                .select(t.element)
                .append('svg:svg')
                .attr('height', this.height)
                .attr('width', this.width)
                .attr('class', 'rickshaw_graph x_axis_d3')),
              (this.element = this.vis[0][0]),
              (this.element.style.position = 'relative'),
              this.setSize({ width: t.width, height: t.height }))
            : (this.vis = this.graph.vis),
          this.graph.onUpdate(function () {
            i.render();
          });
      }),
        (this.setSize = function (e) {
          if (((e = e || {}), this.element)) {
            this._discoverSize(this.element.parentNode, e),
              this.vis
                .attr('height', this.height)
                .attr('width', this.width * (1 + n));
            var t = Math.floor((this.width * n) / 2);
            this.element.style.left = -1 * t + 'px';
          }
        }),
        (this.render = function () {
          void 0 !== this._renderWidth &&
            this.graph.width !== this._renderWidth &&
            this.setSize({ auto: !0 });
          var i = e.svg.axis().scale(this.graph.x).orient(this.orientation);
          i.tickFormat(
            t.tickFormat ||
              function (e) {
                return e;
              }
          ),
            this.tickValues && i.tickValues(this.tickValues),
            (this.ticks =
              this.staticTicks ||
              Math.floor(this.graph.width / this.pixelsPerTick));
          var r,
            s = Math.floor((this.width * n) / 2) || 0;
          if ('top' == this.orientation) {
            var a = this.height || this.graph.height;
            r = 'translate(' + s + ',' + a + ')';
          } else r = 'translate(' + s + ', 0)';
          this.element && this.vis.selectAll('*').remove(),
            this.vis
              .append('svg:g')
              .attr('class', ['x_ticks_d3', this.ticksTreatment].join(' '))
              .attr('transform', r)
              .call(
                i.ticks(this.ticks).tickSubdivide(0).tickSize(this.tickSize)
              );
          var h = ('bottom' == this.orientation ? 1 : -1) * this.graph.height;
          this.graph.vis
            .append('svg:g')
            .attr('class', 'x_grid_d3')
            .call(i.ticks(this.ticks).tickSubdivide(0).tickSize(h))
            .selectAll('text')
            .each(function () {
              this.parentNode.setAttribute('data-x-value', this.textContent);
            }),
            (this._renderHeight = this.graph.height);
        }),
        (this._discoverSize = function (e, t) {
          if ('undefined' != typeof window) {
            var i = window.getComputedStyle(e, null),
              r = parseInt(i.getPropertyValue('height'), 10);
            if (!t.auto) var s = parseInt(i.getPropertyValue('width'), 10);
          }
          (this.width = (t.width || s || this.graph.width) * (1 + n)),
            (this.height = t.height || r || 40);
        }),
        this.initialize(t);
    }),
    t.namespace('Rickshaw.Graph.Axis.Y'),
    (t.Graph.Axis.Y = t.Class.create({
      initialize: function (t) {
        (this.graph = t.graph),
          (this.orientation = t.orientation || 'right'),
          (this.pixelsPerTick = t.pixelsPerTick || 75),
          t.ticks && (this.staticTicks = t.ticks),
          t.tickValues && (this.tickValues = t.tickValues),
          (this.tickSize = t.tickSize || 4),
          (this.ticksTreatment = t.ticksTreatment || 'plain'),
          (this.tickFormat =
            t.tickFormat ||
            function (e) {
              return e;
            }),
          (this.berthRate = 0.1),
          t.element
            ? ((this.element = t.element),
              (this.vis = e
                .select(t.element)
                .append('svg:svg')
                .attr('class', 'rickshaw_graph y_axis')),
              (this.element = this.vis[0][0]),
              (this.element.style.position = 'relative'),
              this.setSize({ width: t.width, height: t.height }))
            : (this.vis = this.graph.vis);
        var i = this;
        this.graph.onUpdate(function () {
          i.render();
        });
      },
      setSize: function (e) {
        if (((e = e || {}), this.element)) {
          if ('undefined' != typeof window) {
            var t = window.getComputedStyle(this.element.parentNode, null),
              i = parseInt(t.getPropertyValue('width'), 10);
            if (!e.auto) var n = parseInt(t.getPropertyValue('height'), 10);
          }
          (this.width = e.width || i || this.graph.width * this.berthRate),
            (this.height = e.height || n || this.graph.height),
            this.vis
              .attr('width', this.width)
              .attr('height', this.height * (1 + this.berthRate));
          var r = this.height * this.berthRate;
          'left' == this.orientation &&
            (this.element.style.top = -1 * r + 'px');
        }
      },
      render: function () {
        void 0 !== this._renderHeight &&
          this.graph.height !== this._renderHeight &&
          this.setSize({ auto: !0 }),
          (this.ticks =
            this.staticTicks ||
            Math.floor(this.graph.height / this.pixelsPerTick));
        var e = this._drawAxis(this.graph.y);
        this._drawGrid(e), (this._renderHeight = this.graph.height);
      },
      _drawAxis: function (t) {
        var i = e.svg.axis().scale(t).orient(this.orientation);
        if (
          (i.tickFormat(this.tickFormat),
          this.tickValues && i.tickValues(this.tickValues),
          'left' == this.orientation)
        )
          var n = this.height * this.berthRate,
            r = 'translate(' + this.width + ', ' + n + ')';
        return (
          this.element && this.vis.selectAll('*').remove(),
          this.vis
            .append('svg:g')
            .attr('class', ['y_ticks', this.ticksTreatment].join(' '))
            .attr('transform', r)
            .call(i.ticks(this.ticks).tickSubdivide(0).tickSize(this.tickSize)),
          i
        );
      },
      _drawGrid: function (e) {
        var t = ('right' == this.orientation ? 1 : -1) * this.graph.width;
        this.graph.vis
          .append('svg:g')
          .attr('class', 'y_grid')
          .call(e.ticks(this.ticks).tickSubdivide(0).tickSize(t))
          .selectAll('text')
          .each(function () {
            this.parentNode.setAttribute('data-y-value', this.textContent);
          });
      },
    })),
    t.namespace('Rickshaw.Graph.Axis.Y.Scaled'),
    (t.Graph.Axis.Y.Scaled = t.Class.create(t.Graph.Axis.Y, {
      initialize: function ($super, e) {
        if ('undefined' == typeof e.scale)
          throw new Error('Scaled requires scale');
        (this.scale = e.scale),
          (this.grid = 'undefined' == typeof e.grid ? !0 : e.grid),
          $super(e);
      },
      _drawAxis: function ($super, t) {
        var i = this.scale.domain(),
          n = this.graph.renderer.domain().y,
          r = [Math.min.apply(Math, i), Math.max.apply(Math, i)],
          s = e.scale.linear().domain([0, 1]).range(r),
          a = [s(n[0]), s(n[1])],
          h = e.scale.linear().domain(r).range(a),
          o = this.scale.copy().domain(i.map(h)).range(t.range());
        return $super(o);
      },
      _drawGrid: function ($super, e) {
        this.grid && $super(e);
      },
    })),
    t.namespace('Rickshaw.Graph.Behavior.Series.Highlight'),
    (t.Graph.Behavior.Series.Highlight = function (t) {
      (this.graph = t.graph), (this.legend = t.legend);
      var i = this,
        n = {},
        r = null,
        s =
          t.disabledColor ||
          function (t) {
            return e.interpolateRgb(t, e.rgb('#d8d8d8'))(0.8).toString();
          };
      (this.addHighlightEvents = function (e) {
        e.element.addEventListener(
          'mouseover',
          function () {
            r ||
              ((r = e),
              i.legend.lines.forEach(function (t) {
                if (e !== t)
                  (n[t.series.name] = n[t.series.name] || t.series.color),
                    (t.series.color = s(t.series.color));
                else if (
                  i.graph.renderer.unstack &&
                  (t.series.renderer ? t.series.renderer.unstack : !0)
                ) {
                  var r = i.graph.series.indexOf(t.series);
                  t.originalIndex = r;
                  var a = i.graph.series.splice(r, 1)[0];
                  i.graph.series.push(a);
                }
              }),
              i.graph.update());
          },
          !1
        ),
          e.element.addEventListener(
            'mouseout',
            function () {
              r &&
                ((r = null),
                i.legend.lines.forEach(function (t) {
                  if (e === t && t.hasOwnProperty('originalIndex')) {
                    var r = i.graph.series.pop();
                    i.graph.series.splice(t.originalIndex, 0, r),
                      delete t.originalIndex;
                  }
                  n[t.series.name] && (t.series.color = n[t.series.name]);
                }),
                i.graph.update());
            },
            !1
          );
      }),
        this.legend &&
          this.legend.lines.forEach(function (e) {
            i.addHighlightEvents(e);
          });
    }),
    t.namespace('Rickshaw.Graph.Behavior.Series.Order'),
    (t.Graph.Behavior.Series.Order = function (e) {
      (this.graph = e.graph), (this.legend = e.legend);
      var t = this;
      if ('undefined' == typeof window.jQuery)
        throw "couldn't find jQuery at window.jQuery";
      if ('undefined' == typeof window.jQuery.ui)
        throw "couldn't find jQuery UI at window.jQuery.ui";
      jQuery(function () {
        jQuery(t.legend.list).sortable({
          containment: 'parent',
          tolerance: 'pointer',
          update: function () {
            var e = [];
            jQuery(t.legend.list)
              .find('li')
              .each(function (t, i) {
                i.series && e.push(i.series);
              });
            for (var i = t.graph.series.length - 1; i >= 0; i--)
              t.graph.series[i] = e.shift();
            t.graph.update();
          },
        }),
          jQuery(t.legend.list).disableSelection();
      }),
        this.graph.onUpdate(function () {
          var e = window.getComputedStyle(t.legend.element).height;
          t.legend.element.style.height = e;
        });
    }),
    t.namespace('Rickshaw.Graph.Behavior.Series.Toggle'),
    (t.Graph.Behavior.Series.Toggle = function (e) {
      (this.graph = e.graph), (this.legend = e.legend);
      var t = this;
      if (
        ((this.addAnchor = function (e) {
          var i = document.createElement('a');
          (i.innerHTML = '&#10004;'),
            i.classList.add('action'),
            e.element.insertBefore(i, e.element.firstChild),
            (i.onclick = function () {
              if (e.series.disabled)
                e.series.enable(), e.element.classList.remove('disabled');
              else {
                if (
                  this.graph.series.filter(function (e) {
                    return !e.disabled;
                  }).length <= 1
                )
                  return;
                e.series.disable(), e.element.classList.add('disabled');
              }
              t.graph.update();
            }.bind(this));
          var n = e.element.getElementsByTagName('span')[0];
          n.onclick = function () {
            var i = e.series.disabled;
            if (!i)
              for (var n = 0; n < t.legend.lines.length; n++) {
                var r = t.legend.lines[n];
                if (e.series === r.series);
                else if (!r.series.disabled) {
                  i = !0;
                  break;
                }
              }
            i
              ? (e.series.enable(),
                e.element.classList.remove('disabled'),
                t.legend.lines.forEach(function (t) {
                  e.series === t.series ||
                    (t.series.disable(), t.element.classList.add('disabled'));
                }))
              : t.legend.lines.forEach(function (e) {
                  e.series.enable(), e.element.classList.remove('disabled');
                }),
              t.graph.update();
          };
        }),
        this.legend)
      ) {
        var i = jQuery;
        'undefined' != typeof i &&
          i(this.legend.list).sortable &&
          i(this.legend.list).sortable({
            start: function (e, t) {
              t.item.bind('no.onclick', function (e) {
                e.preventDefault();
              });
            },
            stop: function (e, t) {
              setTimeout(function () {
                t.item.unbind('no.onclick');
              }, 250);
            },
          }),
          this.legend.lines.forEach(function (e) {
            t.addAnchor(e);
          });
      }
      (this._addBehavior = function () {
        this.graph.series.forEach(function (e) {
          (e.disable = function () {
            if (t.graph.series.length <= 1) throw 'only one series left';
            e.disabled = !0;
          }),
            (e.enable = function () {
              e.disabled = !1;
            });
        });
      }),
        this._addBehavior(),
        (this.updateBehaviour = function () {
          this._addBehavior();
        });
    }),
    t.namespace('Rickshaw.Graph.HoverDetail'),
    (t.Graph.HoverDetail = t.Class.create({
      initialize: function (e) {
        var t = (this.graph = e.graph);
        (this.xFormatter =
          e.xFormatter ||
          function (e) {
            return new Date(1e3 * e).toUTCString();
          }),
          (this.yFormatter =
            e.yFormatter ||
            function (e) {
              return null === e ? e : e.toFixed(2);
            });
        var i = (this.element = document.createElement('div'));
        (i.className = 'detail'),
          (this.visible = !0),
          t.element.appendChild(i),
          (this.lastEvent = null),
          this._addListeners(),
          (this.onShow = e.onShow),
          (this.onHide = e.onHide),
          (this.onRender = e.onRender),
          (this.formatter = e.formatter || this.formatter);
      },
      formatter: function (e, t, i, n, r) {
        return e.name + ':&nbsp;' + r;
      },
      update: function (t) {
        if (
          ((t = t || this.lastEvent),
          t &&
            ((this.lastEvent = t),
            t.target.nodeName.match(/^(path|svg|rect|circle)$/)))
        ) {
          var i,
            n = this.graph,
            r = t.offsetX || t.layerX,
            s = t.offsetY || t.layerY,
            a = 0,
            h = [];
          if (
            (this.graph.series.active().forEach(function (t) {
              var o = this.graph.stackedData[a++];
              if (o.length) {
                var c = n.x.invert(r),
                  l = e.scale
                    .linear()
                    .domain([o[0].x, o.slice(-1)[0].x])
                    .range([0, o.length - 1]),
                  d = Math.round(l(c));
                d == o.length - 1 && d--;
                for (
                  var u = Math.min(d || 0, o.length - 1), f = d;
                  f < o.length - 1 && o[f] && o[f + 1];

                ) {
                  if (o[f].x <= c && o[f + 1].x > c) {
                    u =
                      Math.abs(c - o[f].x) < Math.abs(c - o[f + 1].x)
                        ? f
                        : f + 1;
                    break;
                  }
                  o[f + 1].x <= c ? f++ : f--;
                }
                0 > u && (u = 0);
                var p = o[u],
                  m = Math.sqrt(
                    Math.pow(Math.abs(n.x(p.x) - r), 2) +
                      Math.pow(Math.abs(n.y(p.y + p.y0) - s), 2)
                  ),
                  g = t.xFormatter || this.xFormatter,
                  v = t.yFormatter || this.yFormatter,
                  w = {
                    formattedXValue: g(p.x),
                    formattedYValue: v(t.scale ? t.scale.invert(p.y) : p.y),
                    series: t,
                    value: p,
                    distance: m,
                    order: a,
                    name: t.name,
                  };
                (!i || m < i.distance) && (i = w), h.push(w);
              }
            }, this),
            i)
          ) {
            i.active = !0;
            var o = i.value.x,
              c = i.formattedXValue;
            (this.element.innerHTML = ''),
              (this.element.style.left = n.x(o) + 'px'),
              this.visible &&
                this.render({
                  points: h,
                  detail: h,
                  mouseX: r,
                  mouseY: s,
                  formattedXValue: c,
                  domainX: o,
                });
          }
        }
      },
      hide: function () {
        (this.visible = !1),
          this.element.classList.add('inactive'),
          'function' == typeof this.onHide && this.onHide();
      },
      show: function () {
        (this.visible = !0),
          this.element.classList.remove('inactive'),
          'function' == typeof this.onShow && this.onShow();
      },
      render: function (e) {
        var t = this.graph,
          i = e.points,
          n = i
            .filter(function (e) {
              return e.active;
            })
            .shift();
        if (null !== n.value.y) {
          var r = n.formattedXValue,
            s = n.formattedYValue;
          (this.element.innerHTML = ''),
            (this.element.style.left = t.x(n.value.x) + 'px');
          var a = document.createElement('div');
          (a.className = 'x_label'),
            (a.innerHTML = r),
            this.element.appendChild(a);
          var h = document.createElement('div');
          h.className = 'item';
          var o = n.series,
            c = o.scale ? o.scale.invert(n.value.y) : n.value.y;
          (h.innerHTML = this.formatter(o, n.value.x, c, r, s, n)),
            (h.style.top = this.graph.y(n.value.y0 + n.value.y) + 'px'),
            this.element.appendChild(h);
          var l = document.createElement('div');
          (l.className = 'dot'),
            (l.style.top = h.style.top),
            (l.style.borderColor = o.color),
            this.element.appendChild(l),
            n.active && (h.classList.add('active'), l.classList.add('active'));
          var d = [a, h];
          d.forEach(function (e) {
            e.classList.add('left');
          }),
            this.show();
          var u = this._calcLayoutError(d);
          if (u > 0) {
            d.forEach(function (e) {
              e.classList.remove('left'), e.classList.add('right');
            });
            var f = this._calcLayoutError(d);
            f > u &&
              d.forEach(function (e) {
                e.classList.remove('right'), e.classList.add('left');
              });
          }
          'function' == typeof this.onRender && this.onRender(e);
        }
      },
      _calcLayoutError: function (e) {
        {
          var t = this.element.parentNode.getBoundingClientRect(),
            i = 0;
          e.forEach(function (e) {
            var n = e.getBoundingClientRect();
            n.width &&
              (n.right > t.right && (i += n.right - t.right),
              n.left < t.left && (i += t.left - n.left));
          });
        }
        return i;
      },
      _addListeners: function () {
        this.graph.element.addEventListener(
          'mousemove',
          function (e) {
            (this.visible = !0), this.update(e);
          }.bind(this),
          !1
        ),
          this.graph.onUpdate(
            function () {
              this.update();
            }.bind(this)
          ),
          this.graph.element.addEventListener(
            'mouseout',
            function (e) {
              !e.relatedTarget ||
                e.relatedTarget.compareDocumentPosition(this.graph.element) &
                  Node.DOCUMENT_POSITION_CONTAINS ||
                this.hide();
            }.bind(this),
            !1
          );
      },
    })),
    t.namespace('Rickshaw.Graph.JSONP'),
    (t.Graph.JSONP = t.Class.create(t.Graph.Ajax, {
      request: function () {
        jQuery.ajax({
          url: this.dataURL,
          dataType: 'jsonp',
          success: this.success.bind(this),
          error: this.error.bind(this),
        });
      },
    })),
    t.namespace('Rickshaw.Graph.Legend'),
    (t.Graph.Legend = t.Class.create({
      className: 'rickshaw_legend',
      initialize: function (e) {
        (this.element = e.element),
          (this.graph = e.graph),
          (this.naturalOrder = e.naturalOrder),
          this.element.classList.add(this.className),
          (this.list = document.createElement('ul')),
          this.element.appendChild(this.list),
          this.render(),
          this.graph.onUpdate(function () {});
      },
      render: function () {
        for (var e = this; this.list.firstChild; )
          this.list.removeChild(this.list.firstChild);
        this.lines = [];
        var t = this.graph.series.map(function (e) {
          return e;
        });
        this.naturalOrder || (t = t.reverse()),
          t.forEach(function (t) {
            e.addLine(t);
          });
      },
      addLine: function (t) {
        var i = document.createElement('li');
        (i.className = 'line'),
          t.disabled && (i.className += ' disabled'),
          t.className && e.select(i).classed(t.className, !0);
        var n = document.createElement('div');
        (n.className = 'swatch'),
          (n.style.backgroundColor = t.color),
          i.appendChild(n);
        var r = document.createElement('span');
        (r.className = 'label'),
          (r.innerHTML = t.name),
          i.appendChild(r),
          this.list.appendChild(i),
          (i.series = t),
          t.noLegend && (i.style.display = 'none');
        var s = { element: i, series: t };
        return (
          this.shelving &&
            (this.shelving.addAnchor(s), this.shelving.updateBehaviour()),
          this.highlighter && this.highlighter.addHighlightEvents(s),
          this.lines.push(s),
          i
        );
      },
    })),
    t.namespace('Rickshaw.Graph.RangeSlider'),
    (t.Graph.RangeSlider = t.Class.create({
      initialize: function (e) {
        var t = ((this.element = e.element), (this.graph = e.graph));
        (this.slideCallbacks = []),
          this.build(),
          t.onUpdate(
            function () {
              this.update();
            }.bind(this)
          );
      },
      build: function () {
        var e = this.element,
          t = this.graph,
          i = jQuery,
          n = t.dataDomain(),
          r = this;
        i(function () {
          i(e).slider({
            range: !0,
            min: n[0],
            max: n[1],
            values: [n[0], n[1]],
            slide: function (e, i) {
              if (!(i.values[1] <= i.values[0])) {
                (t.window.xMin = i.values[0]),
                  (t.window.xMax = i.values[1]),
                  t.update();
                var n = t.dataDomain();
                n[0] == i.values[0] && (t.window.xMin = void 0),
                  n[1] == i.values[1] && (t.window.xMax = void 0),
                  r.slideCallbacks.forEach(function (e) {
                    e(t, t.window.xMin, t.window.xMax);
                  });
              }
            },
          });
        }),
          (i(e)[0].style.width = t.width + 'px');
      },
      update: function () {
        var e = this.element,
          t = this.graph,
          i = jQuery,
          n = i(e).slider('option', 'values'),
          r = t.dataDomain();
        i(e).slider('option', 'min', r[0]),
          i(e).slider('option', 'max', r[1]),
          null == t.window.xMin && (n[0] = r[0]),
          null == t.window.xMax && (n[1] = r[1]),
          i(e).slider('option', 'values', n);
      },
      onSlide: function (e) {
        this.slideCallbacks.push(e);
      },
    })),
    t.namespace('Rickshaw.Graph.RangeSlider.Preview'),
    (t.Graph.RangeSlider.Preview = t.Class.create({
      initialize: function (t) {
        if (!t.element)
          throw 'Rickshaw.Graph.RangeSlider.Preview needs a reference to an element';
        if (!t.graph && !t.graphs)
          throw 'Rickshaw.Graph.RangeSlider.Preview needs a reference to an graph or an array of graphs';
        (this.element = t.element),
          (this.element.style.position = 'relative'),
          (this.graphs = t.graph ? [t.graph] : t.graphs),
          (this.defaults = {
            height: 75,
            width: 400,
            gripperColor: void 0,
            frameTopThickness: 3,
            frameHandleThickness: 10,
            frameColor: '#d4d4d4',
            frameOpacity: 1,
            minimumFrameWidth: 0,
            heightRatio: 0.2,
          }),
          (this.heightRatio = t.heightRatio || this.defaults.heightRatio),
          (this.defaults.gripperColor = e
            .rgb(this.defaults.frameColor)
            .darker()
            .toString()),
          (this.configureCallbacks = []),
          (this.slideCallbacks = []),
          (this.previews = []),
          t.width || (this.widthFromGraph = !0),
          t.height || (this.heightFromGraph = !0),
          (this.widthFromGraph || this.heightFromGraph) &&
            this.graphs[0].onConfigure(
              function () {
                this.configure(t), this.render();
              }.bind(this)
            ),
          (t.width = t.width || this.graphs[0].width || this.defaults.width),
          (t.height =
            t.height ||
            this.graphs[0].height * this.heightRatio ||
            this.defaults.height),
          this.configure(t),
          this.render();
      },
      onSlide: function (e) {
        this.slideCallbacks.push(e);
      },
      onConfigure: function (e) {
        this.configureCallbacks.push(e);
      },
      configure: function (e) {
        (this.config = this.config || {}),
          this.configureCallbacks.forEach(function (t) {
            t(e);
          }),
          t.keys(this.defaults).forEach(function (t) {
            this.config[t] =
              t in e
                ? e[t]
                : t in this.config
                  ? this.config[t]
                  : this.defaults[t];
          }, this),
          ('width' in e || 'height' in e) &&
            (this.widthFromGraph && (this.config.width = this.graphs[0].width),
            this.heightFromGraph &&
              ((this.config.height = this.graphs[0].height * this.heightRatio),
              (this.previewHeight = this.config.height)),
            this.previews.forEach(function (e) {
              var t =
                  this.previewHeight / this.graphs.length -
                  2 * this.config.frameTopThickness,
                i = this.config.width - 2 * this.config.frameHandleThickness;
              if ((e.setSize({ width: i, height: t }), this.svg)) {
                var n = t + 2 * this.config.frameHandleThickness,
                  r = i + 2 * this.config.frameHandleThickness;
                this.svg.style('width', r + 'px'),
                  this.svg.style('height', n + 'px');
              }
            }, this));
      },
      render: function () {
        var i = this;
        (this.svg = e
          .select(this.element)
          .selectAll('svg.rickshaw_range_slider_preview')
          .data([null])),
          (this.previewHeight =
            this.config.height - 2 * this.config.frameTopThickness),
          (this.previewWidth =
            this.config.width - 2 * this.config.frameHandleThickness),
          (this.currentFrame = [0, this.previewWidth]);
        var n = function (e) {
            var n = t.extend({}, e.config),
              r = i.previewHeight / i.graphs.length,
              s = e.renderer.name;
            t.extend(n, {
              element: this.appendChild(document.createElement('div')),
              height: r,
              width: i.previewWidth,
              series: e.series,
              renderer: s,
            });
            var a = new t.Graph(n);
            i.previews.push(a),
              e.onUpdate(function () {
                a.render(), i.render();
              }),
              e.onConfigure(function (e) {
                delete e.height,
                  (e.width = e.width - 2 * i.config.frameHandleThickness),
                  a.configure(e),
                  a.render();
              }),
              a.render();
          },
          r = e
            .select(this.element)
            .selectAll('div.rickshaw_range_slider_preview_container')
            .data(this.graphs),
          s =
            'translate(' +
            this.config.frameHandleThickness +
            'px, ' +
            this.config.frameTopThickness +
            'px)';
        r
          .enter()
          .append('div')
          .classed('rickshaw_range_slider_preview_container', !0)
          .style('-webkit-transform', s)
          .style('-moz-transform', s)
          .style('-ms-transform', s)
          .style('transform', s)
          .each(n),
          r.exit().remove();
        var a = this.graphs[0],
          h = e.scale
            .linear()
            .domain([0, this.previewWidth])
            .range(a.dataDomain()),
          o = [a.window.xMin, a.window.xMax];
        (this.currentFrame[0] =
          void 0 === o[0] ? 0 : Math.round(h.invert(o[0]))),
          this.currentFrame[0] < 0 && (this.currentFrame[0] = 0),
          (this.currentFrame[1] =
            void 0 === o[1] ? this.previewWidth : h.invert(o[1])),
          this.currentFrame[1] - this.currentFrame[0] <
            i.config.minimumFrameWidth &&
            (this.currentFrame[1] =
              (this.currentFrame[0] || 0) + i.config.minimumFrameWidth),
          this.svg
            .enter()
            .append('svg')
            .classed('rickshaw_range_slider_preview', !0)
            .style('height', this.config.height + 'px')
            .style('width', this.config.width + 'px')
            .style('position', 'absolute')
            .style('top', 0),
          this._renderDimming(),
          this._renderFrame(),
          this._renderGrippers(),
          this._renderHandles(),
          this._renderMiddle(),
          this._registerMouseEvents();
      },
      _renderDimming: function () {
        var e = this.svg.selectAll('path.dimming').data([null]);
        e.enter()
          .append('path')
          .attr('fill', 'white')
          .attr('fill-opacity', '0.7')
          .attr('fill-rule', 'evenodd')
          .classed('dimming', !0);
        var t = '';
        (t +=
          ' M ' +
          this.config.frameHandleThickness +
          ' ' +
          this.config.frameTopThickness),
          (t += ' h ' + this.previewWidth),
          (t += ' v ' + this.previewHeight),
          (t += ' h ' + -this.previewWidth),
          (t += ' z '),
          (t +=
            ' M ' +
            Math.max(this.currentFrame[0], this.config.frameHandleThickness) +
            ' ' +
            this.config.frameTopThickness),
          (t +=
            ' H ' +
            Math.min(
              this.currentFrame[1] + 2 * this.config.frameHandleThickness,
              this.previewWidth + this.config.frameHandleThickness
            )),
          (t += ' v ' + this.previewHeight),
          (t +=
            ' H ' +
            Math.max(this.currentFrame[0], this.config.frameHandleThickness)),
          (t += ' z'),
          e.attr('d', t);
      },
      _renderFrame: function () {
        var e = this.svg.selectAll('path.frame').data([null]);
        e.enter()
          .append('path')
          .attr('stroke', 'white')
          .attr('stroke-width', '1px')
          .attr('stroke-linejoin', 'round')
          .attr('fill', this.config.frameColor)
          .attr('fill-opacity', this.config.frameOpacity)
          .attr('fill-rule', 'evenodd')
          .classed('frame', !0);
        var t = '';
        (t += ' M ' + this.currentFrame[0] + ' 0'),
          (t +=
            ' H ' +
            (this.currentFrame[1] + 2 * this.config.frameHandleThickness)),
          (t += ' V ' + this.config.height),
          (t += ' H ' + this.currentFrame[0]),
          (t += ' z'),
          (t +=
            ' M ' +
            (this.currentFrame[0] + this.config.frameHandleThickness) +
            ' ' +
            this.config.frameTopThickness),
          (t +=
            ' H ' + (this.currentFrame[1] + this.config.frameHandleThickness)),
          (t += ' v ' + this.previewHeight),
          (t +=
            ' H ' + (this.currentFrame[0] + this.config.frameHandleThickness)),
          (t += ' z'),
          e.attr('d', t);
      },
      _renderGrippers: function () {
        var e = this.svg.selectAll('path.gripper').data([null]);
        e.enter()
          .append('path')
          .attr('stroke', this.config.gripperColor)
          .classed('gripper', !0);
        var t = '';
        [0.4, 0.6].forEach(
          function (e) {
            (t +=
              ' M ' +
              Math.round(
                this.currentFrame[0] + this.config.frameHandleThickness * e
              ) +
              ' ' +
              Math.round(0.3 * this.config.height)),
              (t += ' V ' + Math.round(0.7 * this.config.height)),
              (t +=
                ' M ' +
                Math.round(
                  this.currentFrame[1] +
                    this.config.frameHandleThickness * (1 + e)
                ) +
                ' ' +
                Math.round(0.3 * this.config.height)),
              (t += ' V ' + Math.round(0.7 * this.config.height));
          }.bind(this)
        ),
          e.attr('d', t);
      },
      _renderHandles: function () {
        var e = this.svg.selectAll('rect.left_handle').data([null]);
        e
          .enter()
          .append('rect')
          .attr('width', this.config.frameHandleThickness)
          .style('cursor', 'ew-resize')
          .style('fill-opacity', '0')
          .classed('left_handle', !0),
          e.attr('x', this.currentFrame[0]).attr('height', this.config.height);
        var t = this.svg.selectAll('rect.right_handle').data([null]);
        t
          .enter()
          .append('rect')
          .attr('width', this.config.frameHandleThickness)
          .style('cursor', 'ew-resize')
          .style('fill-opacity', '0')
          .classed('right_handle', !0),
          t
            .attr('x', this.currentFrame[1] + this.config.frameHandleThickness)
            .attr('height', this.config.height);
      },
      _renderMiddle: function () {
        var e = this.svg.selectAll('rect.middle_handle').data([null]);
        e
          .enter()
          .append('rect')
          .style('cursor', 'move')
          .style('fill-opacity', '0')
          .classed('middle_handle', !0),
          e
            .attr(
              'width',
              Math.max(0, this.currentFrame[1] - this.currentFrame[0])
            )
            .attr('x', this.currentFrame[0] + this.config.frameHandleThickness)
            .attr('height', this.config.height);
      },
      _registerMouseEvents: function () {
        function t() {
          o.stop = c._getClientXFromEvent(e.event, o);
          var t = o.stop - o.start,
            i = c.frameBeforeDrag.slice(0),
            n = c.config.minimumFrameWidth;
          o.rigid && (n = c.frameBeforeDrag[1] - c.frameBeforeDrag[0]),
            o.left && (i[0] = Math.max(i[0] + t, 0)),
            o.right && (i[1] = Math.min(i[1] + t, c.previewWidth));
          var r = i[1] - i[0];
          n >= r &&
            (o.left && (i[0] = i[1] - n),
            o.right && (i[1] = i[0] + n),
            i[0] <= 0 && ((i[1] -= i[0]), (i[0] = 0)),
            i[1] >= c.previewWidth &&
              ((i[0] -= i[1] - c.previewWidth), (i[1] = c.previewWidth))),
            c.graphs.forEach(function (t) {
              var n = e.scale
                  .linear()
                  .interpolate(e.interpolateNumber)
                  .domain([0, c.previewWidth])
                  .range(t.dataDomain()),
                r = [n(i[0]), n(i[1])];
              c.slideCallbacks.forEach(function (e) {
                e(t, r[0], r[1]);
              }),
                0 === i[0] && (r[0] = void 0),
                i[1] === c.previewWidth && (r[1] = void 0),
                (t.window.xMin = r[0]),
                (t.window.xMax = r[1]),
                t.update();
            });
        }
        function i() {
          (o.target = e.event.target),
            (o.start = c._getClientXFromEvent(e.event, o)),
            (c.frameBeforeDrag = c.currentFrame.slice()),
            e.event.preventDefault
              ? e.event.preventDefault()
              : (e.event.returnValue = !1),
            e.select(document).on('mousemove.rickshaw_range_slider_preview', t),
            e.select(document).on('mouseup.rickshaw_range_slider_preview', a),
            e.select(document).on('touchmove.rickshaw_range_slider_preview', t),
            e.select(document).on('touchend.rickshaw_range_slider_preview', a),
            e
              .select(document)
              .on('touchcancel.rickshaw_range_slider_preview', a);
        }
        function n() {
          (o.left = !0), i();
        }
        function r() {
          (o.right = !0), i();
        }
        function s() {
          (o.left = !0), (o.right = !0), (o.rigid = !0), i();
        }
        function a() {
          e
            .select(document)
            .on('mousemove.rickshaw_range_slider_preview', null),
            e
              .select(document)
              .on('mouseup.rickshaw_range_slider_preview', null),
            e
              .select(document)
              .on('touchmove.rickshaw_range_slider_preview', null),
            e
              .select(document)
              .on('touchend.rickshaw_range_slider_preview', null),
            e
              .select(document)
              .on('touchcancel.rickshaw_range_slider_preview', null),
            delete c.frameBeforeDrag,
            (o.left = !1),
            (o.right = !1),
            (o.rigid = !1);
        }
        var h = e.select(this.element),
          o = {
            target: null,
            start: null,
            stop: null,
            left: !1,
            right: !1,
            rigid: !1,
          },
          c = this;
        h.select('rect.left_handle').on('mousedown', n),
          h.select('rect.right_handle').on('mousedown', r),
          h.select('rect.middle_handle').on('mousedown', s),
          h.select('rect.left_handle').on('touchstart', n),
          h.select('rect.right_handle').on('touchstart', r),
          h.select('rect.middle_handle').on('touchstart', s);
      },
      _getClientXFromEvent: function (e, t) {
        switch (e.type) {
          case 'touchstart':
          case 'touchmove':
            for (var i = e.changedTouches, n = null, r = 0; r < i.length; r++)
              if (i[r].target === t.target) {
                n = i[r];
                break;
              }
            return null !== n ? n.clientX : void 0;
          default:
            return e.clientX;
        }
      },
    })),
    t.namespace('Rickshaw.Graph.Renderer'),
    (t.Graph.Renderer = t.Class.create({
      initialize: function (e) {
        (this.graph = e.graph),
          (this.tension = e.tension || this.tension),
          this.configure(e);
      },
      seriesPathFactory: function () {},
      seriesStrokeFactory: function () {},
      defaults: function () {
        return {
          tension: 0.8,
          strokeWidth: 2,
          unstack: !0,
          padding: { top: 0.01, right: 0, bottom: 0.01, left: 0 },
          stroke: !1,
          fill: !1,
        };
      },
      domain: function (e) {
        var t = e || this.graph.stackedData || this.graph.stackData(),
          i = +1 / 0,
          n = -1 / 0,
          r = +1 / 0,
          s = -1 / 0;
        return (
          t.forEach(function (e) {
            e.forEach(function (e) {
              if (null != e.y) {
                var t = e.y + e.y0;
                r > t && (r = t), t > s && (s = t);
              }
            }),
              e.length &&
                (e[0].x < i && (i = e[0].x),
                e[e.length - 1].x > n && (n = e[e.length - 1].x));
          }),
          (i -= (n - i) * this.padding.left),
          (n += (n - i) * this.padding.right),
          (r = 'auto' === this.graph.min ? r : this.graph.min || 0),
          (s = void 0 === this.graph.max ? s : this.graph.max),
          ('auto' === this.graph.min || 0 > r) &&
            (r -= (s - r) * this.padding.bottom),
          void 0 === this.graph.max && (s += (s - r) * this.padding.top),
          { x: [i, n], y: [r, s] }
        );
      },
      render: function (e) {
        e = e || {};
        var t = this.graph,
          i = e.series || t.series,
          n = e.vis || t.vis;
        n.selectAll('*').remove();
        var r = i
            .filter(function (e) {
              return !e.disabled;
            })
            .map(function (e) {
              return e.stack;
            }),
          s = n
            .selectAll('path.path')
            .data(r)
            .enter()
            .append('svg:path')
            .classed('path', !0)
            .attr('d', this.seriesPathFactory());
        if (this.stroke)
          var a = n
            .selectAll('path.stroke')
            .data(r)
            .enter()
            .append('svg:path')
            .classed('stroke', !0)
            .attr('d', this.seriesStrokeFactory());
        var h = 0;
        i.forEach(function (e) {
          e.disabled ||
            ((e.path = s[0][h]),
            this.stroke && (e.stroke = a[0][h]),
            this._styleSeries(e),
            h++);
        }, this);
      },
      _styleSeries: function (t) {
        var i = this.fill ? t.color : 'none',
          n = this.stroke ? t.color : 'none';
        t.path.setAttribute('fill', i),
          t.path.setAttribute('stroke', n),
          t.path.setAttribute('stroke-width', this.strokeWidth),
          t.className && e.select(t.path).classed(t.className, !0),
          t.className &&
            this.stroke &&
            e.select(t.stroke).classed(t.className, !0);
      },
      configure: function (e) {
        (e = e || {}),
          t.keys(this.defaults()).forEach(function (i) {
            return e.hasOwnProperty(i)
              ? void ('object' == typeof this.defaults()[i]
                  ? t.keys(this.defaults()[i]).forEach(function (t) {
                      this[i][t] =
                        void 0 !== e[i][t]
                          ? e[i][t]
                          : void 0 !== this[i][t]
                            ? this[i][t]
                            : this.defaults()[i][t];
                    }, this)
                  : (this[i] =
                      void 0 !== e[i]
                        ? e[i]
                        : void 0 !== this[i]
                          ? this[i]
                          : void 0 !== this.graph[i]
                            ? this.graph[i]
                            : this.defaults()[i]))
              : void (this[i] = this[i] || this.graph[i] || this.defaults()[i]);
          }, this);
      },
      setStrokeWidth: function (e) {
        void 0 !== e && (this.strokeWidth = e);
      },
      setTension: function (e) {
        void 0 !== e && (this.tension = e);
      },
    })),
    t.namespace('Rickshaw.Graph.Renderer.Line'),
    (t.Graph.Renderer.Line = t.Class.create(t.Graph.Renderer, {
      name: 'line',
      defaults: function ($super) {
        return t.extend($super(), { unstack: !0, fill: !1, stroke: !0 });
      },
      seriesPathFactory: function () {
        var t = this.graph,
          i = e.svg
            .line()
            .x(function (e) {
              return t.x(e.x);
            })
            .y(function (e) {
              return t.y(e.y);
            })
            .interpolate(this.graph.interpolation)
            .tension(this.tension);
        return (
          i.defined &&
            i.defined(function (e) {
              return null !== e.y;
            }),
          i
        );
      },
    })),
    t.namespace('Rickshaw.Graph.Renderer.Stack'),
    (t.Graph.Renderer.Stack = t.Class.create(t.Graph.Renderer, {
      name: 'stack',
      defaults: function ($super) {
        return t.extend($super(), { fill: !0, stroke: !1, unstack: !1 });
      },
      seriesPathFactory: function () {
        var t = this.graph,
          i = e.svg
            .area()
            .x(function (e) {
              return t.x(e.x);
            })
            .y0(function (e) {
              return t.y(e.y0);
            })
            .y1(function (e) {
              return t.y(e.y + e.y0);
            })
            .interpolate(this.graph.interpolation)
            .tension(this.tension);
        return (
          i.defined &&
            i.defined(function (e) {
              return null !== e.y;
            }),
          i
        );
      },
    })),
    t.namespace('Rickshaw.Graph.Renderer.Bar'),
    (t.Graph.Renderer.Bar = t.Class.create(t.Graph.Renderer, {
      name: 'bar',
      defaults: function ($super) {
        var e = t.extend($super(), { gapSize: 0.05, unstack: !1 });
        return delete e.tension, e;
      },
      initialize: function ($super, e) {
        (e = e || {}), (this.gapSize = e.gapSize || this.gapSize), $super(e);
      },
      domain: function ($super) {
        var e = $super(),
          t = this._frequentInterval(this.graph.stackedData.slice(-1).shift());
        return (e.x[1] += Number(t.magnitude)), e;
      },
      barWidth: function (e) {
        var t = this._frequentInterval(e.stack),
          i = this.graph.x.magnitude(t.magnitude) * (1 - this.gapSize);
        return i;
      },
      render: function (e) {
        e = e || {};
        var t = this.graph,
          i = e.series || t.series,
          n = e.vis || t.vis;
        n.selectAll('*').remove();
        var r = this.barWidth(i.active()[0]),
          s = 0,
          a = i.filter(function (e) {
            return !e.disabled;
          }).length,
          h = this.unstack ? r / a : r,
          o = function (e) {
            var i = [
              1,
              0,
              0,
              e.y < 0 ? -1 : 1,
              0,
              e.y < 0 ? 2 * t.y.magnitude(Math.abs(e.y)) : 0,
            ];
            return 'matrix(' + i.join(',') + ')';
          };
        i.forEach(function (e) {
          if (!e.disabled) {
            var i =
              (this.barWidth(e),
              n
                .selectAll('path')
                .data(
                  e.stack.filter(function (e) {
                    return null !== e.y;
                  })
                )
                .enter()
                .append('svg:rect')
                .attr('x', function (e) {
                  return t.x(e.x) + s;
                })
                .attr('y', function (e) {
                  return t.y(e.y0 + Math.abs(e.y)) * (e.y < 0 ? -1 : 1);
                })
                .attr('width', h)
                .attr('height', function (e) {
                  return t.y.magnitude(Math.abs(e.y));
                })
                .attr('transform', o));
            Array.prototype.forEach.call(i[0], function (t) {
              t.setAttribute('fill', e.color);
            }),
              this.unstack && (s += h);
          }
        }, this);
      },
      _frequentInterval: function (e) {
        for (var i = {}, n = 0; n < e.length - 1; n++) {
          var r = e[n + 1].x - e[n].x;
          (i[r] = i[r] || 0), i[r]++;
        }
        var s = { count: 0, magnitude: 1 };
        return (
          t.keys(i).forEach(function (e) {
            s.count < i[e] && (s = { count: i[e], magnitude: e });
          }),
          s
        );
      },
    })),
    t.namespace('Rickshaw.Graph.Renderer.Area'),
    (t.Graph.Renderer.Area = t.Class.create(t.Graph.Renderer, {
      name: 'area',
      defaults: function ($super) {
        return t.extend($super(), { unstack: !1, fill: !1, stroke: !1 });
      },
      seriesPathFactory: function () {
        var t = this.graph,
          i = e.svg
            .area()
            .x(function (e) {
              return t.x(e.x);
            })
            .y0(function (e) {
              return t.y(e.y0);
            })
            .y1(function (e) {
              return t.y(e.y + e.y0);
            })
            .interpolate(t.interpolation)
            .tension(this.tension);
        return (
          i.defined &&
            i.defined(function (e) {
              return null !== e.y;
            }),
          i
        );
      },
      seriesStrokeFactory: function () {
        var t = this.graph,
          i = e.svg
            .line()
            .x(function (e) {
              return t.x(e.x);
            })
            .y(function (e) {
              return t.y(e.y + e.y0);
            })
            .interpolate(t.interpolation)
            .tension(this.tension);
        return (
          i.defined &&
            i.defined(function (e) {
              return null !== e.y;
            }),
          i
        );
      },
      render: function (e) {
        e = e || {};
        var t = this.graph,
          i = e.series || t.series,
          n = e.vis || t.vis;
        n.selectAll('*').remove();
        var r = this.unstack ? 'append' : 'insert',
          s = i
            .filter(function (e) {
              return !e.disabled;
            })
            .map(function (e) {
              return e.stack;
            }),
          a = n.selectAll('path').data(s).enter()[r]('svg:g', 'g');
        a
          .append('svg:path')
          .attr('d', this.seriesPathFactory())
          .attr('class', 'area'),
          this.stroke &&
            a
              .append('svg:path')
              .attr('d', this.seriesStrokeFactory())
              .attr('class', 'line');
        var h = 0;
        i.forEach(function (e) {
          e.disabled || ((e.path = a[0][h++]), this._styleSeries(e));
        }, this);
      },
      _styleSeries: function (t) {
        t.path &&
          (e.select(t.path).select('.area').attr('fill', t.color),
          this.stroke &&
            e
              .select(t.path)
              .select('.line')
              .attr('fill', 'none')
              .attr(
                'stroke',
                t.stroke || e.interpolateRgb(t.color, 'black')(0.125)
              )
              .attr('stroke-width', this.strokeWidth),
          t.className && t.path.setAttribute('class', t.className));
      },
    })),
    t.namespace('Rickshaw.Graph.Renderer.ScatterPlot'),
    (t.Graph.Renderer.ScatterPlot = t.Class.create(t.Graph.Renderer, {
      name: 'scatterplot',
      defaults: function ($super) {
        return t.extend($super(), {
          unstack: !0,
          fill: !0,
          stroke: !1,
          padding: { top: 0.01, right: 0.01, bottom: 0.01, left: 0.01 },
          dotSize: 4,
        });
      },
      initialize: function ($super, e) {
        $super(e);
      },
      render: function (e) {
        e = e || {};
        var t = this.graph,
          i = e.series || t.series,
          n = e.vis || t.vis,
          r = this.dotSize;
        n.selectAll('*').remove(),
          i.forEach(function (e) {
            if (!e.disabled) {
              var i = n
                .selectAll('path')
                .data(
                  e.stack.filter(function (e) {
                    return null !== e.y;
                  })
                )
                .enter()
                .append('svg:circle')
                .attr('cx', function (e) {
                  return t.x(e.x);
                })
                .attr('cy', function (e) {
                  return t.y(e.y);
                })
                .attr('r', function (e) {
                  return 'r' in e ? e.r : r;
                });
              e.className && i.classed(e.className, !0),
                Array.prototype.forEach.call(i[0], function (t) {
                  t.setAttribute('fill', e.color);
                });
            }
          }, this);
      },
    })),
    t.namespace('Rickshaw.Graph.Renderer.Multi'),
    (t.Graph.Renderer.Multi = t.Class.create(t.Graph.Renderer, {
      name: 'multi',
      initialize: function ($super, e) {
        $super(e);
      },
      defaults: function ($super) {
        return t.extend($super(), { unstack: !0, fill: !1, stroke: !0 });
      },
      configure: function ($super, e) {
        (e = e || {}), (this.config = e), $super(e);
      },
      domain: function ($super) {
        this.graph.stackData();
        var t = [],
          i = this._groups();
        this._stack(i),
          i.forEach(function (e) {
            var i = e.series
              .filter(function (e) {
                return !e.disabled;
              })
              .map(function (e) {
                return e.stack;
              });
            if (i.length) {
              var n = null;
              (n =
                e.renderer && e.renderer.domain
                  ? e.renderer.domain(i)
                  : $super(i)),
                t.push(n);
            }
          });
        var n = e.min(
            t.map(function (e) {
              return e.x[0];
            })
          ),
          r = e.max(
            t.map(function (e) {
              return e.x[1];
            })
          ),
          s = e.min(
            t.map(function (e) {
              return e.y[0];
            })
          ),
          a = e.max(
            t.map(function (e) {
              return e.y[1];
            })
          );
        return { x: [n, r], y: [s, a] };
      },
      _groups: function () {
        var i = this.graph,
          n = {};
        i.series.forEach(function (r) {
          if (!r.disabled) {
            if (!n[r.renderer]) {
              var s = 'http://www.w3.org/2000/svg',
                a = document.createElementNS(s, 'g');
              i.vis[0][0].appendChild(a);
              var h = i._renderers[r.renderer],
                o = {},
                c = [this.defaults(), h.defaults(), this.config, this.graph];
              c.forEach(function (e) {
                t.extend(o, e);
              }),
                h.configure(o),
                (n[r.renderer] = { renderer: h, series: [], vis: e.select(a) });
            }
            n[r.renderer].series.push(r);
          }
        }, this);
        var r = [];
        return (
          Object.keys(n).forEach(function (e) {
            var t = n[e];
            r.push(t);
          }),
          r
        );
      },
      _stack: function (i) {
        return (
          i.forEach(function (i) {
            var n = i.series.filter(function (e) {
                return !e.disabled;
              }),
              r = n.map(function (e) {
                return e.stack;
              });
            if (!i.renderer.unstack) {
              var s = e.layout.stack(),
                a = t.clone(s(r));
              n.forEach(function (e, i) {
                e._stack = t.clone(a[i]);
              });
            }
          }, this),
          i
        );
      },
      render: function () {
        this.graph.series.forEach(function (e) {
          if (!e.renderer)
            throw new Error(
              "Each series needs a renderer for graph 'multi' renderer"
            );
        }),
          this.graph.vis.selectAll('*').remove();
        var e = this._groups();
        (e = this._stack(e)),
          e.forEach(function (e) {
            var t = e.series.filter(function (e) {
              return !e.disabled;
            });
            (t.active = function () {
              return t;
            }),
              e.renderer.render({ series: t, vis: e.vis }),
              t.forEach(function (e) {
                e.stack = e._stack || e.stack || e.data;
              });
          });
      },
    })),
    t.namespace('Rickshaw.Graph.Renderer.LinePlot'),
    (t.Graph.Renderer.LinePlot = t.Class.create(t.Graph.Renderer, {
      name: 'lineplot',
      defaults: function ($super) {
        return t.extend($super(), {
          unstack: !0,
          fill: !1,
          stroke: !0,
          padding: { top: 0.01, right: 0.01, bottom: 0.01, left: 0.01 },
          dotSize: 3,
          strokeWidth: 2,
        });
      },
      seriesPathFactory: function () {
        var t = this.graph,
          i = e.svg
            .line()
            .x(function (e) {
              return t.x(e.x);
            })
            .y(function (e) {
              return t.y(e.y);
            })
            .interpolate(this.graph.interpolation)
            .tension(this.tension);
        return (
          i.defined &&
            i.defined(function (e) {
              return null !== e.y;
            }),
          i
        );
      },
      render: function (e) {
        e = e || {};
        var t = this.graph,
          i = e.series || t.series,
          n = e.vis || t.vis,
          r = this.dotSize;
        n.selectAll('*').remove();
        var s = i
            .filter(function (e) {
              return !e.disabled;
            })
            .map(function (e) {
              return e.stack;
            }),
          a = n
            .selectAll('path')
            .data(s)
            .enter()
            .append('svg:path')
            .attr('d', this.seriesPathFactory()),
          h = 0;
        i.forEach(function (e) {
          e.disabled || ((e.path = a[0][h++]), this._styleSeries(e));
        }, this),
          i.forEach(function (e) {
            if (!e.disabled) {
              var i = n
                .selectAll('x')
                .data(
                  e.stack.filter(function (e) {
                    return null !== e.y;
                  })
                )
                .enter()
                .append('svg:circle')
                .attr('cx', function (e) {
                  return t.x(e.x);
                })
                .attr('cy', function (e) {
                  return t.y(e.y);
                })
                .attr('r', function (e) {
                  return 'r' in e ? e.r : r;
                });
              Array.prototype.forEach.call(
                i[0],
                function (t) {
                  t &&
                    (t.setAttribute('data-color', e.color),
                    t.setAttribute('fill', 'white'),
                    t.setAttribute('stroke', e.color),
                    t.setAttribute('stroke-width', this.strokeWidth));
                }.bind(this)
              );
            }
          }, this);
      },
    })),
    t.namespace('Rickshaw.Graph.Smoother'),
    (t.Graph.Smoother = t.Class.create({
      initialize: function (e) {
        (this.graph = e.graph),
          (this.element = e.element),
          (this.aggregationScale = 1),
          this.build(),
          this.graph.stackData.hooks.data.push({
            name: 'smoother',
            orderPosition: 50,
            f: this.transformer.bind(this),
          });
      },
      build: function () {
        var e = this,
          t = jQuery;
        this.element &&
          t(function () {
            t(e.element).slider({
              min: 1,
              max: 100,
              slide: function (t, i) {
                e.setScale(i.value);
              },
            });
          });
      },
      setScale: function (e) {
        if (1 > e) throw 'scale out of range: ' + e;
        (this.aggregationScale = e), this.graph.update();
      },
      transformer: function (e) {
        if (1 == this.aggregationScale) return e;
        var t = [];
        return (
          e.forEach(
            function (e) {
              for (var i = []; e.length; ) {
                var n = 0,
                  r = 0,
                  s = e.splice(0, this.aggregationScale);
                s.forEach(function (e) {
                  (n += e.x / s.length), (r += e.y / s.length);
                }),
                  i.push({ x: n, y: r });
              }
              t.push(i);
            }.bind(this)
          ),
          t
        );
      },
    })),
    t.namespace('Rickshaw.Graph.Socketio'),
    (t.Graph.Socketio = t.Class.create(t.Graph.Ajax, {
      request: function () {
        var e = io.connect(this.dataURL),
          t = this;
        e.on('rickshaw', function (e) {
          t.success(e);
        });
      },
    })),
    t.namespace('Rickshaw.Series'),
    (t.Series = t.Class.create(Array, {
      initialize: function (e, i, n) {
        (n = n || {}),
          (this.palette = new t.Color.Palette(i)),
          (this.timeBase =
            'undefined' == typeof n.timeBase
              ? Math.floor(new Date().getTime() / 1e3)
              : n.timeBase);
        var r = 'undefined' == typeof n.timeInterval ? 1e3 : n.timeInterval;
        this.setTimeInterval(r),
          e &&
            'object' == typeof e &&
            Array.isArray(e) &&
            e.forEach(function (e) {
              this.addItem(e);
            }, this);
      },
      addItem: function (e) {
        if ('undefined' == typeof e.name) throw 'addItem() needs a name';
        (e.color = e.color || this.palette.color(e.name)),
          (e.data = e.data || []),
          0 === e.data.length && this.length && this.getIndex() > 0
            ? this[0].data.forEach(function (t) {
                e.data.push({ x: t.x, y: 0 });
              })
            : 0 === e.data.length &&
              e.data.push({
                x: this.timeBase - (this.timeInterval || 0),
                y: 0,
              }),
          this.push(e),
          this.legend && this.legend.addLine(this.itemByName(e.name));
      },
      addData: function (e, i) {
        var n = this.getIndex();
        t.keys(e).forEach(function (e) {
          this.itemByName(e) || this.addItem({ name: e });
        }, this),
          this.forEach(function (t) {
            t.data.push({
              x: i || (n * this.timeInterval || 1) + this.timeBase,
              y: e[t.name] || 0,
            });
          }, this);
      },
      getIndex: function () {
        return this[0] && this[0].data && this[0].data.length
          ? this[0].data.length
          : 0;
      },
      itemByName: function (e) {
        for (var t = 0; t < this.length; t++)
          if (this[t].name == e) return this[t];
      },
      setTimeInterval: function (e) {
        this.timeInterval = e / 1e3;
      },
      setTimeBase: function (e) {
        this.timeBase = e;
      },
      dump: function () {
        var e = {
          timeBase: this.timeBase,
          timeInterval: this.timeInterval,
          items: [],
        };
        return (
          this.forEach(function (t) {
            var i = { color: t.color, name: t.name, data: [] };
            t.data.forEach(function (e) {
              i.data.push({ x: e.x, y: e.y });
            }),
              e.items.push(i);
          }),
          e
        );
      },
      load: function (e) {
        e.timeInterval && (this.timeInterval = e.timeInterval),
          e.timeBase && (this.timeBase = e.timeBase),
          e.items &&
            e.items.forEach(function (e) {
              this.push(e),
                this.legend && this.legend.addLine(this.itemByName(e.name));
            }, this);
      },
    })),
    (t.Series.zeroFill = function (e) {
      t.Series.fill(e, 0);
    }),
    (t.Series.fill = function (e, t) {
      for (
        var i,
          n = 0,
          r = e.map(function (e) {
            return e.data;
          });
        n <
        Math.max.apply(
          null,
          r.map(function (e) {
            return e.length;
          })
        );

      )
        (i = Math.min.apply(
          null,
          r
            .filter(function (e) {
              return e[n];
            })
            .map(function (e) {
              return e[n].x;
            })
        )),
          r.forEach(function (e) {
            (e[n] && e[n].x == i) || e.splice(n, 0, { x: i, y: t });
          }),
          n++;
    }),
    t.namespace('Rickshaw.Series.FixedDuration'),
    (t.Series.FixedDuration = t.Class.create(t.Series, {
      initialize: function (e, i, n) {
        if (((n = n || {}), 'undefined' == typeof n.timeInterval))
          throw new Error('FixedDuration series requires timeInterval');
        if ('undefined' == typeof n.maxDataPoints)
          throw new Error('FixedDuration series requires maxDataPoints');
        if (
          ((this.palette = new t.Color.Palette(i)),
          (this.timeBase =
            'undefined' == typeof n.timeBase
              ? Math.floor(new Date().getTime() / 1e3)
              : n.timeBase),
          this.setTimeInterval(n.timeInterval),
          this[0] && this[0].data && this[0].data.length
            ? ((this.currentSize = this[0].data.length),
              (this.currentIndex = this[0].data.length))
            : ((this.currentSize = 0), (this.currentIndex = 0)),
          (this.maxDataPoints = n.maxDataPoints),
          e &&
            'object' == typeof e &&
            Array.isArray(e) &&
            (e.forEach(function (e) {
              this.addItem(e);
            }, this),
            (this.currentSize += 1),
            (this.currentIndex += 1)),
          (this.timeBase -=
            (this.maxDataPoints - this.currentSize) * this.timeInterval),
          'undefined' != typeof this.maxDataPoints &&
            this.currentSize < this.maxDataPoints)
        )
          for (var r = this.maxDataPoints - this.currentSize - 1; r > 1; r--)
            (this.currentSize += 1),
              (this.currentIndex += 1),
              this.forEach(function (e) {
                e.data.unshift({
                  x: ((r - 1) * this.timeInterval || 1) + this.timeBase,
                  y: 0,
                  i: r,
                });
              }, this);
      },
      addData: function ($super, e, t) {
        if (
          ($super(e, t),
          (this.currentSize += 1),
          (this.currentIndex += 1),
          void 0 !== this.maxDataPoints)
        )
          for (; this.currentSize > this.maxDataPoints; ) this.dropData();
      },
      dropData: function () {
        this.forEach(function (e) {
          e.data.splice(0, 1);
        }),
          (this.currentSize -= 1);
      },
      getIndex: function () {
        return this.currentIndex;
      },
    })),
    t
  );
});
