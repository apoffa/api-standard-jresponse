# API Standard JResponse
This library aim to standardize the JSON responses of your REST API application. 
Make your font-end developer life easier. 

This project is derived from 'jresponse-node' ( https://www.npmjs.com/package/jresponse-node ) but is written in typescript and compiled 
## Installation
```
npm i api-standard-jresponse
```
## Standard Response
```json
{
    "success": true,
    "count": 0,
    "data": [],
    "errors": []
}
```
- `"success"` can be **true** or **false**
- `"count"` length of the data array
- `"data"` array of data
- `"errors"` array of errors

***Notice:*** "data" and "error" fields are always array. This makes the communication easier. 

## Usage
### Basic usage (static function)
methods:
- `JResponse.success(response_obj, data, [,status]);` If not specified, default status is ***200***. Data can be number/string/object or even an array of values. 
- `JResponse.errors(response_obj, errors, [,status]);` If not specified, default status is ***400***. Errors ca be number/string/object or even an array of values.
```javascript
import { JResponse } from "api-standard-jresponse";

app.get("/introduce/yourself", (req, res) => {
    try {
        // Do your staff
        
        return JResponse.success(res, "Hello, my name is John Doe.");
    } catch (e) {
        return JResponse.errors(res, e.message);  
    }
});

```
### Dynamic usage
This allow you to dynamically append data or error during the execution of the code.

First of all, add the response middleware (before declaring any routes).
```javascript
import { setJResponse } from "api-standard-jresponse";

app.use(setJResponse);
```
This middleware attach to the response object an instance of the class.
Now, just use the custom property ***res.JRes ...*** instead of ***res.json***

success methods:
- `res.JRes.appendData(data, [,status]);` ***This method does not print anything.*** It append data to the payload. [data] will be sent by the following method.
- `res.JRes.sendSuccess([,data], [,status]);` ***This method print data.*** [data] Can be number/string/object or even an array of values. Prints the entire payload of previously added data, merged with the one passed to this function (if passed). 

error methods:
- `res.JRes.appendError(error, [,status]);` ***This method does not print any error.*** It append the error to the payload. [error] can be number/string/object or even an array of values.
- `res.JRes.sendErrors([,error], [,status]);` ***This method print errors.*** [error] Can be number/string/object or even an array of values. Prints the entire payload of error previously added merged with the one passed to this function (if passed).


example:
```javascript
 app.get("/people/list", (req, res) => {
     try {
         // append object
         res.JRes.appendData( 
                     { 
                        "first_name": "John",      
                        "last_name": "Doe"      
                     } 
                 );
         
         // append string
         res.JRes.appendData("Floyd Earls");
        
         // if you append an array, it will be concat with the existing data (see response)
         res.JRes.appendData(
                [
                    "Taylor Tejada", 
                    "Thomas Patterson"
                ]
             );
         
         return res.JRes.sendSuccess();
         // or return res.JRes.sendSuccess(whatever_you_want);
     } catch (e) {
         res.JRes.appendError(getMessage(e));
         res.JRes.appendError(getJsonTrace(e));
         return res.JRes.sendErrors();   
         // or just res.JRes.sendErrors(e.message);
     }
 });    
 
function getMessage(e) {
    return e.message;
}
function getJsonTrace(e) {
    // build trace
    return trace_obj;
}
```

edit response object shape:
- `res.JRes.merge(data);` ***This method does not print anything.*** It merge the default response to the object [data] (or array of object) that you pass.
- `res.JRes.set(key, value);` ***This method does not print anything.*** It add a key/value pair to the default object.

example:

```javascript

app.get("/get/rows", (req, res) => {
    try {
        // Do your staff
        let data = [
            {
                first_name: "john",
                last_name: "Doe"
            }
        ]
        let counters = {
            page: 2,
            step: 100
        }
        res.JRes.merge(counters);
        res.JRes.set("addon", "addon_value");
        return res.JRes.sendSuccess(data);
    } catch (e) {
        return res.JRes.sendErrors(e.message);  
    }
});

```
result:
```json
{
    "success": true,
    "count": 4,
    "data": [
      {
        "first_name": "John",      
        "last_name": "Doe"      
      }
    ],
    "errors": [],
    "page": 2,
    "step": 100,
    "addon": "addon_value"
}
```



## Standard Success Response
```json
{
    "success": true,
    "count": 4,
    "data": [
      {
        "first_name": "John",      
        "last_name": "Doe"      
      },
      "floyd Earls",
      "Taylor Tejada",
      "Thomas Patterson"
    ],
    "errors": []
}
```
or
```json
{
    "success": true,
    "count": 1,
    "data": [
      "Congratulation, everything is ok!"
    ],
    "errors": []
}
```
or even
```json
{
    "success": true,
    "count": 0,
    "data": [],
    "errors": []
}
```
## Standard Error Response
```json
{
    "success": false,
    "count": 0,
    "data": [],
    "errors": [
      {
        "message": "Validation error.",
      },
      {
        "trace": [
          "first_name is required.",
          "last_name is required."
        ]
      }
    ]
}
```
or
```json
{
    "success": false,
    "count": 0,
    "data": [],
    "errors": [
      "Something went wrong."
    ]
}
```
or even
```json
{
    "success": false,
    "count": 0,
    "data": [],
    "errors": []
}
```
