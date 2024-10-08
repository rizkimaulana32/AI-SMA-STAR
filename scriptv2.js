// Function to create markers
function createMarker(latlng, label) {
  return L.marker(latlng).bindPopup(label);
}

var map = L.map("mapid").setView([-7.55, 110.82], 13); // Centered on Surakarta

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var dataGraph = {};

// Load data from JSON file
$(document).ready(function () {
  $.ajax({
    url: "data.json",
    dataType: "json",
    success: function (data) {
      dataGraph = data; // Assign JSON data to dataGraph
      populateDropdowns(); // Populate dropdowns after loading JSON
      addNodeMarkers(); // Add markers after loading JSON
      addEventListeners(); // Add event listeners for dropdowns
      visualizeShortestPaths(null);
    },
  });
});

// Define graph nodes and edges
var Graph_nodes = {
  A: [["B", 5.3]], // Bandara Adi Sumarmo
  B: [
    ["A", 5.3],
    ["C", 3.6],
    ["L", 4.2],
    ["R", 5],
    ["AM", 2],
    ["AF", 3.6],
  ], // SMK Adi Sumarmo
  C: [
    ["B", 3.6],
    ["D", 3.7],
  ], // SMA Assalaam Sukoharjo
  D: [
    ["C", 3.7],
    ["E", 6.5],
    ["J", 2.4],
    ["K", 8.6],
    ["M", 1.9],
    ["N", 5.1],
    ["T", 7.9],
    ["U", 3.8],
    ["O", 3.7],
    ["AG", 3.3],
    ["AC", 4.8],
    ["Y", 6.2],
  ], // SMA Batik 1 Surakarta
  E: [
    ["D", 6.5],
    ["F", 3.2],
  ], // SMA Al Islam 1 Surakarta
  F: [
    ["E", 3.2],
    ["G", 2.4],
  ], // SMK Negeri 8 Surakarta
  G: [
    ["F", 2.4],
    ["H", 1],
    ["O", 5.1],
    ["X", 0.5],
    ["Q", 2.4],
  ], // SMA Muhammadiyah 3 Surakarta
  H: [
    ["G", 1],
    ["I", 1],
    ["AP", 3.5],
    ["AQ", 1.7],
  ], // Universitas Sebelas Maret
  I: [
    ["J", 34.7],
    ["AQ", 36.7],
  ], // Terminal Palur
  J: [["D", 2.4]], // Sub Terminal Kerten
  K: [
    ["D", 8.6],
    ["L", 7.6],
  ], // SMK Warga
  L: [
    ["K", 7.6],
    ["B", 4.2],
    ["M", 1.5],
    ["AN", 2],
    ["AG", 4.8],
  ], // Sekolah Tinggi Pariwisata Sahid
  M: [
    ["L", 1.5],
    ["D", 1.9],
    ["AN", 0.6],
    ["AO", 3.2],
    ["AP", 4.5],
    ["AF", 1.3],
    ["Z", 3.6],
  ], // SMK Negeri 6 Surakarta
  N: [
    ["D", 5.1],
    ["O", 0.5],
  ], // Victoria Hotel School
  O: [
    ["N", 0.5],
    ["P", 0.7],
    ["D", 3.7],
    ["W", 2.4],
    ["AD", 5.3],
  ], // SMA Muhammadiyah 2 Surakarta
  P: [
    ["O", 0.7],
    ["Q", 2],
    ["Z", 1.2],
    ["AT", 1.1],
  ], // SMA 17
  Q: [
    ["P", 2],
    ["G", 2.4],
  ], // SMA Negeri 1 Surakarta
  R: [
    ["S", 13.2],
    ["B", 5],
  ], // Terminal Kartosuro
  S: [
    ["R", 13.2],
    ["T", 12.8],
  ], // SMA Negeri 1 Kartasura
  T: [
    ["S", 12.8],
    ["D", 7.9],
  ], // Jl. Raya Solo Yogyakarta
  U: [
    ["D", 3.8],
    ["V", 2.7],
  ], // SMA Al-Muayyad Surakarta
  V: [
    ["U", 2.7],
    ["W", 0.8],
  ], // SMA Negeri 7 Surakarta
  W: [
    ["V", 0.8],
    ["O", 3],
    ["AH", 2.4],
    ["Y", 0.4],
  ], // MA Al-Islam Jamsaren Surakarta
  X: [["G", 0.5]], // Tugu Cembengan
  Y: [
    ["D", 6.2],
    ["W", 0.4],
  ], // SMA Kristen 1 Surakarta
  Z: [
    ["M", 3.6],
    ["P", 1.2],
  ], // JL Letjen S.Parman
  AA: [
    ["AB", 0.3],
    ["AT", 10.5],
  ], // Akademi Seni Mangkunegaran Surakarta
  AB: [
    ["AA", 0.3],
    ["AC", 0.8],
  ], // JL Ronggowarsito
  AC: [
    ["AB", 0.8],
    ["D", 4.8],
  ], // JL Diponegoro
  AD: [
    ["O", 5.3],
    ["AE", 0.9],
  ], // JL Ir Soekarno
  AE: [["AD", 0.9]], // Solo Baru
  AF: [
    ["B", 6.4],
    ["M", 1.3],
  ], // JL Letjen. Suprapto
  AG: [
    ["L", 4.8],
    ["D", 3.3],
  ], // JL Dr Moewardi
  AH: [
    ["W", 2.4],
    ["AJ", 4.9],
    ["AI", 0.3],
  ], // SMA Majlis Tafsir Al Qur'an Surakarta
  AI: [["AH", 0.3]], // Sub Terminal Semanggi
  AJ: [
    ["AH", 4.9],
    ["AR", 1.3],
  ], // Pasar Bekonang
  AM: [["B", 2]], // colomadu
  AN: [
    ["L", 2],
    ["M", 0.6],
  ], // SMA N 4 Surakarta
  AO: [["M", 2.7]], // Terminal tirtonadi
  AP: [
    ["M", 4.5],
    ["H", 3.5],
  ], // SMK PGRI 2 Surakarta
  AQ: [
    ["H", 1.7],
    ["I", 2],
  ], // Jl.KH.Maswi
  AR: [
    ["AJ", 1.3],
    ["AS", 2],
  ], // SMA Negeri 1 Mojolaban
  AS: [["AR", 2]], // Bekonang
  AT: [
    ["P", 1.1],
    ["AA", 0.5],
  ], // SMA 1 Muhammadiyah Surakarta
};

