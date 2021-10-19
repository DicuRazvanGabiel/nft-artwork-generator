const fs = require("fs");
const path = require('path');
var _ = require('lodash');
const { createCanvas, loadImage } = require("canvas");
const layers = require('./input/config');

const saveLayer = async (_canvas, filename = 'newImage') => {
    fs.writeFileSync(`./output/${filename}.png`, _canvas.toBuffer("image/png"));
}

const drawNFT = async () => {
    const race = _.sample(layers[0].elements)
    const head = _.sample(layers[1].elements)
    const accessories = _.sample(layers[2].elements)

    const raceImg = await loadImage(race.filepath);
    const headImg = await loadImage(head.filepath);
    const accessoriesImg = await loadImage(accessories.filepath);

    const canvas = createCanvas(4500, 4500);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(raceImg, 0, 0, 4500, 4500);
    ctx.drawImage(headImg, 0, 0, 4500, 4500);
    ctx.drawImage(accessoriesImg, 0, 0, 4500, 4500);
    saveLayer(canvas, `${race.name}_${head.name}_${accessories.name}`);
}

const readFilesSync = (dir) => {
    const files = [];
  
    fs.readdirSync(dir).forEach(filename => {
      const name = path.parse(filename).name;
      const filepath = path.resolve(dir, filename);
      const stat = fs.statSync(filepath);
      const isFile = stat.isFile();
      const weight = parseInt(name.split('_')[1]);

      if(isFile){
        for (let index = 0; index < weight; index++) {
            files.push({ filepath, name, weight });
        }
      }
    });
  
    return files;
}

const loadRecources = async () => {
    layers.forEach(layer => {
        files = readFilesSync(layer.location);
        layer.elements = files;
    })
}

loadRecources();

const draw = async () => {
    for (let index = 0; index < 10; index++) {
        console.log("Draw NFT: " + index)
        await drawNFT();
    }
    
}

draw();