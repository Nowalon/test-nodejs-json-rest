const utils = require('./utils')
const JSONData = require('./utils/handleJsonData')


const groupObjSample = {
  id: 0,
  title: '',
  type: '', // [MODERN, CLASSIC]
  items: [],
  createdAt: null,
};

const itemObjSample = {
  id: 0,
  name: '',
  price: 0,
  // sellPrice: 0,
  notes: '',
  isForSell: false, // [true, false]
  archived: false,
  createdAt: null,
};



const init = () => {
  const resultData = [];
  const groupArr = Array.from({length: utils.getRandomIntMinMax(14, 24)}, (v, i) => i+1);
  let itemIndex = 1;

  groupArr.forEach((gr, gi) => {
    const newGroup = {...groupObjSample};
    newGroup.id = gr; // gi + 1
    newGroup.title = `${utils.getRandomLoremIpsumWord()} ${utils.getRandomLoremIpsumWord()} Group ${gr}`; // gi + 1
    newGroup.type = utils.getRandomIntMinMax(1, 2) > 1 ? 'MODERN' : 'CLASSIC' // [MODERN, CLASSIC]
    newGroup.createdAt = new Date(`2021-0${utils.getRandomIntMinMax(1, 9)}-2${utils.getRandomIntMinMax(0, 9)}T1${utils.getRandomIntMinMax(0, 9)}:${utils.getRandomIntMinMax(10, 59)}:48.282Z`);

    const itemArr = Array.from({length: utils.getRandomIntMinMax(3, 8)}, (v, i) => i + itemIndex);
    newGroup.items = itemArr.map((it, ii) => {
      const newItemObj = {
        ...itemObjSample,
        id: it, // ii + 1
        name: getLRWordsByMinMax(1, 4),
        price: utils.getRandomIntMinMax(100, 99999), // $1 - $999.99
        notes: getLRWordsByMinMax(3, 8),
        isForSell: utils.getRandomIntMinMax(1, 2) > 1,
        archived: utils.getRandomIntMinMax(1, 2) > 1,
        createdAt: new Date(`2021-0${utils.getRandomIntMinMax(1, 9)}-2${utils.getRandomIntMinMax(0, 9)}T1${utils.getRandomIntMinMax(0, 9)}:${utils.getRandomIntMinMax(10, 59)}:48.282Z`),
      };
      return newItemObj;
    });

    resultData.push(newGroup);
    itemIndex = itemIndex + newGroup.items.length;

  });

  JSONData.writeData(JSON.stringify(resultData), () => {
    console.log(`\x1b[32mJSON data has been written successfully! \x1b[0m`); // prettier-ignore

  });
};


function getLRWordsByMinMax(min, max) {
  const wordsArr = Array.from({length: utils.getRandomIntMinMax(min, max)}, (v, i) => i+1)
  return wordsArr.map(w => utils.getRandomLoremIpsumWord()).join(' ');
}


init();



