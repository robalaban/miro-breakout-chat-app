export interface Message { text: string, author: string, timestamp: string };

export type MessageHandler = (msg: string, name: string) => void;

export type EmitHandler = (error: any, response: any) => void;

export type ChatMessagesHandler = (messages: Array<Message>) => void;

export interface ChatSettings {
    roomId: string;
    name: string;
    messageHandler: MessageHandler;
    chatMessagesHandler: ChatMessagesHandler;
}

export interface ChatController {
    sendMessage: (msg: string) => void;
}
