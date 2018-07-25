 list = [];
api = {url: "", version: "", paths: []};
var apis = [];
var verbs = ["GET", "POST", "DELETE", "PUT"];

function myfunc() {
    var json = JSON.parse('{\n' +
        '  "swagger" : "2.0",\n' +
        '  "info" : {\n' +
        '    "description" : "The API documentation of L10 Bos Adaptor service",\n' +
        '    "version" : "1.0.0",\n' +
        '    "title" : "L10 Bos Adaptor",\n' +
        '    "contact" : {\n' +
        '      "name" : "users@cxf.apache.org"\n' +
        '    }\n' +
        '  },\n' +
        '  "basePath" : "/api/v1.0",\n' +
        '  "tags" : [ {\n' +
        '    "name" : "Unclaimed jackpot prizes"\n' +
        '  }, {\n' +
        '    "name" : "Settlements"\n' +
        '  }, {\n' +
        '    "name" : "Company Service"\n' +
        '  }, {\n' +
        '    "name" : "Person Service"\n' +
        '  }, {\n' +
        '    "name" : "Pos Service"\n' +
        '  }, {\n' +
        '    "name" : "Terminal Service"\n' +
        '  } ],\n' +
        '  "paths" : {\n' +
        '    "/unclaimed-prizes/jackpot" : {\n' +
        '      "get" : {\n' +
        '        "tags" : [ "Unclaimed jackpot prizes" ],\n' +
        '        "summary" : "Retrieve unclaimed jackpot prizes",\n' +
        '        "description" : "\\n Possible error codes:\\n\\n| *HTTP*| *Code*|                *Description*                             |\\n|-------|-------|----------------------------------------------------------|\\n|500|\\t 10050  |\\tSQL Error                 |\\n| 500|\\t 25  |\\tSystem Error                 |\\n| 500|\\t 36  |\\tRest Client Connection Timeout Error                 |\\n|500|\\t 37  |\\tRest Client Unable to Connect                 |\\n|",\n' +
        '        "operationId" : "getUnclaimedJackpotPrizes",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "Guid",\n' +
        '          "in" : "header",\n' +
        '          "description" : "Unique request GUID identifier",\n' +
        '          "required" : false,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "type" : "array",\n' +
        '              "items" : {\n' +
        '                "$ref" : "#/definitions/UnclaimedJackpotPrizes"\n' +
        '              }\n' +
        '            }\n' +
        '          },\n' +
        '          "400" : {\n' +
        '            "description" : "VALIDATION ERROR",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/FaultInfo"\n' +
        '            }\n' +
        '          },\n' +
        '          "401" : {\n' +
        '            "description" : "AUTHENTICATION ERROR",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/FaultInfo"\n' +
        '            }\n' +
        '          },\n' +
        '          "500" : {\n' +
        '            "description" : "APPLICATION ERROR",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/FaultInfo"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/settlements" : {\n' +
        '      "get" : {\n' +
        '        "tags" : [ "Settlements" ],\n' +
        '        "summary" : "Used for retrieving winning information of wagers",\n' +
        '        "description" : "\\n Possible error codes:\\n\\n| *HTTP*| *Code*|                *Description*                             |\\n|-------|-------|----------------------------------------------------------|\\n|500|\\t 10050  |\\tSQL Error                 |\\n| 500|\\t 25  |\\tSystem Error                 |\\n| 500|\\t 36  |\\tRest Client Connection Timeout Error                 |\\n|500|\\t 37  |\\tRest Client Unable to Connect                 |\\n|",\n' +
        '        "operationId" : "getSettlements",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "Guid",\n' +
        '          "in" : "header",\n' +
        '          "description" : "Unique request GUID identifier",\n' +
        '          "required" : false,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "gameId",\n' +
        '          "in" : "query",\n' +
        '          "description" : "Game Id",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "drawId",\n' +
        '          "in" : "query",\n' +
        '          "description" : "Draw Id",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "page",\n' +
        '          "in" : "query",\n' +
        '          "description" : "The requested page of results. 0 is the first page",\n' +
        '          "required" : true,\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int32"\n' +
        '        }, {\n' +
        '          "name" : "limit",\n' +
        '          "in" : "query",\n' +
        '          "description" : "Size of results in a single response",\n' +
        '          "required" : true,\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int32"\n' +
        '        }, {\n' +
        '          "name" : "version",\n' +
        '          "in" : "query",\n' +
        '          "description" : "Validation version",\n' +
        '          "required" : true,\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int32"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "OK",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/WinningsModel"\n' +
        '            }\n' +
        '          },\n' +
        '          "304" : {\n' +
        '            "description" : "Not Modified"\n' +
        '          },\n' +
        '          "400" : {\n' +
        '            "description" : "Validation Error",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/FaultInfo"\n' +
        '            }\n' +
        '          },\n' +
        '          "401" : {\n' +
        '            "description" : "Unauthorized",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/FaultInfo"\n' +
        '            }\n' +
        '          },\n' +
        '          "500" : {\n' +
        '            "description" : "Application Error",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/FaultInfo"\n' +
        '            }\n' +
        '          },\n' +
        '          "502" : {\n' +
        '            "description" : "Bad Gateway"\n' +
        '          },\n' +
        '          "503" : {\n' +
        '            "description" : "Service Unavailable"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/company/{companyTaxId}" : {\n' +
        '      "get" : {\n' +
        '        "tags" : [ "Company Service" ],\n' +
        '        "summary" : "Get company",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "getCompany",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "companyTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Company"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      },\n' +
        '      "put" : {\n' +
        '        "tags" : [ "Company Service" ],\n' +
        '        "summary" : "Update existing company",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "updateCompany",\n' +
        '        "consumes" : [ "application/json" ],\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "companyTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "in" : "body",\n' +
        '          "name" : "body",\n' +
        '          "required" : false,\n' +
        '          "schema" : {\n' +
        '            "$ref" : "#/definitions/CompanyRequest"\n' +
        '          }\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Company"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      },\n' +
        '      "delete" : {\n' +
        '        "tags" : [ "Company Service" ],\n' +
        '        "summary" : "Delete company",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "removeCompany",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "companyTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/company" : {\n' +
        '      "post" : {\n' +
        '        "tags" : [ "Company Service" ],\n' +
        '        "summary" : "Register a new company",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "saveCompany",\n' +
        '        "consumes" : [ "application/json" ],\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "in" : "body",\n' +
        '          "name" : "body",\n' +
        '          "required" : false,\n' +
        '          "schema" : {\n' +
        '            "$ref" : "#/definitions/CompanyRequest"\n' +
        '          }\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Company"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/person" : {\n' +
        '      "post" : {\n' +
        '        "tags" : [ "Person Service" ],\n' +
        '        "summary" : "Register a new Person",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "savePerson",\n' +
        '        "consumes" : [ "application/json" ],\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "in" : "body",\n' +
        '          "name" : "body",\n' +
        '          "required" : false,\n' +
        '          "schema" : {\n' +
        '            "$ref" : "#/definitions/PersonRequest"\n' +
        '          }\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Person"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/person/{personTaxId}" : {\n' +
        '      "get" : {\n' +
        '        "tags" : [ "Person Service" ],\n' +
        '        "summary" : "Get a Person",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "getPerson",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "personTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Person"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      },\n' +
        '      "put" : {\n' +
        '        "tags" : [ "Person Service" ],\n' +
        '        "summary" : "Update a person",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "updatePerson",\n' +
        '        "consumes" : [ "application/json" ],\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "personTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "in" : "body",\n' +
        '          "name" : "body",\n' +
        '          "required" : false,\n' +
        '          "schema" : {\n' +
        '            "$ref" : "#/definitions/PersonRequest"\n' +
        '          }\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Person"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      },\n' +
        '      "delete" : {\n' +
        '        "tags" : [ "Person Service" ],\n' +
        '        "summary" : "Delete a person",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "removePerson",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "personTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos/{posAgencyCode}/{companyTaxId}" : {\n' +
        '      "get" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Get a company associated with specific Pos",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "get",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "companyTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Company"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos/{posAgencyCode}/removecompany/{companyTaxId}" : {\n' +
        '      "put" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Deassociate Pos to company",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "removeCompanyToPos",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "companyTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos/{posAgencyCode}/removeperson/{personTaxId}}" : {\n' +
        '      "put" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Unassign person to Pos",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "removePersonToPos",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "personTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos/{posAgencyCode}/removeterminal/{terminalLogicalId}" : {\n' +
        '      "put" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Deassociate Pos to terminal",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "removeTerminalToPos",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "terminalLogicalId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos/{posAgencyCode}/{personTaxId}" : {\n' +
        '      "get" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Get a person associated with a specific Pos",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "getPerstonFromPos",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "personTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Person"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos/pos/{posAgencyCode}/addterminal/{terminalLogicalId}" : {\n' +
        '      "put" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Associate Pos to terminal",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "addTerminalToPos",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "terminalLogicalId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos/{posAgencyCode}" : {\n' +
        '      "get" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Get a Pos",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "getPos",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Pos"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      },\n' +
        '      "put" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Update a Pos",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "updatePos",\n' +
        '        "consumes" : [ "application/json" ],\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "in" : "body",\n' +
        '          "name" : "body",\n' +
        '          "required" : false,\n' +
        '          "schema" : {\n' +
        '            "$ref" : "#/definitions/PosRequest"\n' +
        '          }\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Pos"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      },\n' +
        '      "delete" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Delete a Pos",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "removePos",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos" : {\n' +
        '      "post" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Register a new Pos",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "savePos",\n' +
        '        "consumes" : [ "application/json" ],\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "in" : "body",\n' +
        '          "name" : "body",\n' +
        '          "required" : false,\n' +
        '          "schema" : {\n' +
        '            "$ref" : "#/definitions/PosRequest"\n' +
        '          }\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS",\n' +
        '            "schema" : {\n' +
        '              "$ref" : "#/definitions/Pos"\n' +
        '            }\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos/{posAgencyCode}/addcompany/{companyTaxId}" : {\n' +
        '      "put" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Associate Pos to company",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "addCompanyToPos",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "companyTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/pos/pos/{posAgencyCode}/addperson/{personTaxId}" : {\n' +
        '      "put" : {\n' +
        '        "tags" : [ "Pos Service" ],\n' +
        '        "summary" : "Assign Person to Pos",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "addPersonToPos",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "posAgencyCode",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "name" : "personTaxId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        }, {\n' +
        '          "in" : "body",\n' +
        '          "name" : "body",\n' +
        '          "required" : false,\n' +
        '          "schema" : {\n' +
        '            "$ref" : "#/definitions/addPersonToPosRequest"\n' +
        '          }\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "/terminal/{terminalLogicalId}" : {\n' +
        '      "delete" : {\n' +
        '        "tags" : [ "Terminal Service" ],\n' +
        '        "summary" : "Delete a Terminal",\n' +
        '        "description" : "",\n' +
        '        "operationId" : "deleteTerminal",\n' +
        '        "produces" : [ "application/json" ],\n' +
        '        "parameters" : [ {\n' +
        '          "name" : "terminalLogicalId",\n' +
        '          "in" : "path",\n' +
        '          "required" : true,\n' +
        '          "type" : "string"\n' +
        '        } ],\n' +
        '        "responses" : {\n' +
        '          "200" : {\n' +
        '            "description" : "SUCCESS"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '  },\n' +
        '  "definitions" : {\n' +
        '    "UnclaimedJackpotPrizes" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "gameId" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int64",\n' +
        '          "description" : "Game id"\n' +
        '        },\n' +
        '        "drawDate" : {\n' +
        '          "type" : "string",\n' +
        '          "description" : "Draw date in ISO 8601 format"\n' +
        '        },\n' +
        '        "sellingRetailer" : {\n' +
        '          "type" : "string",\n' +
        '          "description" : "Selling retailer address"\n' +
        '        },\n' +
        '        "amount" : {\n' +
        '          "type" : "number",\n' +
        '          "description" : "Prize amount"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "FaultInfo" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "code" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int32",\n' +
        '          "description" : "The error code"\n' +
        '        },\n' +
        '        "message" : {\n' +
        '          "type" : "string",\n' +
        '          "description" : "The error message"\n' +
        '        },\n' +
        '        "data" : {\n' +
        '          "type" : "array",\n' +
        '          "description" : "The error data which is an abstract object that may be used to provide any error metadata",\n' +
        '          "items" : {\n' +
        '            "type" : "object"\n' +
        '          }\n' +
        '        },\n' +
        '        "source" : {\n' +
        '          "type" : "string",\n' +
        '          "description" : "The application at which the API error occured"\n' +
        '        },\n' +
        '        "type" : {\n' +
        '          "type" : "string",\n' +
        '          "description" : "The error family, e.g. RUNTIME, VALIDATION, etc"\n' +
        '        },\n' +
        '        "guid" : {\n' +
        '          "type" : "string",\n' +
        '          "description" : "The unique identifier of the error process"\n' +
        '        }\n' +
        '      },\n' +
        '      "description" : "The FaultInfo object contains all the details assosiated with an API error"\n' +
        '    },\n' +
        '    "WagerWinningsModel" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "amounts" : {\n' +
        '          "description" : "Amounts",\n' +
        '          "$ref" : "#/definitions/WinningsAmountsModel"\n' +
        '        },\n' +
        '        "drawId" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int64",\n' +
        '          "description" : "Draw id"\n' +
        '        },\n' +
        '        "gameId" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int64",\n' +
        '          "description" : "Game id"\n' +
        '        },\n' +
        '        "playerId" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int64",\n' +
        '          "description" : "Player id"\n' +
        '        },\n' +
        '        "serialNumber" : {\n' +
        '          "type" : "string",\n' +
        '          "description" : "Serial number"\n' +
        '        },\n' +
        '        "status" : {\n' +
        '          "type" : "string",\n' +
        '          "description" : "Win,NoWin",\n' +
        '          "enum" : [ "Win", "NoWin" ]\n' +
        '        },\n' +
        '        "subTier" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int64",\n' +
        '          "description" : "The winning sub category, needed for some games"\n' +
        '        },\n' +
        '        "tier" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int64",\n' +
        '          "description" : "The winning category"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "WinningsAmountsModel" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "gross" : {\n' +
        '          "type" : "number",\n' +
        '          "description" : "Gross amount in money units"\n' +
        '        },\n' +
        '        "net" : {\n' +
        '          "type" : "number",\n' +
        '          "description" : "Net amount in money units"\n' +
        '        },\n' +
        '        "other" : {\n' +
        '          "type" : "number",\n' +
        '          "description" : "Future use"\n' +
        '        },\n' +
        '        "refund" : {\n' +
        '          "type" : "number",\n' +
        '          "description" : "Refund amount in money units. Future use"\n' +
        '        },\n' +
        '        "tax" : {\n' +
        '          "type" : "number",\n' +
        '          "description" : "Taxation amount in money units"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "WinningsModel" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "total" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int64",\n' +
        '          "description" : "Total wagers"\n' +
        '        },\n' +
        '        "totalPages" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int64",\n' +
        '          "description" : "Total pages"\n' +
        '        },\n' +
        '        "wagers" : {\n' +
        '          "type" : "array",\n' +
        '          "description" : "Wagers",\n' +
        '          "items" : {\n' +
        '            "$ref" : "#/definitions/WagerWinningsModel"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "CompanyDTO" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "companyCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "companyTaxId" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "companyName" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "firstname" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "mobilePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "landLinePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "area" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "street" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "postalCode" : {\n' +
        '          "type" : "string"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "Company" : {\n' +
        '      "type" : "object",\n' +
        '      "required" : [ "companyCode", "companyName", "companyTaxId", "firstname" ],\n' +
        '      "properties" : {\n' +
        '        "companyCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "companyTaxId" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "companyName" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "firstname" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "mobilePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "landLinePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "area" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "street" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "postalCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "type" : {\n' +
        '          "type" : "string",\n' +
        '          "enum" : [ "PERSON", "COMPANY" ]\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "CompanyRequest" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "companyCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "companyTaxId" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "companyName" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "firstname" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "mobilePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "landLinePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "area" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "street" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "postalCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "type" : {\n' +
        '          "type" : "string",\n' +
        '          "enum" : [ "PERSON", "COMPANY" ]\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "PersonDTO" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "personCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "personTaxId" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "lastname" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "firstname" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "mobilePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "landLinePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "area" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "street" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "postalCode" : {\n' +
        '          "type" : "string"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "Person" : {\n' +
        '      "type" : "object",\n' +
        '      "required" : [ "firstname", "lastname", "personCode", "personTaxId" ],\n' +
        '      "properties" : {\n' +
        '        "personCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "personTaxId" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "lastname" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "firstname" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "mobilePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "landLinePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "area" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "street" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "postalCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "type" : {\n' +
        '          "type" : "string",\n' +
        '          "enum" : [ "PERSON", "COMPANY" ]\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "PersonRequest" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "personCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "personTaxId" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "lastname" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "firstname" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "mobilePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "landLinePhone" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "area" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "street" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "postalCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "type" : {\n' +
        '          "type" : "string",\n' +
        '          "enum" : [ "PERSON", "COMPANY" ]\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "Location" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "lat" : {\n' +
        '          "type" : "number",\n' +
        '          "format" : "double"\n' +
        '        },\n' +
        '        "lng" : {\n' +
        '          "type" : "number",\n' +
        '          "format" : "double"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "PosDTO" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "posAgencyCode" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int32"\n' +
        '        },\n' +
        '        "posLicenseStatus" : {\n' +
        '          "type" : "string",\n' +
        '          "enum" : [ "UNREGISTERED", "REGISTER" ]\n' +
        '        },\n' +
        '        "lastStatusChange" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "posName" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "country" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "prefecture" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "municipality" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "area" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "street" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "streetNumber" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "postalCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "landLine" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "mobileLine" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "posType" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "location" : {\n' +
        '          "$ref" : "#/definitions/Location"\n' +
        '        },\n' +
        '        "centralAgencyCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "centralRoutId" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "centraRouteName" : {\n' +
        '          "type" : "string"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "Pos" : {\n' +
        '      "type" : "object",\n' +
        '      "required" : [ "area", "country", "location", "municipality", "posAgencyCode", "postalCode", "prefecture", "street", "streetNumber" ],\n' +
        '      "properties" : {\n' +
        '        "posAgencyCode" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int32"\n' +
        '        },\n' +
        '        "posLicenseStatus" : {\n' +
        '          "type" : "string",\n' +
        '          "enum" : [ "UNREGISTERED", "REGISTER" ]\n' +
        '        },\n' +
        '        "lastStatusChange" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "posName" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "country" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "prefecture" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "municipality" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "area" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "street" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "streetNumber" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "postalCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "landLine" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "mobileLine" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "posType" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "location" : {\n' +
        '          "$ref" : "#/definitions/Location"\n' +
        '        },\n' +
        '        "centralAgencyCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "centralRoutId" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "centraRouteName" : {\n' +
        '          "type" : "string"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "PosRequest" : {\n' +
        '      "type" : "object",\n' +
        '      "properties" : {\n' +
        '        "posAgencyCode" : {\n' +
        '          "type" : "integer",\n' +
        '          "format" : "int32"\n' +
        '        },\n' +
        '        "posLicenseStatus" : {\n' +
        '          "type" : "string",\n' +
        '          "enum" : [ "UNREGISTERED", "REGISTER" ]\n' +
        '        },\n' +
        '        "lastStatusChange" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "posName" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "country" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "prefecture" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "municipality" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "area" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "street" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "streetNumber" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "postalCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "landLine" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "mobileLine" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "posType" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "location" : {\n' +
        '          "$ref" : "#/definitions/Location"\n' +
        '        },\n' +
        '        "centralAgencyCode" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "centralRoutId" : {\n' +
        '          "type" : "string"\n' +
        '        },\n' +
        '        "centraRouteName" : {\n' +
        '          "type" : "string"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    "addPersonToPosRequest" : {\n' +
        '      "type" : "object"\n' +
        '    }\n' +
        '  }\n' +
        '}');

    var ul = document.getElementById("ul");
    var obj = json.paths;

    for (var path in obj) {
        var li = document.createElement("li");
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        var method = [];
        if (obj[path]["get"] != null) {
            method.push("GET");
        }
        if (obj[path]["post"] != null) {
            method.push("POST");
        }
        if (obj[path]["delete"] != null) {
            method.push("DELETE");
        }
        if (obj[path]["put"] != null) {
            method.push("PUT");
        }
        var iul = document.createElement("ul");

        for (var i in method) {

            var ili = document.createElement("li");
            var icheckbox = document.createElement('input');
            icheckbox.type = "checkbox";
            icheckbox.setAttribute("onchange", "addToList(this);");
            icheckbox.setAttribute("id", path + "," + method[i]);

            ili.appendChild(icheckbox);
            ili.appendChild(document.createTextNode(method[i]));
            iul.appendChild(ili);
        }

        checkbox.setAttribute("onchange", "addToList(this);");
        checkbox.setAttribute("id", "parent" + "=" + path + "," + method);

        text = path;
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(text));
        li.appendChild(iul);
        ul.appendChild(li);
    }
}

