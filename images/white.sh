#!/bin/sh
convert $1 -background white -alpha remove -alpha off /tmp/$1
cp /tmp/$1 $1
