import { gql } from "@apollo/client";

export const GET_HISTORY = gql`
  query {
    messages {
      sender
      text
      createdAt
      updatedAt
    }
  }
`;

export const CLEAR_MESSAGES = gql`
  mutation {
    clearMessages {
      success
    }
  }
`;
