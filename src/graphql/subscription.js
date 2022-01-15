import { gql } from "@apollo/client";

export const ACTIVITY_CHANGED = gql`
  subscription activity($name: String!) {
    activity(name: $name) {
      data {
        id
        title
        users
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

export const ACTIVITYCONTENT_CHANGED = gql`
  subscription activity($aId: ID!) {
    activityContent(aId: $aId) {
      data {
        id
        title
        users
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
