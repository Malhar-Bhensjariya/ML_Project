import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ children, className = "", category }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`bg-white/70 backdrop-blur-lg border border-white/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${className} relative overflow-hidden`}
    >
      {children}
    </motion.div>
  );
};

export default DashboardCard;
