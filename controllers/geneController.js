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
      let name = row.Gen;
      let err = new Error();
      err.break = true;
      console.log(count + ': ' + JSON.stringify(row) + ': ' + name);

      // if (count > 5000) {
      //   notSaves.push(count + ': ' + name);
      //   setImmediate(callback);
      // } else {
      if (!name) {
        // Break out of async
        err.status = 422;
        err.msg = 'Gene name is required.';
        return callback(err);
      }

      Gene.findOne(
        {
          name,
        },
        (err, existingGene) => {
          if (err) {
            console.log('Error already exists:' + name);
            setImmediate(callback);
          }

          // If user is not unique, return error
          if (existingGene) {
            console.log('already exists:' + name);
            notSaves.push(count + ': ' + name);
            setImmediate(callback);
          } else {
            // If email is unique and password was provided, create account
            const gene = new Gene({
              name,
            });
            console.log('pushing');

            gene.save(function(err, geneResponse) {
              if (!err) {
                geneSaves.push(count + ': ' + geneResponse.name);
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
