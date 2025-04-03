function getRelativeLuminance(rgb) {
  // var rgb = [255,0,0];
  var rgb = rgb.map(function (c) {
    c /= 255;
    return c < 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return (21.26 * rgb[0] + 71.52 * rgb[1] + 7.22 * rgb[2]) / 100;
}

function colorContrast(c1, c2) {
  var l1 = getRelativeLuminance(c1);
  var l2 = getRelativeLuminance(c2);
  var ret = (l1 + 0.05) / (l2 + 0.05);
  // 0.05 for not dividing with 0
  return ret < 1 ? 1 / ret : ret;
}

function getFontColor(rgbRy, p) {
  if (colorContrast(rgbRy, [255, 255, 255]) > 4.5) {
    p.style.color = 'white';
  } else {
    p.style.color = 'black';
  }
}
