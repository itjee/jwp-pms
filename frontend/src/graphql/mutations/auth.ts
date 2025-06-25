import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($userInput: UserInput!) {
    register(userInput: $userInput) {
      user {
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
      accessToken
      tokenType
    }
  }
`;

export const LOGIN = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      user {
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
      accessToken
      tokenType
    }
  }
`;