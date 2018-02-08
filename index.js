var d3 = require("d3");
var topojson = require("topojson");
var fs = require("fs");
var mkdirp = require("mkdirp");

d3
  .queue()
  .defer(
    d3.json,
    "https://unpkg.com/spanish-topojson-files@1.0.0/with-names/municipalities.json"
  )
  .defer(
    d3.json,
    "https://unpkg.com/spanish-topojson-files@1.0.0/with-names/provinces.json"
  )
  .await(function(error, municipalities, provinces) {
    if (error) throw error;

    var topo_provinces = topojson.feature(
      provinces,
      provinces.objects["provinces"]
    );

    var topo_municipalities = topojson.feature(
      municipalities,
      municipalities.objects["municipalities"]
    );

    var provinces_bb = [];
    topo_provinces.features.forEach(function(d) {
      provinces_bb.push({
        id: d.id,
        name: d.properties.name,
        bb: d3.geoBounds(d)
      });
    });

    var municipalities_bb = [];
    topo_municipalities.features.forEach(function(d) {
      municipalities_bb.push({
        id: d.id,
        name: d.properties.name,
        bb: d3.geoBounds(d)
      });
    });

    mkdirp("data", function(err) {
      if (err) console.error(err);
      else {
        fs.writeFile(
          "data/provinces_bounding_boxes.tsv",
          d3.tsvFormat(provinces_bb)
        );
        fs.writeFile(
          "data/municipalities_bounding_boxes.tsv",
          d3.tsvFormat(municipalities_bb)
        );
      }
    });
  });
