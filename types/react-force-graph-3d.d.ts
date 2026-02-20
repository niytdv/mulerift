declare module 'react-force-graph-3d' {
  import { FC } from 'react';

  interface NodeObject {
    id: string;
    [key: string]: any;
  }

  interface LinkObject {
    source: string | NodeObject;
    target: string | NodeObject;
    [key: string]: any;
  }

  interface ForceGraph3DProps {
    graphData: {
      nodes: NodeObject[];
      links: LinkObject[];
    };
    nodeLabel?: string | ((node: NodeObject) => string);
    nodeColor?: string | ((node: NodeObject) => string);
    nodeVal?: number | ((node: NodeObject) => number);
    linkColor?: string | ((link: LinkObject) => string);
    linkWidth?: number | ((link: LinkObject) => number);
    linkDirectionalArrowLength?: number | ((link: LinkObject) => number);
    linkDirectionalArrowRelPos?: number;
    onNodeClick?: (node: NodeObject) => void;
    onNodeHover?: (node: NodeObject | null) => void;
    backgroundColor?: string;
    showNavInfo?: boolean;
    enableNodeDrag?: boolean;
    enableNavigationControls?: boolean;
    [key: string]: any;
  }

  const ForceGraph3D: FC<ForceGraph3DProps>;
  export default ForceGraph3D;
}
