function random_choices (n, society) {
  function shuffle (o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  var values = Object.keys(society.values);
  var choices = [];
  for (i = 0; i < n; i++) {
    choices.push(values.pop());
    values = shuffle(values);
  }
  return choices;
}

function highest_values (n, society) {
  return Object.keys(society.values)
  .sort(function (value1, value2) {
    return society[value1] > society[value2] ? value1 : value2;
  })
  .slice(0, n);
}

module.exports = {
  values: {
    random: random_choices,
    highest: highest_values
  }
};