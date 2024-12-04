import { Highlight, Content } from "react-pdf-highlighter-extended";

export interface CommentedHighlight extends Highlight {
  content: Content;
  comment?: string;
  color: string;
  configID: string;
  profileID: string;
}
