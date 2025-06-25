import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      username
      fullName
      role
      avatarUrl
      phone
      department
      position
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      username
      fullName
      role
      avatarUrl
      phone
      department
      position
      isActive
      createdAt
      updatedAt
    }
  }
`;