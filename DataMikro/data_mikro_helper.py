from dbfread import DBF
import sqlite3

import os
from os.path import dirname, realpath
import copy
import json

def insertDBF(filePathInsert, filePathOutput, uuid) :
    table = DBF(filePathInsert)
    fieldsa = table.fields
    createString = 'CREATE TABLE ISI ('
    for itemfield in fieldsa :
        createString = createString+' '+itemfield.name+' '
        if itemfield.type == 'I':
            createString = createString+ ' integer, '
        elif itemfield.type == 'N' or itemfield.type == 'B' or itemfield.type == 'O' or itemfield.type == 'F':
            createString = createString+ ' real, '
        elif itemfield.type == 'D' or itemfield.type == 'T':
            createString = createString+ ' datetime, '
        else:
            createString = createString+ ' text, '
    createString = createString[:-2]+')'

    conn = sqlite3.connect(filePathOutput)
    try:
        c = conn.cursor()
        c.execute(createString)
        
        for record in table:
            insertIsi = 'INSERT INTO ISI ('
            fieldName = ''
            fieldValue = ''
            for k, v in record.items():
                fieldName = fieldName + str(k) +' , '
                fieldValue = fieldValue + '"'+str(v) + '" , '
            fieldName = fieldName [:-2]
            fieldValue = fieldValue [:-2]
            insertIsi = insertIsi + fieldName + ' ) VALUES ('+fieldValue+')'
            #print(insertIsi)
            c.execute(insertIsi)
        conn.commit()
        return True
    except Exception as e: 
        print(e)
        conn.rollback()
        return False

def getListVariabel(uuid) :
    conn = sqlite3.connect(getProjectDir()+'//DataMikro//datasource//'+uuid+'.db')
    try:
        c = conn.cursor()
        c.execute("PRAGMA table_info('ISI')")

        allVar = c.fetchall()
        returnValue = []

        for itemVar in allVar:
            #print(itemVar)
            itemJSON = {}
            itemJSON['nama']=str(itemVar[1])
            itemJSON['type']=str(itemVar[2])
            returnValue.append(itemJSON)

        return returnValue
    except Exception as e: 
        print(e)
        return None

def insertExcell (filePathInsert, filePathOutput, uuid) :
    pass
    
def insertCsv(filePathInsert, filePathOutput, uuid) :
    pass

def doQuery(uuid):
    fileJsonPath = os.path.join(getFolderJSON(), uuid+'.json')
    result = list()
    returnValue = {}

    with open(fileJsonPath) as f:
        data = json.load(f)
        queryList = getAllQuery(data)
        conn = sqlite3.connect(getProjectDir()+'//DataMikro//datasource//'+data['datasourceuuid']+'.db')
        for itemQuery in queryList :
            print('awal')
            print(itemQuery.getQuery())
            print('akhir')
            c = conn.cursor()
            c.execute(itemQuery.getQuery())
            hasil = c.fetchall()
            resultItem = list()
            for row in hasil:
                print(row)
            for itemHasil in hasil :
                d = {}
                for idx,col in enumerate(c.description):
                    d[col[0]] = itemHasil[idx]
                resultItem.append(d)
            result.append(resultItem)
        returnValue['jsonTable'] = copy.deepcopy(data)
        returnValue['result'] = copy.deepcopy(result)
    print (returnValue)
    return returnValue

def getFolderJSON():
    return os.path.join(getProjectDir(), 'DataMikro//JsonTable')

def getFolderDataSource():
    return os.path.join(getProjectDir(), 'DataMikro//datasource')

def getProjectDir():
    filepath = realpath(__file__)

    dir_of_file = dirname(filepath)
    parent_dir_of_file = dirname(dir_of_file)
    #parents_parent_dir_of_file = dirname(parent_dir_of_file)

    return parent_dir_of_file

