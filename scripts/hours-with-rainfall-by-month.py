import csv
from datetime import *
from calendar import monthrange
import time
import itertools


start_time = datetime(1990, 1, 1, 0, 0)
fifteen_minutes = timedelta(minutes=15)
day = timedelta(days=1)
minimum_value = 0.08

current_time = start_time

f = open("data/tblModelRain_for_Casey_07012013_EDW.csv")
c = csv.reader(f, delimiter=',', quotechar='"')

# dictionaries and lists

data = {}
for months in range(1, 13):
    data[months] = {}
    for hours in range(0, 24):
        data[months][hours] = {'total': 0, 'match': 0, 'percent': 0}

d = []

for count, row in enumerate(c):
    row.append(count)
    d.append(row)

#the actual script

lowest_possible = 0
for year in range(1990, 2013):
    for month in range(1, 13):
        for day in range(1, monthrange(year, month)[1]+1):
            for hour in range(0, 24):
                data[month][hour]['total'] += 1
                match = False
                for quarter_hour in range(0, 4):
                    if match == False:
                        start_time = datetime(year, month, day, hour, quarter_hour * 15) + fifteen_minutes
                        for row in itertools.islice(d, lowest_possible, len(d)):
                            structTime = time.strptime(row[1], "%m/%d/%Y %H:%M:%S")
                            if (datetime(*structTime[:6]) == start_time) and (float(row[2]) >= minimum_value):
                                print hour, month, start_time, start_time - datetime(*structTime[:6]), row[2]
                                data[month][hour]['match'] += 1
                                match = True
                                lowest_possible = row[4]
                            if start_time - datetime(*structTime[:6]) < timedelta(minutes=0):
                                break
                    else:
                        break
                    f.seek(0)

#output

for months in range(1, 13):
    for hours in range(0, 24):
        data[months][hours]['percent'] = float(data[months][hours]['match']) / float(data[months][hours]['total'])

final_months = {}
for months in range(1, 13):
    final_months[months] = []
    for hours in range(0, 24):
        final_months[months].append(data[months][hours]['percent'])

print final_months