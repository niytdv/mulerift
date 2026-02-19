import json

def generate_json_output(accounts, rings, graph, processing_time):
    nodes = []
    edges = []
    
    for node, data in graph.nodes(data=True):
        node_type = data.get('type', 'account')
        fraud_score = None
        ring_id = None
        
        if node_type == 'account':
            acc_data = next((a for a in accounts if a['account_id'] == node), None)
            if acc_data:
                fraud_score = acc_data['fraud_score']
                ring_id = acc_data.get('ring_id')
        
        nodes.append({
            'id': node,
            'type': node_type,
            'label': node,
            'fraud_score': fraud_score,
            'ring_id': ring_id
        })
    
    for source, target, data in graph.edges(data=True):
        edges.append({
            'source': source,
            'target': target,
            'type': data.get('type', 'unknown')
        })
    
    flagged_count = len([a for a in accounts if a['fraud_score'] > 50])
    
    output = {
        'summary': {
            'total_accounts': len([n for n in graph.nodes() if graph.nodes[n].get('type') == 'account']),
            'flagged_accounts': flagged_count,
            'rings_detected': len(rings),
            'processing_time_ms': processing_time
        },
        'accounts': accounts,
        'rings': rings,
        'graph': {
            'nodes': nodes,
            'edges': edges
        }
    }
    
    return json.dumps(output, indent=2)
    
    for source, target, data in graph.edges(data=True):
        edges.append({
            'source': source,
            'target': target,
            'type': data.get('type', 'unknown')
        })
    
    flagged_count = len([a for a in accounts if a['fraud_score'] > 50])
    
    output = {
        'summary': {
            'total_accounts': len([n for n in graph.nodes() if graph.nodes[n].get('type') == 'account']),
            'flagged_accounts': flagged_count,
            'rings_detected': len(rings),
            'processing_time_ms': processing_time
        },
        'accounts': accounts,
        'rings': rings,
        'graph': {
            'nodes': nodes,
            'edges': edges
        }
    }
    
    return json.dumps(output, indent=2)
