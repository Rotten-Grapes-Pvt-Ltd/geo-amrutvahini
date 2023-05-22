var _conf,
  layerList = [],
  turnedOnLayers = [],
  alllayers = [],
  draw,
  weatherInteraction,
  _fgeom_attrQuery,
  _fgeom_nearestQuery,
  identifyEnabled = false,
  identifyLayerName = [],
  WFS_urls = [],
  featureData = [],
  identifyFeatures = [],
  previousInteractionState = false,
  identifyCord = [],
  infoCols = {},
  _draw_spatlQuery,
  _drawnGeom_spatlQuery,
  getCaps,
  styles = {
    Point: [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({
            color: [255, 255, 255, 0.3],
          }),
          stroke: new ol.style.Stroke({ color: "rgba(255,0,0)", width: 2 }),
        }),
      }),
    ],
    MultiLineString: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "red",
          width: 1,
        }),
      }),
    ],
    LineString: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "red",
          width: 1,
        })
      }),
    ],
    Polygon: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "red",
          lineDash: [4],
          width: 3,
        }),
        fill: new ol.style.Fill({
          color: "rgba(255,0,0,0.2)",
        }),
      }),
    ],
    Circle: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "red",
          width: 2,
        }),
        fill: new ol.style.Fill({
          color: "rgba(255,0,0,0.2)",
        }),
      }),
    ],
    MultiPolygon: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "red",
          lineDash: [4],
          width: 3,
        }),
        fill: new ol.style.Fill({
          color: "rgba(255,0,0,0.2)",
        }),
      }),
    ],
  };

const raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});
const source = new ol.source.Vector({ wrapX: false });
const vector = new ol.layer.Vector({
  source: source,
});

let wktFormat = new ol.format.WKT({
  splitcollection: true
})

var map = new ol.Map({
  target: "map",
  layers: [raster, vector, 
  //   new ol.layer.Tile({
  //   source: new ol.source.TileWMS({
  //     url: _conf.geoserver+ '/giz/wms',
  //     params: {'LAYERS': 'giz:india_boundary', 'TILED': true},
  //     serverType: 'geoserver',
  //     // Countries have transparency, so do not fade tiles:
  //     transition: 0
  //   }),
  //   title: "India_base",
  // })
],
  view: new ol.View({
    projection: "EPSG:4326",
   
    center:[77.2918018858705, 23.857540682484213],
    zoom:4.5
  }),
});

// ========================================
// Layer list Start -----------------------


// Promise.all([
//   fetch(_conf.geoserver + "/rest/layergroups", requestOptions),
//   fetch(_conf.geoserver + "/ows?service=wms&version=1.3.0&request=GetCapabilities", requestOptions)
// ])
// .then(function(responses) {
//   return Promise.all(
//     responses.map(function (response, i) {
//       if(i == 0) {
//         return response.json()
//       } else {
//         return response.text()
//       }
//     })
//   )
// })
// .then(function(result) {
//   var x2js = new X2JS()
//   getCaps = x2js.xml2json(new window.DOMParser().parseFromString(result[1], "text/xml")).WMS_Capabilities.Capability.Layer.Layer
//   getCaps.forEach(element => {
//     if(typeof(element.KeywordList.Keyword) == 'object' ) {
//     infoCols[element.Name.split(':')[1]] = element.KeywordList.Keyword
//     } else  if(typeof(element.KeywordList.Keyword) == 'string' ) {
//       infoCols[element.Name.split(':')[1]] = [element.KeywordList.Keyword]
//       } else {
//       infoCols[element.Name.split(':')[1]] = ''
//     }

//   });
//   result[0].layerGroups.layerGroup.map(function (group) {
//     var eachGroup = [];
//     eachGroup["group"] = group.name;
//     eachGroup["layers"] = [];
//     $.ajax({
//       url: group.href,
//       dataType: "json",
//       async: false,
//       headers: {
//         Authorization: "Basic " + btoa(_conf.username + ":" + _conf.password),
//       },
//       success: function (data) {
//         if(Array.isArray(data.layerGroup.publishables.published)) {
//           data.layerGroup.publishables.published.map(function (layer) {
//             eachGroup["layers"].push(layer.name);
//             alllayers.push(layer.name.split(":")[1]);
//           });
//         } else {
//           var layer = data.layerGroup.publishables.published
//           eachGroup["layers"].push(layer.name);
//           alllayers.push(layer.name.split(":")[1]);
//         }
//       },
//     });
//     layerList.push(eachGroup);
//   });

//   layerList.map(function (each) {
//     var button = document.createElement("button");
//     button.className = "accordion-button collapsed";
//     button.setAttribute("type", "button");
//     button.setAttribute("data-bs-toggle", "collapse");
//     button.setAttribute(
//       "data-bs-target",
//       "#collapse_" + each["group"].toLowerCase().replaceAll(" ", "_")
//     );
//     button.setAttribute("aria-expanded", "false");
//     button.setAttribute(
//       "aria-controls",
//       "collapse_" + each["group"].toLowerCase().replaceAll(" ", "_")
//     );
//     button.appendChild(document.createTextNode(each["group"]));

//     var header = document.createElement("h2");
//     header.className = "accordion-header";
//     header.setAttribute(
//       "id",
//       "heading_" + each["group"].toLowerCase().replaceAll(" ", "_")
//     );
//     header.appendChild(button);

//     var content = document.createElement("div");
//     content.className = "accordion-body";

//     each["layers"].map(function (layer) {
//       var DivFormCheck = createLayerlist(layer, _conf.geoserver);
//       content.appendChild(DivFormCheck);
//     });

