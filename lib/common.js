function random_choices (n, society) {
  function shuffle (o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  var values = Object.keys(society.values);
  var choices = shuffle(values).slice(0, n);
  return choices;
}

function highest_values (n, society) {
  var values = Object.keys(society.values);
  values.sort(function (value1, value2) {
    if (society.values[value1] < society.values[value2])
      return 1;
    else if (society.values[value1] > society.values[value2])
      return -1;
    else
      return 0;
  });
  return values.slice(0, n);
}

module.exports = {
  values: {
    random: random_choices,
    highest: highest_values
  }
};