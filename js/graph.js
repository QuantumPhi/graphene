require.config({
    paths: {
        d3: '//cdnjs.cloudflare.com/ajax/libs/d3/3.4.13/d3.min',
        jquery: '//code.jquery.com/jquery-1.11.0.min'
    }
})

require(['jquery', 'd3', 'colors', 'repos'], function($, d3) {
    var width  = $(window).width(),
    height = $(window).height(),
    colors = {"AGS Script":"#B9D9FF","ANTLR":"#9DC3FF","APL":"#8a0707","ASP":"#6a40fd","ATS":"#1ac620","ActionScript":"#e3491a","Ada":"#02f88c","Agda":"#467C91","Alloy":"#cc5c24","Arc":"#ca2afe","Arduino":"#bd79d1","AspectJ":"#1957b0","Assembly":"#a67219","AutoHotkey":"#6594b9","AutoIt":"#36699B","BlitzMax":"#cd6400","Boo":"#d4bec1","C":"#555","C#":"#178600","C++":"#f34b7d","CSS":"#563d7c","Chapel":"#8dc63f","Cirru":"#aaaaff","Clean":"#3a81ad","Clojure":"#db5855","CoffeeScript":"#244776","ColdFusion":"#ed2cd6","ColdFusion CFC":"#ed2cd6","Common Lisp":"#3fb68b","Component Pascal":"#b0ce4e","D":"#fcd46d","DM":"#075ff1","Dart":"#98BAD6","Dogescript":"#cca760","Dylan":"#3ebc27","E":"#ccce35","ECL":"#8a1267","Eagle":"#3994bc","Eiffel":"#946d57","Elixir":"#6e4a7e","Elm":"#60B5CC","Emacs Lisp":"#c065db","EmberScript":"#f64e3e","Erlang":"#0faf8d","F#":"#b845fc","FLUX":"#33CCFF","FORTRAN":"#4d41b1","Factor":"#636746","Fancy":"#7b9db4","Fantom":"#dbded5","Forth":"#341708","Frege":"#00cafe","Game Maker Language":"#8ad353","Glyph":"#e4cc98","Gnuplot":"#f0a9f0","Go":"#375eab","Golo":"#f6a51f","Gosu":"#82937f","Grammatical Framework":"#ff0000","Groovy":"#e69f56","Harbour":"#0e60e3","Haskell":"#29b544","Haxe":"#f7941e","Hy":"#7891b1","IDL":"#e3592c","Io":"#a9188d","Ioke":"#078193","Isabelle":"#fdcd00","Java":"#b07219","JavaScript":"#f1e05a","Julia":"#a270ba","KRL":"#f5c800","LFE":"#004200","LOLCODE":"#cc9900","LSL":"#3d9970","Lasso":"#2584c3","Latte":"#A8FF97","LiveScript":"#499886","LookML":"#652B81","Lua":"#fa1fa1","MTML":"#0095d9","Mask":"#f97732","Matlab":"#bb92ac","Max":"#ce279c","Mercury":"#abcdef","Mirah":"#c7a938","Nemerle":"#0d3c6e","NetLogo":"#ff2b2b","Nimrod":"#37775b","Nit":"#0d8921","Nix":"#7070ff","Nu":"#c9df40","OCaml":"#3be133","Objective-C":"#438eff","Objective-C++":"#4886FC","Objective-J":"#ff0c5a","Omgrofl":"#cabbff","Opal":"#f7ede0","Oxygene":"#5a63a3","Oz":"#fcaf3e","PAWN":"#dbb284","PHP":"#4F5D95","Pan":"#cc0000","Papyrus":"#6600cc","Parrot":"#f3ca0a","Pascal":"#b0ce4e","Perl":"#0298c3","Perl6":"#0298c3","PigLatin":"#fcd7de","Pike":"#066ab2","PogoScript":"#d80074","Processing":"#2779ab","Prolog":"#74283c","Propeller Spin":"#2b446d","Puppet":"#cc5555","Pure Data":"#91de79","PureBasic":"#5a6986","PureScript":"#bcdc53","Python":"#3581ba","QML":"#44a51c","R":"#198ce7","RAML":"#77d9fb","Racket":"#ae17ff","Ragel in Ruby Host":"#ff9c2e","Rebol":"#358a5b","Red":"#ee0000","Rouge":"#cc0088","Ruby":"#701516","Rust":"#dea584","SAS":"#1E90FF","SQF":"#FFCB1F","Scala":"#7dd3b0","Scheme":"#1e4aec","Self":"#0579aa","Shell":"#89e051","Shen":"#120F14","Slash":"#007eff","Slim":"#ff8877","Smalltalk":"#596706","SourcePawn":"#f69e1d","Standard ML":"#dc566d","SuperCollider":"#46390b","Swift":"#ffac45","SystemVerilog":"#343761","Tcl":"#e4cc98","TeX":"#3D6117","Turing":"#45f715","TypeScript":"#31859c","Unified Parallel C":"#755223","UnrealScript":"#a54c4d","VCL":"#0298c3","VHDL":"#543978","Vala":"#ee7d06","Verilog":"#848bf3","VimL":"#199c4b","Visual Basic":"#945db7","Volt":"#0098db","XQuery":"#2700e2","Zephir":"#118f9e","edn":"#db5855","nesC":"#ffce3b","ooc":"#b0b77e","wisp":"#7582D1","xBase":"#3a4040"},
    repos = $.ajax({
        url: 'https://api.github.com/users/QuantumPhi/repos?per_page=100'
    })

    var color = function(language) {
        if(!language || !colors[language])
        return '#717171'
        return colors[language].color
    },
    force = d3.layout.force()
    .charge(-250)
    .linkDistance(100)
    .size([width, height]),
    svg = d3.select('#content')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

    var groups = {}

    var nodes = function() {
        var array = [{
            'index': 0,
            'color': '#000',
            'group': -1,
            'name': 'ME!',
            'radius': 20,
            'url': 'https://github.com/QuantumPhi'
        }]
        var iter = 0
        $.each(repos, function(key, value) {
            var cTemp = color(value.language)
            if(!groups.hasOwnProperty(cTemp)) {
                array.push({
                    'index': key + 1,
                    'color': cTemp,
                    'group': iter,
                    'language': value.language,
                    'name': value.language,
                    'radius': 15
                })
                iter++
                groups[cTemp] = iter
            }
        })
        $.each(repos, function(key, value) {
            var cTemp = color(value.language)
            array.push({
                'index': key + iter + 1,
                'color': cTemp,
                'group': groups[cTemp],
                'language': value.language,
                'name': value.name,
                'radius': 10,
                'url': value.html_url
            })
        })
        return array
    }()

    var links = function() {
        var array = [],
        lang  = []
        for(property in groups) {
            array.push({
                'source': 0,
                'target': groups[property]
            })
            lang.push(groups[property])
        }
        for(var i = 0; i < lang.length; i++) {
            $.each(nodes, function(key, value) {
                if(nodes[value.index].language === nodes[lang[i]].name) {
                    array.push({
                        'source': lang[i],
                        'target': value.index
                    })
                }
            })
        }
        return array
    }()

    force
    .nodes(nodes)
    .links(links)
    .start()

    var link = svg.selectAll('.link')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .style('stroke-width', function(d) { return 10 * Math.sqrt(d.radius) })

    var node = svg.selectAll('.node')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('class', 'node')
    .attr('r', function(d) { return d.radius })
    .style('fill', function(d) { return d.color })
    //.on('click', function(d) { window.open(d.url) }) <- Allow movement of graph
    .on('mouseover', function(d) {
        d3.select(this)
        .transition()
        .duration(500)
        .attr('r', d.radius + 10)
    })
    .on('mouseout', function(d) {
        d3.select(this)
        .transition()
        .duration(500)
        .attr('r', d.radius)
    })
    .call(force.drag)

    node.append('title')
    .text(function(d) { return d.name })

    force.on('tick', function() {
        link.attr('x1', function(d) { return d.source.x })
        .attr('y1', function(d) { return d.source.y })
        .attr('x2', function(d) { return d.target.x })
        .attr('y2', function(d) { return d.target.y })

        node.attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y })
    })
})
