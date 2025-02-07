#!/bin/sh
convert $1 -filter Lanczos -resize 50% -sharpen 0x1.0 /tmp/$1
cp /tmp/$1 $1
