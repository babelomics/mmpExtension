config = require('../config/main');
const Panel = require('../models/panelModel');
const Gene = require('../models/geneModel');
const ResponseMMP = require('../models/responseMMP');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const async = require('async');
const uuidv1 = require('uuid/v1');

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
  let panelCreates = [];
  let panelUpdates = [];
  let wb = XLSX.readFile(pathFile);
  let jsonXSLX = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  let count = 0;
  let myMap = new Map();

  async.eachSeries(
    jsonXSLX,
    function(row, callback) {
      count++;
      // if (count > 2300) {
      //   setImmediate(callback);
      // } else {
      createPanel(row, myMap, count, panelCreates, panelUpdates).then(
        (response) => {
          if (response.break) {
            response.status = 422;
            callback(response);
          } else {
            setImmediate(callback);
          }
        }
      );
      // }
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
          panelCreates: panelCreates,
          panelUpdates: panelUpdates,
        };
        res.status(200).json(new ResponseMMP().response(responseData));
      }
    }
  );
};

/**
 *
 * Create each category depends of its hierarchy
 * @param {*} myMap
 * @param {*} count
 * @param {*} panelCreates
 * @param {*} panelUpdates
 */
function createPanel(row, myMap, count, panelCreates, panelUpdates) {
  let categoria = row.Categoria;
  let subcategoria1 = row.Subcategoria1;
  let subcategoria2 = row.Subcategoria2;
  let subcategoria3 = row.Subcategoria3;
  if (categoria !== null) {
    return createPanelcategory(
      row,
      categoria,
      myMap,
      0,
      panelCreates,
      panelUpdates
    )
      .then((response) => {
        if (response.break) {
          return response;
        }
        return createPanelcategory(
          row,
          subcategoria1,
          myMap,
          1,
          panelCreates,
          panelUpdates
        );
      })
      .then((response) => {
        if (response.break) {
          return response;
        }
        return createPanelcategory(
          row,
          subcategoria2,
          myMap,
          2,
          panelCreates,
          panelUpdates
        );
      })
      .then((response) => {
        if (response.break) {
          return response;
        }
        return createPanelcategory(
          row,
          subcategoria3,
          myMap,
          3,
          panelCreates,
          panelUpdates
        );
      })
      .then((response) => {
        console.log('RESPONSE:' + response);
        return response;
      });
  }
}

/**
 * We create or update every panel with its corresponding genes
 * @param {*} row
 * @param {*} categoria
 * @param {*} myMap
 * @param {*} depth
 * @param {*} panelCreates
 * @param {*} panelUpdates
 */
function createPanelcategory(
  row,
  categoria,
  myMap,
  depth,
  panelCreates,
  panelUpdates
) {
  let gene = row.Gen;

  // console.log(
  //   count +
  //     'llegandoa  createPanelcategory: ' +
  //     JSON.stringify(row) +
  //     ':' +
  //     row.Gen
  // );

  let responsePromise = {
    break: false,
    msg: '',
    data: {},
  };
  if (
    typeof categoria !== 'undefined' &&
    categoria !== null &&
    categoria !== ''
  ) {
    // console.log('llego1');
    let idCategoria = myMap.get(categoria);
    // console.log(idCategoria);

    let uuid = uuidv1();
    if (typeof idCategoria === 'undefined' || idCategoria === null) {
      idCategoria = uuid;
      myMap.set(categoria, uuid);
    }
    // console.log('llego2');
    // console.log(myMap);

    let geneObject = null;
    // Find gene in bd in the same xls row
    return Gene.findOne({
      name: gene,
    })
      .exec()
      .then((existingGene) => {
        console.log('existing gene: ' + gene);
        // If !exist gene return error
        if (!existingGene) {
          console.log('Not found gene' + name);
          responsePromise.msg = 'Not found gene: ' + gene;
          responsePromise.break = true;
          return responsePromise;
        } else {
          // If exists gene we find for panel
          geneObject = existingGene;
          return Panel.findOne(
            {internalId: idCategoria},
            (err, existingPanel) => {}
          ).exec();
        }
      })
      .then((existingPanel) => {
        // If !exists panel we created a new one
        if (!existingPanel) {
          console.log('NOT existing panel: ' + idCategoria);

          let genes = [];
          genes.push(geneObject._id);
          const newPanel = new Panel({
            internalId: uuid,
            name: categoria,
            version: 1,
            genes: genes,
            depth: depth,
          });
          panelCreates.push(newPanel.name);
          return newPanel.save();
        } else {
          // If exists panel, we update latest version of it

          // We find if current gene exists in the panel already
          let existGeneInPanel = existingPanel.genes.find((gene) => {
            return gene._id === geneObject._id;
          });

          if (
            typeof existGeneInPanel === 'undefined' ||
            existGeneInPanel === null
          ) {
            existingPanel.genes.push(geneObject._id);
          }
          // existingPanel.version++;
          panelUpdates.push(existingPanel.name);
          return Panel.update({_id: existingPanel._id}, existingPanel);
        }
      })
      .then((savePanel) => {
        responsePromise.data = savePanel;
        return responsePromise;
      })
      .catch((error) => {
        responsePromise.msg = error;
        responsePromise.break = true;
        return responsePromise;
      });
  } else {
    return responsePromise;
  }
}
