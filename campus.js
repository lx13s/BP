
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
    new Viewpoint("main_viewpoint-human", "-0.76461 0.33955 11.39530", "-0.78724 0.61627 0.02182 0.08991"),  // от-к ректорату, высота, от-к витезнему намнести
    new Viewpoint("main_viewpoint-bird", "-8.88020 18.60237 13.51623", "-0.78298 -0.56043 -0.26993 1.10296")
  ),
  new Item(
    "FEL",
    new Viewpoint("fel_human", "-1.15427 0.36467 7.81001", "-0.03665 -0.99870 -0.03537 1.53646"),
    new Viewpoint("fel_bird", "-2.17067 5.24240 10.78380", "-0.66205 -0.68064 -0.31373 1.21638")
  ),
  new Item(
    "FS",
    new Viewpoint("stroj_human", "-1.15427 0.36467 2.76583", "-0.03488 -0.99877 -0.03537 1.58590"),
    new Viewpoint("stroj_bird", "-2.99693 5.59042 -0.25765", "0.19969 0.90957 0.36443 4.06632")
  ),
  new Item(
    "NTK",
    new Viewpoint("ntk_human", "-1.16524 0.36467 0.45499", "-0.06312 -0.99738 -0.03532 1.02260"),
    new Viewpoint("ntk_bird", "-2.54777 6.77093 2.00792", "-0.67601 -0.66711 -0.31300 1.21343")
  ),
  new Item(
    "FCE",
    new Viewpoint("stavebni_human", "-0.63949 0.36467 -3.62284", "-0.93547 0.35315 0.01370 0.08292"),
    new Viewpoint("stavebni_bird", "-4.98515 6.94844 0.21307", "-0.79983 -0.57433 -0.17441 0.72574")
  ),
  new Item(
    "FIT/FA",
    new Viewpoint("fit_human", "3.08990 0.36467 -3.62284", "-0.95328 0.30191 0.01069 0.07426"),
    new Viewpoint("fit_bird", "0.10475 10.19714 -1.42952", "-0.85969 -0.44993 -0.24185 1.11757")
  ),
  new Item(
    "Rektorat",
    new Viewpoint("rektorat_human", "9.69538 0.36467 9.41136", "-0.08213 0.99600 0.03527 0.81423"),
    new Viewpoint("rektorat_bird", "9.26513 7.19641 15.86503", "-0.97437 0.20566 0.09116 0.85385")
  )
];

