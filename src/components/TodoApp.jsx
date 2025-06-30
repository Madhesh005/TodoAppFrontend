import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

const TodoApp = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [draggedTask, setDraggedTask] = useState(null);

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (newTask.trim() !== '') {
            const task = {
                id: Date.now(),
                text: newTask.trim(),
                completed: false,
                createdAt: new Date().toISOString()
            };
            setTasks([...tasks, task]);
            setNewTask('');
        }
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const toggleTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDropToPending = (e) => {
        e.preventDefault();
        if (draggedTask && draggedTask.completed) {
            setTasks(tasks.map(task =>
                task.id === draggedTask.id ? { ...task, completed: false } : task
            ));
        }
        setDraggedTask(null);
    };

    const handleDropToCompleted = (e) => {
        e.preventDefault();
        if (draggedTask && !draggedTask.completed) {
            setTasks(tasks.map(task =>
                task.id === draggedTask.id ? { ...task, completed: true } : task
            ));
        }
        setDraggedTask(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo List</h1>
                <p className="text-gray-600">Drag and drop tasks between sections to manage your workflow</p>
            </div>

            {/* Add Task Section */}
            {/* Add Task Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a new task..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={addTask}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus size={20} />
                        Add Task
                    </button>
                </div>
            </div>


            {/* Tasks Grid - Changed from lg:grid-cols-2 to grid-cols-1 md:grid-cols-2 for better responsiveness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Pending Tasks */}
                <div
                    className="bg-white rounded-lg shadow-md overflow-hidden h-fit"
                    onDragOver={handleDragOver}
                    onDrop={handleDropToPending}
                >
                    <div className="bg-yellow-500 text-white p-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                            Pending Tasks ({pendingTasks.length})
                        </h2>
                    </div>
                    <div className="p-4 min-h-96">
                        {pendingTasks.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                <div className="text-4xl mb-4">📝</div>
                                <p>No pending tasks</p>
                                <p className="text-sm">Add a task above to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingTasks.map(task => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task)}
                                        className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500 cursor-move hover:shadow-md transition-shadow duration-200 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium flex-1">{task.text}</span>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => toggleTask(task.id)}
                                                    className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                                                    title="Mark as complete"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            Created: {new Date(task.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Completed Tasks */}
                <div
                    className="bg-white rounded-lg shadow-md overflow-hidden h-fit"
                    onDragOver={handleDragOver}
                    onDrop={handleDropToCompleted}
                >
                    <div className="bg-green-500 text-white p-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                            Completed Tasks ({completedTasks.length})
                        </h2>
                    </div>
                    <div className="p-4 min-h-96">
                        {completedTasks.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                <div className="text-4xl mb-4">✅</div>
                                <p>No completed tasks</p>
                                <p className="text-sm">Drag tasks here when completed!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {completedTasks.map(task => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task)}
                                        className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500 cursor-move hover:shadow-md transition-shadow duration-200 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium line-through flex-1 opacity-75">{task.text}</span>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => toggleTask(task.id)}
                                                    className="text-yellow-600 hover:text-yellow-700 p-1 rounded transition-colors"
                                                    title="Move back to pending"
                                                >
                                                    <X size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            Created: {new Date(task.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                        <div className="text-sm text-gray-600">Total Tasks</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{pendingTasks.length}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoApp;