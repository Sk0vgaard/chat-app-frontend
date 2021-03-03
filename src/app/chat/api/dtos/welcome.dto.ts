import { ChatClient } from '../../shared/models/chat-client.model';
import { ChatMessage } from '../../shared/models/chat-message.model';

export interface WelcomeDto {
  clients: ChatClient[];
  client: ChatClient;
  messages: ChatMessage[];
}
