$(document).ready(function () {
  // form serialize arr to json
  function SerializeArrToJson(formSerializeArr) {
    var jsonObj = {};
    jQuery.map(formSerializeArr, function (n, i) {
      if (n.name.endsWith('[]')) {
        var name = n.name;
        name = name.substring(0, name.length - 2);
        if (!(name in jsonObj)) {
          jsonObj[name] = [];
        }
        jsonObj[name].push(n.value);
      } else if (!n.name.endsWith('_length')) {
        // if (n.value != '') {
        jsonObj[n.name] = n.value;
        // }
      }
    });
    return jsonObj;
  }

  $.getJSON('data/queries-list.json', function (data) {
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

    let initialData = data;
    let mainPromptData = [];
    let promptTags = {};

    if (localStorage.getItem('Query List') === null) {
      localStorage.setItem('Query List', JSON.stringify(initialData));
    } else {
      let data = {
        ...initialData,
        ...JSON.parse(localStorage.getItem('Query List')),
      };
      localStorage.setItem('Query List', JSON.stringify(data));
    }

    // Search functionality
    $('#queries-list tfoot th').each(function () {
      let title = $('#queries-list thead th').eq($(this).index()).text().trim();
      if (title != '' && title) {
        $(this).html(
          '<input type="text" class="filter" placeholder="' + title + '" />'
        );
      }
    });
    $('#queries-list')
      .DataTable({
        iDisplayLength: 25, // Set the default number of rows to display
        language: {
          info: 'Showing _START_ to _END_ of _TOTAL_ prompts',
        },
        order: [[1, 'asc']],
      })
      .columns()
      .every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
          that.search(this.value).draw();
        });
      });
    tableDetails('queries-list');

    function tableDetails(selector) {
      let count = $('#' + selector)
        .DataTable()
        .column(0)
        .data().length;
      if (count > 10) {
        $('#' + selector + '_length').show();
        $('.dataTables_filter').show();
        $('#' + selector + '_info').show();
        $('#' + selector + '_paginate').show();
      } else {
        $('#' + selector + '_length').hide();
        $('.dataTables_filter').show();
        $('#' + selector + '_info').show();
        $('#' + selector + '_paginate').show();
      }
    }

    // custom functions
    if (localStorage.getItem('Query List') !== null) {
      let LinkData = JSON.parse(localStorage.getItem('Query List'));
      let promptData = [];
      if (localStorage.getItem('prompt list') !== null) {
        promptData = JSON.parse(localStorage.getItem('prompt list'));
      }

      // slno
      // if (localStorage.getItem('prompt list') === null) {
      $.each(LinkData, function (key, value) {
        let { query_id, userId, query_name, query_desc, promptList } = value;
        if (Object.hasOwn(value, 'promptList')) {
          $.each(promptList, function (k, item) {
            console.log('item: ', item);
            let { prompt, id } = item;
            let $id = query_id + 'P' + id;

            if (promptData.length > 0) {
              let [data] = promptData.filter((curElem) => {
                if (curElem.promptId === $id) {
                  return curElem;
                }
              });
              console.log('data: ', data);
              if (typeof data === 'object') {
                let {
                  prompt,
                  merge_status,
                  promptId,
                  userId,
                  query_name,
                  query_id,
                  history_icon,
                } = data;
                mainPromptData.push(data);

                if (merge_status == false) {
                  let history =
                    '<i class="fa fa-history old-history" aria-hidden="true"></i>';
                  let icon = history_icon == true ? history : '';
                  $('#queries-list')
                    .DataTable()
                    .row.add(
                      $(
                        `<tr role="row" data-id="${promptId}" data-query-id="${query_id}"> <td width="7%"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td><a href="prompt-view.html?v=${promptId}"> ${prompt} </a> ${icon}</td><td width="10%"> <a href="users-view.html?v=${userId}"> ${userId} </a> </td> <td width="10%"> <a href="query-view.html?v=${query_id}"> ${query_id} </a> </td> <td width="33%"> ${query_name} </td> </tr>`
                      )
                    )
                    .draw();
                }
              } else {
                mainPromptData.push({
                  promptId: $id,
                  prompt,
                  query_id,
                  userId,
                  query_name,
                  tag: [],
                  merge_id: '',
                  merge_status: false,
                  history_icon: false,
                  checked: false,
                  mergePromptText: [],
                });

                $('#queries-list')
                  .DataTable()
                  .row.add(
                    $(
                      `<tr role="row" data-id="${$id}"> <td width="7%"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td><a href="prompt-view.html?v=${$id}">  ${prompt} </a></td><td width="10%"> <a href="users-view.html?v=${userId}"> ${userId} </a> </td><td width="10%"> <a href="query-view.html?v=${query_id}"> ${query_id} </a> </td> <td width="33%"> ${query_name} </td> </tr>`
                    )
                  )
                  .draw();
              }
            } else {
              mainPromptData.push({
                promptId: $id,
                prompt,
                query_id,
                userId,
                query_name,
                tag: [],
                merge_id: '',
                merge_status: false,
                history_icon: false,
                checked: false,
                mergePromptText: [],
              });

              $('#queries-list')
                .DataTable()
                .row.add(
                  $(
                    `<tr role="row" data-id="${$id}"> <td width="7%"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td><a href="prompt-view.html?v=${$id}">  ${prompt} </a></td><td width="10%"> <a href="users-view.html?v=${userId}"> ${userId} </a> </td><td width="10%"> <a href="query-view.html?v=${query_id}"> ${query_id} </a> </td> <td width="33%"> ${query_name} </td> </tr>`
                  )
                )
                .draw();
            }
          });
        }
      });
      localStorage.setItem('prompt list', JSON.stringify(mainPromptData));

      tableDetails('queries-list');
    }

    // table checkbox functionality
    $('#main_checkbox').on('click', function () {
      mainPromptData = mainPromptData.map((item) => {
        return { ...item, checked: true };
      });

      let status = $('#main_checkbox').is(':checked');
      if (status) {
        $(document)
          .find('[name="sub_checkbox[]"]')
          .each(function () {
            $(this).prop('checked', true);
          });
        $('.tag-icon').show();
        $('.merge-icon').show();
      } else {
        $(document)
          .find('[name="sub_checkbox[]"]')
          .each(function () {
            $(this).prop('checked', false);
          });
        $('.tag-icon').hide();
        $('.merge-icon').hide();
      }
    });

    // icons enable functionality
    $(document).on('click', '[name="sub_checkbox[]"]', function () {
      let id = $(this).parents('tr').attr('data-id');
      let currentStatus = $(this).is(':checked');
      let checked = [];
      mainPromptData = mainPromptData.map((item) => {
        if (item.promptId == id) {
          checked.push(currentStatus);
          return { ...item, checked: currentStatus };
        } else {
          checked.push(item.checked);
          return item;
        }
      });
      let len = checked.filter((v) => v === true).length;
      if (len == 1) {
        $('.tag-icon').attr('disabled', false);
        $('.merge-icon').attr('disabled', true);
      } else if (len > 1) {
        $('.tag-icon').attr('disabled', false);
        $('.merge-icon').attr('disabled', false);
      } else {
        $('.tag-icon').attr('disabled', true);
        $('.merge-icon').attr('disabled', true);
      }
    });

    function tableUpdate() {
      $('#queries-list').DataTable().clear().draw();
      $.each(mainPromptData, function (k, item) {
        let {
          prompt,
          merge_status,
          promptId,
          userId,
          query_name,
          history_icon,
          query_id,
        } = item;
        if (merge_status == false) {
          let history =
            '<i class="fa fa-history old-history" aria-hidden="true"></i>';
          let icon = history_icon == true ? history : '';
          $('#queries-list')
            .DataTable()
            .row.add(
              $(
                `<tr role="row" data-id="${promptId}" data-query-id="${query_id}"> <td width="7%"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td><a href="prompt-view.html?v=${promptId}"> ${prompt} </a> ${icon}</td><td width="10%"> <a href="users-view.html?v=${userId}"> ${userId} </a> </td> <td> <a href="query-view.html?v=${query_id}"> ${query_id} </a> </td> <td width="33%"> ${query_name} </td> </tr>`
              )
            )
            .draw();
        }
      });
      tableDetails('queries-list');
      $('.tag-icon').attr('disabled', true);
      $('.merge-icon').attr('disabled', true);
    }

    // merge functionality
    $('.merge-icon').on('click', function () {
      let uniqueId = [];
      $.each(mainPromptData, function (key, item) {
        let status = item.checked;
        if (status) {
          let id = item.query_id;
          if (!uniqueId.includes(id)) {
            uniqueId.push(id);
          }
        }
      });
      if (uniqueId.length == 1) {
        $('#merge-confirm-popup-modal').modal('show');
      } else {
        $('#merge-error-popup-modal').modal('show');
      }

      // $('#merge-confirm-popup-modal').modal('show');
    });

    // merge confirmed
    $('.merge-prompts-list').on('click', function () {
      let mergeMainId = '';
      let num = 0;
      var mergePromptInfo = [];
      mainPromptData = mainPromptData.map((item, i) => {
        // mergePromptText = [];
        if (item['checked'] === true) {
          if (num == 0) {
            num++;
            mergeMainId = item['promptId'];
            if (item['mergePromptText'].length > 0) {
              mergePromptInfo.push(...item['mergePromptText']);
            }
            return { ...item, history_icon: true, checked: false };
          } else {
            num++;
            if (item['mergePromptText'].length > 0) {
              mergePromptInfo.push(
                { id: item['promptId'], prompt: item['prompt'] },
                ...item['mergePromptText']
              );
            } else {
              mergePromptInfo.push({
                id: item['promptId'],
                prompt: item['prompt'],
              });
            }
            item['merge_id'] = mergeMainId;
            item['merge_status'] = true;
            item['history_icon'] = false;
            item['mergePromptText'] = [];
            item['checked'] = false;
            return item;
          }
        } else {
          return { ...item, checked: false };
        }
      });

      mainPromptData = mainPromptData.map((item, i) => {
        if (item['promptId'] === mergeMainId) {
          item['mergePromptText'] = mergePromptInfo;
          return item;
        } else {
          return item;
        }
      });

      localStorage.setItem('prompt list', JSON.stringify(mainPromptData));
      tableUpdate();
      $('#merge-confirm-popup-modal').modal('hide');
    });

    // history view functionality
    $(document).on('click', '.old-history', function () {
      let id = $(this).parents('tr').attr('data-id');
      let promptLists = JSON.parse(localStorage.getItem('prompt list'));
      let [currentHistory] = promptLists.filter((item) => {
        if (item.promptId == id) {
          return item;
        }
      });
      let html = `<ul>`;
      let nestedList = currentHistory.mergePromptText;
      $.each(nestedList, function (key, value) {
        html += `<li data-parent-id="${id}" data-prompt-id="${value.id}" data-prompt="${value.prompt}" class="prompt-merged-list"><span class="prompt-text">${value.prompt}</span> <span class="prompt-undo"><i class="fa fa-undo un-merge-icon" title="Unmerge prompt" aria-hidden="true"></i></span></li>`;
      });

      html += `</ul>`;
      $('.merge_list').html(html);
      $('#merge-popup-modal').modal('show');
    });

    function tagCheck() {
      if (localStorage.getItem('prompt tags') !== null) {
        promptTags = JSON.parse(localStorage.getItem('prompt tags'));
        let keys = Object.keys(promptTags);
        let html = '';
        $.each(keys, function (key, value) {
          let len = promptTags[value].length;
          html += `<li><a href="javascript:void(0)">${value} (${len})</a></li>`;
        });
        $('.tag-list-ul').html(html);
        $('.tag-details-outer').show();
      }
    }

    // un-merge prompt list
    $(document).on('click', '.un-merge-icon', function () {
      let promptId = $(this)
        .parents('li.prompt-merged-list')
        .attr('data-prompt-id');

      let prompt = $(this).parents('li.prompt-merged-list').attr('data-prompt');
      let parentId = $(this)
        .parents('li.prompt-merged-list')
        .attr('data-parent-id');

      mainPromptData = mainPromptData.map((item, i) => {
        if (item['promptId'] == promptId) {
          item['merge_id'] = '';
          item['merge_status'] = false;
          $(this).parents('li.prompt-merged-list').remove();
          return item;
        } else {
          if (item['promptId'] == parentId) {
            item.mergePromptText = item.mergePromptText.filter((curElem, i) => {
              if (curElem.id != promptId) {
                return curElem;
              }
            });
            if (item.mergePromptText.length < 1) {
              item.history_icon = false;
              $('#merge-popup-modal').modal('hide');
            }
          }
          return item;
        }
      });

      localStorage.setItem('prompt list', JSON.stringify(mainPromptData));
      tableUpdate();
    });
  }); // json data end
});