// Define heuristic function
function heuristic(n) {
  // Sample heuristic function (replace with actual if needed)
  var H_dist = {
    A: 2,
    B: 2,
    C: 2,
    D: 2,
    E: 2,
    F: 2,
    G: 2,
    H: 2,
    I: 2,
    J: 2,
    K: 2,
    L: 2,
    M: 2,
    N: 2,
    O: 2,
    P: 2,
    Q: 2,
    R: 2,
    S: 2,
    T: 2,
    U: 2,
    V: 2,
    W: 2,
    X: 2,
    Y: 2,
    Z: 2,
    AA: 2,
    AB: 2,
    AC: 2,
    AD: 2,
    AE: 2,
    AF: 2,
    AG: 2,
    AH: 2,
    AI: 2,
    AJ: 2,
    AM: 2,
    AN: 2,
    AO: 2,
    AP: 2,
    AQ: 2,
    AR: 2,
    AS: 2,
    AT: 2,
  };
  return H_dist[n];
}

// Function to find all paths using SMA*
function sma_star(start, goal, max_depth = 1000, max_open_size = 40) {
  var open_set = [
    {
      name: start,
      g: 0,
      h: heuristic(start),
      f: heuristic(start),
      parent: null,
    },
  ];
  var closed_set = new Set();
  var allPaths = []; // Array to store all paths found
  console.log(open_set, closed_set);

  while (open_set.length > 0) {
    open_set.sort((a, b) => a.f - b.f);
    var current = open_set.shift();

    if (current.name === goal) {
      var path = backtrackPath(current);
      allPaths.push(path); // Add the found path to allPaths
      continue; // Continue searching for other paths
    }

    if (closed_set.has(current.name)) {
      continue;
    }

    if (!Graph_nodes[current.name]) {
      console.error(`Node ${current.name} not found in graph.`);
      return null;
    }

    closed_set.add(current.name);

    for (var [neighbor, weight] of Graph_nodes[current.name]) {
      var g = current.g + weight;
      var h = heuristic(neighbor);
      var f = g + h;

      var neighbor_node = { name: neighbor, g: g, h: h, f: f, parent: current };

      var existingNodeIndex = open_set.findIndex(
        (node) => node.name === neighbor && node.f > f
      );
      if (existingNodeIndex !== -1) {
        open_set.splice(existingNodeIndex, 1);
      }

      if (open_set.length >= max_open_size) {
        open_set.sort((a, b) => b.f - a.f);
        open_set.pop();
      }

      open_set.push(neighbor_node);
    }

    if (closed_set.size > max_depth) {
      console.log("Exceeded maximum depth, terminating.");
      break;
    }
  }

  return allPaths;
}

// Function to find the shortest path from all paths
function findShortestPath(allPaths) {
  if (allPaths.length === 0) {
    return null;
  }

  var shortestPath = allPaths[0];
  var minLength = shortestPath.length;

  for (var path of allPaths) {
    if (path.length < minLength) {
      shortestPath = path;
      minLength = path.length;
    }
  }

  return shortestPath;
}

