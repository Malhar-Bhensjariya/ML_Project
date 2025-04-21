import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useUser } from "../../context/UserContext";

const MentorScoresChart = ({ mentorId }) => {
  const [menteeData, setMenteeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [mentor, setMentor] = useState(null);
  const [activeTab, setActiveTab] = useState("bar"); // To toggle between chart types
  const NODE_API = import.meta.env.VITE_NODE_API;

  // First useEffect to fetch mentor data
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${NODE_API}/users/mentor/${user._id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch mentor data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        if (data) {
          setMentor(data);
        }
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        setError("Failed to load mentor data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user._id) {
      fetchMentors();
    }
  }, []);

  // Second useEffect to fetch scores once mentor data is available
  useEffect(() => {
    const fetchScores = async () => {
      try {
        if (!mentor || !mentor._id) {
          return;
        }
        
        setIsLoading(true);
        const response = await fetch(`${NODE_API}/exam/mentor/${mentor._id}/scores`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch scores data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.scores) {
          setMenteeData(data.scores);
        }
      } catch (error) {
        console.error("Error fetching mentee scores:", error);
        setError("Failed to load exam scores. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
  }, [mentor]);

  // Restructure data to show tests on x-axis and group by student
  const prepareChartData = () => {
    // Using the API data if available, otherwise use static data for demonstration
    if (menteeData.length) {
      // Get unique students
      const students = [...new Set(menteeData.map(item => item.mentee?.user?.name || 'Unknown'))];
      
      // For this example, we're showing Test 1, Test 2, Test 3 on x-axis
      const labels = ["Test 1", "Test 2", "Test 3"];
      
      // Create datasets for each student
      const datasets = students.map((student, index) => {
        // Filter data for this student
        const studentData = menteeData.filter(item => (item.mentee?.user?.name || 'Unknown') === student);
        
        // Get colors based on index
        const colors = getColors(index);
        
        return {
          label: student,
          data: labels.map((_, i) => studentData[i]?.score || 0),
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: colors.hoverBackground,
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        };
      });
      
      return { labels, datasets };
    } else {
      // Static demo data for UI preview
      return {
        labels: ["Test 1", "Test 2", "Test 3"],
        datasets: [
          {
            label: "Alex Johnson",
            data: [85, 92, 78],
            backgroundColor: 'rgba(99, 102, 241, 0.85)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
            barPercentage: 0.8,
            categoryPercentage: 0.8,
          },
          {
            label: "Maya Rodriguez",
            data: [76, 88, 94],
            backgroundColor: 'rgba(244, 114, 182, 0.85)',
            borderColor: 'rgba(244, 114, 182, 1)',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(244, 114, 182, 1)',
            barPercentage: 0.8,
            categoryPercentage: 0.8,
          },
          {
            label: "Sam Taylor",
            data: [92, 65, 83],
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
            barPercentage: 0.8,
            categoryPercentage: 0.8,
          }
        ]
      };
    }
  };
  
  // Generate modern colors for each student
  const getColors = (index) => {
    const colorSchemes = [
      { background: 'rgba(99, 102, 241, 0.85)', border: 'rgba(99, 102, 241, 1)', hoverBackground: 'rgba(99, 102, 241, 1)' }, // Indigo
      { background: 'rgba(244, 114, 182, 0.85)', border: 'rgba(244, 114, 182, 1)', hoverBackground: 'rgba(244, 114, 182, 1)' }, // Pink
      { background: 'rgba(16, 185, 129, 0.85)', border: 'rgba(16, 185, 129, 1)', hoverBackground: 'rgba(16, 185, 129, 1)' }, // Emerald
      { background: 'rgba(245, 158, 11, 0.85)', border: 'rgba(245, 158, 11, 1)', hoverBackground: 'rgba(245, 158, 11, 1)' }, // Amber
      { background: 'rgba(139, 92, 246, 0.85)', border: 'rgba(139, 92, 246, 1)', hoverBackground: 'rgba(139, 92, 246, 1)' }, // Violet
      { background: 'rgba(6, 182, 212, 0.85)', border: 'rgba(6, 182, 212, 1)', hoverBackground: 'rgba(6, 182, 212, 1)' }, // Cyan
    ];
    
    return colorSchemes[index % colorSchemes.length];
  };

  // Define chart options for better styling
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '500'
          },
          usePointStyle: true,
          padding: 20,
          color: '#f9fafb'
        },
        title: {
          display: false
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 15,
          weight: '600'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: '400'
        },
        padding: 16,
        cornerRadius: 12,
        displayColors: true,
        usePointStyle: true,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        callbacks: {
          title: function(tooltipItems) {
            return `${tooltipItems[0].label}`;
          },
          label: function(context) {
            return `  ${context.dataset.label}: ${context.formattedValue} points`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: '500'
          },
          color: '#e2e8f0'
        },
        title: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '400'
          },
          color: '#cbd5e1',
          padding: 10,
          callback: function(value) {
            return value + ' pts';
          }
        },
        title: {
          display: false
        }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    layout: {
      padding: {
        left: 15,
        right: 15,
        top: 20,
        bottom: 15
      }
    }
  };

  const chartData = prepareChartData();

  // Render loading state
  if (isLoading && !menteeData.length) {
    return (
      <div className="relative flex items-center justify-center w-full h-96 bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-xy"></div>
        <div className="relative z-10 text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-slate-200">Loading your insights...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="relative p-8 bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-red-500/20 to-orange-500/20"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-rose-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
          </div>
          <p className="text-slate-300">{error}</p>
          <button className="px-6 py-3 mt-6 font-medium text-white transition-all bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl hover:shadow-lg hover:from-rose-600 hover:to-pink-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
      
      {/* Top Section with Title and Tabs */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between px-8 pt-8 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Performance Analytics
          </h2>
          <p className="mt-1 text-slate-300">Track your mentees' progress across different tests</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0 bg-slate-800/50 rounded-xl p-1">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'bar' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
            onClick={() => setActiveTab('bar')}
          >
            Bar Chart
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'line' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
            onClick={() => setActiveTab('line')}
          >
            Line Chart
          </button>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="relative z-10 p-6">
        {chartData ? (
          <div className="h-96 p-6 bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-inner border border-slate-700/50">
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50">
            <svg 
              className="w-20 h-20 text-slate-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 text-xl font-medium text-white">No exam data available yet</p>
            <p className="mt-2 text-slate-400">Exam results will appear here once your mentees complete their tests</p>
          </div>
        )}
      </div>
      
      {/* Bottom Stats Section */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        <div className="p-4 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-400">Total Mentees</p>
              <p className="text-xl font-bold text-white">3</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-400">Tests Completed</p>
              <p className="text-xl font-bold text-white">9</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-400">Highest Score</p>
              <p className="text-xl font-bold text-white">94</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50">
          <div className="flex items-center">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-400">Average Score</p>
              <p className="text-xl font-bold text-white">83.6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorScoresChart;