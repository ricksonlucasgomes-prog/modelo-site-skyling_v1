import logoSkyling from './assets/LogoSkyling_Sem fundo.png';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Sun, Moon } from 'lucide-react';
import Lenis from '@studio-freight/lenis';

// Variantes de animação para Scrollytelling
const sectionFadeInUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: 'easeOut' },
};


// Componentes e Hooks Auxiliares

const Logo = ({ className, color }) => (
  <svg
    className={className}
    viewBox="0 0 240 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontFamily="Poppins, sans-serif"
      fontSize="38"
      fontWeight="800"
      fill={color || "#FFD700"}
      letterSpacing="-1"
    >
      <tspan>Skyling</tspan>
      <tspan dx="-2">.</tspan>
    </text>
  </svg>
);

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  useEffect(() => {
    const mouseMoveHandler = (event) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };
    window.addEventListener('mousemove', mouseMoveHandler);
    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  return mousePosition;
};

const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      style={{ position: 'relative' }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const TextReveal = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const words = children.split(' ');
  return (
    <p ref={ref} className={`flex flex-wrap leading-tight ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word = ({ children, range, progress }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mr-2 mt-2 md:mr-3 md:mt-3">
      <span className="absolute opacity-10">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

const TiltCard = ({ children, className, onMouseEnter, onMouseLeave }) => {
    const ref = useRef(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const onMouseMove = (e) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { width, height, left, top } = ref.current.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) / (width / 2);
        const y = (clientY - (top + height / 2)) / (height / 2);
        setRotate({ x: y * 10, y: x * -10 });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
        if(onMouseLeave) onMouseLeave();
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                rotateX: useSpring(rotate.x, { stiffness: 300, damping: 20 }),
                rotateY: useSpring(rotate.y, { stiffness: 300, damping: 20 }),
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};


// Seções Principais da Página
const Header = ({ setCursorVariant, theme, toggleTheme }) => {
  const navItems = ['Início', 'Sobre Nós', 'Serviços', 'Contato'];
  return (
    <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 50, delay: 1 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3 md:px-8 md:py-4 bg-[#F5F5F5]/50 dark:bg-[#0D0D0D]/50 backdrop-blur-sm"
    >
      <div 
        className="cursor-none"
        onMouseEnter={() => setCursorVariant('text')}
        onMouseLeave={() => setCursorVariant('default')}
      >
        <img src={logoSkyling} alt="Logo da Agência Skyling" className="h-16 w-16 md:h-20 md:w-20" />
      </div>
      <nav className="flex items-center space-x-4 md:space-x-8">
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Magnetic key={item}>
              <a 
                href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(' ', '-')}`} 
                className="text-[#0D0D0D] dark:text-[#F5F5F5] hover:text-[#0057FF] dark:hover:text-[#FFD700] transition-colors duration-300 cursor-none"
                onMouseEnter={() => setCursorVariant('link')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {item}
              </a>
            </Magnetic>
          ))}
        </div>
        <Magnetic>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#0D0D0D] dark:text-[#F5F5F5] hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-none"
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </Magnetic>
      </nav>
    </motion.header>
  );
};

