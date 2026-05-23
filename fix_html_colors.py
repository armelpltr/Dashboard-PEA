with open(r'C:\Users\Armel\Documents\Dashboard-PEA\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Each entry: (unique path fragment, color)
color_map = [
    ('rect x="2" y="7" width="20"',          '#7c6df5'),  # briefcase → purple
    ('M1 12s4-8 11-8 11 8 11 8-4 8-11',      '#5b8dee'),  # eye → blue
    ('M18 8A6 6 0 0 0 6 8c0 7-3 9',          '#f5b731'),  # bell → gold
    ('r="10"/><circle cx="12" cy="12" r="6"', '#5b8dee'),  # target → blue
    ('polygon points="16.24 7.76',            '#00e09e'),  # compass → green
    ('M21 12V7H5a2 2 0 0 1 0-4h14v4',        '#00e09e'),  # wallet → green
    ('x1="18" y1="20" x2="18" y2="10"',      '#5b8dee'),  # barchart → blue
    ('M21 15a2 2 0 0 1-2 2H7l-4 4V5',        '#7c6df5'),  # message → purple
    ('M2 20h20"/><path d="m4 20',            '#f5b731'),  # crown → gold
    ('M20 21v-2a4 4 0 0 0-4-4H8',           '#8892a8'),  # user → muted
    ('M18.36 6.64a9 9 0 1 1-12.73',         '#ff4d6a'),  # power → red
]

old_attr = 'stroke="currentColor" stroke-width="1.75"'

for fragment, color in color_map:
    # Find SVG containing this fragment and replace its stroke attr
    idx = 0
    while True:
        pos = html.find(fragment, idx)
        if pos == -1:
            break
        # Find start of this SVG
        svg_start = html.rfind('<svg', 0, pos)
        svg_end   = html.find('</svg>', pos) + 6
        old_svg = html[svg_start:svg_end]
        new_svg = old_svg.replace(old_attr, f'stroke="{color}" stroke-width="2"', 1)
        html = html[:svg_start] + new_svg + html[svg_end:]
        idx = svg_start + len(new_svg)

with open(r'C:\Users\Armel\Documents\Dashboard-PEA\index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("done")
