import React from 'react';
import { motion } from 'framer-motion';
import { X, Edit2 } from 'lucide-react';

const ActivityCard = ({ data, onDelete, onChange, type }) => {
    const renderFields = () => {
        switch (type) {
            case 'extracurricular':
                return (
                    <>
                        <input
                            type="text"
                            value={data.activity}
                            onChange={(e) => onChange({ ...data, activity: e.target.value })}
                            className="modal-input p-2 rounded-lg w-full"
                            placeholder="Activity Name"
                        />
                        <input
                            type="text"
                            value={data.role}
                            onChange={(e) => onChange({ ...data, role: e.target.value })}
                            className="modal-input p-2 rounded-lg w-full"
                            placeholder="Your Role"
                        />
                        <input
                            type="text"
                            value={data.duration}
                            onChange={(e) => onChange({ ...data, duration: e.target.value })}
                            className="modal-input p-2 rounded-lg w-1/2"
                            placeholder="Duration (e.g., 2 years)"
                        />
                        <textarea
                            value={data.description}
                            onChange={(e) => onChange({ ...data, description: e.target.value })}
                            className="modal-input p-2 rounded-lg w-full"
                            placeholder="Describe your involvement..."
                            rows="2"
                        />
                    </>
                );

            case 'internship':
                return (
                    <>
                        <input
                            type="text"
                            value={data.company}
                            onChange={(e) => onChange({ ...data, company: e.target.value })}
                            className="modal-input p-2 rounded-lg w-full"
                            placeholder="Company Name"
                        />
                        <input
                            type="text"
                            value={data.role}
                            onChange={(e) => onChange({ ...data, role: e.target.value })}
                            className="modal-input p-2 rounded-lg w-full"
                            placeholder="Your Role"
                        />
                        <input
                            type="text"
                            value={data.duration}
                            onChange={(e) => onChange({ ...data, duration: e.target.value })}
                            className="modal-input p-2 rounded-lg w-1/2"
                            placeholder="Duration (e.g., 3 months)"
                        />
                        <textarea
                            value={data.description}
                            onChange={(e) => onChange({ ...data, description: e.target.value })}
                            className="modal-input p-2 rounded-lg w-full"
                            placeholder="Describe your work and achievements..."
                            rows="2"
                        />
                    </>
                );

            case 'achievement':
                return (
                    <>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => onChange({ ...data, title: e.target.value })}
                            className="modal-input p-2 rounded-lg w-full"
                            placeholder="Achievement Title"
                        />
                        <input
                            type="number"
                            value={data.year}
                            onChange={(e) => onChange({ ...data, year: e.target.value })}
                            className="modal-input p-2 rounded-lg w-1/3"
                            placeholder="Year"
                        />
                        <textarea
                            value={data.description}
                            onChange={(e) => onChange({ ...data, description: e.target.value })}
                            className="modal-input p-2 rounded-lg w-full"
                            placeholder="Describe your achievement..."
                            rows="2"
                        />
                    </>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-4 rounded-xl space-y-3 relative"
        >
            <button
                onClick={onDelete}
                className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"
            >
                <X size={18} />
            </button>
            {renderFields()}
        </motion.div>
    );
};

export default ActivityCard;
