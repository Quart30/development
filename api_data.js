define({ "api": [
  {
    "type": "get",
    "url": "/api/m/appointment",
    "title": "Confirm an Appointment",
    "name": "confirm",
    "group": "Appointment",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fname",
            "description": "<p>Firstname of the User.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lname",
            "description": "<p>Lastname of the User.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of birth of the User.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/m/appointment?fname=John&lname=\"Doe\"&dob=\"05/13/1965",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fname",
            "description": "<p>Firstname of the User.</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/appointment/index.js",
    "groupTitle": "Appointment"
  },
  {
    "type": "put",
    "url": "/api/m/appointment/:id/state/next",
    "title": "Transition to Next State",
    "name": "controller_nextState",
    "group": "Appointment",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/appointment/index.js",
    "groupTitle": "Appointment"
  },
  {
    "type": "put",
    "url": "/api/m/appointment/:id/state",
    "title": "Set a Specific State",
    "name": "controller_updateState",
    "group": "Appointment",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/appointment/index.js",
    "groupTitle": "Appointment"
  },
  {
    "type": "get",
    "url": "/api/m/appointment/:id",
    "title": "Get Appointment Info",
    "name": "retrieve",
    "group": "Appointment",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/appointment/index.js",
    "groupTitle": "Appointment"
  },
  {
    "type": "post",
    "url": "/api/authTest/:id",
    "title": "Test Your Authentication",
    "name": "authTest",
    "group": "Authentication",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/auth/index.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/api/m/auth/",
    "title": "Get Authenticated",
    "name": "postAuth",
    "group": "Authentication",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/auth/index.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/api/m/form/:id",
    "title": "Create a form",
    "name": "controller_createForm",
    "group": "Form",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/form/index.js",
    "groupTitle": "Form"
  },
  {
    "type": "post",
    "url": "/api/m/form/",
    "title": "Create a form response",
    "name": "controller_createResponse",
    "group": "Form",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/api/form/index.js",
    "groupTitle": "Form"
  },
  {
    "type": "get",
    "url": "/api/m/form/:id",
    "title": "Get a form",
    "name": "controller_show",
    "group": "Form",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/m/form/:id",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id for a form.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response (example):",
          "content": "HTTP/1.1 200 OK\n{\n    business: 1293182391203,\n    fields: [ {\n               type: \"textfield\",\n               label: \"Name\"\n       },\n       {\n               type: \"dropdown\",\n               label: \"Gender\",\n               options: [\"Male\", \"Female\"]\n       },\n       {\n               type: \"textfield\",\n               label: \"Email\"\n       },\n       {\n               type: \"dropdown\",\n               label: \"Favorite Color\",\n               options: [\"Blue\", \"Yellow\", \"Green\", \"Pink\"]\n       }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/form/index.js",
    "groupTitle": "Form"
  },
  {
    "type": "delete",
    "url": "/api/m/appointment/:id",
    "title": "Delete A Mobile Token",
    "name": "DeleteToken",
    "group": "MobileToken",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id for mobileToken.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE -i http://localhost/api/m/mobileToken/:id",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response (example):",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/mobiletoken/index.js",
    "groupTitle": "MobileToken"
  },
  {
    "type": "get",
    "url": "/api/m/appointment/",
    "title": "Get A Mobile Token",
    "name": "GetToken",
    "group": "MobileToken",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/m/mobileToken/",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response (example):",
          "content": "HTTP/1.1 204 No Content\n{\n    business : 121231239082103,\n    employee : 123131231409844,\n    name : \"Device Name\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccessRight",
            "description": "<p>Only authenticated Admins can access the data.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ApptNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Not Authenticated\n{\n  \"error\": \"NoAccessRight\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/mobiletoken/index.js",
    "groupTitle": "MobileToken"
  }
] });