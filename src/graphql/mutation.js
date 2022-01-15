import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser($name: String!, $password: String!) {
    createUser(name: $name, password: $password) {
      name
    }
  }
`;

export const CREATE_TODO = gql`
  mutation createTodo(
    $name: String!
    $title: String!
    $dueTime: Date!
    $activity: String
    $description: String
    $priority: Int!
  ) {
    createTodo(
      name: $name
      title: $title
      dueTime: $dueTime
      activity: $activity
      description: $description
      priority: $priority
    ) {
      id
      title
      dueTime
      activity
      description
      priority
    }
  }
`;

export const MODIFY_TODO = gql`
  mutation modifyTodo(
    $id: ID!
    $name: String!
    $title: String!
    $dueTime: Date!
    $activity: String
    $description: String
    $priority: Int!
  ) {
    modifyTodo(
      id: $id
      name: $name
      title: $title
      dueTime: $dueTime
      activity: $activity
      description: $description
      priority: $priority
    ) {
      id
      title
      dueTime
      activity
      description
      priority
    }
  }
`;

export const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!, $name: String!, $activity: String) {
    deleteTodo(id: $id, name: $name, activity: $activity)
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation createActivity($users: [String!]!, $title: String!) {
    createActivity(users: $users, title: $title) {
      id
      title
    }
  }
`;

export const MODIFY_ACTIVITY = gql`
  mutation modifyActivity($id: ID!, $users: [String!]!, $title: String!) {
    modifyActivity(id: $id, users: $users, title: $title) {
      id
      title
    }
  }
`;

export const DELETE_ACTIVITY = gql`
  mutation deleteActivity($id: ID!) {
    deleteActivity(id: $id)
  }
`;

export const CREATE_PROGRESS = gql`
  mutation createProgress($title: String!, $dueTime: Date!, $activity: ID!) {
    createProgress(title: $title, dueTime: $dueTime, activity: $activity) {
      id
      title
      dueTime
    }
  }
`;

export const MODIFY_PROGRESS = gql`
  mutation modifyProgress(
    $title: String!
    $dueTime: Date!
    $id: ID!
    $activity: ID!
  ) {
    createProgress(
      title: $title
      dueTime: $dueTime
      id: $id
      activity: $activity
    ) {
      id
      title
      dueTime
    }
  }
`;

export const DELETE_PROGRESS = gql`
  mutation deleteProgress($id: ID!, $activity: ID!) {
    deleteProgress(id: $id, activity: $activity)
  }
`;
