from io import StringIO
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from pdf2image import convert_from_path

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
from whoosh import scoring

from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from .models import publikasi

from django.templatetags.static import static

# from whoosh_app import getWhooshFolder

def inputPublikasiPDF (uuidS, document, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, create_at, update_at, folder_img):
    whoosh_folder =  getWhooshFolder()
    publikasi_index_folder = os.path.join(whoosh_folder, 'publikasi')
    halaman_index_folder = os.path.join(whoosh_folder, 'halaman')
    ix_pub = None
    ix_hal = None
    if not os.path.exists(publikasi_index_folder):
        os.mkdir(publikasi_index_folder)
        ix_pub = buatIndexPublikasi(publikasi_index_folder)
    else :
        ix_pub = open_dir(publikasi_index_folder)
    
    if not os.path.exists(halaman_index_folder):
        os.mkdir(halaman_index_folder)
        ix_hal = buatIndexHalaman(halaman_index_folder)
    else :
        ix_hal = open_dir(halaman_index_folder)

    tanggal_terbit_2 = datetime.strptime(tanggal_terbit, '%m/%d/%Y')

    print ('Error 0,2')
    writer_pub = ix_pub.writer()
    print ('Error 0,3')
    writer_hal = ix_hal.writer()
    print ('Error 0,4')
    try:
        factory = StemmerFactory()
        stemmer = factory.create_stemmer()

        judul_2 = processTest(judul, stemmer)
        deskripsi_2  = processTest(deskripsi, stemmer)
    
        textList = []
        pagenums = set()
        #print ('Error 0')
        infile = open(document, 'rb')
        #print ('Error 1')
        for page in PDFPage.get_pages(infile, pagenums):
            output = StringIO()
            #print ('Error 2')
            manager = PDFResourceManager()
            #print ('Error 3')
            converter = TextConverter(manager, output, laparams=LAParams())
            #print ('Error 4')
            interpreter = PDFPageInterpreter(manager, converter)
            #print ('Error 5')
            interpreter.process_page(page)
            #print ('Error 6')
            #text = ' '.join(output.getvalue().replace('\n',' ').replace('.',' ').replace(',',' ').strip(' ').split())
            text = processTest(output.getvalue().replace('\n',' '), stemmer)
            
            #text = output.getvalue()
            converter.close() 
            output.close
            textList.append(text)
        infile.close()

        #print ('Error 7')

        # uuidS = 'pub_'+str(uuid.uuid4())
    
        writer_pub.add_document(uuid=uuidS, seksi=seksi, judul=judul, deskripsi= deskripsi, judul_process=judul_2, deskripsi_process= deskripsi_2,
            tags=tags, type_pub = 'pdf', tanggal_terbit=tanggal_terbit_2, data_tahun=int(data_tahun), create_at=create_at, update_at=update_at)

        #print ('Error 8')
        for i in range(len(textList)): 
            #print ('Error 9')
            isi = textList[i]
            #print ('Error 15')
            halaman = i + 1
            #print ('Error 16')
            writer_hal.add_document(uuid_publikasi=uuidS, seksi=seksi, judul=judul, deskripsi= deskripsi, 
                halaman=halaman, isi=isi, type_pub = 'pdf', tanggal_terbit = tanggal_terbit_2, data_tahun = int(data_tahun), 
                create_at=create_at, update_at=update_at)
            #print ('Error 17')
        newPublikasi = publikasi(uuid=uuidS, seksi=seksi, judul=judul,deskripsi=deskripsi, tag=tags, type_pub = 'pdf',
            tanggal_terbit=tanggal_terbit_2, data_tahun=data_tahun, create_at=create_at, update_at=update_at)
        newPublikasi.save()

        writer_pub.commit()
        writer_hal.commit()
    except Exception as e: 
        print(e)
        writer_pub.cancel()
        writer_hal.cancel()
        return False
    
    confertPDFToImage(document, folder_img, uuidS)
    return True

