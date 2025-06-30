import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Chat = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('loggedIn') !== 'true') navigate('/login');
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/get/user/files/`, {}, {
          withCredentials: true,
          headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        });
        setUserFiles(res.data.files || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      await axios.post(`${API_BASE_URL}/upload/document/`, fd, {
        withCredentials: true,
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      });
      const res = await axios.post(`${API_BASE_URL}/get/user/files/`, {}, {
        withCredentials: true,
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      });
      setUserFiles(res.data.files || []);
      alert('Uploaded!');
    } catch {
      alert('Upload failed');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!query.trim()) return;
    const userMsg = { role: 'user', content: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('query', userMsg.content);
      fd.append('filenames', selectedFiles.join(','));
      const res = await axios.post(`${API_BASE_URL}/chat/`, fd, {
        withCredentials: true,
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data }]);
    } catch {
      alert('Chat failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .chat-container { min-height:100vh; background:#f8f9fa; padding:2rem; }
        .chat-card { display:flex; gap:1rem; max-width:1200px; margin:auto; height: calc(100vh - 10rem); }
        .sidebar {
          flex: 0 0 240px; 
          padding:1rem;
          background:#fff;
          border-radius:.75rem;
          box-shadow:0 4px 20px rgba(0,0,0,.1);
          overflow-y:auto;
          overflow-x:hidden;
        }
        .sidebar label {
          display: block;
          overflow-wrap: break-word;
          word-break: break-all;
        }
        .chat-box { flex:1; display:flex; flex-direction:column; background:#fff; border-radius:.75rem; box-shadow:0 4px 20px rgba(0,0,0,.1); }
        .messages { flex:1; overflow-y:auto; padding:1rem; }
        .msg-user, .msg-assistant {
          padding:.75rem 1rem;
          margin-bottom:.75rem;
          border-radius:.5rem;
          max-width:75%;
          white-space:pre-wrap;
        }
        .msg-user { align-self:flex-end; background:#d4e4f4; }
        .msg-assistant { align-self:flex-start; background:#d4e4f4; }
        .markdown pre { max-height:300px; overflow-y:auto; background:#eef; padding:.5rem; border-radius:.5rem; }
        .markdown code { background:#eee; padding:.2rem .4rem; border-radius:.3rem; }
        .chat-input { padding:.75rem; border-top:1px solid #ddd; }
      `}</style>

      <div className="chat-container" style={{"overflow": "hidden"}}>
        <div className="chat-card">
          <div className="sidebar">
            <h5>Your Files</h5>
            {userFiles.length === 0
              ? <p className="text-muted">No files uploaded.</p>
              : userFiles.map(f => (
                  <div key={f} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={f}
                      checked={selectedFiles.includes(f)}
                      onChange={() => setSelectedFiles(prev =>
                        prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
                      )}
                    />
                    <label className="form-check-label" htmlFor={f}>📄{f}</label>
                  </div>
                ))
            }
            <div className="mt-3">
              <input type="file" accept=".pdf,.txt,.docx" className="d-none" id="uploadDoc" onChange={handleFileUpload} />
              <label className="btn btn-outline-dark w-100" htmlFor="uploadDoc">
                Upload Document
              </label>
            </div>
          </div>

          <div className="chat-box">
            <div className="messages" ref={scrollRef}>
              {messages.length === 0 && <p className="text-center text-muted mt-5">Ask your legal question...</p>}
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={(m.role === 'user' ? 'msg-user' : 'msg-assistant') + ' markdown'}
                  dangerouslySetInnerHTML={{ __html: marked.parse(`**${m.role === 'user' ? 'You' : 'Assistant'}:**\n\n${m.content}`) }}
                />
              ))}
              {loading && <div className="msg-assistant markdown">Assistant: Thinking....</div>}
            </div>

            <div className="chat-input">
              <form className="d-flex" onSubmit={handleSubmit}>
                <input className="form-control me-2" type="text" placeholder="Ask your legal question..." value={query} onChange={e => setQuery(e.target.value)} required />
                <button className="btn btn-dark" type="submit">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
