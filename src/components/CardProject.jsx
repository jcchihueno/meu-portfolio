import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Palette, Code2 } from 'lucide-react';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, Category, id }) => {
  const isDesign = Category === "design";

  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert("O link de demonstração não está disponível");
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert("Os detalhes do projeto não estão disponíveis");
    }
  };

  return (
    <div className="group relative w-full">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-blue-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

        <div className="relative p-5 z-10">
          <div className="relative overflow-hidden rounded-lg aspect-[16/10]">
            <img
              src={Img}
              alt={Title}
              className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
            />
            {Category && (
              <div
                className={`absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                  isDesign
                    ? "bg-pink-500/20 text-pink-300 border-pink-500/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                }`}
              >
                {isDesign ? <Palette className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                <span>{isDesign ? "Design" : "Código"}</span>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              {Title}
            </h3>

            <p className="text-gray-300/80 text-sm leading-relaxed line-clamp-2">
              {Description}
            </p>

            <div className="pt-4 flex items-center justify-between">
              {!isDesign && (
                ProjectLink ? (
                  <a
                    href={ProjectLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLiveDemo}
                    className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="text-gray-500 text-sm">Demo Indisponível</span>
                )
              )}

              {id ? (
                <Link
                  to={`/project/${id}`}
                  onClick={handleDetails}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isDesign ? "ml-auto" : ""
                  }`}
                >
                  <span className="text-sm font-medium">{isDesign ? "Ver Caso" : "Detalhes"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-gray-500 text-sm">Detalhes Indisponíveis</span>
              )}
            </div>
          </div>

          <div className="absolute inset-0 border border-white/0 group-hover:border-blue-500/50 rounded-xl transition-colors duration-300 -z-50"></div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;