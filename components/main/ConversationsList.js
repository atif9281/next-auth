import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import api from '@/lib/api';

const ConversationsList = ({ onSelectConversation, conversationId }) => {
  const [conversationIds, setConversationIds] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConversationIds();
  }, [conversationId]);

  const fetchConversationIds = async () => {
    setLoading(true);

    try {
      const response = await api.get('/auth/gettingAllLists');
      const conversationIds = response.data.map((item) => item.id);
      setConversationIds(conversationIds);
    } catch (error) {
      console.error('Error fetching conversation IDs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/auth/deleteConversation/${id}`);
      setConversationIds(conversationIds.filter((cid) => cid !== id));
    } catch (error) {
      console.error(`Error deleting conversation ${id}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);
    onSelectConversation(id);
  };

  return (
    <div className="overflow-auto custom-scrollbar mt-4 ml-1" style={{ height: '388px' }}>
      <ul>
        {
          conversationIds.map((id) => (
            <li
              key={id}
              className={`mt-2 mr-1 border-b-1 text-black rounded ${
                id === selectedConversationId ? 'text-white bg-slate-400' : 'bg-gray-200'
              }`}
            >
              <button onClick={() => handleSelectConversation(id)} className="w-full text-left px-2 py-1">
                Conversation {id.substring(0, 5)}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(id);
                  }}
                  className="ml-2 text-slate-500 hover:text-slate-600"
                >
                  <FontAwesomeIcon icon={faTrash} className="fill-current w-4 h-4" />
                </span>
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default ConversationsList;