// Function for creation viewpoint table
function render() {
  var scene = document.getElementById("scene");
  var navmenu = document.getElementById("button_table");
  var flag = false;
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
      if(!flag) {
        flag = true;
        img_bird.setAttribute('class', 'viewpoint_button_active viewpoint_button');
      } else {
        img_bird.setAttribute('class', 'viewpoint_button');
      }
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
    element.innerHTML = '<img src="arrow-down.png" class="slide_icon">';
    element.setAttribute('active', 'false');
    $("#" + parent.id + "> .slide").css('opacity', '0');
    $(parent).css('height', '65px');
  } else {
    element.innerHTML = '<img src="arrow-up.png" class="slide_icon">';
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

var camPos;
var camRot;
function viewFunc(evt) {        // show viewpoint values
      if (evt) {
      	var pos = evt.position;
      	var rot = evt.orientation;
  		  var mat = evt.matrix;
        camPos = pos.x.toFixed(4)+' '+pos.y.toFixed(4)+' '+pos.z.toFixed(4);
        camRot = rot[0].x.toFixed(4)+' '+rot[0].y.toFixed(4)+' '+rot[0].z.toFixed(4)+' '+rot[1].toFixed(4);
        //document.getElementById("viewMat").innerHTML = "&ltViewpoint position='" + camPos + "' orientation='" + camRot + "'&gt";
      }

        // update 2d marker also if camera changes since projection is now wrong
        /*var trans = x3dom.fields.SFVec3f.parse(document.getElementById('bar').getAttribute("translation"));
	      var pos2d = runtime.calcPagePos(trans.x, trans.y, trans.z);
        var anno = document.getElementById("anno2d");

        anno.innerHTML = "(" + pos2d[0] + ", " + pos2d[1] + ")";
        anno.style.left = (pos2d[0]+1) + "px";
        anno.style.top = (pos2d[1]+1) + "px";*/
}

function annotationtest() {
  var x3d = document.getElementById('x3d_id');
  var rek = $("#scene__rektorat_old").attr('translation').split(' ');
  var pos2d = x3d.runtime.calcPagePos(parseFloat(rek[0]), parseFloat(rek[1]), parseFloat(rek[2])-5);
  var anno = document.getElementById("anno2d");
  anno.innerHTML = "(" + pos2d[0] + ", " + pos2d[1] + ")";
  anno.style.left = (pos2d[0]+1) + "px";
  anno.style.top = (pos2d[1]+1) + "px";
}

// Function for creation Viewpoint
function createViewpoint(scene, viewpoint) {
  if (viewpoint == null) return;
  var viewpointView = document.createElement("Viewpoint");
  viewpointView.id = viewpoint.id;
  viewpointView.className = "testName";
  scene.appendChild(viewpointView);
  document.getElementById(viewpoint.id).addEventListener('viewpointChanged', viewFunc, false);
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
  activeViewpointId = viewid;
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
  /*table.addEventListener('mouseover', function() {
    document.getElementById("scene_terrain_texture").setAttribute('url', 'bigger_map_light.png'); //Добавить _ что бы начало работать
  }, false);
  table.addEventListener('mouseout', function() {
    document.getElementById("scene__terrain_texture").setAttribute('url', 'map.png');
  }, false);*/
  objectsAnnotations();
  document.getElementById("tmp_viewpoint").addEventListener('viewpointChanged', viewFunc, false);
}

function rotate_map(value) {
  var rotation_angle = parseFloat($('#scene_rotation').attr('rotation').split(',')[3]);
  rotation_angle += 0.5 * value;
  $('#scene_rotation').attr('rotation','0,1,0,' + rotation_angle);
}

function zoom(delta) {
	var vpt = document.getElementById("main_viewpoint-bird");
	vpt.fieldOfView = parseFloat(vpt.fieldOfView) + delta;
}

var buildings = [
  ["scene__fel_0Geo", "FEL", "scene__fel_mat_0", "0.4 0.4 0.4", "0.6 0.6 0.6"],
  ["scene__ntk_0Geo", "NTK", "scene__ntk_mat_2", "0.4 0.4 0.4", "0.6 0.6 0.6"],
  ["scene__fs_0Geo", "FS", "scene__fs_mat_3", "0.4 0.4 0.4", "0.6 0.6 0.6"],
  ["scene__labs_0Geo", "Labs", "scene__labs_mat_4", "0.4 0.4 0.4", "0.6 0.6 0.6"],
  ["scene__rektorat_old_0Geo", "Old Rektorat", "scene__rek_old_mat_5", "0.4 0.4 0.4", "0.6 0.6 0.6"],
  ["scene__vsht_0Geo", "Vscht", "scene__vscht_mat_6", "0.4 0.4 0.4", "0.6 0.6 0.6"],
  ["scene__fit1_0Geo", "FIT/FA", "scene__fit_mat_7", "0.4 0.4 0.4", "0.6 0.6 0.6"],
  ["scene__fce1_0Geo", "FCE", "scene__fce_mat_8", "0.4 0.4 0.4", "0.6 0.6 0.6"],
  ["scene__rektorat_new1_0Geo", "New Rektorat", "scene__rektorat_new_mat_9", "0.4 0.4 0.4", "0.6 0.6 0.6"]
]

// Находит актуальный индекс элемента в массиве по значению.
function findIndexInData(data, property, value) {
    var result = -1;
    data.some(function (item, i) {
        if (item[property] === value) {
            result = i;
            return true;
        }
    });
    return result;
}

// Подсветка зданий при наведении, изменение курсора и текста в аннотации
function objectsAnnotations()
{
  for (var building of buildings)
  {
    var testObject = document.getElementById(building[0]);
    testObject.addEventListener('mouseover', function() {
      var firstIndex = findIndexInData(buildings, 0, this.id);
      $("x3d>canvas").css("cursor", "pointer");
      $("#anno2d").html(buildings[firstIndex][1]);
      var material = document.getElementById(buildings[firstIndex][2]);
      $(material).attr("diffuseColor", buildings[firstIndex][4]);
    }, false);
    testObject.addEventListener('mouseout', function() {
      var firstIndex = findIndexInData(buildings, 0, this.id);
      $("x3d>canvas").css("cursor", "grab");
      $("#anno2d").html("Annotation");
      var material = document.getElementById(buildings[firstIndex][2]);
      $(material).attr("diffuseColor", buildings[firstIndex][3]);
    }, false);
  }
}

var paused = false;
var activeViewpointId;

function pauseTour() {
  if (!paused)
  {
    var viewpointId = activeViewpointId;
    var tmpview = document.getElementById("pause_viewpoint");
    tmpview.setAttribute('position', camPos);
    tmpview.setAttribute('orientation', camRot);
    tmpview.setAttribute('description', 'pause_camera');
    tmpview.setAttribute("set_bind","true");
  } else {
    setViewpointById(activeViewpointId);
  }
    if (paused)
      paused = false;
    else
      paused = true;
}

$( document ).ready(function() {
  $("#main_nav").draggable({containment: "window", handle:'.window_header'});
  $("#tour_nav").draggable({containment: "window", handle:'.window_header'});
});

document.onload = function() {
  eventAdd();
  createTourList();
  return;
};
