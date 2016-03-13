
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
    new Viewpoint("vscht_human", "3.58396 0.83112 4.03127", "-0.01247 0.99930 0.03539 2.4642"),
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

// Function for creation viewpoint table
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
      img_human.setAttribute('class', 'viewpoint_button');
      img_human.setAttribute('onclick', `setViewpointById('${item.humanViewpoint.id}'); document.getElementById('${item.humanViewpoint.id}').setAttribute('set_bind', 'true'); setHighlightedItem(this);`);
      img_human.setAttribute('title', 'Human view');
      img_div.appendChild(img_human);
    }

    if (item.birdViewpoint) {
      var img_bird = document.createElement("img");
      img_bird.setAttribute('src', 'bird.png');
      img_bird.setAttribute('class', 'viewpoint_button');
      img_bird.setAttribute('onclick', `setViewpointById('${item.birdViewpoint.id}'); document.getElementById('${item.birdViewpoint.id}').setAttribute('set_bind', 'true'); setHighlightedItem(this);`);
      img_bird.setAttribute('title', 'Bird view');
      img_div.appendChild(img_bird);
    }

    navmenu.appendChild(li);
  }
}

function createTourList() {
  for (i = 0; i < items.length; i++) {
    var tour_list_div = document.getElementById("tour_list");
    var list_item = document.createElement("input");
    var label = document.createElement("label");
    var br = document.createElement("br");
    label.innerHTML = items[i].label;
    list_item.setAttribute('type', 'checkbox');
    tour_list_div.appendChild(list_item);
    tour_list_div.appendChild(label);
    tour_list_div.appendChild(br);
  }
}

function route () {
  var viewpointArray = [
    ["fel_human", "false"],
    ["ntk_human", "false"],
    ["vscht_human", "false"]
  ];
  var visitedViewpoints = [];
  for (var i = 0; i < viewpointArray.length; i++)
  {
    setTimeout(movecamera, i * document.getElementById("navType").getAttribute("transitiontime") * 1000, viewpointArray[i][0]);
  }
}

// Функция для показа-скрытия элемента гуи
function hideShowMenu(element) {
  var parent = $(element).parent().get(0);
  if (element.getAttribute('active') == 'true') {
    element.innerHTML = '[+]';
    element.setAttribute('active', 'false');
    $("#" + parent.id + "> .slide").css('opacity', '0');
    $(parent).css('height', '65px');
  } else {
    element.innerHTML = '[-]';
    element.setAttribute('active', 'true');
    $("#" + parent.id + "> .slide").css('opacity', '1');
    $(parent).css('height', 'auto');
  }
}

function movecamera(viewpointId){
  var viewpointItem = document.getElementById(viewpointId);
  setViewpointById(viewpointItem.id);
  viewpointItem.setAttribute('set_bind', 'true');
}

var timePrev = 0;
function viewFunc(evt)
    {
        // show viewpoint values
        //console.log(evt);
        var time = Date.now();
        if ((time - timePrev) > 100) {
          if (evt)
          {
          	var pos = evt.position;
          	var rot = evt.orientation;
      		  var mat = evt.matrix;

              var camPos = pos.x.toFixed(4)+' '+pos.y.toFixed(4)+' '+pos.z.toFixed(4);
              var camRot = rot[0].x.toFixed(4)+' '+rot[0].y.toFixed(4)+' '+rot[0].z.toFixed(4)+' '+rot[1].toFixed(4);

              document.getElementById("viewMat").innerHTML = "&ltViewpoint position='" + camPos + "' orientation='" + camRot + "'&gt";
              timePrev = Date.now();
          }
        }

        // update 2d marker also if camera changes since projection is now wrong
        /*var trans = x3dom.fields.SFVec3f.parse(document.getElementById('bar').getAttribute("translation"));
	      var pos2d = runtime.calcPagePos(trans.x, trans.y, trans.z);
        var anno = document.getElementById("anno2d");

        anno.innerHTML = "(" + pos2d[0] + ", " + pos2d[1] + ")";
        anno.style.left = (pos2d[0]+1) + "px";
        anno.style.top = (pos2d[1]+1) + "px";*/
    }

// Function for creation Viewpoint
function createViewpoint(scene, viewpoint) {
  if (viewpoint == null) return;
  var viewpointView = document.createElement("Viewpoint");
  viewpointView.id = viewpoint.id;
  viewpointView.className = "testName";
  scene.appendChild(viewpointView);
  //document.getElementById(viewpoint.id).addEventListener('viewpointChanged', viewFunc, false);
}

// Change picture on the active button
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

// Change background(class) on the active button
function setHighlightedItem(item) {
  var activeButtons = document.getElementsByClassName('viewpoint_button_active');
  for (var i = 0; i < activeButtons.length; i++) {
    var e = activeButtons[i];
    e.className = e.className
      .split(' ')
      .filter(function(e) { return e.length != 0; })
      .filter(function(e) {return e != 'viewpoint_button_active'})
      .join(' ');
  }
  item.className += ' viewpoint_button_active';
}


function setViewpointById(viewpointId) {
  // Extract all viewpoints from items array into a separate array
  var viewpoint = items.reduce(function(all, e) {
    if (e.birdViewpoint != null) all.push(e.birdViewpoint);
    if (e.humanViewpoint != null) all.push(e.humanViewpoint);
    return all;
    // Then find the one with the appropriate id
  }, []).filter(function(e) {return e.id == viewpointId})[0];

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

// Изменение текстуры при наведении на объект
function eventAdd() {
  var table = document.getElementById("scene__terrain_0Geo");
  if (table == null || table == undefined)
  {
    // Если модель не прогрузилась, подождать 0.5 сек и вызвать снова eventAdd
    setTimeout(eventAdd, 500);
    return;
  }
  table.addEventListener('mouseover', function() {
    document.getElementById("scene_terrain_texture").setAttribute('url', 'bigger_map_light.png'); //Добавить _ что бы начало работать
  }, false);
  table.addEventListener('mouseout', function() {
    document.getElementById("scene__terrain_texture").setAttribute('url', 'bigger_map.png');
  }, false);
}


$( document ).ready(function() {
  $("#main_nav").draggable({containment: "window"});
  $("#tour_nav").draggable({containment: "window"});
});

document.onload = function() {
  eventAdd();
  createTourList();
  return;
};
