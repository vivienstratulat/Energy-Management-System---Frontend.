import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import "./Chat.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Chat = () => {
  const { email } = useParams();
  const [stompClient, setStompClient] = useState(null);
  const [conversations, setConversations] = useState({});
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState({});
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    externalId: "",
    role: "",
  });
  const [receiverId, setReceiverId] = useState("");
  const [admins, setAdmins] = useState([]);
  const [conversationPartners, setConversationPartners] = useState({});
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const result = await axios.get(
        `http://localhost:8080/person/getByEmail/${email}`
      );
      setUser(result.data);
      fetchConversationPartners(result.data.id);
    };

    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/person/getAllAdmins"
        );
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    loadUser();
    fetchAdmins();
  }, [email]);

  useEffect(() => {
    if (user.id) {
      const socket = new SockJS("http://localhost:8091/chat");
      const client = Stomp.over(socket);

      client.connect({}, () => {
        setStompClient(client);
        client.subscribe(`/queue/${user.id}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          updateConversationsWithMessage(receivedMessage);

          getPersonById(receivedMessage.fromId).then((person) => {
            toast(`New message: ${receivedMessage.text} from ${person.name}`, {
              autoClose: 6000,
            });
          });
          saveMessage(receivedMessage);
        });

        client.subscribe(`/queue/typing/${user.id}`, (message) => {
          const typingNotification = JSON.parse(message.body);
          /* getPersonById(user.id).then(person => {
                        toast(` ${person.name} is typing...`, { autoClose: 6000 });
                    });*/
          setIsTyping((prev) => ({
            ...prev,
            [typingNotification.fromId]: typingNotification.typing,
          }));
        });

        client.subscribe(`/queue/seen/${user.id}`, (message) => {
          const messageId = JSON.parse(message.body);
          getMessageById(messageId).then((seenMessage) => {
            toast(`Message seen: ${seenMessage}`, { autoClose: 6000 });
            updateConversationsWithMessage(seenMessage);
          });
        });
      });

      return () => {
        if (client) {
          client.disconnect();
        }
      };
    }
  }, [user.id]);

  const fetchConversationPartners = async (userId) => {
    const response = await axios.get(`http://localhost:8091/conversations/${userId}`);
    const partnerIds = response.data;
    const newConversationPartners = {};

    for (const partnerId of partnerIds) {
        try {
            const partnerResponse = await axios.get(`http://localhost:8080/person/getById/${partnerId}`);
            if (partnerResponse.data && partnerResponse.data.name) {
                newConversationPartners[partnerId] = partnerResponse.data.name;
            }
        } catch (error) {
            console.error(`Error fetching details for user ID ${partnerId}:`, error);
        }
        // Only call getMessages if partnerId is valid
        if (partnerId) {
            getMessages(userId, partnerId);
        }
    }

    setConversationPartners(newConversationPartners);
};


  const updateConversationsWithMessage = (message) => {
    if (!message.fromId || !message.toId) {
        console.error('Invalid message ID', message);
        return;
    }
    
    const conversationId =
      message.fromId === user.id ? message.toId : message.fromId;
    setConversations((prevConversations) => {
      const updatedConversation = prevConversations[conversationId]
        ? [...prevConversations[conversationId], message]
        : [message];
      return { ...prevConversations, [conversationId]: updatedConversation };
    });
  };

  const getMessages = async (fromId, toId) => {
    const response = await axios.get(
      `http://localhost:8091/getMessages/${fromId}/${toId}`
    );
    const sortedMessages = response.data.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    setConversations((prev) => ({
      ...prev,
      [toId]: sortedMessages,
    }));
  };

  const getMessageById = async (id) => {
    const response = await axios.get(
      `http://localhost:8091/getMessageById/${id}`
    );
    return response.data;
  };

  const getPersonById = async (id) => {
    const response = await axios.get(
      `http://localhost:8080/person/getById/${id}`
    );
    return response.data;
  };

  const handleTyping = () => {
    if (stompClient && receiverId) {
      const typingNotification = {
        fromId: user.id,
        toId: receiverId,
        typing: true,
      };
      stompClient.send("/app/typing", {}, JSON.stringify(typingNotification));

      setTimeout(() => {
        const stopTypingNotification = {
          fromId: user.id,
          toId: receiverId,
          typing: false,
        };
        stompClient.send(
          "/app/typing",
          {},
          JSON.stringify(stopTypingNotification)
        );
      }, 3000);
    }
  };

  const handleSeen = () => {
    if (stompClient && selectedConversationId) {
      const unseenMessages = conversations[selectedConversationId]?.filter(
        (message) => message.toId === user.id && !message.seen
      );
      if (unseenMessages?.length) {
        const lastUnseenMessage = unseenMessages[unseenMessages.length - 1];
        if (lastUnseenMessage.id !== lastSeenMessageId) {
          stompClient.send(
            "/app/seen",
            {},
            JSON.stringify(lastUnseenMessage.id)
          );
          updateMessageSeenStatus(lastUnseenMessage.id);
          setLastSeenMessageId(lastUnseenMessage.id);
        }
      }
    }
  };

  const saveMessage = async (message) => {
    try {
      await axios.post("http://localhost:8091/saveMessage", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const updateMessageSeenStatus = (messageId) => {
    setConversations((prevConversations) => {
      const updatedConversations = { ...prevConversations };

      Object.keys(updatedConversations).forEach((conversationId) => {
        updatedConversations[conversationId] = updatedConversations[
          conversationId
        ].map((msg) => (msg.id === messageId ? { ...msg, seen: true } : msg));
      });

      return updatedConversations;
    });
  };

  const sendMessage = () => {
    if (stompClient && newMessage && receiverId) {
      const chatMessage = {
        fromId: user.id,
        toId: receiverId,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
      updateConversationsWithMessage(chatMessage);
      setNewMessage("");
    }
  };

  const selectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setReceiverId(conversationId.toString());

    if (!conversations[conversationId]) {
      getMessages(user.id, conversationId);
    } else {
      conversations[conversationId].forEach((message) => {
        if (message.toId === user.id && !message.seen) {
          updateMessageSeenStatus(message.id);
        }
      });
      handleSeen();
    }
  };

  return (
    <div className="chat-container">
      <div className="admin-list">
        {admins.map((admin) => (
          <button
            key={admin.id}
            onClick={() => {
              setReceiverId(admin.id.toString());
              selectConversation(admin.id);
            }}
          >
            Chat with admin: {admin.name}
          </button>
        ))}
      </div>
      <div className="conversation-list">
        {Object.keys(conversations).map((conversationId) => (
          <button
            key={conversationId}
            onClick={() => selectConversation(conversationId)}
            className="conversation-button"
          >
            Conversation with{" "}
            {conversationPartners[conversationId] || `User ${conversationId}`}
          </button>
        ))}
      </div>
      <div className="message-list">
    {selectedConversationId && conversations[selectedConversationId]?.map((msg) => (
        <div
            key={msg.id}
            className={`message ${msg.fromId === user.id ? "you-message" : ""}`}
        >
            {/* Display sender's name if available, otherwise display 'User <ID>' */}
            {msg.fromId !== user.id && (
                <strong>{conversationPartners[msg.fromId] || `User ${msg.fromId}`}: </strong>
            )}
            {msg.text}
            <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleString()}
            </div>
            {msg.fromId === user.id && msg.seen && (
                <span className="seen-indicator">Seen</span>
            )}
        </div>
    ))}
    {isTyping[receiverId] && (
        <div className="typing-notification">
            {conversationPartners[receiverId] || `User ${receiverId}`} is typing...
        </div>
    )}
</div>

      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
            handleSeen();
          }}
          className="message-input"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      {Object.entries(isTyping).map(
        ([userId, typing]) =>
          typing && (
            <div key={userId} className="typing-notification">
              {conversationPartners[userId] || `User ${userId}`} is typing...
            </div>
          )
      )}
    </div>
  );
};

export default Chat;
