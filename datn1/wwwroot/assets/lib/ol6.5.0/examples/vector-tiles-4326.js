(window.webpackJsonp = window.webpackJsonp || []).push([
    [169], {
        396: function (e, t, o) {
            "use strict";
            o.r(t);
            var r = o(103),
                n = o(82),
                a = o(88),
                s = o(2),
                c = o(175),
                i = o(78);
            i.d.length = 14;
            for (var p = 0; p < 14; ++p) i.d[p] = .703125 / Math.pow(2, p + 1);
            Object(c.b)("map", "https://api.maptiler.com/maps/basic-4326/style.json?key=get_your_own_D6rA4zTHduk6KOKTXzGB").then((function (e) {
                var t = new n.a({
                    extent: [-180, -90, 180, 90],
                    tileSize: 512,
                    resolutions: i.d
                }),
                    o = e.get("mapbox-style");
                e.getLayers().forEach((function (e) {
                    var n = e.get("mapbox-source");
                    if (n && "vector" === o.sources[n].type) {
                        var s = e.getSource();
                        e.setSource(new a.a({
                            format: new r.a,
                            projection: "EPSG:4326",
                            urls: s.getUrls(),
                            tileGrid: t
                        }))
                    }
                })), e.setView(new s.a({
                    projection: "EPSG:4326",
                    zoom: o.zoom,
                    center: o.center
                }))
            }))
        }
    },
    [
        [396, 0]
    ]
]);
//# sourceMappingURL=vector-tiles-4326.js.map