printjson(db.tilesets.drop());

printjson(db.maps.drop());

printjson(db.tilesets.insert([{
    name: "dungeon",
    image: "dungeon.png",
    tiles: [
        {xy: [0, 0], name: "wbl"},
        {xy: [1, 0], name: "wb1"},
        {xy: [2, 0], name: "wb2"},
        {xy: [3, 0], name: "wb3"},
        {xy: [4, 0], name: "wb4"},
        {xy: [5, 0], name: "wbr"},
        {xy: [6, 0], name: "wbc"},

        {xy: [0, 1], name: "tl"},
        {xy: [1, 1], name: "t1"},
        {xy: [2, 1], name: "trs"},
        {xy: [3, 1], name: "ts"},
        {xy: [4, 1], name: "tls"},
        {xy: [5, 1], name: "tr"},
        {xy: [6, 1], name: "tc"},

        {xy: [0, 2], name: "l"},
        {xy: [1, 2], name: "n"},
        {xy: [2, 2], name: "rs"},
        {xy: [3, 2], name: "s"},
        {xy: [4, 2], name: "ls"},
        {xy: [5, 2], name: "r"},
        {xy: [6, 2], name: "c"},

        {xy: [0, 3], name: "bl"},
        {xy: [1, 3], name: "b1"},
        {xy: [2, 3], name: "brs"},
        {xy: [3, 3], name: "bs"},
        {xy: [4, 3], name: "bls"},
        {xy: [5, 3], name: "br"},
        {xy: [6, 3], name: "bc"},
        {xy: [7, 3], name: "black"},

        {xy: [0, 4], name: "wbrcn"},
        {xy: [1, 4], name: "wb5"},
        {xy: [2, 4], name: "wb6"},
        {xy: [3, 4], name: "wb7"},
        {xy: [4, 4], name: "wb8"},
        {xy: [5, 4], name: "wblcn"},
        {xy: [6, 4], name: "wtc"},
        {xy: [7, 4], name: "brb"},

        {xy: [0, 5], name: "wr1"},
        {xy: [1, 5], name: "mls"},
        {xy: [2, 5], name: "m1"},
        {xy: [3, 5], name: "m2"},
        {xy: [4, 5], name: "mrs"},
        {xy: [5, 5], name: "wl1"},
        {xy: [6, 5], name: "wcc"},
        {xy: [7, 5], name: "blb"},

        {xy: [0, 6], name: "wr2"},
        {xy: [1, 6], name: "ml"},
        {xy: [2, 6], name: "mr"},
        {xy: [3, 6], name: "mlrs"},
        {xy: [4, 6], name: "mrls"},
        {xy: [5, 6], name: "wl2"},
        {xy: [6, 6], name: "wlc"},
        {xy: [7, 6], name: "tlb"},

        {xy: [0, 7], name: "wr3"},
        {xy: [1, 7], name: "nls"},
        {xy: [2, 7], name: "ms"},
        {xy: [3, 7], name: "nrs"},
        {xy: [4, 7], name: "mms"},
        {xy: [5, 7], name: "wl3"},
        {xy: [6, 7], name: "wrc"},
        {xy: [7, 7], name: "trb"},

        {xy: [0, 8], name: "wtrcn"},
        {xy: [1, 8], name: "wt1"},
        {xy: [2, 8], name: "wt2"},
        {xy: [3, 8], name: "wt3"},
        {xy: [4, 8], name: "wt4"},
        {xy: [5, 8], name: "wtlcn"},
        {xy: [6, 8], name: "mc"},
        {xy: [7, 8], name: "lb"},

        {xy: [0, 9], name: "wtl"},
        {xy: [1, 9], name: "wtr"},
        {xy: [2, 9], name: "n1"},
        {xy: [3, 9], name: "light"},
        {xy: [4, 9], name: "dark"},
        {xy: [5, 9], name: "os1"},
        {xy: [6, 9], name: "mcs"},
        {xy: [7, 9], name: "tb"},

        {xy: [0, 10], name: "n2"},
        {xy: [1, 10], name: "n3"},
        {xy: [2, 10], name: "n4"},
        {xy: [3, 10], name: "n5"},
        {xy: [4, 10], name: "n6"},
        {xy: [5, 10], name: "os2"},
        {xy: [6, 10], name: "td"},
        {xy: [7, 10], name: "sarch"},

        {xy: [0, 11], name: "al"},
        {xy: [1, 11], name: "acrs"},
        {xy: [2, 11], name: "acls"},
        {xy: [3, 11], name: "ar"},
        {xy: [4, 11], name: "ac"},
        {xy: [5, 11], name: "acs"},
        {xy: [6, 11], name: "alrs"},
        {xy: [7, 11], name: "arls"}
    ]
}, {
    name: "earth",
    image: "earth.png",
    tiles: [
        {xy: [0, 0], name: "tl"},
        {xy: [1, 0], name: "t1"},
        {xy: [2, 0], name: "trs"},
        {xy: [3, 0], name: "ts"},
        {xy: [4, 0], name: "tls"},
        {xy: [5, 0], name: "tr"},
        {xy: [6, 0], name: "tlrs"},
        {xy: [7, 0], name: "trls"},
        {xy: [8, 0], name: "tc"},

        {xy: [0, 1], name: "l"},
        {xy: [1, 1], name: "n"},
        {xy: [2, 1], name: "rs"},
        {xy: [3, 1], name: "s"},
        {xy: [4, 1], name: "ls"},
        {xy: [5, 1], name: "r"},
        {xy: [6, 1], name: "lrs"},
        {xy: [7, 1], name: "rls"},
        {xy: [8, 1], name: "c"},

        {xy: [0, 2], name: "bl"},
        {xy: [1, 2], name: "b1"},
        {xy: [2, 2], name: "brs"},
        {xy: [3, 2], name: "bs"},
        {xy: [4, 2], name: "bls"},
        {xy: [5, 2], name: "br"},
        {xy: [6, 2], name: "blrs"},
        {xy: [7, 2], name: "brls"},
        {xy: [8, 2], name: "bc"},

        {xy: [0, 3], name: "ml"},
        {xy: [1, 3], name: "m1"},
        {xy: [2, 3], name: "m2"},
        {xy: [3, 3], name: "m3"},
        {xy: [4, 3], name: "mr"},
        {xy: [5, 3], name: "mlrs"},
        {xy: [6, 3], name: "ms"},
        {xy: [7, 3], name: "mrls"},
        {xy: [8, 3], name: "mc"},

        {xy: [0, 4], name: "b2"},
        {xy: [1, 4], name: "b3"},
        {xy: [2, 4], name: "t2"},
        {xy: [3, 4], name: "t3"},
        {xy: [4, 4], name: "mrs"},
        {xy: [5, 4], name: "mls"},
        {xy: [7, 4], name: "drop"},
        {xy: [8, 4], name: "crackn"},

        {xy: [0, 5], name: "tel"},
        {xy: [1, 5], name: "ter"},
        {xy: [2, 5], name: "telrs"},
        {xy: [3, 5], name: "terls"},
        {xy: [4, 5], name: "mel"},
        {xy: [5, 5], name: "mer"},
        {xy: [6, 5], name: "melrs"},
        {xy: [7, 5], name: "merls"},
        {xy: [8, 5], name: "crackb"},

        {xy: [0, 6], name: "dark"},
        {xy: [1, 6], name: "lhd"},
        {xy: [2, 6], name: "rhd"},
        {xy: [3, 6], name: "td"},
        {xy: [4, 6], name: "tld"},
        {xy: [5, 6], name: "trd"},
        {xy: [6, 6], name: "light"},
        {xy: [7, 6], name: "lhl"},
        {xy: [8, 6], name: "rhl"},

        {xy: [0, 7], name: "al"},
        {xy: [1, 7], name: "ac"},
        {xy: [2, 7], name: "ar"},
        {xy: [3, 7], name: "arrs"},
        {xy: [4, 7], name: "alls"},
        {xy: [5, 7], name: "acrs"},
        {xy: [6, 7], name: "acls"},
        {xy: [7, 7], name: "acs"},

        {xy: [0, 8], name: "ttel"},
        {xy: [1, 8], name: "tter"},
        {xy: [2, 8], name: "aldrop"},
        {xy: [3, 8], name: "ardrop"},
        {xy: [4, 8], name: "acel"},
        {xy: [5, 8], name: "acer"}
    ]
}, {
    name: "grass",
    image: "grass.png",
    tiles: [
        {xy: [0, 0], name: "tl1"},
        {xy: [1, 0], name: "t1"},
        {xy: [2, 0], name: "t2"},
        {xy: [3, 0], name: "t3"},
        {xy: [4, 0], name: "tr1"},
        {xy: [5, 0], name: "tc"},
        {xy: [6, 0], name: "light"},
        {xy: [7, 0], name: "dark"},

        {xy: [0, 1], name: "l1"},
        {xy: [1, 1], name: "n1"},
        {xy: [2, 1], name: "n2"},
        {xy: [3, 1], name: "n3"},
        {xy: [4, 1], name: "r1"},
        {xy: [5, 1], name: "tl2"},
        {xy: [6, 1], name: "tr2"},
        {xy: [7, 1], name: "c"},

        {xy: [0, 2], name: "l2"},
        {xy: [1, 2], name: "n4"},
        {xy: [2, 2], name: "n5"},
        {xy: [3, 2], name: "n6"},
        {xy: [4, 2], name: "r2"},
        {xy: [5, 2], name: "l3"},
        {xy: [6, 2], name: "r3"},
        {xy: [7, 2], name: "os1"},

        {xy: [0, 3], name: "rlj"},
        {xy: [1, 3], name: "lrj"},
        {xy: [2, 3], name: "lj"},
        {xy: [3, 3], name: "rj"},
        {xy: [4, 3], name: "cj"},
        {xy: [5, 3], name: "ljs"},
        {xy: [6, 3], name: "rjs"},
        {xy: [7, 3], name: "cjs"},

        {xy: [0, 4], name: "ls"},
        {xy: [1, 4], name: "ms"},
        {xy: [2, 4], name: "rs"},
        {xy: [3, 4], name: "mms"},
        {xy: [4, 4], name: "lls"},
        {xy: [5, 4], name: "rrs"},
        {xy: [6, 4], name: "cs"},
        {xy: [7, 4], name: "os2"},

        {xy: [0, 5], name: "st1"},
        {xy: [1, 5], name: "lst1"},
        {xy: [2, 5], name: "rst1"},
        {xy: [3, 5], name: "cst1"},
        {xy: [4, 5], name: "st2"},
        {xy: [5, 5], name: "lst2"},
        {xy: [6, 5], name: "rst2"},
        {xy: [7, 5], name: "cst2"},

        {xy: [0, 6], name: "rb"},
        {xy: [1, 6], name: "lrb"},
        {xy: [2, 6], name: "trb"},
        {xy: [3, 6], name: "tlrb"},
        {xy: [4, 6], name: "lb"},
        {xy: [5, 6], name: "rlb"},
        {xy: [6, 6], name: "tlb"},
        {xy: [7, 6], name: "trlb"},

        {xy: [0, 7], name: "bb"},
        {xy: [1, 7], name: "lbb"},
        {xy: [2, 7], name: "rbb"},
        {xy: [3, 7], name: "tlbb"},
        {xy: [4, 7], name: "tbb"},
        {xy: [5, 7], name: "trbb"},
        {xy: [6, 7], name: "cbb"},
        {xy: [7, 7], name: "tcbb"},

        {xy: [0, 8], name: "tb"},
        {xy: [1, 8], name: "ltb"},
        {xy: [2, 8], name: "rtb"},
        {xy: [3, 8], name: "ctb"},
        {xy: [4, 8], name: "bbls"},
        {xy: [5, 8], name: "bbms"},
        {xy: [6, 8], name: "bbrs"},
        {xy: [7, 8], name: "bbmms"},

        {xy: [0, 9], name: "lbbs"},
        {xy: [1, 9], name: "rbbs"},
        {xy: [2, 9], name: "lbbrs"},
        {xy: [3, 9], name: "rbbls"},
        {xy: [4, 9], name: "cbbs"},
        {xy: [5, 9], name: "grads"},
        {xy: [6, 9], name: "lhn"},
        {xy: [7, 9], name: "rhn"},

        {xy: [0, 10], name: "rbs"},
        {xy: [1, 10], name: "rbls"},
        {xy: [2, 10], name: "lrbs"},
        {xy: [3, 10], name: "lbs"},
        {xy: [4, 10], name: "lbrs"},
        {xy: [5, 10], name: "rlbs"},
        {xy: [6, 10], name: "lhl"},
        {xy: [7, 10], name: "rhl"},

        {xy: [0, 11], name: "vdark"},
        {xy: [1, 11], name: "sarch"},
        {xy: [2, 11], name: "treels1"},
        {xy: [3, 11], name: "treers1"},
        {xy: [4, 11], name: "treelds1"},
        {xy: [5, 11], name: "treerds1"},
        {xy: [6, 11], name: "trees1"},
        {xy: [7, 11], name: "trees2"},

        {xy: [0, 12], name: "treel1"},
        {xy: [1, 12], name: "treer1"},
        {xy: [2, 12], name: "treels2"},
        {xy: [3, 12], name: "treers2"},
        {xy: [4, 12], name: "treelds2"},
        {xy: [5, 12], name: "treerds2"},
        {xy: [6, 12], name: "treel2"},
        {xy: [7, 12], name: "treer2"},

        {xy: [0, 13], name: "treelj1"},
        {xy: [1, 13], name: "treerj1"},
        {xy: [2, 13], name: "rocklj"},
        {xy: [3, 13], name: "rockrj"},
        {xy: [4, 13], name: "llrs"},
        {xy: [5, 13], name: "rrls"},
        {xy: [6, 13], name: "treelj2"},
        {xy: [7, 13], name: "treerj2"}
    ]
}, {
    name: "objects",
    image: "objects.png",
    tiles: [
        {xy: [0, 0], name: "tree_tl1"},
        {xy: [1, 0], name: "tree_tr1"},
        {xy: [2, 0], name: "tree_tl2"},
        {xy: [3, 0], name: "tree_tr2"},

        {xy: [0, 1], name: "tree_ml1"},
        {xy: [1, 1], name: "tree_mr1"},
        {xy: [2, 1], name: "tree_ml2"},
        {xy: [3, 1], name: "tree_mr2"},

        {xy: [0, 2], name: "tree_bl1"},
        {xy: [1, 2], name: "tree_br1"},
        {xy: [2, 2], name: "tree_bl2"},
        {xy: [3, 2], name: "tree_br2"},

        {xy: [0, 3], name: "tree_tml1"},
        {xy: [1, 3], name: "tree_tmr1"},
        {xy: [2, 3], name: "tree_tml2"},
        {xy: [3, 3], name: "tree_tmr2"},

        {xy: [0, 4], name: "tree_tml3"},
        {xy: [1, 4], name: "tree_tmr3"},
        {xy: [2, 4], name: "tree_tml4"},
        {xy: [3, 4], name: "tree_tmr4"},

        {xy: [0, 5], name: "easter_top"},
        {xy: [2, 5], name: "skull_top"},
        {xy: [3, 5], name: "skull_ftop"},

        {xy: [0, 6], name: "easter_base"},
        {xy: [2, 6], name: "skull_base1"},
        {xy: [3, 6], name: "skull_base2"}
    ]
}, {
    name: "water",
    image: "water.png",
    tiles: [
        {xy: [0, 0], name: "tl"},
        {xy: [1, 0], name: "t1"},
        {xy: [2, 0], name: "t2"},
        {xy: [3, 0], name: "t3"},
        {xy: [4, 0], name: "t4"},
        {xy: [5, 0], name: "t5"},
        {xy: [6, 0], name: "tr"},
        {xy: [7, 0], name: "tc"},

        {xy: [0, 1], name: "tlrs"},
        {xy: [1, 1], name: "ts"},
        {xy: [2, 1], name: "trls"},
        {xy: [3, 1], name: "trs"},
        {xy: [4, 1], name: "tls"},
        {xy: [5, 1], name: "dark"},
        {xy: [6, 1], name: "lhd"},
        {xy: [7, 1], name: "rhd"},

        {xy: [0, 2], name: "l"},
        {xy: [1, 2], name: "n1"},
        {xy: [2, 2], name: "n2"},
        {xy: [3, 2], name: "r"},
        {xy: [4, 2], name: "c"},
        {xy: [5, 2], name: "lrs"},
        {xy: [6, 2], name: "s"},
        {xy: [7, 2], name: "rls"},

        {xy: [0, 3], name: "rs"},
        {xy: [1, 3], name: "ls"},
        {xy: [2, 3], name: "w1"},
        {xy: [3, 3], name: "w2"},
        {xy: [4, 3], name: "w3"},
        {xy: [5, 3], name: "w4"},
        {xy: [6, 3], name: "w5"},
        {xy: [7, 3], name: "w6"},

        {xy: [0, 4], name: "w7"},
        {xy: [1, 4], name: "w8"},
        {xy: [2, 4], name: "w9"},
        {xy: [3, 4], name: "w_post"},
        {xy: [4, 4], name: "bw"},
        {xy: [5, 4], name: "blw"},
        {xy: [6, 4], name: "brw"},
        {xy: [7, 4], name: "light"},

        {xy: [0, 5], name: "tel"},
        {xy: [1, 5], name: "ter"},
        {xy: [2, 5], name: "telrs"},
        {xy: [3, 5], name: "terls"}
    ]
}, {
    name: "wood",
    image: "wood.png",
    tiles: [
        {xy: [0, 0], name: "st1"},
        {xy: [1, 0], name: "hbr1"},
        {xy: [2, 0], name: "hbr2"},
        {xy: [3, 0], name: "hbr3"},
        {xy: [4, 0], name: "post_top"},
        {xy: [5, 0], name: "l_supp"},
        {xy: [6, 0], name: "r_supp"},
        {xy: [7, 0], name: "c_supp"},

        {xy: [0, 1], name: "st2"},
        {xy: [1, 1], name: "v_br1"},
        {xy: [2, 1], name: "v_br2"},
        {xy: [3, 1], name: "v_br3"},
        {xy: [4, 1], name: "post"},
        {xy: [5, 1], name: "lls_supp"},
        {xy: [6, 1], name: "supp"},
        {xy: [7, 1], name: "lrs_supp"},

        {xy: [0, 2], name: "st3"},
        {xy: [2, 2], name: "post_combi"},
        {xy: [3, 2], name: "stump"},
        {xy: [4, 2], name: "post_base"},
        {xy: [5, 2], name: "crs_supp"},
        {xy: [6, 2], name: "cs_supp"},
        {xy: [7, 2], name: "cls_supp"}
    ]
}]));

