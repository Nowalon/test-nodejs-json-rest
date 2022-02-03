
# API description #


#### Methods: `GET, POST, PATCH, DELETE`

----

#### GET:
#### get grouped items list:     `/list`  
Method: `GET`

params:

    search      [optional] - search by item name string value. default - an empty, skipped
    type        [optional] - one of group category type [CLASSIC, MODERN] - filtering option. default - an empty, skipped
    sale        [optional] - filtering option (values: 1 or 0) to get items by 'isForSell' property value. default - an empty, skipped
    archived    [optional] - filtering option (values: 1 or 0) to get items by 'archived' property value. default - an empty, skipped
    include_search_notes [optional] - optional flag (values: 1 or 0) for including notes check for search query - an empty, equal to 0

request URL preview examples:

    http://localhost:3089/list
    http://localhost:3089/list?search=pers
    http://localhost:3089/list?search=pers&type=modern
    http://localhost:3089/list?type=modern&sell=1
    http://localhost:3089/list?search=pers&type=modern&sell=0
    http://localhost:3089/list?type=modern&sell=1&archived=0


response result example:


    {
        "status": "ok",
        "error": null,
        "data": {
            "totalGroupCount": 17,
            "totalItemCount": 83,
            "list": [
                {
                    "id": 1,
                    "title": "est fugiendum Group 1",
                    "type": "CLASSIC",
                    "items": [
                        {
                            "id": 2,
                            "name": "est eas perspicua",
                            "price": 92462,
                            "isForSell": true,
                            "archived": false,
                            "createdAt": "2021-08-25T14:32:48.282Z"
                        }
                    ],
                    "createdAt": "2021-07-23T17:29:48.282Z"
                },
                {
                    "id": 3,
                    "title": "malum ad Group 3",
                    "type": "MODERN",
                    "items": [
                        {
                            "id": 13,
                            "name": "talibus desiderare perspicuis quid",
                            "price": 11554,
                            "isForSell": false,
                            "archived": false,
                            "createdAt": "2021-09-29T18:55:48.282Z"
                        }
                    ],
                    "createdAt": "2021-01-29T10:16:48.282Z"
                },
                {
                    "id": 13,
                    "title": "quae quaedam Group 13",
                    "type": "CLASSIC",
                    "items": [
                        {
                            "id": 64,
                            "name": "perspicua",
                            "price": 89759,
                            "isForSell": true,
                            "archived": false,
                            "createdAt": "2021-03-23T16:54:48.282Z"
                        }
                    ],
                    "createdAt": "2021-08-25T14:26:48.282Z"
                }
            ]
        }
    }


---

#### GET:
#### get groups only:        `/groups`  
Method: `GET`

params:

    type    [optional] - one of group category type [CLASSIC, MODERN] - filtering option. default - an empty, skipped


request URL preview examples:

    http://localhost:3089/groups
    http://localhost:3089/groups?type=classic



response result example:
    
    {
        "status": "ok",
        "error": null,
        "data": {
            "totalGroupCount": 17,
            "list": [
                {
                    "id": 1,
                    "title": "est fugiendum Group 1",
                    "type": "CLASSIC",
                    "createdAt": "2021-07-23T17:29:48.282Z"
                },
                {
                    "id": 6,
                    "title": "faciamus-quid pulchritudinem Group 6",
                    "type": "CLASSIC",
                    "createdAt": "2021-09-23T16:15:48.282Z"
                },
                {
                    "id": 8,
                    "title": "Aeschines habitum Group 8",
                    "type": "CLASSIC",
                    "createdAt": "2021-04-22T13:24:48.282Z"
                },
                {
                    "id": 9,
                    "title": "disserendique magis Group 9",
                    "type": "CLASSIC",
                    "createdAt": "2021-08-27T16:39:48.282Z"
                }
            ]
        }
    }

---
#### GET:
#### get item:       `/item`  
Method: `GET`

params:

    id  [required] - item's id to fetch


response result example [Bad Request: id is not passed]:

    {
        "status": "error",
        "error": "id param is required and should be an integer",
        "data": null
    }