//     var collapse = document.createElement("div");
//     collapse.className = "accordion-collapse collapse";
//     collapse.setAttribute(
//       "id",
//       "collapse_" + each["group"].toLowerCase().replaceAll(" ", "_")
//     );
//     collapse.setAttribute(
//       "aria-labelledby",
//       "heading_" + each["group"].toLowerCase().replaceAll(" ", "_")
//     );
//     collapse.setAttribute("data-bs-parent", "#layeraccordion");
//     collapse.appendChild(content);

//     var wrapper = document.createElement("div");
//     wrapper.className = "accordion-item";
//     wrapper.appendChild(header);
//     wrapper.appendChild(collapse);

//     document.getElementById("layeraccordion").appendChild(wrapper);
//   });

//   var option = document.createElement("option");
//   option.innerText = "--SELECT LAYER--";
//   option.selected = true;
//   document.getElementById("qry_layers").appendChild(option);
//   alllayers.map(function (layer) {
//     var option = document.createElement("option");
//     option.innerText = layer;
//     option.value = layer;
//     document.getElementById("qry_layers").appendChild(option);
//   });

//   var option = document.createElement("option");
//   option.innerText = "--SELECT LAYER--";
//   option.selected = true;
//   document.getElementById("qry_layers2").appendChild(option);
//   alllayers.map(function (layer) {
//     var option = document.createElement("option");
//     option.innerText = layer;
//     option.value = layer;
//     document.getElementById("qry_layers2").appendChild(option);
//   });

//   var option = document.createElement("option");
//   option.innerText = "--SELECT LAYER--";
//   option.selected = true;
//   document.getElementById("qry_layers3").appendChild(option);
//   alllayers.map(function (layer) {
//     var option = document.createElement("option");
//     option.innerText = layer;
//     option.value = layer;
//     document.getElementById("qry_layers3").appendChild(option);
//   });
// })
// .catch((error) => console.log("error", error));

function togglelayer(layerName, checked) {
  if (checked) {
    let layer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        visible: true,
        ratio: 1,
        url:  "https://geonode.communitygis.in/geoserver/geonode/wms",
        params: {
          FORMAT: "image/png",
          VERSION: "1.1.0",
          LAYERS: layerName,
          'TILED': true,
          exceptions: "application/vnd.ogc.se_inimage",
        },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      }),
      name: layerName,
    });
    // var opacVal = $("input[type=range][layer='" + layerName + "']").val() / 100;
    // layer.setOpacity(opacVal);
    map.addLayer(layer);
  }else {
    var lyr = getLayerFromMap(layerName);
    map.removeLayer(lyr);
  }
}
const toggleLayerOnMap = (elem, geoserver) => {
  var layerName = elem.getAttribute("layer");
  var workspace = elem.getAttribute("workspace");
  if (elem.checked == true) {
    $("body").css("cursor", "wait")
    if(document.getElementById("style_" + layerName.toLowerCase().replaceAll(" ", "_"))) {
      let layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          visible: true,
          ratio: 1,
          url: geoserver + "/" + workspace + "/wms",
          params: {
            FORMAT: "image/png",
            VERSION: "1.1.0",
            LAYERS: layerName,
            // STYLES: document.getElementById("style_" + layerName.toLowerCase().replaceAll(" ", "_")).value,
            singleTile: false,
            exceptions: "application/vnd.ogc.se_inimage",
          },
          serverType: "geoserver",
          crossOrigin: "anonymous",
        }),
        name: layerName,
      });
      var opacVal = $("input[type=range][layer='" + layerName + "']").val() / 100;
      layer.setOpacity(opacVal);
      map.addLayer(layer);
    } else {
      let layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          visible: true,
          ratio: 1,
          url: geoserver + "/" + workspace + "/wms",
          params: {
            FORMAT: "image/png",
            VERSION: "1.1.0",
            LAYERS: layerName,
            singleTile: false,
            exceptions: "application/vnd.ogc.se_inimage",
          },
          serverType: "geoserver",
          crossOrigin: "anonymous",
        }),
        name: layerName,
      });
      var opacVal = $("input[type=range][layer='" + layerName + "']").val() / 100;
      layer.setOpacity(opacVal);
      map.addLayer(layer);
    }
    $("body").css("cursor", "default")
  } else {
    var lyr = getLayerFromMap(layerName);
    map.removeLayer(lyr);
  }
};

const toggleDropDown = (elem, layerName) => {
  elem.classList.toggle("open");
  document.getElementById("dd_" + layerName).classList.toggle("open_dd");
};

function getLayerFromMap(layername) {
  var lyr = null;
  map.getLayers().forEach(function (layer) {
    if (layer != undefined) {
      if (layer.get("name") === layername) {
        lyr = layer;
      }
    }
  });
  return lyr;
}

function layerOpac(val,layername) {

    var opacVal = val / 100;
    var layer = getLayerFromMap(layername);
    if (layer != null) {
      layer.setOpacity(opacVal);
    }
}