def inputPublikasiExcell (uuidS, document, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, create_at, update_at, type_excell):
    whoosh_folder =  getWhooshFolder()
    publikasi_index_folder = os.path.join(whoosh_folder, 'publikasi')
    halaman_index_folder = os.path.join(whoosh_folder, 'halaman')
    ix_pub = None
    # ix_hal = None
    if not os.path.exists(publikasi_index_folder):
        os.mkdir(publikasi_index_folder)
        ix_pub = buatIndexPublikasi(publikasi_index_folder)
    else :
        ix_pub = open_dir(publikasi_index_folder)
    
    # if not os.path.exists(halaman_index_folder):
    #     os.mkdir(halaman_index_folder)
    #     ix_hal = buatIndexHalaman(halaman_index_folder)
    # else :
    #     ix_hal = open_dir(halaman_index_folder)

    tanggal_terbit_2 = datetime.strptime(tanggal_terbit, '%m/%d/%Y')

    writer_pub = ix_pub.writer()
    # writer_hal = ix_hal.writer()

    try:
        factory = StemmerFactory()
        stemmer = factory.create_stemmer()


        judul_2 = processTest(judul, stemmer)
        deskripsi_2  = processTest(deskripsi, stemmer)
    
        wb = open_workbook(document)
        #values = []
        valuesString = ''
        for s in wb.sheets():
        #print 'Sheet:',s.name
            for row in range(1, s.nrows):
                col_names = s.row(0)
                #col_value = []
                col_value_string = ''
                for name, col in zip(col_names, range(s.ncols)):
                    value  = (s.cell(row,col).value)
                    try : value = str(int(value))
                    except : pass
                    if name.value != '':
                        col_value_string = col_value_string +' '+str(name.value) 
                    if value != '':
                        col_value_string = col_value_string +' '+value 
                    #col_value.append((name.value, value))
                #values.append(col_value)
                valuesString = valuesString + ' '+col_value_string

        text = ' '.join(unique_list(processTest(valuesString, stemmer)))
    
        writer_pub.add_document(uuid=uuidS, seksi=seksi, judul=judul, deskripsi= deskripsi, isi = text, 
            judul_process=judul_2, deskripsi_process= deskripsi_2,  tags=tags, 
            type_pub=type_excell, tanggal_terbit=tanggal_terbit_2, data_tahun=data_tahun, 
            create_at=create_at, update_at=update_at)

        # writer_hal.add_document(uuid_publikasi=uuidS, seksi=seksi, judul=judul, deskripsi= deskripsi, 
        #     isi=text, type_pub=type_excell, tanggal_terbit = tanggal_terbit_2,
        #     data_tahun = int(data_tahun), create_at=create_at, update_at=update_at)
            

        # confertPDFToImage(document, folder_img, uuidS)

        newPublikasi = publikasi(uuid=uuidS, seksi=seksi, judul=judul,deskripsi=deskripsi, tag=tags, type_pub=type_excell, 
            tanggal_terbit=tanggal_terbit, data_tahun=data_tahun, create_at=create_at, update_at=update_at)
        newPublikasi.save()

        writer_pub.commit()
        # writer_hal.commit()
        return True
    except Exception as e: 
        print(e)
        writer_pub.cancel()
        # writer_hal.cancel()
        return False

def updatePdf(newUuid, document, uuidLama, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, update_at):
    hasil = deletePdfAndExcell(uuidLama)
    if hasil :
        inputPublikasiPDF(newUuid, document, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, update_at, update_at)

def updateExcell(newUuid, document, uuidLama, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, update_at):
    hasil = deletePdfAndExcell(uuidLama)
    if hasil :
        inputPublikasiExcell(newUuid, document, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, update_at, update_at)