printjson(db.rpgmaps.insert([{
    name: "drops",
    rows: 32,
    cols: 16,
    mapTiles: [{
        xy: [0, 0],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 0],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 0],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 0],
        tiles: [{
            tileSet: "earth",
            tile: "lrs"
        }]
    }, {
        xy: [4, 0],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [5, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [6, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [7, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [8, 0],
        tiles: [{
            tileSet: "earth",
            tile: "r"
        }]
    }, {
        xy: [9, 0],
        tiles: [{
            tileSet: "earth",
            tile: "rls"
        }]
    }, {
        xy: [10, 0],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [11, 0],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [12, 0],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [13, 0],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [14, 0],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 0],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 1],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 1],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 1],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 1],
        tiles: [{
            tileSet: "earth",
            tile: "lrs"
        }]
    }, {
        xy: [4, 1],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [5, 1],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [6, 1],
        tiles: [{
            tileSet: "earth",
            tile: "crackn"
        }]
    }, {
        xy: [7, 1],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [8, 1],
        tiles: [{
            tileSet: "earth",
            tile: "r"
        }]
    }, {
        xy: [9, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "brls"
        }]
    }, {
        xy: [10, 1],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [11, 1],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [12, 1],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [13, 1],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [14, 1],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 1],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 2],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 2],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 2],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 2],
        tiles: [{
            tileSet: "water",
            tile: "lrs"
        }]
    }, {
        xy: [4, 2],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [5, 2],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [6, 2],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "crackb"
        }]
    }, {
        xy: [7, 2],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [8, 2],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "br"
        }]
    }, {
        xy: [9, 2],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rrs"
        }],
        levels: ["1"]
    }, {
        xy: [10, 2],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [11, 2],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [12, 2],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [13, 2],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [14, 2],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 2],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 3],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 3],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 3],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 3],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [4, 3],
        tiles: [{
            tileSet: "water",
            tile: "lrs"
        }]
    }, {
        xy: [5, 3],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["1"]
    }, {
        xy: [6, 3],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [7, 3],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [8, 3],
        tiles: [{
            tileSet: "grass",
            tile: "rs"
        }],
        levels: ["1"]
    }, {
        xy: [9, 3],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [10, 3],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tr1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 3],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [12, 3],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [13, 3],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [14, 3],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [15, 3],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 4],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 4],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 4],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 4],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [4, 4],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }, {
            tileSet: "objects",
            tile: "tree_tl1",
            "maskLevel": "V7"
        }]
    }, {
        xy: [5, 4],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }, {
            tileSet: "objects",
            tile: "tree_tr1",
            "maskLevel": "V7"
        }],
        levels: ["1"]
    }, {
        xy: [6, 4],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["1"]
    }, {
        xy: [7, 4],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [8, 4],
        tiles: [{
            tileSet: "grass",
            tile: "n3"
        }],
        levels: ["1"]
    }, {
        xy: [9, 4],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [10, 4],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 4],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tr2"
        }],
        levels: ["1"]
    }, {
        xy: [12, 4],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [13, 4],
        tiles: [{
            tileSet: "water",
            tile: "w8"
        }]
    }, {
        xy: [14, 4],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 4],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 5],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 5],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 5],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tl2"
        }],
        levels: ["5"]
    }, {
        xy: [3, 5],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t2"
        }],
        levels: ["5"]
    }, {
        xy: [4, 5],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t3"
        }, {
            tileSet: "objects",
            tile: "tree_ml1",
            "maskLevel": "V6"
        }],
        levels: ["5"]
    }, {
        xy: [5, 5],
        tiles: [{
            tileSet: "objects",
            tile: "tree_mr1",
            "maskLevel": "V6"
        }, {
            tileSet: "objects",
            tile: "tree_tl2",
            "maskLevel": "V7"
        }],
        levels: ["5", "1"]
    }, {
        xy: [6, 5],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "t2",
            "maskLevel": "5"
        }, {
            tileSet: "objects",
            tile: "tree_tr2",
            "maskLevel": "V7"
        }],
        levels: ["5", "1"]
    }, {
        xy: [7, 5],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tr1",
            "maskLevel": "5"
        }],
        levels: ["5", "1"]
    }, {
        xy: [8, 5],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [9, 5],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["5", "1"]
    }, {
        xy: [10, 5],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["5", "1"]
    }, {
        xy: [11, 5],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["1"]
    }, {
        xy: [12, 5],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [13, 5],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [14, 5],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 5],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 6],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 6],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tl1"
        }],
        levels: ["5"]
    }, {
        xy: [2, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_tl1",
            "maskLevel": "V7"
        }],
        levels: ["5"]
    }, {
        xy: [3, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_tr1",
            "maskLevel": "V7"
        }],
        levels: ["5"]
    }, {
        xy: [4, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }]
    }, {
        xy: [5, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }, {
            tileSet: "objects",
            tile: "tree_ml2"
        }]
    }, {
        xy: [6, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_mr2",
            "maskLevel": "V6"
        }],
        levels: ["5"]
    }, {
        xy: [7, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["5"]
    }, {
        xy: [8, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tr2",
            "maskLevel": "5"
        }],
        levels: ["5", "1"]
    }, {
        xy: [9, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [10, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tl2",
            "maskLevel": "5"
        }],
        levels: ["5", "1"]
    }, {
        xy: [12, 6],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t3"
        }],
        levels: ["5"]
    }, {
        xy: [13, 6],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tr2"
        }],
        levels: ["5"]
    }, {
        xy: [14, 6],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 6],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 7],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 7],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["5"]
    }, {
        xy: [2, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n4"
        }, {
            tileSet: "objects",
            tile: "tree_ml1",
            "maskLevel": "V6"
        }],
        levels: ["5"]
    }, {
        xy: [3, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_mr1",
            "maskLevel": "V6"
        }, {
            tileSet: "objects",
            tile: "tree_tl1",
            "maskLevel": "V7"
        }],
        levels: ["5"]
    }, {
        xy: [4, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n2"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }, {
            tileSet: "objects",
            tile: "tree_tr1",
            "maskLevel": "V7"
        }],
        levels: ["5"]
    }, {
        xy: [5, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }]
    }, {
        xy: [6, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }]
    }, {
        xy: [7, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["5"]
    }, {
        xy: [8, 7],
        tiles: [{
            tileSet: "grass",
            tile: "rb"
        }],
        levels: ["5"]
    }, {
        xy: [9, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "wood",
            tile: "hbr1",
            "maskLevel": "5"
        }],
        levels: ["5", "1"]
    }, {
        xy: [10, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "wood",
            tile: "hbr3",
            "maskLevel": "5"
        }],
        levels: ["5", "1"]
    }, {
        xy: [11, 7],
        tiles: [{
            tileSet: "grass",
            tile: "lb"
        }],
        levels: ["5"]
    }, {
        xy: [12, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n5"
        }],
        levels: ["5"]
    }, {
        xy: [13, 7],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["5"]
    }, {
        xy: [14, 7],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 7],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 8],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 8],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["5"]
    }, {
        xy: [2, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }]
    }, {
        xy: [3, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }, {
            tileSet: "objects",
            tile: "tree_ml1"
        }]
    }, {
        xy: [4, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_mr1",
            "maskLevel": "V6"
        }],
        levels: ["5"]
    }, {
        xy: [5, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }],
        levels: ["5"]
    }, {
        xy: [6, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }],
        levels: ["5"]
    }, {
        xy: [7, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["5"]
    }, {
        xy: [8, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["5"]
    }, {
        xy: [9, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n5"
        }, {
            tileSet: "wood",
            tile: "lls_supp",
            "maskLevel": "V4"
        }],
        levels: ["1"]
    }, {
        xy: [10, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "wood",
            tile: "lrs_supp",
            "maskLevel": "V4"
        }],
        levels: ["1"]
    }, {
        xy: [11, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "l3"
        }],
        levels: ["5"]
    }, {
        xy: [12, 8],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["S5"]
    }, {
        xy: [13, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["5"]
    }, {
        xy: [14, 8],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t2"
        }],
        levels: ["4"]
    }, {
        xy: [15, 8],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t3"
        }],
        levels: ["4"]
    }, {
        xy: [0, 9],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 9],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["5"]
    }, {
        xy: [2, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }],
        levels: ["5"]
    }, {
        xy: [3, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n4"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }, {
            tileSet: "objects",
            tile: "tree_bl1"
        }]
    }, {
        xy: [4, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br1"
        }]
    }, {
        xy: [5, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["5"]
    }, {
        xy: [6, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n3"
        }],
        levels: ["5"]
    }, {
        xy: [7, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["5"]
    }, {
        xy: [8, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["5"]
    }, {
        xy: [9, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["1"]
    }, {
        xy: [10, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 9],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mlrs"
        }]
    }, {
        xy: [12, 9],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "st1"
        }],
        levels: ["S4.5"]
    }, {
        xy: [13, 9],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mrls"
        }]
    }, {
        xy: [14, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["4"]
    }, {
        xy: [15, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["4"]
    }, {
        xy: [0, 10],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 10],
        tiles: [{
            tileSet: "earth",
            tile: "tlrs"
        }]
    }, {
        xy: [2, 10],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lj"
        }],
        levels: ["5"]
    }, {
        xy: [3, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }],
        levels: ["5"]
    }, {
        xy: [4, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }],
        levels: ["5"]
    }, {
        xy: [5, 10],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["5"]
    }, {
        xy: [6, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["5"]
    }, {
        xy: [7, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["5"]
    }, {
        xy: [8, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["5"]
    }, {
        xy: [9, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tr1",
            "maskLevel": "3"
        }],
        levels: ["3", "1"]
    }, {
        xy: [10, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["4"]
    }, {
        xy: [12, 10],
        tiles: [{
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "wood",
            tile: "st2"
        }],
        levels: ["S4.5"]
    }, {
        xy: [13, 10],
        tiles: [{
            tileSet: "grass",
            tile: "rs"
        }],
        levels: ["4"]
    }, {
        xy: [14, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["4"]
    }, {
        xy: [15, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n2"
        }],
        levels: ["4"]
    }, {
        xy: [0, 11],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 11],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "blrs"
        }]
    }, {
        xy: [2, 11],
        tiles: [{
            tileSet: "earth",
            tile: "tl"
        }]
    }, {
        xy: [3, 11],
        tiles: [{
            tileSet: "earth",
            tile: "t3"
        }]
    }, {
        xy: [4, 11],
        tiles: [{
            tileSet: "earth",
            tile: "ter"
        }]
    }, {
        xy: [5, 11],
        tiles: [{
            tileSet: "earth",
            tile: "drop"
        }],
        levels: ["D5-2"]
    }, {
        xy: [6, 11],
        tiles: [{
            tileSet: "earth",
            tile: "tel"
        }]
    }, {
        xy: [7, 11],
        tiles: [{
            tileSet: "earth",
            tile: "t2"
        }]
    }, {
        xy: [8, 11],
        tiles: [{
            tileSet: "earth",
            tile: "tr"
        }]
    }, {
        xy: [9, 11],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["3"]
    }, {
        xy: [10, 11],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 11],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["4"]
    }, {
        xy: [12, 11],
        tiles: [{
            tileSet: "grass",
            tile: "st2"
        }],
        levels: ["S4"]
    }, {
        xy: [13, 11],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["4"]
    }, {
        xy: [14, 11],
        tiles: [{
            tileSet: "earth",
            tile: "tls"
        }]
    }, {
        xy: [15, 11],
        tiles: [{
            tileSet: "earth",
            tile: "t1"
        }]
    }, {
        xy: [0, 12],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 12],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["3"]
    }, {
        xy: [2, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bl"
        }]
    }, {
        xy: [3, 12],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [4, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [5, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [6, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [7, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [8, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "br"
        }]
    }, {
        xy: [9, 12],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["3"]
    }, {
        xy: [10, 12],
        tiles: [{
            tileSet: "grass",
            tile: "n4"
        }],
        levels: ["1"]
    }, {
        xy: [11, 12],
        tiles: [{
            tileSet: "earth",
            tile: "tl"
        }]
    }, {
        xy: [12, 12],
        tiles: [{
            tileSet: "earth",
            tile: "t1"
        }]
    }, {
        xy: [13, 12],
        tiles: [{
            tileSet: "earth",
            tile: "tr"
        }]
    }, {
        xy: [14, 12],
        tiles: [{
            tileSet: "earth",
            tile: "ls"
        }]
    }, {
        xy: [15, 12],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [0, 13],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 13],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l3"
        }],
        levels: ["3"]
    }, {
        xy: [2, 13],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rrls"
        }],
        levels: ["3"]
    }, {
        xy: [3, 13],
        tiles: [{
            tileSet: "earth",
            tile: "s"
        }]
    }, {
        xy: [4, 13],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["3"]
    }, {
        xy: [5, 13],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["3"]
    }, {
        xy: [6, 13],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["3"]
    }, {
        xy: [7, 13],
        tiles: [{
            tileSet: "grass",
            tile: "bbms"
        }],
        levels: ["3"]
    }, {
        xy: [8, 13],
        tiles: [{
            tileSet: "grass",
            tile: "rs"
        }],
        levels: ["3"]
    }, {
        xy: [9, 13],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["3"]
    }, {
        xy: [10, 13],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 13],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [12, 13],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [13, 13],
        tiles: [{
            tileSet: "earth",
            tile: "r"
        }]
    }, {
        xy: [14, 13],
        tiles: [{
            tileSet: "earth",
            tile: "ls"
        }]
    }, {
        xy: [15, 13],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [0, 14],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 14],
        tiles: [{
            tileSet: "earth",
            tile: "tl"
        }]
    }, {
        xy: [2, 14],
        tiles: [{
            tileSet: "earth",
            tile: "tr"
        }]
    }, {
        xy: [3, 14],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bs"
        }]
    }, {
        xy: [4, 14],
        tiles: [{
            tileSet: "earth",
            tile: "tl"
        }]
    }, {
        xy: [5, 14],
        tiles: [{
            tileSet: "earth",
            tile: "t1"
        }]
    }, {
        xy: [6, 14],
        tiles: [{
            tileSet: "earth",
            tile: "ter"
        }]
    }, {
        xy: [7, 14],
        tiles: [{
            tileSet: "earth",
            tile: "drop"
        }],
        levels: ["D3-2"]
    }, {
        xy: [8, 14],
        tiles: [{
            tileSet: "earth",
            tile: "tel"
        }]
    }, {
        xy: [9, 14],
        tiles: [{
            tileSet: "earth",
            tile: "tr"
        }]
    }, {
        xy: [10, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 14],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bl"
        }]
    }, {
        xy: [12, 14],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [13, 14],
        tiles: [{
            tileSet: "earth",
            tile: "r"
        }]
    }, {
        xy: [14, 14],
        tiles: [{
            tileSet: "water",
            tile: "ls"
        }]
    }, {
        xy: [15, 14],
        tiles: [{
            tileSet: "water",
            tile: "n2"
        }]
    }, {
        xy: [0, 15],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 15],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [2, 15],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "br"
        }]
    }, {
        xy: [3, 15],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [4, 15],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bl"
        }]
    }, {
        xy: [5, 15],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [6, 15],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [7, 15],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [8, 15],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [9, 15],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "br"
        }]
    }, {
        xy: [10, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 15],
        tiles: [{
            tileSet: "grass",
            tile: "ls"
        }],
        levels: ["1"]
    }, {
        xy: [12, 15],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "water",
            tile: "bw"
        }, {
            tileSet: "grass",
            tile: "rrs"
        }],
        levels: ["1"]
    }, {
        xy: [13, 15],
        tiles: [{
            tileSet: "water",
            tile: "rls"
        }]
    }, {
        xy: [14, 15],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 15],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 16],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 16],
        tiles: [{
            tileSet: "water",
            tile: "lrs"
        }]
    }, {
        xy: [2, 16],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "llrs"
        }],
        levels: ["1"]
    }, {
        xy: [3, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [4, 16],
        tiles: [{
            tileSet: "grass",
            tile: "bbls"
        }],
        levels: ["1"]
    }, {
        xy: [5, 16],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [6, 16],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [7, 16],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [8, 16],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [9, 16],
        tiles: [{
            tileSet: "grass",
            tile: "rs"
        }],
        levels: ["1"]
    }, {
        xy: [10, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["1"]
    }, {
        xy: [12, 16],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["1"]
    }, {
        xy: [13, 16],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [14, 16],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 16],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 17],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 17],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 17],
        tiles: [{
            tileSet: "water",
            tile: "tl"
        }]
    }, {
        xy: [3, 17],
        tiles: [{
            tileSet: "water",
            tile: "t2"
        }]
    }, {
        xy: [4, 17],
        tiles: [{
            tileSet: "wood",
            tile: "v_br1"
        }],
        levels: ["1"]
    }, {
        xy: [5, 17],
        tiles: [{
            tileSet: "water",
            tile: "t3"
        }]
    }, {
        xy: [6, 17],
        tiles: [{
            tileSet: "water",
            tile: "t1"
        }]
    }, {
        xy: [7, 17],
        tiles: [{
            tileSet: "water",
            tile: "t5"
        }]
    }, {
        xy: [8, 17],
        tiles: [{
            tileSet: "water",
            tile: "trs"
        }]
    }, {
        xy: [9, 17],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "water",
            tile: "bw"
        }, {
            tileSet: "grass",
            tile: "lj"
        }],
        levels: ["1"]
    }, {
        xy: [10, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n2"
        }],
        levels: ["1"]
    }, {
        xy: [11, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [12, 17],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["1"]
    }, {
        xy: [13, 17],
        tiles: [{
            tileSet: "water",
            tile: "w7"
        }]
    }, {
        xy: [14, 17],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 17],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 18],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [2, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [4, 18],
        tiles: [{
            tileSet: "wood",
            tile: "v_br2"
        }],
        levels: ["1"]
    }, {
        xy: [5, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [6, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [7, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [9, 18],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["1"]
    }, {
        xy: [10, 18],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 18],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["1"]
    }, {
        xy: [12, 18],
        tiles: [{
            tileSet: "water",
            tile: "trls"
        }]
    }, {
        xy: [13, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [14, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 19],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [2, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 19],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tl2"
        }],
        levels: ["1"]
    }, {
        xy: [4, 19],
        tiles: [{
            tileSet: "grass",
            tile: "tb"
        }],
        levels: ["1"]
    }, {
        xy: [5, 19],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tr2"
        }],
        levels: ["1"]
    }, {
        xy: [6, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [7, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [9, 19],
        tiles: [{
            tileSet: "water",
            tile: "tl"
        }]
    }, {
        xy: [10, 19],
        tiles: [{
            tileSet: "water",
            tile: "t1"
        }]
    }, {
        xy: [11, 19],
        tiles: [{
            tileSet: "water",
            tile: "tr"
        }]
    }, {
        xy: [12, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [13, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [14, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 20],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 20],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [2, 20],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 20],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l3"
        }],
        levels: ["1"]
    }, {
        xy: [4, 20],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [5, 20],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["1"]
    }, {
        xy: [6, 20],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [7, 20],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 20],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [9, 20],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [10, 20],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [11, 20],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tl2"
        }],
        levels: ["3"]
    }, {
        xy: [12, 20],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t1"
        }],
        levels: ["3"]
    }, {
        xy: [13, 20],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tr1"
        }],
        levels: ["3"]
    }, {
        xy: [14, 20],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 20],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 21],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t1"
        }]
    }, {
        xy: [1, 21],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t3"
        }]
    }, {
        xy: [2, 21],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t3"
        }],
        levels: ["3"]
    }, {
        xy: [3, 21],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "t2",
            "maskLevel": "3"
        }],
        levels: ["3", "1"]
    }, {
        xy: [4, 21],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tr1",
            "maskLevel": "3"
        }],
        levels: ["3", "1"]
    }, {
        xy: [5, 21],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["1"]
    }, {
        xy: [6, 21],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [7, 21],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 21],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tl1"
        }],
        levels: ["3"]
    }, {
        xy: [9, 21],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t2"
        }],
        levels: ["3"]
    }, {
        xy: [10, 21],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t3"
        }],
        levels: ["3"]
    }, {
        xy: [11, 21],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [12, 21],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["3"]
    }, {
        xy: [13, 21],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["3"]
    }, {
        xy: [14, 21],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tr2"
        }],
        levels: ["1"]
    }, {
        xy: [15, 21],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }]
    }, {
        xy: [1, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }]
    }, {
        xy: [2, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n2"
        }],
        levels: ["3"]
    }, {
        xy: [3, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [4, 22],
        tiles: [{
            tileSet: "grass",
            tile: "rb"
        }],
        levels: ["3"]
    }, {
        xy: [5, 22],
        tiles: [{
            tileSet: "grass",
            tile: "r1"
        }, {
            tileSet: "wood",
            tile: "hbr1",
            "maskLevel": "3"
        }],
        levels: ["1", "3"]
    }, {
        xy: [6, 22],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "hbr1"
        }],
        levels: ["3"]
    }, {
        xy: [7, 22],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "hbr1"
        }],
        levels: ["3"]
    }, {
        xy: [8, 22],
        tiles: [{
            tileSet: "grass",
            tile: "lb"
        }],
        levels: ["3"]
    }, {
        xy: [9, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [10, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n4"
        }],
        levels: ["3"]
    }, {
        xy: [11, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [12, 22],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["3"]
    }, {
        xy: [13, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["3"]
    }, {
        xy: [14, 22],
        tiles: [{
            tileSet: "grass",
            tile: "rb"
        }],
        levels: ["1"]
    }, {
        xy: [15, 22],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "hbr2"
        }],
        levels: ["1"]
    }, {
        xy: [0, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n5"
        }]
    }, {
        xy: [1, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }]
    }, {
        xy: [2, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["3"]
    }, {
        xy: [3, 23],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["S3"]
    }, {
        xy: [4, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["3"]
    }, {
        xy: [5, 23],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }, {
            tileSet: "wood",
            tile: "lls_supp",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [6, 23],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }, {
            tileSet: "wood",
            tile: "supp"
        }]
    }, {
        xy: [7, 23],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }, {
            tileSet: "wood",
            tile: "lrs_supp"
        }]
    }, {
        xy: [8, 23],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l3"
        }],
        levels: ["3"]
    }, {
        xy: [9, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [10, 23],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["3"]
    }, {
        xy: [11, 23],
        tiles: [{
            tileSet: "earth",
            tile: "terls"
        }]
    }, {
        xy: [12, 23],
        tiles: [{
            tileSet: "earth",
            tile: "drop"
        }],
        levels: ["D3-2"]
    }, {
        xy: [13, 23],
        tiles: [{
            tileSet: "earth",
            tile: "ttel"
        }]
    }, {
        xy: [14, 23],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["1"]
    }, {
        xy: [15, 23],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }, {
            tileSet: "wood",
            tile: "lls_supp"
        }]
    }, {
        xy: [0, 24],
        tiles: [{
            tileSet: "earth",
            tile: "t1"
        }]
    }, {
        xy: [1, 24],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "m1"
        }],
        levels: ["S2.5"]
    }, {
        xy: [2, 24],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mrs"
        }]
    }, {
        xy: [3, 24],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "st1"
        }],
        levels: ["S2.5"]
    }, {
        xy: [4, 24],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mrls"
        }],
        levels: ["3"]
    }, {
        xy: [5, 24],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r3"
        }],
        levels: ["1"]
    }, {
        xy: [6, 24],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [7, 24],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 24],
        tiles: [{
            tileSet: "earth",
            tile: "tl"
        }]
    }, {
        xy: [9, 24],
        tiles: [{
            tileSet: "earth",
            tile: "t2"
        }]
    }, {
        xy: [10, 24],
        tiles: [{
            tileSet: "earth",
            tile: "tr"
        }]
    }, {
        xy: [11, 24],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bls"
        }]
    }, {
        xy: [12, 24],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [13, 24],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "br"
        }]
    }, {
        xy: [14, 24],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["1"]
    }, {
        xy: [15, 24],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 25],
        tiles: [{
            tileSet: "earth",
            tile: "rs"
        }],
        levels: ["2"]
    }, {
        xy: [1, 25],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["2"]
    }, {
        xy: [2, 25],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["2"]
    }, {
        xy: [3, 25],
        tiles: [{
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "wood",
            tile: "st2"
        }],
        levels: ["S2.5"]
    }, {
        xy: [4, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "rrs"
        }],
        levels: ["2"]
    }, {
        xy: [5, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [6, 25],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tr1"
        }],
        levels: ["1"]
    }, {
        xy: [7, 25],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 25],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [9, 25],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [10, 25],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "br"
        }]
    }, {
        xy: [11, 25],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [12, 25],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [13, 25],
        tiles: [{
            tileSet: "grass",
            tile: "rs"
        }],
        levels: ["1"]
    }, {
        xy: [14, 25],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["1"]
    }, {
        xy: [15, 25],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 26],
        tiles: [{
            tileSet: "water",
            tile: "rs"
        }],
        levels: ["2"]
    }, {
        xy: [1, 26],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "water",
            tile: "bw"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["2"]
    }, {
        xy: [2, 26],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["S2"]
    }, {
        xy: [3, 26],
        tiles: [{
            tileSet: "grass",
            tile: "st2"
        }],
        levels: ["S2"]
    }, {
        xy: [4, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["2"]
    }, {
        xy: [5, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [6, 26],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["1"]
    }, {
        xy: [7, 26],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 26],
        tiles: [{
            tileSet: "water",
            tile: "l"
        }]
    }, {
        xy: [9, 26],
        tiles: [{
            tileSet: "water",
            tile: "rs"
        }]
    }, {
        xy: [10, 26],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "llrs"
        }],
        levels: ["1"]
    }, {
        xy: [11, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [12, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n3"
        }],
        levels: ["1"]
    }, {
        xy: [13, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 26],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r3"
        }],
        levels: ["1"]
    }, {
        xy: [15, 26],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 27],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [1, 27],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mlrs"
        }]
    }, {
        xy: [2, 27],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "st1"
        }],
        levels: ["S1.5"]
    }, {
        xy: [3, 27],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mls"
        }]
    }, {
        xy: [4, 27],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mr"
        }]
    }, {
        xy: [5, 27],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["1"]
    }, {
        xy: [6, 27],
        tiles: [{
            tileSet: "water",
            tile: "trls"
        }]
    }, {
        xy: [7, 27],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 27],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [9, 27],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [10, 27],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["1"]
    }, {
        xy: [11, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n4"
        }],
        levels: ["1"]
    }, {
        xy: [12, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [13, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["1"]
    }, {
        xy: [14, 27],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["1"]
    }, {
        xy: [15, 27],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 28],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [1, 28],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["1"]
    }, {
        xy: [2, 28],
        tiles: [{
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "water",
            tile: "blw"
        }, {
            tileSet: "earth",
            tile: "tld"
        }, {
            tileSet: "wood",
            tile: "st3"
        }],
        levels: ["S1.5"]
    }, {
        xy: [3, 28],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [4, 28],
        tiles: [{
            tileSet: "grass",
            tile: "rs"
        }],
        levels: ["1"]
    }, {
        xy: [5, 28],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["1"]
    }, {
        xy: [6, 28],
        tiles: [{
            tileSet: "water",
            tile: "w9"
        }]
    }, {
        xy: [7, 28],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 28],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [9, 28],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [10, 28],
        tiles: [{
            tileSet: "water",
            tile: "tlrs"
        }]
    }, {
        xy: [11, 28],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "water",
            tile: "bw"
        }, {
            tileSet: "grass",
            tile: "lj"
        }],
        levels: ["1"]
    }, {
        xy: [12, 28],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["1"]
    }, {
        xy: [13, 28],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["1"]
    }, {
        xy: [14, 28],
        tiles: [{
            tileSet: "water",
            tile: "trls"
        }]
    }, {
        xy: [15, 28],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 29],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 29],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["1"]
    }, {
        xy: [2, 29],
        tiles: [{
            tileSet: "grass",
            tile: "st2"
        }],
        levels: ["S1"]
    }, {
        xy: [3, 29],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["1"]
    }, {
        xy: [4, 29],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["1"]
    }, {
        xy: [5, 29],
        tiles: [{
            tileSet: "water",
            tile: "trls"
        }]
    }, {
        xy: [6, 29],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [7, 29],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 29],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [9, 29],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [10, 29],
        tiles: [{
            tileSet: "water",
            tile: "w8"
        }]
    }, {
        xy: [11, 29],
        tiles: [{
            tileSet: "water",
            tile: "tl"
        }]
    }, {
        xy: [12, 29],
        tiles: [{
            tileSet: "water",
            tile: "t1"
        }]
    }, {
        xy: [13, 29],
        tiles: [{
            tileSet: "water",
            tile: "tr"
        }]
    }, {
        xy: [14, 29],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 29],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 30],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 30],
        tiles: [{
            tileSet: "water",
            tile: "tl"
        }]
    }, {
        xy: [2, 30],
        tiles: [{
            tileSet: "water",
            tile: "t1"
        }]
    }, {
        xy: [3, 30],
        tiles: [{
            tileSet: "water",
            tile: "t5"
        }]
    }, {
        xy: [4, 30],
        tiles: [{
            tileSet: "water",
            tile: "tr"
        }]
    }, {
        xy: [5, 30],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [6, 30],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [7, 30],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 30],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [9, 30],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [10, 30],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [11, 30],
        tiles: [{
            tileSet: "water",
            tile: "w7"
        }]
    }, {
        xy: [12, 30],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [13, 30],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [14, 30],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 30],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [4, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [5, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [6, 31],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [7, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [8, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [9, 31],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [10, 31],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [11, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [12, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [13, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [14, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [15, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }],
    sprites: [{
        type: "wasp",
        level: 3,
        location: [
            [1, 13]
        ]
    }, {
        type: "wasp",
        level: 1,
        location: [
            [12, 16]
        ]
    }, {
        type: "coin",
        level: 1,
        location: [
            [9, 4]
        ]
    }, {
        type: "coin",
        level: 5,
        location: [
            [1, 6]
        ]
    }, {
        type: "checkpoint",
        level: 5,
        location: [
            [12, 7]
        ]
    }, {
        type: "key",
        level: 3,
        location: [
            [12, 21]
        ]
    }, {
        type: "beetle",
        level: 5,
        location: [
            [2, 10],
            [5, 10],
            [5, 8],
            [4, 8],
            [4, 7],
            [3, 7],
            [3, 5],
            [6, 5],
            [6, 6],
            [7, 6],
            [7, 8],
            [4, 8],
            [4, 7],
            [1, 7],
            [1, 9],
            [2, 9]
        ]
    }, {
        type: "beetle",
        level: 1,
        location: [
            [5, 19],
            [3, 19],
            [3, 21],
            [5, 21],
            [5, 28]
        ]
    }, {
        type: "rock",
        level: 3,
        location: [
            [1, 21]
        ]
    }, {
        type: "rock",
        level: 3,
        location: [
            [1, 22]
        ]
    }, {
        type: "rock",
        level: 3,
        location: [
            [1, 23]
        ]
    }]
}, {
    name: "forest",
    rows: 32,
    cols: 16,
    mapTiles: [{
        xy: [0, 0],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [1, 0],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 0],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [3, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [4, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [5, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [6, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [7, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [8, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [9, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [10, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [11, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [12, 0],
        tiles: [{
            tileSet: "earth",
            tile: "rs"
        }]
    }, {
        xy: [13, 0],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [14, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [15, 0],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [0, 1],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 1],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [2, 1],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [3, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [4, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [5, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [6, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [7, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [8, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [9, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [10, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [11, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [12, 1],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "brs"
        }]
    }, {
        xy: [13, 1],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [14, 1],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [15, 1],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [0, 2],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [1, 2],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 2],
        tiles: [{
            tileSet: "earth",
            tile: "lrs"
        }]
    }, {
        xy: [3, 2],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["5"]
    }, {
        xy: [4, 2],
        tiles: [{
            tileSet: "grass",
            tile: "bbms"
        }],
        levels: ["5"]
    }, {
        xy: [5, 2],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["5"]
    }, {
        xy: [6, 2],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["5"]
    }, {
        xy: [7, 2],
        tiles: [{
            tileSet: "grass",
            tile: "ms",
            "maskLevel": "5"
        }],
        levels: ["5"]
    }, {
        xy: [8, 2],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["5"]
    }, {
        xy: [9, 2],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["5"]
    }, {
        xy: [10, 2],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["5"]
    }, {
        xy: [11, 2],
        tiles: [{
            tileSet: "grass",
            tile: "bbls"
        }],
        levels: ["S5"]
    }, {
        xy: [12, 2],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["5"]
    }, {
        xy: [13, 2],
        tiles: [{
            tileSet: "earth",
            tile: "l"
        }]
    }, {
        xy: [14, 2],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [15, 2],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [0, 3],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 3],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tl2"
        }],
        levels: ["3"]
    }, {
        xy: [2, 3],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bl"
        }, {
            tileSet: "earth",
            tile: "blrs"
        }]
    }, {
        xy: [3, 3],
        tiles: [{
            tileSet: "earth",
            tile: "tter"
        }]
    }, {
        xy: [4, 3],
        tiles: [{
            tileSet: "earth",
            tile: "drop"
        }],
        levels: ["D5-2"]
    }, {
        xy: [5, 3],
        tiles: [{
            tileSet: "earth",
            tile: "tel"
        }]
    }, {
        xy: [6, 3],
        tiles: [{
            tileSet: "earth",
            tile: "al"
        }]
    }, {
        xy: [7, 3],
        tiles: [{
            tileSet: "grass",
            tile: "vdark"
        }, {
            tileSet: "earth",
            tile: "ac",
            "maskLevel": "V4"
        }],
        levels: ["3"]
    }, {
        xy: [8, 3],
        tiles: [{
            tileSet: "earth",
            tile: "ar"
        }]
    }, {
        xy: [9, 3],
        tiles: [{
            tileSet: "earth",
            tile: "t2"
        }]
    }, {
        xy: [10, 3],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mrs"
        }]
    }, {
        xy: [11, 3],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "st1"
        }],
        levels: ["S4.5"]
    }, {
        xy: [12, 3],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "merls"
        }]
    }, {
        xy: [13, 3],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [14, 3],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [15, 3],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [0, 4],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 4],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["3"]
    }, {
        xy: [2, 4],
        tiles: [{
            tileSet: "grass",
            tile: "t2"
        }, {
            tileSet: "grass",
            tile: "lls"
        }, {
            tileSet: "grass",
            tile: "ls"
        }],
        levels: ["3"]
    }, {
        xy: [3, 4],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bl"
        }]
    }, {
        xy: [4, 4],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [5, 4],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [6, 4],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "br"
        }]
    }, {
        xy: [7, 4],
        tiles: [{
            tileSet: "grass",
            tile: "sarch"
        }],
        levels: ["3"]
    }, {
        xy: [8, 4],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bl"
        }]
    }, {
        xy: [9, 4],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "brs"
        }]
    }, {
        xy: [10, 4],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["4"]
    }, {
        xy: [11, 4],
        tiles: [{
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "wood",
            tile: "st2"
        }],
        levels: ["S4.5"]
    }, {
        xy: [12, 4],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["4"]
    }, {
        xy: [13, 4],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["4"]
    }, {
        xy: [14, 4],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rrs"
        }],
        levels: ["4"]
    }, {
        xy: [15, 4],
        tiles: [{
            tileSet: "earth",
            tile: "ls"
        }]
    }, {
        xy: [0, 5],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "hbr1"
        }],
        levels: ["3"]
    }, {
        xy: [1, 5],
        tiles: [{
            tileSet: "grass",
            tile: "lb"
        }],
        levels: ["3"]
    }, {
        xy: [2, 5],
        tiles: [{
            tileSet: "grass",
            tile: "n5"
        }],
        levels: ["3"]
    }, {
        xy: [3, 5],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "ls"
        }],
        levels: ["3"]
    }, {
        xy: [4, 5],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["3"]
    }, {
        xy: [5, 5],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }]
    }, {
        xy: [6, 5],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["3"]
    }, {
        xy: [7, 5],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["3"]
    }, {
        xy: [8, 5],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["3"]
    }, {
        xy: [9, 5],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["3"]
    }, {
        xy: [10, 5],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["4"]
    }, {
        xy: [11, 5],
        tiles: [{
            tileSet: "grass",
            tile: "st2"
        }],
        levels: ["S4"]
    }, {
        xy: [12, 5],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["S4"]
    }, {
        xy: [13, 5],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["4"]
    }, {
        xy: [14, 5],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["4"]
    }, {
        xy: [15, 5],
        tiles: [{
            tileSet: "earth",
            tile: "ls"
        }]
    }, {
        xy: [0, 6],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }, {
            tileSet: "wood",
            tile: "lrs_supp"
        }]
    }, {
        xy: [1, 6],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l3"
        }],
        levels: ["3"]
    }, {
        xy: [2, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [3, 6],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [4, 6],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["3"]
    }, {
        xy: [5, 6],
        tiles: [{
            tileSet: "earth",
            tile: "tls"
        }]
    }, {
        xy: [6, 6],
        tiles: [{
            tileSet: "earth",
            tile: "t2"
        }]
    }, {
        xy: [7, 6],
        tiles: [{
            tileSet: "earth",
            tile: "t3"
        }]
    }, {
        xy: [8, 6],
        tiles: [{
            tileSet: "earth",
            tile: "trs"
        }]
    }, {
        xy: [9, 6],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lj"
        }],
        levels: ["3"]
    }, {
        xy: [10, 6],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "ml"
        }]
    }, {
        xy: [11, 6],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mrs"
        }]
    }, {
        xy: [12, 6],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "st1"
        }],
        levels: ["S3.5"]
    }, {
        xy: [13, 6],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mls"
        }]
    }, {
        xy: [14, 6],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mr"
        }]
    }, {
        xy: [15, 6],
        tiles: [{
            tileSet: "earth",
            tile: "ls"
        }]
    }, {
        xy: [0, 7],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 7],
        tiles: [{
            tileSet: "earth",
            tile: "tlrs"
        }]
    }, {
        xy: [2, 7],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lj"
        }],
        levels: ["3"]
    }, {
        xy: [3, 7],
        tiles: [{
            tileSet: "grass",
            tile: "n2"
        }],
        levels: ["3"]
    }, {
        xy: [4, 7],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["3"]
    }, {
        xy: [5, 7],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bls"
        }]
    }, {
        xy: [6, 7],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [7, 7],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [8, 7],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "brs"
        }]
    }, {
        xy: [9, 7],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["3"]
    }, {
        xy: [10, 7],
        tiles: [{
            tileSet: "grass",
            tile: "ls"
        }],
        levels: ["3"]
    }, {
        xy: [11, 7],
        tiles: [{
            tileSet: "grass",
            tile: "ls"
        }],
        levels: ["3"]
    }, {
        xy: [12, 7],
        tiles: [{
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "wood",
            tile: "st2"
        }],
        levels: ["S3.5"]
    }, {
        xy: [13, 7],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["3"]
    }, {
        xy: [14, 7],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "water",
            tile: "bw"
        }, {
            tileSet: "grass",
            tile: "rrs"
        }],
        levels: ["3"]
    }, {
        xy: [15, 7],
        tiles: [{
            tileSet: "water",
            tile: "rls"
        }, {
            tileSet: "water",
            tile: "ls"
        }]
    }, {
        xy: [0, 8],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 8],
        tiles: [{
            tileSet: "earth",
            tile: "lrs"
        }]
    }, {
        xy: [2, 8],
        tiles: [{
            tileSet: "earth",
            tile: "tlrs"
        }]
    }, {
        xy: [3, 8],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lj"
        }],
        levels: ["3"]
    }, {
        xy: [4, 8],
        tiles: [{
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "grass",
            tile: "r3"
        }],
        levels: ["3"]
    }, {
        xy: [5, 8],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [6, 8],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [7, 8],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [8, 8],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [9, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["3"]
    }, {
        xy: [10, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [11, 8],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [12, 8],
        tiles: [{
            tileSet: "grass",
            tile: "st2"
        }],
        levels: ["S3"]
    }, {
        xy: [13, 8],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["S3"]
    }, {
        xy: [14, 8],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["3"]
    }, {
        xy: [15, 8],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 9],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [1, 9],
        tiles: [{
            tileSet: "water",
            tile: "lrs"
        }]
    }, {
        xy: [2, 9],
        tiles: [{
            tileSet: "earth",
            tile: "lrs"
        }]
    }, {
        xy: [3, 9],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["3"]
    }, {
        xy: [4, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [5, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tr2",
            "maskLevel": "3"
        }],
        levels: ["3", "1"]
    }, {
        xy: [6, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [7, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [8, 9],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [9, 9],
        tiles: [{
            tileSet: "earth",
            tile: "tl"
        }]
    }, {
        xy: [10, 9],
        tiles: [{
            tileSet: "earth",
            tile: "t1"
        }]
    }, {
        xy: [11, 9],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "m1"
        }]
    }, {
        xy: [12, 9],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mrs"
        }]
    }, {
        xy: [13, 9],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "st1"
        }],
        levels: ["S2.5"]
    }, {
        xy: [14, 9],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mrls"
        }]
    }, {
        xy: [15, 9],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [0, 10],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 10],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 10],
        tiles: [{
            tileSet: "water",
            tile: "lrs"
        }]
    }, {
        xy: [3, 10],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "water",
            tile: "bw"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["3"]
    }, {
        xy: [4, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [5, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [6, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "t2",
            "maskLevel": "3"
        }],
        levels: ["1", "3"]
    }, {
        xy: [7, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tr1",
            "maskLevel": "3"
        }],
        levels: ["1", "3"]
    }, {
        xy: [8, 10],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [9, 10],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bl"
        }]
    }, {
        xy: [10, 10],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "brs"
        }]
    }, {
        xy: [11, 10],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["2"]
    }, {
        xy: [12, 10],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["2"]
    }, {
        xy: [13, 10],
        tiles: [{
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "wood",
            tile: "st2"
        }],
        levels: ["S2.5"]
    }, {
        xy: [14, 10],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rrs"
        }],
        levels: ["2"]
    }, {
        xy: [15, 10],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 11],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 11],
        tiles: [{
            tileSet: "water",
            tile: "w3"
        }]
    }, {
        xy: [2, 11],
        tiles: [{
            tileSet: "water",
            tile: "w7"
        }]
    }, {
        xy: [3, 11],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["3"]
    }, {
        xy: [4, 11],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["S3"]
    }, {
        xy: [5, 11],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [6, 11],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [7, 11],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["3"]
    }, {
        xy: [8, 11],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [9, 11],
        tiles: [{
            tileSet: "grass",
            tile: "ls"
        }],
        levels: ["1"]
    }, {
        xy: [10, 11],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [11, 11],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "l3"
        }],
        levels: ["2"]
    }, {
        xy: [12, 11],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["S2"]
    }, {
        xy: [13, 11],
        tiles: [{
            tileSet: "grass",
            tile: "st2"
        }],
        levels: ["S2"]
    }, {
        xy: [14, 11],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["2"]
    }, {
        xy: [15, 11],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 12],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 12],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 12],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mlrs"
        }]
    }, {
        xy: [4, 12],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "st1"
        }],
        levels: ["S2.5"]
    }, {
        xy: [5, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "ms"
        }]
    }, {
        xy: [6, 12],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lj"
        }],
        levels: ["3"]
    }, {
        xy: [7, 12],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [8, 12],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tr2",
            "maskLevel": "3"
        }],
        levels: ["1", "3"]
    }, {
        xy: [9, 12],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [10, 12],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mlrs"
        }]
    }, {
        xy: [12, 12],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "wood",
            tile: "st1"
        }],
        levels: ["S1.5"]
    }, {
        xy: [13, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mls"
        }]
    }, {
        xy: [14, 12],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "mr"
        }]
    }, {
        xy: [15, 12],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [0, 13],
        tiles: [{
            tileSet: "water",
            tile: "w3"
        }]
    }, {
        xy: [1, 13],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 13],
        tiles: [{
            tileSet: "water",
            tile: "w3"
        }]
    }, {
        xy: [3, 13],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["2"]
    }, {
        xy: [4, 13],
        tiles: [{
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "wood",
            tile: "st2"
        }],
        levels: ["S2.5"]
    }, {
        xy: [5, 13],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["2"]
    }, {
        xy: [6, 13],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["3"]
    }, {
        xy: [7, 13],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [8, 13],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["3"]
    }, {
        xy: [9, 13],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [10, 13],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 13],
        tiles: [{
            tileSet: "grass",
            tile: "ls"
        }],
        levels: ["1"]
    }, {
        xy: [12, 13],
        tiles: [{
            tileSet: "grass",
            tile: "light"
        }, {
            tileSet: "wood",
            tile: "st2"
        }],
        levels: ["S1.5"]
    }, {
        xy: [13, 13],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [14, 13],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rrs"
        }],
        levels: ["1"]
    }, {
        xy: [15, 13],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [0, 14],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 14],
        tiles: [{
            tileSet: "water",
            tile: "w3"
        }]
    }, {
        xy: [2, 14],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tl1"
        }],
        levels: ["2"]
    }, {
        xy: [3, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["2"]
    }, {
        xy: [4, 14],
        tiles: [{
            tileSet: "grass",
            tile: "st2"
        }],
        levels: ["S2"]
    }, {
        xy: [5, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["2"]
    }, {
        xy: [6, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "easter_top",
            "maskLevel": "V4"
        }],
        levels: ["3"]
    }, {
        xy: [7, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [8, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "easter_top",
            "maskLevel": "V4"
        }],
        levels: ["3"]
    }, {
        xy: [9, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [10, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [12, 14],
        tiles: [{
            tileSet: "grass",
            tile: "st2"
        }],
        levels: ["S1"]
    }, {
        xy: [13, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 14],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tl1",
            "maskLevel": "3"
        }],
        levels: ["1"]
    }, {
        xy: [15, 14],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t2"
        }]
    }, {
        xy: [0, 15],
        tiles: [{
            tileSet: "water",
            tile: "w3"
        }]
    }, {
        xy: [1, 15],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 15],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["2"]
    }, {
        xy: [3, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n4"
        }],
        levels: ["2"]
    }, {
        xy: [4, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["2"]
    }, {
        xy: [5, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tl2",
            "maskLevel": "3"
        }],
        levels: ["2", "3"]
    }, {
        xy: [6, 15],
        tiles: [{
            tileSet: "grass",
            tile: "grads"
        }, {
            tileSet: "objects",
            tile: "easter_base"
        }]
    }, {
        xy: [7, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }]
    }, {
        xy: [8, 15],
        tiles: [{
            tileSet: "grass",
            tile: "grads"
        }, {
            tileSet: "objects",
            tile: "easter_base"
        }]
    }, {
        xy: [9, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "t2",
            "maskLevel": "3"
        }],
        levels: ["1", "3"]
    }, {
        xy: [10, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "t3",
            "maskLevel": "3"
        }],
        levels: ["1", "3"]
    }, {
        xy: [11, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tr2",
            "maskLevel": "3"
        }],
        levels: ["1", "3"]
    }, {
        xy: [12, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [13, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "l2"
        }]
    }, {
        xy: [15, 15],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }]
    }, {
        xy: [0, 16],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 16],
        tiles: [{
            tileSet: "water",
            tile: "w3"
        }]
    }, {
        xy: [2, 16],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["2"]
    }, {
        xy: [3, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["2"]
    }, {
        xy: [4, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["2"]
    }, {
        xy: [5, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["3"]
    }, {
        xy: [6, 16],
        tiles: [{
            tileSet: "grass",
            tile: "mms"
        }],
        levels: ["3"]
    }, {
        xy: [7, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [8, 16],
        tiles: [{
            tileSet: "grass",
            tile: "mms"
        }],
        levels: ["3"]
    }, {
        xy: [9, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [10, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [11, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n5"
        }],
        levels: ["3"]
    }, {
        xy: [12, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tr1",
            "maskLevel": "3"
        }],
        levels: ["1", "3"]
    }, {
        xy: [13, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "l1"
        }]
    }, {
        xy: [15, 16],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }]
    }, {
        xy: [0, 17],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 17],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 17],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["2"]
    }, {
        xy: [3, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "tl2",
            "maskLevel": "3"
        }],
        levels: ["2", "3"]
    }, {
        xy: [4, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "t3",
            "maskLevel": "3"
        }],
        levels: ["2", "3"]
    }, {
        xy: [5, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [6, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [7, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [8, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [9, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [10, 17],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["3"]
    }, {
        xy: [11, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [12, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["3"]
    }, {
        xy: [13, 17],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 17],
        tiles: [{
            tileSet: "earth",
            tile: "tl"
        }]
    }, {
        xy: [15, 17],
        tiles: [{
            tileSet: "earth",
            tile: "t1"
        }]
    }, {
        xy: [0, 18],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 18],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "tl1"
        }],
        levels: ["3"]
    }, {
        xy: [2, 18],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "t2",
            "maskLevel": "3"
        }],
        levels: ["2", "3"]
    }, {
        xy: [3, 18],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [4, 18],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [5, 18],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [6, 18],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["3"]
    }, {
        xy: [7, 18],
        tiles: [{
            tileSet: "earth",
            tile: "tls"
        }]
    }, {
        xy: [8, 18],
        tiles: [{
            tileSet: "earth",
            tile: "t1"
        }, {
            tileSet: "objects",
            tile: "tree_tl1"
        }]
    }, {
        xy: [9, 18],
        tiles: [{
            tileSet: "earth",
            tile: "ter"
        }, {
            tileSet: "objects",
            tile: "tree_tr1"
        }]
    }, {
        xy: [10, 18],
        tiles: [{
            tileSet: "earth",
            tile: "drop"
        }],
        levels: ["D3-2"]
    }, {
        xy: [11, 18],
        tiles: [{
            tileSet: "earth",
            tile: "tel"
        }, {
            tileSet: "objects",
            tile: "tree_tl2"
        }]
    }, {
        xy: [12, 18],
        tiles: [{
            tileSet: "earth",
            tile: "tr"
        }, {
            tileSet: "objects",
            tile: "tree_tr2"
        }]
    }, {
        xy: [13, 18],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 18],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bl"
        }]
    }, {
        xy: [15, 18],
        tiles: [{
            tileSet: "earth",
            tile: "n"
        }]
    }, {
        xy: [0, 19],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 19],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l1"
        }],
        levels: ["3"]
    }, {
        xy: [2, 19],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["3"]
    }, {
        xy: [3, 19],
        tiles: [{
            tileSet: "grass",
            tile: "n2"
        }],
        levels: ["3"]
    }, {
        xy: [4, 19],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["3"]
    }, {
        xy: [5, 19],
        tiles: [{
            tileSet: "earth",
            tile: "tls"
        }]
    }, {
        xy: [6, 19],
        tiles: [{
            tileSet: "earth",
            tile: "tr"
        }]
    }, {
        xy: [7, 19],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bls"
        }]
    }, {
        xy: [8, 19],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }, {
            tileSet: "objects",
            tile: "tree_ml1"
        }]
    }, {
        xy: [9, 19],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }, {
            tileSet: "objects",
            tile: "tree_mr1"
        }]
    }, {
        xy: [10, 19],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [11, 19],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }, {
            tileSet: "objects",
            tile: "tree_ml2"
        }]
    }, {
        xy: [12, 19],
        tiles: [{
            tileSet: "objects",
            tile: "tree_tml3"
        }]
    }, {
        xy: [13, 19],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_tr1",
            "maskLevel": "V3"
        }],
        levels: ["1"]
    }, {
        xy: [14, 19],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "water",
            tile: "bw"
        }, {
            tileSet: "grass",
            tile: "rrls"
        }],
        levels: ["1"]
    }, {
        xy: [15, 19],
        tiles: [{
            tileSet: "water",
            tile: "ls"
        }]
    }, {
        xy: [0, 20],
        tiles: [{
            tileSet: "water",
            tile: "w3"
        }]
    }, {
        xy: [1, 20],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["3"]
    }, {
        xy: [2, 20],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["3"]
    }, {
        xy: [3, 20],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["3"]
    }, {
        xy: [4, 20],
        tiles: [{
            tileSet: "earth",
            tile: "trls"
        }]
    }, {
        xy: [5, 20],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bls"
        }]
    }, {
        xy: [6, 20],
        tiles: [{
            tileSet: "earth",
            tile: "br"
        }, {
            tileSet: "objects",
            tile: "tree_tl2",
            "maskLevel": "V3"
        }]
    }, {
        xy: [7, 20],
        tiles: [{
            tileSet: "grass",
            tile: "ls"
        }, {
            tileSet: "objects",
            tile: "tree_tr2",
            "maskLevel": "V3"
        }],
        levels: ["1"]
    }, {
        xy: [8, 20],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }]
    }, {
        xy: [9, 20],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }]
    }, {
        xy: [10, 20],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [11, 20],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }, {
            tileSet: "objects",
            tile: "tree_tl1",
            "maskLevel": "V3"
        }]
    }, {
        xy: [12, 20],
        tiles: [{
            tileSet: "objects",
            tile: "tree_tmr1"
        }]
    }, {
        xy: [13, 20],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_mr1",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [14, 20],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r3"
        }],
        levels: ["1"]
    }, {
        xy: [15, 20],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 21],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 21],
        tiles: [{
            tileSet: "earth",
            tile: "tter"
        }]
    }, {
        xy: [2, 21],
        tiles: [{
            tileSet: "earth",
            tile: "drop"
        }],
        levels: ["D3-2"]
    }, {
        xy: [3, 21],
        tiles: [{
            tileSet: "earth",
            tile: "ttel"
        }]
    }, {
        xy: [4, 21],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "brls"
        }]
    }, {
        xy: [5, 21],
        tiles: [{
            tileSet: "grass",
            tile: "rs"
        }, {
            tileSet: "objects",
            tile: "tree_tl1",
            "maskLevel": "V3"
        }],
        levels: ["1"]
    }, {
        xy: [6, 21],
        tiles: [{
            tileSet: "objects",
            tile: "tree_tmr3",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [7, 21],
        tiles: [{
            tileSet: "objects",
            tile: "tree_tml3",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [8, 21],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }, {
            tileSet: "objects",
            tile: "tree_tr1",
            "maskLevel": "V3"
        }],
        levels: ["1"]
    }, {
        xy: [9, 21],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }],
        levels: ["1"]
    }, {
        xy: [10, 21],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_tl1",
            "maskLevel": "V3"
        }],
        levels: ["1"]
    }, {
        xy: [11, 21],
        tiles: [{
            tileSet: "objects",
            tile: "tree_tmr1",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [12, 21],
        tiles: [{
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl1"
        }, {
            tileSet: "objects",
            tile: "tree_mr1"
        }]
    }, {
        xy: [13, 21],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }]
    }, {
        xy: [14, 21],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["1"]
    }, {
        xy: [15, 21],
        tiles: [{
            tileSet: "water",
            tile: "w7"
        }]
    }, {
        xy: [0, 22],
        tiles: [{
            tileSet: "water",
            tile: "w3"
        }]
    }, {
        xy: [1, 22],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "bl"
        }]
    }, {
        xy: [2, 22],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "b1"
        }]
    }, {
        xy: [3, 22],
        tiles: [{
            tileSet: "grass",
            tile: "dark"
        }, {
            tileSet: "earth",
            tile: "br"
        }]
    }, {
        xy: [4, 22],
        tiles: [{
            tileSet: "grass",
            tile: "rs"
        }],
        levels: ["1"]
    }, {
        xy: [5, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_ml1",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [6, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_tl1"
        }, {
            tileSet: "objects",
            tile: "tree_tml1"
        }]
    }, {
        xy: [7, 22],
        tiles: [{
            tileSet: "objects",
            tile: "tree_tmr1"
        }]
    }, {
        xy: [8, 22],
        tiles: [{
            tileSet: "objects",
            tile: "tree_tml2",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [9, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_tr2",
            "maskLevel": "V3"
        }],
        levels: ["1"]
    }, {
        xy: [10, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_ml1",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [11, 22],
        tiles: [{
            tileSet: "objects",
            tile: "tree_tml1"
        }]
    }, {
        xy: [12, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }, {
            tileSet: "objects",
            tile: "tree_tr1",
            "maskLevel": "V3"
        }]
    }, {
        xy: [13, 22],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }],
        levels: ["1"]
    }, {
        xy: [14, 22],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["1"]
    }, {
        xy: [15, 22],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 23],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 23],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "lls"
        }],
        levels: ["1"]
    }, {
        xy: [2, 23],
        tiles: [{
            tileSet: "grass",
            tile: "ms"
        }],
        levels: ["1"]
    }, {
        xy: [3, 23],
        tiles: [{
            tileSet: "grass",
            tile: "rs"
        }]
    }, {
        xy: [4, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [5, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl1"
        }]
    }, {
        xy: [6, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br1"
        }, {
            tileSet: "objects",
            tile: "tree_ml1"
        }]
    }, {
        xy: [7, 23],
        tiles: [{
            tileSet: "grass",
            tile: "treelds1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }, {
            tileSet: "objects",
            tile: "tree_mr1"
        }]
    }, {
        xy: [8, 23],
        tiles: [{
            tileSet: "grass",
            tile: "treerds1"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }, {
            tileSet: "objects",
            tile: "tree_ml2"
        }]
    }, {
        xy: [9, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_mr2",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [10, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }, {
            tileSet: "objects",
            tile: "tree_tl1"
        }]
    }, {
        xy: [11, 23],
        tiles: [{
            tileSet: "objects",
            tile: "tree_tmr1"
        }]
    }, {
        xy: [12, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_mr1",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [13, 23],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 23],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["1"]
    }, {
        xy: [15, 23],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [0, 24],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 24],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }],
        levels: ["1"]
    }, {
        xy: [2, 24],
        tiles: [{
            tileSet: "grass",
            tile: "bb"
        }],
        levels: ["1"]
    }, {
        xy: [3, 24],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }]
    }, {
        xy: [4, 24],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["1"]
    }, {
        xy: [5, 24],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_tl2",
            "maskLevel": "V3"
        }],
        levels: ["1"]
    }, {
        xy: [6, 24],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }, {
            tileSet: "objects",
            tile: "tree_tr2",
            "maskLevel": "V3"
        }]
    }, {
        xy: [7, 24],
        tiles: [{
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "grass",
            tile: "treelds2"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }, {
            tileSet: "objects",
            tile: "tree_tl1",
            "maskLevel": "V3"
        }]
    }, {
        xy: [8, 24],
        tiles: [{
            tileSet: "grass",
            tile: "treerds2"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }, {
            tileSet: "objects",
            tile: "tree_tr1",
            "maskLevel": "V3"
        }]
    }, {
        xy: [9, 24],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }]
    }, {
        xy: [10, 24],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_ml1"
        }]
    }, {
        xy: [11, 24],
        tiles: [{
            tileSet: "grass",
            tile: "treelds1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }, {
            tileSet: "objects",
            tile: "tree_mr1"
        }]
    }, {
        xy: [12, 24],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }, {
            tileSet: "objects",
            tile: "easter_top"
        }]
    }, {
        xy: [13, 24],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 24],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "water",
            tile: "rhd"
        }, {
            tileSet: "objects",
            tile: "easter_top",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [15, 24],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 25],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 25],
        tiles: [{
            tileSet: "water",
            tile: "tl"
        }]
    }, {
        xy: [2, 25],
        tiles: [{
            tileSet: "wood",
            tile: "v_br1"
        }],
        levels: ["1"]
    }, {
        xy: [3, 25],
        tiles: [{
            tileSet: "water",
            tile: "trs"
        }, {
            tileSet: "water",
            tile: "t1"
        }]
    }, {
        xy: [4, 25],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "water",
            tile: "bw"
        }, {
            tileSet: "grass",
            tile: "lj"
        }],
        levels: ["1"]
    }, {
        xy: [5, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "objects",
            tile: "tree_ml2",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [6, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }, {
            tileSet: "objects",
            tile: "tree_mr2",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [7, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }, {
            tileSet: "objects",
            tile: "tree_ml1",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [8, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }, {
            tileSet: "objects",
            tile: "tree_mr1",
            "maskLevel": "V2"
        }],
        levels: ["1"]
    }, {
        xy: [9, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }],
        levels: ["1"]
    }, {
        xy: [10, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }]
    }, {
        xy: [11, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "grass",
            tile: "treelds2"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }]
    }, {
        xy: [12, 25],
        tiles: [{
            tileSet: "grass",
            tile: "grads"
        }, {
            tileSet: "objects",
            tile: "easter_base"
        }]
    }, {
        xy: [13, 25],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }]
    }, {
        xy: [14, 25],
        tiles: [{
            tileSet: "grass",
            tile: "grads"
        }, {
            tileSet: "water",
            tile: "rhd"
        }, {
            tileSet: "objects",
            tile: "easter_base"
        }]
    }, {
        xy: [15, 25],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 26],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 26],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [2, 26],
        tiles: [{
            tileSet: "wood",
            tile: "v_br2"
        }],
        levels: ["1"]
    }, {
        xy: [3, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [4, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "water",
            tile: "tlrs"
        }, {
            tileSet: "water",
            tile: "w2"
        }, {
            tileSet: "water",
            tile: "tlrs"
        }]
    }, {
        xy: [5, 26],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "treelj1"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl2"
        }]
    }, {
        xy: [6, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br2"
        }]
    }, {
        xy: [7, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels1"
        }, {
            tileSet: "objects",
            tile: "tree_bl1"
        }]
    }, {
        xy: [8, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers1"
        }, {
            tileSet: "objects",
            tile: "tree_br1"
        }]
    }, {
        xy: [9, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n4"
        }],
        levels: ["1"]
    }, {
        xy: [10, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }],
        levels: ["1"]
    }, {
        xy: [11, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }],
        levels: ["1"]
    }, {
        xy: [12, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "mms"
        }],
        levels: ["1"]
    }, {
        xy: [13, 26],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 26],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rrs"
        }, {
            tileSet: "grass",
            tile: "rrls"
        }],
        levels: ["1"]
    }, {
        xy: [15, 26],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [0, 27],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t3"
        }],
        levels: ["1"]
    }, {
        xy: [1, 27],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "t3"
        }],
        levels: ["1"]
    }, {
        xy: [2, 27],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rst1"
        }],
        levels: ["1"]
    }, {
        xy: [3, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [4, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [5, 27],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "l2"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }],
        levels: ["1"]
    }, {
        xy: [6, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }],
        levels: ["1"]
    }, {
        xy: [7, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treels2"
        }],
        levels: ["1"]
    }, {
        xy: [8, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }, {
            tileSet: "grass",
            tile: "treers2"
        }],
        levels: ["1"]
    }, {
        xy: [9, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [10, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["1"]
    }, {
        xy: [11, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [12, 27],
        tiles: [{
            tileSet: "grass",
            tile: "n2"
        }],
        levels: ["1"]
    }, {
        xy: [13, 27],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["1"]
    }, {
        xy: [14, 27],
        tiles: [{
            tileSet: "water",
            tile: "trls"
        }]
    }, {
        xy: [15, 27],
        tiles: [{
            tileSet: "water",
            tile: "w1"
        }]
    }, {
        xy: [0, 28],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [1, 28],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [2, 28],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r2"
        }],
        levels: ["1"]
    }, {
        xy: [3, 28],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [4, 28],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [5, 28],
        tiles: [{
            tileSet: "water",
            tile: "tl"
        }]
    }, {
        xy: [6, 28],
        tiles: [{
            tileSet: "water",
            tile: "trs"
        }]
    }, {
        xy: [7, 28],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "water",
            tile: "bw"
        }, {
            tileSet: "grass",
            tile: "lj"
        }],
        levels: ["1"]
    }, {
        xy: [8, 28],
        tiles: [{
            tileSet: "grass",
            tile: "n6"
        }],
        levels: ["1"]
    }, {
        xy: [9, 28],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [10, 28],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [11, 28],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [12, 28],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [13, 28],
        tiles: [{
            tileSet: "water",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "r1"
        }],
        levels: ["1"]
    }, {
        xy: [14, 28],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [15, 28],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [0, 29],
        tiles: [{
            tileSet: "grass",
            tile: "n1"
        }],
        levels: ["1"]
    }, {
        xy: [1, 29],
        tiles: [{
            tileSet: "earth",
            tile: "dark"
        }, {
            tileSet: "grass",
            tile: "rj"
        }],
        levels: ["1"]
    }, {
        xy: [2, 29],
        tiles: [{
            tileSet: "water",
            tile: "trls"
        }]
    }, {
        xy: [3, 29],
        tiles: [{
            tileSet: "water",
            tile: "w9"
        }]
    }, {
        xy: [4, 29],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [5, 29],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [6, 29],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [7, 29],
        tiles: [{
            tileSet: "water",
            tile: "tl"
        }]
    }, {
        xy: [8, 29],
        tiles: [{
            tileSet: "water",
            tile: "t1"
        }]
    }, {
        xy: [9, 29],
        tiles: [{
            tileSet: "water",
            tile: "t2"
        }]
    }, {
        xy: [10, 29],
        tiles: [{
            tileSet: "water",
            tile: "t2"
        }]
    }, {
        xy: [11, 29],
        tiles: [{
            tileSet: "water",
            tile: "t5"
        }]
    }, {
        xy: [12, 29],
        tiles: [{
            tileSet: "water",
            tile: "t2"
        }]
    }, {
        xy: [13, 29],
        tiles: [{
            tileSet: "water",
            tile: "tr"
        }]
    }, {
        xy: [14, 29],
        tiles: [{
            tileSet: "water",
            tile: "w7"
        }]
    }, {
        xy: [15, 29],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [0, 30],
        tiles: [{
            tileSet: "water",
            tile: "t3"
        }]
    }, {
        xy: [1, 30],
        tiles: [{
            tileSet: "water",
            tile: "tr"
        }]
    }, {
        xy: [2, 30],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [3, 30],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [4, 30],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [5, 30],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [6, 30],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [7, 30],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [8, 30],
        tiles: [{
            tileSet: "water",
            tile: "w8"
        }]
    }, {
        xy: [9, 30],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [10, 30],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [11, 30],
        tiles: [{
            tileSet: "water",
            tile: "w4"
        }]
    }, {
        xy: [12, 30],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [13, 30],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [14, 30],
        tiles: [{
            tileSet: "water",
            tile: "w3"
        }]
    }, {
        xy: [15, 30],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [0, 31],
        tiles: [{
            tileSet: "water",
            tile: "w2"
        }]
    }, {
        xy: [1, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [2, 31],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [3, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [4, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [5, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [6, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [7, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [8, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [9, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [10, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [11, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [12, 31],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [13, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }, {
        xy: [14, 31],
        tiles: [{
            tileSet: "water",
            tile: "w6"
        }]
    }, {
        xy: [15, 31],
        tiles: [{
            tileSet: "water",
            tile: "w5"
        }]
    }],
    sprites: [{
        type: "coin",
        level: 2,
        location: [
            [3, 15]
        ]
    }, {
        type: "checkpoint",
        level: 1,
        location: [
            [7, 8]
        ]
    }, {
        type: "wasp",
        level: 3,
        location: [
            [14, 16]
        ]
    }, {
        type: "wasp",
        level: 3,
        location: [
            [3, 17]
        ]
    }, {
        type: "beetle",
        level: 1,
        location: [
            [11, 21],
            [5, 21],
            [5, 22],
            [4, 22],
            [4, 25],
            [9, 25],
            [4, 25],
            [4, 22],
            [5, 22],
            [5, 21]
        ]
    }, {
        type: "beetle",
        level: 1,
        location: [
            [13, 13],
            [13, 20],
            [14, 20],
            [14, 24],
            [14, 19],
            [13, 19]
        ]
    }, {
        type: "rock",
        level: 3,
        location: [
            [5, 5]
        ]
    }, {
        type: "rock",
        level: 1,
        location: [
            [3, 23]
        ]
    }, {
        type: "rock",
        level: 1,
        location: [
            [3, 24]
        ]
    }, {
        type: "blades",
        level: 3,
        location: [
            [7, 15]
        ]
    }, {
        type: "blades",
        level: 1,
        location: [
            [13, 25]
        ]
    }]
}, {
    name: "lowercave",
    rows: 16,
    cols: 15,
    mapTiles: [{
        xy: [7, 0],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wbrcn"
        }]
    }, {
        xy: [8, 0],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb5"
        }]
    }, {
        xy: [9, 0],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb6"
        }]
    }, {
        xy: [10, 0],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb5"
        }]
    }, {
        xy: [11, 0],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb6"
        }]
    }, {
        xy: [12, 0],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb5"
        }]
    }, {
        xy: [13, 0],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb5"
        }]
    }, {
        xy: [14, 0],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wblcn"
        }]
    }, {
        xy: [2, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wbrcn"
        }]
    }, {
        xy: [3, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb6"
        }]
    }, {
        xy: [4, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb6"
        }]
    }, {
        xy: [5, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb6"
        }]
    }, {
        xy: [6, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb2"
        }]
    }, {
        xy: [7, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "wbr"
        }]
    }, {
        xy: [8, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mls"
        }]
    }, {
        xy: [9, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "m2"
        }]
    }, {
        xy: [10, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "m1"
        }]
    }, {
        xy: [11, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "m2"
        }]
    }, {
        xy: [12, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "m2"
        }]
    }, {
        xy: [13, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mrs"
        }]
    }, {
        xy: [14, 1],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [2, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [3, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mls"
        }, {
            "tileSet": "objects",
            "tile": "skull_ftop"
        }]
    }, {
        xy: [4, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "m1"
        }]
    }, {
        xy: [5, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "m1"
        }]
    }, {
        xy: [6, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "m1"
        }]
    }, {
        xy: [7, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mr"
        }]
    }, {
        xy: [8, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [10, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [11, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 2],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "light"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [2, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "light"
        }, {
            "tileSet": "dungeon",
            "tile": "wr2"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [3, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }, {
            "tileSet": "dungeon",
            "tile": "os1"
        }, {
            "tileSet": "objects",
            "tile": "skull_base2"
        }]
    }, {
        xy: [4, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "nls"
        }],
        "levels": ["1"]
    }, {
        xy: [7, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [8, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtl",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [10, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtr",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [11, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n4"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 3],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [2, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr2"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [3, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "os2"
        }],
        "levels": ["1"]
    }, {
        xy: [4, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n6"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtl",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [7, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wt2",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [8, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wt2",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wtlcn"
        }]
    }, {
        xy: [10, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wtrcn"
        }]
    }, {
        xy: [11, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtr",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtl",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 4],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wtlcn"
        }]
    }, {
        xy: [1, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wbrcn"
        }]
    }, {
        xy: [2, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb7"
        }, {
            "tileSet": "dungeon",
            "tile": "wtrcn"
        }]
    }, {
        xy: [3, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wrc",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [4, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wbl"
        }]
    }, {
        xy: [7, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb7"
        }]
    }, {
        xy: [8, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb6"
        }]
    }, {
        xy: [9, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wblcn"
        }]
    }, {
        xy: [10, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wbrcn"
        }]
    }, {
        xy: [11, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wbr"
        }]
    }, {
        xy: [12, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wbl"
        }]
    }, {
        xy: [14, 5],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wblcn"
        }]
    }, {
        xy: [1, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [2, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mls"
        }]
    }, {
        xy: [3, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mr"
        }]
    }, {
        xy: [4, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n6"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "ml"
        }]
    }, {
        xy: [7, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "m1"
        }]
    }, {
        xy: [8, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mrs"
        }]
    }, {
        xy: [9, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [10, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [11, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mrls"
        }]
    }, {
        xy: [12, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mlrs"
        }]
    }, {
        xy: [14, 6],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [1, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "light"
        }, {
            "tileSet": "dungeon",
            "tile": "wr2"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [2, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [3, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "nrs"
        }],
        "levels": ["1"]
    }, {
        xy: [4, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "nls"
        }],
        "levels": ["1"]
    }, {
        xy: [7, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [8, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "light"
        }, {
            "tileSet": "dungeon",
            "tile": "wl1"
        }]
    }, {
        xy: [10, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "light"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [11, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "nrs"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "objects",
            "tile": "skull_ftop",
            "maskLevel": "V2"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "nls"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 7],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "light"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [1, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [2, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [3, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtl",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [4, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wt1",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wt2",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wt2",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [7, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtr",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [8, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl3"
        }]
    }, {
        xy: [10, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [11, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "os1"
        }, {
            "tileSet": "objects",
            "tile": "skull_base1"
        }]
    }, {
        xy: [13, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 8],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl3"
        }]
    }, {
        xy: [1, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [2, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n5"
        }],
        "levels": ["1"]
    }, {
        xy: [3, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wbl"
        }]
    }, {
        xy: [4, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb6"
        }]
    }, {
        xy: [5, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wb2"
        }]
    }, {
        xy: [6, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wblcn"
        }]
    }, {
        xy: [7, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr2"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [8, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [10, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }, {
            "tileSet": "dungeon",
            "tile": "wr2"
        }]
    }, {
        xy: [11, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "os2"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n6"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 9],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [1, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [2, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [3, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "ml"
        }]
    }, {
        xy: [4, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "m2"
        }]
    }, {
        xy: [5, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mrs"
        }, {
            "tileSet": "objects",
            "tile": "skull_ftop"
        }]
    }, {
        xy: [6, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [7, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr2"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [8, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n4"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [10, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [11, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n4"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "objects",
            "tile": "skull_ftop",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 10],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl3"
        }]
    }, {
        xy: [1, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr3"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [2, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [3, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "nls"
        }],
        "levels": ["1"]
    }, {
        xy: [4, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "ms"
        }, {
            "tileSet": "dungeon",
            "tile": "os1"
        }, {
            "tileSet": "objects",
            "tile": "skull_base1"
        }]
    }, {
        xy: [6, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "light"
        }, {
            "tileSet": "dungeon",
            "tile": "wbl"
        }]
    }, {
        xy: [7, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wbr"
        }]
    }, {
        xy: [8, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl3"
        }]
    }, {
        xy: [10, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr2"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [11, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "os1"
        }, {
            "tileSet": "objects",
            "tile": "skull_base2"
        }, {
            "tileSet": "objects",
            "tile": "skull_ftop"
        }]
    }, {
        xy: [13, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n5"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 11],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [1, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wtrcn"
        }]
    }, {
        xy: [2, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtr",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [3, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n5"
        }],
        "levels": ["1"]
    }, {
        xy: [4, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "os2"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "ml"
        }]
    }, {
        xy: [7, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "dark"
        }, {
            "tileSet": "dungeon",
            "tile": "mr"
        }]
    }, {
        xy: [8, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [10, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [11, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "os2"
        }, {
            "tileSet": "dungeon",
            "tile": "os1"
        }, {
            "tileSet": "objects",
            "tile": "skull_base1"
        }]
    }, {
        xy: [13, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 12],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [2, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [3, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [4, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n6"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "nls"
        }],
        "levels": ["1"]
    }, {
        xy: [7, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "nrs"
        }],
        "levels": ["1"]
    }, {
        xy: [8, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [10, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr1"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [11, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "os2"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 13],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl1"
        }]
    }, {
        xy: [2, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wtrcn"
        }]
    }, {
        xy: [3, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wt3",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [4, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtr",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [5, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtl",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [7, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wt3",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [8, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wt3",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [9, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wtlcn"
        }]
    }, {
        xy: [10, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wtrcn"
        }]
    }, {
        xy: [11, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtr",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [12, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wtl",
            "maskLevel": "2"
        }],
        "levels": ["1"]
    }, {
        xy: [14, 14],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "wtlcn"
        }]
    }, {
        xy: [4, 15],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr2"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [5, 15],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [6, 15],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl2"
        }]
    }, {
        xy: [11, 15],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wr3"
        }, {
            "tileSet": "dungeon",
            "tile": "lb"
        }]
    }, {
        xy: [12, 15],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }],
        "levels": ["1"]
    }, {
        xy: [13, 15],
        tiles: [{
            "tileSet": "dungeon",
            "tile": "n1"
        }, {
            "tileSet": "dungeon",
            "tile": "wl1"
        }]
    }],
    sprites: [{
        type: "flames",
        level: 2,
        location: [
            [3, 2]
        ]
    }, {
        type: "flames",
        level: 2,
        location: [
            [5, 10]
        ]
    }, {
        type: "flames",
        level: 2,
        location: [
            [12, 7]
        ]
    }, {
        type: "flames",
        level: 2,
        location: [
            [12, 10]
        ]
    }, {
        type: "flames",
        level: 2,
        location: [
            [12, 11]
        ]
    }, {
        type: "beetle",
        level: 1,
        location: [
            [8, 7],
            [8, 13],
            [3, 13],
            [3, 11],
            [2, 11],
            [2, 7]
        ]
    }, {
        type: "beetle",
        level: 1,
        location: [
            [13, 7],
            [11, 7],
            [11, 9],
            [13, 9]
        ]
    }, {
        type: "beetle",
        level: 1,
        location: [
            [11, 13],
            [11, 10],
            [13, 10],
            [13, 13]
        ]
    }, {
        type: "coin",
        level: 1,
        location: [
            [4, 11]
        ]
    }, {
        type: "coin",
        level: 1,
        location: [
            [12, 3]
        ]
    }]
}]));