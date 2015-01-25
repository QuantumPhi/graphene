var $      = require('jquery'),
    d3     = require('d3'),
    colors = require('./colors.json')

var width  = $(window).width(),
    height = $(window).height()

// TODO: Create pagewalker
var repos  = $.ajax({
    url: 'https://api.github.com/users/QuantumPhi/repos?type=all&per_page=100',
    cache: true,
    async: false
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
