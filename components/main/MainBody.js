"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ChatWindow from '@/components/main/ChatWindow';
import ConversationsList from '@/components/main/ConversationsList';
import NavigationButtons from './NavigationButtons';
import Cookies from 'js-cookie';
import Logout from './Logout';
import api from '@/lib/api';

const MainBody = () => {

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]); // State to store messages
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false); // Updated state name
  const [logout, setLogout] = useState(false);


  const getCookieValue = (cookieName) => {
    const cookieValue = Cookies.get(cookieName);
    return cookieValue;
  };



const checkAuthentication = async () => {
  const token = getCookieValue('token'); // Replace 'token' with your cookie name
  console.log('Token:', token); // Log the token

  if (token) {
    try {
      const response = await api.get('/auth/checkAuthentication');
      if (response.status === 200) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setAuthenticated(false);
    }
  } else {
    setAuthenticated(false);
  }
};

useEffect(() => {
  checkAuthentication();
}, [logout]);



  const handleLogout = async () => {
      console.log('clicked handlelogout')
      try {
        await api.get('/auth/logout');
        // Remove the token from cookies
        Cookies.remove('token');
        setLogout(true);
        // Reload the page to the / page
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    const handleNewChat = async () => {
      try {
        setLoading(true); // Set loading state before making the request
    
        const response = await api.post('/auth/startConversation');
    
        const { data } = response;
        const fetchingID = data.conversationId;
    
        // Update state to trigger re-render
        setConversationId(fetchingID);
        setMessages([]); // Clear previous messages
    
        setLoading(false); // Reset loading state after successful response
      } catch (error) {
        console.error('Error starting new conversation:', error);
        setLoading(false); // Reset loading state on error
      }
    };

    
    const handleSelectConversation = (id) => {
      setConversationId(id);
    };

  useEffect(() => {
    const fetchLatestConversation = async () => {
      try {
        const response = await api.get('/auth/latestConversation');
        setConversationId(response.data.conversationId);
      } catch (error) {
        console.error('Error fetching latest conversation:', error);
      }
    };
    
    fetchLatestConversation();
  }, []);

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };



  

  return (
    <div>{authenticated ? (<div className="h-screen bg-gray-200 flex overflow-hidden">
      <aside className="bg-white w-64 h-screen fixed p-4">
        <div className="space-y-4">
          <div className="relative px-4 py-3 flex items-center space-x-4 rounded-lg text-white bg-slate-500">
            <i className="fas fa-home text-white"></i>
            <span className="-mr-1 font-medium">CodeBox 3.5</span>
          </div>
          <button
            onClick={handleNewChat}
            className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-500 group text-white bg-slate-400 w-56"
          >
            <i className="fas fa-wallet"></i>
            <span className='text-white bg-slate-400'>Create new chat</span>
            <FontAwesomeIcon icon={faPlusCircle} className="ml-2 text-slate-600 text-lg" />
          </button>
        </div>
        <ConversationsList conversationId={conversationId} onSelectConversation={handleSelectConversation} />
        <Logout clickingLogout={handleLogout}></Logout>
      </aside>
      <main className="sm:ml-64 ml-0 lg:ml-64 lg:pl-4 lg:flex lg:flex-col lg:w-3/4 xl:w-3/4 mx-2 pt-5">
          <ChatWindow
            conversationId={conversationId}
            onNewMessage={handleNewMessage}
          />
      </main>
    </div>) : (<div className='text-center bg-gray-200 w-full min-h-screen flex flex-col items-center justify-center'>
  <div className="text-2xl text-center font-bold tracking-wide text-gray-800">Please login or sign in first</div>
  <NavigationButtons className="mt-4" /> 
</div>)}</div>
    
  );
};

export default MainBody;
