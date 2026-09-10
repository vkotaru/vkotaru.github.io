#!/usr/bin/env bash
# Render figures/*.tex -> public/figures/*.svg
#
# The SVGs are post-processed so they follow the page's theme: dvisvgm emits
# black strokes and leaves fills defaulting to black, which is invisible on a
# dark background. Ink becomes `currentColor` and TikZ's occluding white
# becomes --fig-bg.
#
# NOTE: currentColor only resolves when the SVG is inlined in the DOM.
# Referencing these with <img src> renders them as an isolated document that
# cannot see the page's colours. Use the <Figure> component.
set -euo pipefail
cd "$(dirname "$0")/.."

command -v pdflatex >/dev/null || { echo "pdflatex not found"; exit 1; }
command -v dvisvgm  >/dev/null || { echo "dvisvgm not found";  exit 1; }

mkdir -p public/figures
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

shopt -s nullglob
for tex in figures/*.tex; do
  name=$(basename "$tex" .tex)
  if ! pdflatex -interaction=nonstopmode -halt-on-error \
                -output-directory "$tmp" "$tex" >"$tmp/$name.stdout" 2>&1; then
    echo "pdflatex failed for $tex:"; tail -25 "$tmp/$name.stdout"; exit 1
  fi
  dvisvgm --pdf --no-fonts --exact-bbox "$tmp/$name.pdf" -o "$tmp/$name.svg" >/dev/null 2>&1

  sed -e "s/stroke='#000'/stroke='currentColor'/g" \
      -e "s/fill='#000'/fill='currentColor'/g" \
      -e "s/fill='#fff'/fill='var(--fig-bg,#fff)'/g" \
      -e "0,/<svg /s/<svg /<svg fill='currentColor' /" \
      "$tmp/$name.svg" > "public/figures/$name.svg"

  printf '  %-28s -> public/figures/%s.svg  (%s)\n' \
    "$tex" "$name" "$(du -h "public/figures/$name.svg" | cut -f1)"
done
