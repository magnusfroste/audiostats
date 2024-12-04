'use client';

import { useEffect, useRef } from 'react';
import { Participant } from '@/types/analysis';
import * as d3 from 'd3';

interface InteractionGraphProps {
  participants: Participant[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  radius: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

export default function InteractionGraph({ participants }: InteractionGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || participants.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    // Prepare data
    const nodes: Node[] = participants.map(p => ({
      id: p.id,
      name: p.name,
      radius: Math.sqrt(p.speakingTime) * 2
    }));

    const links: Link[] = [];
    participants.forEach(p => {
      Object.entries(p.interactions).forEach(([targetId, value]) => {
        links.push({
          source: p.id,
          target: targetId,
          value
        });
      });
    });

    // Set up SVG
    const width = svgRef.current.clientWidth;
    const height = 400;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    // Create simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<Node>().radius(d => d.radius + 5));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value || 1));

    // Create nodes
    const node = svg.append('g')
      .selectAll<SVGGElement, Node>('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', '#4f46e5')
      .attr('fill-opacity', 0.7);

    // Add labels to nodes
    node.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', d => d.radius + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4b5563')
      .attr('font-size', '12px');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x || 0)
        .attr('y1', d => (d.source as Node).y || 0)
        .attr('x2', d => (d.target as Node).x || 0)
        .attr('y2', d => (d.target as Node).y || 0);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [participants]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
        <h3 className="font-medium">Förklaring av grafen:</h3>
        <ul className="space-y-1 text-gray-600">
          <li>• Cirklarnas storlek visar taltid</li>
          <li>• Linjernas tjocklek visar antal interaktioner</li>
          <li>• Dra i cirklarna för att flytta runt dem</li>
          <li>• Ju närmare cirklarna är, desto mer interagerar deltagarna</li>
        </ul>
      </div>

      <svg 
        ref={svgRef} 
        className="w-full h-[400px] bg-white rounded-lg"
      />
    </div>
  );
}