// Function to backtrack the path from goal to start
function backtrackPath(node) {
  var path = [];
  while (node !== null) {
    path.push(node.name);
    node = node.parent;
  }
  path.reverse();
  return path;
}

function populateDropdowns() {
  var startSelect = document.getElementById("startNode");
  var goalSelect = document.getElementById("goalNode");

  startSelect.innerHTML = "";
  goalSelect.innerHTML = "";

  // Set untuk menyimpan nama-nama rute yang sudah ditambahkan
  var addedRoutes = new Set();

  // Iterate through each route in the JSON data
  dataGraph.routes.forEach((route) => {
    if (!addedRoutes.has(route.id)) {
      // Create an option element for the dropdown
      var option = document.createElement("option");
      option.value = route.id;
      option.textContent = route.name;

      // Add the option to the start dropdown
      startSelect.appendChild(option);

      // Add the route ID to the set of added routes
      addedRoutes.add(route.id);
    }
  });
  startSelect.selectedIndex = -1;
  goalSelect.selectedIndex = -1;
}

function addNodeMarkers() {
  dataGraph.routes.forEach((route) => {
    var latLng = [route.lat, route.lng];
    var marker = L.marker(latLng).addTo(map);
    marker.bindPopup(route.id + ": " + route.name);
  });
}

function addEventListeners() {
  var startSelect = document.getElementById("startNode");
  startSelect.addEventListener("change", filterGoalNodeOptions);
}

function filterGoalNodeOptions() {
  var startSelect = document.getElementById("startNode");
  var goalSelect = document.getElementById("goalNode");

  // Clear current options in the goalNode dropdown
  goalSelect.innerHTML = "";

  // Get the selected startNode
  var selectedStartNodeId = startSelect.value;
  var selectedStartNode = dataGraph.routes.find(
    (route) => route.id === selectedStartNodeId
  );

  if (selectedStartNode) {
    var startKoridor = selectedStartNode.koridor;

    // Filter routes that share at least one koridor with the selected startNode
    dataGraph.routes.forEach((route) => {
      var hasCommonKoridor = route.koridor.some((k) =>
        startKoridor.includes(k)
      );
      if (hasCommonKoridor && route.id !== selectedStartNodeId) {
        var option = document.createElement("option");
        option.value = route.id;
        option.textContent = route.name;
        goalSelect.appendChild(option);
      }
    });
  }
}

var pathLayerGroup = null; // Declare pathLayerGroup globally

// Function to visualize all paths with a single color
function visualizeAllPaths(allPaths) {
  if (!Array.isArray(allPaths) || allPaths.length === 0) {
    console.log("No paths found!");
    return;
  }

  // Remove the previous path layer group if it exists
  if (pathLayerGroup !== null) {
    map.removeLayer(pathLayerGroup);
  }

  var fixedColor = "grey"; // Set the fixed color here
  pathLayerGroup = L.layerGroup(); // Initialize pathLayerGroup

  allPaths.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      var startNodeId = path[i];
      var endNodeId = path[i + 1];

      var startNode = dataGraph.routes.find(
        (route) => route.id === startNodeId
      );
      var endNode = dataGraph.routes.find((route) => route.id === endNodeId);

      if (startNode && endNode) {
        var latLngs = [
          [startNode.lat, startNode.lng],
          [endNode.lat, endNode.lng],
        ];

        var polyline = L.polyline(latLngs, { color: fixedColor });
        polyline.addTo(pathLayerGroup);
      }
    }
  });

  // Add the pathLayerGroup to the map
  pathLayerGroup.addTo(map);

  // Fit the map bounds to the paths
  var allLatLngs = allPaths.flatMap((path) => {
    return path.flatMap((nodeId, index) => {
      if (index < path.length - 1) {
        var startNode = dataGraph.routes.find((route) => route.id === nodeId);
        var endNode = dataGraph.routes.find(
          (route) => route.id === path[index + 1]
        );
        if (startNode && endNode) {
          return [
            [startNode.lat, startNode.lng],
            [endNode.lat, endNode.lng],
          ];
        }
      }
      return [];
    });
  });

  map.fitBounds(L.polyline(allLatLngs).getBounds());

  // Update the route information in the sidebar
  var nodeInfoDiv = document.getElementById("allRoutes");
  nodeInfoDiv.innerHTML = "<strong>Semua Rute:</strong>";

  allPaths.forEach((path, index) => {
    var routeLabel = document.createElement("div");
    routeLabel.textContent = `Rute ${index + 1}: ${path.join(" -> ")}`;
    nodeInfoDiv.appendChild(routeLabel);
  });
}
const koridorColors = {
  K1: "red",
  K2: "blue",
  K3: "green",
  K4: "purple",
  K5: "black",
  K6: "magenta",
};

var pathLayer = null;

