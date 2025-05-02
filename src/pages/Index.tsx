
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// All-in-one Habit Tracker App

// Mock data for the application
const initialHabits = [
  {
    id: 1,
    name: 'Sleep',
    icon: '🌙',
    color: 'bg-blue-500',
    unit: 'hours',
    goal: 8,
    current: 7,
    streakDays: 5,
    weekData: [
      { day: 'Mon', value: 7.5 },
      { day: 'Tue', value: 6.8 },
      { day: 'Wed', value: 8.2 },
      { day: 'Thu', value: 7.0 },
      { day: 'Fri', value: 8.0 },
      { day: 'Sat', value: 9.5 },
      { day: 'Sun', value: 7.0 }
    ]
  },
  {
    id: 2,
    name: 'Water',
    icon: '💧',
    color: 'bg-teal-500',
    unit: 'glasses',
    goal: 8,
    current: 5,
    streakDays: 3,
    weekData: [
      { day: 'Mon', value: 6 },
      { day: 'Tue', value: 8 },
      { day: 'Wed', value: 7 },
      { day: 'Thu', value: 5 },
      { day: 'Fri', value: 5 },
      { day: 'Sat', value: 4 },
      { day: 'Sun', value: 5 }
    ]
  },
  {
    id: 3,
    name: 'Exercise',
    icon: '🏃',
    color: 'bg-amber-500',
    unit: 'minutes',
    goal: 30,
    current: 20,
    streakDays: 2,
    weekData: [
      { day: 'Mon', value: 30 },
      { day: 'Tue', value: 0 },
      { day: 'Wed', value: 45 },
      { day: 'Thu', value: 20 },
      { day: 'Fri', value: 20 },
      { day: 'Sat', value: 60 },
      { day: 'Sun', value: 0 }
    ]
  },
  {
    id: 4,
    name: 'Screen Time',
    icon: '📱',
    color: 'bg-violet-500',
    unit: 'hours',
    goal: 2,
    current: 3.5,
    streakDays: 0,
    weekData: [
      { day: 'Mon', value: 2.5 },
      { day: 'Tue', value: 3.0 },
      { day: 'Wed', value: 1.8 },
      { day: 'Thu', value: 4.2 },
      { day: 'Fri', value: 3.5 },
      { day: 'Sat', value: 5.0 },
      { day: 'Sun', value: 3.5 }
    ]
  }
];

// Custom hook for window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return windowSize;
};

// Custom Progress Bar Component
const ProgressBar = ({ value, max, color }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="progress-bar mt-2">
      <motion.div 
        className={`progress-value ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percentage, 100)}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

// StreakIndicator Component
const StreakIndicator = ({ days }) => {
  return (
    <div className="flex items-center mt-1">
      <span className="text-xs text-gray-500 mr-2">Streak:</span>
      <div className="flex space-x-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div 
            key={i}
            className={`streak-dot ${i < days ? 'bg-green-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {days > 0 && (
        <motion.span 
          className="ml-2 text-xs font-medium text-green-600"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {days} day{days !== 1 ? 's' : ''}
        </motion.span>
      )}
    </div>
  );
};

// HabitCard Component
const HabitCard = ({ habit, onUpdate, onViewDetail }) => {
  return (
    <motion.div 
      className="habit-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className={`habit-icon mr-3 ${habit.color}`}>
            <span className="text-lg">{habit.icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{habit.name}</h3>
            <p className="text-sm text-gray-500">
              Goal: {habit.goal} {habit.unit}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onViewDetail(habit)}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Details
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Current: {habit.current} {habit.unit}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.min(Math.round((habit.current / habit.goal) * 100), 100)}%
          </span>
        </div>
        <ProgressBar 
          value={habit.current} 
          max={habit.goal} 
          color={habit.color}
        />
      </div>
      
      <StreakIndicator days={habit.streakDays} />
      
      <div className="mt-4">
        <label className="text-sm text-gray-700 block mb-1">
          Update today's value:
        </label>
        <input
          type="range"
          min="0"
          max={habit.goal * 2}
          value={habit.current}
          step={habit.unit === 'minutes' ? 5 : 0.5}
          className="input-slider"
          onChange={(e) => onUpdate(habit.id, parseFloat(e.target.value))}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0</span>
          <span className="text-xs text-gray-500">{habit.goal * 2}</span>
        </div>
      </div>
    </motion.div>
  );
};

