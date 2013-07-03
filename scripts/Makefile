all: city-limits.zip city-limits.json rain-gages.csv rain-gages-with-header.csv rain-gages.json city-with-gages-topo.json

city-limits.zip:
	curl -o city-limits.zip http://www.pasda.psu.edu/philacity/data/phila-city_limits_shp.zip

city_limits.shp: city-limits.zip
	unzip city-limits.zip
	touch city_limits.shp

city-limits.json: city_limits.shp
	ogr2ogr -f "GeoJSON" -t_srs "EPSG:4326" city-limits.json city_limits.shp

rain-gages.csv:
	curl -o rain-gages.csv http://www.phillywatersheds.org/castdata/rain_out.txt

rain-gages-with-header.csv: rain-gages.csv
	echo "rg_id,status,date,lat,lng,foo,bar" | cat - rain-gages.csv > rain-gages-with-header.csv

rain-gages.json: rain-gages-with-header.csv
	topojson --cartesian --latitude lat --longitude lng --id-property rg_id rain-gages-with-header.csv -o rain-gages.json

city-with-gages-topo.json: 
	topojson --id-property rg_id -o ../data/city-with-gages-topo.json city-limits.json rain-gages.json