document.getElementById("fetchLayers").addEventListener("click", function(e) {
  if(document.getElementById("geoserver").value == "") {
    swal({
      position: "center",
      icon: "error",
      title: "Please enter geoserver url",
      showConfirmButton: false,
      timer: 2000,
    });
    return
  }

  $("body").css("cursor", "wait")
  document.getElementById("layersFromWMS").innerHTML = ""
  var options = {
    "url": document.getElementById("geoserver").value,
    "method": "GET"
  }
  if(document.getElementById("geoserver_username").value && document.getElementById("geoserver_password").value) {
    options["headers"] = {
      "Authorization": "Basic " + btoa(document.getElementById("geoserver_username").value + ":" + document.getElementById("geoserver_password").value),
    }
  }

  $.ajax(options).done(function (response) {
    var x2js = new X2JS()
    getCaps = x2js.xml2json(response).WMS_Capabilities.Capability.Layer.Layer
    if(getCaps) {
      getCaps.map(function(layer){
        var DivFormCheck = createLayerlist(layer.Name, document.getElementById("geoserver").value.split('/ows')[0])
        if(DivFormCheck)
          document.getElementById("layersFromWMS").appendChild(DivFormCheck)
      })
      $("body").css("cursor", "default")
      swal({
        position: "center",
        icon: "success",
        title: "All layers are fetched successfully",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      $("body").css("cursor", "default")
      swal({
        position: "center",
        icon: "error",
        title: "No layer data is found",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }).fail(function(xhr, status, error) {
    $("body").css("cursor", "default")
    swal({
      position: "center",
      icon: "error",
      title: error,
      showConfirmButton: false,
      timer: 2000,
    });
  });
})
// Layer list end -----------------------
// ======================================

// Query builder start ------------------
$("#qry_layers").on("change", function () {
  if ($("#qry_layers").val() != "--SELECT LAYER--") {
    document.getElementById("qry_columns").innerHTML = "";
    fetch(
     
        "https://geonode.communitygis.in/geoserver/ows?service=WFS&version=1.0.0&request=describeFeatureType&typename=" +
        $("#qry_layers").val() +
        "&outputFormat=application%2Fjson"
    )
    .then((response) => response.json())
    .then((result) => {
      var option = document.createElement("option");
      option.innerText = "--SELECT COLUMN--";
      option.selected = true;
      document.getElementById("qry_columns").appendChild(option);
      var properties = result.featureTypes[0].properties;
      for (var i = 0; i < properties.length; i++) {
        if (properties[i].name === "geom") continue;
        var option = document.createElement("option");
        option.innerText = properties[i].name;
        option.value = properties[i].name;
        document.getElementById("qry_columns").appendChild(option);
      }
      $("#qry_columns").select2("destroy").select2()
    })
    .catch((error) => console.log("error", error));
  }
});

$("#qry_columns").on("change", function () {
  if ($("#qry_columns").val() != "--SELECT COLUMN--") {
    document.getElementById("qry_values").innerHTML = "";
    document.getElementById("rawquery").value = $("#qry_columns").val();
    fetch(
      "https://geonode.communitygis.in/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=" +
        $("#qry_layers").val() +
        "&PROPERTYNAME=" +
        $("#qry_columns").val() +
        "&outputFormat=application%2Fjson"
    )
      .then((response) => response.json())
      .then((result) => {
        var uniqval = [];
        var features = result.features;
        for (var i = 0; i < features.length; i++) {
          if (
            !uniqval.includes(features[i].properties[$("#qry_columns").val()])
          )
            uniqval.push(features[i].properties[$("#qry_columns").val()]);
        }
        var option = document.createElement("option");
        option.innerText = "--SELECT VALUE--";
        option.selected = true;
        document.getElementById("qry_values").appendChild(option);
        for (var i = 0; i < uniqval.length; i++) {
          var option = document.createElement("option");
          option.innerText = uniqval[i];
          option.value = uniqval[i];
          document.getElementById("qry_values").appendChild(option);
        }
        $("#qry_values").select2("destroy").select2()
      })
      .catch((error) => console.log("error", error));
  }
});

$("#qry_values").on("change", function () {
  if ($("#qry_layers").val() != "--SELECT VALUE--") {
    document.getElementById("rawquery").value += isNaN($("#qry_values").val())
      ? "'" + $("#qry_values").val() + "'"
      : $("#qry_values").val();
  }
});

function selectExtentHandler(value) {
  if (value == "draw") {
    draw = new ol.interaction.Draw({
      source: source,
      type: "Polygon",
    });
    map.addInteraction(draw);
    draw.on("drawend", function (evt) {
      _fgeom_attrQuery = evt.feature.getGeometry();
      map.removeInteraction(draw);
    });
  } else if (value == "fullExtent") {
    source.clear();
    if ($("#qry_layers option:selected").val() == "--SELECT LAYER--") {
      swal({
        position: "center",
        icon: "error",
        title: "Please choose a layer first!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    map.getInteractions().forEach(function (interaction) {
      if (interaction instanceof ol.interaction.Draw) {
        map.removeInteraction(interaction);
      }
    });
  } else {
    source.clear();
    map.getInteractions().forEach(function (interaction) {
      if (interaction instanceof ol.interaction.Draw) {
        map.removeInteraction(interaction);
      }
    });
  }
}

$(".queryOperators").on("click", function () {
  document.getElementById("rawquery").value += this.innerText;
});

$("#clearText").on("click", function () {
  document.getElementById("rawquery").value = "";
});

function showQueryResult() {
  $("body").css("cursor", "wait");
  if ($("input[name=extent]:checked").val() == "mapExtent") {
    var extent = ol.proj.transformExtent(
      map.getView().calculateExtent(map.getSize()),
      "EPSG:4326",
      "EPSG:4326"
    );
  } else if ($("input[name=extent]:checked").val() == "fullExtent") {
    var extent = [];
  } else if ($("input[name=extent]:checked").val() == "draw") {
    var extent = ol.proj.transformExtent(
      _fgeom_attrQuery.getExtent(),
      "EPSG:4326",
      "EPSG:4326"
    );
  } else {
    swal({
      position: "center",
      icon: "error",
      title: "Please select extent to run query!",
      showConfirmButton: false,
      timer: 2000,
    });
    $("body").css("cursor", "default");
    return;
  }
  
  var layername = "attributeResult" + new Date().getTime();
  if ($("#qryselection option:selected").val() == "new") {
    var layerArray = map.getLayers().getArray(),
      len = layerArray.length;
    while (len > 0) {
      var x = layerArray[len - 1];
      var name = x.get("name");
      if (name != undefined && name.startsWith("attributeResult")) {
        map.removeLayer(x);
        len = layerArray.length;
      } else {
        len = len - 1;
      }
    }
  }
  var url =
    "https://geonode.communitygis.in/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    $("#qry_layers").val() +
    "&outputFormat=application%2Fjson&CQL_FILTER=(" +
    $("#rawquery").val() +
    ")";
  if (extent.length == 4) {
    url += " and bbox(geom," + extent + ")";
  }
  fetch(url)
  .then(res => res.json())
  .then(result => {
if (result.features.length == 0) {
  swal({
    position: "center",
    icon: "error",
    title: "No result found for the query!",
    showConfirmButton: false,
    timer: 2000,
  });
} else {
 
  var layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(result),
      // projection: "EPSG:4326",
      crossOrigin: "anonymous",
      serverType: "geoserver",
    }),
    style: function (feature, resolution) {
      return styles[feature.getGeometry().getType()];
    },
  });
     
    
    $("#clearText").click();
    $("#qry_values option").prop("selected", function () {
      return this.defaultSelected;
    });
    $("#qry_columns option").prop("selected", function () {
      return this.defaultSelected;
    });
    $("#qry_layers option").prop("selected", function () {
      return this.defaultSelected;
    });
    document.querySelector('input[name="extent"]:checked').checked = false;
  
  $("body").css("cursor", "default");
  layer.set("name", layername);
  map.addLayer(layer);
  map.getView().fit(layer.getSource().getExtent(), map.getSize());
}
})
}

function clearQueryResult() {
  clearGraphic();
  $("#clearText").click();
  $("#qry_values option").prop("selected", function () {
    return this.defaultSelected;
  });
  $("#qry_columns option").prop("selected", function () {
    return this.defaultSelected;
  });
  $("#qry_layers option").prop("selected", function () {
    return this.defaultSelected;
  });
  $("#qry_values").select2("val", "");
  $("#qry_columns").select2("val", "");
  $("#qry_layers").select2("val", "--SELECT LAYER--");
  document.querySelector('input[name="extent"]:checked').checked = false;
}

function clearGraphic() {
  var layerArray = map.getLayers().getArray(),
    len = layerArray.length,
    layer;
  while (len > 0) {
    layer = layerArray[len - 1];
    var name = layer.get("name");
    if (name != undefined && (name.startsWith("attributeResult") || name.startsWith("spatialResult") || name.startsWith("nearestResult"))) {
      map.removeLayer(layer);
      len = layerArray.length;
    } else {
      len = len - 1;
    }
  }
  source.clear();
  var lyr = getLayerFromMap('drawnGeom')
	if (lyr != null)
		map.removeLayer(lyr)
  _fgeom_nearestQuery = undefined
}

$("#qry_extent").on("change", function() {
  if($("#qry_extent").val() == "drawextent") {
    var source = new ol.source.Vector({ wrapX: false })
		var vector = new ol.layer.Vector({
			source: source
		})
		vector.set('name', 'drawnGeom')
		map.addLayer(vector)

    _draw_spatlQuery = new ol.interaction.Draw({
      source: source,
      type: "Circle",
      geometryFunction: new ol.interaction.Draw.createBox()
    })
    map.addInteraction(_draw_spatlQuery)
    _draw_spatlQuery.on('drawend', function (evt) {	      
      var cext = ol.proj.transformExtent(evt.feature.getGeometry().getExtent(), 'EPSG:4326', 'EPSG:4326')
      var exttgeom = ol.geom.Polygon.fromExtent(cext)
      _drawnGeom_spatlQuery = new ol.geom.Polygon(exttgeom.getCoordinates())
      map.removeInteraction(_draw_spatlQuery)
    }, this)
  } else if($("#qry_extent").val() == "mapextent") {
    map.removeInteraction(_draw_spatlQuery)
    var lyr = getLayerFromMap('drawnGeom')
		if (lyr != null) {
			map.removeLayer(lyr)
		}
    var cext = ol.proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:4326', 'EPSG:4326')
    var exttgeom = ol.geom.Polygon.fromExtent(cext)
    _drawnGeom_spatlQuery = new ol.geom.Polygon(exttgeom.getCoordinates())
  } else {
    map.removeInteraction(_draw_spatlQuery)
  }
})

function showQueryResultSP() {
  if($("#qry_extent").val() == "--SELECT EXTENT--") {
    swal({
      position: "center",
      icon: "error",
      title: "Please choose extent",
      showConfirmButton: false,
      timer: 2000,
    })
    return
  }
  $("body").css("cursor", "wait")
  var layername = "spatialResult" + new Date().getTime()
  var arr = []
  var arrGeom = []
  for (var i = 0; i < _drawnGeom_spatlQuery.getCoordinates()[0].length; i++) {
    arr.push(_drawnGeom_spatlQuery.getCoordinates()[0][i])
  }
  arrGeom.push(arr)
  const format = new ol.format.WKT()
  polygon = new ol.geom.Polygon(arrGeom)
  var polygonWKT = format.writeGeometry(polygon)

  var lyr = getLayerFromMap('drawnGeom')
	if (lyr != null) {
		map.removeLayer(lyr)
	}

  if ($("#qryselection2").val() == "new") {
    var layerArray = map.getLayers().getArray(),
      len = layerArray.length
    while (len > 0) {
      var x = layerArray[len - 1]
      var name = x.get("name")
      if (name != undefined && name.startsWith("spatialResult")) {
        map.removeLayer(x)
        len = layerArray.length
      } else {
        len = len - 1
      }
    }
  }

  var url =
    _conf.geoserver +
    "/" +
    _conf.workspace +
    "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    _conf.workspace +
    "%3A" +
    $("#qry_layers2").val() +
    "&outputFormat=application%2Fjson&CQL_FILTER=" +
    $("#qry_op").val() +
    "(geom, " + polygonWKT + ")";

    var layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON(),
        projection: "EPSG:4326",
        crossOrigin: "anonymous",
        serverType: "geoserver",
      }),
      style: function (feature, resolution) {
        return styles[feature.getGeometry().getType()];
      },
    })
    layer.on("change", function (e) {
      if (layer.getSource().getFeatures().length > 0) {
        map.getView().fit(e.target.getSource().getExtent(), map.getSize());
      } else {
        swal({
          position: "center",
          icon: "error",
          title: "No result found for the query!",
          showConfirmButton: false,
          timer: 2000,
        })
      }
      $("#qry_extent option").prop("selected", function () {
        return this.defaultSelected;
      });
      $("#qry_op option").prop("selected", function () {
        return this.defaultSelected;
      });
      $("#qry_layers2 option").prop("selected", function () {
        return this.defaultSelected;
      });
      $("#qryselection2 option").prop("selected", function () {
        return this.defaultSelected;
      });
      $("#qry_layers2").select2("val", "--SELECT LAYER--");
      $("body").css("cursor", "default")
    })
    $("body").css("cursor", "default")
    layer.set('name', layername)
    map.addLayer(layer)
}