def deletePdfAndExcell(uuid):
    whoosh_folder =  getWhooshFolder()
    publikasi_index_folder = os.path.join(whoosh_folder, 'publikasi')
    halaman_index_folder = os.path.join(whoosh_folder, 'halaman')
    ix_pub = None
    ix_hal = None
    if not os.path.exists(publikasi_index_folder):
        os.mkdir(publikasi_index_folder)
        ix_pub = buatIndexPublikasi(publikasi_index_folder)
    else :
        ix_pub = open_dir(publikasi_index_folder)
    
    if not os.path.exists(halaman_index_folder):
        os.mkdir(halaman_index_folder)
        ix_hal = buatIndexHalaman(halaman_index_folder)
    else :
        ix_hal = open_dir(halaman_index_folder)

    writer_pub = ix_pub.writer()
    writer_hal = ix_hal.writer()

    try:
        #print('Error B 1')
        writer_pub.delete_by_term('uuid', uuid)
        #print('Error B 2')
        writer_hal.delete_by_term('uuid_publikasi', uuid)
        #print('Error B 3')
        writer_pub.commit()
        #print('Error B 4')
        writer_hal.commit()
        #print('Error B 5')
        publikasi.objects.get(uuid = uuid).delete()
        #print('Error B 6')
        return True
    except Exception as e: 
        print(e)
        writer_pub.cancel()
        writer_hal.cancel()
        return False


def confertPDFToImage(filePath, outputPath , p_uuid):
    pages = convert_from_path(filePath, 100)

    i = 1
    for page in pages:
        page.save(outputPath+'\\'+p_uuid+'-'+str(i)+'.jpg', 'JPEG')
        i = i+1
def getWhooshFolder():
    filepath = realpath(__file__)

    dir_of_file = dirname(filepath)
    parent_dir_of_file = dirname(dir_of_file)
    #parents_parent_dir_of_file = dirname(parent_dir_of_file)

    whoosh_folder  = os.path.join(parent_dir_of_file, 'whoosh')

    return whoosh_folder

def buatIndexPublikasi(whoose_index_publikasi_folder):
    schema = Schema(uuid=ID(stored=True, unique=True),
        seksi=ID(stored=True),
        judul=STORED(),
        deskripsi=STORED(),
        judul_process=TEXT(),
        deskripsi_process=TEXT(),
        isi=TEXT(),
        type_pub=STORED(),
        tags=KEYWORD,
        tanggal_terbit = DATETIME(stored=True, sortable=True),
        data_tahun = NUMERIC(stored=True, sortable=True),
        create_at=DATETIME(stored=True, sortable=True),
        update_at=DATETIME(stored=True, sortable=True))

    ix = create_in(whoose_index_publikasi_folder, schema)

    return ix
def buatIndexHalaman(whoose_index_halaman_folder):
    schema = Schema(uuid_publikasi=ID(stored=True),
        seksi=STORED(),
        judul=STORED(),
        deskripsi=STORED(),
        type_pub=STORED(),
        halaman=NUMERIC(stored=True, sortable=True),
        isi=TEXT(),
        tanggal_terbit = DATETIME(stored=True, sortable=True),
        data_tahun = NUMERIC(stored=True, sortable=True),
        create_at=DATETIME(stored=True, sortable=True),
        update_at=DATETIME(stored=True, sortable=True))

    ix = create_in(whoose_index_halaman_folder, schema)

    return ix

def unique_list(l):
    ulist = []
    [ulist.append(x) for x in l if x not in ulist]
    return ulist