// Function to visualize the shortest path
function visualizeShortestPaths(path) {
  if (path === null || path.length === 0) {
    console.log("Path does not exist or is empty!");
    if (pathLayer !== null) {
      map.removeLayer(pathLayer); // Remove the current path layer if it exists
    }
    return;
  }

  if (pathLayer !== null) {
    map.removeLayer(pathLayer); // Remove the current path layer if it exists
  }

  var routeDetails = []; // Array to store route details for the sidebar
  var segments = []; // Array to store the segments of the path with their respective colors

  for (let i = 0; i < path.length - 1; i++) {
    var startNodeId = path[i];
    var endNodeId = path[i + 1];

    var startNode = dataGraph.routes.find((route) => route.id === startNodeId);
    var endNode = dataGraph.routes.find((route) => route.id === endNodeId);

    if (startNode && endNode) {
      var latLngs = [
        [startNode.lat, startNode.lng],
        [endNode.lat, endNode.lng],
      ];

      // Determine the color based on the corridor transition
      var startCorridor = startNode.koridor[0];
      var endCorridor = endNode.koridor[0];
      var color;

      if (startCorridor === endCorridor) {
        color = koridorColors[startCorridor] || "black"; // Same corridor
      } else {
        color = koridorColors[endCorridor] || "black"; // Transition to new corridor
      }

      segments.push({ latLngs: latLngs, color: color });

      // Add start node details to the routeDetails array
      if (i === 0) {
        routeDetails.push({
          id: startNode.id,
          name: startNode.name,
          koridor: startNode.koridor[0], // Only the first corridor
        });
      }

      // Add end node details to the routeDetails array
      routeDetails.push({
        id: endNode.id,
        name: endNode.name,
        koridor: endNode.koridor[0], // Only the first corridor
      });
    }
  }

  // Draw each segment with the appropriate color
  pathLayer = L.layerGroup(
    segments.map((segment) =>
      L.polyline(segment.latLngs, { color: segment.color })
    )
  );

  // Add the layer group to the map
  pathLayer.addTo(map);

  map.fitBounds(
    L.polyline(segments.flatMap((segment) => segment.latLngs)).getBounds()
  ); // Fit map to bounds of the path

  // Update Rute Terpendek in the sidebar
  var nodeInfoDiv = document.getElementById("nodeInfo");
  nodeInfoDiv.innerHTML = "<strong>Rute Terpendek:</strong>";

  routeDetails.forEach((route) => {
    var routeLabel = document.createElement("div");
    routeLabel.innerHTML = `
      ID: ${route.id}, Name: ${route.name}, Koridor: 
      <span style="color: ${koridorColors[route.koridor]}">${
      route.koridor
    }</span>
    `;
    nodeInfoDiv.appendChild(routeLabel);
  });
}

// Function to update map with selected start and goal nodes
function findPath() {
  var startNode = document.getElementById("startNode").value;
  var goalNode = document.getElementById("goalNode").value;
  console.log(startNode, goalNode);

  if (startNode === goalNode) {
    alert("Start node and goal node cannot be the same!");
    return;
  }

  if (pathLayerGroup !== null) {
    map.removeLayer(pathLayerGroup); // Remove the current path layer if it exists
  }

  if (pathLayer !== null) {
    map.removeLayer(pathLayer); // Remove the current path layer if it exists
  }

  var path = sma_star(startNode, goalNode);
  var shortestPath = findShortestPath(path);

  if (path !== null) {
    console.log("Path found:", path);
    visualizeAllPaths(path);
    visualizeShortestPaths(shortestPath);
  } else {
    alert("Path not found!");
    console.log("Path does not exist!");
    if (pathLayer !== null) {
      map.removeLayer(pathLayer); // Remove the current path layer if it exists
    }
  }
}

function populateCorridorLegends() {
  var legendsContainer = document.getElementById("corridorLegends");

  Object.entries(koridorColors).forEach(([koridor, color]) => {
    var legendItem = document.createElement("div");
    legendItem.style.marginBottom = "5px";
    legendItem.innerHTML = `
    <div class="flex items-center">
        <div class="w-4 h-4 rounded-full mr-2" style="background-color: ${color};"></div>
        <span class="text-sm font-medium">${koridor}</span>
    </div>`;
    legendsContainer.appendChild(legendItem);
  });

  // add grey legend
  var legendItem = document.createElement("div");
  legendItem.style.marginBottom = "5px";
  legendItem.innerHTML = `
  <div class="flex items-center">
      <div class="w-4 h-4 rounded-full mr-2" style="background-color: grey;"></div>
      <span class="text-sm font-medium">Semua Rute yang Tersedia</span>
  </div>`;
  legendsContainer.appendChild(legendItem);
}

// Call the function to populate legends when the document is ready
document.addEventListener("DOMContentLoaded", function () {
  populateCorridorLegends();
});