response result example [success]:

    {
        "status": "ok",
        "error": null,
        "data": {
            "item": {
                "id": 36,
                "name": "praecipiunt secundum percipiendis ad",
                "price": 85652,
                "notes": "quin id tu essent nihil adipiscing ordinem censetis",
                "isForSell": false,
                "archived": false,
                "createdAt": "2021-05-27T18:18:48.282Z"
            }
        }
    }

---
#### POST:
#### create item:        `/item`  
Method: `POST`

params:

should be a value JSON data with object like following:

    {
        "groupId": 6,
        "name": "test 61 gggggg",
        "price": 9999,
        "isForSell": false,
    }

where   `groupId` value is required and should be an integer and valid id of existing group;  
                `name` value is required and should be at least 3 chars length;  
                `price` value is required and should be integer in range 100..100000 ($1..$1000);  
                `isForSell` value is required and should be a boolean;  

response result example:

    {
        "status": "ok",
        "error": null,
        "data": {
            "item": {
                "id": 21,
                "name": "test 61 gggggg",
                "notes": "",
                "price": 9999,
                "isForSell": false,
                "archived": false,
                "createdAt": "2022-01-30T23:12:31.295Z"
            }
        }
    }

----
#### POST:
#### create group:       `/group`  
Method: `POST`

params:

should be a value JSON data with object like following:

    {
        "title": "Group name Test 22",
        "type": "classic",
        "test": "Twatt",
        "value": "Qwerty-Asdf"
    }
where   `title` value is required and should be at least 3 chars length;  
`type` value is required and should be one of `[CLASSIC, MODERN]` values;
        

response result example:

    {
        "status": "ok",
        "error": null,
        "data": {
            "group": {
                "id": 6,
                "title": "Group name Test 22",
                "type": "CLASSIC",
                "items": [],
                "createdAt": "2022-01-30T19:33:22.866Z"
            }
        }
    }

---
#### UPDATE (PATCH):
#### update item:    `/item`  
Method: `PATCH`

params:

    {
        "id": 2,
        "name": "test-UPDATE__dtykrtrt-KkkkKK-KK",
        "notes": "zxcc - handleUpdateItem. notes. updateValues updData PATCH",
        "price": 789,
        "isForSell": true,
        "archived": true,
    }
where   `id` value is required and should be an integer and valid id of existing item;  
        `name` value is _optional_ and should be at least 3 chars length;  
        `notes` value is _optional_ and should be at least 3 chars length;  
        `price` value is _optional_ and should be integer in range 100..100000 ($1..$1000);  
        `isForSell` value is _optional_ and should be a boolean;  
        `archived` value is _optional_ and should be a boolean;  

response result example:

    {
        "status": "ok",
        "error": null,
        "data": {
            "item": {
                "id": 2,
                "name": "test-UPDATE__dtykrtrt-KkkkKK-KK",
                "price": 789,
                "notes": "zxcc - handleUpdateItem. notes. updateValues updData PATCH",
                "isForSell": true,
                "archived": true,
                "createdAt": "2021-08-25T14:32:48.282Z"
            }
        }
    }



----
#### DELETE:
#### delete item:    `/item`  
Method: `DELETE`

params:

    {
        "id": 21,
    }


where  `id` value is required and should be an integer and valid id of existing item;

response result example:

    {
        "status": "ok",
        "error": null,
        "data": {
            "delete": "ok",
            "id": 21
        }
    }


----

Note: If you see "Invalid Request" response - that's it - request is invalid - the url pathname is wrong (or it has wrong method and/or query).


----


Authentication - I'll provide it later (first try using this as is)




-------------------

~~API link test Example 1: GET //127.0.0.1:8888/items?size=10&offset=2&sort=DESC&&filter=somevalue~~  
~~Example 2: POST //127.0.0.1:8888/item~~



----



P.S. you can use "Insomnia", "Postman" tools for API testing.

and you can check and manage JSON data with http://jsoneditoronline.org/ tool.


----

----
