import csv, os

'''
Author: Shantanu Deshmukh
Description: Performs null check and extracts data from csv
'''

fw = open("c:/Users/deshm/Documents/CS235 UID/CS235ProjectJS-v3/CS235ProjectJS/src/data/2008_09.csv",'w')
fw.write("INSTNM,INSTURL,ADM_RATE_ALL,SAT_AVG_ALL,ACTCMMID,UGDS,UGDS_MEN,UGDS_WOMEN,TUITIONFEE_IN,TUITIONFEE_OUT\n")

with open("c:/Users/deshm/Documents/CS235 UID/CS235ProjectJS-v3/CS235ProjectJS/src/data/MERGED2008_09_PP.csv", "rb") as fp:
    reader = csv.DictReader(fp)
    for row in reader:
        if row['STABBR'] == 'CA' and row['ADM_RATE_ALL'] != 'NULL' and row['SAT_AVG_ALL'] != 'NULL' and row['ACTCMMID'] != 'NULL' and row['UGDS'] != 'NULL' and row['UGDS_MEN'] != 'NULL' and row['UGDS_WOMEN'] != 'NULL' and row['TUITIONFEE_IN'] != 'NULL' and row['TUITIONFEE_OUT'] != 'NULL':
            fw.write(row['INSTNM']+","+row['INSTURL']+","+row['ADM_RATE_ALL']+","+row['SAT_AVG_ALL']+","+row['ACTCMMID']+","+row['UGDS']+","+row['UGDS_MEN']+","+row['UGDS_WOMEN']+","+row['TUITIONFEE_IN']+","+row['TUITIONFEE_OUT']+"\n");

fw.close()
print "done"