const HeroSection = ({ setCursorVariant }) => {
  const { x: mouseX, y: mouseY } = useMousePosition();
  
  const maskSize = 200;

  return (
    <section id="inicio" className="h-screen w-full bg-[#F5F5F5] dark:bg-[#0D0D0D] flex flex-col justify-center items-center text-center relative overflow-hidden">
        <motion.div 
         className="absolute inset-0 bg-gradient-to-br from-[#0057FF]/20 via-transparent to-transparent"
         style={{
            maskImage: `radial-gradient(circle ${maskSize}px at ${mouseX}px ${mouseY}px, black 20%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle ${maskSize}px at ${mouseX}px ${mouseY}px, black 20%, transparent 100%)`,
         }}
        />
      <div className="z-10 p-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onMouseEnter={() => setCursorVariant('text')}
          onMouseLeave={() => setCursorVariant('default')}
          className="mb-4"
        >
         {/* ALTERAÇÃO: Tamanho do logo corrigido para um valor grande e seguro */}
         <img src={logoSkyling} alt="Logo da Agência Skyling" className="h-52 w-52 sm:h-64 sm:w-64 md:w-96 md:h-96" />
        </motion.div>
        <motion.h2 
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0057FF] mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onMouseEnter={() => setCursorVariant('text')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Marketing
        </motion.h2>
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-sm md:max-w-2xl mx-auto mt-6 text-[#0D0D0D]/80 dark:text-[#F5F5F5]/80 text-base sm:text-lg md:text-xl mb-8"
        >
            Marketing completo para transformar sua marca em uma referência. Vamos começar?
        </motion.p>
        <Magnetic>
          <motion.button
            className="bg-[#FFD700] text-[#0D0D0D] font-bold py-3 px-6 text-base md:py-4 md:px-8 md:text-lg rounded-full shadow-lg shadow-[#FFD700]/20 cursor-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Vamos Começar
          </motion.button>
        </Magnetic>
      </div>
    </section>
  );
};

const ProblemSolutionSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section ref={ref} id="problema-solucao" className="py-16 md:py-24 lg:py-32 bg-[#F5F5F5] dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F5F5F5] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <motion.div style={{ y }}>
          <TextReveal className="text-3xl sm:text-4xl md:text-6xl font-bold text-center max-w-4xl mx-auto">
            Sua marca merece mais que uma presença online — merece resultados reais.
          </TextReveal>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 mt-12 md:gap-12 md:mt-24 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <h3 className="text-2xl font-bold text-[#0057FF] mb-4">O Problema</h3>
                <p className="text-base md:text-lg text-[#0D0D0D]/80 dark:text-[#F5F5F5]/80 leading-relaxed">
                    Muitas marcas lutam para se destacar. Elas investem em sites e redes sociais, mas veem pouco retorno. Estratégias genéricas, mensagens inconsistentes e a falta de decisões baseadas em dados levam à estagnação do crescimento e a oportunidades perdidas.
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            >
                <h3 className="text-2xl font-bold text-[#0057FF] mb-4">A Solução</h3>
                <p className="text-base md:text-lg text-[#0D0D0D]/80 dark:text-[#F5F5F5]/80 leading-relaxed">
                    Nós fornecemos um motor de marketing holístico. Ao combinar planejamento estratégico, execução criativa e otimização contínua, transformamos sua presença online em uma ferramenta poderosa para prospecção, engajamento e conversão, entregando impacto mensurável.
                </p>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = ({ setCursorVariant }) => {
  const steps = [
    { title: "Diagnóstico", description: "Mergulhamos fundo em sua marca, mercado e concorrentes para identificar os principais desafios e oportunidades." },
    { title: "Planejamento Estratégico", description: "Criamos um roteiro de marketing personalizado e orientado por dados, adaptado aos seus objetivos de negócio." },
    { title: "Execução", description: "Nossa equipe de especialistas dá vida à estratégia com conteúdo atraente, campanhas direcionadas e execução impecável." },
    { title: "Otimização", description: "Monitoramos continuamente o desempenho, analisamos os resultados e refinamos nossa abordagem para maximizar seu ROI." },
  ];

  return (
    <section id="como-funciona" className="py-16 md:py-24 lg:py-32 bg-[#0D0D0D] dark:bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0057FF]/30 to-transparent"></div>
      <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        <motion.h2 {...sectionFadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#F5F5F5] mb-12 md:mb-16">Como Funciona</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <TiltCard 
                className="bg-[#F5F5F5]/5 dark:bg-white/5 backdrop-blur-lg p-8 rounded-2xl h-full border border-white/10 shadow-xl cursor-none"
                onMouseEnter={() => setCursorVariant('text')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <div style={{ transform: "translateZ(40px)" }}>
                    <div className="text-3xl font-bold text-[#FFD700] mb-4">0{index + 1}</div>
                    <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4">{step.title}</h3>
                    <p className="text-[#F5F5F5]/70">{step.description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialProofSection = ({ setCursorVariant }) => {
  const testimonials = [
    { name: "João Silva, CEO da Inova S.A.", quote: "A Skyling transformou nossa presença digital. A abordagem estratégica deles dobrou nossos leads em apenas três meses. Um verdadeiro parceiro de crescimento." },
    { name: "Maria Souza, Fundadora da Criativa & Cia.", quote: "A criatividade e a execução da equipe são inigualáveis. Eles entenderam perfeitamente a visão da nossa marca e entregaram resultados excepcionais." },
    { name: "Carlos Pereira, Diretor de Marketing", quote: "Trabalhar com a Skyling foi como ter uma equipe interna de especialistas. Seus insights e otimizações foram inestimáveis." },
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }
  
  const handlePrev = () => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }

  return (
    <motion.section {...sectionFadeInUp} id="prova-social" className="py-16 md:py-24 lg:py-32 bg-[#F5F5F5] dark:bg-[#0D0D0D]">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#0D0D0D] dark:text-[#F5F5F5] mb-12 md:mb-16">O Que Nossos Clientes Dizem</h2>
        <div className="relative max-w-3xl mx-auto h-80 sm:h-72 md:h-64 flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
                <motion.div
                    key={index}
                    className="absolute w-full p-6 md:p-8 bg-[#0D0D0D] dark:bg-[#1a1a1a] rounded-2xl shadow-2xl"
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: index === currentIndex ? 1 : 0, x: index === currentIndex ? 0 : (index > currentIndex ? 50 : -50), scale: index === currentIndex ? 1 : 0.95 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                    <p className="text-base md:text-xl text-[#F5F5F5] italic">"{testimonial.quote}"</p>
                    <p className="text-right text-[#FFD700] font-bold mt-6">- {testimonial.name}</p>
                </motion.div>
            ))}
        </div>
        <div className="flex justify-center mt-8 space-x-4">
            <Magnetic>
                <button 
                  onClick={handlePrev} 
                  className="bg-[#0D0D0D] dark:bg-white/10 text-[#F5F5F5] p-3 rounded-full hover:bg-[#0057FF] transition-colors cursor-none"
                  onMouseEnter={() => setCursorVariant('link')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
            </Magnetic>
            <Magnetic>
                <button 
                  onClick={handleNext} 
                  className="bg-[#0D0D0D] dark:bg-white/10 text-[#F5F5F5] p-3 rounded-full hover:bg-[#0057FF] transition-colors cursor-none"
                  onMouseEnter={() => setCursorVariant('link')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </Magnetic>
        </div>
      </div>
    </motion.section>
  );
};

const FinalCTASection = ({ setCursorVariant }) => {
  return (
    <section id="cta-final" className="py-20 md:py-28 lg:py-40 bg-gradient-to-t from-[#0D0D0D] to-[#0057FF] text-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <TextReveal className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-[#F5F5F5] max-w-4xl mx-auto">
          Pronto para fazer sua marca decolar?
        </TextReveal>
        <div className="mt-12">
          <Magnetic>
            <motion.button
              className="bg-[#FFD700] text-[#0D0D0D] font-bold py-4 px-8 text-lg md:py-6 md:px-12 md:text-xl rounded-full shadow-lg shadow-[#FFD700]/30 cursor-none"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Vamos Conversar
            </motion.button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

// Páginas de Exemplo
const AboutUsPage = ({ setCursorVariant }) => (
    <motion.div {...sectionFadeInUp} id="sobre-nos" className="min-h-screen bg-[#F5F5F5] dark:bg-[#0D0D0D] py-24 px-4 sm:px-6 md:px-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0D0D0D] dark:text-[#F5F5F5] mb-8">Sobre Nós</h1>
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold text-[#0057FF] mb-4">Nossa Missão</h2>
                <p className="text-lg text-[#0D0D0D]/80 dark:text-[#F5F5F5]/80 max-w-3xl">Texto institucional sobre a missão da empresa, focado em impulsionar o sucesso do cliente através de inovação e marketing estratégico. Este texto seria animado com um efeito de revelação.</p>
            </div>
            <div>
                <h2 className="text-3xl font-bold text-[#0057FF] mb-4">Nossos Valores</h2>
                <ul className="list-disc list-inside text-lg text-[#0D0D0D]/80 dark:text-[#F5F5F5]/80 space-y-2">
                    <li>Parceria: Nós temos sucesso quando você tem sucesso.</li>
                    <li>Inovação: Sempre expandindo os limites do que é possível.</li>
                    <li>Integridade: Transparentes, honestos e orientados por dados.</li>
                    <li>Excelência: Comprometidos em entregar o trabalho da mais alta qualidade.</li>
                </ul>
            </div>
             <div>
                <h2 className="text-3xl font-bold text-[#0057FF] mb-4">Por Trás da Skyling</h2>
                <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-4xl">
                    <TiltCard 
                      className="bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl shadow-lg cursor-none"
                      onMouseEnter={() => setCursorVariant('text')}
                      onMouseLeave={() => setCursorVariant('default')}
                    >
                        <div style={{ transform: "translateZ(20px)" }}>
                            <h3 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F5F5F5]">Fundador 1</h3>
                            <p className="text-[#0D0D0D]/70 dark:text-[#F5F5F5]/70 mt-2">Breve biografia sobre o fundador, sua experiência e visão.</p>
                        </div>
                    </TiltCard>
                    <TiltCard 
                      className="bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl shadow-lg cursor-none"
                      onMouseEnter={() => setCursorVariant('text')}
                      onMouseLeave={() => setCursorVariant('default')}
                    >
                         <div style={{ transform: "translateZ(20px)" }}>
                            <h3 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F5F5F5]">Fundador 2</h3>
                            <p className="text-[#0D0D0D]/70 dark:text-[#F5F5F5]/70 mt-2">Breve biografia sobre o segundo fundador, seu histórico e papel.</p>
                        </div>
                    </TiltCard>
                </div>
            </div>
        </div>
    </motion.div>
);

const ServicesPage = ({ setCursorVariant }) => {
    const services = [
        { title: "Planejamento Estratégico", description: "Estratégias de marketing de funil completo." },
        { title: "Tráfego Pago", description: "Anúncios no Google, Meta e LinkedIn." },
        { title: "Edição de Vídeo, VFX & 3D", description: "Conteúdo visual de alto impacto." },
        { title: "Mídias Sociais", description: "Crescimento orgânico e gestão de comunidade." },
        { title: "Design Gráfico", description: "Branding e identidade visual." },
        { title: "Desenvolvimento de Sites", description: "Sites modernos, rápidos e responsivos." },
    ];
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div id="servicos" className="min-h-screen bg-[#0D0D0D] dark:bg-black py-24 px-4 sm:px-6 md:px-12">
            <motion.h1 {...sectionFadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-[#F5F5F5] mb-16">Nossos Serviços</motion.h1>
            <div className="max-w-4xl mx-auto space-y-4">
                {services.map((service, index) => (
                    <motion.div 
                        key={index} 
                        className="border border-white/20 rounded-xl overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <button 
                            className="w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-colors cursor-none"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            onMouseEnter={() => setCursorVariant('link')}
                            onMouseLeave={() => setCursorVariant('default')}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">{service.title}</h2>
                            <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }}>
                               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </motion.div>
                        </button>
                        <motion.div
                            initial={false}
                            animate={{ height: openIndex === index ? 'auto' : 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-6 pt-0 text-[#F5F5F5]/80">
                                <p>{service.description} Mais detalhes sobre benefícios, preços e um CTA específico iriam aqui.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const ContactPage = ({ setCursorVariant }) => (
    <motion.div {...sectionFadeInUp} id="contato" className="min-h-screen bg-[#F5F5F5] dark:bg-[#0D0D0D] py-24 px-4 sm:px-6 md:px-12 flex items-center">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-[#0D0D0D] dark:text-[#F5F5F5]">Entre em Contato</h1>
                <p className="text-lg text-[#0D0D0D]/70 dark:text-[#F5F5F5]/70 mt-4">Tem um projeto em mente ou só quer dizer olá? Adoraríamos ouvir de você.</p>
                <div className="space-y-6 mt-8">
                    <a href="mailto:skylingagencia@gmail.com" className="flex items-center space-x-4 text-lg group cursor-none" onMouseEnter={() => setCursorVariant('link')} onMouseLeave={() => setCursorVariant('default')}>
                        <Mail className="text-[#0057FF] group-hover:text-[#FFD700] transition-colors" />
                        <span className="text-[#0D0D0D] dark:text-[#F5F5F5] group-hover:text-[#0057FF] dark:group-hover:text-[#FFD700] transition-colors">skylingagencia@gmail.com</span>
                    </a>
                     <a href="#" className="flex items-center space-x-4 text-lg group cursor-none" onMouseEnter={() => setCursorVariant('link')} onMouseLeave={() => setCursorVariant('default')}>
                        <Instagram className="text-[#0057FF] group-hover:text-[#FFD700] transition-colors" />
                        <span className="text-[#0D0D0D] dark:text-[#F5F5F5] group-hover:text-[#0057FF] dark:group-hover:text-[#FFD700] transition-colors">@skylingagencia</span>
                    </a>
                    <div className="flex items-center space-x-4 text-lg group cursor-none" onMouseEnter={() => setCursorVariant('link')} onMouseLeave={() => setCursorVariant('default')}>
                        <Phone className="text-[#0057FF] group-hover:text-[#FFD700] transition-colors" />
                        <span className="text-[#0D0D0D] dark:text-[#F5F5F5] group-hover:text-[#0057FF] dark:group-hover:text-[#FFD700] transition-colors">(62) 91234-5678</span>
                    </div>
                    <div className="flex items-center space-x-4 text-lg group cursor-none" onMouseEnter={() => setCursorVariant('link')} onMouseLeave={() => setCursorVariant('default')}>
                        <MapPin className="text-[#0057FF] group-hover:text-[#FFD700] transition-colors" />
                        <span className="text-[#0D0D0D] dark:text-[#F5F5F5] group-hover:text-[#0057FF] dark:group-hover:text-[#FFD700] transition-colors">Goiânia, GO, Brasil</span>
                    </div>
                </div>
            </div>
            <form className="bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl space-y-6">
                <input type="text" placeholder="Nome" className="w-full p-4 bg-[#F5F5F5] dark:bg-[#2a2a2a] text-[#0D0D0D] dark:text-[#F5F5F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0057FF] cursor-none" onMouseEnter={() => setCursorVariant('text')} onMouseLeave={() => setCursorVariant('default')} />
                <input type="email" placeholder="E-mail" className="w-full p-4 bg-[#F5F5F5] dark:bg-[#2a2a2a] text-[#0D0D0D] dark:text-[#F5F5F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0057FF] cursor-none" onMouseEnter={() => setCursorVariant('text')} onMouseLeave={() => setCursorVariant('default')} />
                <input type="tel" placeholder="Telefone" className="w-full p-4 bg-[#F5F5F5] dark:bg-[#2a2a2a] text-[#0D0D0D] dark:text-[#F5F5F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0057FF] cursor-none" onMouseEnter={() => setCursorVariant('text')} onMouseLeave={() => setCursorVariant('default')} />
                <textarea placeholder="Mensagem" rows="4" className="w-full p-4 bg-[#F5F5F5] dark:bg-[#2a2a2a] text-[#0D0D0D] dark:text-[#F5F5F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0057FF] cursor-none" onMouseEnter={() => setCursorVariant('text')} onMouseLeave={() => setCursorVariant('default')} ></textarea>
                <Magnetic>
                    <button 
                        type="submit" 
                        className="w-full bg-[#FFD700] text-[#0D0D0D] font-bold py-4 rounded-lg text-lg cursor-none"
                        onMouseEnter={() => setCursorVariant('link')}
                        onMouseLeave={() => setCursorVariant('default')}
                    >
                        Quero escalar meu negócio!
                    </button>
                </Magnetic>
            </form>
        </div>
    </motion.div>
);


// Componente Principal da Aplicação
function App() {
  const [theme, setTheme] = useState('dark');
  const { x, y } = useMousePosition();
  const [cursorVariant, setCursorVariant] = useState('default');

  // CÓDIGO PARA CAPTURAR O IP
  const [visitorIp, setVisitorIp] = useState('');

  useEffect(() => {
    // Função para buscar o IP
    const fetchIp = async () => {
      try {
        const response = await fetch('/api/getIp'); // Chama a nossa função de servidor
        const data = await response.json();
        setVisitorIp(data.ip);
        console.log("IP do Visitante:", data.ip); // Mostra o IP no console do navegador
      } catch (error) {
        console.error("Erro ao buscar o IP:", error);
      }
    };

    fetchIp();
  }, []); // O array vazio [] faz com que rode apenas uma vez, quando o site carrega

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme('dark');
      }
    } catch (error) {
      console.error("Não foi possível aceder ao localStorage. A usar o tema escuro por defeito.", error);
      setTheme('dark');
    }
  }, []);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error("Não foi possível guardar o tema no localStorage.", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const variants = {
    default: {
      height: 24,
      width: 24,
      x: x - 12,
      y: y - 12,
      backgroundColor: theme === 'dark' ? '#FFD700' : '#0057FF',
      mixBlendMode: 'difference',
    },
    text: {
      height: 100,
      width: 100,
      x: x - 50,
      y: y - 50,
      backgroundColor: theme === 'dark' ? '#F5F5F5' : '#0D0D0D',
      mixBlendMode: 'difference',
    },
    link: {
      height: 50,
      width: 50,
      x: x - 25,
      y: y - 25,
      backgroundColor: theme === 'dark' ? '#FFD700' : '#0057FF',
      mixBlendMode: 'difference',
    }
  };

  // Efeito para inicializar a rolagem suave usando a biblioteca Lenis
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <div className="bg-[#F5F5F5] dark:bg-[#0D0D0D] font-sans text-[#0D0D0D] dark:text-[#F5F5F5] cursor-none transition-colors duration-300">
      <motion.div
        className="fixed top-0 left-0 h-6 w-6 rounded-full z-[9999] pointer-events-none hidden lg:block"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      
      <Header setCursorVariant={setCursorVariant} theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        <HeroSection setCursorVariant={setCursorVariant} />
        <ProblemSolutionSection />
        <HowItWorksSection setCursorVariant={setCursorVariant} />
        <SocialProofSection setCursorVariant={setCursorVariant} />
        <FinalCTASection setCursorVariant={setCursorVariant} />
        
        <AboutUsPage setCursorVariant={setCursorVariant} />
        <ServicesPage setCursorVariant={setCursorVariant} />
        <ContactPage setCursorVariant={setCursorVariant} />
      </main>
    </div>
  );
}

export default App;