function clearQueryResultSP() {
  clearGraphic();
  $("#qry_extent option").prop("selected", function () {
    return this.defaultSelected;
  });
  $("#qry_op option").prop("selected", function () {
    return this.defaultSelected;
  });
  $("#qry_layers2 option").prop("selected", function () {
    return this.defaultSelected;
  });
  $("#qryselection2 option").prop("selected", function () {
    return this.defaultSelected;
  });
  $("#qry_layers2").select2("val", "--SELECT LAYER--");
}
// Query builder end ------------------

// Measurement Start -----------------------
// Drwa layer
const draw_source = new ol.source.Vector();

const draw_vector = new ol.layer.Vector({
  source: draw_source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: "rgba(255, 171, 7, 0.4)",
    }),
    stroke: new ol.style.Stroke({
      color: "#ffcc33",
      width: 2,
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: "#ffcc33",
      }),
    }),
  }),
  zIndex: 999,
  layerName: "Area",
});

/**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */
let sketch;

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
let helpTooltip;

/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
let helpTooltipElement;

/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
let measureTooltip;

/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
let measureTooltipElement;

/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
const continuePolygonMsg = "Click to continue drawing the polygon";

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
const continueLineMsg = "Click to continue drawing the line";

const pointerMoveHandler = function (evt) {
  if (evt.dragging) {
    return;
  }
  /** @type {string} */
  let helpMsg = "Click to start drawing";

  if (sketch) {
    const geom = sketch.getGeometry();
    if (geom instanceof ol.geom.Polygon) {
      helpMsg = continuePolygonMsg;
    } else if (geom instanceof ol.geom.LineString) {
      helpMsg = continueLineMsg;
    }
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);

  helpTooltipElement.classList.remove("hidden");
};

