'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const SendMessage = () => {

  const params = useParams<{ username: string }>();
  const username = params.username;
  const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?"

  const parseStringMessages = (messageString: string): string[] => {
    let messagesSplit = messageString.split("||");
    messagesSplit = messagesSplit.filter(message => message.length > 0);
    return messagesSplit;
  }

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  }

  const [loading, setLoading] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [messages, setMessages] = useState<string[]>(parseStringMessages(initialMessageString));
  const [error, setError] = useState("");
  const [suggestionError, setSuggestionError] = useState("");

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username
      });
      setError("");
      toast({
        title: 'Success',
        description: response.data.message,
        variant: 'default'
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setError(axiosError.response?.data.message || 'Failed to send message');
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestionLoading(true);
      const response = await axios.post<ApiResponse>('/api/suggest-messages');
      setSuggestionError("");
      const message = response.data.message;
      const matches = message.match(/"(.*?)"/g);
      const removedQuotesMatch = matches?.map(match => match.slice(1, -1));
      const messages = parseStringMessages(removedQuotesMatch?.[0] || initialMessageString);
      setMessages(messages);
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      setSuggestionError(axiosError.response?.data.message || 'Failed to fetch suggestions');
      console.error("Error fetching suggestions", error);
    } finally {
      setIsSuggestionLoading(false);
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center relative">
            {
              error && <p className="text-red-500 absolute top-[-10px] left-0 text-sm">{error}</p>
            }
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className='w-fit mt-2' disabled={loading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestionLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {suggestionError ? (
              <p className="text-red-500">{suggestionError}</p>
            ) : (
              messages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                  disabled={isSuggestionLoading}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}

export default SendMessage
