config = require('../config/main');
const Gene = require('../models/geneModel');
const ResponseMMP = require('../models/responseMMP');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const async = require('async');

// = =======================================
// Count Route
// = =======================================
exports.count = function(req, res, next) {
  let filter = req.filter !== null ? req.filter : {};

  Gene.count(filter, function(err, count) {
    if (err) {
      console.log('there are %d jungle adventures', count);
    }
    res.status(200).json(new ResponseMMP().response(count));
  });
};

// = =======================================
// Read from Xls Route
// = =======================================
exports.readFromXls = function(req, res, next) {
  let pathFile = req.query.pathFile;
  console.log(pathFile);
  if (pathFile === null || pathFile === '') {
    res.status(200).json(
      new ResponseMMP().responseError({
        code: 0,
        message: 'File path is required',
      })
    );
    return;
  }
  let geneSaves = [];
  let notSaves = [];
  // 'data/files/test.xlsx'
  let wb = XLSX.readFile(pathFile);
  let jsonXSLX = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  let count = 0;

  async.eachSeries(
    jsonXSLX,
    function(row, callback) {
      count++;
      let cellbaseId = row.cellbase_id;
      let hgnc = row.HGNC_id;

      let err = new Error();
      err.break = true;
      console.log(count + ': ' + JSON.stringify(row) + ': ' + cellbaseId);

      // if (count > 5000) {
      //   notSaves.push(count + ': ' + name);
      //   setImmediate(callback);
      // } else {
      if (!cellbaseId) {
        // Break out of async
        err.status = 422;
        err.msg = 'Gene name is required.';
        return callback(err);
      }

      cellbaseId = cellbaseId.trim();
      Gene.findOne(
        {
          cellbaseId,
        },
        (err, existingGene) => {
          if (err) {
            console.log('Error already exists:' + cellbaseId);
            setImmediate(callback);
          }

          //
          if (existingGene) {
            console.log('already exists:' + cellbaseId);
            notSaves.push(count + ': ' + cellbaseId);
            setImmediate(callback);
          } else {
            //
            const gene = new Gene({
              cellbaseId,
              hgnc: hgnc,
            });
            console.log('pushing' + JSON.stringify(gene));
            console.log('pushing');

            gene.save(function(err, geneResponse) {
              if (!err) {
                geneSaves.push(count + ': ' + geneResponse.cellbaseId);
              }
              callback();
            });
          }
        }
      );
    },
    // }
    function(err) {
      if (err && err.break) {
        res
          .status(err.status)
          .json(new ResponseMMP().responseError({message: err.msg}));
      } else {
        console.log('Terminando');
        let responseData = {
          saves: geneSaves,
          notSaves: notSaves,
        };
        res.status(200).json(new ResponseMMP().response(responseData));
      }
    }
  );
};

// = =======================================
// Add reference from Xls
// = =======================================
exports.addReferenceFromXls = function(req, res, next) {
  console.log('Add reference');
  let pathFile = req.query.pathFile;
  console.log(pathFile);
  if (pathFile === null || pathFile === '') {
    res.status(200).json(
      new ResponseMMP().responseError({
        code: 0,
        message: 'File path is required',
      })
    );
    return;
  }

  let wb = XLSX.readFile(pathFile);
  let jsonXSLX = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  let count = 0;
  let updatesGenes = [];
  let notUpdatesGenes = [];
  async.eachSeries(
    jsonXSLX,
    function(row, callback) {
      count++;
      let cellbaseId = row.cellbase_id;
      let err = new Error();
      err.break = true;
      console.log(count + ': ' + JSON.stringify(row) + ': ' + cellbaseId);

      // if (count > 5000) {
      //   notSaves.push(count + ': ' + name);
      //   setImmediate(callback);
      // } else {
      if (!cellbaseId) {
        // Break out of async
        err.status = 422;
        err.msg = 'Gene name is required.';
        return callback(err);
      }
      cellbaseId = cellbaseId.trim();

      Gene.findOne(
        {
          cellbaseId,
        },
        (err, existingGene) => {
          if (err) {
            console.log('Error already exists:' + cellbaseId);
            setImmediate(callback);
          }

          // If user is not unique, return error
          if (existingGene) {
            existingGene.reference = row.RefSeq_id;
            console.log('already exists:' + cellbaseId);
            Gene.update({_id: existingGene._id}, existingGene, function(
              err,
              geneResponse
            ) {
              if (!err) {
                updatesGenes.push(cellbaseId);
                callback();
              } else {
                setImmediate(callback);
              }
            });
          } else {
            // If email is unique and password was provided, create account
            notUpdatesGenes.push(cellbaseId);
            setImmediate(callback);
          }
        }
      );
    },
    // }
    function(err) {
      if (err && err.break) {
        res
          .status(err.status)
          .json(new ResponseMMP().responseError({message: err.msg}));
      } else {
        console.log('Terminando');
        let responseData = {
          saves: updatesGenes,
          notSaves: notUpdatesGenes,
        };
        res.status(200).json(new ResponseMMP().response(responseData));
      }
    }
  );
};

// = =======================================
// FindByName Route
// = =======================================
exports.findByName = function(req, res, next) {
  let name = req.query.name;
  Gene.findOne(
    {
      $or: [{cellbaseId: name}, {hgnc: name}],
    },
    (err, existingGene) => {
      if (err) {
        res
          .status(err.status)
          .json(new ResponseMMP().responseError({message: err.msg}));
      }

      // If user is not unique, return error
      if (existingGene) {
        res.status(200).json(new ResponseMMP().response(existingGene));
      } else {
        res.status(200).json(
          new ResponseMMP().responseError({
            message: 'Not Exists gene:' + name,
          })
        );
      }
    }
  );
};
