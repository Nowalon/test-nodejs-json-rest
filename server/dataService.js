const JSONData = require('./utils/handleJsonData')

const GROUP_TYPES = ['MODERN', 'CLASSIC'];


exports.handleGetGroupedList = (query, cb)=> {
  const queryParams = {};
  for (const [key, value] of Object.entries(query)) {
    if (key && value) {
      queryParams[key] = value;
    }
  }

  const result = {
    error: null,
    data: null
  };

  getDataList(({error, data}) => {
    if (error) {
      result.error = error;
    } else {
      let resultData = [...data];
      const itemsReducer = (previousValue, currentValue) => previousValue + currentValue.items.length;
      const itemsLength = data.reduce(itemsReducer, 0);

      if (queryParams.type) {
        if (GROUP_TYPES.includes(queryParams?.type?.toUpperCase())) {
          resultData = resultData.filter(group => group.type.toLowerCase() === queryParams.type.toLowerCase());
        } else {
          result.error = `Error: wrong type value. Should be one of [${GROUP_TYPES.join(', ')}]`;
          resultData = [];
        }
      }

      if (queryParams.search) {
        resultData = resultData.filter(group => {
          const groupItemsFiltered = group.items.filter(item => {
            if (queryParams.include_search_notes && queryParams.include_search_notes == 1) {
              return item.name.toLowerCase().includes(queryParams.search.toLowerCase()) || item.notes.toLowerCase().includes(queryParams.search.toLowerCase());
            } else {
              return item.name.toLowerCase().includes(queryParams.search.toLowerCase());
            }
          });
          group.items = groupItemsFiltered;
          return groupItemsFiltered.length ? group : null;
        });
      }

      if (queryParams.sell) {
        resultData = resultData.filter(group => {
          const isSell = queryParams.sell == 1;
          const groupItemsFiltered = group.items.filter(item => item.isForSell === isSell);
          group.items = groupItemsFiltered;
          return groupItemsFiltered.length ? group : null;
        });
      }

      if (queryParams.archived) {
        resultData = resultData.filter(group => {
          const isArchived = queryParams.archived == 1;
          const groupItemsFiltered = group.items.filter(item => item.archived === isArchived);
          group.items = groupItemsFiltered;
          return groupItemsFiltered.length ? group : null;
        });
      }

      const resultItemsLength = resultData.reduce(itemsReducer, 0);
      resultData = resultData.map(group => {
        const groupItems = group.items.map(item => {
          const { notes, ...restItem } = item;
          return restItem;
        });
        group.items = groupItems;
        return group;
      });

      result.data = {
        totalGroupCount: data.length,
        totalItemCount: itemsLength,
        resultItemCount: resultItemsLength,
        list: resultData
      };
    }

    cb && cb (result);
  });
};


exports.handleGetGroups = (query, cb)=> {
  const queryParams = {};

  for (const [key, value] of Object.entries(query)) {
    if (key && value) {
      queryParams[key] = value;
    }
  }

  const result = {
    error: null,
    data: null
  };

  getDataList(({error, data}) => {
    if (error) {
      result.error = error;
    } else {
      let resultData = [...data];
      if (queryParams.type) {
        if (GROUP_TYPES.includes(queryParams?.type?.toUpperCase())) {
          resultData = resultData.filter(group => group.type.toLowerCase() === queryParams.type.toLowerCase());
        } else {
          result.error = `Error: wrong type value. Should be one of [${GROUP_TYPES.join(', ')}]`;
          resultData = [];
        }
      }
      resultData = resultData.map(group => {
        const { items, ...restObject } = group;
        return restObject;
      });

      result.data = {
        totalGroupCount: data.length,
        resultGroupCount: resultData.length,
        list: resultData
      };
    }

    cb && cb (result);
  });
};



exports.handleGetItem = (query, cb)=> {
  const queryParams = {};

  for (const [key, value] of Object.entries(query)) {
    if (key && value) {
      queryParams[key] = value;
    }
  }

  const result = {
    error: null,
    data: null,
    code: null
  };

  if (queryParams.id && !isNaN(+queryParams.id)) {
    getFlattenItemList((error, data) => {
      if (error) {
        result.error = error;
      } else {
        const resultItem = data.find(item => item.id === +queryParams.id);
        result.error = resultItem ? null : `Error: wrong id param: item with id ${queryParams.id} does not exist`;
        result.code = resultItem ? null : 404;
        result.data = {
          item: resultItem || null
        };
      }

      cb && cb (result);
    });
  } else {
    result.error = `id param is required and should be an integer`;
    result.data = null;
    cb && cb (result);
  }
};


