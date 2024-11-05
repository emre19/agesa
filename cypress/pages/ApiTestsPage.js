class ApiTestsPage {
  baseUrl = "http://maf-callcenter-services-maf-tst.apps.ocptst.agesa.com.tr/api";
  default_bearer ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJfNDZBcGhPTVc5LW1GWnhOaVpFSEZZTUlvZEVaMXVxb0JnS0hRQVZzNVhjIn0.eyJleHAiOjE5Njk5ODkzNzcsImlhdCI6MTY1NDYyOTM3NywianRpIjoiZDA1NGE1NTktZWJkZS00MzAyLTkyMDAtYTAxMDI0YzJmZWY1IiwiaXNzIjoiaHR0cHM6Ly9zc29tYWZ0ZXN0LmFnZXNhLmNvbS50ci9hdXRoL3JlYWxtcy9pbnRlcm5hbCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI3MDM5NWQ5Ni1lMjhkLTQzOTktODZkMy00ZTFiMWQzYWJhODYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJiYXNpYyIsInNlc3Npb25fc3RhdGUiOiJlMDU3N2IzYy0xYzhlLTRmZWItYTc5MC04OGI1Mzk5ZTA4NTQiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIk1vZHVsZVNhbGVzIiwiRXh0QXN0ZXJpc2siLCJNb2R1bGVDb250ZW50IiwiTW9kdWxlQWRtaW4iLCJNb2R1bGVaZWthS3VwdSIsIm9mZmxpbmVfYWNjZXNzIiwiRXh0RGlnaXRhbEFyY2hpZXZlIiwiTW9kdWxlQ29ycCIsInVtYV9hdXRob3JpemF0aW9uIiwiTW9kdWxlT3BlcmF0aW9uYWwiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6InN3YWdnZXIifQ.EpZqqYKSv4X9gYue9anhT-TGWK177XemYO1vK7u-NwJpn79W0hSbvTmDbIYR5Mmeu73Sa0plB4vE0kZ06ePRDrAFZBgs2ype4Gx7JLG54vNSC-xKHjT7-JcnpHjejh75tsNB5B1Fl36PtqQ2KjP6xvcNGKF2f0ge_gsH-b7eb4Ez9agAMQPRnj087WQHE4Oz_tl3XgSXrpqP4EcS58zm7xdJYhPRAXMIPgXJJtGIDFLTZhc7MA9YLutgOhWtQ6AbX-ovXJ52FeAxQlIhno7GOonYZ5hJowtxxq6TC8eU_dt5c973VtA7g6SEEGlzTamGXFMkWTG55uMU7MOV8Zet9w";
  default_x_auth_config ="internal";
  message_controller= {
    return_all_messages: {
      "endpoint": "/system/messages"
    },
    save_message: {
      "endpoint": "/system/messages",
      "body": {
        "application": {
          "id": "string",
          "messages": [
            null
          ],
          "name": "string",
          "status": 0
        },
        "code": "string",
        "filePath": "string",
        "language": "string",
        "message": "string",
        "name": "string",
        "type": "E"
      }
    }

  };
}

export const apiCalls = new ApiTestsPage();
