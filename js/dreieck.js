var Dreieck = function(n, edgeLength){

	function Point(x,y) {
	  this.x = x || 0;
	  this.y = y || 0;
	};

	function getTrianglePoints(p1, distance){
		var p2 = new Point(p1.x + distance, p1.y),
			p3 = new Point(p1.x + distance/2, p1.y - Math.sqrt(3)/2 *distance),
			array = [p1, p2, p3];
			
		return array;
	}

	function getDecomposition(p1, p2, divisor){
		var distance = Math.sqrt(Math.pow((p1.x - p2.x),2) + Math.pow((p1.y - p2.y),2)),
			points = [],
			xTrans = 0,
			yTrans = 0,
			x=0,
			y=0,
			smallerDistance = 0;
		
		if(p1.x < p2.x) {
			xTrans = 1;
		} else if(p1.x > p2.x) {
			xTrans = -1;
		} else {
			xtrans = 0;
		};
		
		if(p1.y > p2.y){
			yTrans  = -1;
		} else if(p1.y < p2.y){
			yTrans = 1;
		} else{
			yTrans = 0;
		}
		if(yTrans != 0){
			for(i=0;i<divisor;i++){
				smallerDistance = (i*distance) / divisor;
				x = p1.x + xTrans * smallerDistance / 2;
				y = p1.y + yTrans * Math.sqrt(3) * smallerDistance / 2;
				points.push(new Point(x,y));
			}
		} else {
			for(i=0;i<divisor;i++){
				smallerDistance = (i*distance) / divisor;
				x = p1.x + xTrans * smallerDistance;
				y = p1.y;
				points.push(new Point(x,y));
			}
		}
		return points;
	}

	

	var width = 900,
		height = 600,
		length = edgeLength,
		xStart = width/2 - length/2,
		yStart = height - 1/2*(height - Math.sqrt(3)/2*length) ,
		eins=1;
		
	var p1 = new Point(xStart,yStart),
		initialPoints = getTrianglePoints(p1, length),
		decompositionP1 = getDecomposition(initialPoints[0], initialPoints[1], n),
		decompositionP2 = getDecomposition(initialPoints[1], initialPoints[2], n),
		decompositionP3 = getDecomposition(initialPoints[2], initialPoints[0], n);

	var decomposition = [decompositionP1, decompositionP2, decompositionP3];

	var triangleData = {
		"nodes" : [],
		"links" : []
	};
		
	for(j=1;j<=3;j++){
		for(i=0;i<n;i++){
			id = "P_" + j.toString() + "_" + i.toString();
			nodeToAdd = {"id":id, "x":decomposition[j-1][i].x, "y":decomposition[j-1][i].y};
			triangleData.nodes.push(nodeToAdd);
		}
	}

	for(i=0;i< n; i++){
		sourceId1 = "P_1" + "_" + i.toString();
		targetId1 = "P_2" + "_" + i.toString();
		sourceId2 = "P_2" + "_" + i.toString();
		targetId2 = "P_3" + "_" + i.toString();
		sourceId3 = "P_3" + "_" + i.toString();
		targetId3 = "P_1" + "_" + i.toString();
		triangleData.links.push({"source":sourceId1, "target":targetId1});
		triangleData.links.push({"source":sourceId2, "target":targetId2});
		triangleData.links.push({"source":sourceId3, "target":targetId3});
	}

			
	var svg = d3.select("#svg")
			.attr("width", width)
			.attr("height", height);
	
	svg.selectAll("*").remove();
	
	var simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(function(d){ return d.id}));

	var nodeGroup = svg.append("g")
		.attr("id", "nodes");
		
	var linkGroup = svg.append("g")
		.attr("id", "links");
		
	update();
			
	function update(){
		
		simulation.nodes(triangleData.nodes);
		
		simulation.force("link")
			.links(triangleData.links);
		
		var link = linkGroup.selectAll("line")
			.data(triangleData.links);
			
		link.exit().remove();
		
		var linkEnter = link.enter()
			.append("line")
			.attr("id", function(d){
				return "Line:" + d.source.id + ":" +d.target.id;
			})
			.attr("class", "link")
			.attr("stroke", "#ccc")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
		
		link = linkEnter.merge(link);
		
		var node = nodeGroup.selectAll("circle")
			.data(triangleData.nodes);
			
		node.exit().remove();
		
		var nodeEnter = node.enter()
			.append("circle")
			.attr("id", function(d){
				return d.id;
			})
			.attr("class", "node")
			.attr("r", 0)
			.attr("cx",function(d){
				return d.x;
			})
			.attr("cy", function(d){
				return d.y;
			});
			
		node = nodeEnter.merge(node);
	}
}