// add the draw layer
map.addLayer(draw_vector);



// Add a observable to the map - so that the helptooltip can be hidden
map.getViewport().addEventListener("mouseout", function () {
  if(previousInteractionState)
    helpTooltipElement.classList.add("hidden");
});

// Type
let typeSelect = "length"; // area

/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: "bottom-center",
    stopEvent: false,
    insertFirst: false,
  });
  map.addOverlay(measureTooltip);
}

/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement("div");
  helpTooltipElement.className = "ol-tooltip hidden";
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: "center-left",
  });
  map.addOverlay(helpTooltip);
}

/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
const formatLength = function (line) {
  const length = ol.sphere.getLength(line, { projection: "EPSG:4326" });
  let output;
  if (length > 100) {
    output = Math.round(length / 1000) + " km";
  } else {
    output = Math.round(length) + " m";
  }
  return output;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
const formatArea = function (polygon) {
  const area = ol.sphere.getArea(polygon, { projection: "EPSG:4326" });
  let output;
  if (area > 10000) {
    output = Math.round(area / 1000000) + " km<sup>2</sup>";
  } else {
    output = Math.round(area) + " m<sup>2</sup>";
  }
  return output;
};

// Add the dynamic interaction
function addInteraction() {
  const type = typeSelect == "area" ? "Polygon" : "LineString";
  draw = new ol.interaction.Draw({
    source: draw_source,
    type: type,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(224, 15, 15, 0.4)",
      }),
      stroke: new ol.style.Stroke({
        color: "rgba(0, 0, 0, 0.5)",
        lineDash: [10, 10],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
      }),
    }),
  });
  map.addInteraction(draw);

  createMeasureTooltip();
  createHelpTooltip();

  let listener;
  draw.on("drawstart", function (evt) {
    // set sketch
    sketch = evt.feature;

    /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
    let tooltipCoord = evt.coordinate;

    listener = sketch.getGeometry().on("change", function (evt) {
      const geom = evt.target;
      let output;
      if (geom instanceof ol.geom.Polygon) {
        output = formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof ol.geom.LineString) {
        output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
      } else {
        alert("Invalid geometry type.");
      }
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
    });
  });

  draw.on("drawend", function () {
    measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
    measureTooltip.setOffset([0, -7]);
    // unset sketch
    sketch = null;
    // unset tooltip so that a new one can be created
    measureTooltipElement = null;
    createMeasureTooltip();
    ol.Observable.unByKey(listener);
  });
}

