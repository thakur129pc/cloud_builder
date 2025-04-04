!(function (e) {
  function t(t) {
    var n = 'iframe,pre,code';
    return e(t)
      .find(':not(' + n + ')')
      .andSelf()
      .contents()
      .filter(function () {
        return 3 == this.nodeType && 0 === e(this).closest(n).length;
      });
  }
  function n(e) {
    return (
      (e = e.replace(/(^|[\-\u2014\s(\["])'/g, '$1‘')),
      (e = e.replace(/'/g, '’')),
      (e = e.replace(/(^|[\-\u2014\/\[(\u2018\s])"/g, '$1“')),
      (e = e.replace(/"/g, '”')),
      (e = e.replace(/\.\.\./g, '…')),
      (e = e.replace(/--/g, '—'))
    );
  }
  var r,
    s = this,
    i = (s.Flatdoc = {});
  (i.run = function (t) {
    e(function () {
      new i.runner(t).run();
    });
  }),
    (i.file = function (t) {
      function n(t, r, s) {
        0 === t.length
          ? s(null, r)
          : e
              .get(t.shift())
              .fail(function (e) {
                s(e, null);
              })
              .done(function (e) {
                r.length > 0 && (r += '\n\n'), (r += e), n(t, r, s);
              });
      }
      return function (e) {
        n(t instanceof Array ? t : [t], '', e);
      };
    }),
    (i.github = function (t, n, r) {
      var i;
      return (
        (i = n
          ? 'https://api.github.com/repos/' + t + '/contents/' + n
          : 'https://api.github.com/repos/' + t + '/readme'),
        r && (i += '?ref=' + r),
        function (t) {
          e.get(i)
            .fail(function (e) {
              t(e, null);
            })
            .done(function (e) {
              var n = s.Base64.decode(e.content);
              t(null, n);
            });
        }
      );
    }),
    (i.bitbucket = function (t, n, r) {
      n || (n = 'readme.md'), r || (r = 'default');
      var s =
        'https://bitbucket.org/api/1.0/repositories/' +
        t +
        '/src/' +
        r +
        '/' +
        n;
      return function (t) {
        e.ajax({
          url: s,
          dataType: 'jsonp',
          error: function (e, t, n) {
            alert(n);
          },
          success: function (e) {
            var n = e.data;
            t(null, n);
          },
        });
      };
    });
  var l = (i.parser = {});
  (l.parse = function (t, n) {
    (r = s.marked), l.setMarkedOptions(n);
    var i = e('<div>' + r(t)),
      o = i.find('h1').eq(0),
      h = o.text();
    a.mangle(i);
    var u = a.getMenu(i);
    return { title: h, content: i, menu: u };
  }),
    (l.setMarkedOptions = function (e) {
      r.setOptions({
        highlight: function (t, n) {
          return n ? e(t, n) : t;
        },
      });
    });
  var a = (i.transformer = {});
  (a.mangle = function (e) {
    this.addIDs(e), this.buttonize(e), this.smartquotes(e);
  }),
    (a.addIDs = function (t) {
      var n = ['', '', ''];
      t.find('h1, h2, h3').each(function () {
        var t = e(this),
          r = parseInt(this.nodeName[1]),
          s = t.text(),
          l = i.slugify(s);
        r > 1 && (l = n[r - 2] + '-' + l),
          (n.length = r - 1),
          (n = n.concat([l, l])),
          t.attr('id', l);
      });
    }),
    (a.getMenu = function (t) {
      function n(e) {
        s.length = e + 1;
        var t = s[e];
        if (!t) {
          var i = e > 1 ? n(e - 1) : r;
          (t = { items: [], level: e }),
            (s = s.concat([t, t])),
            i.items.push(t);
        }
        return t;
      }
      var r = { items: [], id: '', level: 0 },
        s = [r];
      return (
        t.find('h1, h2, h3').each(function () {
          var t = e(this),
            r = +this.nodeName.substr(1),
            i = n(r - 1),
            l = { section: t.text(), items: [], level: r, id: t.attr('id') };
          i.items.push(l), (s[r] = l);
        }),
        r
      );
    }),
    (a.buttonize = function (t) {
      t.find('a').each(function () {
        var t = e(this),
          n = t.text().match(/^(.*) >$/);
        n && t.text(n[1]).addClass('button');
      });
    }),
    (a.smartquotes = function (e) {
      for (var r = t(e), s = r.length, i = 0; s > i; i++) {
        var l = r[i];
        l.nodeValue = n(l.nodeValue);
      }
    });
  var o = (i.highlighters = {});
  (o.js = o.javascript =
    function (e) {
      return e
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("[^\"]*?")/g, '<span class="string">$1</span>')
        .replace(/('[^\']*?')/g, '<span class="string">$1</span>')
        .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
        .replace(/\/\*(.*)\*\//gm, '<span class="comment">/*$1*/</span>')
        .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
        .replace(/(\d+)/gm, '<span class="number">$1</span>')
        .replace(
          /\bnew *(\w+)/gm,
          '<span class="keyword">new</span> <span class="init">$1</span>'
        )
        .replace(
          /\b(function|new|throw|return|var|if|else)\b/gm,
          '<span class="keyword">$1</span>'
        );
    }),
    (o.html = function (e) {
      return e
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("[^\"]*?")/g, '<span class="string">$1</span>')
        .replace(/('[^\']*?')/g, '<span class="string">$1</span>')
        .replace(
          /&lt;!--(.*)--&gt;/g,
          '<span class="comment">&lt;!--$1--&gt;</span>'
        )
        .replace(/&lt;([^!][^\s&]*)/g, '&lt;<span class="keyword">$1</span>');
    }),
    (o.generic = function (e) {
      return e
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("[^\"]*?")/g, '<span class="string">$1</span>')
        .replace(/('[^\']*?')/g, '<span class="string">$1</span>')
        .replace(/(\/\/|#)(.*)/gm, '<span class="comment">$1$2</span>')
        .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
        .replace(/(\d+)/gm, '<span class="number">$1</span>');
    });
  var h = (i.menuView = function (t) {
      function n(t, r) {
        var s = t.id || 'root',
          i = e('<li>')
            .attr('id', s + '-item')
            .addClass('level-' + t.level)
            .appendTo(r);
        if (t.section) {
          e('<a>')
            .html(t.section)
            .attr('id', s + '-link')
            .attr('href', '#' + t.id)
            .addClass('level-' + t.level)
            .appendTo(i);
        }
        if (t.items.length > 0) {
          var l = e('<ul>')
            .addClass('level-' + (t.level + 1))
            .attr('id', s + '-list')
            .appendTo(i);
          t.items.forEach(function (e) {
            n(e, l);
          });
        }
      }
      var r = e('<ul>');
      return n(t, r), r;
    }),
    u = (i.runner = function (e) {
      this.initialize(e);
    });
  (u.prototype.root = '[role~="flatdoc"]'),
    (u.prototype.menu = '[role~="flatdoc-menu"]'),
    (u.prototype.title = '[role~="flatdoc-title"]'),
    (u.prototype.content = '[role~="flatdoc-content"]'),
    (u.prototype.initialize = function (t) {
      e.extend(this, t);
    }),
    (u.prototype.highlight = function (e, t) {
      var n = i.highlighters[t] || i.highlighters.generic;
      return n(e);
    }),
    (u.prototype.run = function () {
      var t = this;
      e(t.root).trigger('flatdoc:loading'),
        t.fetcher(function (n, r) {
          if (n)
            return void console.error(
              '[Flatdoc] fetching Markdown data failed.',
              n
            );
          var s = i.parser.parse(r, t.highlight);
          t.applyData(s, t);
          var l = location.hash.substr(1);
          if (l) {
            var a = document.getElementById(l);
            a && a.scrollIntoView(!0);
          }
          e(t.root).trigger('flatdoc:ready');
        });
    }),
    (u.prototype.applyData = function (e) {
      var t = this;
      t.el('title').html(e.title),
        t.el('content').html(e.content.find('>*')),
        t.el('menu').html(h(e.menu));
    }),
    (u.prototype.el = function (t) {
      return e(this[t], this.root);
    });
})(jQuery),
  function () {
    function e(e) {
      (this.tokens = []),
        (this.tokens.links = {}),
        (this.options = e || a.defaults),
        (this.rules = o.normal),
        this.options.gfm &&
          (this.rules = this.options.tables ? o.tables : o.gfm);
    }
    function t(e, t) {
      if (
        ((this.options = t || a.defaults),
        (this.links = e),
        (this.rules = h.normal),
        !this.links)
      )
        throw new Error('Tokens array requires a `links` property.');
      this.options.gfm
        ? (this.rules = this.options.breaks ? h.breaks : h.gfm)
        : this.options.pedantic && (this.rules = h.pedantic);
    }
    function n(e) {
      (this.tokens = []), (this.token = null), (this.options = e || a.defaults);
    }
    function r(e, t) {
      return e
        .replace(t ? /&/g : /&(?!#?\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    function s(e, t) {
      return (
        (e = e.source),
        (t = t || ''),
        function n(r, s) {
          return r
            ? ((s = s.source || s),
              (s = s.replace(/(^|[^\[])\^/g, '$1')),
              (e = e.replace(r, s)),
              n)
            : new RegExp(e, t);
        }
      );
    }
    function i() {}
    function l(e) {
      for (var t, n, r = 1; r < arguments.length; r++) {
        t = arguments[r];
        for (n in t)
          Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      }
      return e;
    }
    function a(t, s, i) {
      if (i || 'function' == typeof s) {
        i || ((i = s), (s = null)), s && (s = l({}, a.defaults, s));
        var o = e.lex(o, s),
          h = s.highlight,
          u = 0,
          c = o.length,
          p = 0;
        if (!h || h.length < 3) return i(null, n.parse(o, s));
        for (
          var g = function () {
            delete s.highlight;
            var e = n.parse(o, s);
            return (s.highlight = h), i(null, e);
          };
          c > p;
          p++
        )
          !(function (e) {
            return 'code' === e.type
              ? (u++,
                h(e.text, e.lang, function (t, n) {
                  return null == n || n === e.text
                    ? --u || g()
                    : ((e.text = n), (e.escaped = !0), void (--u || g()));
                }))
              : void 0;
          })(o[p]);
      } else
        try {
          return s && (s = l({}, a.defaults, s)), n.parse(e.lex(t, s), s);
        } catch (f) {
          if (
            ((f.message +=
              '\nPlease report this to https://github.com/chjj/marked.'),
            (s || a.defaults).silent)
          )
            return (
              '<p>An error occured:</p><pre>' + r(f.message + '', !0) + '</pre>'
            );
          throw f;
        }
    }
    var o = {
      newline: /^\n+/,
      code: /^( {4}[^\n]+\n*)+/,
      fences: i,
      hr: /^( *[-*_]){3,} *(?:\n+|$)/,
      heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
      nptable: i,
      lheading: /^([^\n]+)\n *(=|-){3,} *\n*/,
      blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
      list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
      html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
      table: i,
      paragraph:
        /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
      text: /^[^\n]+/,
    };
    (o.bullet = /(?:[*+-]|\d+\.)/),
      (o.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/),
      (o.item = s(o.item, 'gm')(/bull/g, o.bullet)()),
      (o.list = s(o.list)(/bull/g, o.bullet)(
        'hr',
        /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/
      )()),
      (o._tag =
        '(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b'),
      (o.html = s(o.html)('comment', /<!--[\s\S]*?-->/)(
        'closed',
        /<(tag)[\s\S]+?<\/\1>/
      )('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, o._tag)()),
      (o.paragraph = s(o.paragraph)('hr', o.hr)('heading', o.heading)(
        'lheading',
        o.lheading
      )('blockquote', o.blockquote)('tag', '<' + o._tag)('def', o.def)()),
      (o.normal = l({}, o)),
      (o.gfm = l({}, o.normal, {
        fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
        paragraph: /^/,
      })),
      (o.gfm.paragraph = s(o.paragraph)(
        '(?!',
        '(?!' + o.gfm.fences.source.replace('\\1', '\\2') + '|'
      )()),
      (o.tables = l({}, o.gfm, {
        nptable:
          /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
        table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/,
      })),
      (e.rules = o),
      (e.lex = function (t, n) {
        var r = new e(n);
        return r.lex(t);
      }),
      (e.prototype.lex = function (e) {
        return (
          (e = e
            .replace(/\r\n|\r/g, '\n')
            .replace(/\t/g, '    ')
            .replace(/\u00a0/g, ' ')
            .replace(/\u2424/g, '\n')),
          this.token(e, !0)
        );
      }),
      (e.prototype.token = function (e, t) {
        for (var n, r, s, i, l, a, h, u, c, e = e.replace(/^ +$/gm, ''); e; )
          if (
            ((s = this.rules.newline.exec(e)) &&
              ((e = e.substring(s[0].length)),
              s[0].length > 1 && this.tokens.push({ type: 'space' })),
            (s = this.rules.code.exec(e)))
          )
            (e = e.substring(s[0].length)),
              (s = s[0].replace(/^ {4}/gm, '')),
              this.tokens.push({
                type: 'code',
                text: this.options.pedantic ? s : s.replace(/\n+$/, ''),
              });
          else if ((s = this.rules.fences.exec(e)))
            (e = e.substring(s[0].length)),
              this.tokens.push({ type: 'code', lang: s[2], text: s[3] });
          else if ((s = this.rules.heading.exec(e)))
            (e = e.substring(s[0].length)),
              this.tokens.push({
                type: 'heading',
                depth: s[1].length,
                text: s[2],
              });
          else if (t && (s = this.rules.nptable.exec(e))) {
            for (
              e = e.substring(s[0].length),
                a = {
                  type: 'table',
                  header: s[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                  align: s[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                  cells: s[3].replace(/\n$/, '').split('\n'),
                },
                u = 0;
              u < a.align.length;
              u++
            )
              a.align[u] = /^ *-+: *$/.test(a.align[u])
                ? 'right'
                : /^ *:-+: *$/.test(a.align[u])
                  ? 'center'
                  : /^ *:-+ *$/.test(a.align[u])
                    ? 'left'
                    : null;
            for (u = 0; u < a.cells.length; u++)
              a.cells[u] = a.cells[u].split(/ *\| */);
            this.tokens.push(a);
          } else if ((s = this.rules.lheading.exec(e)))
            (e = e.substring(s[0].length)),
              this.tokens.push({
                type: 'heading',
                depth: '=' === s[2] ? 1 : 2,
                text: s[1],
              });
          else if ((s = this.rules.hr.exec(e)))
            (e = e.substring(s[0].length)), this.tokens.push({ type: 'hr' });
          else if ((s = this.rules.blockquote.exec(e)))
            (e = e.substring(s[0].length)),
              this.tokens.push({ type: 'blockquote_start' }),
              (s = s[0].replace(/^ *> ?/gm, '')),
              this.token(s, t),
              this.tokens.push({ type: 'blockquote_end' });
          else if ((s = this.rules.list.exec(e))) {
            for (
              e = e.substring(s[0].length),
                i = s[2],
                this.tokens.push({ type: 'list_start', ordered: i.length > 1 }),
                s = s[0].match(this.rules.item),
                n = !1,
                c = s.length,
                u = 0;
              c > u;
              u++
            )
              (a = s[u]),
                (h = a.length),
                (a = a.replace(/^ *([*+-]|\d+\.) +/, '')),
                ~a.indexOf('\n ') &&
                  ((h -= a.length),
                  (a = this.options.pedantic
                    ? a.replace(/^ {1,4}/gm, '')
                    : a.replace(new RegExp('^ {1,' + h + '}', 'gm'), ''))),
                this.options.smartLists &&
                  u !== c - 1 &&
                  ((l = o.bullet.exec(s[u + 1])[0]),
                  i === l ||
                    (i.length > 1 && l.length > 1) ||
                    ((e = s.slice(u + 1).join('\n') + e), (u = c - 1))),
                (r = n || /\n\n(?!\s*$)/.test(a)),
                u !== c - 1 && ((n = '\n' === a[a.length - 1]), r || (r = n)),
                this.tokens.push({
                  type: r ? 'loose_item_start' : 'list_item_start',
                }),
                this.token(a, !1),
                this.tokens.push({ type: 'list_item_end' });
            this.tokens.push({ type: 'list_end' });
          } else if ((s = this.rules.html.exec(e)))
            (e = e.substring(s[0].length)),
              this.tokens.push({
                type: this.options.sanitize ? 'paragraph' : 'html',
                pre: 'pre' === s[1] || 'script' === s[1],
                text: s[0],
              });
          else if (t && (s = this.rules.def.exec(e)))
            (e = e.substring(s[0].length)),
              (this.tokens.links[s[1].toLowerCase()] = {
                href: s[2],
                title: s[3],
              });
          else if (t && (s = this.rules.table.exec(e))) {
            for (
              e = e.substring(s[0].length),
                a = {
                  type: 'table',
                  header: s[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                  align: s[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                  cells: s[3].replace(/(?: *\| *)?\n$/, '').split('\n'),
                },
                u = 0;
              u < a.align.length;
              u++
            )
              a.align[u] = /^ *-+: *$/.test(a.align[u])
                ? 'right'
                : /^ *:-+: *$/.test(a.align[u])
                  ? 'center'
                  : /^ *:-+ *$/.test(a.align[u])
                    ? 'left'
                    : null;
            for (u = 0; u < a.cells.length; u++)
              a.cells[u] = a.cells[u]
                .replace(/^ *\| *| *\| *$/g, '')
                .split(/ *\| */);
            this.tokens.push(a);
          } else if (t && (s = this.rules.paragraph.exec(e)))
            (e = e.substring(s[0].length)),
              this.tokens.push({
                type: 'paragraph',
                text: '\n' === s[1][s[1].length - 1] ? s[1].slice(0, -1) : s[1],
              });
          else if ((s = this.rules.text.exec(e)))
            (e = e.substring(s[0].length)),
              this.tokens.push({ type: 'text', text: s[0] });
          else if (e)
            throw new Error('Infinite loop on byte: ' + e.charCodeAt(0));
        return this.tokens;
      });
    var h = {
      escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
      autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
      url: i,
      tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
      link: /^!?\[(inside)\]\(href\)/,
      reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
      nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
      strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
      em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
      code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
      br: /^ {2,}\n(?!\s*$)/,
      del: i,
      text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
    };
    (h._inside = /(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/),
      (h._href = /\s*<?([^\s]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/),
      (h.link = s(h.link)('inside', h._inside)('href', h._href)()),
      (h.reflink = s(h.reflink)('inside', h._inside)()),
      (h.normal = l({}, h)),
      (h.pedantic = l({}, h.normal, {
        strong:
          /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
      })),
      (h.gfm = l({}, h.normal, {
        escape: s(h.escape)('])', '~|])')(),
        url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
        del: /^~~(?=\S)([\s\S]*?\S)~~/,
        text: s(h.text)(']|', '~]|')('|', '|https?://|')(),
      })),
      (h.breaks = l({}, h.gfm, {
        br: s(h.br)('{2,}', '*')(),
        text: s(h.gfm.text)('{2,}', '*')(),
      })),
      (t.rules = h),
      (t.output = function (e, n, r) {
        var s = new t(n, r);
        return s.output(e);
      }),
      (t.prototype.output = function (e) {
        for (var t, n, s, i, l = ''; e; )
          if ((i = this.rules.escape.exec(e)))
            (e = e.substring(i[0].length)), (l += i[1]);
          else if ((i = this.rules.autolink.exec(e)))
            (e = e.substring(i[0].length)),
              '@' === i[2]
                ? ((n = this.mangle(
                    ':' === i[1][6] ? i[1].substring(7) : i[1]
                  )),
                  (s = this.mangle('mailto:') + n))
                : ((n = r(i[1])), (s = n)),
              (l += '<a href="' + s + '">' + n + '</a>');
          else if ((i = this.rules.url.exec(e)))
            (e = e.substring(i[0].length)),
              (n = r(i[1])),
              (s = n),
              (l += '<a href="' + s + '">' + n + '</a>');
          else if ((i = this.rules.tag.exec(e)))
            (e = e.substring(i[0].length)),
              (l += this.options.sanitize ? r(i[0]) : i[0]);
          else if ((i = this.rules.link.exec(e)))
            (e = e.substring(i[0].length)),
              (l += this.outputLink(i, { href: i[2], title: i[3] }));
          else if (
            (i = this.rules.reflink.exec(e)) ||
            (i = this.rules.nolink.exec(e))
          ) {
            if (
              ((e = e.substring(i[0].length)),
              (t = (i[2] || i[1]).replace(/\s+/g, ' ')),
              (t = this.links[t.toLowerCase()]),
              !t || !t.href)
            ) {
              (l += i[0][0]), (e = i[0].substring(1) + e);
              continue;
            }
            l += this.outputLink(i, t);
          } else if ((i = this.rules.strong.exec(e)))
            (e = e.substring(i[0].length)),
              (l += '<strong>' + this.output(i[2] || i[1]) + '</strong>');
          else if ((i = this.rules.em.exec(e)))
            (e = e.substring(i[0].length)),
              (l += '<em>' + this.output(i[2] || i[1]) + '</em>');
          else if ((i = this.rules.code.exec(e)))
            (e = e.substring(i[0].length)),
              (l += '<code>' + r(i[2], !0) + '</code>');
          else if ((i = this.rules.br.exec(e)))
            (e = e.substring(i[0].length)), (l += '<br>');
          else if ((i = this.rules.del.exec(e)))
            (e = e.substring(i[0].length)),
              (l += '<del>' + this.output(i[1]) + '</del>');
          else if ((i = this.rules.text.exec(e)))
            (e = e.substring(i[0].length)), (l += r(i[0]));
          else if (e)
            throw new Error('Infinite loop on byte: ' + e.charCodeAt(0));
        return l;
      }),
      (t.prototype.outputLink = function (e, t) {
        return '!' !== e[0][0]
          ? '<a href="' +
              r(t.href) +
              '"' +
              (t.title ? ' title="' + r(t.title) + '"' : '') +
              '>' +
              this.output(e[1]) +
              '</a>'
          : '<img src="' +
              r(t.href) +
              '" alt="' +
              r(e[1]) +
              '"' +
              (t.title ? ' title="' + r(t.title) + '"' : '') +
              '>';
      }),
      (t.prototype.smartypants = function (e) {
        return this.options.smartypants
          ? e
              .replace(/--/g, '—')
              .replace(/'([^']*)'/g, '‘$1’')
              .replace(/"([^"]*)"/g, '“$1”')
              .replace(/\.{3}/g, '…')
          : e;
      }),
      (t.prototype.mangle = function (e) {
        for (var t, n = '', r = e.length, s = 0; r > s; s++)
          (t = e.charCodeAt(s)),
            Math.random() > 0.5 && (t = 'x' + t.toString(16)),
            (n += '&#' + t + ';');
        return n;
      }),
      (n.parse = function (e, t) {
        var r = new n(t);
        return r.parse(e);
      }),
      (n.prototype.parse = function (e) {
        (this.inline = new t(e.links, this.options)),
          (this.tokens = e.reverse());
        for (var n = ''; this.next(); ) n += this.tok();
        return n;
      }),
      (n.prototype.next = function () {
        return (this.token = this.tokens.pop());
      }),
      (n.prototype.peek = function () {
        return this.tokens[this.tokens.length - 1] || 0;
      }),
      (n.prototype.parseText = function () {
        for (var e = this.token.text; 'text' === this.peek().type; )
          e += '\n' + this.next().text;
        return this.inline.output(e);
      }),
      (n.prototype.tok = function () {
        switch (this.token.type) {
          case 'space':
            return '';
          case 'hr':
            return '<hr>\n';
          case 'heading':
            return (
              '<h' +
              this.token.depth +
              '>' +
              this.inline.output(this.token.text) +
              '</h' +
              this.token.depth +
              '>\n'
            );
          case 'code':
            if (this.options.highlight) {
              var e = this.options.highlight(this.token.text, this.token.lang);
              null != e &&
                e !== this.token.text &&
                ((this.token.escaped = !0), (this.token.text = e));
            }
            return (
              this.token.escaped || (this.token.text = r(this.token.text, !0)),
              '<pre><code' +
                (this.token.lang
                  ? ' class="' + this.options.langPrefix + this.token.lang + '"'
                  : '') +
                '>' +
                this.token.text +
                '</code></pre>\n'
            );
          case 'table':
            var t,
              n,
              s,
              i,
              l,
              a = '';
            for (
              a += '<thead>\n<tr>\n', n = 0;
              n < this.token.header.length;
              n++
            )
              (t = this.inline.output(this.token.header[n])),
                (a += this.token.align[n]
                  ? '<th align="' + this.token.align[n] + '">' + t + '</th>\n'
                  : '<th>' + t + '</th>\n');
            for (
              a += '</tr>\n</thead>\n', a += '<tbody>\n', n = 0;
              n < this.token.cells.length;
              n++
            ) {
              for (
                s = this.token.cells[n], a += '<tr>\n', l = 0;
                l < s.length;
                l++
              )
                (i = this.inline.output(s[l])),
                  (a += this.token.align[l]
                    ? '<td align="' + this.token.align[l] + '">' + i + '</td>\n'
                    : '<td>' + i + '</td>\n');
              a += '</tr>\n';
            }
            return (a += '</tbody>\n'), '<table>\n' + a + '</table>\n';
          case 'blockquote_start':
            for (var a = ''; 'blockquote_end' !== this.next().type; )
              a += this.tok();
            return '<blockquote>\n' + a + '</blockquote>\n';
          case 'list_start':
            for (
              var o = this.token.ordered ? 'ol' : 'ul', a = '';
              'list_end' !== this.next().type;

            )
              a += this.tok();
            return '<' + o + '>\n' + a + '</' + o + '>\n';
          case 'list_item_start':
            for (var a = ''; 'list_item_end' !== this.next().type; )
              a += 'text' === this.token.type ? this.parseText() : this.tok();
            return '<li>' + a + '</li>\n';
          case 'loose_item_start':
            for (var a = ''; 'list_item_end' !== this.next().type; )
              a += this.tok();
            return '<li>' + a + '</li>\n';
          case 'html':
            return this.token.pre || this.options.pedantic
              ? this.token.text
              : this.inline.output(this.token.text);
          case 'paragraph':
            return '<p>' + this.inline.output(this.token.text) + '</p>\n';
          case 'text':
            return '<p>' + this.parseText() + '</p>\n';
        }
      }),
      (i.exec = i),
      (a.options = a.setOptions =
        function (e) {
          return l(a.defaults, e), a;
        }),
      (a.defaults = {
        gfm: !0,
        tables: !0,
        breaks: !1,
        pedantic: !1,
        sanitize: !1,
        smartLists: !1,
        silent: !1,
        highlight: null,
        langPrefix: 'lang-',
      }),
      (a.Parser = n),
      (a.parser = n.parse),
      (a.Lexer = e),
      (a.lexer = e.lex),
      (a.InlineLexer = t),
      (a.inlineLexer = t.output),
      (a.parse = a),
      'object' == typeof exports
        ? (module.exports = a)
        : 'function' == typeof define && define.amd
          ? define(function () {
              return a;
            })
          : (this.marked = a);
  }.call(
    (function () {
      return this || ('undefined' != typeof window ? window : global);
    })()
  ),
  (function (e) {
    'use strict';
    if (!e.Base64) {
      var t,
        n = '2.1.2';
      'undefined' != typeof module &&
        module.exports &&
        (t = require('buffer').Buffer);
      var r =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        s = (function (e) {
          for (var t = {}, n = 0, r = e.length; r > n; n++) t[e.charAt(n)] = n;
          return t;
        })(r),
        i = String.fromCharCode,
        l = function (e) {
          if (e.length < 2) {
            var t = e.charCodeAt(0);
            return 128 > t
              ? e
              : 2048 > t
                ? i(192 | (t >>> 6)) + i(128 | (63 & t))
                : i(224 | ((t >>> 12) & 15)) +
                  i(128 | ((t >>> 6) & 63)) +
                  i(128 | (63 & t));
          }
          var t =
            65536 +
            1024 * (e.charCodeAt(0) - 55296) +
            (e.charCodeAt(1) - 56320);
          return (
            i(240 | ((t >>> 18) & 7)) +
            i(128 | ((t >>> 12) & 63)) +
            i(128 | ((t >>> 6) & 63)) +
            i(128 | (63 & t))
          );
        },
        a = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
        o = function (e) {
          return e.replace(a, l);
        },
        h = function (e) {
          var t = [0, 2, 1][e.length % 3],
            n =
              (e.charCodeAt(0) << 16) |
              ((e.length > 1 ? e.charCodeAt(1) : 0) << 8) |
              (e.length > 2 ? e.charCodeAt(2) : 0),
            s = [
              r.charAt(n >>> 18),
              r.charAt((n >>> 12) & 63),
              t >= 2 ? '=' : r.charAt((n >>> 6) & 63),
              t >= 1 ? '=' : r.charAt(63 & n),
            ];
          return s.join('');
        },
        u =
          e.btoa ||
          function (e) {
            return e.replace(/[\s\S]{1,3}/g, h);
          },
        c = t
          ? function (e) {
              return new t(e).toString('base64');
            }
          : function (e) {
              return u(o(e));
            },
        p = function (e, t) {
          return t
            ? c(e)
                .replace(/[+\/]/g, function (e) {
                  return '+' == e ? '-' : '_';
                })
                .replace(/=/g, '')
            : c(e);
        },
        g = function (e) {
          return p(e, !0);
        },
        f = new RegExp(
          ['[À-ß][-¿]', '[à-ï][-¿]{2}', '[ð-÷][-¿]{3}'].join('|'),
          'g'
        ),
        d = function (e) {
          switch (e.length) {
            case 4:
              var t =
                  ((7 & e.charCodeAt(0)) << 18) |
                  ((63 & e.charCodeAt(1)) << 12) |
                  ((63 & e.charCodeAt(2)) << 6) |
                  (63 & e.charCodeAt(3)),
                n = t - 65536;
              return i((n >>> 10) + 55296) + i((1023 & n) + 56320);
            case 3:
              return i(
                ((15 & e.charCodeAt(0)) << 12) |
                  ((63 & e.charCodeAt(1)) << 6) |
                  (63 & e.charCodeAt(2))
              );
            default:
              return i(((31 & e.charCodeAt(0)) << 6) | (63 & e.charCodeAt(1)));
          }
        },
        m = function (e) {
          return e.replace(f, d);
        },
        b = function (e) {
          var t = e.length,
            n = t % 4,
            r =
              (t > 0 ? s[e.charAt(0)] << 18 : 0) |
              (t > 1 ? s[e.charAt(1)] << 12 : 0) |
              (t > 2 ? s[e.charAt(2)] << 6 : 0) |
              (t > 3 ? s[e.charAt(3)] : 0),
            l = [i(r >>> 16), i((r >>> 8) & 255), i(255 & r)];
          return (l.length -= [0, 0, 2, 1][n]), l.join('');
        },
        k =
          e.atob ||
          function (e) {
            return e.replace(/[\s\S]{1,4}/g, b);
          },
        x = t
          ? function (e) {
              return new t(e, 'base64').toString();
            }
          : function (e) {
              return m(k(e));
            },
        y = function (e) {
          return x(
            e
              .replace(/[-_]/g, function (e) {
                return '-' == e ? '+' : '/';
              })
              .replace(/[^A-Za-z0-9\+\/]/g, '')
          );
        };
      if (
        ((e.Base64 = {
          VERSION: n,
          atob: k,
          btoa: u,
          fromBase64: y,
          toBase64: p,
          utob: o,
          encode: p,
          encodeURI: g,
          btou: m,
          decode: y,
        }),
        'function' == typeof Object.defineProperty)
      ) {
        var v = function (e) {
          return { value: e, enumerable: !1, writable: !0, configurable: !0 };
        };
        e.Base64.extendString = function () {
          Object.defineProperty(
            String.prototype,
            'fromBase64',
            v(function () {
              return y(this);
            })
          ),
            Object.defineProperty(
              String.prototype,
              'toBase64',
              v(function (e) {
                return p(this, e);
              })
            ),
            Object.defineProperty(
              String.prototype,
              'toBase64URI',
              v(function () {
                return p(this, !0);
              })
            );
        };
      }
    }
  })(this),
  (function () {
    var e = {
        À: 'A',
        Á: 'A',
        Â: 'A',
        Ã: 'A',
        Ä: 'A',
        Å: 'A',
        Æ: 'AE',
        Ç: 'C',
        È: 'E',
        É: 'E',
        Ê: 'E',
        Ë: 'E',
        Ì: 'I',
        Í: 'I',
        Î: 'I',
        Ï: 'I',
        Ð: 'D',
        Ñ: 'N',
        Ò: 'O',
        Ó: 'O',
        Ô: 'O',
        Õ: 'O',
        Ö: 'O',
        Ő: 'O',
        Ø: 'O',
        Ù: 'U',
        Ú: 'U',
        Û: 'U',
        Ü: 'U',
        Ű: 'U',
        Ý: 'Y',
        Þ: 'TH',
        ß: 'ss',
        à: 'a',
        á: 'a',
        â: 'a',
        ã: 'a',
        ä: 'a',
        å: 'a',
        æ: 'ae',
        ç: 'c',
        è: 'e',
        é: 'e',
        ê: 'e',
        ë: 'e',
        ì: 'i',
        í: 'i',
        î: 'i',
        ï: 'i',
        ð: 'd',
        ñ: 'n',
        ò: 'o',
        ó: 'o',
        ô: 'o',
        õ: 'o',
        ö: 'o',
        ő: 'o',
        ø: 'o',
        ù: 'u',
        ú: 'u',
        û: 'u',
        ü: 'u',
        ű: 'u',
        ý: 'y',
        þ: 'th',
        ÿ: 'y',
      },
      t = { '©': '(c)' },
      n = {
        α: 'a',
        β: 'b',
        γ: 'g',
        δ: 'd',
        ε: 'e',
        ζ: 'z',
        η: 'h',
        θ: '8',
        ι: 'i',
        κ: 'k',
        λ: 'l',
        μ: 'm',
        ν: 'n',
        ξ: '3',
        ο: 'o',
        π: 'p',
        ρ: 'r',
        σ: 's',
        τ: 't',
        υ: 'y',
        φ: 'f',
        χ: 'x',
        ψ: 'ps',
        ω: 'w',
        ά: 'a',
        έ: 'e',
        ί: 'i',
        ό: 'o',
        ύ: 'y',
        ή: 'h',
        ώ: 'w',
        ς: 's',
        ϊ: 'i',
        ΰ: 'y',
        ϋ: 'y',
        ΐ: 'i',
        Α: 'A',
        Β: 'B',
        Γ: 'G',
        Δ: 'D',
        Ε: 'E',
        Ζ: 'Z',
        Η: 'H',
        Θ: '8',
        Ι: 'I',
        Κ: 'K',
        Λ: 'L',
        Μ: 'M',
        Ν: 'N',
        Ξ: '3',
        Ο: 'O',
        Π: 'P',
        Ρ: 'R',
        Σ: 'S',
        Τ: 'T',
        Υ: 'Y',
        Φ: 'F',
        Χ: 'X',
        Ψ: 'PS',
        Ω: 'W',
        Ά: 'A',
        Έ: 'E',
        Ί: 'I',
        Ό: 'O',
        Ύ: 'Y',
        Ή: 'H',
        Ώ: 'W',
        Ϊ: 'I',
        Ϋ: 'Y',
      },
      r = {
        ş: 's',
        Ş: 'S',
        ı: 'i',
        İ: 'I',
        ç: 'c',
        Ç: 'C',
        ü: 'u',
        Ü: 'U',
        ö: 'o',
        Ö: 'O',
        ğ: 'g',
        Ğ: 'G',
      },
      s = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'g',
        д: 'd',
        е: 'e',
        ё: 'yo',
        ж: 'zh',
        з: 'z',
        и: 'i',
        й: 'j',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'h',
        ц: 'c',
        ч: 'ch',
        ш: 'sh',
        щ: 'sh',
        ъ: '',
        ы: 'y',
        ь: '',
        э: 'e',
        ю: 'yu',
        я: 'ya',
        А: 'A',
        Б: 'B',
        В: 'V',
        Г: 'G',
        Д: 'D',
        Е: 'E',
        Ё: 'Yo',
        Ж: 'Zh',
        З: 'Z',
        И: 'I',
        Й: 'J',
        К: 'K',
        Л: 'L',
        М: 'M',
        Н: 'N',
        О: 'O',
        П: 'P',
        Р: 'R',
        С: 'S',
        Т: 'T',
        У: 'U',
        Ф: 'F',
        Х: 'H',
        Ц: 'C',
        Ч: 'Ch',
        Ш: 'Sh',
        Щ: 'Sh',
        Ъ: '',
        Ы: 'Y',
        Ь: '',
        Э: 'E',
        Ю: 'Yu',
        Я: 'Ya',
      },
      i = {
        Є: 'Ye',
        І: 'I',
        Ї: 'Yi',
        Ґ: 'G',
        є: 'ye',
        і: 'i',
        ї: 'yi',
        ґ: 'g',
      },
      l = {
        č: 'c',
        ď: 'd',
        ě: 'e',
        ň: 'n',
        ř: 'r',
        š: 's',
        ť: 't',
        ů: 'u',
        ž: 'z',
        Č: 'C',
        Ď: 'D',
        Ě: 'E',
        Ň: 'N',
        Ř: 'R',
        Š: 'S',
        Ť: 'T',
        Ů: 'U',
        Ž: 'Z',
      },
      a = {
        ą: 'a',
        ć: 'c',
        ę: 'e',
        ł: 'l',
        ń: 'n',
        ó: 'o',
        ś: 's',
        ź: 'z',
        ż: 'z',
        Ą: 'A',
        Ć: 'C',
        Ę: 'e',
        Ł: 'L',
        Ń: 'N',
        Ó: 'o',
        Ś: 'S',
        Ź: 'Z',
        Ż: 'Z',
      },
      o = {
        ā: 'a',
        č: 'c',
        ē: 'e',
        ģ: 'g',
        ī: 'i',
        ķ: 'k',
        ļ: 'l',
        ņ: 'n',
        š: 's',
        ū: 'u',
        ž: 'z',
        Ā: 'A',
        Č: 'C',
        Ē: 'E',
        Ģ: 'G',
        Ī: 'i',
        Ķ: 'k',
        Ļ: 'L',
        Ņ: 'N',
        Š: 'S',
        Ū: 'u',
        Ž: 'Z',
      },
      h = new Array();
    (h[0] = e),
      (h[1] = t),
      (h[2] = n),
      (h[3] = r),
      (h[4] = s),
      (h[5] = i),
      (h[6] = l),
      (h[7] = a),
      (h[8] = o);
    var u = new Object();
    (u.Initialize = function () {
      if (!u.map) {
        (u.map = {}), (u.chars = '');
        for (var e in h) {
          var t = h[e];
          for (var n in t) (u.map[n] = t[n]), (u.chars += n);
        }
        u.regex = new RegExp('[' + u.chars + ']|[^' + u.chars + ']+', 'g');
      }
    }),
      (downcode = function (e) {
        u.Initialize();
        var t = '',
          n = e.match(u.regex);
        if (n)
          for (var r = 0; r < n.length; r++) {
            if (1 == n[r].length) {
              var s = u.map[n[r]];
              if (null != s) {
                t += s;
                continue;
              }
            }
            t += n[r];
          }
        else t = e;
        return t;
      }),
      (Flatdoc.slugify = function (e, t) {
        return (
          (e = downcode(e)),
          (e = e.replace(/[^-\w\s]/g, '')),
          (e = e.replace(/^\s+|\s+$/g, '')),
          (e = e.replace(/[-\s]+/g, '-')),
          (e = e.toLowerCase()),
          e.substring(0, t)
        );
      });
  })();
