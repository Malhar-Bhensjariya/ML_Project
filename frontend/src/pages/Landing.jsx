import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';

import Lottie from 'lottie-react';
import animationData from '../assets/landing_mockup.json';
import mentor1 from '../assets/img/mentor1.avif';
import mentor2 from '../assets/img/mentor2.avif';
import mentor3 from '../assets/img/mentor3.avif';

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const [expandedCard, setExpandedCard] = useState(null);

  // Cards data to make component more maintainable
  const cards = [
    {
      id: 1,
      title: "Expert Mentorship",
      content: "Connect with experienced mentors who guide you through your learning journey with personalized feedback.",
      icon: "👨‍🏫"
    },
    {
      id: 2,
      title: "Interactive Courses",
      content: "Access hands-on courses designed to help you master new skills with practical exercises.",
      icon: "🎓"
    },
    {
      id: 3,
      title: "Real-World Projects",
      content: "Work on projects that simulate real-world challenges and build your portfolio to showcase to employers.",
      icon: "🚀"
    }
  ];

  // Background variants for the main container
  const backgroundVariants = {
    initial: {
      background: "linear-gradient(135deg, #f5f7ff 0%, #e9eeff 100%)"
    },
    animate: {
      background: "linear-gradient(135deg, #f0f4ff 0%, #e0e8ff 100%)",
      transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
    }
  };

  // Title animations with text reveal effect
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  const titleText = "Your Complete Learning Ecosystem";

  // For the draggable cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }),
    expanded: {
      scale: 1.05,
      zIndex: 10,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex overflow-auto scrollbar-hide flex-col items-center">
      {/* Navbar */}
      <nav className="w-full max-w-7xl flex justify-between items-center p-4 rounded-lg mt-3">
        <div className="text-xl md:text-2xl font-bold text-indigo-900">AthenaAI</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-indigo-900 hover:bg-indigo-50 rounded-lg transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden w-full max-w-7xl absolute top-16 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg z-50"
        >
          <div className="flex flex-col p-4">
            <Link
              to="/login"
              className="px-4 py-3 text-indigo-900 hover:bg-indigo-50 rounded-lg transition duration-300 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="mt-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}

      {/* Hero Section - Using your content with image layout */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-6 mt-16 md:mt-24"
      >
        <div className="md:w-1/2 text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900 mb-6 leading-tight">
            Unlock Your Potential with Personalized Learning
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Join EduMentor to access expert mentorship, interactive courses, and real-world projects tailored to your goals.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            variants={staggerContainer}
          >
            <Link
              to="/register"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign Up for Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-300 text-lg font-medium"
            >
              Login
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="md:w-1/2 mt-8 md:mt-0 flex justify-center"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative">
            <div className="h-[24rem] rounded-2xl relative flex items-center justify-center">
              <Lottie
                animationData={animationData}
                loop
                autoplay
                style={{ height: '100%', width: '100%' }}
              />
            </div>
            {/* <div className="absolute -top-4 -right-4 bg-indigo-100 rounded-lg p-2 shadow-md">
              <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded">AI-Driven Mentor</div>
            </div> */}
          </div>
        </motion.div>
      </motion.div>

      {/* Main Features with AI Boost Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="w-full max-w-7xl px-6 py-20"
      >
        <motion.h2
          variants={fadeIn}
          className="text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-12"
        >
          Advanced AI and design boost your learning experience
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div
            variants={fadeIn}
            className="md:col-span-4 bg-white p-6 rounded-xl shadow-lg"
          >
            <div className='flex justify-start items-center'>
              <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-indigo-900 ml-3 mb-3">Expert Mentorship</h3>
            </div>
            <p className="text-gray-600">
              Connect with experienced mentors who guide you through your learning journey with personalized feedback.
            </p>
            <div className="flex -space-x-2 mt-4">
              <img src={mentor1} className="w-12 h-12 rounded-full border-2 border-white" alt="user" />
              <img src={mentor2} className="w-12 h-12 rounded-full border-2 border-white" alt="user" />
              <img src={mentor3} className="w-12 h-12 rounded-full border-2 border-white" alt="user" />
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="md:col-span-8 bg-indigo-600 p-6 rounded-xl shadow-lg text-white"
          >
            <h3 className="text-xl font-semibold mb-3">Interactive Courses</h3>
            <p className="mb-4">
              Access hands-on courses designed to help you master new skills with practical exercises.
            </p>
            <div className="bg-indigo-800 bg-opacity-50 rounded-xl p-4">
              <p className="font-medium">AI made courses available</p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="md:col-span-6 bg-blue-600 p-6 rounded-xl shadow-lg text-white"
          >
            <h3 className="text-xl font-semibold mb-3">Real-World Projects</h3>
            <p className="mb-4">
              Work on projects that simulate real-world challenges and build your portfolio to showcase to employers.
            </p>
            <div className="bg-blue-800 bg-opacity-50 rounded-xl p-4">
              <p className="font-medium">project based learning recommendations</p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="md:col-span-6 grid grid-cols-2 gap-4"
          >
            <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center">
              <div className="text-2xl font-bold text-indigo-900">90%</div>
              <p className="text-sm text-gray-600 text-center">Course Completion Rate</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center">
              <div className="text-2xl font-bold text-indigo-900">10+</div>
              <p className="text-sm text-gray-600 text-center">internship Listing</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center">
              <div className="text-2xl font-bold text-indigo-900">2X</div>
              <p className="text-sm text-gray-600 text-center">Career Growth</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center">
              <div className="text-2xl font-bold text-indigo-900">24/7</div>
              <p className="text-sm text-gray-600 text-center">Learning Support</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Comprehensive Features Section */}
      {/* <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="w-full max-w-7xl px-6 py-16 bg-white rounded-xl shadow-lg my-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-8">
          Experience Comprehensive Learning with Our Diverse Features
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Enhance your productivity with automation and powerful tools that transform your learning from concepts to results
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span>Automatically search & analyze information</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span>High-performance search recommendations</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <span>Multiple language choices for translation</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img src="/api/placeholder/450/300" alt="Feature showcase" className="rounded-xl shadow-md" />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">Automatically record & transcribe conversations</h3>
            <p className="text-gray-600 mb-6">
              Focus on the discussion while our AI takes notes for you. All your sessions are automatically transcribed with added time markers and summarizations.
            </p>
            <Link to="/features" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 inline-block">
              Learn More
            </Link>
          </div>
        </div>
      </motion.div> */}

      <div className="w-full overflow-visible">
        <motion.div
          className="mb-16 mx-auto w-full max-w-7xl px-4 py-10 rounded-2xl overflow-visible"
          // initial={{ background: "linear-gradient(135deg, #f5f7ff 0%, #e9eeff 100%)" }}
          animate={{
            // background: "linear-gradient(135deg, #f0f4ff 0%, #e0e8ff 100%)",
            transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
          }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-indigo-900 text-center mb-12"
            variants={titleVariants}
            initial="visible"
            animate="visible"
          >
            {titleText.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                initial="initial"
                animate="visible"
                className="inline-block my-4"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-visible">
            {cards.map((card, index) => {
              const x = useMotionValue(0);
              const y = useMotionValue(0);
              const rotateY = useTransform(x, [-100, 100], [-15, 15]);
              const rotateX = useTransform(y, [-100, 100], [15, -15]);

              return (
                <motion.div
                  key={card.id}
                  className={`bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 relative cursor-grab active:cursor-grabbing ${expandedCard === card.id ? "z-10" : ""}`}
                  style={{
                    borderRadius: "16px",
                    x, y, rotateX, rotateY,
                    boxShadow: "0 10px 30px -5px rgba(79, 70, 229, 0.2)",
                    perspective: "1000px",
                    opacity: 1 // Force opacity to always be 1
                  }}
                  initial={{ scale: 0.95 }}
                  animate={{
                    scale: expandedCard === card.id ? 1.05 : 1,
                    transition: { type: "spring", stiffness: 200, damping: 20 }
                  }}
                  drag
                  dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                  dragElastic={0.2}
                  whileTap={{ cursor: "grabbing" }}
                  onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                    {card.icon}
                  </div>

                  <div className="h-full">
                    <h3 className="text-xl font-semibold text-indigo-900 mb-4 mt-2">{card.title}</h3>
                    <p className="text-gray-600">
                      {card.content}
                    </p>

                    <motion.div
                      className="mt-6 pt-4 border-t border-indigo-100"
                      animate={{
                        height: expandedCard === card.id ? "auto" : 0,
                        opacity: expandedCard === card.id ? 1 : 0
                      }}
                      style={{ overflow: "hidden" }}
                    >
                    </motion.div>

                    <div className="w-full h-1 bg-indigo-200 rounded-full mt-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-indigo-600 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="mt-12 flex justify-center items-center"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-indigo-700 text-center font-medium max-w-md">
              Drag the cards to interact with them
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Key Metrics Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="w-full bg-indigo-900 py-16"
      >
        <div className="max-w-7xl mx-auto px-6 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            Maximize Productivity with the Benefits of AthenaAI
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
            <div className="transform transition-all duration-300 hover:scale-105">
              <p className="text-lg">Time Saved on Learning</p>
              <p className="text-sm text-indigo-200 mt-2">Reduce research time and accelerate knowledge acquisition with our AI-powered learning tools</p>
            </div>
            <div className="transform transition-all duration-300 hover:scale-105">
              <p className="text-lg">Mentorship Connections</p>
              <p className="text-sm text-indigo-200 mt-2">Access our growing network of industry experts ready to provide personalized guidance</p>
            </div>
            <div className="transform transition-all duration-300 hover:scale-105">
              <p className="text-lg">Efficient Note Taking</p>
              <p className="text-sm text-indigo-200 mt-2">Capture and organize information five times faster than traditional methods</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-indigo-800 p-6 rounded-xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden group">
              <div className='flex items-center justify-between relative z-10'>
                <h3 className="text-2xl font-semibold mb-4 transition-colors duration-700 ease-in-out group-hover:text-indigo-800">High Accuracy</h3>
                <div className="bg-white rounded-full p-4 flex justify-center mb-4 transition-all duration-700 ease-in-out group-hover:bg-indigo-100 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="card-animation absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-white opacity-100 scale-100 group-hover:scale-[25] transition-all duration-700 ease-in-out -z-10"></div>
                </div>
              </div>
              <p className="text-indigo-100 transition-colors duration-700 ease-in-out group-hover:text-indigo-800 relative z-10">Our advanced algorithms ensure precision in content summarization and information extraction, delivering trustworthy insights you can rely on.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-indigo-800 p-6 rounded-xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden group">
              <div className='flex items-center justify-between relative z-10'>
                <h3 className="text-2xl font-semibold mb-4 transition-colors duration-700 ease-in-out group-hover:text-indigo-800">Real-Time Highlights</h3>
                <div className="bg-white rounded-full p-4 flex justify-center mb-4 transition-all duration-700 ease-in-out group-hover:bg-indigo-100 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <div className="card-animation absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-white opacity-100 scale-100 group-hover:scale-[25] transition-all duration-700 ease-in-out -z-10"></div>
                </div>
              </div>
              <p className="text-indigo-100 transition-colors duration-700 ease-in-out group-hover:text-indigo-800 relative z-10">Instantly identify key concepts and critical information as you learn, with smart highlighting that adapts to your unique learning objectives.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-indigo-800 p-6 rounded-xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden group">
              <div className='flex items-center justify-between relative z-10'>
                <h3 className="text-2xl font-semibold mb-4 transition-colors duration-700 ease-in-out group-hover:text-indigo-800">Effortless Note Taking</h3>
                <div className="bg-white rounded-full p-4 flex justify-center mb-4 transition-all duration-700 ease-in-out group-hover:bg-indigo-100 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <div className="card-animation absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-white opacity-100 scale-100 group-hover:scale-[25] transition-all duration-700 ease-in-out -z-10"></div>
                </div>
              </div>
              <p className="text-indigo-100 transition-colors duration-700 ease-in-out group-hover:text-indigo-800 relative z-10">Transform your learning experience with automated, intelligent note generation that captures essential information while you focus on understanding concepts.</p>
            </div>
          </div>
        </div>

        <style jsx>{`
    .card-animation {
      transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
    }
  `}</style>
      </motion.div>

      {/* Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="w-full max-w-7xl px-6 py-16"
      >
        <motion.h2
          variants={fadeIn}
          className="text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-4"
        >
          Tailored For Your Role
        </motion.h2>
        <motion.p
          variants={fadeIn}
          className="text-center text-gray-600 mb-12"
        >
          All roles come with core platform features. Access tools tailored to your role for the best learning experience.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            variants={fadeIn}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="text-xl font-bold text-indigo-900 mb-2">For Students</div>
            <p className="text-gray-600 mb-6">Perfect for individuals just getting started with their learning</p>
            {/* <div className="mb-6">
              <span className="text-3xl font-bold text-indigo-900">$15</span>
              <span className="text-gray-600"> per month</span>
            </div> */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Personalized learning dashboard</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>AI project recommendations based on your skills</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Book one-on-one consultations with mentors</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Track your progress across all courses</span>
              </li>
            </ul>
            <Link to="/register" className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 text-center block">
              Join as a Student
            </Link>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="text-xl font-bold text-indigo-900 mb-2">For Mentors</div>
            <p className="text-gray-600 mb-6">Designed for teaching professionals</p>
            {/* <div className="mb-6">
              <span className="text-3xl font-bold text-indigo-900">$35</span>
              <span className="text-gray-600"> per month</span>
            </div> */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Create and publish your own courses</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Schedule and manage consultation sessions</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Create assessments and monitor student progress</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Create assessments and monitor student progress</span>
              </li>
            </ul>
            <Link to="/register" className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-center block">
              Join as a Mentor
            </Link>
          </motion.div>
        </div>

        {/* <div className="text-center mt-8 text-gray-600">
          <p>Need help finding a plan that fits your needs?</p>
          <Link to="/contact" className="text-indigo-600 font-medium hover:underline">Contact sales</Link>
        </div> */}
      </motion.div>

      {/* Final CTA Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="w-full bg-indigo-900 py-16"
      >
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Capture every moment, idea, and insight with AI learning tools
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of students and professionals who have transformed their learning experience with EduMentor
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-indigo-900 rounded-lg hover:bg-gray-100 transition duration-300 text-lg font-medium"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold text-indigo-900 mb-4">AthenaAI</div>
              <p className="text-gray-600 mb-4">Transforming education through AI-powered personalized learning experiences.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-indigo-900">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-indigo-900">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-indigo-900">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-600 hover:text-indigo-900">Features</Link></li>
                <li><Link to="/solutions" className="text-gray-600 hover:text-indigo-900">Solutions</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-indigo-900">Pricing</Link></li>
                <li><Link to="/customers" className="text-gray-600 hover:text-indigo-900">Customers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-600 hover:text-indigo-900">Blog</Link></li>
                <li><Link to="/documentation" className="text-gray-600 hover:text-indigo-900">Documentation</Link></li>
                <li><Link to="/guides" className="text-gray-600 hover:text-indigo-900">Guides</Link></li>
                <li><Link to="/webinars" className="text-gray-600 hover:text-indigo-900">Webinars</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-indigo-900">About</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-indigo-900">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-indigo-900">Contact</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-indigo-900">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© {new Date().getFullYear()} AthenaAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;