# Query

## Get User By Email
```
{
  user(email: "<USER_EMAIL>") {
    id
    name
    email
  }
}
```

## Get Client List By User Id
```
{
  getClientListByUserId(userId: "<USER_ID>") {
    id
    name
    email
    phone
  }
}
```

## Get client by Id
```
{
  client(id: <"CLIENT_ID">) {
    name
    email
  }
}
```

## Get Project List By Client Id
```
{
  getProjectListByClientId(clientId: "62affa94e8a7ea50ffa6ea51") {
    id
    name
    description
    status
    client {
      id
      name
      user {
        id
        name
        email
      }
    }
  }
}
```

## Get project by Id
```
{
  project(id: <"PROJECT_ID">) {
    name
    description
    status
    client {
      name
      email
    }
  }
}
```

# Mutation

## Add User
```
mutation{
  addUser(name:"<USER_NAME>", email: "<USER_EMAIL>") {
    message
    data {
      id
      name
      email
    }
  }
}
```

## Delete User By ID
```
mutation {
  deleteUser(id:"<USER_ID>") {
    id
    name
    email
  }
}
```

## Add Client
```
mutation{
  addClient(name:"<CLIENT_NAME>", email: "<CLIENT_EMAIL>", phone:"<CLIENT_PHONE>", userId: "<USER_ID>") {
    id
    name
    email
    phone
    user {
      email
    }
  }
}
```

## Delete Client
```
mutation {
  deleteClient(id:"<CLIENT_ID>") {
    name
  }
}
```

## Add Project
```
mutation{
  addProject(name:"<PROJECT_NAME>", description: "<PROJECT_DESCRIPTION>", status:new, clientId: "<CLIENT_ID>") {
    id
    name
    description
    status
    client {
      name
    }
  }
}
```

## Delete Project
```
mutation {
  deleteProject(id:"<PROJECT_ID>") {
    name
  }
}
```

## Update Project Description
```
mutation {
  updateProject(id:"<PROJECT_ID>", description:"<UPDATED_PROJECT_DESCRIPTION>") {
    name
    description
    status
  }
}
```

## Update Project Status
```
mutation {
  updateProject(id:"<PROJECT_ID>", status:progress) {
    name
    description
    status
  }
}
```