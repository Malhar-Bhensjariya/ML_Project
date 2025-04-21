import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AssignMentees = ({ courseId, closeDropdown }) => {
    const { user } = useUser();
    const [mentees, setMentees] = useState([]);
    const [selectedMentees, setSelectedMentees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dueDate, setDueDate] = useState(null);  // Using Date object for DatePicker
    const [hasDueDate, setHasDueDate] = useState(false);
    const NODE_API = import.meta.env.VITE_NODE_API;

    useEffect(() => {
        if(user?._id)
        {
        const fetchMentees = async () => {
            try {
                const response = await fetch(`${NODE_API}/users/mentees/${user?._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch mentees');
                const data = await response.json();
                setMentees(Array.isArray(data.mentees) ? data.mentees : []);
            } catch (error) {
                console.error('Error fetching mentees:', error);
                setMentees([]);
            }
        };


        const checkDueDate = async () => {
            try {
                const response = await fetch(`${NODE_API}/assigned?orgCourseId=${courseId}`);
                if (!response.ok) throw new Error('Failed to check assigned course');

                const data = await response.json();
                const assignedCourse = data.find(ac => ac.orgCourseId._id === courseId);

                if (assignedCourse?.dueDate) {
                    setHasDueDate(true);
                    setDueDate(new Date(assignedCourse.dueDate)); // Set Date object
                }
            } catch (error) {
                console.error('Error checking due date:', error);
            }
        };

        fetchMentees();
        checkDueDate();
}}, [user._id, user.token, courseId]);

    const handleCheckboxChange = (menteeId) => {
        setSelectedMentees(prev =>
            prev.includes(menteeId) ? prev.filter(id => id !== menteeId) : [...prev, menteeId]
        );
    };

    const selectAllMentees = () => {
        if (selectedMentees.length === mentees.length) {
            setSelectedMentees([]);
        } else {
            setSelectedMentees(mentees.map(m => m._id));
        }
    };

    const getAssignedCourseId = async () => {
        try {
            const response = await fetch(`${NODE_API}/assigned?orgCourseId=${courseId}`);
            if (!response.ok) throw new Error('Failed to fetch assignedCourseId');

            const data = await response.json();
            const assignedCourse = data.find(ac => ac.orgCourseId._id === courseId);
            return assignedCourse?._id;
        } catch (error) {
            console.error('Error fetching assignedCourseId:', error);
            return null;
        }
    };

    const assignMentees = async () => {
        if (selectedMentees.length === 0) return;

        setLoading(true);
        try {
            const assignedCourseId = await getAssignedCourseId();
            if (!assignedCourseId) {
                alert('No assigned course found for this course.');
                return;
            }

            for (const menteeId of selectedMentees) {
                const response = await fetch(`${NODE_API}/assigned/${assignedCourseId}/addMentee`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ menteeId, orgCourseId: courseId })
                });

                if (!response.ok) throw new Error(`Failed to assign mentee ${menteeId}`);
            }

            if (!hasDueDate && dueDate) {
                await fetch(`${NODE_API}/assigned/${assignedCourseId}/setDueDate`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ dueDate: dueDate.toISOString() })
                });
            }

            alert('Mentees assigned successfully!');
            closeDropdown();  // Close after success
        } catch (error) {
            console.error('Error assigning mentees:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute left-0 mt-2 bg-white border border-red-500 rounded-lg shadow-lg w-56 p-3 z-50">
            <h4 className="text-lg font-semibold mb-2">Select Mentees</h4>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Mentees List</span>
                <button
                    type="button"
                    className="text-blue-500 text-xs"
                    onClick={selectAllMentees}
                >
                    {selectedMentees.length === mentees.length ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                {mentees.length > 0 ? (
                    mentees.map((mentee) => (
                        <label key={mentee._id} className="flex items-center space-x-2 text-gray-700 mb-1">
                            <input
                                type="checkbox"
                                value={mentee._id}
                                onChange={() => handleCheckboxChange(mentee._id)}
                                checked={selectedMentees.includes(mentee._id)}
                            />
                            <span>{mentee.name}</span>
                        </label>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No mentees found</p>
                )}
            </div>

            {!hasDueDate && (
                <div className="mt-3">
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    <DatePicker
                        selected={dueDate}
                        onChange={date => setDueDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        placeholderText="Select Due Date"
                    />
                </div>
            )}

            <button
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={assignMentees}
                disabled={loading}
            >
                {loading ? 'Assigning...' : 'Assign'}
            </button>
        </div>
    );
};

export default AssignMentees;