def getAllQuery(jsonTable) :
    queryListRow = list()
    queryListColumn = list()
    queryListAll = list()
    queryRoot = query()


    if 'weight' in jsonTable :
        if 'values' in jsonTable:
            for itemValue in jsonTable['values'] :
                if itemValue['operasi'] == 'sum':
                    queryRoot.addSelect('SUM('+jsonTable['weight']+'*'+itemValue['namaVar']+')'+
                    ' AS '+itemValue['uuid'])
                elif itemValue['operasi'] == 'average':
                    queryRoot.addSelect('SUM('+jsonTable['weight']+'*'+itemValue['namaVar']+') / SUM('+jsonTable['weight']+') '+
                    ' AS '+itemValue['uuid'])
                elif itemValue['operasi'] == 'count':
                    queryRoot.addSelect('SUM('+jsonTable['weight']+') AS '+itemValue['uuid'])
        else :
            queryRoot.addSelect('SUM('+jsonTable['weight']+') AS v_aaaaaaaaabbbbbbbbb')
    else :
        if 'values' in jsonTable:
            for itemValue in jsonTable['values'] :
                if itemValue['operasi'] == 'sum':
                    queryRoot.addSelect('SUM('+itemValue['namaVar']+') AS '+itemValue['uuid'])
                elif itemValue['operasi'] == 'average':
                    queryRoot.addSelect('AVG('+jsonTable['weight']+') AS '+itemValue['uuid'])
                elif itemValue['operasi'] == 'count':
                    queryRoot.addSelect('COUNT('+itemValue['namaVar']+') AS '+itemValue['uuid'])
        else :
            queryRoot.addSelect('COUNT(*) AS v_aaaaaaaaabbbbbbbbb')

    if 'filters' in jsonTable :
        for itemFilter in jsonTable['filters']:
            itemWhereRoot  = '"'+itemFilter['namaVar']+'" '+itemFilter['operasi']+' '+itemFilter['pembanding']
            queryRoot.addWhere(itemWhereRoot)

    if 'rowCategory' in jsonTable and len(jsonTable['rowCategory']) > 0 :
        queryListRow = category(jsonTable['rowCategory'], queryRoot)
    
    if 'columnCategory' in jsonTable and len(jsonTable['columnCategory']) > 0:
        queryListColumn = category(jsonTable['columnCategory'], queryRoot)

    if 'rowCategory' not in jsonTable :
        return queryListColumn
    elif len(jsonTable['rowCategory']) == 0 :
        return queryListColumn
    elif 'columnCategory' not in jsonTable :
        return queryListRow
    elif len(jsonTable['columnCategory']) == 0:
        return queryListRow
    else :
        for itemColumn in queryListColumn :
            for itemRow in queryListRow :
                queryItemItem = query()
                queryItemItem.copySelect(itemColumn.getSelect().copy())
                queryItemItem.copySelect(itemRow.getSelect().copy())
                queryItemItem.copyWhere(itemColumn.getWhere().copy())
                queryItemItem.copyWhere(itemRow.getWhere().copy())
                queryItemItem.copyGroup(itemColumn.getGroup().copy())
                queryItemItem.copyGroup(itemRow.getGroup().copy())
                queryListAll.append(queryItemItem)
        return queryListAll

