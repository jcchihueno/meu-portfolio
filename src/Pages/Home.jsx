import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Instagram,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

// Memoized Components

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
      <span className="relative inline-block whitespace-nowrap">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
          Designer &
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2 whitespace-nowrap">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent">
          Web Developer
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563eb] to-[#0891b2] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#2563eb]/20 to-[#0891b2]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon
            className={`w-4 h-4 text-gray-200 ${
              text === "Contact"
                ? "group-hover:translate-x-1"
                : "group-hover:rotate-45"
            } transform transition-all duration-300 z-10`}
          />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["Desenvolvimento Web", "Design Gráfico & Web", "Entusiasta de T.I"];
const TECH_STACK = ["React", "JavaScript", "Node.js", "Tailwind", "Adobe Illustrator", "Adobe Photoshop", "Affinity by Canva", "Figma"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/jcchihueno" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/jc-chihueno99/" },
  { icon: Instagram, link: "https://www.instagram.com/jc_chihueno/" },
];

const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [activeAnimIndex, setActiveAnimIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAnimIndex((prev) => (prev + 1) % ANIMATIONS.length);
    }, DISPLAY_DURATION);
    return () => clearInterval(interval);
  }, []);

  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener("resize", initAOS);
    return () => window.removeEventListener("resize", initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText((prev) => prev + WORDS[wordIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  // Lottie configuration
  const ANIMATIONS = [
    {
      id: "programming",
      src: "https://lottie.host/acdb49b2-b6d1-4ab6-a7ba-d5e43af646e6/qPLkrovNCx.lottie",
      scaleBase: "scale-90",
      scaleHover: "scale-95 rotate-1",
    },
    {
      id: "design",
      src: "https://lottie.host/7963e717-4931-4530-8547-daf582d1aa92/3O6tqMyz49.lottie",
      scaleBase: "scale-90",
      scaleHover: "scale-95 rotate-1",
    },
  ];

  const DISPLAY_DURATION = 8000; // cada animação fica 8 segundos visível

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden" id="Home">
      <div
        className={`relative z-10 transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-[5%] sm:px-6 lg:px-12 min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen pt-24 pb-16 lg:pt-18 lg:pb-0 md:justify-between gap-0 sm:gap-12 lg:gap-20">
            {/* Left Column */}
            <div
              className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="space-y-4 sm:space-y-6">
                <MainTitle />

                {/* Typing Effect */}
                <div
                  className="h-8 flex items-center"
                  data-aos="fade-up"
                  data-aos-delay="800"
                >
                  <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-6 bg-gradient-to-t from-[#3b82f6] to-[#06b6d4] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p
                  className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000"
                >
                  Estudante de Ciências da Computação, a desenvolver competências em código, interfaces e design através de projectos reais.
                </p>

                {/* Tech Stack */}
                <div
                  className="flex flex-wrap gap-3 justify-start"
                  data-aos="fade-up"
                  data-aos-delay="1200"
                >
                  {TECH_STACK.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div
                  className="flex flex-row gap-3 w-full justify-start"
                  data-aos="fade-up"
                  data-aos-delay="1400"
                >
                  <CTAButton
                    href="#Portofolio"
                    text="Projetos"
                    icon={ExternalLink}
                  />
                  <CTAButton href="#Contact" text="Contacto" icon={Mail} />
                </div>

                {/* Social Links */}
                <div
                  className="hidden sm:flex gap-4 justify-start"
                  data-aos="fade-up"
                  data-aos-delay="1600"
                >
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Optimized Lottie Animation */}
            <div
              className="w-full py-[10%] sm:py-0 lg:w-1/2 relative flex items-center justify-center order-2 lg:order-2 mt-8 lg:mt-0"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
              data-aos-delay="600"
            >
              <div className="relative w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[480px] xl:max-w-[600px] aspect-square mx-auto opacity-90">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#3b82f6]/10 to-[#06b6d4]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${
                    isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"
                  }`}
                ></div>

                <div
                  className={`relative z-10 w-full h-full opacity-90 transform transition-transform duration-500 overflow-hidden ${
                    isHovering ? "scale-105" : "scale-100"
                  }`}
                >
                  {ANIMATIONS.map((anim, index) => (
                    <motion.div
                      key={anim.id}
                      className="absolute inset-0 w-full h-full"
                      initial={false}
                      animate={{
                        x:
                          index === activeAnimIndex
                            ? "0%"
                            : index < activeAnimIndex
                            ? "-100%"
                            : "100%",
                        opacity: index === activeAnimIndex ? 1 : 0,
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <DotLottieReact
                        src={anim.src}
                        loop
                        autoplay
                        dotLottieRefCallback={(dotLottieInstance) => {
                          if (dotLottieInstance) {
                            dotLottieInstance.setLayout({ fit: "cover", align: [0.5, 0.5] });
                          }
                        }}
                        style={{ width: "100%", height: "100%" }}
                        className={`w-full h-full transition-all duration-500 ${
                          isHovering ? anim.scaleHover : anim.scaleBase
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>

                <div
                  className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                    isHovering ? "opacity-50" : "opacity-20"
                  }`}
                >
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${
                      isHovering ? "scale-110" : "scale-100"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