const toggleMeasureAreaInteraction = () => {
  console.log("Toggle Draw.", previousInteractionState);
  if (previousInteractionState) {
    map.removeInteraction(draw);
    map.removeOverlay(helpTooltip);
    map.removeOverlay(measureTooltip);
    ol.Observable.unByKey(map.on('pointermove', pointerMoveHandler))
    
    previousInteractionState = !previousInteractionState;
  } else {
    addInteraction();
    map.addOverlay(helpTooltip);
    map.addOverlay(measureTooltip);
    map.on("pointermove", pointerMoveHandler);
    
    previousInteractionState = !previousInteractionState;
  }
}

// Change the Geom type
function changeMeasureType(type) {
  // console.log(type);
  typeSelect = type;
  // Remove old Interaction
  map.removeInteraction(draw);
  // Add new Ineteraction
  // Check button state
  if (previousInteractionState) {
    addInteraction();
  }

  console.log(typeSelect);
}

// Clear Measure Features
function clearMeasureFeatures() {
  draw_source.clear();
  document
    .querySelectorAll(".ol-overlaycontainer > div")
    .forEach((e) => e.remove());

  // Remove old Interaction
  map.removeInteraction(draw);
}
// Measurement End -----------------------

// Weather ---------------

document.getElementById("closeNavContent").addEventListener("click", function() {
  var lyr = getLayerFromMap('weather')
  if(lyr) {
    map.removeInteraction(weatherInteraction)
    map.removeLayer(lyr)
    weatherlayer.getSource().clear()
  }
})

let weatherlayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: function (feature) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({color: 'black'}),
        stroke: new ol.style.Stroke({
          color: [255,0,0], width: 2
        })
      })
    })
  },
  zIndex: 100,
});
map.addLayer(weatherlayer);

