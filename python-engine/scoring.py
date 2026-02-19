def calculate_scores(df, patterns):
    accounts = []
    
    for account_id in df['account_id'].unique():
        account_patterns = patterns.get(account_id, [])
        
        score = 0
        score += len([p for p in account_patterns if 'shared_ip' in p]) * 20
        score += len([p for p in account_patterns if 'shared_device' in p]) * 25
        score += len([p for p in account_patterns if 'shared_bank' in p]) * 30
        score += len([p for p in account_patterns if 'rapid_creation' in p]) * 15
        score += len([p for p in account_patterns if 'high_velocity' in p]) * 10
        
        score = min(score, 100)
        
        accounts.append({
            'account_id': account_id,
            'fraud_score': score,
            'patterns': account_patterns
        })
    
    return accounts
