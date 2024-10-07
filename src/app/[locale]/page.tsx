'use client';
import ParallaxEffect from '@/components/(element)/ParallaxEffect';
import Navbar from '@/components/(website)/Navbar';
import IntroSection from '@/components/(website)/IntroSection';
import GameplayDemo from '@/components/(website)/GameplayDemo';
import Nft from '@/components/(website)/Nft';
import InGameResource from '@/components/(website)/InGameResource';
import CoreTechnology from '@/components/(website)/CoreTechnology';
import TeamSection from '@/components/(website)/TeamSection';
import Roadmap from '@/components/(website)/Roadmap';
import FaqSection from '@/components/(website)/FaqSection';
import Footer from '@/components/(website)/Footer';

const Index = () => {
    return (
        <ParallaxEffect>
            <Navbar />
            <div className='website-container'>
                <div className='relative'>
                    <IntroSection />
                    <GameplayDemo />
                    <Nft />
                    <InGameResource />
                    <CoreTechnology />
                    <TeamSection />
                    <Roadmap />
                    <FaqSection />
                </div>
                <Footer />
            </div>
        </ParallaxEffect>
    );
};

export default Index;