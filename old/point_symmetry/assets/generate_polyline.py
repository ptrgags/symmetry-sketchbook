#!/usr/bin/env python
import sys

def generate_polylines(n):
    for i in range(2):
        y = i
        for j in range(n):
            x = j / (n - 1)
            print(f"v {x} {i} 0")

    for i in range(n - 1):
        v1 = (i) + 1
        v2 = (i + 1) + 1
        v3 = (n + i) + 1
        v4 = (n + i + 1) + 1
        print(f"f {v1} {v2} {v3}")
        print(f"f {v2} {v4} {v3}")

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("usage: ./generate_polylines.py N")
        sys.exit(1)

    n = int(sys.argv[1])
    generate_polylines(n)