def category(jsonCategory, parentQuery) :
    queryList = list()
    for itemJSONCategory in jsonCategory:
        queryItem = query()
        queryItem.copySelect(parentQuery.getSelect().copy())
        queryItem.copyWhere(parentQuery.getWhere().copy())
        queryItem.copyGroup(parentQuery.getGroup().copy())
        recode = ""
        namaVar = itemJSONCategory['namaVar']
        uuid = itemJSONCategory ['uuid']
        adaElseRecode = False

        queryItem.addGroup('"'+uuid+'"')
        
        if itemJSONCategory['typeRecode'] == 'integer' :
            recode = 'CASE '
            elseRecode = ' ELSE NULL '
            for itemRecode in itemJSONCategory['itemsRecode'] :
                if itemRecode['jenis'] == 1 :
                    recode = recode+ ' WHEN '+ namaVar+' <= '+itemRecode['atas']+' THEN "'+itemRecode['hasil']+'"'
                elif itemRecode['jenis'] == 2:
                    recode = recode+ ' WHEN '+itemRecode['bawah']+' <= '+ namaVar+' AND '+namaVar+'<= '+itemRecode['atas']+' THEN "'+itemRecode['hasil']+'"'
                elif itemRecode['jenis'] == 3:
                    recode = recode+ ' WHEN '+itemRecode['bawah']+' <= '+ namaVar+' THEN "'+itemRecode['hasil']+'"'
                elif itemRecode['jenis'] == 4:
                    elseRecode = ' ELSE '+itemRecode['hasil']
                    adaElseRecode = True
            recode = recode+elseRecode + ' END AS "'+uuid+'"'
            queryItem.addSelect(recode)
        elif itemJSONCategory['typeRecode'] == 'double' :
            recode = 'CASE '
            elseRecode = ' ELSE NULL '
            for itemRecode in itemJSONCategory['itemsRecode'] :
                if itemRecode['jenis'] == 1 :
                    recode = recode+ ' WHEN '+ namaVar+' <= '+itemRecode['atas']+' THEN "'+itemRecode['hasil']+'"'
                elif itemRecode['jenis'] == 2:
                    recode = recode+ ' WHEN '+itemRecode['bawah']+' < '+ namaVar+' AND '+namaVar+'<= '+itemRecode['atas']+' THEN "'+itemRecode['hasil']+'"'
                elif itemRecode['jenis'] == 3:
                    recode = recode+ ' WHEN '+itemRecode['bawah']+' < '+ namaVar+' THEN "'+itemRecode['hasil']+'"'
                elif itemRecode['jenis'] == 4:
                    elseRecode = ' ELSE '+itemRecode['hasil']
                    adaElseRecode = True
            recode = recode+elseRecode + ' END AS "'+uuid+'"'
            queryItem.addSelect(recode)
        elif itemJSONCategory['typeRecode'] == 'string' :
            recode = "CASE "
            elseRecode = ' ELSE NULL '
            for itemRecode in itemJSONCategory['itemsRecode'] :
                if itemRecode['jenis'] == 1 :
                    orRecode = ''
                    for itemOr in itemRecode['dari'] :
                        orRecode = orRecode + ' '+namaVar+' = "'+itemOr+'" OR '
                    recode =recode+ ' WHEN '+orRecode[:-3]+' THEN "'+itemRecode['hasil']+'"'
                elif itemRecode['jenis'] == 2:
                    relseRecode =  ' ELSE "'+itemRecode['hasil']+'"'
                    adaElseRecode = True
            recode = recode +elseRecode +' END AS "'+uuid+'"'
            queryItem.addSelect(recode)
        elif itemJSONCategory['typeRecode']== 'none' :
            recode = namaVar+' AS "'+uuid+'"'
            queryItem.addSelect(recode)

        queryItem.addSelect(recode)
        if not adaElseRecode :
            queryItem.addWhere(' "'+uuid+'" IS NOT NULL ')
        
        if 'childrens' in itemJSONCategory :
            queryList.append(category(itemJSONCategory['childrens']), queryItem)
        else :
            queryList.append(queryItem)
    return queryList
            

class query:
    def __init__(self):
        self.select = list()
        self.where = list()
        self.groupby = list()

    def addSelect(self,variabel) :
        self.select.append(variabel)

    def addWhere (self, itemWhere) :
        self.where.append(itemWhere)

    def addGroup(self, itemGroup) :
        self.groupby.append(itemGroup)

    def copySelect(self, selectsOld):
        self.select.extend(selectsOld)
    
    def copyWhere(self, wheresOld):
        self.where.extend(wheresOld)

    def copyGroup (self, groupOld):
        self.groupby.extend(groupOld)
    
    def getSelect(self) :
        return self.select
    
    def getWhere (self) :
        return self.where
    
    def getGroup (self):
        return self.groupby

    def getQuery (self) :
        query = " SELECT "
        for itemSelect in self.select :
            query = query + " "+itemSelect+" , "
        query = query[:-2] + " FROM ISI "
        if len(self.where) > 0 :
            query = query +" WHERE "
            for itemWhere in self.where :
                query = query +" "+itemWhere+" AND "
            query = query[:-4]

        if len(self.groupby) >0 :
            query = query + " GROUP BY "
            for itemGroup in self.groupby :
                query = query+" "+itemGroup+" , "
            query = query [:-2]
        return query