exports.handleCreateGroup = (groupBody, cb)=> {
  const result = {
    error: null,
    data: null,
  };
  const errors = [];
  if (!(groupBody.title && groupBody.title.length > 2)) errors.push(`"title" value is required and should be at least 3 chars length`);
  if (!(groupBody.type && GROUP_TYPES.includes(groupBody.type.toUpperCase()) )) errors.push(`"type" value is required and should be one of [${GROUP_TYPES.join(', ')}] values`);

  if (errors.length) {
    result.error = `Error: ${errors.join('; ')}`;
    cb && cb (result);
  } else {
    getDataList(async ({error, data}) => {
      if (error) {
        result.error = error;
        cb && cb (result);
      } else {
        const newGroupId = await getNewGroupId();
        if (!newGroupId) {
          result.error = 'new group id error';
          cb && cb (result);
        } else {
          const group = {
            id: newGroupId,
            title: groupBody.title,
            type: GROUP_TYPES.find(type => type.toLowerCase() === groupBody.type.toLowerCase()),
            items: [],
            createdAt: new Date()
          };
          const newData = [...data, group];

          JSONData.writeData(JSON.stringify(newData), error => {
            if (error) {
              console.error(`Error writing data: ${error}`);
              result.error = error;
              cb && cb (result);
            } else {
              result.data = {group};
              cb && cb (result);
            }
          });
        }
      }
    });
  }
};


exports.handleCreateItem = (itemBody, cb)=> {
  const result = {
    error: null,
    data: null,
  };
  const errors = [];
  if (!(itemBody.groupId && !isNaN(itemBody.groupId))) errors.push(`"groupId" value is required and should be an integer and valid id of existing group`);
  if (!(itemBody.name && itemBody.name.length > 2)) errors.push(`"name" value is required and should be at least 3 chars length`);
  if (!(itemBody.price && !isNaN(itemBody.price) && itemBody.price > 99 && itemBody.price <= 100000)) errors.push(`"price" value is required and should be integer in range 100..100000 ($1..$1000)`);
  if (!(itemBody.hasOwnProperty('isForSell') && typeof itemBody.isForSell === 'boolean')) errors.push(`"isForSell" value is required and should be a boolean`);

  if (errors.length) {
    result.error = `Error: ${errors.join('; ')}`;
    cb && cb (result);
  } else {
    getDataList(async ({error, data}) => {
      if (error) {
        result.error = error;
        cb && cb (result);
      } else {
        const group = data.find(gr => gr.id === itemBody.groupId);
        if (!group) {
          result.error = `Error: group with id ${itemBody.groupId} does not exist`;
          cb && cb (result);
        }
        const newItemId = await getNewItemId();
        if (!newItemId) {
          result.error = 'new item id error';
          cb && cb (result);
        } else {
          const newItem = {
            id: newItemId,
            name: itemBody.name,
            notes: '',
            price: itemBody.price,
            isForSell: itemBody.isForSell,
            archived: false,
            createdAt: new Date()
          };
          group.items = [...group.items, newItem];

          JSONData.writeData(JSON.stringify(data), error => {
            if (error) {
              console.error(`Error writing data: ${error}`);
              result.error = error;
              cb && cb (result);
            } else {
              result.data = {item: newItem};
              cb && cb (result);
            }
          });
        }
      }
    });
  }
};


