import { gql } from "@apollo/client";

export const QUERY_LOGIN = gql`
  query login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password)
  }
`;

export const QUERY_TODOS = gql`
  query user($name: String!) {
    user(name: $name) {
      todo {
        id
        title
        dueTime
        activity
        description
        priority
      }
      activity {
        id
        title
        progress {
          id
          title
          dueTime
        }
        todo {
          id
          title
          dueTime
          activity
          description
          priority
        }
      }
    }
  }
`;

export const QUERY_ACTIVITY = gql`
  query activity($id: ID!) {
    activity(id: $id) {
      id
      title
      progress {
        id
        title
        dueTime
      }
      todo {
        id
        title
        dueTime
        activity
        description
        priority
      }
    }
  }
`;
