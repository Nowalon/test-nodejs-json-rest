# test-nodejs-json-rest




##### run server:

`cd ./test-nodejs-json-rest`

`npm install` (install required packages)

`npm run start` (runs command `start` of `script` section in package.json )



once server successfully started you can see message:

    Server running at http://0.0.0.0:3089/ ( http://127.0.0.1:3089/ , http://localhost:3089/ ) 
    API description: http://127.0.0.1:3089/api  ( or http://0.0.0.0:3089/api or http://localhost:3089/api ) 


~~## ?????? // TODO: REMOVE "FOREVER" USING (or check/fix collisions for data.json updating, tune .foreverignore)~~

>(note: you can ignore any preceding ***forever*** package warnings if there are no any following errors and the server remains running. 
keep in mind: ***forever*** restarts the server and tries to keep it alive in fail cases)




##

##### (re)populate data.json:

`npm run write_data` runs independent script (the server is either running or halt) to populate JSON data file (data.json) with randomly generated data array. resets any previous made changes with new randomly generated data.  
***there's no default data***, every time it generates new data with random items count and random names (lorem-ipsum based) just with some preset deviations for counts.

after data.json gets successfully populated you can see appropriate message: 

    JSON data has been written successfully! 



##

##