exports.handleUpdateItem = (itemBody, cb)=> {
  const result = {
    error: null,
    data: null,
  };
  const errors = [];
  if (!(itemBody.id && !isNaN(itemBody.id))) errors.push(`"id" value is required and should be an integer and valid id of existing item`);
  if (itemBody.hasOwnProperty('name') && itemBody.name.length < 3) errors.push(`"name" value should be at least 3 chars length`);
  if (itemBody.hasOwnProperty('price') && (isNaN(itemBody.price) || itemBody.price < 100 || itemBody.price > 100000)) errors.push(`"price" value should be integer in range 100..100000 ($1..$1000)`);
  if (itemBody.hasOwnProperty('notes') && itemBody.notes.length < 3) errors.push(`"notes" value should be at least 3 chars length`);
  if (itemBody.hasOwnProperty('isForSell') && typeof itemBody.isForSell !== 'boolean') errors.push(`"isForSell" value should be a boolean`);
  if (itemBody.hasOwnProperty('archived') && typeof itemBody.archived !== 'boolean') errors.push(`"archived" value should be a boolean`);

  if (errors.length) {
    result.error = `Error: ${errors.join('; ')}`;
    cb && cb (result);
  } else {
    const updateValues = {id: itemBody.id};
    if (itemBody.name?.trim().length) updateValues.name = itemBody.name;
    if (itemBody.price) updateValues.price = itemBody.price;
    if (itemBody.notes?.trim().length) updateValues.notes = itemBody.notes;
    if (itemBody.hasOwnProperty('isForSell')) updateValues.isForSell = itemBody.isForSell;
    if (itemBody.hasOwnProperty('archived')) updateValues.archived = itemBody.archived;

    getFlattenItemList((error, data) => {
      if (error) {
        result.error = error;
        cb && cb (result);
      } else {
        const checkItem = data.find(item => item.id === itemBody.id);
        if (checkItem) {
          getDataList(async ({error, data}) => {
            if (error) {
              result.error = error;
              cb && cb (result);
            } else {
              let updatedItem = null;
              const updData = data.map(gr => {
                const grItems = gr.items.map(grIt => {
                  if (grIt.id === checkItem.id) {
                    updatedItem = {...grIt, ...updateValues};
                    return updatedItem;
                  }
                  return grIt;
                });
                gr.items = grItems;
                return gr;
              });

              JSONData.writeData(JSON.stringify(updData), error => {
                if (error) {
                  console.error(`Error writing data: ${error}`);
                  result.error = error;
                  cb && cb (result);
                } else {
                  result.data = {item: updatedItem};
                  cb && cb (result);
                }
              });
            }
          });
        } else {
          result.error = `Error: wrong id param: item with id ${itemBody.id} does not exist`;
          result.code = 400;
          result.data = null;
          cb && cb (result);
        }
      }
    });
  }
};


exports.handleDeleteItem = (itemBody, cb)=> {
  const result = {
    error: null,
    data: null,
  };
  const errors = [];
  if (!(itemBody.id && !isNaN(itemBody.id))) errors.push(`"id" value is required and should be an integer and valid id of existing item`);
  if (errors.length) {
    result.error = `Error: ${errors.join('; ')}`;
    cb && cb (result);
  } else {
    getFlattenItemList((error, data) => {
      if (error) {
        result.error = error;
        cb && cb (result);
      } else {
        const deleteItem = data.find(item => item.id === itemBody.id);
        if (deleteItem) {
          getDataList(async ({error, data}) => {
            if (error) {
              result.error = error;
              cb && cb (result);
            } else {
              const updData = data.map(gr => {
                const grItems = gr.items.filter(grIt => grIt.id !== deleteItem.id);
                gr.items = grItems;
                return gr;
              });

              JSONData.writeData(JSON.stringify(updData), error => {
                if (error) {
                  console.error(`Error writing data: ${error}`);
                  result.error = error;
                  cb && cb (result);
                } else {
                  result.data = {delete: 'ok', id: deleteItem.id};
                  cb && cb (result);
                }
              });

            }
          });
        } else {
          result.error = `Error: wrong id param: item with id ${itemBody.id} does not exist`;
          result.code = 400;
          result.data = null;
          cb && cb (result);
        }
      }
    });
  }
};





function getDataList(cb) {
  const getRes = {error: null, data: null};
  JSONData.readData((error, jsonData) => {
    if (error) {
      console.error(`Error getting list: ${error}`);
      getRes.error = error;
    } else {
      try {
        getRes.data = JSON.parse(jsonData);
      } catch(e){
        getRes.error = e;
        console.log(`handleGetList json parsing error: ${e}`);
      }
    }
    cb && cb (getRes);
  });
}


function getFlattenItemList(cb) {
  getDataList(({error, data}) => {
    if (error) {
      cb && cb(error, null);
    } else {
      const flatArray = data.reduce((acc, curVal) => {
        return acc.concat(curVal.items)
      }, []);

      cb && cb(null, flatArray);
    }
  });
}


function getNewGroupId() {
  return new Promise ((resolve, reject) => {
    getDataList(({error, data}) => {
      if (error) reject(error);
      const sortedGroupList = (data || []).sort((a, b) =>  b.id - a.id);
      resolve(sortedGroupList[0]?.id + 1 || 100);
    });
  });
}


function getNewItemId(cb) {
  return new Promise ((resolve, reject) => {
    getFlattenItemList((err, flattenList) => {
      if (err) reject(err);
      const sortedItemList = (flattenList || []).sort((a, b) =>  b.id - a.id);
      resolve(sortedItemList[0]?.id + 1 || 1000);
    });
  });
}

