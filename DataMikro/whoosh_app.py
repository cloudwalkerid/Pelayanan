import os
from os.path import dirname, realpath
import sys, getopt
import uuid
import ast
from datetime import datetime

from whoosh.index import create_in, open_dir
from whoosh.fields import Schema, TEXT, ID, DATETIME, NUMERIC, STORED, KEYWORD
from whoosh.qparser import QueryParser, MultifieldParser
from whoosh.analysis import StemmingAnalyzer
from whoosh import sorting

from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from .models import table, datasource

from django.templatetags.static import static

def insertTable(uuid, nama, deskripsi, uuidDatasource, nama_datasource, deskripsi_datasource, isi, 
    pembuat_nama, pembuat_seksi, create_at, update_at, uuid_user):

    whoosh_folder =  getWhooshFolder()
    tabel_index_folder = os.path.join(whoosh_folder, 'tabel')
    ix_tabel = None
    if not os.path.exists(tabel_index_folder):
        os.mkdir(tabel_index_folder)
        ix_tabel = buatIndexTable(tabel_index_folder)
    else :
        ix_tabel = open_dir(tabel_index_folder)
    
    writer_tabel = ix_tabel.writer()
    print ('Error 0,4')
    try:
        factory = StemmerFactory()
        stemmer = factory.create_stemmer()

        nama_2 = processTest(nama, stemmer)
        deskripsi_2  = processTest(deskripsi, stemmer)
    
        writer_tabel.add_document(uuid=uuid, pembuat_nama= pembuat_nama, pembuat_seksi=pembuat_seksi, 
            nama=nama_2, deskripsi=deskripsi_2, nama_datasource=nama_datasource, deskripsi_datasource=deskripsi_datasource, 
            nama_asli=nama, deskripsi_asli=deskripsi, isi = isi, create_at=create_at, update_at=update_at)

        newTabel = table(uuid=uuid, nama=nama, deskripsi=deskripsi, seksi = pembuat_seksi, 
            uuid_datasource = uuidDatasource, create_at=create_at, update_at=update_at, uuid_user = uuid_user)

        newTabel.save()
        writer_tabel.commit()
        
        return True
    except Exception as e: 
        print(e)
        writer_tabel.cancel()

        return False

def deleteTabel(uuid) :
    whoosh_folder =  getWhooshFolder()
    tabel_index_folder = os.path.join(whoosh_folder, 'tabel')
    ix_tabel = None
    if not os.path.exists(tabel_index_folder):
        os.mkdir(tabel_index_folder)
        ix_tabel = buatIndexTable(tabel_index_folder)
    else :
        ix_tabel = open_dir(tabel_index_folder)
    
    writer_tabel = ix_tabel.writer()

    try:
        #print('Error B 1')
        writer_tabel.delete_by_term('uuid', uuid)
        #print('Error B 2')
        writer_tabel.commit()
        #print('Error B 5')
        table.objects.get(uuid = uuid).delete()
        #print('Error B 6')
        return True
    except Exception as e: 
        print(e)
        writer_tabel.cancel()
        return False

def deleteDataSource(uuid) :
    whoosh_folder =  getWhooshFolder()
    tabel_index_folder = os.path.join(whoosh_folder, 'tabel')
    ix_tabel = None
    if not os.path.exists(tabel_index_folder):
        os.mkdir(tabel_index_folder)
        ix_tabel = buatIndexTable(tabel_index_folder)
    else :
        ix_tabel = open_dir(tabel_index_folder)
    
    writer_tabel = ix_tabel.writer()

    try:
        #print('Error B 1')
        writer_tabel.delete_by_term('uuid_datasource', uuid)
        #print('Error B 2')
        #print('Error B 5')
        datasource.objects.get(uuid = uuid).delete()
        #print('Error B 6')
        table.objects.get(uuid_datasource = uuid).delete()
        
        writer_tabel.commit()
        return True
    except Exception as e: 
        print(e)
        writer_tabel.cancel()
        return False

def buatIndexTable(whoose_index_tabel_folder):
    schema = Schema(uuid=ID(stored=True, unique=True),
        pembuat_nama=ID(stored=True),
        pembuat_seksi=ID(stored=True),
        nama=TEXT(),
        deskripsi=TEXT(),
        uuid_datasource=ID(stored=True),
        nama_datasource=TEXT(),
        deskripsi_datasource=TEXT(),
        nama_asli=STORED(),
        deskripsi_asli=STORED(),
        isi = STORED(),
        create_at=DATETIME(stored=True, sortable=True),
        update_at=DATETIME(stored=True, sortable=True))

    ix = create_in(whoose_index_tabel_folder, schema)

def searchTabel(text, page):
    factory = StemmerFactory()
    stemmer = factory.create_stemmer()
    
    text = processTest(text, stemmer)
     
    whoosh_folder =  getWhooshFolder()
    tabel_index_folder = os.path.join(whoosh_folder, 'tabel')
    ix_tabel = None
    if not os.path.exists(tabel_index_folder):
        os.mkdir(tabel_index_folder)
        ix_tabel = buatIndexTable(tabel_index_folder)
    else :
        ix_tabel = open_dir(tabel_index_folder)

    try:
        #print("Error C 3")
        qp = MultifieldParser(["pembuat_nama", "pembuat_seksi", "nama", "deskripsi"
            ,"nama_datasource", "deskripsi_datasource"], schema=ix_tabel.schema)
        #print("Error C 4")
        q = qp.parse(text)
        #print("Error C 5")
        searcher = ix_tabel.searcher()
        #print("Error C 6")
        facet = sorting.FieldFacet("update_at", reverse=True)
        scores = sorting.ScoreFacet()
        
        results = searcher.search_page(q, page, pagelen=10, sortedby=[scores, facet])
        #print("Error C 7")
        resultAkhir = []
        for item in results :
            baru = {}
            baru['uuid'] = item['uuid']
            baru['pembuat_nama'] = item['pembuat_nama']
            baru['pembuat_seksi'] = item['pembuat_seksi']
            baru['nama'] = item['nama_asli']
            baru['deskripsi'] = item['deskripsi_asli']
            baru['isi'] = item['isi']
            baru['create_at'] = item['create_at']
            baru['update_at'] = item['update_at']
            resultAkhir.append(baru)
        return resultAkhir;
    finally:
        searcher.close()
    
    return None;

def getWhooshFolder():
    filepath = realpath(__file__)

    dir_of_file = dirname(filepath)
    parent_dir_of_file = dirname(dir_of_file)
    #parents_parent_dir_of_file = dirname(parent_dir_of_file)

    whoosh_folder  = os.path.join(parent_dir_of_file, 'whoosh')

    return whoosh_folder

def getProjectDir():
    filepath = realpath(__file__)

    dir_of_file = dirname(filepath)
    parent_dir_of_file = dirname(dir_of_file)
    #parents_parent_dir_of_file = dirname(parent_dir_of_file)

    return parent_dir_of_file
    
def processTest(text, stemmer):
    text = text.replace('https://m a m asakab.bps.go.id', '').strip(' ')
    text = text.replace("\""," ").replace("\'"," ").replace("["," ")
    text = text.replace("]"," ").replace("("," ").replace(")"," ")
    text = text.replace("."," ").replace(","," ")
    text = text.lower()
    text = ' '.join(text.strip(' ').split())
    text = stemmer.stem(text)

    return text