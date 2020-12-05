#!/bin/bash
paths=$(echo `ls src/content/` | sed 's/ /,/g')
webpack --env paths=$paths