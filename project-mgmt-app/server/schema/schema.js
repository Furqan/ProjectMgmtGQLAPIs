// Mongoose Models
const User = require('../models/User')
const Client = require('../models/Client')
const Project = require('../models/Project')

//const { buildSchema } = require('graphql');
const { 
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType
} = require('graphql');

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({ 
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  })
});

// Create User Response Type
const CreateUserResponseType = new GraphQLObjectType({
  name: 'UserData',
  fields: () => ({ 
    message: {type: GraphQLString},
    user: {type: UserType}
  })
});

// Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({ 
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId)
      }
    }
  })
});

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({ 
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId)
      }
    }
  })
});

// Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { email: { type: GraphQLString} },
      async resolve(parent, args) {
        const isUserExist = await User.find({
          email: args.email
        });

        return (isUserExist.length>0) ? isUserExist[0] : null
      }
    },
    /*clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      }
    },*/
    getClientListByUserId: {
      type: new GraphQLList(ClientType),
      args: { userId: { type: GraphQLID} },
      async resolve(parent, args) {
        return await Client.find({
          userId: args.userId
        });
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID} },
      resolve(parent, args) {
        return Client.findById(args.id);
      }
    },
    /*projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      }
    },*/
    getProjectListByClientId: {
      type: new GraphQLList(ProjectType),
      args: { clientId: { type: GraphQLID} },
      async resolve(parent, args) {
        return await Project.find({
          clientId: args.clientId
        });
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID} },
      resolve(parent, args) {
        return Project.findById(args.id);
      }
    },
  }
})

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add User
    addUser: {
      type: CreateUserResponseType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const isUserExist = await User.find({
          email: args.email
        })

        if (isUserExist.length > 0) {
          return { message: `User with ${args.email} already exists!!`, user: null}
        }
        else {
          const user = new User({
            name: args.name,
            email: args.email,
          });
  
          await user.save();

          return { message: `User with ${args.email} created successfully!!`, user: user}
        }
      }
    },
    // Delete User
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return User.findByIdAndRemove(args.id);
      }
    },
    // Add Client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        userId: {type: GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
          userId: args.userId
        });

        return client.save();
      }
    },
    // Delete Client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      }
    },
    // Add Project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: { 
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              'new': { value: 'Not Started'},
              'progress': { value: 'In Progress'},
              'completed': { value: 'Completed'},
            }
          }),
          defaultValue: 'Not Started',
        },
        clientId: {type: GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId
        });

        return project.save();
      }
    },
    // Delete Project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      }
    },
    // Update Project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { 
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              'new': { value: 'Not Started'},
              'progress': { value: 'In Progress'},
              'completed': { value: 'Completed'},
            }
          }),
        }
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status
            }
          },
          { new: true }
        )
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})