// DetailModal Component
const DetailModal = ({ habit, onClose }) => {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-2xl p-5 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`habit-icon mr-3 ${habit.color}`}>
              <span className="text-xl">{habit.icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{habit.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Weekly Progress</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={habit.weekData}
                    margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 'dataMax + 2']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={habit.color === 'bg-blue-500' ? '#0EA5E9' : 
                              habit.color === 'bg-teal-500' ? '#14B8A6' :
                              habit.color === 'bg-amber-500' ? '#F59E0B' :
                              '#8B5CF6'}
                      strokeWidth={3}
                      dot={{ fill: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <CartesianGrid stroke="#f5f5f5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Progress vs Goal</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={habit.weekData.map(item => ({
                      ...item,
                      goal: habit.goal
                    }))}
                    margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, Math.max(habit.goal * 1.5, ...habit.weekData.map(d => d.value))]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      name="Actual" 
                      dataKey="value" 
                      fill={habit.color === 'bg-blue-500' ? '#0EA5E9' : 
                            habit.color === 'bg-teal-500' ? '#14B8A6' :
                            habit.color === 'bg-amber-500' ? '#F59E0B' :
                            '#8B5CF6'} 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      name="Goal" 
                      dataKey="goal" 
                      fill="#E5E7EB" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Habit Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="stat-label">Current Streak</p>
              <p className="stat-value text-green-600">{habit.streakDays} days</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="stat-label">Daily Goal</p>
              <p className="stat-value">
                {habit.goal} {habit.unit}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="stat-label">Weekly Average</p>
              <p className="stat-value">
                {(habit.weekData.reduce((sum, day) => sum + day.value, 0) / 7).toFixed(1)} {habit.unit}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// AddHabitModal Component
const AddHabitModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💧');
  const [color, setColor] = useState('bg-blue-500');
  const [unit, setUnit] = useState('');
  const [goal, setGoal] = useState('');
  
  const iconOptions = ['💧', '🏃', '🌙', '📱', '📚', '🧘', '🥗', '💊', '🚰', '🧠'];
  const colorOptions = [
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Teal', value: 'bg-teal-500' },
    { name: 'Amber', value: 'bg-amber-500' },
    { name: 'Violet', value: 'bg-violet-500' },
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !unit || !goal) {
      return;
    }
    
    const newHabit = {
      id: Date.now(),
      name,
      icon,
      color,
      unit,
      goal: parseFloat(goal),
      current: 0,
      streakDays: 0,
      weekData: [
        { day: 'Mon', value: 0 },
        { day: 'Tue', value: 0 },
        { day: 'Wed', value: 0 },
        { day: 'Thu', value: 0 },
        { day: 'Fri', value: 0 },
        { day: 'Sat', value: 0 },
        { day: 'Sun', value: 0 }
      ]
    };
    
    onAdd(newHabit);
    onClose();
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Habit</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Drink Water"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIcon(option)}
                  className={`w-full aspect-square flex items-center justify-center text-xl rounded-lg border ${
                    icon === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`px-3 py-2 rounded-lg ${
                    color === option.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  } ${option.value} text-white text-sm`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., glasses"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Goal
              </label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 8"
                step="0.1"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Habit
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// SettingsModal Component
const SettingsModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [weeklyReports, setWeeklyReports] = useState(true);
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Daily Reminders</h3>
              <p className="text-sm text-gray-500">Receive notifications for your habits</p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                notifications ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onClick={() => setNotifications(!notifications)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Time
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Weekly Reports</h3>
              <p className="text-sm text-gray-500">Receive weekly summary emails</p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                weeklyReports ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onClick={() => setWeeklyReports(!weeklyReports)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  weeklyReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Data Management</h3>
            <div className="flex space-x-3">
              <button
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => {
                  alert("Data export feature will be available soon!");
                }}
              >
                Export Data
              </button>
              <button
                className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                onClick={() => {
                  if (confirm("Are you sure you want to clear all habit data? This cannot be undone.")) {
                    alert("Data cleared successfully!");
                    onClose();
                  }
                }}
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              alert("Settings saved!");
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Stats Section Component
const StatsSection = ({ habits }) => {
  const completedToday = habits.filter(h => h.current >= h.goal).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
  
  // Get the top performing habit
  let topHabit = null;
  if (habits.length > 0) {
    topHabit = habits.reduce((best, current) => {
      return current.streakDays > best.streakDays ? current : best;
    }, habits[0]);
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <motion.div 
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Today's Progress</h3>
        <div className="flex items-end space-x-2">
          <span className="text-3xl font-bold text-blue-500">{completedToday}</span>
          <span className="text-gray-500">/ {totalHabits} habits</span>
        </div>
        <div className="mt-3">
          <div className="h-2 bg-gray-100 rounded-full">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">0%</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Weekly Average</h3>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-teal-500">
            {habits.length > 0 ? 
              Math.round((habits.reduce((sum, habit) => {
                return sum + habit.weekData.filter(d => d.value >= habit.goal).length;
              }, 0) / (habits.length * 7)) * 100) : 0}%
          </span>
          <span className="text-sm text-gray-500">completion rate</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Top Streak</h3>
        {topHabit ? (
          <div className="flex items-center">
            <div className={`habit-icon mr-3 ${topHabit.color}`}>
              <span className="text-lg">{topHabit.icon}</span>
            </div>
            <div>
              <span className="text-lg font-semibold">{topHabit.name}</span>
              <div className="flex items-center">
                <span className="text-green-500 font-bold mr-1">{topHabit.streakDays}</span>
                <span className="text-sm text-gray-500">day streak</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No habits yet</p>
        )}
      </motion.div>
    </div>
  );
};

// Main Application Component
const HabitTracker = () => {
  const [habits, setHabits] = useState(initialHabits);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { width } = useWindowSize();
  const isMobile = width < 768;

  // Function to update habit value
  const handleUpdateHabit = (id, value) => {
    setHabits(habits.map(habit => 
      habit.id === id ? {
        ...habit, 
        current: value,
        // Update today's value in weekData (assuming 'Sun' is today for demo)
        weekData: habit.weekData.map(day => 
          day.day === 'Sun' ? { ...day, value } : day
        ),
        // Update streak if goal is met
        streakDays: value >= habit.goal ? habit.streakDays + 1 : 0
      } : habit
    ));
  };

  // Function to add new habit
  const handleAddHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  // Filter habits based on search query
  const filteredHabits = habits.filter(habit => 
    habit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render the navbar component
  const renderNavbar = () => (
    <motion.header 
      className="bg-white border-b border-gray-200 sticky top-0 z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              className="text-blue-500 text-2xl font-bold mr-1"
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              ⚡
            </motion.div>
            <h1 className="text-xl font-bold text-gray-800">DailyPulse</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="md:px-4 md:py-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <span className="text-lg md:mr-1">+</span>
              {!isMobile && <span>New Habit</span>}
            </button>
            
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );

  // Render the main content
  const renderContent = () => (
    <main className="container mx-auto px-4 py-6">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Your Habits</h1>
          <p className="text-gray-600">
            Track and manage your daily activities
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search habits..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </motion.div>
      
      <StatsSection habits={habits} />
      
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHabits.length > 0 ? (
            filteredHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onUpdate={handleUpdateHabit}
                onViewDetail={setSelectedHabit}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              {searchQuery ? (
                <p className="text-gray-500">No habits found matching "{searchQuery}"</p>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">You haven't added any habits yet</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Your First Habit
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );

  // Render the footer component
  const renderFooter = () => (
    <motion.footer 
      className="bg-white border-t border-gray-200 py-6 mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="text-blue-500 mr-1">⚡</span> DailyPulse
            </h2>
            <p className="text-sm text-gray-500">Track your daily habits with ease</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
              Help
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
              Terms
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} DailyPulse. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {renderNavbar()}
      {renderContent()}
      {renderFooter()}
      
      <AnimatePresence>
        {selectedHabit && (
          <DetailModal
            habit={selectedHabit}
            onClose={() => setSelectedHabit(null)}
          />
        )}
        
        {showAddModal && (
          <AddHabitModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddHabit}
          />
        )}
        
        {showSettingsModal && (
          <SettingsModal
            onClose={() => setShowSettingsModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitTracker;
