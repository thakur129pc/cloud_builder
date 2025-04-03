$(document).ready(function () {
  updateScreen($('#in').val());

  $('#in').on('keydown', function (e) {
    setTimeout(() => {
      updateScreen($(this).val());
    }, 0);
  });

  function updateScreen(text) {
    // console.log("text: ", text);
    $('#out').html(
      colorize(text.replace(/\n/g, '<br>').replace(/\t/g, '&#9;'))
    );
  }

  $('#in').on('scroll', function () {
    // set out to be the same as in
    $('#out').css({ top: -$(this).scrollTop() + 'px' });
  });

  function colorize(text) {
    var keywords = [
      'SELECT',
      'FROM',
      'WHERE',
      'LIKE',
      'BETWEEN',
      'FALSE',
      'NULL',
      'FROM',
      'TRUE',
      'AND',
      'OR',
      'NOT',
      'ORDER BY',
      'ASC',
      'DESC',
      'INSERT',
      'VALUES',
      'IS NULL',
      'IS NOT NULL',
      'UPDATE',
      'SET',
      'DELETE',
      'TOP',
      'LIMIT',
      'FETCH',
      'PERCENT',
      'AS',
      'COUNT',
      'AVG',
      'MIN',
      'MAX',
      'SUM',
      'IN',
      'CONCAT',
      'JOIN',
      'INNER',
      'ON',
      'LEFT',
      'RIGHT',
      'FULL OUTER JOIN',
      'FULL JOIN',
      'UNION',
      'GROUP BY',
      'HAVING',
      'EXISTS',
      'ANY',
      'ALL',
      'INTO',
      'CASE',
      'WHEN',
      'THEN',
      'ELSE',
      'END',
      'IFNULL',
      'COALESCE',
      'ISNULL',
      'IIF',
      'IsNull',
      'NVL',
      'CREATE',
      'PROCEDURE',
      'EXEC',
      'DATABASE',
      'DROP',
      'BACKUP',
      'TO DISK',
      'WITH',
      'TABLE',
      'TRUNCATE',
      'ALTER',
      'COLUMN',
      'MODIFY',
      'UNIQUE',
      'PRIMARY',
      'KEY',
      'FOREIGN',
      'CHECK',
      'DEFAULT',
      'INDEX',
      'CONSTRAINT',
      'ADD',
      'REFERENCES',
      'CHECK',
      'GETDATE',
      'AUTO_INCREMENT',
      'IDENTITY',
      'AUTOINCREMENT',
      'SEQUENCE',
      'MINVALUE',
      'VIEW',
      'REPLACE',
      'DISTINCT',
      'RANK',
    ];
    for (const keyword of keywords) {
      text = text.replace(
        new RegExp(`\\b${keyword}\\b`, 'g'),
        `<span style="color:orange">${keyword}</span>`
      );

      text = text.replace(
        new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g'),
        `<span style="color:orange">${keyword.toLowerCase()}</span>`
      );

      // text = text.replace(/--(.*)(\r\n|\r|\n|$)/g, '<span style="color: green;">$&</span>');
    }
    return text;
  }
});
