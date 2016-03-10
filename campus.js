
var document = window['document'];

function Viewpoint(id, position, orientation) {
  this.id = id;
  this.position = position;
  this.orientation = orientation;
}

function Item(label, humanViewpoint, birdViewpoint) {
  this.label = label;
  this.humanViewpoint = humanViewpoint;
  this.birdViewpoint = birdViewpoint;
}

var items = [
  new Item(
    "Main View",
    new Viewpoint("main_viewpoint", "6.19233 17.03234 14.97798", "-0.92058 0.35485 0.16314 0.92633"),
    new Viewpoint("main_viewpoint", "6.19233 17.03234 14.97798", "-0.92058 0.35485 0.16314 0.92633")
  ),
  new Item(
    "FEL",
    new Viewpoint("fel_human", "5.37279 0.80854 5.78953", "-0.09364 -0.99498 -0.03524 0.72308"),
    new Viewpoint("fel_bird", "5.91318 4.45228 9.18205", "-0.98307 -0.17635 -0.04983 0.55979")
  ),
  new Item(
    "FS",
    new Viewpoint("stroj_human", "1.51959 0.95661 2.88509", "-0.10303 -0.99406 -0.03520 0.66215"),
    new Viewpoint("stroj_bird", "1.96262 4.73040 5.79700", "-0.94810 -0.30089 -0.10280 0.69173")
  ),
  new Item(
    "NTK",
    new Viewpoint("ntk_human", "-1.67761 0.99083 0.46360", "-0.39252 -0.90633 -0.15652 0.82896"),
    new Viewpoint("ntk_bird", "-0.71579 3.95287 2.85322", "-0.98615 -0.15548 -0.05774 0.72032")
  ),
  new Item(
    "Rektorat",
    new Viewpoint("rektorat_human", "0.00834 0.97858 9.65671", "-0.23030 -0.97251 -0.03444 0.30515"),
    new Viewpoint("rektorat_bird", "1.06168 4.56242 12.11615", "-0.99708 0.07184 0.02576 0.69043")
  ),
  new Item(
    "UCT",
    new Viewpoint("vscht_human", "3.58396 0.83112 4.03127", "-0.01247 0.99930 0.03539 2.46424"),
    new Viewpoint("vscht_bird", "6.22605 4.28331 3.82716", "-0.17713 0.93133 0.31819 2.18501")
  ),
  new Item(
    "FIT/FA",
    new Viewpoint("fit_human", "-1.00371 1.09106 -4.58535", "-0.35385 2.91567 0.19062 1.05553"),
    new Viewpoint("fit_bird", "0.00792 6.52269 -1.44391", "-0.86206 0.46977 0.19016 0.87801")
  ),
  new Item(
    "FCE",
    new Viewpoint("stavebni_human", "-3.05289 0.98532 -1.46281", "-0.07690 0.99641 0.03529 0.86308"),
    new Viewpoint("stavebni_bird", "-3.73804 6.22770 3.60835", "-0.77737 0.60450 0.17399 0.70920")
  )
];

function render() {
  var scene = document.getElementById("scene");
  var navmenu = document.getElementById("button_table");

  for (var item of items) {
    createViewpoint(scene, item.humanViewpoint);
    createViewpoint(scene, item.birdViewpoint);

    var li = document.createElement('li');

    var label = document.createElement("label");
    label.innerHTML = item.label;
    li.appendChild(label);

    var img_div = document.createElement('span');
    img_div.setAttribute('class', 'img_div');
    li.appendChild(img_div);

    if (item.humanViewpoint) {
      var img_human = document.createElement("img");
      img_human.setAttribute('src', 'human.png');
      img_human.setAttribute('class', 'img_button');
      img_human.setAttribute('onclick', `setViewpointById('${item.humanViewpoint.id}'); document.getElementById('${item.humanViewpoint.id}').setAttribute('set_bind', 'true'); setHighlightedItem(this);`);
      img_human.setAttribute('title', 'Human view');
      img_div.appendChild(img_human);
    }

    if (item.birdViewpoint) {
      var img_bird = document.createElement("img");
      img_bird.setAttribute('src', 'bird.png');
      img_bird.setAttribute('class', 'img_button');
      img_bird.setAttribute('onclick', `setViewpointById('${item.birdViewpoint.id}'); document.getElementById('${item.birdViewpoint.id}').setAttribute('set_bind', 'true'); setHighlightedItem(this);`);
      img_bird.setAttribute('title', 'Bird view');
      img_div.appendChild(img_bird);
    }

    navmenu.appendChild(li);
  }
}

function createViewpoint(scene, viewpoint) {
  if (viewpoint == null) return;

  var viewpointView = document.createElement("Viewpoint");
  viewpointView.id = viewpoint.id;
  scene.appendChild(viewpointView);
}

function changeImage(element) {
    var imgs = document.getElementsByClassName("img_button");
    for (var i = 0; i < imgs.length; i++)
    {
         if (element !== imgs[i] && imgs[i].src.match("human")) {
              imgs[i].src="human.png";
            }
        if (element !== imgs[i] && imgs[i].src.match("bird")) {
             imgs[i].src="bird.png";
           }
    }

    if (!element.src.match("active")) {
        if (element.src.match("human"))
          element.src = "human_active.png";
        else {
          element.src = "bird_active.png";
        }
    }
}

function setHighlightedItem(item) {
  for (var e of document.getElementsByClassName('img_button_active')) {
    e.className = e.className
      .split(' ')
      .filter(e => e.length != 0)
      .filter(e => e != 'img_button_active')
      .join(' ');
  }
  item.className += ' img_button_active';
}

function setViewpointById(viewpointId) {
  // Extract all viewpoints from items array into a separate array
  var viewpoint = items.reduce((all, e) => {
    if (e.birdViewpoint != null) all.push(e.birdViewpoint);
    if (e.humanViewpoint != null) all.push(e.humanViewpoint);
    return all;
    // Then find the one with the appropriate id
  }, []).filter(e => e.id == viewpointId)[0];

  var tmpview = document.getElementById("tmp_viewpoint");
  tmpview.setAttribute('position', viewpoint.position);
  tmpview.setAttribute('orientation', viewpoint.orientation);
  tmpview.setAttribute('description', 'camera');
  tmpview.setAttribute("set_bind","true");
  var viewid = viewpoint.id;
  var view = document.getElementById(viewid);
  view.setAttribute('position', viewpoint.position);
  view.setAttribute('orientation', viewpoint.orientation);
  view.setAttribute('description', 'camera');
}

function eventAdd() {
  var table = document.getElementById("RedDiceFixed__terrain_0Geo");
  if (table == null || table == undefined)
  {
    setTimeout(eventAdd, 500);
    return;
  }
  table.addEventListener('mouseover', function() {
    document.getElementById("RedDiceFixed__terrain_texture").setAttribute('url', 'bigger_map_light.png');
  }, false);
  table.addEventListener('mouseout', function() {
    document.getElementById("RedDiceFixed__terrain_texture").setAttribute('url', 'bigger_map.png');
  }, false);
}

function shape() {
  //var x = document.getElementById("bigger_nameSpace__first1:lambert7_0");
  //var x = document.getElementById("RedDiceFixed__lambert5_3").setAttribute('diffuseColor', '1.0 0.0 0.0');
  var x = document.getElementById("RedDiceFixed__fit_shape");
}


document.onload = function() {
  eventAdd();
  return;
};

/*table.onmouseout = function(event) {
  var target = event.target;
  target.style.background = '';
  text.value += "mouseout " + target.tagName + "\n";
  text.scrollTop = text.scrollHeight;
};*/
