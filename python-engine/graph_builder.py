import pandas as pd
import networkx as nx

def build_graph(csv_path):
    df = pd.read_csv(csv_path)
    G = nx.DiGraph()
    
    for _, row in df.iterrows():
        account_id = row['account_id']
        G.add_node(account_id, type='account')
        
        if pd.notna(row.get('ip_address')):
            ip_node = f"ip_{row['ip_address']}"
            G.add_node(ip_node, type='ip')
            G.add_edge(account_id, ip_node, type='uses_ip')
        
        if pd.notna(row.get('device_id')):
            device_node = f"device_{row['device_id']}"
            G.add_node(device_node, type='device')
            G.add_edge(account_id, device_node, type='uses_device')
        
        if pd.notna(row.get('bank_account')):
            bank_node = f"bank_{row['bank_account']}"
            G.add_node(bank_node, type='bank')
            G.add_edge(account_id, bank_node, type='uses_bank')
    
    return G, df
