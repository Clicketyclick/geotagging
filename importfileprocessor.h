/** @file importfileprocessor.h
  * Hlavickovy soubor tridy ImportFileProcessor dedici ze tridy QObject
  * , slou�� pro import fotografi�
  */

#ifndef IMPORTFILEPROCESSOR_H
#define IMPORTFILEPROCESSOR_H

#include <QObject>
#include <QUrl>
#include <QDir>
#include <QImageReader>

#include "gpsrouteslist.h"
#include "importfileprocessor.h"
class ImportFileProcessor : public QObject
{
    Q_OBJECT
public:
    explicit ImportFileProcessor(QObject *parent = 0);

    void processDropFile(QString fileName, int recursion);
    int importSubdirs;

    int idRouteCount;
    int idImageCount;

    void loadGpsFile(QString fileName);
    void loadImageFile(QString fileName);
    QStringList *unrecognizedList;
    int countFiles(QString);
    int countProcessed;
signals:
    void importRouteFinished(GpsRoute *gpsRoute);
    void importImageFinished(ImageData *imageData);
    void finished(QStringList *unrecognizedList);
    void setProgressMaximum(int count);
    void setProgressValue(int value);
public slots:
    void processDropUrls(QList<QUrl> *urlList);
    void importImages(QStringList imageList);
    void importGpsFiles(QStringList gpsList);
};

#endif // IMPORTFILEPROCESSOR_H
