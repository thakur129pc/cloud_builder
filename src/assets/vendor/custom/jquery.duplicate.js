/** https://github.com/ReallyGood/jQuery.duplicate */
$.duplicate = function () {
  var body = $('body');
  body.off('duplicate');
  var templates = {};
  var settings = {};
  var init = function () {
    $('[data-duplicate]').each(function () {
      var name = $(this).data('duplicate');
      var template = $('<div>').html($(this).clone(true)).html();
      var options = {};
      var min = +$(this).data('duplicate-min');
      options.minimum = isNaN(min) ? 1 : min;
      options.maximum = +$(this).data('duplicate-max') || Infinity;
      options.parent = $(this).parent();

      settings[name] = options;
      templates[name] = template;
    });

    body.on('click.duplicate', '[data-duplicate-add]', add);
    body.on('click.duplicate', '[data-duplicate-remove]', remove);
  };
  var rowNum = 0;
  function add() {
    rowNum++;
    $('#add-characteristics').attr('id', 'add-characteristics-' + rowNum);
    $('#add-measure-toggle').attr('id', 'add-measure-toggle-' + rowNum);
    $('#add-tags').attr('id', 'add-tags-' + rowNum);

    var targetName = $(this).data('duplicate-add');
    var selector = $('[data-duplicate=' + targetName + ']');
    var target = $(selector).last();
    if (!target.length) target = $(settings[targetName].parent);
    var newElement = $(templates[targetName]).clone(true);

    if ($(selector).length >= settings[targetName].maximum) {
      $(this).trigger('duplicate.error');
      return;
    }
    target.after(newElement);
    $(this).trigger('duplicate.add');

    $('.tagsinput').trigger('click');
  }

  function remove() {
    var targetName = $(this).data('duplicate-remove');
    var selector = '[data-duplicate=' + targetName + ']';
    var target = $(this).closest(selector);
    if (!target.length) target = $(this).siblings(selector).eq(0);
    if (!target.length) target = $(selector).last();

    if ($(selector).length <= settings[targetName].minimum) {
      $(this).trigger('duplicate.error');
      return;
    }

    // Delete Confirmation
    var deletethis = confirm('Are you sure, Want to delete this?');
    if (deletethis == true) {
      target.remove();
      $(this).trigger('duplicate.remove');
    } else {
      /* Do nothing */
    }
  }

  $(init);
};

$.duplicate();