function generate() {
    api.url = "http://";
    api.version = "v1.0";

    for (let i in list) {
        let path = {path: "", endpoint: "", method: "", tags: []};
        let res = list[i].split(",");

        path.path = res[0];
        path.endpoint = res[0];
        path.method = res[1];
        path.tags.push("tag");

        api.infostore.paths.push(path);
    }
    apis.push(api);
    console.log(JSON.stringify(api));
    api = {url: "", version: "", paths: []};
}

function addToList(checkboxElem) {
    let checkboxid;
    const res = checkboxElem.id.split(",");
    let pathi = res[0];
    let parentpath = "parent=" + pathi;
    if (checkboxElem.checked) {
        let chs = [];
        let parent = pathi.includes("parent=");
        if (parent === true) {
            pathi = pathi.replace("parent=", "");
            checkboxid = pathi;
        } else {
            checkboxid = pathi;
            pathi = "parent=" + checkboxid;

            for (let i = 0; i < verbs.length; i++) {
                if (document.getElementById(checkboxid + "," + verbs[i]) != null) {
                    parentpath += "," + verbs[i];
                    chs.push(document.getElementById(checkboxid + "," + verbs[i]))
                }
            }
        }

        for (let i = 0; i < res.length - 1; i++) {
            list.push(checkboxid + "," + res[i + 1]);
            checkboxElem.checked = true;
            var ch = document.getElementById(pathi + "," + res[i + 1]);
            if (ch != null) {
                ch.checked = true;
            }

        }
        if (checkIfparentshouldbeChecked(chs) && parent === false) {
            ch = document.getElementById(parentpath);
            ch.checked = true;
        }

    } else {
        let chs = [];
        let parent = pathi.includes("parent=");
        if (parent === true) {
            pathi = pathi.replace("parent=", "");
            checkboxid = pathi;
        } else {
            checkboxid = pathi;
            pathi = "parent=" + checkboxid;

            for (let i = 0; i < verbs.length; i++) {
                if (document.getElementById(checkboxid + "," + verbs[i]) != null) {
                    parentpath += "," + verbs[i];
                    chs.push(document.getElementById(checkboxid + "," + verbs[i]))
                }
            }
        }
        for (let j = 0; j < res.length - 1; j++) {
            checkboxid = pathi + "," + res[j + 1];
            list = removeA(list, checkboxid.replace("parent=", ""));
            ch = document.getElementById(checkboxid);
            if (ch != null) {
                ch.checked = false;
            }
        }
        if (!checkIfparentshouldbeUnChecked(chs) && parent === false) {
            ch = document.getElementById(parentpath);
            ch.checked = false;
        }
    }
    //alert(list);
}

function checkIfparentshouldbeChecked(children) {
    var set = true;
    for (let i = 0; i < children.length; i++) {
        set = set & children[i].checked;
    }
    return set;
}

function checkIfparentshouldbeUnChecked(children) {
    var set = false;
    for (let i = 0; i < children.length; i++) {
        set = set || children[i].checked;
    }
    return set;
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function createButton(divElement){
    let newbutton = document.createElement("button");
    divElement.appendChild(newbutton);
}

