'''
Created on 13 Mar 2015

@author: murrayking
'''

import json
from pprint import pprint
from os.path import expanduser
home = expanduser("~")
with open(home + '/edina-weather-project/data/weather.json') as data_file:    
    data = json.load(data_file)
    locations  = data['SiteRep']['DV']['Location']
    tempAvgs = {}
    tempCounts = {}
    windAvgs = {}
    windCounts = {}
    cloudAvgs = {}
    cloudCounts = {}
    
    for x in range(7, 12):
        tempAvgs[x] = 0
        tempCounts[x] = 1
        windAvgs[x] = 0.0
        windCounts[x] = 1
        cloudAvgs[x] = 0.0
        cloudCounts[x] = 1

    
    count = {}
    for l in locations:
        periodOne = l['Period'][1]
        
        rep =  periodOne['Rep']
        seven =  rep[7]
        

        for x in range(7, 12):
            
            hour = rep[x]
            if 'T' in hour:
               
                tempAvgs[x] = tempAvgs[x] + float(hour['T'])
                tempCounts[x] = tempCounts[x] + 1
            if 'S' in hour:
                print str(float(hour['S']))
                windAvgs[x] = windAvgs[x] + float(hour['S'])
                windCounts[x] = windCounts[x] + 1
            if 'W' in hour:
                print str(float(hour['W']))
                cloudAvgs[x] = cloudAvgs[x] + float(hour['W'])
                cloudCounts[x] = cloudCounts[x] + 1
                


jsonel =''' {{
    "time":"{da}",
    "cloud":"{cl}",
    "temp":"{te}",
    "windspeed" : "{ws}"
}},'''

for h in range(7, 12):

    mDate = "2015-03-20 {0:02d}" .format(h) + ":{0:02d}".format(0) + ":00"
    cloud =  cloudAvgs[h] /cloudCounts[h]
    windspeed = windAvgs[h] / windCounts[h]  
    temperature = tempAvgs[h] / tempCounts[h]  
    print jsonel.format(da=mDate, te=temperature, cl=cloud, ws=windspeed)
        
    
