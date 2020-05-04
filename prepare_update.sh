#!/bin/bash   
rm controls_fhemtabletui.txt
find ./www/tablet -type d \( ! -iname ".*" \) -print0 | while IFS= read -r -d '' f; 
  do
   out="DIR $f"
   echo ${out//.\//} >> controls_fhemtabletui.txt
done
find ./www/tablet -type f \( ! -iname ".*" \) -print0 | while IFS= read -r -d '' f; 
  do
   out="UPD "$(stat -f "%Sm" -t "%Y-%m-%d_%T" $f)" "$(stat -f%z $f)" ${f}"
   echo ${out//.\//} >> controls_fhemtabletui.txt
done

# CHANGED file
#echo "FHEM Tablet UI last change:" > CHANGED
#echo $(date +"%Y-%m-%d") >> CHANGED
#echo " - $(git log -1 --pretty=%B)" >> CHANGED






