(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.bootbox = factory(root.jQuery);
  }
})(this, function init($, undefined) {
  'use strict';
  var templates = {
    dialog:
      "<div class='bootbox modal' tabindex='-1' role='dialog'>" +
      "<div class='modal-dialog'>" +
      "<div class='modal-content'>" +
      "<div class='modal-body'><div class='bootbox-body'></div></div>" +
      '</div>' +
      '</div>' +
      '</div>',
    header:
      "<div class='modal-header'>" + "<h4 class='modal-title'></h4>" + '</div>',
    footer: "<div class='modal-footer'></div>",
    closeButton:
      "<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
    form: "<form class='bootbox-form'></form>",
    inputs: {
      text: "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",
      textarea:
        "<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>",
      email:
        "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",
      select:
        "<select class='bootbox-input bootbox-input-select form-control'></select>",
      checkbox:
        "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>",
      date: "<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />",
      time: "<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />",
      number:
        "<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />",
      password:
        "<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />",
    },
  };
  var defaults = {
    locale: 'en',
    backdrop: 'static',
    animate: !0,
    className: null,
    closeButton: !0,
    show: !0,
    container: 'body',
  };
  var exports = {};
  function _t(key) {
    var locale = locales[defaults.locale];
    return locale ? locale[key] : locales.en[key];
  }
  function processCallback(e, dialog, callback) {
    e.stopPropagation();
    e.preventDefault();
    var preserveDialog =
      $.isFunction(callback) && callback.call(dialog, e) === !1;
    if (!preserveDialog) {
      dialog.modal('hide');
    }
  }
  function getKeyLength(obj) {
    var k,
      t = 0;
    for (k in obj) {
      t++;
    }
    return t;
  }
  function each(collection, iterator) {
    var index = 0;
    $.each(collection, function (key, value) {
      iterator(key, value, index++);
    });
  }
  function sanitize(options) {
    var buttons;
    var total;
    if (typeof options !== 'object') {
      throw new Error('Please supply an object of options');
    }
    if (!options.message) {
      throw new Error('Please specify a message');
    }
    options = $.extend({}, defaults, options);
    if (!options.buttons) {
      options.buttons = {};
    }
    buttons = options.buttons;
    total = getKeyLength(buttons);
    each(buttons, function (key, button, index) {
      if ($.isFunction(button)) {
        button = buttons[key] = { callback: button };
      }
      if ($.type(button) !== 'object') {
        throw new Error('button with key ' + key + ' must be an object');
      }
      if (!button.label) {
        button.label = key;
      }
      if (!button.className) {
        if (total <= 2 && index === total - 1) {
          button.className = 'btn-primary';
        } else {
          button.className = 'btn-default';
        }
      }
    });
    return options;
  }
  function mapArguments(args, properties) {
    var argn = args.length;
    var options = {};
    if (argn < 1 || argn > 2) {
      throw new Error('Invalid argument length');
    }
    if (argn === 2 || typeof args[0] === 'string') {
      options[properties[0]] = args[0];
      options[properties[1]] = args[1];
    } else {
      options = args[0];
    }
    return options;
  }
  function mergeArguments(defaults, args, properties) {
    return $.extend(!0, {}, defaults, mapArguments(args, properties));
  }
  function mergeDialogOptions(className, labels, properties, args) {
    var baseOptions = {
      className: 'bootbox-' + className,
      buttons: createLabels.apply(null, labels),
    };
    return validateButtons(
      mergeArguments(baseOptions, args, properties),
      labels
    );
  }
  function createLabels() {
    var buttons = {};
    for (var i = 0, j = arguments.length; i < j; i++) {
      var argument = arguments[i];
      var key = argument.toLowerCase();
      var value = argument.toUpperCase();
      buttons[key] = { label: _t(value) };
    }
    return buttons;
  }
  function validateButtons(options, buttons) {
    var allowedButtons = {};
    each(buttons, function (key, value) {
      allowedButtons[value] = !0;
    });
    each(options.buttons, function (key) {
      if (allowedButtons[key] === undefined) {
        throw new Error(
          'button key ' +
            key +
            ' is not allowed (options are ' +
            buttons.join('\n') +
            ')'
        );
      }
    });
    return options;
  }
  exports.alert = function () {
    var options;
    options = mergeDialogOptions(
      'alert',
      ['ok'],
      ['message', 'callback'],
      arguments
    );
    if (options.callback && !$.isFunction(options.callback)) {
      throw new Error(
        'alert requires callback property to be a function when provided'
      );
    }
    options.buttons.ok.callback = options.onEscape = function () {
      if ($.isFunction(options.callback)) {
        return options.callback.call(this);
      }
      return !0;
    };
    return exports.dialog(options);
  };
  exports.confirm = function () {
    var options;
    options = mergeDialogOptions(
      'confirm',
      ['cancel', 'confirm'],
      ['message', 'callback'],
      arguments
    );
    options.buttons.cancel.callback = options.onEscape = function () {
      return options.callback.call(this, !1);
    };
    options.buttons.confirm.callback = function () {
      return options.callback.call(this, !0);
    };
    if (!$.isFunction(options.callback)) {
      throw new Error('confirm requires a callback');
    }
    return exports.dialog(options);
  };
  exports.prompt = function () {
    var options;
    var defaults;
    var dialog;
    var form;
    var input;
    var shouldShow;
    var inputOptions;
    form = $(templates.form);
    defaults = {
      className: 'bootbox-prompt',
      buttons: createLabels('cancel', 'confirm'),
      value: '',
      inputType: 'text',
    };
    options = validateButtons(
      mergeArguments(defaults, arguments, ['title', 'callback']),
      ['cancel', 'confirm']
    );
    shouldShow = options.show === undefined ? !0 : options.show;
    options.message = form;
    options.buttons.cancel.callback = options.onEscape = function () {
      return options.callback.call(this, null);
    };
    options.buttons.confirm.callback = function () {
      var value;
      switch (options.inputType) {
        case 'text':
        case 'textarea':
        case 'email':
        case 'select':
        case 'date':
        case 'time':
        case 'number':
        case 'password':
          value = input.val();
          break;
        case 'checkbox':
          var checkedItems = input.find('input:checked');
          value = [];
          each(checkedItems, function (_, item) {
            value.push($(item).val());
          });
          break;
      }
      return options.callback.call(this, value);
    };
    options.show = !1;
    if (!options.title) {
      throw new Error('prompt requires a title');
    }
    if (!$.isFunction(options.callback)) {
      throw new Error('prompt requires a callback');
    }
    if (!templates.inputs[options.inputType]) {
      throw new Error('invalid prompt type');
    }
    input = $(templates.inputs[options.inputType]);
    switch (options.inputType) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'date':
      case 'time':
      case 'number':
      case 'password':
        input.val(options.value);
        break;
      case 'select':
        var groups = {};
        inputOptions = options.inputOptions || [];
        if (!$.isArray(inputOptions)) {
          throw new Error('Please pass an array of input options');
        }
        if (!inputOptions.length) {
          throw new Error('prompt with select requires options');
        }
        each(inputOptions, function (_, option) {
          var elem = input;
          if (option.value === undefined || option.text === undefined) {
            throw new Error('given options in wrong format');
          }
          if (option.group) {
            if (!groups[option.group]) {
              groups[option.group] = $('<optgroup/>').attr(
                'label',
                option.group
              );
            }
            elem = groups[option.group];
          }
          elem.append(
            "<option value='" + option.value + "'>" + option.text + '</option>'
          );
        });
        each(groups, function (_, group) {
          input.append(group);
        });
        input.val(options.value);
        break;
      case 'checkbox':
        var values = $.isArray(options.value) ? options.value : [options.value];
        inputOptions = options.inputOptions || [];
        if (!inputOptions.length) {
          throw new Error('prompt with checkbox requires options');
        }
        if (!inputOptions[0].value || !inputOptions[0].text) {
          throw new Error('given options in wrong format');
        }
        input = $('<div/>');
        each(inputOptions, function (_, option) {
          var checkbox = $(templates.inputs[options.inputType]);
          checkbox.find('input').attr('value', option.value);
          checkbox.find('label').append(option.text);
          each(values, function (_, value) {
            if (value === option.value) {
              checkbox.find('input').prop('checked', !0);
            }
          });
          input.append(checkbox);
        });
        break;
    }
    if (options.placeholder) {
      input.attr('placeholder', options.placeholder);
    }
    if (options.pattern) {
      input.attr('pattern', options.pattern);
    }
    if (options.maxlength) {
      input.attr('maxlength', options.maxlength);
    }
    form.append(input);
    form.on('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dialog.find('.btn-primary').click();
    });
    dialog = exports.dialog(options);
    dialog.off('shown.bs.modal');
    dialog.on('shown.bs.modal', function () {
      input.focus();
    });
    if (shouldShow === !0) {
      dialog.modal('show');
    }
    return dialog;
  };
  exports.dialog = function (options) {
    options = sanitize(options);
    var dialog = $(templates.dialog);
    var innerDialog = dialog.find('.modal-dialog');
    var body = dialog.find('.modal-body');
    var buttons = options.buttons;
    var buttonStr = '';
    var callbacks = { onEscape: options.onEscape };
    if ($.fn.modal === undefined) {
      throw new Error(
        '$.fn.modal is not defined; please double check you have included ' +
          'the Bootstrap JavaScript library. See http://getbootstrap.com/javascript/ ' +
          'for more details.'
      );
    }
    each(buttons, function (key, button) {
      buttonStr +=
        "<button data-bb-handler='" +
        key +
        "' type='button' class='btn " +
        button.className +
        "'>" +
        button.label +
        '</button>';
      callbacks[key] = button.callback;
    });
    body.find('.bootbox-body').html(options.message);
    if (options.animate === !0) {
      dialog.addClass('fade');
    }
    if (options.className) {
      dialog.addClass(options.className);
    }
    if (options.size === 'large') {
      innerDialog.addClass('modal-lg');
    } else if (options.size === 'small') {
      innerDialog.addClass('modal-sm');
    }
    if (options.title) {
      body.before(templates.header);
    }
    if (options.closeButton) {
      var closeButton = $(templates.closeButton);
      if (options.title) {
        dialog.find('.modal-header').prepend(closeButton);
      } else {
        closeButton.css('margin-top', '-10px').prependTo(body);
      }
    }
    if (options.title) {
      dialog.find('.modal-title').html(options.title);
    }
    if (buttonStr.length) {
      body.after(templates.footer);
      dialog.find('.modal-footer').html(buttonStr);
    }
    dialog.on('hidden.bs.modal', function (e) {
      if (e.target === this) {
        dialog.remove();
      }
    });
    dialog.on('shown.bs.modal', function () {
      dialog.find('.btn-primary:first').focus();
    });
    if (options.backdrop !== 'static') {
      dialog.on('click.dismiss.bs.modal', function (e) {
        if (dialog.children('.modal-backdrop').length) {
          e.currentTarget = dialog.children('.modal-backdrop').get(0);
        }
        if (e.target !== e.currentTarget) {
          return;
        }
        dialog.trigger('escape.close.bb');
      });
    }
    dialog.on('escape.close.bb', function (e) {
      if (callbacks.onEscape) {
        processCallback(e, dialog, callbacks.onEscape);
      }
    });
    dialog.on('click', '.modal-footer button', function (e) {
      var callbackKey = $(this).data('bb-handler');
      processCallback(e, dialog, callbacks[callbackKey]);
    });
    dialog.on('click', '.bootbox-close-button', function (e) {
      processCallback(e, dialog, callbacks.onEscape);
    });
    dialog.on('keyup', function (e) {
      if (e.which === 27) {
        dialog.trigger('escape.close.bb');
      }
    });
    $(options.container).append(dialog);
    dialog.modal({
      backdrop: options.backdrop ? 'static' : !1,
      keyboard: !1,
      show: !1,
    });
    if (options.show) {
      dialog.modal('show');
    }
    return dialog;
  };
  exports.setDefaults = function () {
    var values = {};
    if (arguments.length === 2) {
      values[arguments[0]] = arguments[1];
    } else {
      values = arguments[0];
    }
    $.extend(defaults, values);
  };
  exports.hideAll = function () {
    $('.bootbox').modal('hide');
    return exports;
  };
  var locales = {
    bg_BG: { OK: 'Ок', CANCEL: 'Отказ', CONFIRM: 'Потвърждавам' },
    br: { OK: 'OK', CANCEL: 'Cancelar', CONFIRM: 'Sim' },
    cs: { OK: 'OK', CANCEL: 'Zrušit', CONFIRM: 'Potvrdit' },
    da: { OK: 'OK', CANCEL: 'Annuller', CONFIRM: 'Accepter' },
    de: { OK: 'OK', CANCEL: 'Abbrechen', CONFIRM: 'Akzeptieren' },
    el: { OK: 'Εντάξει', CANCEL: 'Ακύρωση', CONFIRM: 'Επιβεβαίωση' },
    en: { OK: 'OK', CANCEL: 'Cancel', CONFIRM: 'OK' },
    es: { OK: 'OK', CANCEL: 'Cancelar', CONFIRM: 'Aceptar' },
    et: { OK: 'OK', CANCEL: 'Katkesta', CONFIRM: 'OK' },
    fa: { OK: 'قبول', CANCEL: 'لغو', CONFIRM: 'تایید' },
    fi: { OK: 'OK', CANCEL: 'Peruuta', CONFIRM: 'OK' },
    fr: { OK: 'OK', CANCEL: 'Annuler', CONFIRM: "D'accord" },
    he: { OK: 'אישור', CANCEL: 'ביטול', CONFIRM: 'אישור' },
    hu: { OK: 'OK', CANCEL: 'Mégsem', CONFIRM: 'Megerősít' },
    hr: { OK: 'OK', CANCEL: 'Odustani', CONFIRM: 'Potvrdi' },
    id: { OK: 'OK', CANCEL: 'Batal', CONFIRM: 'OK' },
    it: { OK: 'OK', CANCEL: 'Annulla', CONFIRM: 'Conferma' },
    ja: { OK: 'OK', CANCEL: 'キャンセル', CONFIRM: '確認' },
    lt: { OK: 'Gerai', CANCEL: 'Atšaukti', CONFIRM: 'Patvirtinti' },
    lv: { OK: 'Labi', CANCEL: 'Atcelt', CONFIRM: 'Apstiprināt' },
    nl: { OK: 'OK', CANCEL: 'Annuleren', CONFIRM: 'Accepteren' },
    no: { OK: 'OK', CANCEL: 'Avbryt', CONFIRM: 'OK' },
    pl: { OK: 'OK', CANCEL: 'Anuluj', CONFIRM: 'Potwierdź' },
    pt: { OK: 'OK', CANCEL: 'Cancelar', CONFIRM: 'Confirmar' },
    ru: { OK: 'OK', CANCEL: 'Отмена', CONFIRM: 'Применить' },
    sq: { OK: 'OK', CANCEL: 'Anulo', CONFIRM: 'Prano' },
    sv: { OK: 'OK', CANCEL: 'Avbryt', CONFIRM: 'OK' },
    th: { OK: 'ตกลง', CANCEL: 'ยกเลิก', CONFIRM: 'ยืนยัน' },
    tr: { OK: 'Tamam', CANCEL: 'İptal', CONFIRM: 'Onayla' },
    zh_CN: { OK: 'OK', CANCEL: '取消', CONFIRM: '确认' },
    zh_TW: { OK: 'OK', CANCEL: '取消', CONFIRM: '確認' },
  };
  exports.addLocale = function (name, values) {
    $.each(['OK', 'CANCEL', 'CONFIRM'], function (_, v) {
      if (!values[v]) {
        throw new Error("Please supply a translation for '" + v + "'");
      }
    });
    locales[name] = {
      OK: values.OK,
      CANCEL: values.CANCEL,
      CONFIRM: values.CONFIRM,
    };
    return exports;
  };
  exports.removeLocale = function (name) {
    delete locales[name];
    return exports;
  };
  exports.setLocale = function (name) {
    return exports.setDefaults('locale', name);
  };
  exports.init = function (_$) {
    return init(_$ || $);
  };
  return exports;
});
