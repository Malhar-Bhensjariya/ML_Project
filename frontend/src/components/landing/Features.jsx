import React, { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import feature1 from "../../assets/img/feature1.png";
import feature2 from "../../assets/img/feature2.png";
import feature3 from "../../assets/img/feature3.png";
import feature4 from "../../assets/img/feature4.png";
import feature5 from "../../assets/img/feature5.png";
import feature6 from "../../assets/img/feature6.png";

const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => setTransformStyle("");

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

const BentoCard = ({ src, title, description, isComingSoon }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setCursorPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <div className="relative size-full">
      <img src={src} className="absolute left-0 top-0 size-full object-cover object-center" alt="feature" />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50 bg-black/40">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHoverOpacity(1)}
            onMouseLeave={() => setHoverOpacity(0)}
            className="relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">Coming Soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => (
  <section className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-blue-50">
          In a world overflowing with information, Edify AI stands
        </p>
        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          Our platform is built to simplify your learning journey, offering tailored courses, real-time community interactions, and tools to help you build skills, secure opportunities, and thrive.
        </p>
      </div>

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard src={feature4} title="Immersive Virtual Classrooms" description="Revolutionizes online education with an immersive, collaborative environment." isComingSoon />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt><BentoCard src={feature5} title="Mock Interviews & Resume Builder" description="Ace interviews with AI-driven mock interviews and an ATS-friendly resume builder." isComingSoon /></BentoTilt>
        <BentoTilt><BentoCard src={feature3} title="AI-Powered Assistance" description="Get instant, accurate answers from our custom chatbot trained on course content." isComingSoon /></BentoTilt>
        <BentoTilt><BentoCard src={feature2} title="Interactive Community Forums" description="Connect, share ideas, and collaborate on projects with learners worldwide." isComingSoon /></BentoTilt>
        <BentoTilt><BentoCard src={feature1} title="Personalized Roadmaps" description="Generate comprehensive learning pathways designed for your career aspirations." isComingSoon /></BentoTilt>
        <BentoTilt><BentoCard src={feature6} title="Hackathons & Internships" description="Find hackathons, meetups, and internships tailored to your skills and interests." isComingSoon /></BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
