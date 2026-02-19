from collections import defaultdict

def group_rings(accounts, patterns):
    rings = defaultdict(lambda: {'members': [], 'pattern': '', 'scores': []})
    
    shared_entities = defaultdict(list)
    for acc in accounts:
        for pattern in acc['patterns']:
            if ':' in pattern:
                entity = pattern.split(':', 1)[1]
                shared_entities[entity].append(acc['account_id'])
    
    ring_id = 1
    for entity, members in shared_entities.items():
        if len(members) > 1:
            ring_key = f"RING_{ring_id:03d}"
            pattern_type = entity.split('_')[0]
            
            rings[ring_key]['members'] = members
            rings[ring_key]['pattern'] = pattern_type
            
            for acc in accounts:
                if acc['account_id'] in members:
                    rings[ring_key]['scores'].append(acc['fraud_score'])
                    acc['ring_id'] = ring_key
            
            ring_id += 1
    
    result = []
    for ring_id, data in rings.items():
        result.append({
            'ring_id': ring_id,
            'pattern': data['pattern'],
            'members': data['members'],
            'avg_score': sum(data['scores']) / len(data['scores']) if data['scores'] else 0
        })
    
    return result
