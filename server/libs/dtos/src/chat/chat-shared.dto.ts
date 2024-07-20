import { ChatCompletionMessageParam } from "openai/resources"

export type ChatMessageData = {
    message:string,
    prevMessages: ChatCompletionMessageParam[],
    userId:number
}