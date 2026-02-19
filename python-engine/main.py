import sys
import time
from graph_builder import build_graph
from detectors import detect_all_patterns
from scoring import calculate_scores
from ring_grouper import group_rings
from output import generate_json_output

def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <csv_path>", file=sys.stderr)
        sys.exit(1)

    csv_path = sys.argv[1]
    start_time = time.time()

    graph, df = build_graph(csv_path)
    patterns = detect_all_patterns(graph, df)
    accounts = calculate_scores(df, patterns)
    rings = group_rings(accounts, patterns)
    
    processing_time = int((time.time() - start_time) * 1000)
    output = generate_json_output(accounts, rings, graph, processing_time)
    
    print(output)

if __name__ == "__main__":
    main()
