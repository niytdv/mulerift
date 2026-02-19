import networkx as nx
import pandas as pd
from collections import defaultdict

def detect_shared_ip(G):
    patterns = defaultdict(list)
    ip_nodes = [n for n, d in G.nodes(data=True) if d.get('type') == 'ip']
    
    for ip_node in ip_nodes:
        accounts = [n for n in G.predecessors(ip_node)]
        if len(accounts) > 1:
            for acc in accounts:
                patterns[acc].append(f"shared_ip:{ip_node}")
    
    return patterns

def detect_shared_device(G):
    patterns = defaultdict(list)
    device_nodes = [n for n, d in G.nodes(data=True) if d.get('type') == 'device']
    
    for device_node in device_nodes:
        accounts = [n for n in G.predecessors(device_node)]
        if len(accounts) > 1:
            for acc in accounts:
                patterns[acc].append(f"shared_device:{device_node}")
    
    return patterns

def detect_shared_bank(G):
    patterns = defaultdict(list)
    bank_nodes = [n for n, d in G.nodes(data=True) if d.get('type') == 'bank']
    
    for bank_node in bank_nodes:
        accounts = [n for n in G.predecessors(bank_node)]
        if len(accounts) > 1:
            for acc in accounts:
                patterns[acc].append(f"shared_bank:{bank_node}")
    
    return patterns

def detect_rapid_creation(df):
    patterns = defaultdict(list)
    df['created_at'] = pd.to_datetime(df['created_at'])
    df_sorted = df.sort_values('created_at')
    
    for i in range(len(df_sorted) - 1):
        time_diff = (df_sorted.iloc[i + 1]['created_at'] - df_sorted.iloc[i]['created_at']).total_seconds()
        if time_diff < 300:  # 5 minutes
            patterns[df_sorted.iloc[i]['account_id']].append('rapid_creation')
            patterns[df_sorted.iloc[i + 1]['account_id']].append('rapid_creation')
    
    return patterns

def detect_velocity(df):
    patterns = defaultdict(list)
    
    for account_id in df['account_id'].unique():
        acc_txns = df[df['account_id'] == account_id]
        if len(acc_txns) > 10:
            patterns[account_id].append('high_velocity')
    
    return patterns

def detect_all_patterns(G, df):
    all_patterns = defaultdict(list)
    
    for pattern_dict in [
        detect_shared_ip(G),
        detect_shared_device(G),
        detect_shared_bank(G),
        detect_rapid_creation(df),
        detect_velocity(df)
    ]:
        for acc, patterns in pattern_dict.items():
            all_patterns[acc].extend(patterns)
    
    return all_patterns