def searchPublikasi(text, page):
    factory = StemmerFactory()
    stemmer = factory.create_stemmer()
    
    text = processTest(text, stemmer)
     
    whoosh_folder =  getWhooshFolder()
    publikasi_index_folder = os.path.join(whoosh_folder, 'publikasi')
    ix_pub = None
    #print("Error C 1")
    if not os.path.exists(publikasi_index_folder):
        os.mkdir(publikasi_index_folder)
        ix_pub = buatIndexPublikasi(publikasi_index_folder)
    else :
        ix_pub = open_dir(publikasi_index_folder)
    #print("Error C 2 "+text)

    try:
        #print("Error C 3")
        qp = MultifieldParser(["judul_process", "deskripsi_process", "isi"], schema=ix_pub.schema)
        #print("Error C 4")
        q = qp.parse(text)
        #print("Error C 5")
        searcher = ix_pub.searcher()
        #print("Error C 6")
        facet = sorting.FieldFacet("tanggal_terbit", reverse=True)
        scores = sorting.ScoreFacet()

        results = searcher.search_page(q, page, pagelen=10, sortedby=[scores,facet])
        #print("Error C 7")
        resultAkhir = []
        for item in results :
            baru = {}
            baru['uuid'] = item['uuid']
            baru['judul'] = item['judul']
            baru['seksi'] = item['seksi']
            baru['deskripsi'] = item['deskripsi']
            baru['type_pub'] = item['type_pub']
            baru['halaman_image'] = static('media//Publikasi//images//'+item['uuid']+'-1.jpg')
            if item['type_pub'] == 'pdf' :
                baru['download'] = static('media//Publikasi//pdf//'+item['uuid']+'.pdf')
                baru['halaman_image'] = static('media//Publikasi//images//'+item['uuid']+'-1.jpg')
            elif item['type_pub'] == 'xls' :
                baru['download'] = static('media//excell//'+item['uuid']+'.xls')
                baru['halaman_image'] = static('images/excel.png')
            elif item['type_pub'] == 'xlsx' :
                baru['download'] = static('media//excell//'+item['uuid']+'.xlsx')
                baru['halaman_image'] = static('images/excel.png')
            resultAkhir.append(baru)
        return resultAkhir;
    finally:
        searcher.close()
    
    return None;

def searchHalaman(text, page):
    factory = StemmerFactory()
    stemmer = factory.create_stemmer()
    
    text = processTest(text, stemmer)

    whoosh_folder =  getWhooshFolder()
    halaman_index_folder = os.path.join(whoosh_folder, 'halaman')
    ix_hal = None
    if not os.path.exists(halaman_index_folder):
        os.mkdir(halaman_index_folder)
        ix_hal = buatIndexHalaman(halaman_index_folder)
    else :
        ix_hal = open_dir(halaman_index_folder)
    
    try:
        qp = MultifieldParser(["isi"], schema=ix_hal.schema)
        q = qp.parse(text)
        searcher = ix_hal.searcher()
        facet = sorting.FieldFacet("tanggal_terbit", reverse=True)
        scores = sorting.ScoreFacet()
        results = searcher.search_page(q, page, pagelen=50, sortedby=[scores,facet])
        return unique_list_halaman_dari_publikasi_v2(results, unique_list(text.split()))
    finally:
        searcher.close()
    
    return None;
def unique_list_halaman_dari_publikasi_v2(l, arrSearch):
    
    outerlist = list()
    
    for x in l :
        #print(x)
        ada = False
        for y in outerlist :
            if y['uuid_publikasi'] == x['uuid_publikasi'] :
                y['halaman'].append( int(x['halaman']))
                ada = True
                break
        
        if not ada :
            halAdaPer = []
            halAdaPer.append( int(x['halaman']))
            
            if len(halAdaPer) > 0 :
                baru = {}
                baru['uuid_publikasi'] = x['uuid_publikasi']
                baru['judul'] = x['judul']
                baru['seksi'] = x['seksi']
                baru['deskripsi'] = x['deskripsi']
                baru['halaman'] = []
                for adaItem in halAdaPer :
                    baru['halaman'].append(adaItem)
                outerlist.append(baru.copy())
    
    outerlistBaru = list()
    
    for x in outerlist :
        for y in x['halaman'] :
            baru = {}
            baru['uuid_publikasi'] = x['uuid_publikasi']
            baru['judul'] = x['judul']
            baru['seksi'] = x['seksi']
            baru['deskripsi'] = x['deskripsi']
            baru['halaman'] = int(y)
            baru['halaman_image'] = static('media//Publikasi//images//'+x['uuid_publikasi']+"-"+str(y)+'.jpg')
            outerlistBaru.append(baru)
   
    return outerlistBaru

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