function pointOnMap(flag) {
  weatherlayer.getSource().clear();
  $("#openmapweather").html("");
  if (flag) {
    var _weather = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${_conf.weather}`
      })
    })
    _weather.set('name', 'weather')
    map.addLayer(_weather)
    weatherInteraction = new ol.interaction.Draw({
      type: "Point",
      source: weatherlayer.getSource(),
    });
    weatherInteraction.on("drawstart", (e) => {
      weatherlayer.getSource().clear();
    });
    map.addInteraction(weatherInteraction);
    weatherInteraction.on("drawend", (e) => {
      let latlong = e.feature.getGeometry().getCoordinates()
      latlong = ol.proj.transform(latlong, _conf.map.projection, "EPSG:4326")
      $("#openmapweather").html("")
      getWeatherInfo(latlong[1], latlong[0])
    })
  } else {
    map.removeInteraction(weatherInteraction)
    var lyr = getLayerFromMap('weather')
    map.removeLayer(lyr)
  }
}

function getWeatherInfo(lat, lon) {
  $.get("https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon="+ lon +"&units=metric&appid="+ _conf.weather, function(data) {
    //location
    if(data.name) {
      var h6 = document.createElement('h6')
      var i = document.createElement('i')
      i.className = 'icofont-location-pin'
      h6.appendChild(i)
      h6.appendChild(document.createTextNode(data.name))
      document.getElementById('openmapweather').appendChild(h6)
    }
    //location

    //summary
    var row = document.createElement('div')
    row.className = 'row align-items-center text-center'
    var col1 = document.createElement('div')
    col1.className = 'col'
    var col2 = document.createElement('div')
    col2.className = 'col'

    var div = document.createElement('div')
    var img = document.createElement('img')
    img.setAttribute('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png')
    div.appendChild(img)
    var small = document.createElement('small')
    small.className = 'd-block  '
    small.appendChild(document.createTextNode(capitalize(data.weather[0].description)))
    div.appendChild(small)
    col1.appendChild(div)

    var h2 = document.createElement('h2')
    h2.appendChild(document.createTextNode(Math.round(data.main.temp) + ' °C'))
    h2.className = 'm-0'
    col2.appendChild(h2)
    var small = document.createElement('small')
    small.appendChild(document.createTextNode('Feels like ' + Math.round(data.main.feels_like) + ' °C'))
    col2.appendChild(small)

    row.appendChild(col1)
    row.appendChild(col2)
    document.getElementById('openmapweather').appendChild(row)
    //summary

    //detailed info
    var row = document.createElement('div')
    row.className = 'row mt-3'
    row.setAttribute('style', 'font-size: 13px;')
    document.getElementById('openmapweather').appendChild(row)

    var col = document.createElement('div')
    col.className = 'col-6 text-center my-2'
    var h4 = document.createElement('h4')
    h4.appendChild(document.createTextNode(data.main.humidity + '%'))
    h4.className = 'm-0'
    col.appendChild(h4)
    col.appendChild(document.createTextNode('Humidity'))
    row.appendChild(col)

    var col = document.createElement('div')
    col.className = 'col-6 text-center my-2'
    var h4 = document.createElement('h4')
    h4.appendChild(document.createTextNode(data.wind.speed + ' m/s'))
    h4.className = 'm-0'
    col.appendChild(h4)
    col.appendChild(document.createTextNode('Wind speed'))
    row.appendChild(col)

    var col = document.createElement('div')
    col.className = 'col-6 text-center my-2'
    var h4 = document.createElement('h4')
    h4.appendChild(document.createTextNode(Math.round(data.main.temp_max) + ' °C'))
    h4.className = 'm-0'
    col.appendChild(h4)
    col.appendChild(document.createTextNode('Max. temperature'))
    row.appendChild(col)

    var col = document.createElement('div')
    col.className = 'col-6 text-center my-2'
    var h4 = document.createElement('h4')
    h4.appendChild(document.createTextNode(Math.round(data.main.temp_min) + ' °C'))
    h4.className = 'm-0'
    col.appendChild(h4)
    col.appendChild(document.createTextNode('Min. temperature'))
    row.appendChild(col)
    //detailed
  })
}

function capitalize(input) {  
  var words = input.split(' ')
  var CapitalizedWords = []
  words.forEach(element => {  
    CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length).toLowerCase());  
  })
  return CapitalizedWords.join(' ')
}

// Weather end---------------

// Info popup start

/**
 * Elements that make up the popup.
 */
const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

function startIdentification() {
  if (identifyEnabled) {
    $("#identify").removeClass("active")
    identifyEnabled = false
    map.removeOverlay(overlay)
    ol.Observable.unByKey(map.on('singleclick', identifyF))
    ol.Observable.unByKey(map.on('pointermove', identifyH))
  } else {
    $("#identify").addClass("active")
    identifyEnabled = true
    map.addOverlay(overlay);
    map.on('singleclick', identifyF);
    map.on('pointermove', identifyH);
  }
}

function identifyH(evt) {
  if (evt.dragging) {
    return
  }
  const pixel = map.getEventPixel(evt.originalEvent)
  const hit = map.forEachLayerAtPixel(pixel, function (layer) {
    if(layer.get('name') != undefined)
      return true
  })
  map.getTargetElement().style.cursor = hit ? 'pointer' : ''
}

function identifyF(evt) {
  identifyLayerName = []
  WFS_urls = []
  featureData = []
  identifyFeatures = []
  identifyCord = evt.coordinate;
  map.forEachLayerAtPixel(evt.pixel, function (layer) {
    if(layer.get('name') != undefined)
      identifyLayerName.push(layer)
  }, {
    hitTolerance: 10
  })
  for (i = 0; i < identifyLayerName.length; i++) {
    map.getLayers().forEach(function(lyr) {
      if (typeof (lyr) != 'undefined' &&  lyr.get('title') != 'India_base' && (lyr.getSource() instanceof ol.source.TileWMS || lyr.getSource() instanceof ol.source.ImageWMS)) {
        // if(lyr.get('title') != 'India_base'){
        WFS_urls.push(fetch(lyr.getSource().getFeatureInfoUrl(identifyCord, map.getView().getResolution(), 'EPSG:4326', { 'INFO_FORMAT': 'application/json' })));
      // }
    }
    })
  }
  if (WFS_urls.length > 0) {
    Promise.all(WFS_urls)
    .then(function (responses) {
      return Promise.all(
        responses.map(function (response) {
          return response.json()
        })
      )
    })
    .then(function (result) {
      result.map(function (data) {
        var features = data.features
        features.forEach(function (feat) {
          if (feat.geometry.type == 'Polygon' || feat.geometry.type == 'MultiPolygon') {
            var eachFeature = new ol.Feature(new ol.geom.Polygon(feat.geometry.coordinates));
          } else if (feat.geometry.type == 'Point' || feat.geometry.type == 'MultiPoint') {
            var eachFeature = new ol.Feature(new ol.geom.Point(feat.geometry.coordinates));
          } else if (feat.geometry.type == 'LineString' || feat.geometry.type == 'MultiLineString') {
            var eachFeature = new ol.Feature(new ol.geom.LineString(feat.geometry.coordinates));
          }
          eachFeature.setId(feat.id)
          props = {}
          if (infoCols[feat.id.split('.')[0]]){
            proparr = infoCols[feat.id.split('.')[0]]
            proparr.forEach(ele => {
              props[ele] = feat.properties[ele]
            })
          }else{
            props = feat.properties
          }
          eachFeature.setProperties(props)
          identifyFeatures.push(eachFeature)
        })
      })
      if (identifyFeatures.length > 0) {
        identifyIndex = 0
        identifyPopupCollection(identifyIndex)
      }
    })
  }
}

function identifyPopupCollection(index) {
  if (identifyFeatures[index] == undefined) {
    return
  }
  var data = identifyFeatures[index].getProperties();
  identifyLayer = identifyFeatures[index].getId() ? identifyFeatures[index].getId().split('.')[0] : 'Vector Layer'
  identifyPopup(data, identifyLayer)
}

function identifyPopup(data, layerName, thelayer) {
  identifypopupLayerName = layerName
  identifiedLayerName = ''
  var key_value = []
  identifiedLayerName = layerName

  var tempKeys = Object.keys(data)
  for (var i = 0; i < tempKeys.length; i++) {
    if (tempKeys[i] === 'geometry' || tempKeys[i] === 'bbox') continue
    if (data[tempKeys[i]]) key_value.push({ key: tempKeys[i], value: data[tempKeys[i]] })
  }

  var tr = '';
  key_value.forEach(function (k_v) {
    tr += '<tr>' +
      '<th>' + k_v.key + '</th>' +
      '<td>' + k_v.value + '</td>' +
      '</tr>';
  });

  var identifytable =
    // '<div><b>Feature Info</b><span></span></div>' +
    // '<div>Layer Name : ' + identifiedLayerName + '</div>' +
    '<table width="100%">' +
    '<tbody>' +
    '<tr>' +
    '<th>Name</th>' +
    '<th>Values</th>' +
    '</tr>' +
    tr +
    '</tbody>'
  identifytable += '</table>'

  // content.innerHTML = identifynav + identifytable
  content.innerHTML =  identifytable
  overlay.setPosition(identifyCord)

  if (identifyIndex == 0) {
    document.getElementById("idLeft").disabled = true;
  }
  if (identifyFeatures.length > 1 && identifyIndex < identifyFeatures.length - 1) {
    document.getElementById("idRight").disabled = false;
  }
  if (identifyFeatures.length > 1 && identifyIndex > 0) {
    document.getElementById("idLeft").disabled = false;
  }
  if (identifyIndex == identifyFeatures.length - 1) {
    document.getElementById("idRight").disabled = true;
  }
  if (identifyFeatures.length == 0) {
    document.getElementById("idLeft").disabled = true;
    document.getElementById("idRight").disabled = true;
  }
}

function identify_left() {
  if (identifyIndex > 0) {
    --identifyIndex;
    identifyPopupCollection(identifyIndex);
  }
}

function identify_right() {
  if (identifyIndex < identifyFeatures.length - 1) {
    ++identifyIndex;
    identifyPopupCollection(identifyIndex);
  }
}

$("#selectLocation").on("click", function(){
  source.clear()
  _fgeom_nearestQuery = undefined
  draw = new ol.interaction.Draw({
    source: source,
    type: "Point",
  });
  map.addInteraction(draw);
  draw.on("drawend", function (evt) {
    _fgeom_nearestQuery = wktFormat.writeGeometry(evt.feature.getGeometry());
    map.removeInteraction(draw);
  });
})

function showNearestQueryResult() {
  if(_fgeom_nearestQuery == undefined) {
    swal({
      position: "center",
      icon: "error",
      title: "Please choose a location",
      showConfirmButton: false,
      timer: 2000,
    })
    return
  }
  if($("#qry_layers3").val() == "--SELECT LAYER--") {
    swal({
      position: "center",
      icon: "error",
      title: "Please choose extent",
      showConfirmButton: false,
      timer: 2000,
    })
    return
  }
  $("body").css("cursor", "wait")
  var sql = `SELECT a.*, ST_AsText(ST_Transform(a.geom, 3857)) geom2, ST_Transform(a.geom, 3857) <-> 'SRID=3857;${_fgeom_nearestQuery}'::geometry AS dist FROM public."${$("#qry_layers3").val()}" a ORDER BY dist LIMIT ${$("#resultNum").val()};`
  $.get("/get-nearest-locations/", {sql: sql}, function(result) {
    if(result.length > 0) {
      var layerArray = map.getLayers().getArray(),
      len = layerArray.length;
      while (len > 0) {
        var x = layerArray[len - 1];
        var name = x.get("name");
        if (name != undefined && name.startsWith("nearestResult")) {
          map.removeLayer(x);
          len = layerArray.length;
        } else {
          len = len - 1;
        }
      }

      var layername = "nearestResult" + new Date().getTime()
      var linelayername = "nearestResultLine" + new Date().getTime()
      var layer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: function (feature, resolution) {
          return styles[feature.getGeometry().getType()];
        },
      })
      layer.set('name', layername)
      map.addLayer(layer)

      var linelayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: function (feature, resolution) {
          var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: "red",
              width: 1,
            }),
            text: new ol.style.Text({
              textAlign: 'center',
              textBaseline: 'middle',
              text: feature.get('distance').toString() + " KM",
              font: '15px Arial',
              fill: new ol.style.Fill({color: '#aa3300'}),
              stroke: new ol.style.Stroke({color: '#ffffff', width: 3}),
              offsetX: 0,
              offsetY: 0
            })
          })
          return [style]
        },
      })
      linelayer.set('name', linelayername)
      map.addLayer(linelayer)

      result.map(function(row) {
        var to = wktFormat.readGeometry(row[row.length - 2], "EPSG:4326")
        var feature = new ol.Feature({
          geometry: to
        })
        layer.getSource().addFeature(feature)

        var from = wktFormat.readGeometry(_fgeom_nearestQuery, "EPSG:4326")
        var coord = [to.getCoordinates(), from.getCoordinates()]
        var linefeat = new ol.Feature({
          geometry: new ol.geom.LineString(coord)
        })
        var dist = row[row.length - 1] / 1000
        linefeat.set("distance", dist.toFixed(2))
        linelayer.getSource().addFeature(linefeat)
      })

      map.getView().fit(layer.getSource().getExtent(), map.getSize());
      $("body").css("cursor", "default")
    } else {
      swal({
        position: "center",
        icon: "error",
        title: "No result found for the query!",
        showConfirmButton: false,
        timer: 2000,
      })
      $("body").css("cursor", "default")
    }
  })
}

function clearNearestQueryResultSP() {
  clearGraphic();
  $("#qry_layers3 option").prop("selected", function () {
    return this.defaultSelected;
  });
  $("#qry_layers3").select2("val", "--SELECT LAYER--");
}
