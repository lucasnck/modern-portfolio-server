import { makeExecutableSchema } from 'graphql-tools'

import {
    typeDef as genericInformation,
} from '../models/genericInformation/schema';

import {
    typeDef as user,
    query as userQuery,
    mutation as userMutation,
    resolvers as userResolvers,
} from '../models/user/schema';

import {
    typeDef as technology,
    query as technologyQuery,
    mutation as technologyMutation,
    resolvers as technologyResolvers,
} from '../models/technology/schema';

import {
    typeDef as category,
    query as categoryQuery,
    mutation as categoryMutation,
    resolvers as categoryResolvers,
} from '../models/category/schema';

import {
    typeDef as skill,
    query as skillQuery,
    mutation as skillMutation,
    resolvers as skillResolvers,
} from '../models/skill/schema';

import {
    typeDef as project,
    query as projectQuery,
    mutation as projectMutation,
    resolvers as projectResolvers,
} from '../models/project/schema';

import {
    typeDef as career,
    query as careerQuery,
    mutation as careerMutation,
    resolvers as careerResolvers,
} from '../models/career/schema';

import {
    typeDef as article,
    query as articleQuery,
    mutation as articleMutation,
    resolvers as articleResolvers,
} from '../models/article/schema';

const typeDefs = `  
    ${genericInformation}
    ${user}
    ${technology}
    ${category}
    ${skill}
    ${project}
    ${career}
    ${article}
    type Query {
        ${userQuery}
        ${technologyQuery}
        ${categoryQuery}
        ${skillQuery}
        ${projectQuery}
        ${careerQuery}
        ${articleQuery}
    }
    type Mutation {
        ${userMutation}
        ${technologyMutation}
        ${categoryMutation}
        ${skillMutation}
        ${projectMutation}
        ${careerMutation}
        ${articleMutation}
    }
`

const resolvers = {
    Query: Object.assign({}, userResolvers.Query, technologyResolvers.Query, categoryResolvers.Query, skillResolvers.Query, projectResolvers.Query, careerResolvers.Query, articleResolvers.Query),
    Mutation: Object.assign({}, userResolvers.Mutation, technologyResolvers.Mutation, categoryResolvers.Mutation, skillResolvers.Mutation, projectResolvers.Mutation, careerResolvers.Mutation, articleResolvers.Mutation)
}

export default makeExecutableSchema({
	typeDefs: [typeDefs],
	resolvers: resolvers
});
