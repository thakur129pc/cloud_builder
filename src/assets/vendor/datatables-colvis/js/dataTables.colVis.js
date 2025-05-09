!(function (t, n, s) {
  var o = function (t) {
    'use strict';
    var o = function (n, s) {
      return (
        (this.CLASS && 'ColVis' == this.CLASS) ||
          alert("Warning: ColVis must be initialised with the keyword 'new'"),
        'undefined' == typeof s && (s = {}),
        t.fn.dataTable.camelToHungarian &&
          t.fn.dataTable.camelToHungarian(o.defaults, s),
        (this.s = { dt: null, oInit: s, hidden: !0, abOriginal: [] }),
        (this.dom = {
          wrapper: null,
          button: null,
          collection: null,
          background: null,
          catcher: null,
          buttons: [],
          groupButtons: [],
          restore: null,
        }),
        o.aInstances.push(this),
        (this.s.dt = t.fn.dataTable.Api
          ? new t.fn.dataTable.Api(n).settings()[0]
          : n),
        this._fnConstruct(s),
        this
      );
    };
    return (
      (o.prototype = {
        button: function () {
          return this.dom.wrapper;
        },
        fnRebuild: function () {
          this.rebuild();
        },
        rebuild: function () {
          for (var t = this.dom.buttons.length - 1; t >= 0; t--)
            this.dom.collection.removeChild(this.dom.buttons[t]);
          this.dom.buttons.splice(0, this.dom.buttons.length),
            this.dom.restore && this.dom.restore.parentNode(this.dom.restore),
            this._fnAddGroups(),
            this._fnAddButtons(),
            this._fnDrawCallback();
        },
        _fnConstruct: function (s) {
          this._fnApplyCustomisation(s);
          var o,
            i,
            e = this;
          for (
            this.dom.wrapper = n.createElement('div'),
              this.dom.wrapper.className = 'ColVis',
              this.dom.button = t('<button />', {
                class: this.s.dt.bJUI
                  ? 'ColVis_Button ColVis_MasterButton ui-button ui-state-default'
                  : 'ColVis_Button ColVis_MasterButton',
              })
                .append('<span>' + this.s.buttonText + '</span>')
                .bind(
                  'mouseover' == this.s.activate ? 'mouseover' : 'click',
                  function (t) {
                    t.preventDefault(), e._fnCollectionShow();
                  }
                )
                .appendTo(this.dom.wrapper)[0],
              this.dom.catcher = this._fnDomCatcher(),
              this.dom.collection = this._fnDomCollection(),
              this.dom.background = this._fnDomBackground(),
              this._fnAddGroups(),
              this._fnAddButtons(),
              o = 0,
              i = this.s.dt.aoColumns.length;
            i > o;
            o++
          )
            this.s.abOriginal.push(this.s.dt.aoColumns[o].bVisible);
          this.s.dt.aoDrawCallback.push({
            fn: function () {
              e._fnDrawCallback.call(e);
            },
            sName: 'ColVis',
          }),
            t(this.s.dt.oInstance).bind('column-reorder', function (t, n, s) {
              for (o = 0, i = e.s.aiExclude.length; i > o; o++)
                e.s.aiExclude[o] = s.aiInvertMapping[e.s.aiExclude[o]];
              var l = e.s.abOriginal.splice(s.iFrom, 1)[0];
              e.s.abOriginal.splice(s.iTo, 0, l), e.fnRebuild();
            }),
            this._fnDrawCallback();
        },
        _fnApplyCustomisation: function (n) {
          t.extend(!0, this.s, o.defaults, n),
            !this.s.showAll &&
              this.s.bShowAll &&
              (this.s.showAll = this.s.sShowAll),
            !this.s.restore &&
              this.s.bRestore &&
              (this.s.restore = this.s.sRestore);
          var s = this.s.groups,
            i = this.s.aoGroups;
          if (s)
            for (var e = 0, l = s.length; l > e; e++)
              s[e].title && (i[e].sTitle = s[e].title),
                s[e].columns && (i[e].aiColumns = s[e].columns);
        },
        _fnDrawCallback: function () {
          for (
            var n,
              o = this.s.dt.aoColumns,
              i = this.dom.buttons,
              e = this.s.aoGroups,
              l = 0,
              a = i.length;
            a > l;
            l++
          )
            (n = i[l]),
              n.__columnIdx !== s &&
                t('input', n).prop('checked', o[n.__columnIdx].bVisible);
          for (
            var u = function (t) {
                for (var n = 0, s = t.length; s > n; n++)
                  if (o[t[n]].bVisible === !1) return !1;
                return !0;
              },
              r = function (t) {
                for (var n = 0, s = t.length; s > n; n++)
                  if (o[t[n]].bVisible === !0) return !1;
                return !0;
              },
              d = 0,
              h = e.length;
            h > d;
            d++
          )
            u(e[d].aiColumns)
              ? (t('input', this.dom.groupButtons[d]).prop('checked', !0),
                t('input', this.dom.groupButtons[d]).prop('indeterminate', !1))
              : r(e[d].aiColumns)
                ? (t('input', this.dom.groupButtons[d]).prop('checked', !1),
                  t('input', this.dom.groupButtons[d]).prop(
                    'indeterminate',
                    !1
                  ))
                : t('input', this.dom.groupButtons[d]).prop(
                    'indeterminate',
                    !0
                  );
        },
        _fnAddGroups: function () {
          var t;
          if ('undefined' != typeof this.s.aoGroups)
            for (var n = 0, s = this.s.aoGroups.length; s > n; n++)
              (t = this._fnDomGroupButton(n)),
                this.dom.groupButtons.push(t),
                this.dom.buttons.push(t),
                this.dom.collection.appendChild(t);
        },
        _fnAddButtons: function () {
          var n,
            s = this.s.dt.aoColumns;
          if (-1 === t.inArray('all', this.s.aiExclude))
            for (var o = 0, i = s.length; i > o; o++)
              -1 === t.inArray(o, this.s.aiExclude) &&
                ((n = this._fnDomColumnButton(o)),
                (n.__columnIdx = o),
                this.dom.buttons.push(n));
          'alpha' === this.s.order &&
            this.dom.buttons.sort(function (t, n) {
              var o = s[t.__columnIdx].sTitle,
                i = s[n.__columnIdx].sTitle;
              return o === i ? 0 : i > o ? -1 : 1;
            }),
            this.s.restore &&
              ((n = this._fnDomRestoreButton()),
              (n.className += ' ColVis_Restore'),
              this.dom.buttons.push(n)),
            this.s.showAll &&
              ((n = this._fnDomShowXButton(this.s.showAll, !0)),
              (n.className += ' ColVis_ShowAll'),
              this.dom.buttons.push(n)),
            this.s.showNone &&
              ((n = this._fnDomShowXButton(this.s.showNone, !1)),
              (n.className += ' ColVis_ShowNone'),
              this.dom.buttons.push(n)),
            t(this.dom.collection).append(this.dom.buttons);
        },
        _fnDomRestoreButton: function () {
          var n = this,
            s = this.s.dt;
          return t(
            '<li class="ColVis_Special ' +
              (s.bJUI ? 'ui-button ui-state-default' : '') +
              '">' +
              this.s.restore +
              '</li>'
          ).click(function () {
            for (var t = 0, s = n.s.abOriginal.length; s > t; t++)
              n.s.dt.oInstance.fnSetColumnVis(t, n.s.abOriginal[t], !1);
            n._fnAdjustOpenRows(),
              n.s.dt.oInstance.fnAdjustColumnSizing(!1),
              n.s.dt.oInstance.fnDraw(!1);
          })[0];
        },
        _fnDomShowXButton: function (n, s) {
          var o = this,
            i = this.s.dt;
          return t(
            '<li class="ColVis_Special ' +
              (i.bJUI ? 'ui-button ui-state-default' : '') +
              '">' +
              n +
              '</li>'
          ).click(function () {
            for (var t = 0, n = o.s.abOriginal.length; n > t; t++)
              -1 === o.s.aiExclude.indexOf(t) &&
                o.s.dt.oInstance.fnSetColumnVis(t, s, !1);
            o._fnAdjustOpenRows(),
              o.s.dt.oInstance.fnAdjustColumnSizing(!1),
              o.s.dt.oInstance.fnDraw(!1);
          })[0];
        },
        _fnDomGroupButton: function (n) {
          var s = this,
            o = this.s.dt,
            i = this.s.aoGroups[n];
          return t(
            '<li class="ColVis_Special ' +
              (o.bJUI ? 'ui-button ui-state-default' : '') +
              '"><label><input type="checkbox" /><span>' +
              i.sTitle +
              '</span></label></li>'
          ).click(function (n) {
            var o = !t('input', this).is(':checked');
            'li' !== n.target.nodeName.toLowerCase() && (o = !o);
            for (var e = 0; e < i.aiColumns.length; e++)
              s.s.dt.oInstance.fnSetColumnVis(i.aiColumns[e], o);
          })[0];
        },
        _fnDomColumnButton: function (n) {
          var s = this,
            o = this.s.dt.aoColumns[n],
            i = this.s.dt,
            e =
              null === this.s.fnLabel
                ? o.sTitle
                : this.s.fnLabel(n, o.sTitle, o.nTh);
          return t(
            '<li ' +
              (i.bJUI ? 'class="ui-button ui-state-default"' : '') +
              '><label><input type="checkbox" /><span>' +
              e +
              '</span></label></li>'
          ).click(function (o) {
            var e = !t('input', this).is(':checked');
            'li' !== o.target.nodeName.toLowerCase() && (e = !e);
            var l = t.fn.dataTableExt.iApiIndex;
            (t.fn.dataTableExt.iApiIndex = s._fnDataTablesApiIndex.call(s)),
              i.oFeatures.bServerSide
                ? (s.s.dt.oInstance.fnSetColumnVis(n, e, !1),
                  s.s.dt.oInstance.fnAdjustColumnSizing(!1),
                  ('' !== i.oScroll.sX || '' !== i.oScroll.sY) &&
                    s.s.dt.oInstance.oApi._fnScrollDraw(s.s.dt),
                  s._fnDrawCallback())
                : s.s.dt.oInstance.fnSetColumnVis(n, e),
              (t.fn.dataTableExt.iApiIndex = l),
              'input' === o.target.nodeName.toLowerCase() &&
                null !== s.s.fnStateChange &&
                s.s.fnStateChange.call(s, n, e);
          })[0];
        },
        _fnDataTablesApiIndex: function () {
          for (var t = 0, n = this.s.dt.oInstance.length; n > t; t++)
            if (this.s.dt.oInstance[t] == this.s.dt.nTable) return t;
          return 0;
        },
        _fnDomCollection: function () {
          return t('<ul />', {
            class: this.s.dt.bJUI
              ? 'ColVis_collection ui-buttonset ui-buttonset-multi'
              : 'ColVis_collection',
          }).css({
            display: 'none',
            opacity: 0,
            position: this.s.bCssPosition ? '' : 'absolute',
          })[0];
        },
        _fnDomCatcher: function () {
          var s = this,
            o = n.createElement('div');
          return (
            (o.className = 'ColVis_catcher'),
            t(o).click(function () {
              s._fnCollectionHide.call(s, null, null);
            }),
            o
          );
        },
        _fnDomBackground: function () {
          var n = this,
            s = t('<div></div>')
              .addClass('ColVis_collectionBackground')
              .css('opacity', 0)
              .click(function () {
                n._fnCollectionHide.call(n, null, null);
              });
          return (
            'mouseover' == this.s.activate &&
              s.mouseover(function () {
                (n.s.overcollection = !1),
                  n._fnCollectionHide.call(n, null, null);
              }),
            s[0]
          );
        },
        _fnCollectionShow: function () {
          var s,
            o = this,
            i = t(this.dom.button).offset(),
            e = this.dom.collection,
            l = this.dom.background,
            a = parseInt(i.left, 10),
            u = parseInt(i.top + t(this.dom.button).outerHeight(), 10);
          this.s.bCssPosition ||
            ((e.style.top = u + 'px'), (e.style.left = a + 'px')),
            t(e).css({ display: 'block', opacity: 0 }),
            (l.style.bottom = '0px'),
            (l.style.right = '0px');
          var r = this.dom.catcher.style;
          if (
            ((r.height = t(this.dom.button).outerHeight() + 'px'),
            (r.width = t(this.dom.button).outerWidth() + 'px'),
            (r.top = i.top + 'px'),
            (r.left = a + 'px'),
            n.body.appendChild(l),
            n.body.appendChild(e),
            n.body.appendChild(this.dom.catcher),
            t(e).animate({ opacity: 1 }, o.s.iOverlayFade),
            t(l).animate(
              { opacity: 0.1 },
              o.s.iOverlayFade,
              'linear',
              function () {
                t.browser &&
                  t.browser.msie &&
                  '6.0' == t.browser.version &&
                  o._fnDrawCallback();
              }
            ),
            !this.s.bCssPosition)
          ) {
            (s =
              'left' == this.s.sAlign
                ? a
                : a - t(e).outerWidth() + t(this.dom.button).outerWidth()),
              (e.style.left = s + 'px');
            var d = t(e).outerWidth(),
              h = (t(e).outerHeight(), t(n).width());
            s + d > h && (e.style.left = h - d + 'px');
          }
          this.s.hidden = !1;
        },
        _fnCollectionHide: function () {
          var s = this;
          this.s.hidden ||
            null === this.dom.collection ||
            ((this.s.hidden = !0),
            t(this.dom.collection).animate(
              { opacity: 0 },
              s.s.iOverlayFade,
              function () {
                this.style.display = 'none';
              }
            ),
            t(this.dom.background).animate(
              { opacity: 0 },
              s.s.iOverlayFade,
              function () {
                n.body.removeChild(s.dom.background),
                  n.body.removeChild(s.dom.catcher);
              }
            ));
        },
        _fnAdjustOpenRows: function () {
          for (
            var t = this.s.dt.aoOpenRows,
              n = this.s.dt.oApi._fnVisbleColumns(this.s.dt),
              s = 0,
              o = t.length;
            o > s;
            s++
          )
            t[s].nTr.getElementsByTagName('td')[0].colSpan = n;
        },
      }),
      (o.fnRebuild = function (t) {
        var n = null;
        'undefined' != typeof t && (n = t.fnSettings().nTable);
        for (var s = 0, i = o.aInstances.length; i > s; s++)
          ('undefined' == typeof t || n == o.aInstances[s].s.dt.nTable) &&
            o.aInstances[s].fnRebuild();
      }),
      (o.defaults = {
        active: 'click',
        buttonText: 'Show / hide columns',
        aiExclude: [],
        bRestore: !1,
        sRestore: 'Restore original',
        bShowAll: !1,
        sShowAll: 'Show All',
        sAlign: 'left',
        fnStateChange: null,
        iOverlayFade: 500,
        fnLabel: null,
        bCssPosition: !1,
        aoGroups: [],
        order: 'column',
      }),
      (o.aInstances = []),
      (o.prototype.CLASS = 'ColVis'),
      (o.VERSION = '1.1.1'),
      (o.prototype.VERSION = o.VERSION),
      'function' == typeof t.fn.dataTable &&
      'function' == typeof t.fn.dataTableExt.fnVersionCheck &&
      t.fn.dataTableExt.fnVersionCheck('1.7.0')
        ? t.fn.dataTableExt.aoFeatures.push({
            fnInit: function (t) {
              var n = t.oInit,
                s = new o(t, n.colVis || n.oColVis || {});
              return s.button();
            },
            cFeature: 'C',
            sFeature: 'ColVis',
          })
        : alert(
            'Warning: ColVis requires DataTables 1.7 or greater - www.datatables.net/download'
          ),
      (t.fn.dataTable.ColVis = o),
      (t.fn.DataTable.ColVis = o),
      o
    );
  };
  'function' == typeof define && define.amd
    ? define(['jquery', 'datatables'], o)
    : 'object' == typeof exports
      ? o(require('jquery'), require('datatables'))
      : jQuery && !jQuery.fn.dataTable.ColVis && o(jQuery, jQuery.fn.dataTable);
})(window, document);
