// import React, { useState, useEffect } from 'react';
// import { Plus, Edit3, Trash2, Send, CheckCircle, Circle, AlertCircle, CheckCircle2, Clock, Target, TrendingUp, Sparkles, Zap, MessageCircle } from 'lucide-react';
// import './App.css';

// const TodoApp = () => {
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [editingText, setEditingText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [activeTab, setActiveTab] = useState('all');

//   const API_BASE = 'http://localhost:8080/api';

//   // Fetch todos on component mount
//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   const fetchTodos = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/todos`);
//       if (response.ok) {
//         const data = await response.json();
//         setTodos(data);
//       }
//     } catch (error) {
//       showMessage('Failed to fetch todos', 'error');
//     }
//   };

//   const showMessage = (text, type) => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 4000);
//   };

//   const addTodo = async () => {
//     if (!newTodo.trim()) return;

//     try {
//       const response = await fetch(`${API_BASE}/todos`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title: newTodo.trim(),
//           completed: false
//         }),
//       });

//       if (response.ok) {
//         const todo = await response.json();
//         setTodos([...todos, todo]);
//         setNewTodo('');
//         showMessage('Todo added successfully!', 'success');
//       }
//     } catch (error) {
//       showMessage('Failed to add todo', 'error');
//     }
//   };

//   const deleteTodo = async (id) => {
//     try {
//       const response = await fetch(`${API_BASE}/todos/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setTodos(todos.filter(todo => todo.id !== id));
//         showMessage('Todo deleted successfully!', 'success');
//       }
//     } catch (error) {
//       showMessage('Failed to delete todo', 'error');
//     }
//   };

//   const toggleComplete = async (todo) => {
//     try {
//       const response = await fetch(`${API_BASE}/todos`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...todo,
//           completed: !todo.completed
//         }),
//       });

//       if (response.ok) {
//         const updatedTodo = await response.json();
//         setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
//         showMessage(`Todo marked as ${!todo.completed ? 'completed' : 'pending'}!`, 'success');
//       }
//     } catch (error) {
//       showMessage('Failed to update todo', 'error');
//     }
//   };

//   const startEditing = (todo) => {
//     setEditingId(todo.id);
//     setEditingText(todo.title);
//   };

//   const saveEdit = async () => {
//     if (!editingText.trim()) return;

//     try {
//       const todoToUpdate = todos.find(t => t.id === editingId);
//       const response = await fetch(`${API_BASE}/todos`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...todoToUpdate,
//           title: editingText.trim()
//         }),
//       });

//       if (response.ok) {
//         const updatedTodo = await response.json();
//         setTodos(todos.map(t => t.id === editingId ? updatedTodo : t));
//         setEditingId(null);
//         setEditingText('');
//         showMessage('Todo updated successfully!', 'success');
//       }
//     } catch (error) {
//       showMessage('Failed to update todo', 'error');
//     }
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditingText('');
//   };

//   const generateSummary = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE}/summarize`, {
//         method: 'POST',
//       });

//       const result = await response.text();
      
//       if (response.ok) {
//         showMessage(result, 'success');
//       } else {
//         showMessage(result, 'error');
//       }
//     } catch (error) {
//       showMessage('Failed to generate summary', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e, action) => {
//     if (e.key === 'Enter') {
//       action();
//     }
//   };

//   const pendingTodos = todos.filter(todo => !todo.completed);
//   const completedTodos = todos.filter(todo => todo.completed);
//   const completionRate = todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0;

//   const getFilteredTodos = () => {
//     switch(activeTab) {
//       case 'pending':
//         return pendingTodos;
//       case 'completed':
//         return completedTodos;
//       default:
//         return todos;
//     }
//   };

//   const filteredTodos = getFilteredTodos();

//   return (
//     <div className="app-container">
//       {/* Animated Background Elements */}
//       <div className="background-animation">
//         <div className="floating-orb orb-1"></div>
//         <div className="floating-orb orb-2"></div>
//         <div className="floating-orb orb-3"></div>
//       </div>

//       <div className="content-wrapper">
//         <div className="main-container">
//           {/* Header */}
//           <div className="header-section">
//             <div className="header-icon">
//               <Sparkles className="icon-sparkles" />
//             </div>
//             <h1 className="main-title">
//               Todo Summary Assistant
//             </h1>
//             <p className="subtitle">
//               Manage your tasks efficiently and get AI-powered summaries delivered straight to your Slack workspace
//             </p>
//           </div>

//           {/* Message Display */}
//           {message.text && (
//             <div className={`message-display ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
//               {message.type === 'success' ? (
//                 <CheckCircle2 className="message-icon" />
//               ) : (
//                 <AlertCircle className="message-icon" />
//               )}
//               <span className="message-text">{message.text}</span>
//             </div>
//           )}

//           {/* Stats Cards */}
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-content">
//                 <div className="stat-info">
//                   <p className="stat-label">Total Tasks</p>
//                   <p className="stat-value">{todos.length}</p>
//                 </div>
//                 <Target className="stat-icon stat-icon-blue" />
//               </div>
//             </div>
            
//             <div className="stat-card">
//               <div className="stat-content">
//                 <div className="stat-info">
//                   <p className="stat-label">Pending</p>
//                   <p className="stat-value stat-value-orange">{pendingTodos.length}</p>
//                 </div>
//                 <Clock className="stat-icon stat-icon-orange" />
//               </div>
//             </div>
            
//             <div className="stat-card">
//               <div className="stat-content">
//                 <div className="stat-info">
//                   <p className="stat-label">Completed</p>
//                   <p className="stat-value stat-value-green">{completedTodos.length}</p>
//                 </div>
//                 <CheckCircle className="stat-icon stat-icon-green" />
//               </div>
//             </div>
            
//             <div className="stat-card">
//               <div className="stat-content">
//                 <div className="stat-info">
//                   <p className="stat-label">Progress</p>
//                   <p className="stat-value stat-value-purple">{completionRate}%</p>
//                 </div>
//                 <TrendingUp className="stat-icon stat-icon-purple" />
//               </div>
//             </div>
//           </div>

//           {/* Add Todo Section */}
//           <div className="add-todo-section">
//             <div className="add-todo-container">
//               <div className="input-container">
//                 <input
//                   type="text"
//                   value={newTodo}
//                   onChange={(e) => setNewTodo(e.target.value)}
//                   onKeyPress={(e) => handleKeyPress(e, addTodo)}
//                   placeholder="What needs to be done today?"
//                   className="todo-input"
//                 />
//               </div>
//               <button
//                 onClick={addTodo}
//                 className="add-btn"
//               >
//                 <Plus className="btn-icon" />
//                 Add Task
//               </button>
//             </div>
//           </div>

//           {/* AI Summary Button */}
//           <div className="summary-section">
//             <button
//               onClick={generateSummary}
//               disabled={loading || pendingTodos.length === 0}
//               className={`summary-btn ${(loading || pendingTodos.length === 0) ? 'summary-btn-disabled' : 'summary-btn-active'}`}
//             >
//               {loading ? (
//                 <>
//                   <Zap className="btn-icon btn-icon-pulse" />
//                   Generating AI Summary...
//                 </>
//               ) : (
//                 <>
//                   <MessageCircle className="btn-icon" />
//                   <Sparkles className="btn-icon-small" />
//                   Generate AI Summary & Send to Slack
//                 </>
//               )}
//             </button>
//             {pendingTodos.length === 0 && (
//               <p className="summary-note">
//                 ✨ No pending todos to summarize
//               </p>
//             )}
//           </div>

//           {/* Tabs */}
//           <div className="tabs-container">
//             <div className="tabs-header">
//               {[
//                 { key: 'all', label: 'All Tasks', count: todos.length },
//                 { key: 'pending', label: 'Pending', count: pendingTodos.length },
//                 { key: 'completed', label: 'Completed', count: completedTodos.length }
//               ].map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveTab(tab.key)}
//                   className={`tab-btn ${activeTab === tab.key ? 'tab-btn-active' : 'tab-btn-inactive'}`}
//                 >
//                   {tab.label} ({tab.count})
//                 </button>
//               ))}
//             </div>

//             {/* Todo List */}
//             <div className="todos-content">
//               {filteredTodos.length === 0 ? (
//                 <div className="empty-state">
//                   <div className="empty-icon">
//                     {activeTab === 'completed' ? (
//                       <CheckCircle className="empty-icon-svg" />
//                     ) : (
//                       <Circle className="empty-icon-svg" />
//                     )}
//                   </div>
//                   <h3 className="empty-title">
//                     {activeTab === 'completed' ? 'No completed tasks yet!' : 
//                      activeTab === 'pending' ? 'No pending tasks!' : 'No tasks yet!'}
//                   </h3>
//                   <p className="empty-description">
//                     {activeTab === 'completed' ? 'Complete some todos to see them here.' :
//                      activeTab === 'pending' ? 'All caught up! Add some tasks to get started.' :
//                      'Add your first task to get organized.'}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="todos-list">
//                   {filteredTodos.map((todo, index) => (
//                     <div
//                       key={todo.id}
//                       className={`todo-item ${todo.completed ? 'todo-item-completed' : 'todo-item-pending'}`}
//                       style={{
//                         animationDelay: `${index * 100}ms`
//                       }}
//                     >
//                       <button
//                         onClick={() => toggleComplete(todo)}
//                         className={`todo-checkbox ${todo.completed ? 'checkbox-completed' : 'checkbox-pending'}`}
//                       >
//                         {todo.completed ? (
//                           <CheckCircle className="checkbox-icon" />
//                         ) : (
//                           <Circle className="checkbox-icon" />
//                         )}
//                       </button>

//                       {editingId === todo.id ? (
//                         <div className="edit-container">
//                           <input
//                             type="text"
//                             value={editingText}
//                             onChange={(e) => setEditingText(e.target.value)}
//                             className="edit-input"
//                             onKeyPress={(e) => handleKeyPress(e, saveEdit)}
//                             autoFocus
//                           />
//                           <button
//                             onClick={saveEdit}
//                             className="edit-btn edit-btn-save"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={cancelEdit}
//                             className="edit-btn edit-btn-cancel"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <>
//                           <span
//                             className={`todo-text ${todo.completed ? 'todo-text-completed' : 'todo-text-active'}`}
//                           >
//                             {todo.title}
//                           </span>
//                           <div className="todo-actions">
//                             <button
//                               onClick={() => startEditing(todo)}
//                               className="action-btn action-btn-edit"
//                             >
//                               <Edit3 className="action-icon" />
//                             </button>
//                             <button
//                               onClick={() => deleteTodo(todo.id)}
//                               className="action-btn action-btn-delete"
//                             >
//                               <Trash2 className="action-icon" />
//                             </button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Progress Bar */}
//           {todos.length > 0 && (
//             <div className="progress-section">
//               <div className="progress-header">
//                 <span className="progress-label">Overall Progress</span>
//                 <span className="progress-percentage">{completionRate}%</span>
//               </div>
//               <div className="progress-bar-container">
//                 <div
//                   className="progress-bar-fill"
//                   style={{ width: `${completionRate}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TodoApp;

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit3, Trash2, CheckCircle, Circle, AlertCircle, CheckCircle2, Clock, Target, TrendingUp, Sparkles, Zap, MessageCircle } from 'lucide-react';
import './App.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('all');

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

  // Memoize fetchTodos to avoid useEffect dependency issues
  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/todos`);
      if (response.ok) {
        const data = await response.json();
        console.log('=== FETCH TODOS DEBUG ===');
        console.log('Raw response data:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        
        if (data && data.length > 0) {
          console.log('First todo:', data[0]);
          console.log('First todo keys:', Object.keys(data[0]));
          console.log('First todo id:', data[0].id);
          console.log('First todo id type:', typeof data[0].id);
        }
        
        // Validate and ensure each todo has a proper id
        const processedTodos = data.map((todo, index) => {
          // Debug each todo
          console.log(`Todo ${index}:`, todo);
          console.log(`Todo ${index} id:`, todo.id);
          console.log(`Todo ${index} id type:`, typeof todo.id);
          
          // Check if id is missing or invalid
          if (todo.id === undefined || todo.id === null) {
            console.error(`ERROR: Todo at index ${index} has invalid id:`, todo);
            // This shouldn't happen with proper backend, but let's handle it
            return { ...todo, id: `temp_${Date.now()}_${index}` };
          }
          
          // Ensure id is a number (your backend uses Long)
          const processedTodo = {
            ...todo,
            id: typeof todo.id === 'string' ? parseInt(todo.id, 10) : todo.id
          };
          
          console.log(`Processed todo ${index}:`, processedTodo);
          return processedTodo;
        });
        
        console.log('Final processed todos:', processedTodos);
        console.log('=== END FETCH DEBUG ===');
        
        setTodos(processedTodos);
      } else {
        const errorText = await response.text();
        console.error('Fetch todos error:', response.status, errorText);
        showMessage('Failed to fetch todos', 'error');
      }
    } catch (error) {
      console.error('Fetch todos network error:', error);
      showMessage('Failed to fetch todos: Network error', 'error');
    }
  }, []);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodo.trim(),
          completed: false
        }),
      });

      if (response.ok) {
        const newTodoFromServer = await response.json();
        console.log('=== ADD TODO DEBUG ===');
        console.log('New todo from server:', newTodoFromServer);
        console.log('New todo id:', newTodoFromServer.id);
        console.log('New todo id type:', typeof newTodoFromServer.id);
        console.log('=== END ADD DEBUG ===');
        
        // Ensure the new todo has proper structure
        const processedNewTodo = {
          ...newTodoFromServer,
          id: typeof newTodoFromServer.id === 'string' ? parseInt(newTodoFromServer.id, 10) : newTodoFromServer.id
        };
        
        setTodos(prevTodos => [...prevTodos, processedNewTodo]);
        setNewTodo('');
        showMessage('Todo added successfully!', 'success');
      } else {
        const errorText = await response.text();
        console.error('Add todo error:', response.status, errorText);
        showMessage('Failed to add todo', 'error');
      }
    } catch (error) {
      console.error('Add todo network error:', error);
      showMessage('Failed to add todo: Network error', 'error');
    }
  };

  const deleteTodo = async (todoToDelete) => {
    console.log('=== DELETE TODO DEBUG ===');
    console.log('Todo object to delete:', todoToDelete);
    console.log('Todo id:', todoToDelete?.id);
    console.log('ID type:', typeof todoToDelete?.id);
    console.log('ID is undefined:', todoToDelete?.id === undefined);
    console.log('ID is null:', todoToDelete?.id === null);
    
    // More robust ID validation
    const todoId = todoToDelete?.id;
    if (todoId === undefined || todoId === null || (typeof todoId === 'string' && todoId === 'undefined')) {
      console.error('ERROR: Cannot delete todo with invalid ID');
      console.error('Full todo object:', todoToDelete);
      showMessage('Error: Todo ID is missing. Please refresh the page and try again.', 'error');
      return;
    }
    
    console.log('Proceeding with delete for ID:', todoId);
    console.log('Full URL:', `${API_BASE}/todos/${todoId}`);
    
    try {
      const response = await fetch(`${API_BASE}/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);
      
      if (response.ok) {
        console.log('Delete successful, updating todos state');
        setTodos(prevTodos => {
          const filteredTodos = prevTodos.filter(todo => todo.id !== todoId);
          console.log('Previous todos count:', prevTodos.length);
          console.log('After delete todos count:', filteredTodos.length);
          console.log('Deleted todo ID:', todoId);
          return filteredTodos;
        });
        showMessage('Todo deleted successfully!', 'success');
      } else {
        const errorText = await response.text();
        console.error('Delete todo error response:', errorText);
        showMessage(`Failed to delete todo: ${response.status} - ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('Delete todo network error:', error);
      showMessage('Failed to delete todo: Network error', 'error');
    }
    console.log('=== END DELETE DEBUG ===');
  };

  const toggleComplete = async (todo) => {
    console.log('=== TOGGLE COMPLETE DEBUG ===');
    console.log('Todo to toggle:', todo);
    console.log('Todo id:', todo?.id);
    console.log('=== END TOGGLE DEBUG ===');
    
    try {
      // Use POST for update as per your backend
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed
        }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        console.log('Updated todo from server:', updatedTodo);
        
        setTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? updatedTodo : t));
        showMessage(`Todo marked as ${!todo.completed ? 'completed' : 'pending'}!`, 'success');
      } else {
        const errorText = await response.text();
        console.error('Toggle complete error:', errorText);
        showMessage('Failed to update todo', 'error');
      }
    } catch (error) {
      console.error('Toggle complete network error:', error);
      showMessage('Failed to update todo: Network error', 'error');
    }
  };

  const startEditing = (todo) => {
    console.log('Starting edit for todo:', todo);
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const saveEdit = async () => {
    if (!editingText.trim()) return;

    try {
      const todoToUpdate = todos.find(t => t.id === editingId);
      if (!todoToUpdate) {
        console.error('Todo to update not found:', editingId);
        showMessage('Error: Todo not found', 'error');
        return;
      }
      
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todoToUpdate,
          title: editingText.trim()
        }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(prevTodos => prevTodos.map(t => t.id === editingId ? updatedTodo : t));
        setEditingId(null);
        setEditingText('');
        showMessage('Todo updated successfully!', 'success');
      } else {
        const errorText = await response.text();
        console.error('Save edit error:', errorText);
        showMessage('Failed to update todo', 'error');
      }
    } catch (error) {
      console.error('Save edit network error:', error);
      showMessage('Failed to update todo: Network error', 'error');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/summarize`, {
        method: 'POST',
      });

      const result = await response.text();
      
      if (response.ok) {
        showMessage(result, 'success');
      } else {
        showMessage(result, 'error');
      }
    } catch (error) {
      console.error('Generate summary error:', error);
      showMessage('Failed to generate summary: Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const completionRate = todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0;

  const getFilteredTodos = () => {
    switch(activeTab) {
      case 'pending':
        return pendingTodos;
      case 'completed':
        return completedTodos;
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="app-container">
      {/* Animated Background Elements */}
      <div className="background-animation">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="content-wrapper">
        <div className="main-container">
          {/* Header */}
          <div className="header-section">
            <div className="header-icon">
              <Sparkles className="icon-sparkles" />
            </div>
            <h1 className="main-title">
              Todo Summary Assistant
            </h1>
            <p className="subtitle">
              Manage your tasks efficiently and get AI-powered summaries delivered straight to your Slack workspace
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`message-display ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="message-icon" />
              ) : (
                <AlertCircle className="message-icon" />
              )}
              <span className="message-text">{message.text}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Total Tasks</p>
                  <p className="stat-value">{todos.length}</p>
                </div>
                <Target className="stat-icon stat-icon-blue" />
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Pending</p>
                  <p className="stat-value stat-value-orange">{pendingTodos.length}</p>
                </div>
                <Clock className="stat-icon stat-icon-orange" />
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Completed</p>
                  <p className="stat-value stat-value-green">{completedTodos.length}</p>
                </div>
                <CheckCircle className="stat-icon stat-icon-green" />
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Progress</p>
                  <p className="stat-value stat-value-purple">{completionRate}%</p>
                </div>
                <TrendingUp className="stat-icon stat-icon-purple" />
              </div>
            </div>
          </div>

          {/* Add Todo Section */}
          <div className="add-todo-section">
            <div className="add-todo-container">
              <div className="input-container">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addTodo)}
                  placeholder="What needs to be done today?"
                  className="todo-input"
                />
              </div>
              <button
                onClick={addTodo}
                className="add-btn"
              >
                <Plus className="btn-icon" />
                Add Task
              </button>
            </div>
          </div>

          {/* AI Summary Button */}
          <div className="summary-section">
            <button
              onClick={generateSummary}
              disabled={loading || pendingTodos.length === 0}
              className={`summary-btn ${(loading || pendingTodos.length === 0) ? 'summary-btn-disabled' : 'summary-btn-active'}`}
            >
              {loading ? (
                <>
                  <Zap className="btn-icon btn-icon-pulse" />
                  Generating AI Summary...
                </>
              ) : (
                <>
                  <MessageCircle className="btn-icon" />
                  <Sparkles className="btn-icon-small" />
                  Generate AI Summary & Send to Slack
                </>
              )}
            </button>
            {pendingTodos.length === 0 && (
              <p className="summary-note">
                ✨ No pending todos to summarize
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs-header">
              {[
                { key: 'all', label: 'All Tasks', count: todos.length },
                { key: 'pending', label: 'Pending', count: pendingTodos.length },
                { key: 'completed', label: 'Completed', count: completedTodos.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`tab-btn ${activeTab === tab.key ? 'tab-btn-active' : 'tab-btn-inactive'}`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Todo List */}
            <div className="todos-content">
              {filteredTodos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    {activeTab === 'completed' ? (
                      <CheckCircle className="empty-icon-svg" />
                    ) : (
                      <Circle className="empty-icon-svg" />
                    )}
                  </div>
                  <h3 className="empty-title">
                    {activeTab === 'completed' ? 'No completed tasks yet!' : 
                     activeTab === 'pending' ? 'No pending tasks!' : 'No tasks yet!'}
                  </h3>
                  <p className="empty-description">
                    {activeTab === 'completed' ? 'Complete some todos to see them here.' :
                     activeTab === 'pending' ? 'All caught up! Add some tasks to get started.' :
                     'Add your first task to get organized.'}
                  </p>
                </div>
              ) : (
                <div className="todos-list">
                  {filteredTodos.map((todo, index) => (
                    <div
                      key={todo.id}
                      className={`todo-item ${todo.completed ? 'todo-item-completed' : 'todo-item-pending'}`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <button
                        onClick={() => toggleComplete(todo)}
                        className={`todo-checkbox ${todo.completed ? 'checkbox-completed' : 'checkbox-pending'}`}
                      >
                        {todo.completed ? (
                          <CheckCircle className="checkbox-icon" />
                        ) : (
                          <Circle className="checkbox-icon" />
                        )}
                      </button>

                      {editingId === todo.id ? (
                        <div className="edit-container">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="edit-input"
                            onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="edit-btn edit-btn-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="edit-btn edit-btn-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span
                            className={`todo-text ${todo.completed ? 'todo-text-completed' : 'todo-text-active'}`}
                          >
                            {todo.title}
                          </span>
                          <div className="todo-actions">
                            <button
                              onClick={() => startEditing(todo)}
                              className="action-btn action-btn-edit"
                            >
                              <Edit3 className="action-icon" />
                            </button>
                            <button
                              onClick={() => {
                                console.log('=== DELETE BUTTON CLICKED ===');
                                console.log('Full todo object:', todo);
                                console.log('Todo keys:', Object.keys(todo));
                                console.log('Todo id specifically:', todo.id);
                                console.log('Todo id type:', typeof todo.id);
                                console.log('=== CALLING DELETE FUNCTION ===');
                                deleteTodo(todo);
                              }}
                              className="action-btn action-btn-delete"
                            >
                              <Trash2 className="action-icon" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {todos.length > 0 && (
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">Overall Progress</span>
                <span className="progress-percentage">{completionRate}%</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;