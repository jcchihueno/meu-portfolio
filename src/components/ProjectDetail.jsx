import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star, Palette,
  ChevronRight, Layers, Layout, Globe, Package, Cpu, Code,
  Images, Target, Lightbulb, Briefcase, Calendar,
} from "lucide-react";
import Swal from 'sweetalert2';

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const SkillBadge = ({ label }) => {
  const Icon = TECH_ICONS[label] || TECH_ICONS["default"];

  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {label}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => (
  <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
    <div className="relative mt-2">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
      <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:scale-125 transition-transform duration-300" />
    </div>
    <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">
      {feature}
    </span>
  </li>
);

const StatBox = ({ icon: Icon, value, label, colorClass }) => (
  <div className={`relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border ${colorClass.border} transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
    <div className={`${colorClass.bg} p-1.5 md:p-2 rounded-full`}>
      <Icon className={`${colorClass.text} w-4 h-4 md:w-6 md:h-6`} strokeWidth={1.5} />
    </div>
    <div className="flex-grow">
      <div className={`text-lg md:text-xl font-semibold ${colorClass.text}`}>{value}</div>
      <div className="text-[10px] md:text-xs text-gray-400">{label}</div>
    </div>
  </div>
);

const ProjectStats = ({ project, isDesign }) => {
  const primaryCount = isDesign ? (project?.Tools?.length || 0) : (project?.TechStack?.length || 0);
  const secondaryCount = isDesign ? (project?.Gallery?.length || 0) : (project?.Features?.length || 0);

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 opacity-50 blur-2xl z-0" />
      <StatBox
        icon={isDesign ? Palette : Code2}
        value={primaryCount}
        label={isDesign ? "Ferramentas" : "Tecnologias"}
        colorClass={{ bg: "bg-blue-500/20", text: "text-blue-200", border: "border-blue-500/20" }}
      />
      <StatBox
        icon={isDesign ? Images : Layers}
        value={secondaryCount}
        label={isDesign ? "Peças na Galeria" : "Funcionalidades"}
        colorClass={{ bg: "bg-cyan-500/20", text: "text-cyan-200", border: "border-cyan-500/20" }}
      />
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (!githubLink || githubLink === 'Private') {
    Swal.fire({
      icon: 'info',
      title: 'Código-fonte Privado',
      text: 'Este projeto tem o código-fonte privado.',
      confirmButtonText: 'Entendi',
      confirmButtonColor: '#3b82f6',
      background: '#030014',
      color: '#ffffff'
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const selectedProject = storedProjects.find((p) => String(p.id) === id);

    if (selectedProject) {
      const enhancedProject = {
        ...selectedProject,
        Features: selectedProject.Features || [],
        TechStack: selectedProject.TechStack || [],
        Tools: selectedProject.Tools || [],
        Gallery: selectedProject.Gallery || [],
        Github: selectedProject.Github || '',
      };
      setProject(enhancedProject);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">Carregando Projeto...</h2>
        </div>
      </div>
    );
  }

  const isDesign = project.Category === "design";

  return (
    <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          {/* Cabeçalho comum */}
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Voltar</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
              <span>Projetos</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-white/90 truncate">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            {/* Coluna esquerda: comum aos dois */}
            <div className="space-y-6 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                    isDesign
                      ? "bg-pink-500/10 text-pink-300 border-pink-500/30"
                      : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                  }`}>
                    {isDesign ? <Palette className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                    {isDesign ? "Design" : "Código"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                  {project.Title}
                </h1>
                <div className="relative h-1 w-16 md:w-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                  {project.Description}
                </p>
              </div>

              {isDesign && (project.Client || project.Year) && (
                <div className="flex flex-wrap gap-4 text-sm text-gray-300/80">
                  {project.Client && (
                    <span className="inline-flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-400" /> {project.Client}
                    </span>
                  )}
                  {project.Year && (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" /> {project.Year}
                    </span>
                  )}
                </div>
              )}

              <ProjectStats project={project} isDesign={isDesign} />

              {/* Botões: só em projetos de código */}
              {!isDesign && (
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {project.Link && (
                    <a
                      href={project.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 hover:from-blue-600/20 hover:to-cyan-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                    >
                      <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                      <span className="relative font-medium">Live Demo</span>
                    </a>
                  )}

                  <a
                    href={project.Github || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 hover:from-cyan-600/20 hover:to-blue-600/20 text-cyan-300 rounded-xl transition-all duration-300 border border-cyan-500/20 hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                    onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                  >
                    <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">Github</span>
                  </a>
                </div>
              )}

              {/* Ferramentas / Tech Stack */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  {isDesign ? <Palette className="w-4 h-4 md:w-5 md:h-5 text-blue-400" /> : <Code2 className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />}
                  {isDesign ? "Ferramentas Utilizadas" : "Tecnologias Utilizadas"}
                </h3>
                {(isDesign ? project.Tools : project.TechStack).length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {(isDesign ? project.Tools : project.TechStack).map((item, index) => (
                      <SkillBadge key={index} label={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-400 opacity-50">Nenhuma ferramenta adicionada.</p>
                )}
              </div>

              {/* Desafio & Solução — só design */}
              {isDesign && (project.Challenge || project.Solution) && (
                <div className="space-y-4">
                  {project.Challenge && (
                    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-5 md:p-6 border border-white/10 space-y-2">
                      <h3 className="text-base md:text-lg font-semibold text-white/90 flex items-center gap-2">
                        <Target className="w-4 h-4 md:w-5 md:h-5 text-blue-400" /> O Desafio
                      </h3>
                      <p className="text-sm md:text-base text-gray-300/90 leading-relaxed">{project.Challenge}</p>
                    </div>
                  )}
                  {project.Solution && (
                    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-5 md:p-6 border border-white/10 space-y-2">
                      <h3 className="text-base md:text-lg font-semibold text-white/90 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" /> A Solução
                      </h3>
                      <p className="text-sm md:text-base text-gray-300/90 leading-relaxed">{project.Solution}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Coluna direita: diverge por categoria */}
            <div className="space-y-6 md:space-y-10 animate-slideInRight">
              {isDesign ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                    <Images className="w-5 h-5 text-blue-400" /> Galeria
                  </h3>
                  {project.Gallery.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {project.Gallery.map((imgUrl, index) => (
                        <a
                          key={index}
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`relative rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/40 transition-all duration-300 group ${
                            index === 0 ? "col-span-2" : ""
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${project.Title} - peça ${index + 1}`}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 opacity-50">Nenhuma imagem adicionada na galeria.</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                      src={project.Img}
                      alt={project.Title}
                      className="w-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                    />
                  </div>

                  <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                    <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                      Principais Funcionalidades
                    </h3>
                    {project.Features.length > 0 ? (
                      <ul className="list-none space-y-2">
                        {project.Features.map((feature, index) => (
                          <FeatureItem key={index} feature={feature} />
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 opacity-50">Nenhuma funcionalidade adicionada.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.7s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.7s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.7s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default ProjectDetails;