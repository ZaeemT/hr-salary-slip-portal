import React from 'react';
import Aurora from './backgrounds/Aurora';
import RotatingText from './reactbitsui/RotatingText';
import { BlurFade } from './magicui/blur-fade';
import { InteractiveHoverButton } from './magicui/interactive-hover-button';

const Hero: React.FC = () => {
    return (
        <section className="relative w-screen h-screen overflow-hidden -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)]">
            <div className="absolute inset-0 z-0">
                <Aurora width="100vw" height="50vh"/>
            </div>
            <div className="relative z-10 font-monsterrat container mx-auto px-4 h-full flex flex-col justify-center">
              <BlurFade delay={0.25} inView>
                <h1 className="text-4xl font-bold text-white">Empowering Businesses with Cutting-<i>Edge</i> <br/> Tech Solutions</h1>
              </BlurFade>
              <BlurFade delay={0.5} inView>
                <span className="flex flex-wrap my-4 text-sm sm:text-base md:text-lg text-white/80 font-light items-center gap-2">
                  <p>Unlock</p>  
                  <RotatingText
                  texts={['innovation', 'scalability', 'security']}
                  mainClassName="px-2 sm:px-2 md:px-3 bg-[#00d8ff] text-black overflow-hidden justify-center rounded-lg"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                  /> 
                  <p className="text-sm sm:text-base md:text-lg">with our expert IT consulting.</p>
                </span>
                <InteractiveHoverButton className='my-8 mx-4 bg-foreground text-background font-inter font-bold'>Get Started</InteractiveHoverButton>
              </BlurFade>
            </div>
        </section>
    );
};

export default Hero;