"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ChatWindow from '@/components/main/ChatWindow';
import ConversationsList from '@/components/main/ConversationsList';
import NavigationButtons from './NavigationButtons';
import Logout from './Logout';
import api from '@/lib/api';

const MainBody = () => {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]); // State to store messages
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(null); // Updated to handle initial state
  const [logout, setLogout] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false); // Updated to initialize as false
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const checkAuthentication = async () => {
    if (authenticated === null) {
      try {
        const response = await api.get('/auth/checkAuthentication');
        if (response.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      }
      setInitialCheckDone(true); // Mark the initial check as done
    }
  };

  // Initial check for authentication when the component mounts
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Effect to recheck authentication when logout state changes or initial check is done
  useEffect(() => {
    if (!logout && initialCheckDone) {
      checkAuthentication();
    }
  }, [logout, initialCheckDone]);

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
      setAuthenticated(false); // Directly set authenticated to false
      setLogout(true);
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
    if (authenticated) fetchLatestConversation();
  }, [authenticated]);

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  // Render UI based on authentication state and initial check state
  if (authenticated === null && !initialCheckDone) {
    // Show a loading state while checking authentication
    return (
      <div className='text-center bg-gray-200 w-full min-h-screen flex flex-col items-center justify-center'>
        <div className="text-2xl text-center font-bold tracking-wide text-gray-800">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div>
      {authenticated ? (
        <div className='chat-window custom-scrollbar'>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-10 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 custom-scrollbar bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
            <div className={`relative px-4 py-3 flex items-center space-x-4 rounded-lg text-white bg-slate-500 ${sidebarOpen ? 'mt-8' : ''}`}>
  <i className="fas fa-home text-white"></i>
  <span className="-mr-1 font-medium">CodeBox 3.5</span>
</div>
            </li>
            <li>
              <button
                onClick={handleNewChat}
                className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-500 group text-white bg-slate-400 w-56"
              >
                <i className="fas fa-wallet"></i>
                <span className='text-white bg-slate-400'>Create new chat</span>
                <FontAwesomeIcon icon={faPlusCircle} className="ml-2 text-slate-600 text-lg" />
              </button>
            </li>
            <ConversationsList conversationId={conversationId} onSelectConversation={handleSelectConversation} />
            
          </ul>
          <Logout clickingLogout={handleLogout}></Logout>
        </div>
        
      </aside>
      <main className="sm:ml-64 ml-0 lg:ml-64 lg:pl-4 lg:flex lg:flex-col lg:w-3/4 xl:w-3/4 mx-2 pt-2 custom-scrollbar overflow-hidden scrollbar-none">
        <ChatWindow conversationId={conversationId} onNewMessage={handleNewMessage} />
      </main>
    </div>
      ) : (
        <div className='text-center bg-gray-200 w-full min-h-screen flex flex-col items-center justify-center'>
          <div className="text-2xl text-center font-bold tracking-wide text-gray-800">Please login or sign in first</div>
          <NavigationButtons className="mt-4" />
        </div>
      )}
    </div>
  );
};

export default MainBody;
